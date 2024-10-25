import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1 - Logo y descripción */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-white font-geist-sans">
              Guía Tech
            </Link>
            <p className="text-sm font-geist-sans">
              Tu fuente confiable de análisis y reviews tecnológicos. Guías de compra y comparativas imparciales.
            </p>
          </div>

          {/* Columna 2 - Enlaces rápidos */}
          <div>
            <h3 className="text-white font-bold mb-4 font-geist-sans">Enlaces Rápidos</h3>
            <ul className="space-y-2 font-geist-sans">
              <li>
                <Link href="/reviews" className="hover:text-white transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/comparativas" className="hover:text-white transition-colors">
                  Comparativas
                </Link>
              </li>
              <li>
                <Link href="/guias" className="hover:text-white transition-colors">
                  Guías de Compra
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 - Categorías */}
          <div>
            <h3 className="text-white font-bold mb-4 font-geist-sans">Categorías</h3>
            <ul className="space-y-2 font-geist-sans">
              <li>
                <Link href="/categoria/smartphones" className="hover:text-white transition-colors">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link href="/categoria/laptops" className="hover:text-white transition-colors">
                  Portátiles
                </Link>
              </li>
              <li>
                <Link href="/categoria/gadgets" className="hover:text-white transition-colors">
                  Gadgets
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4 - Legal */}
          <div>
            <h3 className="text-white font-bold mb-4 font-geist-sans">Legal</h3>
            <ul className="space-y-2 font-geist-sans">
              <li>
                <Link href="/politica-privacidad" className="hover:text-white transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos-condiciones" className="hover:text-white transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link href="/afiliados" className="hover:text-white transition-colors">
                  Política de Afiliados
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Amazon Affiliates Disclaimer */}
        <div className="border-t border-gray-800 mt-8 pt-8 space-y-4">
          <div className="text-xs text-gray-400 space-y-2 font-geist-sans max-w-3xl mx-auto">
            <p>
              guia-tech.com participa en el Programa de Afiliados de Amazon EU, un programa de publicidad 
              para afiliados diseñado para ofrecer a sitios web un modo de obtener comisiones por publicidad, 
              publicitando e incluyendo enlaces a Amazon.es
            </p>
            <p>
              Los precios y la disponibilidad de los productos mostrados son precisos según la fecha/hora indicada 
              y están sujetos a cambios. Cualquier información de precio y disponibilidad mostrada en amazon.es 
              en el momento de la compra se aplicará a este producto.
            </p>
            <p>
              Amazon y el logotipo de Amazon son marcas comerciales de Amazon.com, Inc. o de sociedades de su grupo.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm font-geist-sans">
          <p>© {new Date().getFullYear()} Guía Tech. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}