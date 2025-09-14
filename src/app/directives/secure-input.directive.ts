import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { SecurityService } from '../services/security.service';

@Directive({
  selector: '[appSecureInput]',
  standalone: true
})
export class SecureInputDirective {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private securityService: SecurityService
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const sanitizedValue = this.securityService.sanitizeInput(target.value);
    
    if (sanitizedValue !== target.value) {
      this.renderer.setProperty(target, 'value', sanitizedValue);
      // Dispatch input event to trigger form validation
      target.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text') || '';
    const sanitizedPaste = this.securityService.sanitizeInput(paste);
    
    const target = event.target as HTMLInputElement;
    const currentValue = target.value;
    const start = target.selectionStart || 0;
    const end = target.selectionEnd || 0;
    
    const newValue = currentValue.slice(0, start) + sanitizedPaste + currentValue.slice(end);
    this.renderer.setProperty(target, 'value', newValue);
    
    // Set cursor position
    target.setSelectionRange(start + sanitizedPaste.length, start + sanitizedPaste.length);
    
    // Dispatch input event
    target.dispatchEvent(new Event('input', { bubbles: true }));
  }
}