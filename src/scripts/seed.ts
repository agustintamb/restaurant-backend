import mongoose from 'mongoose';
import readline from 'readline';
import { CONFIG } from '@/config/env.config';
import { User } from '@/models/User.model';
import { createAllergenService } from '@/services/allergen.service';
import { createIngredientService } from '@/services/ingredient.service';
import { loginService } from '@/services/auth.service';

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
  console.log(`🌱 Preparando datos de prueba en ${dbName}...`);
  console.log('🔄 Limpieza y creación de datos iniciales para desarrollo...');

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
    console.log('✨ Base de datos ya está vacía');
  } else {
    console.log(`🗑️  Encontradas ${collections.length} colecciones existentes:`);
    collections.forEach(col => console.log(`   - ${col.name}`));
  }

  return collections;
};

/**
 * Solicitar confirmación para limpieza y seed
 */
const requestUserConfirmation = async (collections: any[]): Promise<void> => {
  if (collections.length > 0) {
    console.log('\n⚠️  LIMPIEZA Y DATOS DE PRUEBA');
    console.log('Esta operación realizará:');
    console.log('1. 🗑️  ELIMINARÁ todos los datos existentes');
    console.log('2. 📝 Creará datos de prueba frescos:');
  } else {
    console.log('\n📝 CREACIÓN DE DATOS DE PRUEBA');
    console.log('Esta operación creará datos de prueba frescos:');
  }

  console.log('   - 5 usuarios administradores');
  console.log(`   - ${ALLERGENS.length} alérgenos`);
  console.log(`   - ${INGREDIENTS.length} ingredientes`);

  const confirmed = await askConfirmation('¿Quieres continuar?');

  if (!confirmed) {
    console.log('❌ Operación cancelada por el usuario');
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
    console.log('✅ Base de datos eliminada completamente');
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
 * Datos de prueba para usuarios
 */
const SAMPLE_USERS = [
  {
    username: 'admin@mail.com',
    password: 'admin123',
    firstName: 'Usuario',
    lastName: 'Administrador',
    phone: '1123456789',
    role: 'admin' as const,
  },
  {
    username: 'carlos@mail.com',
    password: 'carlos123',
    firstName: 'Carlos',
    lastName: 'García',
    phone: '1134567890',
    role: 'admin' as const,
  },
  {
    username: 'maria@mail.com',
    password: 'maria123',
    firstName: 'María',
    lastName: 'Rodríguez',
    phone: '1145678901',
    role: 'admin' as const,
  },
  {
    username: 'juan@mail.com',
    password: 'juan123',
    firstName: 'Juan',
    lastName: 'López',
    phone: '1156789012',
    role: 'admin' as const,
  },
  {
    username: 'ana@mail.com',
    password: 'ana123',
    firstName: 'Ana',
    lastName: 'Martínez',
    phone: '1167890123',
    role: 'admin' as const,
  },
];

/**
 * Datos de alérgenos
 */
const ALLERGENS = ['Gluten', 'Huevo', 'Lácteos', 'Moluscos', 'Pescado', 'Frutos secos', 'Sulfitos'];

/**
 * Datos de ingredientes
 */
const INGREDIENTS = [
  'Carne picada',
  'Cebolla',
  'Huevo duro',
  'Aceitunas',
  'Especias',
  'Queso provolone',
  'Orégano',
  'Aceite de oliva',
  'Pimienta',
  'Sal',
  'Matambre',
  'Salsa de tomate',
  'Queso mozzarella',
  'Jamón crudo',
  'Salamín',
  'Queso azul',
  'Pan casero',
  'Calamar',
  'Harina',
  'Huevo',
  'Limón',
  'Perejil',
  'Ajo',
  'Mollejas',
  'Sal gruesa',
  'Carne de cerdo',
  'Carne vacuna',
  'Pimiento morrón',
  'Atún',
  'Mayonesa',
  'Tomate',
  'Lechuga',
  'Zanahoria',
  'Arvejas',
  'Rúcula',
  'Queso',
  'Lechuga romana',
  'Pollo',
  'Crutones',
  'Queso parmesano',
  'Aderezo Caesar',
  'Manzana',
  'Apio',
  'Nueces',
  'Pasas',
  'Bife de chorizo',
  'Carne de ternera',
  'Pan rallado',
  'Papas',
  'Matambre de cerdo',
  'Chimichurri',
  'Asado de tira',
  'Entraña',
  'Lomo',
  'Jamón',
  'Colita de cuadril',
  'Romero',
  'Vacío',
  'Chorizo',
  'Morcilla',
  'Riñones',
  'Tomillo',
  'Pechuga de pollo',
  'Banana',
  'Maíz',
  'Leche',
  'Manteca',
  'Champiñones',
  'Crema',
  'Vino blanco',
  'Merluza',
  'Salmón',
  'Eneldo',
  'Abadejo',
  'Trucha',
  'Almendras',
  'Papa',
  'Albahaca',
  'Ricota',
  'Espinaca',
  'Nuez moscada',
  'Pasta',
  'Salsa blanca',
  'Bechamel',
  'Azúcar',
  'Dulce de leche',
  'Saborizantes naturales',
  'Vainillas',
  'Café',
  'Queso mascarpone',
  'Cacao',
  'Uva Malbec',
  'Uva Cabernet Sauvignon',
  'Agua',
  'Malta',
  'Lúpulo',
  'Levadura',
  'Uva Torrontés',
  'Uva Chardonnay',
  'Fernet Branca',
  'Gaseosa cola',
  'Hielo',
  'Malta tostada',
  'Agua mineral',
  'Agua carbonatada',
  'Jarabe de fructosa',
  'Saborizantes',
  'Menta',
  'Jengibre',
  'Frutas de estación',
];

/**
 * Crear usuarios de prueba
 */
const createSampleUsers = async (): Promise<string[]> => {
  console.log('\n👥 Creando usuarios de prueba...');
  const createdUsers: string[] = [];

  for (const userData of SAMPLE_USERS) {
    try {
      const user = new User(userData);
      await user.save();
      createdUsers.push((user._id as mongoose.Types.ObjectId).toString());

      console.log(
        `   ✅ Usuario creado: ${userData.firstName} ${userData.lastName} (${userData.username})`
      );
    } catch (error) {
      console.error(`   ❌ Error creando usuario ${userData.username}:`, error);
    }
  }

  console.log(`✅ ${createdUsers.length} usuarios creados exitosamente`);
  return createdUsers;
};

/**
 * Crear alérgenos de prueba
 */
const createSampleAllergens = async (adminToken: string): Promise<void> => {
  console.log('\n🚨 Creando alérgenos de prueba...');
  let createdCount = 0;

  for (const allergenName of ALLERGENS) {
    try {
      await createAllergenService({ name: allergenName }, adminToken);
      console.log(`   ✅ Alérgeno creado: ${allergenName}`);
      createdCount++;
    } catch (error) {
      console.error(`   ❌ Error creando alérgeno ${allergenName}:`, error);
    }
  }

  console.log(`✅ ${createdCount} alérgenos creados exitosamente`);
};

/**
 * Crear ingredientes de prueba
 */
const createSampleIngredients = async (adminToken: string): Promise<void> => {
  console.log('\n🥘 Creando ingredientes de prueba...');
  let createdCount = 0;

  for (const ingredientName of INGREDIENTS) {
    try {
      await createIngredientService({ name: ingredientName }, adminToken);
      console.log(`   ✅ Ingrediente creado: ${ingredientName}`);
      createdCount++;
    } catch (error) {
      console.error(`   ❌ Error creando ingrediente ${ingredientName}:`, error);
    }
  }

  console.log(`✅ ${createdCount} ingredientes creados exitosamente`);
};

/**
 * Generar token de autenticación para el primer usuario admin
 */
const generateAdminToken = async (adminUserId: string): Promise<string> => {
  try {
    const adminUser = await User.findById(adminUserId);
    if (!adminUser) throw new Error('Usuario administrador no encontrado');

    const token = await loginService({
      username: adminUser.username,
      password: SAMPLE_USERS[0].password, // Usamos la contraseña del primer usuario admin
    });

    return token.token;
  } catch (error) {
    console.error('❌ Error generando token de administrador:', error);
    throw error;
  }
};

/**
 * Verificar el resultado del seed
 */
const verifySeedResult = async (): Promise<void> => {
  const userCount = await User.countDocuments();

  console.log('');
  console.log('🌱 ¡DATOS DE PRUEBA INSERTADOS EXITOSAMENTE!');
  console.log(`✅ ${userCount} usuarios en la base de datos`);
  console.log('📧 Usuarios de prueba disponibles:');

  SAMPLE_USERS.forEach(user => {
    console.log(`   - ${user.username} / ${user.password}`);
  });

  console.log('🔄 Base de datos preparada para desarrollo y testing');
  console.log('🎯 ¡Lista para usar!');
};

/**
 * Limpiar recursos y cerrar conexiones
 */
const cleanup = async (): Promise<void> => {
  await mongoose.connection.close();
  console.log('\n🔌 Conexión cerrada');
};

/**
 * Función principal del script de seed
 */
const seed = async (): Promise<void> => {
  try {
    // 1. Validaciones iniciales
    validateEnvironment();

    // 2. Conexión a base de datos
    await connectToDatabase();

    // 3. Analizar estado actual
    const collections = await analyzeDatabaseState();

    // 4. Solicitar confirmación (incluyendo limpieza si es necesario)
    await requestUserConfirmation(collections);

    // 5. Limpiar base de datos si tiene datos
    await cleanDatabase(collections);

    // 6. Crear usuarios de prueba
    const userIds = await createSampleUsers();

    // 7. Generar token para el primer admin
    const adminToken = await generateAdminToken(userIds[0]);

    // 8. Crear alérgenos usando el servicio
    await createSampleAllergens(adminToken);

    // 9. Crear ingredientes usando el servicio
    await createSampleIngredients(adminToken);

    // 10. Verificar resultado
    await verifySeedResult();
  } catch (error) {
    console.error('❌ Error durante la inserción de datos:', error);
    if (rl) rl.close();
    process.exit(1);
  } finally {
    await cleanup();
    process.exit(0);
  }
};

// Ejecutar el script si es llamado directamente
if (require.main === module) {
  seed();
}

export default seed;
