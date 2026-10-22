---
type: validation
status: reviewed
date: 2026-10-22
---

# Validación de la propuesta

Revisión local de la versión centrada en remodelación de apartamentos en Bogotá. Este documento registra las comprobaciones de la web y del contenedor; no confirma la publicación del dominio de producción.

El alcance actual tiene tres páginas: portada, catálogo de 14 servicios y empresa con misión, visión, cultura y seis referencias de clientes. Se comprobó la retirada del portafolio en la navegación, la portada, las páginas generadas y el sitemap. La página retirada devuelve 404; las tres páginas vigentes devuelven 200. Sus imágenes ya no están en la vista previa ni en el paquete de producción.

## Comprobaciones realizadas

- Ampliación del contenido original: 14 servicios, misión/visión/cultura, seis clientes y enlaces sociales históricos, con metadatos propios y sitemap.
- Consulta de cubiertas comprobada en navegador: el botón selecciona el servicio correcto y abre el diálogo.
- Sintaxis de JavaScript y preparación del paquete de producción correctas.
- HTML con un solo H1, IDs únicos, enlaces internos válidos, archivos referenciados presentes y JSON-LD que se puede interpretar.
- Revisión visual en escritorio y ventanas de 320 y 390 píxeles de ancho.
- Corrección posterior de FAQ: cuadrícula de dos columnas y respuestas alineadas; comprobadas abiertas y cerradas en escritorio y a 320/390 píxeles, incluido cierre por teclado.
- Menú móvil y diálogo: Escape cierra y devuelve el foco al control que los abrió.
- Comparador: teclado, extremos 0/100 y etiquetas coherentes con la imagen visible.
- Tirador del comparador integrado en la imagen: arrastre comprobado en escritorio y diseño móvil de 390 píxeles; Home, End y flechas mantienen el control por teclado. Foco visible y tirador accesible en los extremos. El gesto táctil usa Pointer Events y permite desplazamiento vertical, sin prueba en un teléfono físico.
- Formulario: validación, borrador y enlaces codificados de WhatsApp y correo. No se envió ningún mensaje.
- Contenedor Docker construido y saludable. El formulario abre también bajo la política CSP de producción.
- Respuestas HTTP del contenedor: inicio, robots y sitemap devuelven 200; ruta inexistente devuelve 404; HEAD funciona.
- En el contenedor: HTML con caché de revalidación, imágenes con caché de siete días, CSS comprimido con gzip y cabeceras de seguridad presentes. La configuración de Nginx no se aplica a GitHub Pages.
- Paquete de producción sin el bloqueo de indexación ni la nota de propuesta. Mantiene las aclaraciones de imágenes conceptuales generadas con IA.

## Límites de esta revisión

No se ejecutó una auditoría completa con lector de pantalla ni se certifica conformidad WCAG. No hay puntuación Lighthouse ni datos de Core Web Vitals en visitantes reales. La indexación y la visibilidad en buscadores o respuestas de IA se verifican después de publicar; no se prometen posiciones.

Se implementaron estructura semántica, contraste, foco visible, controles etiquetados, movimiento reducido, contenido descriptivo, datos de empresa consistentes, metadatos y sitemap. Google indica que sus funciones de IA se apoyan en los fundamentos de SEO existentes; no requieren un archivo especial de IA.

Referencias: [Google: funciones de IA](https://developers.google.com/search/docs/appearance/ai-features), [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [datos de Organization](https://developers.google.com/search/docs/appearance/structured-data/organization), [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) y [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## Vista previa y producción

Los archivos de la raíz y GitHub Pages conservan `noindex` como vista previa. El paquete `--production` queda preparado para `ingenierosab.com`; publicar el dominio requiere configurar por separado el túnel o proxy y DNS. Las instrucciones genéricas están en `deploy/HOMELAB.md`. El repositorio no configura un dominio personalizado de GitHub Pages mediante `CNAME`.
