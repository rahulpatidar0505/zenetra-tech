import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container" [class]="containerClass">
      <div class="loading-spinner" [class]="spinnerClass" *ngIf="type === 'spinner'">
        <div class="spinner"></div>
        <p *ngIf="message" class="loading-message">{{ message }}</p>
      </div>
      
      <div class="loading-skeleton" *ngIf="type === 'skeleton'">
        <div class="skeleton-line" *ngFor="let line of skeletonLines"></div>
      </div>
      
      <div class="loading-dots" *ngIf="type === 'dots'">
        <div class="dot" *ngFor="let dot of [1,2,3]"></div>
        <p *ngIf="message" class="loading-message">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .loading-spinner {
      text-align: center;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(1, 48, 36, 0.1);
      border-left: 3px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    .loading-message {
      color: var(--text-color-light);
      font-size: var(--font-size-sm);
      margin: 0;
    }

    .loading-skeleton {
      width: 100%;
      max-width: 400px;
    }

    .skeleton-line {
      height: 16px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
      margin-bottom: 12px;
    }

    .skeleton-line:nth-child(1) { width: 100%; }
    .skeleton-line:nth-child(2) { width: 85%; }
    .skeleton-line:nth-child(3) { width: 92%; }
    .skeleton-line:nth-child(4) { width: 78%; }

    .loading-dots {
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 1rem;
    }

    .loading-dots > div {
      display: flex;
      gap: 8px;
    }

    .dot {
      width: 8px;
      height: 8px;
      background: var(--primary-color);
      border-radius: 50%;
      animation: dotPulse 1.4s infinite ease-in-out both;
    }

    .dot:nth-child(1) { animation-delay: -0.32s; }
    .dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes dotPulse {
      0%, 80%, 100% {
        transform: scale(0);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    /* Size variants */
    .loading-small .spinner { width: 24px; height: 24px; }
    .loading-large .spinner { width: 60px; height: 60px; }

    /* Fullscreen overlay */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      z-index: var(--z-modal);
      backdrop-filter: blur(2px);
    }
  `]
})
export class LoadingComponent {
  @Input() type: 'spinner' | 'skeleton' | 'dots' = 'spinner';
  @Input() message?: string;
  @Input() containerClass?: string;
  @Input() spinnerClass?: string;
  @Input() skeletonLines: number[] = [1, 2, 3, 4];
}