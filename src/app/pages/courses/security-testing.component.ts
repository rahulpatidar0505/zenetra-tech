import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-security-testing',
  templateUrl: './security-testing.component.html',
  styleUrls: ['./security-testing.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [PdfService]
})
export class SecurityTestingComponent {
  activeModule: string | null = null;

  courseData = {
    title: 'Security Testing Training',
    duration: '8 Weeks',
    description: 'Security testing is crucial in today\'s digital landscape. Our training program is designed to take you from beginner to professional with hands-on exercises, real-world scenarios, and industry-standard tools. By the end of the course, you\'ll be ready to identify vulnerabilities, conduct security assessments, and implement robust security measures.',
    modules: [
      {
        title: 'Module 1: Security Testing Fundamentals',
        goal: 'Understand the core concepts of security testing and cybersecurity',
        content: [
          'Introduction to Security Testing → Learn what security testing is and why it\'s critical.',
          'Types of Security Testing → Understand different approaches: black box, white box, grey box.',
          'Security Testing Lifecycle → Master the systematic approach to security testing.',
          'Common Vulnerabilities → Overview of OWASP Top 10 and common security risks.',
          'Security Testing Tools → Introduction to essential security testing tools.',
          'Setting Up Lab Environment → Configure your security testing workspace.'
        ]
      },
      {
        title: 'Module 2: Web Application Security',
        goal: 'Learn to identify and exploit common web vulnerabilities',
        content: [
          'HTTP Security → Understanding headers, methods, and secure communication.',
          'Cross-Site Scripting (XSS) → Different types of XSS and prevention methods.',
          'SQL Injection → Advanced SQL injection techniques and mitigation.',
          'Cross-Site Request Forgery → CSRF attack vectors and protection.',
          'Authentication Vulnerabilities → Session management and access control.',
          'Security Headers → Implementation of security headers and best practices.'
        ]
      },
      {
        title: 'Module 3: Penetration Testing',
        goal: 'Master the art of ethical hacking and penetration testing',
        content: [
          'Penetration Testing Methodology → OWASP testing framework and best practices.',
          'Reconnaissance Techniques → Information gathering and footprinting.',
          'Vulnerability Scanning → Using tools like Nessus, OpenVAS, and Acunetix.',
          'Exploitation Techniques → Safe exploitation of discovered vulnerabilities.',
          'Post Exploitation → Maintaining access and covering tracks ethically.',
          'Reporting → Creating professional penetration testing reports.'
        ]
      },
      {
        title: 'Module 4: API Security Testing',
        goal: 'Learn to test and secure modern API endpoints',
        content: [
          'API Security Fundamentals → REST and GraphQL API security concepts.',
          'Authentication Methods → OAuth, JWT, and API keys security.',
          'API Vulnerabilities → Common API security issues and fixes.',
          'Rate Limiting → Implementing and testing rate limiting.',
          'API Documentation Testing → Reviewing API specs for security.',
          'Automated API Testing → Tools and frameworks for API security testing.'
        ]
      },
      {
        title: 'Module 5: Mobile Application Security',
        goal: 'Understand mobile app vulnerabilities and security testing',
        content: [
          'Mobile App Architecture → Understanding mobile app security architecture.',
          'Android Security Testing → Tools and techniques for Android testing.',
          'iOS Security Testing → Security testing iOS applications.',
          'Mobile API Security → Testing backend services of mobile apps.',
          'Data Storage Security → Secure data storage and encryption.',
          'Mobile App Pentesting → End-to-end mobile app security assessment.'
        ]
      },
      {
        title: 'Module 6: Cloud Security Testing',
        goal: 'Learn to test security in cloud environments',
        content: [
          'Cloud Security Basics → Understanding cloud security models.',
          'AWS Security Testing → Testing AWS infrastructure and services.',
          'Azure Security → Microsoft Azure security testing.',
          'Container Security → Docker and Kubernetes security testing.',
          'Serverless Security → Testing serverless applications.',
          'Cloud Compliance → Security compliance in cloud environments.'
        ]
      },
      {
        title: 'Module 7: Security Tools & Automation',
        goal: 'Master industry-standard security testing tools',
        content: [
          'Burp Suite Professional → Advanced web security testing.',
          'OWASP ZAP → Open-source security testing tool.',
          'Metasploit Framework → Exploitation and testing framework.',
          'Automated Scanning → Integrating security in CI/CD.',
          'Custom Scripts → Developing security testing scripts.',
          'Tool Integration → Combining tools for comprehensive testing.'
        ]
      },
      {
        title: 'Module 8: Compliance & Standards',
        goal: 'Understanding security compliance and regulations',
        content: [
          'Security Standards → ISO 27001, PCI DSS, HIPAA requirements.',
          'Compliance Testing → Testing for regulatory compliance.',
          'Security Policies → Creating and testing security policies.',
          'Risk Assessment → Security risk assessment methodologies.',
          'Audit Preparation → Preparing for security audits.',
          'Documentation → Creating compliance documentation.'
        ]
      },
      {
        title: 'Module 9: Advanced Security Testing',
        goal: 'Master advanced security testing techniques',
        content: [
          'Advanced Exploitation → Complex vulnerability exploitation.',
          'Reverse Engineering → Basic reverse engineering for security.',
          'Malware Analysis → Understanding and analyzing malware.',
          'Network Pentesting → Advanced network security testing.',
          'Social Engineering → Testing human security aspects.',
          'Red Team Exercises → Conducting red team assessments.'
        ]
      },
      {
        title: 'Module 10: Career Preparation',
        goal: 'Prepare for a career in security testing',
        content: [
          'Security Certifications → Guide to relevant security certifications.',
          'Portfolio Building → Creating a security testing portfolio.',
          'Mock Assessments → Practice security assessments.',
          'Interview Preparation → Security testing interview questions.',
          'Career Paths → Different roles in security testing.',
          'Networking → Joining security communities and conferences.'
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
        course: 'Security Testing',
        courseType: 'training'
      }
    });
  }

  downloadCoursePdf() {
    this.pdfService.downloadCoursePdf(this.courseData);
  }
}
