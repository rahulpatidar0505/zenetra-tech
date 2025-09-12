import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  providers: [PdfService]
})
export class CoursesComponent implements OnInit {
  
  constructor(private pdfService: PdfService) {}
  
  ngOnInit() {
  }

  downloadAllCourses() {
    const coursesData = [
      {
        title: 'Java Development',
        duration: '12 Weeks',
        description: 'Comprehensive Java development training program covering modern Java features, Spring Framework, microservices, and enterprise development best practices.',
        modules: [
          {
            title: 'Module 1: Java Fundamentals',
            goal: 'Master core Java concepts and object-oriented programming',
            content: [
              'Introduction to Java → Learn about JDK, JRE, JVM, and setting up development environment',
              'Basic Syntax → Variables, data types, operators, and control statements',
              'Object-Oriented Programming → Classes, objects, inheritance, polymorphism, encapsulation',
              'Exception Handling → Try-catch blocks, custom exceptions, best practices',
              'Collections Framework → Lists, Sets, Maps, and their implementations',
              'File I/O & Streams → Reading/writing files, handling different file formats'
            ]
          },
          {
            title: 'Module 2: Advanced Java',
            goal: 'Learn advanced Java features and modern programming techniques',
            content: [
              'Multithreading → Thread lifecycle, synchronization, concurrent collections',
              'Functional Programming → Lambda expressions, Stream API, Optional class',
              'Generics → Type parameters, bounded types, wildcards',
              'Java 8+ Features → Default methods, static methods in interfaces, Date/Time API',
              'Design Patterns → Singleton, Factory, Builder, Observer patterns',
              'Clean Code Principles → SOLID principles, code organization, naming conventions'
            ]
          }
        ]
      },
      {
        title: 'Playwright Automation',
        duration: '8 Weeks',
        description: 'Master Microsoft Playwright with JavaScript Perfect for beginners and experienced testers alike! Learn modern test automation practices and advance your career.',
        modules: [
          {
            title: 'Module 1: Automation Fundamentals',
            goal: 'Learn core concepts of test automation and Playwright basics',
            content: [
              'Introduction to Test Automation → Principles, benefits, and best practices',
              'Playwright Setup → Installation, configuration, and project structure',
              'JavaScript Essentials → Basic syntax, async/await, and ES6 features',
              'Writing First Test → Basic test structure and assertions',
              'Page Object Model → Design patterns and test organization',
              'Test Runner → Configuration and execution options'
            ]
          },
          {
            title: 'Module 2: Advanced Automation',
            goal: 'Master advanced automation techniques and frameworks',
            content: [
              'Multi-browser Testing → Cross-browser automation strategies',
              'API Testing → REST API automation with Playwright',
              'Visual Testing → Screenshot comparison and visual validation',
              'Performance Testing → Basic performance metrics and reporting',
              'CI/CD Integration → Jenkins, GitHub Actions setup',
              'Reporting → HTML reports, custom reporting solutions'
            ]
          }
        ]
      }
    ];

    this.pdfService.downloadAllCoursesPdf(coursesData);
  }
  
  courses = [
    {
      id: 'playwright-automation',
      title: 'Playwright Automation',
      description: '🎭 Master Microsoft Playwright with JavaScript Perfect for beginners and experienced testers alike! 💕 Hands-on projects, real-world scenarios, and personalized mentorship every step of the way. Build automation',
      image: '/assets/images/playwright1.jpg',
      route: '/courses/playwright-automation'
    },
    {
      id: 'java-development',
      title: 'Java Development',
      description: '💝 Master Java with Spring Boot! Build powerful enterprise apps using modern architecture & best practices — all through hands-on, project-based learning. 👨‍💻 Perfect for developers aiming to level up their backend skills and land high-impact roles!',
      image: '/assets/images/Java.jpg',
      route: '/courses/java-development'
    },
    {
      id: 'security-testing',
      title: 'Security Testing',
      description: '🔐 Secure your applications before attackers do! Identify vulnerabilities, safeguard data, and build trust with testing. 🛡️ Stay ahead with proactive defense and real-world attack simulations - perfect for anyone aiming to build strong, secure systems.',
      image: '/assets/images/Security.jpg',
      route: '/courses/security-testing'
    }
  ];
}
