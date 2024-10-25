export class SEOManager {
    static baseUrl = 'https://guia-tech.com'
    static siteName = 'Guía Tech'
  
    static websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://guia-tech.com",
      "name": "Guía Tech",
      "description": "Reviews, comparativas y guías de compra de tecnología",
      "publisher": {
        "@type": "Organization",
        "name": "Guía Tech",
        "logo": {
          "@type": "ImageObject",
          "url": "https://guia-tech.com/logo.png"
        }
      }
    }
  
    static generateMetaTags(page) {
      const title = this.formatTitle(page.title)
      const canonicalUrl = this.getCanonicalUrl(page.url)
      const description = page.description || this.getDefaultDescription(page.type)
  
      return {
        title,
        description,
        canonical: canonicalUrl,
        openGraph: {
          title,
          description,
          url: canonicalUrl,
          type: this.getOGType(page.type),
          images: this.getOGImages(page),
          site_name: this.siteName
        },
        twitter: {
          card: 'summary_large_image',
          site: '@guiatech',
          title,
          description,
          image: this.getTwitterImage(page)
        },
        alternates: {
          canonical: canonicalUrl
        },
        robots: this.getRobotsDirectives(page)
      }
    }
  
    static generateSchema(page) {
      switch (page.type) {
        case 'review':
          return {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": page.productName,
            "description": page.description,
            "brand": {
              "@type": "Brand",
              "name": page.brand
            },
            "review": {
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": page.rating,
                "bestRating": "10",
                "worstRating": "0"
              },
              "author": {
                "@type": "Organization",
                "name": this.siteName
              },
              "datePublished": page.date
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": page.rating,
              "reviewCount": page.reviewCount || 1
            },
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "EUR",
              "lowPrice": page.lowestPrice,
              "highPrice": page.highestPrice,
              "offerCount": page.offerCount || 1,
              "availability": "https://schema.org/InStock"
            }
          }
        case 'comparison':
          return {
            "@context": "https://schema.org/",
            "@type": "Article",
            "headline": page.title,
            "description": page.description,
            "author": {
              "@type": "Organization",
              "name": this.siteName
            },
            "datePublished": page.date,
            "dateModified": page.lastUpdated || page.date
          }
        case 'guide':
          return {
            "@context": "https://schema.org/",
            "@type": "HowTo",
            "name": page.title,
            "description": page.description,
            "step": page.steps.map((step, index) => ({
              "@type": "HowToStep",
              "position": index + 1,
              "name": step.title,
              "text": step.description
            }))
          }
        default:
          return this.websiteSchema
      }
    }
  
    static generateSitemap() {
      // Implementaremos esto en el siguiente paso
    }
  
    static generateRobots() {
      return `
  User-agent: *
  Allow: /
  
  # Sitemaps
  Sitemap: ${this.baseUrl}/sitemap.xml
  Sitemap: ${this.baseUrl}/sitemap-reviews.xml
  Sitemap: ${this.baseUrl}/sitemap-comparativas.xml
  Sitemap: ${this.baseUrl}/sitemap-guias.xml
  
  # Directories
  Disallow: /admin/
  Disallow: /api/
  Disallow: /_next/
  Disallow: /static/
  
  # Files
  Disallow: /*.json$
  Disallow: /*.xml$
  Disallow: /*.txt$
  
  # Parameters
  Disallow: /*?*
  Allow: /*?q=*
  `
    }
  
    // Métodos privados de ayuda
    static formatTitle(title) {
      return title.includes(this.siteName) ? title : `${title} | ${this.siteName}`
    }
  
    static getCanonicalUrl(path) {
      return `${this.baseUrl}${path}`
    }
  
    static getDefaultDescription(type) {
      const descriptions = {
        review: 'Análisis detallado con pros, contras y opinión experta',
        comparison: 'Comparativa detallada para ayudarte a elegir',
        guide: 'Guía completa con recomendaciones y consejos de compra'
      }
      return descriptions[type] || ''
    }
  
    static getOGType(pageType) {
      const types = {
        review: 'product',
        comparison: 'article',
        guide: 'article',
        category: 'website'
      }
      return types[pageType] || 'website'
    }
  
    static getOGImages(page) {
      if (page.ogImage) {
        return [{ url: this.getCanonicalUrl(page.ogImage) }]
      }
      return [{ url: `${this.baseUrl}/og-default.jpg` }]
    }
  
    static getTwitterImage(page) {
      return page.twitterImage || page.ogImage || '/og-default.jpg'
    }
  
    static getRobotsDirectives(page) {
      if (page.noindex) {
        return {
          index: false,
          follow: true
        }
      }
      return {
        index: true,
        follow: true
      }
    }
  }