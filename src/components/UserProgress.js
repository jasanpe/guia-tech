import { useState, useCallback } from 'react'
import { Star, Award, Target, Trophy, TrendingUp } from 'lucide-react'

const LEVELS = {
  novice: { min: 0, name: 'Novato', color: 'text-gray-600' },
  contributor: { min: 100, name: 'Contribuidor', color: 'text-blue-600' },
  expert: { min: 500, name: 'Experto', color: 'text-green-600' },
  master: { min: 1000, name: 'Maestro', color: 'text-purple-600' },
  guru: { min: 2000, name: 'Gurú Tech', color: 'text-yellow-600' }
}

const ACHIEVEMENTS = [
  {
    id: 'first_review',
    name: 'Primera Review',
    description: 'Publica tu primera review',
    icon: Star,
    points: 50,
    progress: 0,
    max: 1
  },
  {
    id: 'price_hunter',
    name: 'Cazador de Ofertas',
    description: 'Encuentra y reporta 5 ofertas',
    icon: Target,
    points: 100,
    progress: 3,
    max: 5
  },
  {
    id: 'comparison_expert',
    name: 'Experto en Comparativas',
    description: 'Crea 3 comparativas detalladas',
    icon: TrendingUp,
    points: 150,
    progress: 1,
    max: 3
  },
  {
    id: 'helpful_voter',
    name: 'Opiniones Útiles',
    description: 'Recibe 10 votos útiles en tus reviews',
    icon: Trophy,
    points: 200,
    progress: 4,
    max: 10
  }
]

export default function UserProgress() {
  const [currentPoints, setCurrentPoints] = useState(320)
  const [showAllAchievements, setShowAllAchievements] = useState(false)

  const getCurrentLevel = useCallback(() => {
    return Object.entries(LEVELS)
      .reverse()
      .find(([_, level]) => currentPoints >= level.min)?.[0]
  }, [currentPoints])

  const getNextLevel = useCallback(() => {
    const levels = Object.entries(LEVELS)
    const currentLevelIndex = levels.findIndex(([_, level]) => level.min > currentPoints)
    return levels[currentLevelIndex]
  }, [currentPoints])

  const getProgressToNextLevel = useCallback(() => {
    const nextLevel = getNextLevel()
    if (!nextLevel) return 100

    const currentLevelMin = Object.values(LEVELS)
      .reverse()
      .find(level => currentPoints >= level.min)?.min || 0

    return ((currentPoints - currentLevelMin) / (nextLevel[1].min - currentLevelMin)) * 100
  }, [currentPoints, getNextLevel])

  const toggleAchievements = useCallback(() => {
    setShowAllAchievements(prev => !prev)
  }, [])

  const currentLevel = getCurrentLevel()
  const nextLevel = getNextLevel()
  const progress = getProgressToNextLevel()

  return (
    <div className="space-y-6">
      {/* Current Level */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Nivel Actual</h3>
            <p className={`text-2xl font-bold ${LEVELS[currentLevel].color}`}>
              {LEVELS[currentLevel].name}
            </p>
          </div>
          <Award className={`w-8 h-8 ${LEVELS[currentLevel].color}`} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{currentPoints} puntos</span>
            {nextLevel && (
              <span className="text-gray-500">
                Siguiente nivel: {nextLevel[1].min - currentPoints} puntos
              </span>
            )}
          </div>
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="font-semibold">12</div>
            <div className="text-gray-500">Reviews</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="font-semibold">5</div>
            <div className="text-gray-500">Comparativas</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="font-semibold">28</div>
            <div className="text-gray-500">Ofertas</div>
          </div>
        </div>
      </div>

      {/* Recent Achievement */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-lg">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">¡Nuevo logro desbloqueado!</h3>
            <p className="text-blue-100">
              Has conseguido &apos;Cazador de Ofertas Novato&apos; por reportar tu primera oferta
            </p>

            <button
              className="mt-2 text-sm text-blue-100 hover:text-white"
              onClick={toggleAchievements}
            >
              Ver todos los logros &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {/* Aquí puedes continuar con el código de los logros */}
      </div>
    </div>
  )
}
