import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  faqs = [
    {
      question: 'Are the lectures live or recorded?',
      answer: 'The training is conducted through live sessions only, allowing real-time interaction with the instructor for immediate support and clarification.'
    },
    {
      question: 'Where can I find course prices?',
      answer: 'You can find the course prices by visiting the course details section. Simply select the course you\'re interested in, and the pricing information will be listed along with the course overview and other relevant details.'
    },
    {
      question: 'What are the prerequisites for the courses at Zenetra Technology?',
      answer: 'There are no prerequisites for the courses at Zenetra Technology. Anyone interested in learning can enroll and start from the basics.'
    },
    {
      question: 'Do you provide a certification at the end of the course?',
      answer: 'We do not provide a certification at the end of the course, as we believe certifications should hold real value and be recognized by official government or accredited bodies. Our focus is on delivering practical skills and hands-on knowledge that directly contribute to your growth.'
    }
  ];

  openFaqIndex: number | null = null;

  toggleFaq(index: number) {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }
  heroSlides = [
    {
      title: 'What We Offer?',
      subtitle: 'We are a leading IT services company specializing in Project Development, Online Training, Workshops and Project Support.',
      img: '/assets/images/what-we-offer.jpg',
      route: '#',
      isCustomSlide: true,
      customContent: 'what-we-offer'
    },
    {
      title: 'Playwright Testing Mastery',
      subtitle: 'A step-by-step program for Quality Engineers to master test automation with personalized mentorship and feedback.',
      img: '/assets/images/courses/playwright.jpg',
      route: '/courses/playwright-automation'
    },
    {
      title: 'Java Development',
      subtitle: 'Master Java programming and Spring Boot development. Build robust applications with hands-on projects and expert guidance.',
      img: '/assets/images/courses/Java.jpg',
      route: '/courses/java-development'
    },
    {
      title: 'Security Testing',
      subtitle: 'Understand security testing fundamentals, tools, and techniques. Learn to identify vulnerabilities and secure your applications.',
      img: '/assets/images/courses/Security.jpg',
      route: '/courses/security-testing'
    }
  ];
  currentSlide = 0;
  intervalId: any;
  sliderPaused = false;
  resetAnimation = false;

  ngOnInit() {
    this.startSlider();
  }

  ngOnDestroy() {
    this.stopSlider();
  }

  startSlider() {
    this.stopSlider();
    this.resetProgressBarAnimation();
    this.intervalId = setInterval(() => {
      if (!this.sliderPaused) {
        this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
        this.resetProgressBarAnimation();
      }
    }, 3000); // Reduced to 3 seconds between slides
  }
  
  resetProgressBarAnimation() {
    // This triggers a DOM reflow to restart CSS animations
    this.resetAnimation = true;
    setTimeout(() => {
      this.resetAnimation = false;
    }, 0);
  }

  stopSlider() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  pauseSlider() {
    this.sliderPaused = true;
  }

  resumeSlider() {
    this.sliderPaused = false;
  }

  onSlideClick(slide: any) {
    if (slide.route) {
      window.location.href = slide.route;
    }
  }
  
  goToPrevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
    this.pauseSlider();
    this.resetProgressBarAnimation();
    // Resume auto-sliding after a user interaction
    setTimeout(() => this.resumeSlider(), 3000);
  }
  
  goToNextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
    this.pauseSlider();
    this.resetProgressBarAnimation();
    // Resume auto-sliding after a user interaction
    setTimeout(() => this.resumeSlider(), 3000);
  }
}
