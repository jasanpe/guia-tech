import { useState } from 'react'

export default function Comments({ postId }) {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Juan García",
      date: "23 Oct 2024",
      content: "Excelente análisis, muy completo y detallado.",
      replies: []
    }
  ])
  const [newComment, setNewComment] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment = {
      id: comments.length + 1,
      author: "Usuario",  // En un caso real, vendría del sistema de autenticación
      date: new Date().toLocaleDateString(),
      content: newComment,
      replies: []
    }

    setComments([...comments, comment])
    setNewComment('')
  }

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6 font-geist-sans">Comentarios</h2>
      
      {/* Formulario de comentarios */}
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-geist-sans"
          rows="4"
          placeholder="Escribe tu comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button 
          type="submit"
          className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-geist-sans"
        >
          Publicar comentario
        </button>
      </form>

      {/* Lista de comentarios */}
      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment.id} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold font-geist-sans">{comment.author}</h3>
                <span className="text-sm text-gray-500 font-geist-sans">{comment.date}</span>
              </div>
              <button className="text-blue-600 text-sm hover:text-blue-800 font-geist-sans">
                Responder
              </button>
            </div>
            <p className="text-gray-700 font-geist-sans">{comment.content}</p>
          </div>
        ))}
      </div>
    </section>
  )
}