import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Kitchen Display Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-900 flex items-center justify-center p-8">
          <div className="bg-white rounded-lg p-8 max-w-md text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-red-800 mb-4">
              Kitchen Display Error
            </h1>
            <p className="text-xl text-gray-700 mb-6">
              Something went wrong with the kitchen display system.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-xl"
            >
              Reload Display
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Loading component
export const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mb-8"></div>
      <h2 className="text-4xl font-bold text-white">Loading Kitchen Orders...</h2>
    </div>
  </div>
)

// Error display component
interface ErrorDisplayProps {
  error: string
  onRetry?: () => void
}

export const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => (
  <div className="bg-red-100 border-4 border-red-500 rounded-lg p-6 mb-6">
    <div className="flex items-center gap-4">
      <span className="text-4xl">⚠️</span>
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-red-800 mb-2">Error</h3>
        <p className="text-xl text-red-700">{error}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Retry
        </button>
      )}
    </div>
  </div>
)