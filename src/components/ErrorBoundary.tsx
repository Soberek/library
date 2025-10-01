import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { ERROR_MESSAGES } from "../constants/validation";

/**
 * Props for the ErrorBoundary component
 */
interface Props {
  /** Child components to wrap with error boundary */
  children: ReactNode;
  /** Optional custom fallback UI to display when an error occurs */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * React Error Boundary component that catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
            p: 2,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 500,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" color="error" gutterBottom>
              Oops! Coś poszło nie tak
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {ERROR_MESSAGES.UNKNOWN_ERROR}
            </Typography>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <Box
                sx={{
                  backgroundColor: "grey.100",
                  p: 2,
                  borderRadius: 1,
                  mb: 3,
                  textAlign: "left",
                }}
              >
                <Typography variant="caption" component="pre" sx={{ fontSize: "0.75rem" }}>
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleReset}
              sx={{ mr: 2 }}
            >
              Spróbuj ponownie
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              Odśwież stronę
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
