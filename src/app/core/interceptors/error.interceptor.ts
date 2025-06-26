import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private snackBar = inject(MatSnackBar);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ein unbekannter Fehler ist aufgetreten';

        // Handle different error types
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Client Error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = 'Ungültige Anfrage. Bitte überprüfen Sie Ihre Eingaben.';
              break;
            case 401:
              errorMessage = 'Nicht autorisiert. Bitte melden Sie sich an.';
              break;
            case 403:
              errorMessage = 'Zugriff verweigert. Sie haben keine Berechtigung für diese Aktion.';
              break;
            case 404:
              errorMessage = 'Die angeforderte Ressource wurde nicht gefunden.';
              break;
            case 500:
              errorMessage = 'Serverfehler. Bitte versuchen Sie es später erneut.';
              break;
            case 503:
              errorMessage = 'Service nicht verfügbar. Bitte versuchen Sie es später erneut.';
              break;
            default:
              errorMessage = `Fehler ${error.status}: ${error.message}`;
          }
        }

        // Show error notification to user
        this.snackBar.open(errorMessage, 'Schließen', {
          duration: 5000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });

        // Log error for debugging
        console.error('HTTP Error occurred:', error);

        return throwError(() => error);
      }),
    );
  }
}
