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
  isHovered = false;
  touchStartX: number | null = null;
  touchEndX: number | null = null;

  ngOnInit() {
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  startAutoplay() {
    this.stopAutoplay();
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
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(idx: number) {
    this.currentIndex = idx;
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isHovered = true;
    this.stopAutoplay();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isHovered = false;
    this.startAutoplay();
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
