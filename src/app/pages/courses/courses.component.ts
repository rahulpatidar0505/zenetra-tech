import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {
  courses = [
    {
      id: 'playwright-automation',
      title: 'Playwright Automation',
      description: '🎭 Master Microsoft Playwright with JavaScript Perfect for beginners and experienced testers alike! 💕 Hands-on projects, real-world scenarios, and personalized mentorship every step of the way. Build automation',
      image: '/assets/images/courses/playwright.jpg',
      route: '/courses/playwright-automation'
    },
    {
      id: 'java-development',
      title: 'Java Development',
      description: '💝 Master Java with Spring Boot! Build powerful enterprise apps using modern architecture & best practices — all through hands-on, project-based learning. 👨‍💻 Perfect for developers aiming to level up their backend skills and land high-impact roles!',
      image: '/assets/images/courses/Java.jpg',
      route: '/courses/java-development'
    },
    {
      id: 'security-testing',
      title: 'Security Testing',
      description: '🔐 Secure your applications before attackers do! Identify vulnerabilities, safeguard data, and build trust with testing. 🛡️ Stay ahead with proactive defense and real-world attack simulations - perfect for anyone aiming to build strong, secure systems.',
      image: '/assets/images/courses/Security.jpg',
      route: '/courses/security-testing'
    }
  ];
}
