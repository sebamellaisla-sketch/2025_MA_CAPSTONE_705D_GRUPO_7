# 🧵 TESTheb - E-commerce de Bordados

<div align="center">

![TESTheb Logo](frontend/public/testheb-logo.png)

**Plataforma E-commerce Moderna para Bordados Personalizados**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

## 📋 Descripción del Proyecto

TESTheb es una plataforma de e-commerce especializada en bordados personalizados, desarrollada como proyecto de capstone para el programa APT122. El sistema permite a los usuarios navegar por un catálogo de productos, personalizar bordados, realizar compras y gestionar inventario a través de un panel administrativo robusto.

### 🎯 Características Principales

- 🛒 **E-commerce Completo**: Catálogo, carrito, checkout y procesamiento de pagos
- 🎨 **Sistema de Bordados**: Personalización de productos con bordados únicos
- 👤 **Autenticación JWT**: Sistema seguro de usuarios con roles diferenciados
- 🏪 **Panel Administrativo**: Gestión completa de productos, categorías e inventario
- 💳 **Integración WebPay**: Procesamiento de pagos con Transbank
- 📱 **Responsive Design**: Interfaz optimizada para móviles y desktop
- ☁️ **Cloudinary**: Gestión profesional de imágenes

## 🛠️ Stack Tecnológico

### **Frontend**
- **Framework**: React 19+ con Vite
- **Estilos**: TailwindCSS 4+
- **Animaciones**: Framer Motion
- **Routing**: React Router DOM 7+
- **Forms**: React Hook Form
- **Icons**: React Icons
- **HTTP Client**: Fetch API nativo

### **Backend**
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5+
- **Base de Datos**: PostgreSQL 15+
- **Autenticación**: JWT + bcrypt
- **File Upload**: Multer
- **Logging**: Winston + Morgan
- **Email**: Nodemailer
- **Payments**: Transbank SDK

### **DevOps & Tools**
- **Bundler**: Vite
- **Linting**: ESLint
- **CSS Processing**: PostCSS + Autoprefixer
- **Image Storage**: Cloudinary
- **Environment**: dotenv

## 🏗️ Arquitectura del Sistema

```
TESTheb/
├── 🚀 Frontend (React + Vite)
│   ├── Interfaz de usuario moderna
│   ├── Gestión de estado con Context API
│   ├── Animaciones con Framer Motion
│   └── Estilos con TailwindCSS
│
├── ⚡ Backend (Node.js + Express)
│   ├── API RESTful robusta
│   ├── Autenticación JWT
│   ├── Middleware de seguridad
│   └── Integración con servicios externos
│
├── 🗄️ Base de Datos (PostgreSQL)
│   ├── Esquema optimizado
│   ├── Relaciones eficientes
│   └── Sistema de migraciones
│
└── 📁 Estructura de Fases
    ├── Fase 1/ (Documentación y diseño)
    └── Fase 2/ (Implementación actual)
```

## 📁 Estructura del Proyecto

```
testheb-proyecto/
├── 📂 backend/
│   ├── 📂 src/
│   │   ├── 📂 config/          # Configuraciones (DB, Logger)
│   │   ├── 📂 controllers/     # Lógica de negocio
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── categoryController.js
│   │   │   ├── paymentController.js
│   │   │   └── webpayController.js
│   │   ├── 📂 middleware/      # Autenticación, validaciones
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── 📂 routes/          # Definición de rutas
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── webpayRoutes.js
│   │   │   └── uploadRoutes.js
│   │   └── 📂 models/          # Modelos de datos
│   ├── 📂 sql/                 # Scripts de migración
│   │   ├── create_users_table.sql
│   │   ├── create_orders_table.sql
│   │   ├── implement_simple_system.sql
│   │   └── add_product_sizes.sql
│   ├── 📂 logs/                # Logs del sistema
│   ├── package.json
│   └── server.js               # Punto de entrada
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/      # Componentes React reutilizables
│   │   │   ├── 📂 admin/       # Componentes del panel admin
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   └── AdminSidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CategoryCard.jsx
│   │   │   └── PageTransition.jsx
│   │   ├── 📂 pages/           # Páginas principales
│   │   │   ├── HomePage.jsx
│   │   │   ├── CatalogPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── PaymentReturnPage.jsx
│   │   ├── 📂 context/         # Context API (Auth, Cart)
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── 📂 hooks/           # Custom hooks
│   │   ├── 📂 services/        # APIs y servicios externos
│   │   │   ├── api.js
│   │   │   ├── cloudinaryService.js
│   │   │   └── uploadService.js
│   │   ├── 📂 utils/           # Utilidades y helpers
│   │   └── 📂 data/            # Datos estáticos
│   ├── 📂 public/              # Assets estáticos
│   │   ├── testheb-logo.png
│   │   ├── banner_servicios.jpg
│   │   └── 📂 images/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── 📂 Fase 1/                  # Documentación Fase 1
│   ├── 📂 Evidencias Grupales/
│   ├── 📂 Evidencias Individuales/
│   └── 📂 Evidencias Proyecto/
│
├── 📂 Fase 2/                  # Implementación actual
│   └── 📂 Evidencias Proyecto/
│       └── 📂 Evidencias de sistema/
│           ├── 📂 backend/     # Código backend Fase 2
│           └── 📂 frontend/    # Código frontend Fase 2
│
├── 📄 README.md                # Este archivo
├── 📄 ESTADO_ACTUAL_SISTEMA.md # Estado técnico detallado
├── 📄 RESUMEN_PROYECTO_TALLAS.md # Historia del desarrollo
└── 📄 COMO_ACTIVAR_TALLAS.md   # Guía para activar sistema de tallas
```

