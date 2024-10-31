import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Breadcrumbs() {
  const router = useRouter()
  const pathSegments = router.asPath.split('/').filter(segment => segment)

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    
    return { href, label }
  })

  return (
    <nav className="text-sm mb-6">
      <ol className="flex items-center space-x-2 font-geist-sans">
        <li>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Inicio
          </Link>
        </li>
        
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <span className="text-gray-500">/</span>
            {index === breadcrumbItems.length - 1 ? (
              <span className="text-gray-600">{item.label}</span>
            ) : (
              <Link 
                href={item?.href || '/'} // Añadimos el operador opcional y un valor por defecto
                className="text-blue-600 hover:text-blue-800"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}