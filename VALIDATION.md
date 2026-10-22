---
type: validation
status: reviewed
date: 2026-10-22
---

# Validación de la propuesta

Revisión local y pública de la versión centrada en remodelación de apartamentos en Bogotá. Este documento registra las comprobaciones de la web, del contenedor y del despliegue en Cloudflare Pages al 2026-10-22. El dominio de producción `ingenierosab.com` todavía no está activo en Pages.

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

## Cloudflare Pages

El paquete de Pages se comprobó localmente con Wrangler 4.152.0: las tres páginas responden 200, las 15 redirecciones históricas funcionan (incluida la ruta con `ñ`), las rutas retiradas y desconocidas responden 404 y las cabeceras de seguridad están presentes. Se verificaron las redirecciones automáticas de `.html`, los metadatos con rutas sin extensión y las reglas de `noindex` para los dos formatos de hostname `pages.dev`; la regla no se aplica al dominio final.

El sitio está desplegado en [ingenierosab.pages.dev](https://ingenierosab.pages.dev/) y conectado a la rama `master` de `beco360/ingenierosab`. La integración de GitHub se autorizó explícitamente solo para ese repositorio.

Comprobaciones públicas realizadas el 2026-10-22:

- `/`, `/services`, `/about`, `/robots.txt` y `/sitemap.xml` responden 200 por HTTPS.
- Canonical y sitemap usan `https://ingenierosab.com/`, `/services` y `/about`. Las tres páginas no contienen una etiqueta meta `noindex`; la cabecera `X-Robots-Tag: noindex, nofollow` protege el hostname `pages.dev`.
- Las 15 redirecciones históricas responden 301 con el destino previsto, incluida `/servicios/dise%C3%B1os-planimetria.html` hacia `/services#design-plans`.
- `/projects.html`, `/proyectos.html` y `/ruta-inexistente-verificacion` responden 404 reales.
- Los 15 recursos comprobados, incluidos los seis logos, imágenes, estilos y JavaScript, responden 200, tienen el tipo de contenido esperado y coinciden por hash con el paquete local.
- Las cabeceras CSP, `X-Content-Type-Options`, `Referrer-Policy` y `Permissions-Policy` están presentes.
- En el navegador, el formulario abre bajo la CSP publicada y el comparador responde a la flecha del teclado, pasando de 50 a 51. No se envió ningún mensaje.

Se observó una diferencia por cliente HTTP: Cloudflare devuelve 403 al identificador `Python-urllib/3.13` y 200 al identificador explícito de verificación en la misma URL. No se atribuye este comportamiento al código del sitio; queda pendiente revisar el acceso de rastreadores al activar el dominio personalizado.

La zona `ingenierosab.com` está creada en el plan Free con los servidores asignados `algin.ns.cloudflare.com` y `novalee.ns.cloudflare.com`. El usuario autorizó explícitamente el cambio y Hostinger confirmó que los servidores de nombres se guardaron; el resolver `1.1.1.1` ya devuelve ambos servidores de Cloudflare. La propagación y la comprobación de la zona en Cloudflare siguen pendientes. Pages no permite asociar el dominio raíz hasta que la zona esté activa. La regla de redirección de `www` está habilitada en la zona, pero todavía no se ha verificado públicamente. Faltan la activación de la zona, la asociación del dominio y las comprobaciones de HTTPS e indexabilidad del dominio final.

## Límites de esta revisión

No se ejecutó una auditoría completa con lector de pantalla ni se certifica conformidad WCAG. No hay puntuación Lighthouse ni datos de Core Web Vitals en visitantes reales. La indexación y la visibilidad en buscadores o respuestas de IA se verifican después de publicar; no se prometen posiciones.

Se implementaron estructura semántica, contraste, foco visible, controles etiquetados, movimiento reducido, contenido descriptivo, datos de empresa consistentes, metadatos y sitemap. Google indica que sus funciones de IA se apoyan en los fundamentos de SEO existentes; no requieren un archivo especial de IA.

Referencias: [Google: funciones de IA](https://developers.google.com/search/docs/appearance/ai-features), [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [datos de Organization](https://developers.google.com/search/docs/appearance/structured-data/organization), [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) y [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## Vista previa y producción

Los archivos de la raíz y GitHub Pages conservan `noindex` como vista previa. El paquete `--production --cloudflare` ya está desplegado en Cloudflare Pages con rutas sin extensión y reglas propias de cabeceras y redirecciones. Publicar `ingenierosab.com` todavía requiere activar sus DNS y asociar el dominio; el estado y los pasos pendientes están en `deploy/CLOUDFLARE.md`. La alternativa con Docker permanece en `deploy/HOMELAB.md`. Esta revisión confirma el despliegue en `pages.dev`, no la activación del dominio final. El repositorio no configura un dominio personalizado de GitHub Pages mediante `CNAME`.
