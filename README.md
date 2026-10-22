---
type: project
status: prepared
date: 2026-10-22
---

# Ingenieros AB

Sitio estático centrado en remodelación de apartamentos en Bogotá, con el catálogo completo de servicios y la presentación de la empresa. Diseño y código nuevos, inspirados en el contenido del sitio anterior. Incluye tres páginas: inicio, servicios y nosotros.

## Vista previa

Desde la raíz del repositorio:

```powershell
py -3.11 -m http.server 4173 --bind 127.0.0.1
```

Abrir [la vista previa local](http://127.0.0.1:4173/). Los archivos de la raíz conservan `noindex` y una nota de propuesta. GitHub Pages sirve esta misma versión de revisión desde la raíz de `master`, en [beco360.github.io/ingenierosab](https://beco360.github.io/ingenierosab/).

Los metadatos canónicos y el sitemap están preparados para `https://ingenierosab.com/`. El dominio de producción requiere una publicación independiente; no se configura mediante un archivo `CNAME` en este repositorio.

## Contenido y funcionamiento

- Portada de apartamentos, catálogo de 14 servicios y página de empresa con misión, visión, cultura y seis referencias históricas de clientes.
- Formulario que prepara un mensaje y permite copiarlo o abrir WhatsApp/correo. La persona confirma el envío en su aplicación; el sitio no almacena las respuestas.
- Comparador con tirador sobre la imagen y control por teclado. Ambas imágenes son conceptos generados con Higgsfield, identificados como tales; no representan una obra ejecutada.
- HTML semántico, controles etiquetados, foco visible, menú móvil, diálogo nativo, enlace de salto y movimiento reducido.
- Metadatos sociales, JSON-LD, sitemap e imágenes WebP responsivas. Sin dependencias remotas en tiempo de ejecución.

El catálogo conserva diseño, presupuestos, remodelación, acabados, cubiertas, supervisión, apoyo normativo, concretos, topografía y ejecución de obra. Los clientes y las redes sociales mantienen su contexto histórico; no se atribuyen contratos vigentes. El portafolio de proyectos se retiró.

## Actualizar el contenido

`content/services.json` y `content/company.json` alimentan las páginas internas. La navegación, el pie y el formulario se comparten desde `index.html`:

```powershell
node scripts/build-pages.mjs
```

Este comando actualiza `services.html`, `about.html`, las opciones del formulario y el sitemap. El empaquetador también lo ejecuta.

## Imágenes

`assets/creative-brief.json` registra las generaciones y sus referencias. Las imágenes seleccionadas y sus originales PNG están incluidos. `scripts/prepare-assets.cjs` regenera las variantes y la portada social. `content/client-logos.json` registra las fuentes de los logotipos; `scripts/prepare-archive.cjs` genera sus PNG en `assets/source/clients/` y las versiones WebP de la web a partir de `assets/source/clients/originals/`. Ambos scripts requieren Sharp solo para regenerar imágenes. Las fuentes vectoriales se rasterizan con mayor resolución; las imágenes de mapa de bits no se amplían artificialmente.

El sitio anterior se conserva en el [historial del repositorio](https://github.com/beco360/ingenierosab/tree/2eb241a4496fee0b691fb2c0cbc07c7926ecf6a9).

## Paquete de producción

La publicación prevista utiliza Cloudflare Pages conectado a GitHub:

```powershell
node scripts/package.mjs --production --cloudflare
```

En Pages, seleccionar `master` como rama de producción, el comando anterior como compilación y `dist` como directorio de salida. Esta variante incluye cabeceras y redirecciones propias de Pages y adapta las rutas a `/services` y `/about`. Ver [la guía de Cloudflare](deploy/CLOUDFLARE.md) para conectar el dominio y verificar la publicación.

La alternativa para un servidor propio conserva Docker:

```powershell
node scripts/package.mjs --production
docker compose build
docker compose up -d
```

El empaquetador reconstruye `dist` con una lista explícita de archivos, sin fuentes originales ni documentación. `--production` retira `noindex` y la nota de propuesta, conservando las aclaraciones sobre IA. Sin esa opción, el paquete mantiene el bloqueo de indexación de la vista previa. Node se utiliza para preparar el paquete; no hace falta para servirlo.

Compose expone el sitio en `http://127.0.0.1:8088`. El contenedor aporta compresión, caché, cabeceras de seguridad y redirecciones 301 de las rutas antiguas de cultura y servicios. Estas funciones de Nginx no se aplican a GitHub Pages.

Ver [la alternativa de alojamiento propio](deploy/HOMELAB.md) y [la validación realizada](VALIDATION.md).
