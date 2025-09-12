import { Component } from '@angular/core';
import { BannerSlide } from './components/zenetra-banner-slider/zenetra-banner-slider.component';

@Component({
  selector: 'app-example',
  template: `
    <app-zenetra-banner-slider [slides]="bannerSlides" [interval]="5000"></app-zenetra-banner-slider>
  `
})
export class ExampleComponent {
  // Example banner slides based on the image you shared
  bannerSlides: BannerSlide[] = [
    {
      title: 'Playwright Testing Mastery',
      description: 'A step-by-step program for Quality Engineers to master test automation with personalized mentorship and feedback.',
      img: 'assets/images/courses/playwright-masks.png',
      alt: 'Playwright Testing Mastery',
      backgroundImg: 'assets/images/courses/dark-bg.jpg',
      buttonText: 'Explore Course',
      link: '/courses/playwright-automation'
    },
    {
      title: 'Java Development',
      description: 'Master Java with Spring Boot and build powerful enterprise applications with industry best practices.',
      img: 'assets/images/java-development.jpg',
      alt: 'Java Development',
      backgroundImg: 'assets/images/courses/dark-bg.jpg',
      buttonText: 'Learn More',
      link: '/courses/java-development'
    },
    {
      title: 'Security Testing',
      description: 'Learn to identify vulnerabilities and protect applications with our comprehensive security testing program.',
      img: 'assets/images/security-testing.gif',
      alt: 'Security Testing',
      backgroundImg: 'assets/images/courses/dark-bg.jpg',
      buttonText: 'Discover',
      link: '/courses/security-testing'
    }
  ];
}
