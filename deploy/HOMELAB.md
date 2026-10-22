---
type: deployment
status: prepared
date: 2026-10-22
---

# Alojamiento en un servidor propio

La web es estática y puede servirse en un homelab con Docker Compose. No necesita base de datos ni un servicio de formularios.

## Preparar y arrancar

Desde la raíz del repositorio, con Node.js y Docker Compose disponibles:

```powershell
node scripts/package.mjs --production
docker compose build
docker compose up -d
```

El sitio queda en `http://127.0.0.1:8088`. Comprobar que el puerto esté libre; la variable `INGENIEROSAB_PORT` permite cambiarlo. Para detenerlo: `docker compose down`.

El contenedor usa una imagen fijada por digest, un usuario sin privilegios, archivos de solo lectura y límites de recursos. Su comprobación de salud consulta `/health`.

## Acceso público

El flujo previsto es `ingenierosab.com → túnel o proxy HTTPS → 127.0.0.1:8088 → contenedor`. Por ejemplo, Cloudflare Tunnel puede conectar el dominio al servicio local. Mantener el puerto del contenedor en loopback y gestionar HTTPS en el túnel o proxy.

La configuración del dominio y del túnel se realiza por separado. Antes de publicar:

1. Apuntar `ingenierosab.com` al servicio y definir la redirección permanente de `www` al dominio canónico.
2. Permitir GET y HEAD para las páginas, estilos, scripts, imágenes, `robots.txt` y `sitemap.xml`.
3. Comprobar desde fuera HTTPS, navegación, redirecciones, caché y respuestas 404, además del acceso legítimo de los buscadores.

Nginx proporciona compresión, cabeceras HTTP, caché y redirecciones 301 desde las antiguas rutas de cultura y servicios. Esta configuración solo funciona en el contenedor; GitHub Pages no la ejecuta.

## Indexación

La raíz del repositorio y GitHub Pages son la vista previa: conservan `noindex`. El paquete creado con `--production` lo retira y utiliza `https://ingenierosab.com/` como dominio canónico. No hay un archivo `CNAME` para trasladar GitHub Pages al dominio final.

Una vez activo el dominio, comprobar la indexabilidad en Search Console y enviar `https://ingenierosab.com/sitemap.xml`. La disponibilidad pública depende de la conexión y del servidor. La indexación o aparición en resultados de búsqueda y respuestas de IA no está garantizada.
