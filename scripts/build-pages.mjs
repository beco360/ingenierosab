import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = name => readFile(path.join(root, name), 'utf8');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const { groups } = JSON.parse(await read('content/services.json'));
const company = JSON.parse(await read('content/company.json'));
let home = await read('index.html');
const options = '<option value="">Selecciona un servicio</option><optgroup label="Tu apartamento">' + ['Remodelación de apartamentos', 'Cocinas y baños', 'Pisos y acabados', 'Diseño y planeación'].map(title => `<option>${escape(title)}</option>`).join('') + '</optgroup>' + groups.map(group => `<optgroup label="${escape(group.title)}">${group.services.map(service => `<option>${escape(service.title)}</option>`).join('')}</optgroup>`).join('') + '<option>Quiero orientación</option>';
home = home.replace(/(<select id="project-type"[^>]*>)[\s\S]*?<\/select>/, `$1${options}</select>`);
await writeFile(path.join(root, 'index.html'), home);
const sourceGraph = JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
const header = home.match(/<header class="site-header">[\s\S]*?<\/header>/)[0];
const footer = home.match(/<footer class="shell">[\s\S]*?<\/footer>/)[0];
const dialog = home.match(/<dialog class="contact-dialog"[\s\S]*?<\/dialog>/)[0];
const fromHome = markup => markup.replace(/href="#(inicio|proceso|contacto)"/g, 'href="index.html#$1"');
const contact = '<section class="page-cta shell"><p class="eyebrow">HABLEMOS DE TU PROYECTO</p><h2>El primer paso es <em>conversar.</em></h2><p>Cuéntanos qué necesitas, dónde está el proyecto y en qué etapa te encuentras.</p><button class="button button-dark" data-contact>Preparar mi consulta <svg class="icon icon-arrow-up-right" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 17 17 7M7 7h10v10"/></svg></button></section>';

