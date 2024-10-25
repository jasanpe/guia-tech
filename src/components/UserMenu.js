import { useState } from 'react'
import Link from 'next/link'

export default function UserMenu({ isLoggedIn, user, onLogin, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      {isLoggedIn ? (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-geist-sans"
          >
            <span>{user.name}</span>
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <Link href="/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-geist-sans">
                Mi Perfil
              </Link>
              <Link href="/favoritos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-geist-sans">
                Favoritos
              </Link>
              <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-geist-sans"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={onLogin}
          className="text-blue-600 hover:text-blue-800 font-geist-sans"
        >
          Iniciar Sesión
        </button>
      )}
    </div>
  )
}