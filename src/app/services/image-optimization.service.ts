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
            // Use Image constructor to preload and handle errors
            const img = new Image();
            img.onload = () => {
              // Set the src and add fade-in effect
              element.src = dataSrc;
              element.style.opacity = '1';
              this.loadedImages.add(dataSrc);
              this.observer?.unobserve(element);
            };
            
            img.onerror = () => {
              console.error(`Failed to load image: ${dataSrc}`);
              // Try to use the original src if available
              const originalSrc = element.getAttribute('data-original-src');
              if (originalSrc && originalSrc !== dataSrc) {
                console.log(`Falling back to original image: ${originalSrc}`);
                element.src = originalSrc;
                element.style.opacity = '1';
              }
              this.observer?.unobserve(element);
            };
            
            img.src = dataSrc;
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
    
    // Only process local asset images
    if (!url || !url.startsWith('/assets/')) return url;

    // First, check if optimized images exist
    // Create a path to check if this specific image has an optimized version
    try {
      // If format is not specified and browser supports WebP, use WebP
      const supportsWebP = this.checkWebPSupport();
      if (!format && supportsWebP) {
        format = 'webp';
      }
      
      // Extract image name and extension
      const urlParts = url.split('/');
      const filename = urlParts[urlParts.length - 1];
      const filenameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
      const ext = filename.substring(filename.lastIndexOf('.') + 1);
      
      // Try to use optimized version if width and height are specified
      if (width && height) {
        let sizeDir = "1200x900";
        if (width <= 320 || height <= 240) {
          sizeDir = "320x240";
        } else if (width <= 640 || height <= 480) {
          sizeDir = "640x480";
        }
        
        // Try to use WebP if supported
        if (format === 'webp') {
          const webpUrl = `/assets/images/optimized/${sizeDir}/${filenameWithoutExt}.webp`;
          // We will just return this URL and let the browser handle the 404 if it doesn't exist
          // This avoids having to make a network request to check if the file exists
          return webpUrl;
        } else {
          // Use JPG/PNG with the original extension
          return `/assets/images/optimized/${sizeDir}/${filenameWithoutExt}.${ext}`;
        }
      } 
      
      // If only format is specified but no size
      else if (format === 'webp') {
        return `/assets/images/optimized/webp/${filenameWithoutExt}.webp`;
      }
    } catch (e) {
      console.warn('Error optimizing image URL:', e);
    }
    
    // Fallback to original URL if no optimizations can be applied
    return url;
  }
  
  /**
   * Check if browser supports WebP format
   */
  private checkWebPSupport(): boolean {
    if (!this.isBrowser) return false;
    
    // Feature detection for WebP
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      // If browser supports canvas, check WebP support
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
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
   * @param priority Whether to use high priority loading
   */
  preloadImages(urls: string[], priority: boolean = false): void {
    if (!this.isBrowser) return;
    
    urls.forEach(url => {
      if (!this.loadedImages.has(url)) {
        const optimizedUrl = this.optimizeImageUrl(url);
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = optimizedUrl;
        link.as = 'image';
        
        if (priority) {
          // Set high priority (using setAttribute since TypeScript doesn't recognize this attribute)
          link.setAttribute('importance', 'high');
        }
        
        link.onload = () => this.loadedImages.add(optimizedUrl);
        link.onerror = () => console.error(`Failed to preload image: ${optimizedUrl}`);
        
        document.head.appendChild(link);
        
        // Also create an image object to ensure it gets cached
        const img = new Image();
        img.src = optimizedUrl;
      }
    });
  }
  
  /**
   * Get critical images that should be preloaded on app initialization
   * These are images that appear above the fold on common pages
   */
  getCriticalImages(): string[] {
    return [
      '/assets/images/zenetra-logo.ico',
      '/assets/images/what-we-offer.jpg',
      '/assets/images/playwright1.jpg',
      '/assets/images/Java.jpg',
      '/assets/images/Security.jpg'
    ];
  }
}
