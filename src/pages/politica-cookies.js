import Layout from '../components/Layout'
import SEO from '../components/SEO'
import Breadcrumbs from '../components/Breadcrumbs'

export default function CookiesPolicy() {
  return (
    <Layout>
      <SEO 
        title="Política de Cookies | Guía Tech"
        description="Conoce cómo utilizamos las cookies en Guía Tech"
      />
      
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />
        
        <h1 className="text-3xl font-bold text-blue-600 mb-8 font-geist-sans">
          Política de Cookies
        </h1>

        <div className="prose prose-lg max-w-none">
          <h2>¿Qué son las cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que los sitios web colocan en tu dispositivo 
            mientras navegas. Se utilizan ampliamente para hacer que los sitios web funcionen de 
            manera más eficiente, así como para proporcionar información a los propietarios del sitio.
          </p>

          <h2>¿Qué tipos de cookies utilizamos?</h2>
          
          <h3>Cookies Esenciales</h3>
          <p>
            Algunas cookies son esenciales para el funcionamiento de nuestro sitio. Incluyen, 
            por ejemplo, cookies que permiten recordar tus preferencias de consentimiento.
          </p>

          <h3>Cookies Analíticas</h3>
          <p>
            Utilizamos cookies analíticas para entender cómo los visitantes interactúan con 
            nuestro sitio web. Esto nos ayuda a mejorar la funcionalidad y el contenido.
          </p>

          <h3>Cookies de Marketing y Afiliados</h3>
          <p>
            Estas cookies nos permiten medir la efectividad de nuestra publicidad y programa 
            de afiliados. Son esenciales para mantener el sitio y poder seguir ofreciendo 
            contenido gratuito y de calidad.
          </p>

          <h2>¿Cómo controlar las cookies?</h2>
          <p>
            Puedes configurar tu navegador para rechazar todas las cookies, o para que te avise 
            cuando se envía una cookie. Sin embargo, si bloqueas todas las cookies, es posible 
            que algunas partes de nuestro sitio no funcionen correctamente.
          </p>

          <h2>Cookies de Terceros</h2>
          <p>
            Trabajamos con varios socios que pueden establecer cookies en tu dispositivo cuando 
            visitas nuestro sitio para permitir:
          </p>
          <ul>
            <li>Análisis de uso del sitio (Google Analytics)</li>
            <li>Seguimiento de conversiones de afiliados (Amazon, PcComponentes, etc.)</li>
            <li>Funcionalidades de redes sociales</li>
          </ul>

          <h2>Actualización de esta política</h2>
          <p>
            Esta política se actualizó por última vez el 24 de octubre de 2024. 
            Nos reservamos el derecho de modificar esta política en cualquier momento. 
            Los cambios y clarificaciones entrarán en vigor inmediatamente después de su publicación.
          </p>
        </div>
      </div>
    </Layout>
  )
}