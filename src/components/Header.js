import Link from 'next/link';
import SearchBar from './SearchBar';
import NotificationCenter from './NotificationCenter';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-6">

          <div className="flex justify-between items-center mb-4 md:mb-0">
            <Link href="/" className="text-2xl font-bold text-blue-600 font-geist-sans">
              Guía Tech
            </Link>
            <div className="flex items-center gap-4 md:hidden">
              {user && <NotificationCenter />}
              <button className="text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="hidden md:block flex-1">
            <SearchBar />
          </div>

          <div className="hidden md:flex items-center space-x-6 font-geist-sans">
            <Link href="/reviews" className="text-gray-600 hover:text-blue-600 transition-colors">
              Reviews
            </Link>
            <Link href="/comparativas" className="text-gray-600 hover:text-blue-600 transition-colors">
              Comparativas
            </Link>
            <Link href="/guias" className="text-gray-600 hover:text-blue-600 transition-colors">
              Guías
            </Link>
            {user && (
              <>
                <NotificationCenter />
                <div className="h-6 w-px bg-gray-200" />
                <Link
                  href={user?.profileUrl || '/perfil'}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                  <span className="hidden lg:inline">Mi Perfil</span>
                </Link>
              </>
            )}
            {!user && (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>


          {/* Mobile Navigation */}
          <div className="md:hidden mt-4">
            <SearchBar />
            <div className="mt-4 flex flex-col space-y-2 font-geist-sans">
              <Link href="/reviews" className="text-gray-600 hover:text-blue-600 transition-colors py-2">
                Reviews
              </Link>
              <Link href="/comparativas" className="text-gray-600 hover:text-blue-600 transition-colors py-2">
                Comparativas
              </Link>
              <Link href="/guias" className="text-gray-600 hover:text-blue-600 transition-colors py-2">
                Guías
              </Link>
              {user ? (
                <Link
                  href={user?.profileUrl || '/perfil'}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors py-2"
                >
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                  Mi Perfil
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}