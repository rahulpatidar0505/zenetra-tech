import { Component } from '@angular/core';

@Component({
  selector: 'app-skip-links',
  standalone: true,
  template: `
    <div class="skip-links" id="skip-links">
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#primary-navigation" class="skip-link">Skip to navigation</a>
      <a href="#site-footer" class="skip-link">Skip to footer</a>
    </div>
  `,
  styles: [`
    .skip-links {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9999;
    }
    
    .skip-link {
      position: absolute;
      left: -9999px;
      width: 1px;
      height: 1px;
      overflow: hidden;
      background: #000;
      color: #fff;
      padding: 0.75rem 1rem;
      text-decoration: none;
      font-weight: bold;
      
      &:focus {
        position: static;
        width: auto;
        height: auto;
        left: 10px;
        top: 10px;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 10000;
      }
    }
  `]
})
export class SkipLinksComponent {}