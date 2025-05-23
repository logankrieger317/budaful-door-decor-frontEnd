import { writeFileSync } from 'fs';
import { format } from 'date-fns';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Categories
const categories = [
  'wired-ribbon',
  'velvet-ribbon',
  'embossed-ribbon',
  'diamond-dust-ribbon',
  'satin-ribbon',
  'acetate-ribbon'
];

const baseUrl = 'https://budafuldoordesigns.com';

function generateSitemap() {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const staticPages = [
    '',
    '/products',
    '/about',
    '/contact',
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastmod: today,
    changefreq: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? '1.0' : '0.8'
  }));

  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/products?category=${category}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.8'
  }));

  const pages = [...staticPages, ...categoryPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  writeFileSync(outputPath, sitemap);
  console.log('Sitemap generated successfully!');
}

generateSitemap();
