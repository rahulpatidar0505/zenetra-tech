import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFocusTrap]',
  standalone: true
})
export class FocusTrapDirective {
  private focusableElements: HTMLElement[] = [];

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    this.updateFocusableElements();
  }

  private updateFocusableElements() {
    const element = this.elementRef.nativeElement;
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    this.focusableElements = Array.from(element.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }

  @HostListener('keydown.tab', ['$event'])
  handleTab(event: KeyboardEvent) {
    if (this.focusableElements.length === 0) return;

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  @HostListener('keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    // Close modal/dropdown on escape
    const element = this.elementRef.nativeElement;
    const closeButton = element.querySelector('[data-dismiss="modal"], [data-dismiss="dropdown"]') as HTMLElement;
    if (closeButton) {
      closeButton.click();
    }
  }
}