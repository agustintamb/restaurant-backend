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
  console.log(`💥 Limpieza total rápida de ${dbName}...`);
  console.log('⚠️  Eliminando TODA la base de datos de desarrollo...');

  await mongoose.connect(CONFIG.mongodbUri!, {
    serverSelectionTimeoutMS: 5000,
  });
};

/**
 * Analizar el estado actual de la base de datos
 */
const analyzeDatabaseState = async (): Promise<any[]> => {
  const collections = (await mongoose.connection.db?.listCollections().toArray()) || [];

  if (collections.length === 0) {
    console.log('✨ Base de datos ya está completamente vacía');
    // No salir aquí, continuar para crear el usuario admin
  } else {
    console.log(`🗑️  Encontradas ${collections.length} colecciones:`);
    collections.forEach(col => console.log(`   - ${col.name}`));
  }

  return collections;
};

/**
 * Solicitar confirmación del usuario
 */
const requestUserConfirmation = async (): Promise<void> => {
  console.log('\n⚠️  Esta operación eliminará TODOS los datos de desarrollo');
  const confirmed = await askConfirmation('¿Estás seguro de que quieres continuar?');

  if (!confirmed) {
    console.log('❌ Operación cancelada por el usuario');
    rl.close();
    process.exit(0);
  }

  rl.close();
};

/**
 * Ejecutar limpieza completa de la base de datos
 */
const executeCompleteWipe = async (collections: any[]): Promise<void> => {
  if (collections.length === 0) {
    console.log('✅ Base de datos ya está vacía');
    return;
  }

  console.log('\n🚀 Procediendo con la limpieza...');

  try {
    // Método principal: eliminar toda la base de datos
    await mongoose.connection.db?.dropDatabase();
    console.log('✅ Base de datos eliminada completamente');
  } catch (error) {
    // Método de respaldo: eliminar colección por colección
    console.log('⚠️  Usando método alternativo...');
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
 * Crear usuario administrador por defecto
 */
const createAdminUser = async (): Promise<void> => {
  console.log('\n👤 Creando usuario administrador...');

  try {
    const adminUser = new User({
      username: 'admin@mail.com',
      password: 'admin123',
      firstName: 'Usuario',
      lastName: 'Administrador',
      phone: '1123456789',
      role: 'admin',
    });

    await adminUser.save();
    console.log('✅ Usuario administrador creado exitosamente');
    console.log('   📧 Email: admin@mail.com');
    console.log('   🔐 Password: admin123');
    console.log('   👤 Nombre: Usuario Administrador');
    console.log('   📱 Teléfono: 1123456789');
  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error);
    throw error;
  }
};

/**
 * Verificar el resultado de la limpieza
 */
const verifyCleanupResult = async (): Promise<void> => {
  const remainingCollections = (await mongoose.connection.db?.listCollections().toArray()) || [];

  console.log('');
  console.log('💀 ¡LIMPIEZA TOTAL COMPLETADA!');

  if (remainingCollections.length <= 1) {
    // <= 1 porque ahora tenemos la colección de users
    console.log('✅ Base de datos reiniciada correctamente');
    console.log('👤 Usuario administrador listo para usar');
    console.log('🔄 Base de datos preparada para desarrollo');
  } else {
    console.log(`⚠️  ${remainingCollections.length} colecciones encontradas:`);
    remainingCollections.forEach(col => console.log(`   - ${col.name}`));
  }
};

/**
 * Limpiar recursos y cerrar conexiones
 */
const cleanup = async (): Promise<void> => {
  await mongoose.connection.close();
  console.log('\n🔌 Conexión cerrada');
};

/**
 * Función principal del script de limpieza
 */
const wipe = async (): Promise<void> => {
  try {
    // 1. Validaciones iniciales
    validateEnvironment();

    // 2. Conexión a base de datos
    await connectToDatabase();

    // 3. Analizar estado actual
    const collections = await analyzeDatabaseState();

    // 4. Solicitar confirmación (solo si hay colecciones)
    if (collections.length > 0) {
      await requestUserConfirmation();
    }

    // 5. Ejecutar limpieza
    await executeCompleteWipe(collections);

    // 6. Crear usuario administrador
    await createAdminUser();

    // 7. Verificar resultado
    await verifyCleanupResult();
  } catch (error) {
    console.error('❌ Error durante la limpieza total:', error);
    if (rl) rl.close();
    process.exit(1);
  } finally {
    await cleanup();
    process.exit(0);
  }
};

// Ejecutar el script si es llamado directamente
if (require.main === module) {
  wipe();
}

export default wipe;
