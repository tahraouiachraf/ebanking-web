import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, catchError, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.includes("/auth/login")) {
      let newRequest = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + this.authService.accessToken)
      })
      return next.handle(newRequest).pipe(
        catchError(err => {
          if (err.status == 401) {
            this.authService.logout();
          }
          return throwError(err.message)
        })
      );
    } else {
      return next.handle(request);
    }
  }
}


// import { HttpInterceptorFn } from '@angular/common/http';

// export const appHttpInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };
