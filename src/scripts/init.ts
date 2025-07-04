import mongoose from 'mongoose';
import readline from 'readline';
import { CONFIG } from '@/config/env.config';
import { User } from '@/models/User.model';

// Crear interfaz para input del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Función para pedir confirmación
const askConfirmation = (question: string): Promise<boolean> => {
  return new Promise(resolve => {
    rl.question(`${question} (y/N): `, answer => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes' || answer === '1');
    });
  });
};

/**
 * Validar que el entorno sea de desarrollo
 */
const validateEnvironment = (): void => {
  if (CONFIG.isProduction || CONFIG.nodeEnv === 'production') {
    console.log('🌍 Entorno actual:', CONFIG.nodeEnv);
    console.log('🚨 Este script solo funciona en DESARROLLO');
    process.exit(1);
  }
};

/**
 * Conectar a la base de datos
 */
const connectToDatabase = async (): Promise<void> => {
  const dbName = 'bodegon_local';
  console.log(`🚀 Inicializando base de datos ${dbName}...`);
  console.log('🔄 Preparando base de datos con usuario administrador inicial...');

  await mongoose.connect(CONFIG.mongodbUri!, {
    serverSelectionTimeoutMS: 5000,
  });
};

/**
 * Analizar el estado actual de la base de datos
 */
const analyzeDatabaseState = async (): Promise<{ collections: any[]; hasUsers: boolean }> => {
  const collections = (await mongoose.connection.db?.listCollections().toArray()) || [];
  const userCount = await User.countDocuments();

  if (collections.length === 0) {
    console.log('✨ Base de datos completamente vacía');
  } else {
    console.log(`📊 Encontradas ${collections.length} colecciones existentes:`);
    collections.forEach(col => console.log(`   - ${col.name}`));

    if (userCount > 0) {
      console.log(`👥 ${userCount} usuarios ya existentes en la base de datos`);
    }
  }

  return { collections, hasUsers: userCount > 0 };
};

/**
 * Solicitar confirmación para reinicialización
 */
const requestUserConfirmation = async (hasUsers: boolean): Promise<void> => {
  console.log('\n🎯 INICIALIZACIÓN DE BASE DE DATOS');
  console.log('Esta operación realizará:');

  if (hasUsers) {
    console.log('1. 🗑️  ELIMINARÁ todos los datos existentes');
    console.log('2. 👤 Creará un usuario administrador inicial');
    console.log('');
    console.log('⚠️  ATENCIÓN: Se perderán todos los datos actuales');
  } else {
    console.log('1. 🧹 Limpiará cualquier dato residual');
    console.log('2. 👤 Creará un usuario administrador inicial');
    console.log('');
    console.log('ℹ️  La base de datos parece estar vacía, operación segura');
  }

  console.log('📝 Usuario administrador que se creará:');
  console.log('   📧 Email: admin@mail.com');
  console.log('   🔐 Password: admin123');
  console.log('   👤 Nombre: Usuario Root');
  console.log('   📱 Teléfono: 1123456789');
  console.log('   🔑 Rol: admin');

  const confirmed = await askConfirmation('¿Quieres continuar con la inicialización?');

  if (!confirmed) {
    console.log('❌ Inicialización cancelada por el usuario');
    rl.close();
    process.exit(0);
  }

  rl.close();
};

/**
 * Limpiar toda la base de datos
 */
const cleanDatabase = async (collections: any[]): Promise<void> => {
  if (collections.length === 0) {
    console.log('✅ Base de datos ya está vacía, continuando...');
    return;
  }

  console.log('\n🧹 Limpiando base de datos...');

  try {
    // Método principal: eliminar toda la base de datos
    await mongoose.connection.db?.dropDatabase();
    console.log('✅ Base de datos limpiada completamente');
  } catch (error) {
    // Método de respaldo: eliminar colección por colección
    console.log('⚠️  Usando método alternativo de limpieza...');
    await cleanCollectionsIndividually(collections);
  }
};

/**
 * Limpiar colecciones individualmente (método de respaldo)
 */
const cleanCollectionsIndividually = async (collections: any[]): Promise<void> => {
  for (const collection of collections) {
    try {
      await mongoose.connection.db?.collection(collection.name).drop();
      console.log(`   ✅ ${collection.name} eliminada`);
    } catch (collectionError) {
      console.log(`   ❌ Error eliminando ${collection.name}`);
    }
  }
};

/**
 * Crear usuario administrador inicial
 */
const createRootAdminUser = async (): Promise<void> => {
  console.log('\n👤 Creando usuario administrador inicial...');

  try {
    const rootAdmin = new User({
      username: 'admin@mail.com',
      password: 'admin123',
      firstName: 'Usuario',
      lastName: 'Root',
      phone: '1123456789',
      role: 'admin',
    });

    await rootAdmin.save();

    console.log('✅ Usuario administrador creado exitosamente');
    console.log('   📧 Email: admin@mail.com');
    console.log('   🔐 Password: admin123');
    console.log('   👤 Nombre: Usuario Root');
    console.log('   📱 Teléfono: 1123456789');
    console.log('   🔑 Rol: admin');
  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error);
    throw error;
  }
};

/**
 * Verificar el resultado de la inicialización
 */
const verifyInitializationResult = async (): Promise<void> => {
  const userCount = await User.countDocuments();
  const adminCount = await User.countDocuments({ role: 'admin' });

  console.log('');
  console.log('🎉 ¡INICIALIZACIÓN COMPLETADA EXITOSAMENTE!');
  console.log(`✅ ${userCount} usuario creado en la base de datos`);
  console.log(`👑 ${adminCount} administrador disponible`);
  console.log('');
  console.log('🔐 Credenciales de acceso:');
  console.log('   📧 Email: admin@mail.com');
  console.log('   🔑 Password: admin123');
  console.log('');
  console.log('🚀 Base de datos inicializada y lista para usar');
  console.log('💡 Ahora puedes iniciar sesión y comenzar a usar el sistema');
  console.log('');
  console.log('🔄 Próximos pasos recomendados:');
  console.log('   1. Iniciar el servidor: npm run dev');
  console.log('   2. Acceder a /api-docs para ver la documentación');
  console.log('   3. Hacer login con las credenciales mostradas arriba');
};

/**
 * Limpiar recursos y cerrar conexiones
 */
const cleanup = async (): Promise<void> => {
  await mongoose.connection.close();
  console.log('\n🔌 Conexión cerrada');
};

/**
 * Función principal del script de inicialización
 */
const init = async (): Promise<void> => {
  try {
    // 1. Validaciones iniciales
    validateEnvironment();

    // 2. Conexión a base de datos
    await connectToDatabase();

    // 3. Analizar estado actual
    const { collections, hasUsers } = await analyzeDatabaseState();

    // 4. Solicitar confirmación
    await requestUserConfirmation(hasUsers);

    // 5. Limpiar base de datos
    await cleanDatabase(collections);

    // 6. Crear usuario administrador inicial
    await createRootAdminUser();

    // 7. Verificar resultado
    await verifyInitializationResult();
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    if (rl) rl.close();
    process.exit(1);
  } finally {
    await cleanup();
    process.exit(0);
  }
};

// Ejecutar el script si es llamado directamente
if (require.main === module) {
  init();
}

export default init;
