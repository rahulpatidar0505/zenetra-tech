import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  
  constructor() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      this.observeWebVitals();
    }
  }

  private observeWebVitals(): void {
    // Observe Cumulative Layout Shift (CLS)
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          let cumulativeScore = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cumulativeScore += (entry as any).value;
            }
          }
          if (cumulativeScore > 0.1) {
            console.warn('CLS detected:', cumulativeScore);
          }
        });
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('Layout shift observation not supported');
      }

      // Observe First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const fid = (entry as any).processingStart - entry.startTime;
            console.log('First Input Delay:', fid);
            if (fid > 100) {
              console.warn('High FID detected:', fid);
            }
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('First input delay observation not supported');
      }
    }

    // Observe Largest Contentful Paint (LCP)
    if (window.addEventListener) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const paintEntries = performance.getEntriesByType('paint');
          const navigationEntries = performance.getEntriesByType('navigation');
          
          if (paintEntries.length > 0) {
            console.log('Paint metrics:', paintEntries);
          }
          
          if (navigationEntries.length > 0) {
            const nav = navigationEntries[0] as any;
            console.log('Navigation timing:', {
              domContentLoaded: nav.domContentLoadedEventEnd - nav.navigationStart,
              loadComplete: nav.loadEventEnd - nav.navigationStart
            });
          }
        }, 0);
      });
    }
  }

  measureTaskPerformance<T>(taskName: string, task: () => T): T {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const start = performance.now();
      const result = task();
      const end = performance.now();
      console.log(`${taskName} took ${end - start} milliseconds`);
      return result;
    }
    return task();
  }

  logResourceTiming(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const resources = performance.getEntriesByType('resource');
      const slowResources = resources.filter(resource => resource.duration > 1000);
      if (slowResources.length > 0) {
        console.warn('Slow loading resources:', slowResources);
      }
    }
  }
}