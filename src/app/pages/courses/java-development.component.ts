import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-java-development',
  templateUrl: './java-development.component.html',
  styleUrls: ['./java-development.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [PdfService]
})
export class JavaDevelopmentComponent {
  activeModule: string | null = null;

  courseData = {
    title: 'Java Development',
    duration: '12 Weeks',
    description: 'Comprehensive Java development training program covering modern Java features, Spring Framework, microservices, and enterprise development best practices. Perfect for developers aiming to build scalable enterprise applications.',
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
      // Add other modules similarly...
    ]
  };

  constructor(private router: Router, private pdfService: PdfService) {}

  toggleModule(moduleId: string) {
    this.activeModule = this.activeModule === moduleId ? null : moduleId;
  }

  enrollNow() {
    this.router.navigate(['/contact-us'], { 
      queryParams: { 
        course: 'Java Development',
        courseType: 'training'
      }
    });
  }

  downloadCoursePdf() {
    this.pdfService.downloadCoursePdf(this.courseData);
  }
}
