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
        this.progressWidth = Math.min((elapsed / this.interval) * 100, 100);
        
        if (this.progressWidth < 100) {
          this.progressId = requestAnimationFrame(updateProgress);
        }
      } else {
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
    this.progressWidth = 0;
    this.progressStartTime = Date.now();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.resetProgress();
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.resetProgress();
  }

  goToSlide(idx: number) {
    this.currentIndex = idx;
    this.resetProgress();
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isHovered = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isHovered = false;
    this.resetProgress();
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
