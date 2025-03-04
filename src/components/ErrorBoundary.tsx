
import React, { Component, ErrorInfo, ReactNode } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("حدث خطأ غير متوقع:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
              حدث خطأ غير متوقع
            </h1>
            
            <p className="text-gray-600 text-center mb-6">
              نعتذر عن هذا الخطأ. يرجى إعادة تحميل الصفحة للمتابعة.
            </p>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={this.handleReload}
                className="w-full"
              >
                <RefreshCw size={18} className="ml-2" />
                إعادة تحميل الصفحة
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "/"}
                className="w-full"
              >
                العودة للرئيسية
              </Button>
            </div>
            
            {this.state.error && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-500 overflow-auto max-h-32">
                <p className="font-mono">{this.state.error.toString()}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