function renderPage({ file, title, description, label, body, extraSchema = [] }) {
  const url = `https://ingenierosab.com/${file}`;
  const graph = structuredClone(sourceGraph['@graph'].slice(0, 2));
  graph[0].description = company.intro;
  graph.push({ '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description, inLanguage: 'es-CO', isPartOf: { '@id': 'https://ingenierosab.com/#website' }, about: { '@id': 'https://ingenierosab.com/#organization' }, breadcrumb: { '@id': `${url}#breadcrumb` } });
  graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://ingenierosab.com/' }, { '@type': 'ListItem', position: 2, name: label, item: url }] });
  graph.push(...extraSchema);
  const pageHeader = fromHome(header).replaceAll(`href="${file}"`, `href="${file}" aria-current="page"`).replaceAll('Hablemos de tu apartamento', 'Hablemos de tu proyecto');
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f4f2ec">
  <meta name="description" content="${escape(description)}">
  <meta name="robots" content="noindex, nofollow">
  <title>${escape(title)}</title>
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_CO">
  <meta property="og:site_name" content="Ingenieros AB">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="https://ingenierosab.com/assets/social-cover.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Ingenieros AB. Interior conceptual generado con IA.">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')}</script>
  <link rel="icon" type="image/svg+xml" href="assets/mark.svg">
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="pages.css">
  <script src="app.js" defer></script>
</head>
<body class="detail-page">
  <a class="skip-link" href="#main">Ir al contenido</a>
  <div class="scroll-progress" aria-hidden="true"></div>
  ${pageHeader}
  <main id="main">${body}${contact}</main>
  ${fromHome(footer)}
  ${dialog}
</body>
</html>
`;
}

let serviceNumber = 0;
const serviceBody = `<section class="page-hero shell"><p class="eyebrow"><a href="index.html">INICIO</a> / SERVICIOS</p><h1>De tu idea<br>a la <em>obra.</em></h1><p class="page-lead">Diseño, remodelación, acabados y construcción en Bogotá y Colombia. Una oferta que reúne la transformación de apartamentos y las necesidades de proyectos de vivienda, comercio y obra civil.</p><nav class="page-jump-links" aria-label="Familias de servicios">${groups.map(group => `<a href="#${group.id}">${escape(group.title)} <svg class="icon icon-arrow-down" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 5v14m-6-6 6 6 6-6"/></svg></a>`).join('')}</nav></section>
${groups.map(group => `<section class="page-section shell catalog-group" id="${group.id}" aria-labelledby="${group.id}-title"><header><h2 id="${group.id}-title">${escape(group.title)}</h2><p>${escape(group.intro)}</p></header><div class="catalog-grid">${group.services.map(service => `<article class="catalog-card" id="${service.id}"><span class="catalog-number">${String(++serviceNumber).padStart(2, '0')}</span><h3>${escape(service.title)}</h3><p>${escape(service.description)}</p><ul>${service.scope.map(item => `<li>${escape(item)}</li>`).join('')}</ul><button class="text-link" data-contact data-service="${escape(service.title)}">Consultar este servicio <svg class="icon icon-arrow-up-right" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 17 17 7M7 7h10v10"/></svg></button></article>`).join('')}</div></section>`).join('')}`;
const catalogSchema = { '@type': 'OfferCatalog', name: 'Servicios de Ingenieros AB', itemListElement: groups.map(group => ({ '@type': 'OfferCatalog', name: group.title, itemListElement: group.services.map(service => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: service.title, description: service.description, url: `https://ingenierosab.com/services.html#${service.id}`, provider: { '@id': 'https://ingenierosab.com/#organization' } } })) })) };

const aboutBody = `<section class="page-hero shell"><p class="eyebrow"><a href="index.html">INICIO</a> / NOSOTROS</p><h1>Tus deseos.<br>Nuestra <em>inspiración.</em></h1><p class="page-lead">${escape(company.intro)}</p></section><section class="page-section shell" aria-labelledby="company-title"><div class="section-heading"><p class="eyebrow">NUESTRA CULTURA</p><h2 id="company-title">Construir también<br>es <em>acompañar.</em></h2></div><p class="page-lead">La supervisión forma parte de nuestra manera de trabajar: acompañar la obra desde la cimentación hasta su finalización y entrega, según el alcance del proyecto.</p><div class="company-grid"><article class="company-statement"><h2>Nuestra misión</h2><p>${escape(company.mission)}</p></article><article class="company-statement"><h2>Nuestra visión</h2><p>${escape(company.vision)}</p></article></div><div class="company-values">${company.values.map(value => `<article><h3>${escape(value.title)}</h3><p>${escape(value.description)}</p></article>`).join('')}</div></section><section class="page-section shell" aria-labelledby="clients-title"><div class="section-heading"><p class="eyebrow">NUESTRA TRAYECTORIA</p><h2 id="clients-title">Clientes en nuestra<br><em>trayectoria.</em></h2></div><p class="page-note">Organizaciones mencionadas como clientes en el sitio original de Ingenieros AB. Referencias históricas de clientes.</p><div class="client-grid">${company.clients.map(client => `<figure><img src="${client.image}" width="180" height="120" alt="" loading="lazy" decoding="async"><figcaption>${escape(client.name)}</figcaption></figure>`).join('')}</div></section><section class="page-section shell" aria-labelledby="social-title"><p class="eyebrow">SIGAMOS EN CONTACTO</p><h2 id="social-title">Nuestros canales.</h2><p class="page-lead">Escríbenos a <a href="mailto:ingenierosabsas@gmail.com">ingenierosabsas@gmail.com</a> o conversa por <a href="https://wa.me/573102918515" target="_blank" rel="noopener noreferrer">WhatsApp al +57 310 291 8515</a>.</p><p class="page-note">Redes enlazadas en nuestro sitio original:</p><nav class="footer-social" aria-label="Redes sociales del sitio original"><a href="https://www.instagram.com/ingenierosabsas/" target="_blank" rel="noopener noreferrer">Instagram <svg class="icon icon-arrow-up-right" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 17 17 7M7 7h10v10"/></svg></a><a href="https://www.facebook.com/ingenierosab" target="_blank" rel="noopener noreferrer">Facebook <svg class="icon icon-arrow-up-right" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 17 17 7M7 7h10v10"/></svg></a><a href="https://www.twitter.com/ingenierosab" target="_blank" rel="noopener noreferrer">X / Twitter <svg class="icon icon-arrow-up-right" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 17 17 7M7 7h10v10"/></svg></a></nav></section>`;

const pages = [
  { file: 'services.html', title: 'Servicios de remodelación, diseño y obra | Ingenieros AB', description: 'Conoce los 14 servicios de Ingenieros AB: remodelación y acabados, diseño y presupuestos, supervisión, topografía, concretos y ejecución de obra.', label: 'Servicios', body: serviceBody, extraSchema: [catalogSchema] },
  { file: 'about.html', title: 'Nosotros: diseño, construcción y supervisión | Ingenieros AB', description: 'Conoce la cultura, misión, visión y trayectoria de Ingenieros AB, empresa de diseño, construcción, remodelación y supervisión en Bogotá, Colombia.', label: 'Nosotros', body: aboutBody }
];
for (const page of pages) await writeFile(path.join(root, page.file), renderPage(page));
const urls = ['https://ingenierosab.com/', ...pages.map(page => `https://ingenierosab.com/${page.file}`)];
await writeFile(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log('Servicios, nosotros, formulario compartido y sitemap preparados.');
