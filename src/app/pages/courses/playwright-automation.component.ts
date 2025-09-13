import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-playwright-automation',
  templateUrl: './playwright-automation.component.html',
  styleUrls: ['./playwright-automation.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [PdfService]
})
export class PlaywrightAutomationComponent {
  activeModule: string | null = null;

  courseData = {
    title: 'Playwright Automation Testing Training',
    duration: '6 Weeks',
    description: 'Playwright is a modern, fast, and reliable framework for cross-browser testing. Our training program is designed to take you from beginner to advanced with hands-on exercises, live projects, and industry-level frameworks. By the end of the course, you\'ll be ready to build automation frameworks, integrate with CI/CD, and crack automation interviews.',
    outcomes: [
      'Build and execute comprehensive test automation frameworks using Playwright',
      'Master cross-browser automation across Chrome, Firefox, Safari, and Edge',
      'Implement advanced testing patterns including Page Object Model and Data-Driven Testing',
      'Integrate Playwright tests with CI/CD pipelines and DevOps workflows',
      'Develop API testing capabilities alongside UI automation',
      'Create robust, maintainable test suites with proper error handling and reporting'
    ],
    benefits: [
      'Industry-leading curriculum designed by automation experts',
      'Hands-on projects with real-world application scenarios',
      'Personalized mentorship from experienced automation engineers',
      'Access to latest Playwright features and best practices',
      'Career guidance and interview preparation for automation roles',
      'Lifetime access to course materials and regular updates'
    ],
    prerequisites: [
      'Basic understanding of web technologies (HTML, CSS, JavaScript)',
      'Familiarity with software testing concepts',
      'Experience with any programming language (preferred but not required)',
      'Computer with Node.js installation capability'
    ],
    modules: [
      {
        title: 'Module 1: Foundations',
        duration: '1 Week',
        goal: 'Build a solid base in Playwright and automation fundamentals',
        content: [
          'Introduction to Playwright → Learn what Playwright is, why it\'s popular, and where it fits in modern automation.',
          'Why Playwright? → Understand the benefits: speed, reliability, cross-browser support, and built-in automation features.',
          'Selenium vs Playwright → Compare performance, architecture, and advanced capabilities.',
          'Tools & Technology Overview → Introduction to Node.js, NPM, VS Code, Git, and other essentials for Playwright automation.',
          'DOM Fundamentals → Learn the structure of web pages and how it impacts test automation.',
          'Git Basics & Version Control → Master Git commands for managing automation frameworks effectively.'
        ]
      },
      {
        title: 'Module 2: JavaScript Fundamentals',
        duration: '1 Week',
        goal: 'Learn the JavaScript skills required for Playwright automation',
        content: [
          'Variables & Data Types → Understand different ways of storing and using data in automation.',
          'Operators & Expressions → Learn how to build conditions and logical operations.',
          'Loops & Conditional Statements → Write dynamic, reusable automation workflows.',
          'Arrays & Objects → Manage and manipulate test data efficiently.',
          'Functions & Arrow Functions → Reuse and modularize your code for better maintainability.',
          'Async / Await → Handle asynchronous operations in Playwright effectively.'
        ]
      },
      {
        title: 'Module 3: Playwright Essentials',
        duration: '1 Week',
        goal: 'Get hands-on with Playwright and write your first automation scripts',
        content: [
          'Installation & Setup → Install Playwright and configure the environment.',
          'Test Execution (CLI & UI) → Run tests via the command line and Playwright UI mode.',
          'Test Structure & Hooks → Organize your tests with beforeAll, afterAll, beforeEach, afterEach hooks.',
          'Interaction with Web Elements → Automate clicks, typing, checkboxes, dropdowns, drag & drop, and more.',
          'Handling Timeouts → Learn how to handle page load delays and prevent flaky tests.',
          'Locator Assertions vs Generic Assertions → Understand the difference and when to use each.',
          'Dealing with UI Components → Automate complex elements like modals, sliders, and date pickers.'
        ]
      },
      {
        title: 'Module 4: Test Design & Best Practices',
        duration: '1 Week',
        goal: 'Design scalable, maintainable, and reusable automation frameworks',
        content: [
          'Page Object Model (POM) → Implement a clean and modular framework structure.',
          'Framework Design Concepts → Learn professional approaches to building robust automation frameworks.',
          'DRY (Don\'t Repeat Yourself) → Write reusable code and avoid duplication.',
          'KISS (Keep It Simple, Stupid) → Keep your tests simple, readable, and efficient.',
          'Test Retries → Minimize flaky test failures with smart retries.',
          'Parallel Execution → Run tests simultaneously across browsers for faster results.',
          'Screenshots & Videos → Capture screenshots and record videos for debugging and reporting.'
        ]
      },
      {
        title: 'Module 5: API Testing',
        duration: '3 Days',
        goal: 'Learn API testing using Playwright and integrate UI + API automation',
        content: [
          'Postman Basics → Understand API workflows, requests, and responses.',
          'API Fundamentals → Learn REST API concepts, HTTP methods, and status codes.',
          'API Automation using Playwright → Write Playwright-based API tests and validate responses.',
          'Framework Design for API Tests → Build an integrated framework for API + UI testing.'
        ]
      },
      {
        title: 'Module 6: Configurations & Environment Handling',
        duration: '3 Days',
        goal: 'Make your Playwright framework flexible and environment-ready',
        content: [
          'Environment Variables → Securely manage sensitive data and configurations.',
          'Configuration Files → Maintain different setups for QA, Staging, and Production environments.',
          'Fixtures → Reuse login sessions and speed up test execution.',
          'Project Setup & Teardown → Automate environment preparation and cleanup.',
          'Global Setup & Teardown → Manage initialization and test-level cleanup at scale.',
          'Test Tags → Organize tests using tags for better execution control.'
        ]
      },
      {
        title: 'Module 7: Advanced Playwright',
        duration: '4 Days',
        goal: 'Master advanced Playwright features for real-world automation challenges',
        content: [
          'NPM Scripts & CLI Commands → Simplify test execution with custom commands.',
          'Mobile Device Emulation → Test websites across various mobile screen sizes.',
          'Reporting & Insights → Generate rich HTML, Allure, and JSON reports.',
          'Email Integration in Reports → Automate sending detailed test reports.'
        ]
      },
      {
        title: 'Module 8: CI/CD & DevOps',
        duration: '4 Days',
        goal: 'Automate Playwright execution in modern DevOps pipelines',
        content: [
          'Introduction to CI/CD → Learn continuous integration and deployment basics.',
          'Jenkins Pipeline Integration → Set up Playwright in Jenkins pipelines.',
          'Git in Automation Projects → Collaborate effectively on frameworks using Git.',
          'Test Reporting in CI/CD → Generate dashboards and test reports in pipelines.'
        ]
      },
      {
        title: 'Module 9: Artificial Intelligence in Playwright',
        duration: '3 Days',
        goal: 'Leverage AI for smarter and faster test automation',
        content: [
          'GitHub Copilot for Test Writing → Generate Playwright scripts using AI-powered suggestions.',
          'Prompt Designing for Automation → Craft effective AI prompts for better test generation.',
          'MCP Integration with Playwright → Use machine learning-driven optimizations.',
          'AI-Assisted Debugging → Automatically detect flaky tests and improve reliability.'
        ]
      },
      {
        title: 'Module 10: Career Preparation',
        duration: '5 Days',
        goal: 'Become job-ready and prepare for real-world automation challenges',
        content: [
          'Live Project (End-to-End Automation) → Automate a complete application using Playwright.',
          'Resume Preparation → Showcase your Playwright skills and projects effectively.',
          'Mock Interview 1 (Technical) → Prepare for Playwright-related technical interviews.',
          'Mock Interview 2 (Technical) → Gain real interview experience and improve confidence.'
        ]
      }
    ]
  };

  constructor(private router: Router, private pdfService: PdfService) {}

  toggleModule(moduleId: string) {
    this.activeModule = this.activeModule === moduleId ? null : moduleId;
  }

  enrollNow() {
    this.router.navigate(['/contact-us'], { 
      queryParams: { 
        course: 'Playwright Automation',
        courseType: 'training'
      }
    });
  }

  downloadCoursePdf() {
    this.pdfService.downloadCoursePdf('Playwright Automation Testing Training');
  }
}
