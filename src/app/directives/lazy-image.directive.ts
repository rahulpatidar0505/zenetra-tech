import { Directive, ElementRef, Input, OnInit, OnDestroy, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ImageOptimizationService } from '../services/image-optimization.service';

@Directive({
  selector: '[appLazyImage]',
  standalone: true
})
export class LazyImageDirective implements OnInit, OnDestroy {
  @Input() appLazyImage: string = '';
  @Input() width?: number;
  @Input() height?: number;
  @Input() imageFormat?: string;
  @Input() placeholderSrc: string = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzAwMWExMiIvPjxwYXRoIGQ9Ik0xNjAsMTI1IEwyNDAsMTI1IEwyNDAsMTc1IEwxNjAsMTc1IFoiIGZpbGw9IiMwMTMwMjQiLz48cGF0aCBkPSJNMjAwLDEwMCBRMjE1LDExNSAyMDAsMTMwIFExODUsMTE1IDIwMCwxMDAiIGZpbGw9IiMyQUY1OTgiLz48cmVjdCB4PSIxODUiIHk9IjE0MCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMkFGNTk4Ii8+PC9zdmc+';
  @Input() alt: string = '';
  @Input() priority: boolean = false; // For LCP (Largest Contentful Paint) images
  @Input() fetchpriority: 'high' | 'low' | 'auto' = 'auto'; // Modern fetchpriority attribute
  
  private originalSrc: string = '';
  private isBrowser: boolean;
  private intersectionObserver?: IntersectionObserver;
  private loadingIndicator: HTMLElement | null = null;
  private hasWebPSupport: boolean = false;
  
  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2,
    private imageService: ImageOptimizationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  
  ngOnInit(): void {
    if (!this.isBrowser) return;
    
    // Check for WebP support
    this.checkWebPSupport().then(hasSupport => {
      this.hasWebPSupport = hasSupport;
      this.initializeImage();
    });
  }
  
  private async checkWebPSupport(): Promise<boolean> {
    if (!this.isBrowser) return false;
    
    try {
      const canvas = document.createElement('canvas');
      if (canvas.getContext && canvas.getContext('2d')) {
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      }
    } catch (e) {
      console.error('Error checking WebP support:', e);
    }
    return false;
  }
  
  private initializeImage(): void {
    // Apply dimensions to original element if provided
    if (this.width) {
      this.renderer.setAttribute(this.el.nativeElement, 'width', this.width.toString());
    }
    
    if (this.height) {
      this.renderer.setAttribute(this.el.nativeElement, 'height', this.height.toString());
    }
    
    // Set alt attribute if provided
    if (this.alt) {
      this.renderer.setAttribute(this.el.nativeElement, 'alt', this.alt);
    }
    
    // Apply proper loading attribute
    this.renderer.setAttribute(
      this.el.nativeElement, 
      'loading', 
      this.priority ? 'eager' : 'lazy'
    );
    
    // Apply fetchpriority for modern browsers
    this.renderer.setAttribute(
      this.el.nativeElement,
      'fetchpriority',
      this.priority ? 'high' : this.fetchpriority
    );
    
    // Apply decoding strategy
    this.renderer.setAttribute(
      this.el.nativeElement,
      'decoding',
      this.priority ? 'sync' : 'async'
    );
    
    // Add blur-up effect styles
    this.renderer.addClass(this.el.nativeElement, 'lazy-image');
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'opacity 0.3s ease-in-out');
    
    // Set placeholder immediately with low quality image
    this.el.nativeElement.src = this.placeholderSrc;
    
    // Add loading indicator
    this.addLoadingIndicator();
    
    // Store the original source for later
    this.originalSrc = this.appLazyImage;
    
    // For priority images, load immediately without intersection observer
    if (this.priority) {
      const optimizedSrc = this.imageService.optimizeImageUrl(
        this.originalSrc, this.width, this.height, this.hasWebPSupport ? 'webp' : undefined
      );
      this.loadImage(optimizedSrc);
    } else {
      // Store original source for fallback
      this.el.nativeElement.setAttribute('data-original-src', this.originalSrc);
      
      // Set up data-src for the intersection observer
      const optimizedSrc = this.imageService.optimizeImageUrl(
        this.originalSrc, this.width, this.height, this.hasWebPSupport ? 'webp' : undefined
      );
      this.el.nativeElement.setAttribute('data-src', optimizedSrc);
      
      // Set up the intersection observer to start loading when visible
      this.setupIntersectionObserver();
    }
  }
  
  private loadImage(src: string): void {
    const img = new Image();
    img.onload = () => {
      this.renderer.setAttribute(this.el.nativeElement, 'src', src);
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
      this.removeLoadingIndicator();
      
      // Add performance attributes after successful load
      this.renderer.setAttribute(this.el.nativeElement, 'data-loaded', 'true');
      
      // Add will-change for smoother animations if hover effects are applied
      this.renderer.setStyle(this.el.nativeElement, 'will-change', 'transform');
    };
    
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      
      // If loading the optimized image fails, try loading the original source
      if (src !== this.originalSrc && this.originalSrc) {
        console.log(`Falling back to original image: ${this.originalSrc}`);
        const originalImg = new Image();
        originalImg.onload = () => {
          this.renderer.setAttribute(this.el.nativeElement, 'src', this.originalSrc);
          this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
          this.removeLoadingIndicator();
        };
        
        originalImg.onerror = () => {
          console.error(`Failed to load original image: ${this.originalSrc}`);
          this.renderer.setAttribute(this.el.nativeElement, 'src', this.placeholderSrc);
          this.removeLoadingIndicator();
        };
        
        originalImg.src = this.originalSrc;
      } else {
        // Final fallback to placeholder
        this.renderer.setAttribute(this.el.nativeElement, 'src', this.placeholderSrc);
        this.removeLoadingIndicator();
      }
    };
    
    // Performance optimizations for loading
    img.decoding = this.priority ? 'sync' : 'async';
    
    // Set image source to start loading
    img.src = src;
  }
  
  private addLoadingIndicator(): void {
    // Create a simple loading spinner
    this.loadingIndicator = this.renderer.createElement('div');
    this.renderer.addClass(this.loadingIndicator, 'image-loading-spinner');
    
    // Add it after the image
    const parent = this.renderer.parentNode(this.el.nativeElement);
    this.renderer.insertBefore(parent, this.loadingIndicator, this.el.nativeElement.nextSibling);
  }
  
  private removeLoadingIndicator(): void {
    if (this.loadingIndicator) {
      const parent = this.renderer.parentNode(this.loadingIndicator);
      this.renderer.removeChild(parent, this.loadingIndicator);
      this.loadingIndicator = null;
    }
  }
  
  private setupIntersectionObserver(): void {
    if (!this.isBrowser) return;
    
    // Let the image service handle the intersection observing
    this.imageService.observeElement(this.el.nativeElement);
  }
  
  ngOnDestroy(): void {
    // Clean up the observer to prevent memory leaks
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    // Remove loading indicator if it exists
    this.removeLoadingIndicator();
  }
}
