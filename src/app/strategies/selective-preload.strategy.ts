import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectivePreloadStrategy implements PreloadingStrategy {
  
  // Define routes that should be preloaded (high-priority pages)
  private preloadRoutes = [
    'courses',
    'services', 
    'contact-us',
    'courses/playwright-automation',
    'courses/java-development',
    'courses/security-testing'
  ];

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Check if route should be preloaded based on data flag or route path
    if (route.data?.['preload'] || this.shouldPreload(route.path)) {
      console.log('Preloading route:', route.path);
      return load();
    }
    
    return of(null);
  }

  private shouldPreload(routePath?: string): boolean {
    if (!routePath) return false;
    return this.preloadRoutes.includes(routePath);
  }
}