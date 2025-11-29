import { useEffect, useState } from 'react'
import './App.css'
import { fetchHello } from './api/client'

function App() {
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const abortController = new AbortController()

    fetchHello(abortController.signal)
      .then(data => {
        if (!abortController.signal.aborted) {
          setMessage(data.message)
          setError('')
        }
      })
      .catch(err => {
        if (!abortController.signal.aborted) {
          setError(err.name === 'AbortError' ? 'Request cancelled' : 'Failed to fetch message from backend')
          console.error('Fetch error:', err)
        }
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      })

    return () => {
      abortController.abort()
    }
  }, [])

  return (
    <>
      <h1>Vite + React + FastAPI</h1>
      <div className="card">
        <p>
          {loading && 'Loading...'}
          {error && <span style={{ color: 'red' }}>Error: {error}</span>}
          {!loading && !error && `Backend says: ${message}`}
        </p>
      </div>
    </>
  )
}

export default App
