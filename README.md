# 🧁 Dulces y Delicias

Página web de presentación para una repostería artesanal, hecha solo con
**HTML, CSS y JavaScript** (sin frameworks ni librerías externas de código).

## ✨ Características

- 4 pestañas funcionales: **Inicio, Productos, Nosotros y Contacto**.
- Hero animado con ilustraciones SVG propias.
- **Pedido interactivo**: se agrega al carrito, persiste con `localStorage`
  y se envía el resumen por WhatsApp.
- Filtros por categoría en el catálogo (generado con JS).
- Formulario de contacto con validaciones y notificaciones (toasts).
- Menú móvil, botón "volver arriba", año automático en el footer.
- Animaciones al hacer scroll y soporte para `prefers-reduced-motion`.

## 🗂️ Estructura

```
├── index.html      # Inicio (hero, destacados, testimonios)
├── productos.html  # Catálogo con filtros
├── nosotros.html   # Historia y estadísticas animadas
├── contacto.html   # Formulario + preguntas frecuentes
├── css/styles.css  # Un solo CSS compartido (paleta de repostería)
├── js/script.js    # Toda la lógica del sitio
└── img/            # Ilustraciones SVG creadas para el proyecto
```

## 🚀 Cómo verlo

1. Clona o descarga este repositorio.
2. Abre `index.html` en tu navegador.

**Versión en línea (GitHub Pages):** https://matatenas390.github.io/DulcesyDelicias/

## 🔄 Cómo actualizar el sitio

- **Cambios chicos:** edita el archivo directo en GitHub (ícono de lápiz) → *Commit changes* → el redespliegue es automático (~1 min).
- **Cambios grandes:** usa *Add file → Upload files* y arrastra solo lo que cambió (si el archivo va en `css/`, `img/` o `js/`, arrastra la carpeta entera para conservar la ruta).
- Cada *commit* en `main` dispara el despliegue en Pages; nunca hay que reactivarlo.

## 🧪 Tecnologías

HTML5 · CSS3 (variables, grid, flexbox, animaciones) · JavaScript (DOM,
eventos, IntersectionObserver, localStorage) · SVG.

---

Proyecto de práctica para mi portafolio 👋
