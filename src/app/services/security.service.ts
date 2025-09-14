import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  
  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Sanitize HTML content to prevent XSS attacks
   */
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.sanitize(1, html) || '';
  }

  /**
   * Sanitize URL to prevent malicious redirects
   */
  sanitizeUrl(url: string): string {
    const sanitized = this.sanitizer.sanitize(4, url);
    return sanitized || '';
  }

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format (basic)
   */
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Sanitize input to prevent injection attacks
   */
  sanitizeInput(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Generate a secure random token (for CSRF protection)
   */
  generateSecureToken(): string {
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      // Fallback for server-side rendering
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Check if running over HTTPS
   */
  isSecureConnection(): boolean {
    if (typeof window === 'undefined') return true; // Assume secure on server
    return window.location.protocol === 'https:';
  }

  /**
   * Rate limiting check (simple client-side)
   */
  isRateLimited(key: string, maxRequests: number = 5, timeWindow: number = 60000): boolean {
    if (typeof localStorage === 'undefined') return false;

    const now = Date.now();
    const storageKey = `rate_limit_${key}`;
    const stored = localStorage.getItem(storageKey);
    
    let requests: number[] = [];
    if (stored) {
      try {
        requests = JSON.parse(stored).filter((timestamp: number) => now - timestamp < timeWindow);
      } catch (e) {
        requests = [];
      }
    }

    if (requests.length >= maxRequests) {
      return true; // Rate limited
    }

    requests.push(now);
    localStorage.setItem(storageKey, JSON.stringify(requests));
    return false;
  }

  /**
   * Basic content security policy check
   */
  checkCSP(): boolean {
    if (typeof document === 'undefined') return true;
    
    const metaTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
    return metaTags.length > 0;
  }

  /**
   * Privacy compliance helpers
   */
  privacy = {
    /**
     * Check if user has consented to cookies
     */
    hasCookieConsent(): boolean {
      if (typeof localStorage === 'undefined') return false;
      return localStorage.getItem('cookie_consent') === 'true';
    },

    /**
     * Set cookie consent
     */
    setCookieConsent(consent: boolean): void {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem('cookie_consent', consent.toString());
    },

    /**
     * Clear all stored data for privacy
     */
    clearUserData(): void {
      if (typeof localStorage !== 'undefined') {
        localStorage.clear();
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
      }
    },

    /**
     * Anonymize IP address (basic implementation)
     */
    anonymizeIP(ip: string): string {
      const parts = ip.split('.');
      if (parts.length === 4) {
        // IPv4 - mask last octet
        return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
      }
      // For IPv6 or other formats, just return first part
      return ip.split(':')[0] + '::/64';
    }
  };

  /**
   * Security audit for the application
   */
  runSecurityAudit(): {
    score: number;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check HTTPS
    if (!this.isSecureConnection()) {
      issues.push('Application not served over HTTPS');
      recommendations.push('Enable HTTPS for all pages');
      score -= 20;
    }

    // Check CSP
    if (!this.checkCSP()) {
      issues.push('No Content Security Policy detected');
      recommendations.push('Implement Content Security Policy headers');
      score -= 15;
    }

    // Check for security headers (basic check)
    if (typeof document !== 'undefined') {
      const hasSecurityHeaders = document.querySelector('meta[name="referrer"]') ||
                                document.querySelector('meta[http-equiv*="X-"]');
      if (!hasSecurityHeaders) {
        issues.push('Missing security headers');
        recommendations.push('Add security headers like X-Frame-Options, X-Content-Type-Options');
        score -= 10;
      }
    }

    // Check cookie consent
    if (!this.privacy.hasCookieConsent()) {
      recommendations.push('Implement cookie consent mechanism');
      score -= 5;
    }

    // Additional recommendations
    recommendations.push('Implement input validation on all forms');
    recommendations.push('Add CSRF tokens to form submissions');
    recommendations.push('Regularly update dependencies');
    recommendations.push('Implement proper error handling');

    return {
      score: Math.max(0, score),
      issues,
      recommendations
    };
  }
}