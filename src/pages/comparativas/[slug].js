import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const comparativasData = {
  'iphone-15-pro-vs-s24-ultra': {
    title: 'iPhone 15 Pro vs Samsung S24 Ultra - Comparativa completa',
    date: '23 Oct 2024',
    content: `
      <h2 class="text-2xl font-bold mb-4">Introducción</h2>
      <p class="mb-4">Enfrentamos a los dos buques insignia más potentes del mercado...</p>
      
      <h2 class="text-2xl font-bold mb-4">Diseño y Construcción</h2>
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h3 class="font-bold mb-2">iPhone 15 Pro</h3>
          <p>• Titanio y Ceramic Shield</p>
          <p>• 240g de peso</p>
          <p>• Dynamic Island</p>
        </div>
        <div>
          <h3 class="font-bold mb-2">Samsung S24 Ultra</h3>
          <p>• Titanio y Gorilla Glass</p>
          <p>• 233g de peso</p>
          <p>• Pantalla perforada</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold mb-4">Rendimiento</h2>
      <p class="mb-4">Comparativa detallada de rendimiento entre el A17 Pro y el Snapdragon 8 Gen 3...</p>

      <h2 class="text-2xl font-bold mb-4">Conclusión</h2>
      <p class="mb-4">Después de comparar exhaustivamente ambos dispositivos...</p>
    `,
    metaDescription: 'Comparativa detallada entre iPhone 15 Pro y Samsung S24 Ultra. ¿Cuál es el mejor flagship de 2024?',
    metaKeywords: 'iPhone vs Samsung, comparativa smartphones, iPhone 15 Pro, S24 Ultra'
  }
}

export default function ComparativaPost() {
  const router = useRouter()
  const { slug } = router.query
  
  if (router.isFallback) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-4">
          <p className="text-center">Cargando...</p>
        </div>
      </Layout>
    )
  }

  const comparativa = comparativasData[slug]

  if (!comparativa) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Comparativa no encontrada</h1>
          <p>Lo sentimos, la comparativa que buscas no existe.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO 
        title={`${comparativa.title} | Guía Tech`}
        description={comparativa.metaDescription}
        keywords={comparativa.metaKeywords}
      />
      
      <article className="max-w-4xl mx-auto p-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4 font-geist-sans">
            {comparativa.title}
          </h1>
          <p className="text-gray-500 font-geist-sans">
            Actualizado: {comparativa.date}
          </p>
        </header>

        <div 
          className="prose prose-lg max-w-none font-geist-sans"
          dangerouslySetInnerHTML={{ __html: comparativa.content }}
        />
      </article>
    </Layout>
  )
}