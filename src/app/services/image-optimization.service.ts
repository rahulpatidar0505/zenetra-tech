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

    // For now, return the original URL until optimized versions are generated
    // We'll update this implementation once the optimized images are available
    return url;
    
    // Commented out until optimized versions are generated
    /*
    // Check if browser supports WebP
    const supportsWebP = this.checkWebPSupport();
    
    // If format is not specified and browser supports WebP, use WebP
    if (!format && supportsWebP) {
      format = 'webp';
    }
    
    // Create optimized URL (assuming you've added these to your assets folder)
    // Structure: /assets/optimized/[width]x[height]/[original-path].[format]
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1];
    const filenameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
    const pathWithoutFilename = urlParts.slice(0, urlParts.length - 1).join('/');
    
    // If width and height are defined, use them for the optimized version
    if (width && height && format) {
      return `${pathWithoutFilename}/optimized/${width}x${height}/${filenameWithoutExt}.${format}`;
    } else if (format) {
      // If only format is specified
      return `${pathWithoutFilename}/optimized/${filenameWithoutExt}.${format}`;
    }
    
    // Fallback to original URL if no optimizations can be applied
    return url;
    */
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
