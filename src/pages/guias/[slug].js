import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const guiasData = {
  'mejores-portatiles-2024': {
    title: 'Mejores Portátiles 2024 - Guía de Compra Definitiva',
    date: '23 Oct 2024',
    content: `
      <h2 class="text-2xl font-bold mb-4">Introducción</h2>
      <p class="mb-4">Elegir el portátil perfecto en 2024 puede ser abrumador. Esta guía te ayudará a tomar la mejor decisión según tus necesidades...</p>
      
      <h2 class="text-2xl font-bold mb-4">Cómo elegir tu portátil ideal</h2>
      <div class="bg-blue-50 p-6 rounded-lg mb-6">
        <h3 class="font-bold mb-3">Factores clave a considerar:</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>Uso principal (gaming, trabajo, estudiante)</li>
          <li>Presupuesto disponible</li>
          <li>Portabilidad vs rendimiento</li>
          <li>Duración de batería necesaria</li>
        </ul>
      </div>

      <h2 class="text-2xl font-bold mb-4">Mejores opciones por categoría</h2>
      
      <div class="mb-6">
        <h3 class="text-xl font-bold mb-3">Mejor portátil profesional</h3>
        <div class="bg-white shadow-lg rounded-lg p-4">
          <h4 class="font-bold">MacBook Pro 14" M3</h4>
          <p class="text-gray-600 mb-2">Precio: 1.999€</p>
          <ul class="list-disc pl-6">
            <li>Chip M3 Pro/Max</li>
            <li>Hasta 36 horas de batería</li>
            <li>Pantalla Liquid Retina XDR</li>
          </ul>
        </div>
      </div>

      <h2 class="text-2xl font-bold mb-4">Recomendaciones por presupuesto</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="bg-white shadow-lg rounded-lg p-4">
          <h3 class="font-bold mb-2">Menos de 800€</h3>
          <ul class="list-disc pl-6">
            <li>Lenovo IdeaPad 3</li>
            <li>Acer Aspire 5</li>
            <li>HP Pavilion</li>
          </ul>
        </div>
        <div class="bg-white shadow-lg rounded-lg p-4">
          <h3 class="font-bold mb-2">800€ - 1.200€</h3>
          <ul class="list-disc pl-6">
            <li>MacBook Air M1</li>
            <li>Dell Inspiron 15</li>
            <li>ASUS ZenBook</li>
          </ul>
        </div>
      </div>

      <h2 class="text-2xl font-bold mb-4">Conclusión</h2>
      <p class="mb-4">La mejor elección dependerá de tus necesidades específicas...</p>
    `,
    metaDescription: 'Guía completa para elegir el mejor portátil en 2024. Recomendaciones por presupuesto y uso.',
    metaKeywords: 'mejores portátiles 2024, guía compra portátil, laptop gaming, portátil trabajo'
  }
}

export default function GuiaPost() {
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

  const guia = guiasData[slug]

  if (!guia) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Guía no encontrada</h1>
          <p>Lo sentimos, la guía que buscas no existe.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO 
        title={`${guia.title} | Guía Tech`}
        description={guia.metaDescription}
        keywords={guia.metaKeywords}
      />
      
      <article className="max-w-4xl mx-auto p-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4 font-geist-sans">
            {guia.title}
          </h1>
          <p className="text-gray-500 font-geist-sans">
            Actualizado: {guia.date}
          </p>
        </header>

        <div 
          className="prose prose-lg max-w-none font-geist-sans"
          dangerouslySetInnerHTML={{ __html: guia.content }}
        />

        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-bold mb-4">¿Necesitas ayuda para decidir?</h2>
          <p className="mb-4">Déjanos un comentario con tus necesidades específicas y te ayudaremos a elegir el portátil perfecto para ti.</p>
          {/* Aquí irá el formulario de comentarios cuando lo implementemos */}
        </div>
      </article>
    </Layout>
  )
}