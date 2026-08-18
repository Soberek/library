import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw, RefreshCw } from "lucide-react";
import { ERROR_MESSAGES } from "../../constants/validation";
import { Button } from "./button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(_error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[50vh] items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-xl text-center bg-white border-slate-200">
            <CardHeader className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-2">
                <AlertCircle className="w-6 h-6" />
              </div>
              <CardTitle className="text-red-600">
                Oops! Coś poszło nie tak
              </CardTitle>
              <CardDescription>{ERROR_MESSAGES.UNKNOWN_ERROR}</CardDescription>
            </CardHeader>
            <CardContent>
              {this.state.error && (
                <div className="p-3 bg-slate-100 rounded-xl text-left overflow-x-auto text-xs text-slate-700 font-mono">
                  {this.state.error.toString()}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2 justify-center">
              <Button variant="default" onClick={this.handleReset} className="gap-1.5">
                <RotateCcw className="w-4 h-4" />
                <span>Spróbuj ponownie</span>
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()} className="gap-1.5">
                <RefreshCw className="w-4 h-4" />
                <span>Odśwież</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
