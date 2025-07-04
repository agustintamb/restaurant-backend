# 🍽️ Bodegón Argentino API

API REST completa para sistema de gestión de restaurante/bodegón construida con Node.js, TypeScript, Express y MongoDB.

## 📋 Características

- **Gestión completa de menú**: Categorías, subcategorías, platos e ingredientes
- **Sistema de alérgenos**: Control detallado para clientes con restricciones alimentarias
- **Gestión de contactos**: Sistema de mensajería desde el sitio web público
- **Dashboard administrativo**: Estadísticas completas del sistema
- **Autenticación JWT**: Sistema seguro de autenticación y autorización
- **Upload de imágenes**: Integración con Cloudinary para imágenes de platos
- **Documentación Swagger**: API completamente documentada
- **Eliminación lógica**: Todos los recursos con soft delete y restauración
- **Auditoría completa**: Tracking de creación, modificación y eliminación

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Base de datos**: MongoDB + Mongoose
- **Autenticación**: JWT (JSON Web Tokens)
- **Upload de archivos**: Cloudinary
- **Documentación**: Swagger/OpenAPI
- **Linting**: ESLint + Prettier

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v18 o superior)
- MongoDB (local o MongoDB Atlas)
- Cuenta de Cloudinary (para imágenes)

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd restaurant-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configura las variables:

```bash
cp .env.example .env.development
```

Edita `.env.development` con tus valores:

```env
NODE_ENV=development
PORT=8000
FRONTEND_URL=http://localhost:5173
BACKOFFICE_URL=http://localhost:5174
MONGODB_URI=mongodb://localhost:27017/bodegon_local
JWT_SECRET=tu_jwt_secret_muy_seguro
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:8000`

## 📚 Documentación de la API

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

```
http://localhost:8000/api-docs
```

## 🗂️ Estructura de la API

### Módulos Principales

- **Auth** (`/api/auth`) - Autenticación de usuarios
- **Users** (`/api/users`) - Gestión de usuarios del sistema
- **Categories** (`/api/categories`) - Categorías de platos
- **Subcategories** (`/api/subcategories`) - Subcategorías de platos
- **Dishes** (`/api/dishes`) - Platos del menú
- **Ingredients** (`/api/ingredients`) - Ingredientes
- **Allergens** (`/api/allergens`) - Alérgenos
- **Contacts** (`/api/contacts`) - Mensajes de contacto
- **Dashboard** (`/api/dashboard`) - Estadísticas del sistema

### Endpoints Públicos

Los siguientes endpoints **NO** requieren autenticación:

- `POST /api/auth/login` - Inicio de sesión
- `POST /api/contacts` - Enviar mensaje de contacto
- `GET /api/categories` - Listar categorías
- `GET /api/dishes` - Listar platos
- `GET /api/dishes/{id}` - Ver detalle de plato

### Endpoints Privados

Todos los demás endpoints requieren:

- **Autenticación**: Header `Authorization: Bearer <token>`
- **Rol de administrador**: Solo usuarios con rol `admin`

## 🎯 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con hot reload

# Producción
npm run build        # Compilar TypeScript
npm start           # Iniciar servidor de producción

# Base de datos
npm run db:seed     # Poblar base de datos con datos de ejemplo
npm run db:wipe     # Limpiar completamente la base de datos
```

## 🗄️ Estructura de Base de Datos

### Colecciones Principales

- `users` - Usuarios administradores
- `categories` - Categorías de platos
- `subcategories` - Subcategorías de platos
- `dishes` - Platos del menú
- `ingredients` - Ingredientes
- `allergens` - Alérgenos
- `contacts` - Mensajes de contacto

### Características de los Modelos

- **Eliminación lógica**: Todos los modelos incluyen `isDeleted`, `deletedAt`, `deletedBy`
- **Auditoría**: Tracking de `createdBy`, `updatedBy`, `restoredBy`
- **Timestamps**: `createdAt` y `updatedAt` automáticos
- **Referencias**: Relaciones entre modelos con populate
