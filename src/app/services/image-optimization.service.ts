import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ImageOptimizationService {
  private readonly isBrowser: boolean;
  private loadedImages: Set<string> = new Set();
  private observer: IntersectionObserver | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      // Setup Intersection Observer for lazy loading
      this.setupIntersectionObserver();
    }
  }

  private setupIntersectionObserver(): void {
    const options = {
      rootMargin: '200px 0px', // Start loading when within 200px of viewport
      threshold: 0.01 // Trigger when 1% of the element is visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLImageElement;
          const dataSrc = element.getAttribute('data-src');
          
          if (dataSrc && !this.loadedImages.has(dataSrc)) {
            element.src = dataSrc;
            this.loadedImages.add(dataSrc);
            this.observer?.unobserve(element);
          }
        }
      });
    }, options);
  }

  /**
   * Optimize image URL for specific size and format
   * @param url Original image URL
   * @param width Desired width
   * @param height Desired height
   * @param format Image format (webp, jpeg, etc)
   */
  optimizeImageUrl(url: string, width?: number, height?: number, format?: string): string {
    if (!this.isBrowser) return url;
    
    // For locally hosted images, we could implement a resize solution
    // For external images, we might not be able to modify them
    // This is a placeholder for future implementation of a CDN or image processor
    
    // For now, just return the original URL
    return url;
  }

  /**
   * Add an element to be observed for lazy loading
   * @param element Image element to observe
   */
  observeElement(element: HTMLImageElement): void {
    if (this.isBrowser && this.observer && element) {
      this.observer.observe(element);
    }
  }

  /**
   * Preload important images ahead of time
   * @param urls Array of image URLs to preload
   */
  preloadImages(urls: string[]): void {
    if (!this.isBrowser) return;
    
    urls.forEach(url => {
      if (!this.loadedImages.has(url)) {
        const img = new Image();
        img.onload = () => this.loadedImages.add(url);
        img.src = url;
      }
    });
  }
}