## 📊 Base de Datos

### Esquema Principal

```sql
📋 users           # Sistema de usuarios y autenticación
├── id (PK)
├── name, email, password_hash
├── role (customer/admin/employee)
├── active, email_verified
└── timestamps

🏷️ categories      # Organización de productos
├── id (PK)
├── name, description
├── active
└── timestamps

📦 products        # Catálogo principal
├── id (PK)
├── name, description, price
├── image_url, category_id (FK)
├── size_id (FK), stock
└── timestamps

📏 sizes           # Tallas disponibles
├── id (PK)
├── name (S,M,L,XL)
├── display_name, sort_order
└── active

🛒 orders          # Transacciones WebPay
├── id (PK)
├── buy_order, amount, session_id
├── status, token, authorization_code
├── order_data (JSON), result_data (JSON)
└── timestamps
```

### Variables de Entorno

Crea un archivo `.env` en el directorio `backend/` con la siguiente configuración:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=testheb_db
DB_USER=tu_usuario
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=tu_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Transbank (opcional)
TRANSBANK_INTEGRATION_TYPE=TEST
TRANSBANK_COMMERCE_CODE=tu_commerce_code
TRANSBANK_API_KEY_ID=tu_api_key_id
TRANSBANK_API_KEY_SECRET=tu_api_key_secret
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- PostgreSQL 15+
- npm o yarn
- Cuenta Cloudinary (para imágenes)
- Cuenta Transbank (para pagos)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/sebamellaisla-sketch/2025_MA_CAPSTONE_705D_GRUPO_7.git
cd testheb-proyecto
```

### 2. Configurar Backend

```bash
cd backend
npm install

# Crear archivo .env
cp .env.example .env
```

### 3. Configurar Base de Datos

```bash
# Crear base de datos
createdb testheb_db

# Ejecutar migraciones
psql -d testheb_db -f sql/create_users_table.sql
psql -d testheb_db -f sql/implement_simple_system.sql
psql -d testheb_db -f sql/create_orders_table.sql
```

### 4. Configurar Frontend

```bash
cd frontend
npm install

# El frontend usa proxy a localhost:3000 por defecto
# Revisar vite.config.js si necesitas cambiar la URL del backend
```

### 5. Ejecutar el Proyecto

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev     # Desarrollo con nodemon
# o
npm start       # Producción
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev     # http://localhost:5173
```

## 🎮 Uso del Sistema

### 👥 Credenciales de Prueba

> **⚠️ Nota**: Las credenciales de prueba están configuradas en el sistema para demos. En producción, estas deben ser cambiadas.

**Administrador:**
- Email: `admin@testheb.cl`
- Contraseña: `[Ver documentación interna]`

**Cliente de Prueba:**
- Email: `cliente@testheb.cl`
- Contraseña: `[Ver documentación interna]`

### 🛍️ Flujo de Usuario

1. **Exploración**: Navegar catálogo y filtrar por categorías
2. **Selección**: Ver detalles de productos y especificaciones
3. **Personalización**: Agregar bordados personalizados (próximamente)
4. **Carrito**: Gestionar productos seleccionados
5. **Checkout**: Proceso de compra con WebPay
6. **Confirmación**: Seguimiento del pedido

### ⚙️ Panel Administrativo

Acceder a `/admin` con credenciales de administrador:

- 📊 **Dashboard**: Estadísticas y métricas del sistema
- 📦 **Productos**: CRUD completo de productos
- 🏷️ **Categorías**: Gestión de categorías
- 👥 **Usuarios**: Administración de cuentas
- 📸 **Imágenes**: Subida automática a Cloudinary
- 🛒 **Pedidos**: Seguimiento de transacciones

## 🔌 API Endpoints

