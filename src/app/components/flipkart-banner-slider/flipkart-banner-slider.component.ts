import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ImagePreloadDirective } from '../../directives/image-preload.directive';
import { ImageOptimizationService } from '../../services/image-optimization.service';

export interface BannerSlide {
  img: string;
  alt?: string;
  link?: string;
  backgroundImg?: string;
  title?: string;
  description?: string;
  buttonText?: string;
}

@Component({
  selector: 'app-flipkart-banner-slider',
  templateUrl: './flipkart-banner-slider.component.html',
  styleUrls: ['./flipkart-banner-slider.component.scss'],
  imports: [ImagePreloadDirective],
  standalone: true
})
export class FlipkartBannerSliderComponent implements OnInit, OnDestroy {
  @Input() slides: BannerSlide[] = [];
  @Input() interval: number = 3000;

  currentIndex = 0;
  autoplayId: any;
  progressId: any;
  isHovered = false;
  touchStartX: number | null = null;
  touchEndX: number | null = null;
  progressWidth = 0;
  progressStartTime = 0;
  pausedProgress: number | undefined;

  ngOnInit() {
    this.preloadImages();
    this.startAutoplay();
  }

  private preloadImages() {
    // Preload the first few images for better performance
    this.slides.slice(0, 3).forEach(slide => {
      const img = new Image();
      img.src = slide.img;
      if (slide.backgroundImg) {
        const bgImg = new Image();
        bgImg.src = slide.backgroundImg;
      }
    });
  }

  ngOnDestroy() {
    this.stopAutoplay();
    this.stopProgress();
  }

  startAutoplay() {
    this.stopAutoplay();
    this.startProgress();
    this.autoplayId = setInterval(() => {
      if (!this.isHovered) {
        this.nextSlide();
      }
    }, this.interval);
  }

  stopAutoplay() {
    if (this.autoplayId) {
      clearInterval(this.autoplayId);
      this.autoplayId = null;
    }
    this.stopProgress();
  }

  startProgress() {
    this.stopProgress();
    this.progressWidth = 0;
    this.progressStartTime = Date.now();
    
    const updateProgress = () => {
      if (!this.isHovered) {
        const elapsed = Date.now() - this.progressStartTime;
        const progressPercentage = (elapsed / this.interval) * 100;
        this.progressWidth = Math.min(progressPercentage, 100);
        
        if (this.progressWidth < 100) {
          this.progressId = requestAnimationFrame(updateProgress);
        } else {
          // Ensure progress bar completes exactly at 100%
          this.progressWidth = 100;
        }
      } else {
        // Keep updating even when hovered to maintain smooth animation when resumed
        this.progressId = requestAnimationFrame(updateProgress);
      }
    };
    
    this.progressId = requestAnimationFrame(updateProgress);
  }

  stopProgress() {
    if (this.progressId) {
      cancelAnimationFrame(this.progressId);
      this.progressId = null;
    }
  }

  resetProgress() {
    this.stopProgress();
    this.progressWidth = 0;
    this.progressStartTime = Date.now();
    this.startProgress();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.resetProgress();
    this.startAutoplay(); // Restart autoplay with fresh timing
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.resetProgress();
    this.startAutoplay(); // Restart autoplay with fresh timing
  }

  goToSlide(idx: number) {
    this.currentIndex = idx;
    this.resetProgress();
    this.startAutoplay(); // Restart autoplay with fresh timing
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isHovered = true;
    // Store the current progress when hovering
    const elapsed = Date.now() - this.progressStartTime;
    this.pausedProgress = Math.min((elapsed / this.interval) * 100, 100);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isHovered = false;
    // Resume from where we left off
    if (this.pausedProgress !== undefined) {
      const remainingTime = this.interval * (1 - this.pausedProgress / 100);
      this.progressStartTime = Date.now() - (this.interval - remainingTime);
      this.pausedProgress = undefined;
    }
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipe();
  }

  handleSwipe() {
    if (this.touchStartX !== null && this.touchEndX !== null) {
      const deltaX = this.touchEndX - this.touchStartX;
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.prevSlide();
        } else {
          this.nextSlide();
        }
      }
    }
    this.touchStartX = null;
    this.touchEndX = null;
  }
}
