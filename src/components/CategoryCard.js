export default function CategoryCard({ title, description, href, className = "" }) {
    return (
      <a 
        href={href}
        className={`bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow cursor-pointer ${className}`}
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </a>
    )
  }