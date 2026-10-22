---
type: deployment
status: dns-pending
date: 2026-10-22
---

# Publicación en Cloudflare Pages

Cloudflare Pages sirve la web estática desde el repositorio de GitHub. No requiere Docker, Functions ni base de datos. El dominio final es `ingenierosab.com`; la compra y renovación del dominio se gestionan por separado.

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

La zona `ingenierosab.com` está creada en el plan Free. Cloudflare le asignó `algin.ns.cloudflare.com` y `novalee.ns.cloudflare.com`. El usuario autorizó explícitamente el cambio y Hostinger confirmó que esos servidores quedaron guardados, sustituyendo a `orbit.dns-parking.com` y `horizon.dns-parking.com`. El resolver `1.1.1.1` ya devuelve ambos servidores de Cloudflare. La propagación y la comprobación de la zona en Cloudflare siguen pendientes; Pages no permite asociar el dominio raíz mientras la zona no esté activa.

Las consultas públicas previas al cambio de servidores mostraron un registro A en la raíz hacia `2.57.91.91` y `www` como CNAME hacia `ingenierosab.com`. No se observaron registros AAAA, MX, TXT, CAA, DS ni DNSKEY en la raíz; `_dmarc` no existía y no se observó DNSSEC activo. Estas consultas no enumeran todos los subdominios ni describen todavía la resolución final de Pages; preservar los registros de correo, verificaciones u otros servicios existentes durante la migración.

La siguiente redirección está creada y habilitada en la zona, pero su funcionamiento público sigue pendiente de la activación de DNS y HTTPS:

| Ajuste de la regla | Valor |
|---|---|
| Nombre | `Redirect WWW to canonical HTTPS` |
| Filtro | `(http.host eq "www.ingenierosab.com")` |
| Destino dinámico | `concat("https://ingenierosab.com", http.request.uri.path)` |
| Código | `301` |
| Conservar parámetros | `preserve_query_string: true` |

## Pasos pendientes

1. Esperar a que Cloudflare confirme la zona activa y añadir `ingenierosab.com` desde Custom domains del proyecto de Pages. La asociación con Pages debe existir antes de apuntar un registro DNS al subdominio `pages.dev`.
2. Comprobar la resolución DNS y los certificados HTTPS de `ingenierosab.com` y `www.ingenierosab.com`.
3. Verificar públicamente la redirección 301 de `www` hacia `https://ingenierosab.com`, conservando ruta y parámetros.
4. Comprobar en el dominio final las páginas, los recursos, las redirecciones históricas y los errores 404. Confirmar ausencia de `noindex`, canonical, datos estructurados y sitemap con las URLs definitivas, además del acceso de rastreadores.

El dominio raíz requiere que Cloudflare administre los DNS. Esto no exige transferir la compra del dominio ni cambiar de registrador; Hostinger conserva la gestión de su registro y renovación.

## Comprobaciones públicas realizadas

En `https://ingenierosab.pages.dev/`, el 2026-10-22:

- `/`, `/services`, `/about`, robots y sitemap responden 200. Canonical y sitemap apuntan a `https://ingenierosab.com/` y a sus rutas sin extensión.
- Las 15 URLs antiguas responden 301 al destino previsto, incluida `/servicios/dise%C3%B1os-planimetria.html`.
- `/projects.html`, `/proyectos.html` y una ruta inexistente responden 404, sin mostrar la portada como sustituto.
- Los 15 recursos comprobados, incluidos los seis logos, responden 200 con el tipo de contenido correcto y el mismo hash que los archivos del paquete local.
- El hostname `pages.dev` devuelve `X-Robots-Tag: noindex, nofollow` y las cabeceras de seguridad previstas.
- El formulario abre en el navegador bajo la CSP publicada; el comparador responde a la flecha del teclado de 50 a 51. El formulario prepara el mensaje y la persona confirma el envío en WhatsApp o correo; no se envió ningún mensaje durante la prueba.

El cliente HTTP `Python-urllib/3.13` recibió 403 mientras el identificador explícito de verificación recibió 200 en la misma URL. Revisar el acceso de rastreadores cuando se active el dominio personalizado. Estas comprobaciones de `pages.dev` no confirman todavía el funcionamiento del dominio final.

Después de comprobar el dominio, verificarlo en Search Console y enviar `https://ingenierosab.com/sitemap.xml`. La configuración no confirma por sí sola indexación o posiciones en buscadores.

## Referencias

- [Desplegar HTML estático](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)
- [Dominios personalizados](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Comportamiento de rutas y errores](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Cabeceras](https://developers.cloudflare.com/pages/configuration/headers/) y [redirecciones](https://developers.cloudflare.com/pages/configuration/redirects/)
