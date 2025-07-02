import {
  SAMPLE_ALLERGENS,
  SAMPLE_CATEGORIES,
  SAMPLE_DISHES,
  SAMPLE_INGREDIENTS,
  SAMPLE_USERS,
} from '@/mocks/mockData';
import * as fs from 'fs';
import * as path from 'path';
import mongoose from 'mongoose';
import readline from 'readline';
import { CONFIG } from '@/config/env.config';
import { User } from '@/models/User.model';
import { ICreateDish } from '@/types/dish.types';
import { createAllergenService } from '@/services/allergen.service';
import { createIngredientService } from '@/services/ingredient.service';
import { createCategoryService } from '@/services/category.service';
import { createSubcategoryService } from '@/services/subcategory.service';
import { loginService } from '@/services/auth.service';
import { createDishService } from '@/services/dish.service';
import { uploadToCloudinary } from '@/services/cloudinary.service';

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
  console.log(`   - ${SAMPLE_ALLERGENS.length} alérgenos`);
  console.log(`   - ${SAMPLE_INGREDIENTS.length} ingredientes`);
  console.log(`   - ${SAMPLE_CATEGORIES.length} categorías`);
  console.log(
    `   - ${SAMPLE_CATEGORIES.reduce((total, cat) => total + (cat.subcategories?.length || 0), 0)} subcategorías`
  );
  console.log(`   - ${SAMPLE_DISHES.length} platos con imágenes`);

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
 * Subir imagen a Cloudinary desde el directorio de assets
 */
