interface SecurityEvent {
  event: string;
  email?: string;
  userId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface SecurityError {
  event: string;
  error: Error;
  email?: string;
  token?: string;
}

class SecurityLogger {
  async log(event: SecurityEvent): Promise<void> {
    // Implementation would integrate with your logging service
    console.log('Security Event:', {
      ...event,
      timestamp: event.timestamp.toISOString(),
    });
  }

  async logError(error: SecurityError): Promise<void> {
    // Implementation would integrate with your error tracking service
    console.error('Security Error:', {
      ...error,
      error: {
        message: error.error.message,
        stack: error.error.stack,
      },
      timestamp: new Date().toISOString(),
    });
  }
}

export { SecurityLogger };