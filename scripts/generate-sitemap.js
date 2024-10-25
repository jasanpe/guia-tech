const fs = require('fs')
const glob = require('glob')
const matter = require('gray-matter')
const xmlBuilder = require('xmlbuilder')

const BASE_URL = 'https://guia-tech.com'
const CONTENT_DIR = 'src/content'

async function generateSitemaps() {
  // Sitemap principal
  const mainSitemap = xmlBuilder.create('urlset', {
    version: '1.0',
    encoding: 'UTF-8'
  })
  mainSitemap.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')

  // URLs estáticas principales
  const mainUrls = [
    '/',
    '/reviews',
    '/comparativas',
    '/guias',
    '/sobre-nosotros',
    '/contacto'
  ]

  mainUrls.forEach(url => {
    const urlEl = mainSitemap.ele('url')
    urlEl.ele('loc', `${BASE_URL}${url}`)
    urlEl.ele('changefreq', 'daily')
    urlEl.ele('priority', url === '/' ? '1.0' : '0.8')
  })

  // Guardar sitemap principal
  fs.writeFileSync(
    'public/sitemap.xml',
    mainSitemap.end({ pretty: true })
  )

  // Generar sitemaps por tipo de contenido
  const contentTypes = ['reviews', 'comparativas', 'guias']
  
  for (const type of contentTypes) {
    const sitemap = xmlBuilder.create('urlset', {
      version: '1.0',
      encoding: 'UTF-8'
    })
    sitemap.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')

    // Encontrar todos los archivos .mdx del tipo
    const files = glob.sync(`${CONTENT_DIR}/${type}/**/*.mdx`)

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8')
      const { data } = matter(content)
      const path = file
        .replace(CONTENT_DIR, '')
        .replace('.mdx', '')
        .replace('/index', '')

      const urlEl = sitemap.ele('url')
      urlEl.ele('loc', `${BASE_URL}${path}`)
      urlEl.ele('lastmod', data.lastUpdated || data.date)
      urlEl.ele('changefreq', getChangeFreq(type))
      urlEl.ele('priority', getPriority(type, data))
    })

    // Guardar sitemap del tipo
    fs.writeFileSync(
      `public/sitemap-${type}.xml`,
      sitemap.end({ pretty: true })
    )
  }

  // Generar sitemap index
  const sitemapIndex = xmlBuilder.create('sitemapindex', {
    version: '1.0',
    encoding: 'UTF-8'
  })
  sitemapIndex.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')

  ;['sitemap.xml', ...contentTypes.map(t => `sitemap-${t}.xml`)].forEach(file => {
    const sitemap = sitemapIndex.ele('sitemap')
    sitemap.ele('loc', `${BASE_URL}/${file}`)
    sitemap.ele('lastmod', new Date().toISOString())
  })

  fs.writeFileSync(
    'public/sitemap-index.xml',
    sitemapIndex.end({ pretty: true })
  )
}

function getChangeFreq(type) {
  const frequencies = {
    reviews: 'weekly',
    comparativas: 'weekly',
    guias: 'monthly'
  }
  return frequencies[type] || 'monthly'
}

function getPriority(type, data) {
  if (data.featured) return '0.9'
  
  const priorities = {
    reviews: '0.8',
    comparativas: '0.7',
    guias: '0.7'
  }
  return priorities[type] || '0.5'
}

generateSitemaps().catch(console.error)