const uploadImageToCloudinary = async (imageName: string): Promise<string> => {
  try {
    const imagePath = path.join(process.cwd(), 'src', 'assets', 'images', imageName);

    // Verificar si el archivo existe
    if (!fs.existsSync(imagePath)) {
      console.log(`     ⚠️  Imagen no encontrada: ${imageName}, usando placeholder`);
      return 'https://placehold.co/600x400?text=Sin+Imagen';
    }

    // Leer el archivo como buffer
    const imageBuffer = fs.readFileSync(imagePath);

    // Obtener el nombre sin extensión para usar como public_id
    const publicId = path.parse(imageName).name;

    // Subir a Cloudinary
    const result = await uploadToCloudinary(imageBuffer, {
      folder: 'bodegon/dishes',
      public_id: publicId,
      resource_type: 'image',
    });

    console.log(`     ✅ Imagen subida: ${imageName} → ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`     ❌ Error subiendo imagen ${imageName}:`, error);
    return 'https://placehold.co/600x400?text=Error+Imagen';
  }
};

/**
 * Buscar entidad por nombre y retornar su ID
 */
const findEntityByName = async (
  model: any,
  name: string,
  entityType: string
): Promise<string | null> => {
  try {
    const entity = await model.findOne({
      name: name.trim(),
      isDeleted: { $ne: true },
    });

    if (!entity) {
      console.log(`     ⚠️  ${entityType} no encontrado: "${name}"`);
      return null;
    }

    return (entity._id as mongoose.Types.ObjectId).toString();
  } catch (error) {
    console.error(`     ❌ Error buscando ${entityType} "${name}":`, error);
    return null;
  }
};

/**
 * Mapear ingredientes de nombres a IDs
 */
const mapIngredientsToIds = async (ingredientNames: string[]): Promise<string[]> => {
  const ingredientIds: string[] = [];

  for (const ingredientName of ingredientNames) {
    const ingredientId = await findEntityByName(
      mongoose.model('Ingredient'),
      ingredientName,
      'Ingrediente'
    );

    if (ingredientId) {
      ingredientIds.push(ingredientId);
    }
  }

  return ingredientIds;
};

/**
 * Mapear alérgenos de nombres a IDs
 */
const mapAllergensToIds = async (allergenNames: string[]): Promise<string[]> => {
  const allergenIds: string[] = [];

  for (const allergenName of allergenNames) {
    const allergenId = await findEntityByName(mongoose.model('Allergen'), allergenName, 'Alérgeno');

    if (allergenId) {
      allergenIds.push(allergenId);
    }
  }

  return allergenIds;
};

/**
 * Buscar categoría por nombre
 */
const findCategoryByName = async (categoryName: string): Promise<string | null> => {
  return await findEntityByName(mongoose.model('Category'), categoryName, 'Categoría');
};

/**
 * Buscar subcategoría por nombre y categoría
 */
const findSubcategoryByName = async (
  subcategoryName: string,
  categoryId: string
): Promise<string | null> => {
  try {
    const subcategory = await mongoose.model('Subcategory').findOne({
      name: subcategoryName.trim(),
      category: categoryId,
      isDeleted: { $ne: true },
    });

    if (!subcategory) {
      console.log(`     ⚠️  Subcategoría no encontrada: "${subcategoryName}"`);
      return null;
    }

    return (subcategory._id as mongoose.Types.ObjectId).toString();
  } catch (error) {
    console.error(`     ❌ Error buscando subcategoría "${subcategoryName}":`, error);
    return null;
  }
};

/**
 * Crear un dish individual
 */
const createSingleDish = async (dishData: any, adminToken: string): Promise<boolean> => {
  try {
    console.log(`   🍽️  Creando plato: ${dishData.name}`);

    // 1. Buscar categoría
    const categoryId = await findCategoryByName(dishData.categoryName);
    if (!categoryId) {
      console.log(`     ❌ Categoría no encontrada: ${dishData.categoryName}`);
      return false;
    }

    // 2. Buscar subcategoría si existe
    let subcategoryId: string | undefined = undefined;
    if (dishData.subcategoryName) {
      const foundSubcategoryId = await findSubcategoryByName(dishData.subcategoryName, categoryId);
      if (foundSubcategoryId) {
        subcategoryId = foundSubcategoryId;
      } else {
        console.log(`     ⚠️  Subcategoría no encontrada: ${dishData.subcategoryName}`);
      }
    }

    // 3. Mapear ingredientes a IDs
    const ingredientIds = await mapIngredientsToIds(dishData.ingredientes || []);
    if ((dishData.ingredientes || []).length > 0 && ingredientIds.length === 0) {
      console.log(`     ⚠️  No se encontraron ingredientes para: ${dishData.name}`);
    }

    // 4. Mapear alérgenos a IDs
    const allergenIds = await mapAllergensToIds(dishData.alergenos || []);
    if ((dishData.alergenos || []).length > 0 && allergenIds.length === 0) {
      console.log(`     ⚠️  No se encontraron alérgenos para: ${dishData.name}`);
    }

    // 5. Subir imagen a Cloudinary
    const imageUrl = await uploadImageToCloudinary(dishData.img);

    // 6. Preparar datos para el servicio
    const createDishData: ICreateDish = {
      name: dishData.name,
      description: dishData.description,
      price: dishData.precio,
      image: imageUrl,
      categoryId: categoryId,
      subcategoryId: subcategoryId,
      ingredientIds: ingredientIds,
      allergenIds: allergenIds,
    };

    // 7. Crear el dish usando el servicio
    const createdDish = await createDishService(createDishData, adminToken);

    console.log(`     ✅ Plato creado exitosamente: ${dishData.name}`);
    console.log(`        - Categoría: ${dishData.categoryName}`);
    if (dishData.subcategoryName) {
      console.log(`        - Subcategoría: ${dishData.subcategoryName}`);
    }
    console.log(`        - Ingredientes: ${ingredientIds.length}`);
    console.log(`        - Alérgenos: ${allergenIds.length}`);
    console.log(`        - Precio: $${dishData.precio}`);

    return true;
  } catch (error) {
    console.error(`     ❌ Error creando plato "${dishData.name}":`, error);
    return false;
  }
};

/**
 * Crear todos los dishes de prueba
 */
const createSampleDishes = async (adminToken: string): Promise<void> => {
  console.log('\n🍽️  Creando platos de prueba...');

  let createdCount = 0;
  let errorCount = 0;
  const totalDishes = SAMPLE_DISHES.length;

  console.log(`📊 Total de platos a crear: ${totalDishes}`);

  // Crear dishes por categorías para mejor organización en los logs
  const dishesByCategory = SAMPLE_DISHES.reduce(
    (acc, dish) => {
      const category = dish.categoryName;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(dish);
      return acc;
    },
    {} as Record<string, any[]>
  );

  for (const [categoryName, dishes] of Object.entries(dishesByCategory)) {
    console.log(`\n📂 Creando platos de categoría: ${categoryName} (${dishes.length} platos)`);

    for (const dishData of dishes) {
      const success = await createSingleDish(dishData, adminToken);

      if (success) {
        createdCount++;
      } else {
        errorCount++;
      }

      // Pequeña pausa para no sobrecargar el sistema
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log(`\n📊 Resumen de creación de platos:`);
  console.log(`✅ Platos creados exitosamente: ${createdCount}`);
  if (errorCount > 0) {
    console.log(`❌ Platos con errores: ${errorCount}`);
  }
  console.log(`📊 Total procesado: ${createdCount + errorCount}/${totalDishes}`);

  if (createdCount > 0) {
    console.log(`✅ ${createdCount} platos creados exitosamente`);
  }
};

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

  for (const allergenName of SAMPLE_ALLERGENS) {
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

  for (const ingredientName of SAMPLE_INGREDIENTS) {
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
 * Crear categorías y subcategorías de prueba
 */
const createSampleCategories = async (adminToken: string): Promise<void> => {
  console.log('\n📂 Creando categorías y subcategorías de prueba...');
  let createdCategoriesCount = 0;
  let createdSubcategoriesCount = 0;

  for (const categoryData of SAMPLE_CATEGORIES) {
    try {
      // Crear la categoría
      const category = await createCategoryService({ name: categoryData.name }, adminToken);
      console.log(`   ✅ Categoría creada: ${categoryData.name}`);
      createdCategoriesCount++;

      // Crear subcategorías si existen
      if (categoryData.subcategories && categoryData.subcategories.length > 0) {
        console.log(`     📁 Creando subcategorías para: ${categoryData.name}`);

        for (const subcategoryData of categoryData.subcategories) {
          try {
            await createSubcategoryService(
              {
                name: subcategoryData.name,
                categoryId: (category as any)._id.toString(),
              },
              adminToken
            );
            console.log(`       ✅ Subcategoría creada: ${subcategoryData.name}`);
            createdSubcategoriesCount++;
          } catch (subcategoryError) {
            console.error(
              `       ❌ Error creando subcategoría ${subcategoryData.name}:`,
              subcategoryError
            );
          }
        }
      }
    } catch (error) {
      console.error(`   ❌ Error creando categoría ${categoryData.name}:`, error);
    }
  }

  console.log(`✅ ${createdCategoriesCount} categorías creadas exitosamente`);
  console.log(`✅ ${createdSubcategoriesCount} subcategorías creadas exitosamente`);
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
  const dishCount = await mongoose.model('Dish').countDocuments();
  const totalSubcategories = SAMPLE_CATEGORIES.reduce(
    (total, cat) => total + (cat.subcategories?.length || 0),
    0
  );

  console.log('');
  console.log('🌱 ¡DATOS DE PRUEBA INSERTADOS EXITOSAMENTE!');
  console.log(`✅ ${userCount} usuarios en la base de datos`);
  console.log(`✅ ${SAMPLE_ALLERGENS.length} alérgenos creados`);
  console.log(`✅ ${SAMPLE_INGREDIENTS.length} ingredientes creados`);
  console.log(`✅ ${SAMPLE_CATEGORIES.length} categorías creadas`);
  console.log(`✅ ${totalSubcategories} subcategorías creadas`);
  console.log(`✅ ${dishCount} platos creados`);

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

    // 10. Crear categorías y subcategorías usando los servicios
    await createSampleCategories(adminToken);

    // 11. Crear platos usando el servicio
    await createSampleDishes(adminToken);

    // 12. Verificar resultado
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
