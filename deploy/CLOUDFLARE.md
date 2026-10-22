---
type: deployment
status: deployed
date: 2026-10-22
---

# Publicación en Cloudflare Pages

Cloudflare Pages sirve la web estática desde el repositorio de GitHub. No requiere Docker, Functions ni base de datos. El dominio de producción [ingenierosab.com](https://ingenierosab.com/) está activo y verificado por HTTPS; la compra y renovación del dominio se gestionan por separado en Hostinger.

## Repositorio conectado

El sitio está desplegado en [ingenierosab.pages.dev](https://ingenierosab.pages.dev/) y conectado a `beco360/ingenierosab`. La integración de GitHub se autorizó explícitamente solo para este repositorio. La configuración activa usa estos valores:

| Ajuste | Valor |
|---|---|
| Rama de producción | `master` |
| Framework | Ninguno |
| Directorio raíz | Raíz del repositorio |
| Comando de compilación | `node scripts/package.mjs --production --cloudflare` |
| Directorio de salida | `dist` |

El comando genera las tres páginas y copia únicamente los archivos públicos necesarios. `--cloudflare` adapta enlaces y metadatos a `/services` y `/about`, porque Pages redirige automáticamente las rutas terminadas en `.html`. Las fuentes de la raíz conservan sus rutas y el bloqueo de indexación para la vista previa de GitHub Pages.

`deploy/cloudflare/_headers` añade las cabeceras de seguridad y `noindex` a los dominios `pages.dev`, incluidos los despliegues de revisión. El dominio personalizado queda indexable. `_redirects` conserva las 15 rutas históricas de cultura y servicios; el portafolio retirado devuelve 404. Pages administra la caché sin reglas de larga duración para archivos que mantienen su nombre.

## Estado del dominio al 2026-10-22

La zona `ingenierosab.com` está activa en el plan Free. Usa `algin.ns.cloudflare.com` y `novalee.ns.cloudflare.com`. El usuario autorizó explícitamente el cambio y Hostinger confirmó que esos servidores quedaron guardados, sustituyendo a `orbit.dns-parking.com` y `horizon.dns-parking.com`. El dominio raíz quedó asociado a Pages mediante CNAME `@` hacia `ingenierosab.pages.dev`, sustituyendo el registro A de estacionamiento. El servidor autoritativo y el resolver `1.1.1.1` ya devolvieron las direcciones de Cloudflare; el acceso final se comprobó mediante resolución DNS normal.

Las consultas públicas previas al cambio de servidores mostraron un registro A en la raíz hacia `2.57.91.91` y `www` como CNAME hacia `ingenierosab.com`. No se observaron registros AAAA, MX, TXT, CAA, DS ni DNSKEY en la raíz; `_dmarc` no existía y no se observó DNSSEC activo. Es una referencia del estado anterior, no la configuración DNS final. Las consultas no enumeran todos los subdominios; conservar los registros de correo, verificaciones u otros servicios al realizar cambios posteriores.

La siguiente redirección está creada y habilitada en la zona. Se comprobó públicamente por HTTP y HTTPS, conservando ruta y parámetros:

| Ajuste de la regla | Valor |
|---|---|
| Nombre | `Redirect WWW to canonical HTTPS` |
| Filtro | `(http.host eq "www.ingenierosab.com")` |
| Destino dinámico | `concat("https://ingenierosab.com", http.request.uri.path)` |
| Código | `301` |
| Conservar parámetros | `preserve_query_string: true` |

## Tareas posteriores

1. Verificar el dominio en Search Console y enviar `https://ingenierosab.com/sitemap.xml`; ambas acciones siguen pendientes.
2. Revisar indexación y datos de Core Web Vitals cuando existan visitas y datos suficientes. No hay mediciones de visitantes reales ni puntuación Lighthouse registradas.
3. Completar una auditoría con lector de pantalla; todavía no se ha realizado ni se certifica conformidad WCAG.

El dominio raíz requiere que Cloudflare administre los DNS. Esto no exige transferir la compra del dominio ni cambiar de registrador; Hostinger conserva la gestión de su registro y renovación.

## Comprobaciones públicas realizadas

En `https://ingenierosab.com/`, el 2026-10-22, con resolución DNS normal y validación TLS sin excepciones:

- `/`, `/services`, `/about`, robots y sitemap responden 200. No hay `noindex` en etiquetas meta ni cabeceras de las páginas vigentes. Canonical y sitemap usan el dominio final y sus rutas sin extensión; los tres bloques de JSON-LD se interpretan correctamente.
- `www` por HTTP y HTTPS redirige 301 a la raíz HTTPS. La raíz HTTP también redirige 301 a HTTPS. Se comprobó conservación de `/services?origen=verificacion&servicio=remodelacion` en los tres casos.
- Las 15 redirecciones históricas responden 301 al destino previsto, incluida la ruta con `ñ`.
- `/projects.html`, `/proyectos.html` y una ruta inexistente responden 404 reales.
- Los 15 recursos publicados responden 200 con el tipo de contenido esperado y el mismo hash que el paquete local. Las cabeceras de seguridad están presentes.
- `https://ingenierosab.pages.dev/` mantiene `X-Robots-Tag: noindex, nofollow`.

En `https://ingenierosab.pages.dev/`, el 2026-10-22:

- `/`, `/services`, `/about`, robots y sitemap responden 200. Canonical y sitemap apuntan a `https://ingenierosab.com/` y a sus rutas sin extensión.
- Las 15 URLs antiguas responden 301 al destino previsto, incluida `/servicios/dise%C3%B1os-planimetria.html`.
- `/projects.html`, `/proyectos.html` y una ruta inexistente responden 404, sin mostrar la portada como sustituto.
- Los 15 recursos comprobados, incluidos los seis logos, responden 200 con el tipo de contenido correcto y el mismo hash que los archivos del paquete local.
- El hostname `pages.dev` devuelve `X-Robots-Tag: noindex, nofollow` y las cabeceras de seguridad previstas.
- El formulario abre en el navegador bajo la CSP publicada; el comparador responde a la flecha del teclado de 50 a 51. El formulario prepara el mensaje y la persona confirma el envío en WhatsApp o correo; no se envió ningún mensaje durante la prueba.

En `pages.dev`, el cliente HTTP `Python-urllib/3.13` recibió 403 mientras el identificador explícito de verificación recibió 200 en la misma URL. En AI Crawl Control > Security, los controles `Block Crawler` aparecen desactivados para Googlebot, Bingbot, ChatGPT-User, OAI-SearchBot, Claude-SearchBot y PerplexityBot, entre los rastreadores listados. No se modificaron esos controles. Esta observación del panel no prueba el acceso real de los bots ni confirma indexación.

La publicación y la configuración permiten rastreo, pero no confirman por sí solas indexación o posiciones en buscadores.

## Referencias

- [Desplegar HTML estático](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)
- [Dominios personalizados](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Comportamiento de rutas y errores](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Cabeceras](https://developers.cloudflare.com/pages/configuration/headers/) y [redirecciones](https://developers.cloudflare.com/pages/configuration/redirects/)
