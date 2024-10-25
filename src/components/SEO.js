import Head from 'next/head'

export default function SEO({ 
  title = 'Guía Tech - Reviews y Análisis de Tecnología',
  description = 'Tu fuente confiable de análisis y reviews tecnológicos. Encuentra comparativas, guías de compra y reviews detallados.',
  keywords = 'tech, reviews, tecnología, comparativas, guías de compra',
  ogImage = '/og-image.jpg'  // Añadiremos esta imagen después
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      
      {/* Verificación de motores de búsqueda (los añadiremos después) */}
      {/* <meta name="google-site-verification" content="tu-código-de-verificación" /> */}
    </Head>
  )
}