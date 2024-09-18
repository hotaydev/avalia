import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Logging error
    await fetch("/api/error", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        errorInfo: errorInfo.componentStack,
        error: error,
      }),
    });
    // console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="z-10 relative flex flex-col items-center justify-center min-h-screen p-4 pb-20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1 text-center">Oops, algo deu errado!</h2>
          <sub className="text-sm font-light mb-6 max-w-xl text-center">
            Nós já recebemos um relatório do erro.
            <br />
            Se recarregar a página não resolver o problema, tente sair da sua conta e entrar novamente.
          </sub>

          <button
            type="button"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 focus:outline-none transition cursor-pointer"
            onClick={() => window.location.reload()}
          >
            Recarregar a página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
