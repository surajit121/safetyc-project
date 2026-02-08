import React from 'react';
import { Button, Result, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex items-center justify-center min-h-screen bg-white p-4">
          <Result
            status="error"
            title="Something went wrong"
            subTitle="Our systems encountered an unexpected error. Don't worry, your safety is still our priority."
            extra={[
              <Button 
                type="primary" 
                key="reload" 
                icon={<ReloadOutlined />} 
                onClick={this.handleReload}
                size="large"
                className="bg-orange-600 hover:bg-orange-700 border-none"
              >
                Reload Page
              </Button>
            ]}
          >
            <div className="text-left mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100 max-w-lg mx-auto overflow-auto">
              <Text type="danger" strong className="block mb-2">Error Details:</Text>
              <Text code className="text-xs">
                {this.state.error && this.state.error.toString()}
              </Text>
              <Text className="block mt-4 text-xs text-gray-500 italic">
                Try reloading the page. If the problem persists, please contact our support team.
              </Text>
            </div>
          </Result>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
