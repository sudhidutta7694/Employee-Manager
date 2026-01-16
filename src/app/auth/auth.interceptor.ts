import { HttpInterceptorFn } from '@angular/common/http';

// Ensure cookies are sent for API calls routed through the dev proxy.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiCall = req.url.startsWith('/api/EmployeeManagement');
  if (!isApiCall) {
    return next(req);
  }

  const withCreds = req.clone({ withCredentials: true });
  return next(withCreds);
};
