import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  label?: string;
}
interface State {
  error: Error | null;
}

/** Isola falhas: se uma demonstração quebrar, o resto da apresentação continua funcionando. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.label ?? 'demo'}]`, error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="error-box" role="alert">
        <strong>Não foi possível renderizar {this.props.label ?? 'este conteúdo'}.</strong>
        <code>{this.state.error.message}</code>
        <button type="button" onClick={() => this.setState({ error: null })}>
          Tentar novamente
        </button>
      </div>
    );
  }
}
