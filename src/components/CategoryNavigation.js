import Link from 'next/link'

export default function CategoryNavigation({ currentCategory }) {
  const categories = [
    { name: 'Smartphones', slug: 'smartphones' },
    { name: 'Portátiles', slug: 'portatiles' },
    { name: 'Tablets', slug: 'tablets' },
    { name: 'Audio', slug: 'audio' },
    { name: 'Gaming', slug: 'gaming' }
  ]

  return (
    <nav className="bg-white shadow-sm mb-8">
      <div className="container mx-auto px-4 py-2 overflow-x-auto">
        <div className="flex space-x-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categoria/${category.slug}`}
              className={`whitespace-nowrap py-2 border-b-2 font-geist-sans ${
                currentCategory === category.slug
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-300'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}