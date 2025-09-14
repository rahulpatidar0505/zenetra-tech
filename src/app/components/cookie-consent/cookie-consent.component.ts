import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityService } from '../../services/security.service';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cookie-consent-banner" 
         *ngIf="!hasConsent" 
         role="dialog" 
         aria-labelledby="cookie-title" 
         aria-describedby="cookie-description">
      <div class="cookie-content">
        <div class="cookie-text">
          <h3 id="cookie-title" class="cookie-title">🍪 We use cookies</h3>
          <p id="cookie-description" class="cookie-description">
            This website uses cookies to ensure you get the best experience. We only use essential cookies for website functionality and analytics to help us improve our services.
          </p>
        </div>
        <div class="cookie-actions">
          <button 
            class="btn btn-accept" 
            (click)="acceptCookies()"
            type="button"
            aria-describedby="accept-description">
            Accept All
          </button>
          <button 
            class="btn btn-reject" 
            (click)="rejectCookies()"
            type="button"
            aria-describedby="reject-description">
            Reject Non-Essential
          </button>
        </div>
      </div>
      
      <!-- Screen reader descriptions -->
      <div class="sr-only">
        <p id="accept-description">Accept all cookies including analytics</p>
        <p id="reject-description">Only accept essential cookies for website functionality</p>
      </div>
    </div>
  `,
  styles: [`
    .cookie-consent-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #013024 0%, #001a12 100%);
      color: #FFFFF0;
      padding: 1rem;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      border-top: 3px solid #2AF598;
      backdrop-filter: blur(10px);
      
      @media (min-width: 768px) {
        padding: 1.5rem 2rem;
      }
    }

    .cookie-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
      text-align: center;
      
      @media (min-width: 768px) {
        flex-direction: row;
        text-align: left;
        justify-content: space-between;
      }
    }

    .cookie-text {
      flex: 1;
      
      @media (min-width: 768px) {
        margin-right: 2rem;
      }
    }

    .cookie-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: #2AF598;
      
      @media (min-width: 768px) {
        font-size: 1.2rem;
      }
    }

    .cookie-description {
      font-size: 0.9rem;
      line-height: 1.5;
      color: #e0e0e0;
      margin-bottom: 0;
      
      @media (min-width: 768px) {
        font-size: 1rem;
      }
    }

    .cookie-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      
      @media (min-width: 480px) {
        flex-direction: row;
        width: auto;
      }
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      
      &:focus {
        outline: 3px solid #2AF598;
        outline-offset: 2px;
      }
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      
      @media (min-width: 480px) {
        min-width: 140px;
      }
    }

    .btn-accept {
      background: linear-gradient(135deg, #2AF598 0%, #1ce589 100%);
      color: #013024;
      border: 2px solid #2AF598;
      
      &:hover {
        background: linear-gradient(135deg, #1ce589 0%, #00e676 100%);
        box-shadow: 0 4px 20px rgba(42, 245, 152, 0.3);
      }
    }

    .btn-reject {
      background: transparent;
      color: #e0e0e0;
      border: 2px solid rgba(224, 224, 224, 0.3);
      
      &:hover {
        background: rgba(224, 224, 224, 0.1);
        border-color: rgba(224, 224, 224, 0.5);
        color: #fff;
      }
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* Animation for banner entrance */
    .cookie-consent-banner {
      animation: slideUp 0.4s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .cookie-consent-banner {
        background: #000;
        border-top-color: #fff;
      }
      
      .btn {
        border-width: 3px;
        font-weight: 700;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .cookie-consent-banner {
        animation: none;
      }
      
      .btn {
        transition: none;
      }
      
      .btn:hover {
        transform: none;
      }
    }
  `]
})
export class CookieConsentComponent implements OnInit {
  hasConsent = false;

  constructor(private securityService: SecurityService) {}

  ngOnInit(): void {
    this.hasConsent = this.securityService.privacy.hasCookieConsent();
  }

  acceptCookies(): void {
    this.securityService.privacy.setCookieConsent(true);
    this.hasConsent = true;
    
    // Track acceptance for analytics (if consent given)
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
    
    // Announce to screen readers
    this.announceToScreenReader('Cookies accepted. Thank you for your consent.');
  }

  rejectCookies(): void {
    this.securityService.privacy.setCookieConsent(false);
    this.hasConsent = true; // Hide banner even if rejected
    
    // Update consent for analytics
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
    
    // Announce to screen readers
    this.announceToScreenReader('Non-essential cookies rejected. Only essential cookies will be used.');
  }

  private announceToScreenReader(message: string): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}

// Add global gtag type definition
declare global {
  function gtag(command: string, action: string, parameters: any): void;
}