### 🔐 Autenticación
```
POST   /api/auth/register       # Registro de usuario
POST   /api/auth/login          # Inicio de sesión
GET    /api/auth/profile        # Perfil de usuario (protegido)
PUT    /api/auth/profile        # Actualizar perfil (protegido)
POST   /api/auth/change-password # Cambiar contraseña (protegido)
POST   /api/auth/logout         # Cerrar sesión (protegido)
```

### 📦 Productos
```
GET    /api/products            # Listar todos los productos
GET    /api/products/:id        # Obtener producto específico
GET    /api/products/category/:id # Productos por categoría
GET    /api/products/search?q=  # Buscar productos
POST   /api/products            # Crear producto (admin)
PUT    /api/products/:id        # Actualizar producto (admin)
DELETE /api/products/:id        # Eliminar producto (admin)
```

### 🏷️ Categorías
```
GET    /api/categories          # Listar categorías
POST   /api/categories          # Crear categoría (admin)
PUT    /api/categories/:id      # Actualizar categoría (admin)
DELETE /api/categories/:id      # Eliminar categoría (admin)
```

### 💳 Pagos
```
POST   /api/webpay/create       # Crear transacción WebPay
POST   /api/webpay/commit       # Confirmar transacción
GET    /api/webpay/status/:id   # Estado de transacción
```

### 📸 Subidas
```
POST   /api/upload/image        # Subir imagen a Cloudinary (admin)
DELETE /api/upload/image/:id    # Eliminar imagen (admin)
```

## 🔧 Sistema de Tallas (Próximamente)

El proyecto incluye un sistema avanzado de tallas preparado para activar:

### Funcionalidades Preparadas
- ✅ **Base de datos** con tablas `sizes` y `product_sizes`
- ✅ **Código backend** para gestión de stock por talla
- ✅ **Componentes frontend** para selector de tallas
- ✅ **Panel admin** para configurar tallas por producto
- ✅ **Migraciones SQL** listas para ejecutar

### Para Activar el Sistema de Tallas
```bash
# 1. Ejecutar migración de tallas
psql -d testheb_db -f backend/sql/add_product_sizes.sql

# 2. Descomentar código avanzado en:
# - frontend/src/components/admin/ProductForm.jsx
# - frontend/src/pages/ProductDetailPage.jsx
# - backend/src/controllers/productController.js

# 3. Reiniciar servidores
```

Ver documentación completa en `COMO_ACTIVAR_TALLAS.md`

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm run test
```

## 📦 Deployment

### Preparar para Producción

**Backend:**
```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Servir desde dist/ con servidor web estático
```

### Variables de Entorno Producción

- Configurar SSL/HTTPS
- Usar credenciales reales de Transbank
- Configurar CORS para dominio de producción
- Usar base de datos PostgreSQL en la nube
- Configurar logs persistentes

## 👥 Equipo de Desarrollo

| Desarrollador | Rol | Contact |
|---------------|-----|---------|
| **Francisco Campos** | Full Stack Developer | [GitHub](https://github.com) |
| **Sebastian Mella** | Full Stack Developer | [GitHub](https://github.com) |

## 📝 Documentación Adicional

- 📋 [Estado Actual del Sistema](ESTADO_ACTUAL_SISTEMA.md)
- 🎯 [Resumen del Proyecto](RESUMEN_PROYECTO_TALLAS.md)
- 🔧 [Cómo Activar Tallas](COMO_ACTIVAR_TALLAS.md)
- 🔐 [Documentación de API Auth](backend/AUTH_API_DOCS.md)

## 🔄 Changelog

### Fase 2 (Actual) - Septiembre 2025
- ✅ Sistema de autenticación JWT completo
- ✅ Panel administrativo funcional
- ✅ Integración WebPay preparada
- ✅ Frontend React moderno con TailwindCSS
- ✅ Sistema de tallas preparado (no activado)
- ✅ Gestión de imágenes con Cloudinary
- ✅ API RESTful robusta

### Fase 1 - Septiembre 2025
- 📋 Documentación del proyecto
- 🎨 Diseño de wireframes y mockups
- 📊 Modelado de base de datos
- 📋 Planificación y casos de uso

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuciones

Este es un proyecto académico para el programa APT122. Las contribuciones están limitadas al equipo de desarrollo actual.

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto:

- 📧 Email: contacto@testheb.cl
- 🐛 Issues: [GitHub Issues](https://github.com/sebamellaisla-sketch/2025_MA_CAPSTONE_705D_GRUPO_7/issues)
- 📚 Documentación: Ver archivos `.md` en el repositorio

---

<div align="center">

**🧵 TESTheb - Bordados Personalizados 🧵**

*Desarrollado con ❤️ por Francisco Campos & Sebastian Mella*

*APT122 - Capstone Project 2025*

</div>
