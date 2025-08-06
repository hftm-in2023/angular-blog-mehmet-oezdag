import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

export interface LogEntry {
  correlationId: string;
  method: string;
  url: string;
  timestamp: number;
  duration?: number;
  status?: number;
  error?: boolean;
  userAgent: string;
}

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  private readonly LOG_PREFIX = '[HTTP]';

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Generate unique correlation ID for this request
    const correlationId = this.generateCorrelationId();
    const startTime = performance.now();

    // Add correlation ID to request headers
    const modifiedReq = req.clone({
      setHeaders: {
        'X-Correlation-ID': correlationId,
        'X-Request-Timestamp': new Date().toISOString(),
      },
    });

    // Create initial log entry
    const logEntry: LogEntry = {
      correlationId,
      method: req.method,
      url: req.url,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    };

    // Log request start
    this.logRequest(logEntry);

    return next.handle(modifiedReq).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            const duration = performance.now() - startTime;
            this.logResponse({
              ...logEntry,
              duration,
              status: event.status,
              error: false,
            });
          }
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            const duration = performance.now() - startTime;
            this.logError(
              {
                ...logEntry,
                duration,
                status: error.status,
                error: true,
              },
              error,
            );
          }
        },
      }),
      finalize(() => {
        // Log completion regardless of success/failure
        const duration = performance.now() - startTime;
        console.log(`${this.LOG_PREFIX} Request completed`, {
          correlationId,
          duration: `${duration.toFixed(2)}ms`,
        });
      }),
    );
  }

  /**
   * Generate a unique correlation ID for request tracking
   */
  private generateCorrelationId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `req-${timestamp}-${randomPart}`;
  }

  /**
   * Log outgoing HTTP request
   */
  private logRequest(logEntry: LogEntry): void {
    console.group(`${this.LOG_PREFIX} ${logEntry.method} ${logEntry.url}`);
    console.log('📤 Request Details:', {
      correlationId: logEntry.correlationId,
      method: logEntry.method,
      url: logEntry.url,
      timestamp: new Date(logEntry.timestamp).toISOString(),
    });
    console.groupEnd();
  }

  /**
   * Log successful HTTP response
   */
  private logResponse(logEntry: LogEntry): void {
    const statusColor = this.getStatusColor(logEntry.status || 0);
    console.group(`${this.LOG_PREFIX} ✅ ${logEntry.method} ${logEntry.url}`);
    console.log('📥 Response Details:', {
      correlationId: logEntry.correlationId,
      status: logEntry.status,
      duration: `${logEntry.duration?.toFixed(2)}ms`,
      timestamp: new Date().toISOString(),
    });
    console.log(
      `%c${logEntry.status} ${this.getStatusText(logEntry.status || 0)}`,
      `color: ${statusColor}; font-weight: bold`,
    );
    console.groupEnd();
  }

  /**
   * Log HTTP error response
   */
  private logError(logEntry: LogEntry, error: HttpErrorResponse): void {
    console.group(`${this.LOG_PREFIX} ❌ ${logEntry.method} ${logEntry.url}`);
    console.error('📥 Error Details:', {
      correlationId: logEntry.correlationId,
      status: error.status,
      statusText: error.statusText,
      duration: `${logEntry.duration?.toFixed(2)}ms`,
      message: error.message,
      timestamp: new Date().toISOString(),
    });

    if (error.error) {
      console.error('Error Response Body:', error.error);
    }

    console.groupEnd();
  }

  /**
   * Get color for HTTP status code
   */
  private getStatusColor(status: number): string {
    if (status >= 200 && status < 300) return '#28a745'; // Green for success
    if (status >= 300 && status < 400) return '#ffc107'; // Yellow for redirect
    if (status >= 400 && status < 500) return '#fd7e14'; // Orange for client error
    if (status >= 500) return '#dc3545'; // Red for server error
    return '#6c757d'; // Gray for unknown
  }

  /**
   * Get status text for HTTP status code
   */
  private getStatusText(status: number): string {
    const statusTexts: Record<number, string> = {
      200: 'OK',
      201: 'Created',
      204: 'No Content',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
    };
    return statusTexts[status] || 'Unknown';
  }
}
