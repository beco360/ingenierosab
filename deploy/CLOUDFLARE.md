---
type: deployment
status: prepared
date: 2026-10-22
---

# Publicación en Cloudflare Pages

Cloudflare Pages sirve la web estática desde el repositorio de GitHub. No requiere Docker, Functions ni base de datos. El dominio final es `ingenierosab.com`; la compra y renovación del dominio se gestionan por separado.

## Conectar el repositorio

En Workers & Pages, crear una aplicación de Pages e importar el repositorio existente `beco360/ingenierosab`. Conceder acceso de GitHub únicamente al repositorio necesario.

| Ajuste | Valor |
|---|---|
| Rama de producción | `master` |
| Framework | Ninguno |
| Directorio raíz | Raíz del repositorio |
| Comando de compilación | `node scripts/package.mjs --production --cloudflare` |
| Directorio de salida | `dist` |

El comando genera las tres páginas y copia únicamente los archivos públicos necesarios. `--cloudflare` adapta enlaces y metadatos a `/services` y `/about`, porque Pages redirige automáticamente las rutas terminadas en `.html`. Las fuentes de la raíz conservan sus rutas y el bloqueo de indexación para la vista previa de GitHub Pages.

`deploy/cloudflare/_headers` añade las cabeceras de seguridad y `noindex` a los dominios `pages.dev`, incluidos los despliegues de revisión. El dominio personalizado queda indexable. `_redirects` conserva las 15 rutas históricas de cultura y servicios; el portafolio retirado devuelve 404. Pages administra la caché sin reglas de larga duración para archivos que mantienen su nombre.

## Conectar el dominio

1. Añadir `ingenierosab.com` a la cuenta de Cloudflare y elegir el plan gratuito. Revisar los registros importados, incluidos correo, verificaciones y subdominios existentes.
2. Cambiar en el proveedor del dominio los servidores DNS por los dos que Cloudflare asigne a esta zona. Si existe DNSSEC activo, seguir el procedimiento de migración indicado por Cloudflare antes de cambiar la delegación.
3. Una vez activa la zona, añadir `ingenierosab.com` desde Custom domains del proyecto de Pages. La asociación con Pages debe existir antes de apuntar un registro DNS al subdominio `pages.dev`.
4. Configurar `www.ingenierosab.com` para redirigir permanentemente a `https://ingenierosab.com`, conservando ruta y parámetros, y comprobar el certificado HTTPS de ambos nombres.

El dominio raíz requiere que Cloudflare administre los DNS. Esto no exige transferir la compra del dominio ni cambiar de registrador. No utilizar servidores DNS de ejemplo: cada zona tiene su asignación.

## Comprobaciones de publicación

- `/`, `/services` y `/about` responden 200 con imágenes y navegación correctas.
- Las URLs antiguas responden 301 al destino previsto; probar también `/servicios/dise%C3%B1os-planimetria.html`.
- `/projects.html`, `/proyectos.html` y una ruta inexistente responden 404, sin mostrar la portada como sustituto.
- El dominio final sirve HTTPS, no contiene `noindex` y publica canonical, datos estructurados y sitemap con las rutas definitivas.
- El dominio `pages.dev` devuelve `X-Robots-Tag: noindex, nofollow`.
- Menú, comparador y formulario funcionan bajo la política de seguridad. El formulario prepara el mensaje; la persona confirma el envío en WhatsApp o correo.

Después de comprobar el dominio, verificarlo en Search Console y enviar `https://ingenierosab.com/sitemap.xml`. La configuración no confirma por sí sola indexación o posiciones en buscadores.

## Referencias

- [Desplegar HTML estático](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)
- [Dominios personalizados](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Comportamiento de rutas y errores](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Cabeceras](https://developers.cloudflare.com/pages/configuration/headers/) y [redirecciones](https://developers.cloudflare.com/pages/configuration/redirects/)
