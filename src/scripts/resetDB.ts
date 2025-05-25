import mongoose from 'mongoose';
import { CONFIG } from '../config/env.config';
import { Category } from '../models/Category.model';
import { Product } from '../models/Product.model';
import { User } from '../models/User.model';
import { categoriesData, productsData } from '../mocks/mockData';

const resetDatabase = async () => {
  try {
    console.log('🔄 Iniciando reset de la base de datos...');

    // Conectar a la base de datos
    await mongoose.connect(CONFIG.mongodbUri!);
    console.log('✅ Conectado a MongoDB');

    // Limpiar colecciones existentes
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('🗑️  Datos existentes eliminados');

    // Crear usuario administrador
    const adminUser = new User({
      username: 'admin-bodegon',
      password: 'admin123', // Contraseña por defecto
      role: 'admin',
    });
    await adminUser.save();
    console.log('👤 Usuario administrador creado (username: admin-bodegon, password: admin123)');

    // Crear categorías
    const categories = await Category.insertMany(categoriesData);
    console.log(`📂 ${categories.length} categorías creadas`);

    // Crear productos
    const productsToInsert = [];

    for (const productData of productsData) {
      const { categoryName, subcategoryName, ...product } = productData as any;

      // Buscar la categoría por nombre
      const category = categories.find(cat => cat.name === categoryName);
      if (!category) {
        console.warn(
          `⚠️  Categoría "${categoryName}" no encontrada para el producto "${product.name}"`
        );
        continue;
      }

      // Armar el producto con el categoryId correcto
      const productToInsert = {
        ...product,
        categoryId: category._id,
        subcategoryId: subcategoryName || undefined,
      };

      productsToInsert.push(productToInsert);
    }

    const products = await Product.insertMany(productsToInsert);
    console.log(`🍽️  ${products.length} productos creados`);

    console.log('✅ Base de datos reseteada exitosamente');
    console.log('\n📊 Resumen:');
    console.log(`   - Usuario admin: admin-bodegon (password: admin123)`);
    console.log(`   - Categorías: ${categories.length}`);
    console.log(`   - Productos: ${products.length}`);
  } catch (error) {
    console.error('❌ Error al resetear la base de datos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
  }
};

// Ejecutar el script solo si es llamado directamente
if (require.main === module) {
  resetDatabase();
}

export default resetDatabase;
