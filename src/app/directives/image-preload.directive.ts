import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appImagePreload]',
  standalone: true
})
export class ImagePreloadDirective implements OnInit {
  @Input() appImagePreload: string = '';
  @Input() fallbackImage: string = '/assets/images/placeholders/placeholder.svg';
  
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  
  ngOnInit() {
    const img = new Image();
    const element = this.el.nativeElement;
    
    // Add a placeholder loader class
    this.renderer.addClass(element, 'image-loading');
    this.renderer.setStyle(element, 'opacity', '0.7');
    this.renderer.setStyle(element, 'filter', 'blur(2px)');
    
    // Add loading event
    img.onload = () => {
      this.renderer.setAttribute(element, 'src', this.appImagePreload);
      this.removeLoader();
    };
    
    // Add error event
    img.onerror = () => {
      console.warn(`Failed to load image: ${this.appImagePreload}, using fallback`);
      this.renderer.setAttribute(element, 'src', this.fallbackImage);
      this.removeLoader();
    };
    
    // Start loading
    img.src = this.appImagePreload;
  }
  
  private removeLoader() {
    const element = this.el.nativeElement;
    // Remove the loading class and effects
    this.renderer.removeClass(element, 'image-loading');
    this.renderer.setStyle(element, 'opacity', '1');
    this.renderer.setStyle(element, 'filter', 'none');
  }
}
