import { Component, HostListener, ElementRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'institute-site';
  isMobileMenuOpen = false;
  activeDropdown: string | null = null;

  isTrainingRoute(): boolean {
    const path = window.location.pathname;
    return path.includes('/courses');
  }

  isServicesRoute(): boolean {
    const path = window.location.pathname;
    return path.includes('/services');
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (!this.isMobileMenuOpen) {
      this.activeDropdown = null;
    }
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }

  toggleDropdown(dropdown: string, event: Event) {
    event.preventDefault();
    if (window.innerWidth <= 768) {
      this.activeDropdown = this.activeDropdown === dropdown ? null : dropdown;
    }
  }

  closeMenu() {
    this.isMobileMenuOpen = false;
    this.activeDropdown = null;
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey() {
    this.closeMenu();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (this.isMobileMenuOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }

  constructor(private elementRef: ElementRef) {}

  handleKeyboardNav(event: KeyboardEvent, dropdown: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleDropdown(dropdown, event);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.closeMenu();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.activeDropdown) {
        this.activeDropdown = dropdown;
      }
      this.focusNextMenuItem(event.key === 'ArrowDown');
    }
  }

  private focusNextMenuItem(forward: boolean) {
    const menuItems = Array.from(document.querySelectorAll('[role="menuitem"]'));
    const currentIndex = menuItems.findIndex(item => item === document.activeElement);
    let nextIndex = forward ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex >= menuItems.length) {
      nextIndex = 0;
    } else if (nextIndex < 0) {
      nextIndex = menuItems.length - 1;
    }

    (menuItems[nextIndex] as HTMLElement).focus();
  }
}
