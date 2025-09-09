import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appImagePreload]',
  standalone: true
})
export class ImagePreloadDirective implements OnInit {
  @Input() appImagePreload: string = '';
  @Input() fallbackImage: string = '/assets/images/placeholder.jpg';
  
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  
  ngOnInit() {
    const img = new Image();
    
    // Add loading event
    img.onload = () => {
      this.renderer.setAttribute(this.el.nativeElement, 'src', this.appImagePreload);
      this.removeLoader();
    };
    
    // Add error event
    img.onerror = () => {
      this.renderer.setAttribute(this.el.nativeElement, 'src', this.fallbackImage);
      this.removeLoader();
    };
    
    // Start loading
    img.src = this.appImagePreload;
    
    // Add a placeholder loader class
    this.renderer.addClass(this.el.nativeElement, 'image-loading');
  }
  
  private removeLoader() {
    // Remove the loading class
    this.renderer.removeClass(this.el.nativeElement, 'image-loading');
  }
}
