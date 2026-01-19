import { Component, type ErrorInfo, type ReactNode } from "react"
import { Translation } from "react-i18next"

import { Button } from "@/shared/ui/button"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo)

    this.props.onError?.(error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Translation>
          {(t) => (
            <div className="bg-background flex min-h-screen w-screen items-center justify-center">
              <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-6 align-middle">
                <div className="text-center">
                  <h2 className="text-destructive mb-2 text-xl font-semibold">
                    {t("errorBoundary.title")}
                  </h2>
                  <p className="text-muted-foreground mb-4 max-w-md text-sm">
                    {t("errorBoundary.description")}
                  </p>
                  {this.state.error && (
                    <pre className="bg-muted mb-4 max-w-md overflow-auto rounded-md p-3 text-left text-xs">
                      {this.state.error.message}
                    </pre>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={this.handleReset} variant="outline">
                    {t("errorBoundary.tryAgain")}
                  </Button>
                  <Button onClick={() => window.location.reload()}>
                    {t("errorBoundary.reloadPage")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Translation>
      )
    }

    return this.props.children
  }
}
