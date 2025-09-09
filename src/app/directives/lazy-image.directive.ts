import { Directive, ElementRef, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
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
  @Input() placeholderSrc: string = '/assets/images/placeholders/placeholder.svg';
  
  private originalSrc: string = '';
  private isBrowser: boolean;
  private intersectionObserver?: IntersectionObserver;
  
  constructor(
    private el: ElementRef<HTMLImageElement>,
    private imageService: ImageOptimizationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  
  ngOnInit(): void {
    if (!this.isBrowser) return;
    
    // Set placeholder immediately
    this.el.nativeElement.src = this.placeholderSrc;
    
    // Store the original source for later
    this.originalSrc = this.appLazyImage;
    
    // Set up data-src for the intersection observer
    this.el.nativeElement.setAttribute('data-src', 
      this.imageService.optimizeImageUrl(this.originalSrc, this.width, this.height, this.imageFormat)
    );
    
    // Set up the intersection observer to start loading when visible
    this.setupIntersectionObserver();
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
  }
}
