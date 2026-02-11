# LSearch - Buscador de Comandos Linux y Ciberseguridad

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase" />
</p>

Un motor de búsqueda moderno y hermoso para comandos de Linux y herramientas de ciberseguridad. Impulsado por la inteligencia de NotebookLM para enriquecer continuamente la base de datos de comandos.

## ✨ Características

- 🔍 **Búsqueda en Tiempo Real** - Búsqueda instantánea con atajos de teclado (Ctrl/Cmd + K)
- 🏷️ **Filtrado por Categorías** - Filtra por redes, seguridad, archivos, sistema y más
- 📋 **Copia con Un Clic** - Copia cualquier comando o ejemplo al instante
- 🌙 **Tema de Ciberseguridad** - Modo oscuro con acentos en verde/cian/púrpura
- ⚡ **Animaciones Suaves** - Impulsado por Framer Motion
- 🤖 **Integración con NotebookLM** - Sincroniza comandos desde tus fuentes de NotebookLM
- 💾 **Backend en Supabase** - Base de datos rápida y escalable con búsqueda de texto completo

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Copia `.env.example` a `.env.local` y actualiza con tus valores:

```bash
cp .env.example .env.local
```

#### Configuración de Supabase (Opcional - funciona con datos de muestra sin ella)

1. Crea una cuenta gratuita en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a **Settings > API** y copia:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Ve a **SQL Editor** y ejecuta el contenido de `src/lib/schema.sql`

### 3. Ejecutar Servidor de Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── commands/route.ts    # API CRUD de Comandos
│   │   └── notebooklm/route.ts  # API de sincronización con NotebookLM
│   ├── globals.css              # Estilos globales y animaciones
│   ├── layout.tsx               # Layout raíz
│   └── page.tsx                 # Página principal de búsqueda
├── components/
│   ├── SearchBar.tsx            # Input de búsqueda animado
│   ├── CommandCard.tsx          # Tarjeta de visualización de comandos
│   └── CategoryFilter.tsx       # Botones de filtro por categoría
└── lib/
    ├── supabase.ts              # Cliente de Supabase
    ├── types.ts                 # Tipos de TypeScript
    └── schema.sql               # Esquema de base de datos
```

## 🎨 Personalización

### Añadir Nuevos Comandos

Puedes añadir comandos directamente a Supabase o usar la API:

```bash
curl -X POST http://localhost:3000/api/commands \
  -H "Content-Type: application/json" \
  -d '{
    "command": "htop",
    "description": "Visualizador de procesos interactivo",
    "category": "process",
    "examples": [{"code": "htop", "description": "Lanzar visualizador interactivo"}],
    "tags": ["process", "monitoring", "interactive"]
  }'
```

### Sincronización con NotebookLM

La aplicación puede sincronizar comandos desde tu cuaderno de NotebookLM. Añade fuentes a tu cuaderno con contenido de Linux/ciberseguridad y usa la API de sincronización:

```bash
# Comprobar conexión
curl http://localhost:3000/api/notebooklm

# Consultar cuaderno
curl -X POST http://localhost:3000/api/notebooklm \
  -H "Content-Type: application/json" \
  -d '{"action": "query", "query": "List networking commands"}'
```

## 🚀 Despliegue

### Vercel (Recomendado)

1. Haz push a GitHub
2. Importa en [Vercel](https://vercel.com)
3. Añade las variables de entorno
4. ¡Despliega!

```bash
npm run build
vercel --prod
```

## 📝 Categorías de Comandos

| Categoría | Descripción | Color |
|----------|-------------|-------|
| networking | Herramientas de red (ssh, curl, nmap) | Cian |
| security | Herramientas de seguridad/pentesting | Púrpura |
| files | Operaciones de archivos (ls, cp, find) | Verde |
| system | Administración del sistema | Amarillo |
| process | Gestión de procesos | Rojo |
| text | Procesamiento de texto (grep, sed, awk) | Verdemar (Teal) |
| permissions | Permisos de archivos | Naranja |
| disk | Utilidades de disco | Gris |
| users | Gestión de usuarios | Rosa |
| scripting | Scripts y automatización | Dorado |

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16 con App Router
- **Lenguaje**: TypeScript 5
- **Estilos**: TailwindCSS 4
- **Animaciones**: Framer Motion
- **Base de Datos**: Supabase (PostgreSQL)
- **Integración IA**: NotebookLM MCP Server
- **Iconos**: Lucide React

## 📄 Licencia

Licencia MIT - ¡siéntete libre de usar este proyecto para aprender o construir tus propias herramientas!

---

Construido con ❤️ para la comunidad de Linux y ciberseguridad
