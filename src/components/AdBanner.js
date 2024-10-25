export default function AdBanner({ position = 'article' }) {
    const adStyles = {
      article: 'my-8 p-4',
      sidebar: 'mb-6',
    }
  
    return (
      <div className={`bg-gray-100 rounded-lg ${adStyles[position]}`}>
        <div className="h-[250px] flex items-center justify-center border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-sm font-geist-sans">
            Espacio publicitario
          </p>
        </div>
      </div>
    )
  }