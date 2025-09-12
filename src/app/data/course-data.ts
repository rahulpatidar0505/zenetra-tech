import { CourseModule, CourseData } from '../services/pdf.service';

export const javaCourseSyllabus: CourseData = {
  title: 'Java Development Training',
  description: 'Comprehensive Java training program covering fundamentals to advanced concepts, preparing you for professional Java development.',
  duration: '12 Weeks',
  modules: [
    {
      title: 'Java Fundamentals',
      goal: 'Master core Java concepts and object-oriented programming',
      content: [
        'Introduction to Java - Learn about JDK, JRE, JVM, and setup development environment',
        'Basic Syntax - Variables, data types, operators, and control structures',
        'Object-Oriented Programming - Classes, objects, inheritance, polymorphism, and encapsulation',
        'Exception Handling - Try-catch blocks, custom exceptions',
        'Collections Framework - Lists, Sets, Maps, and their implementations',
        'File I/O & Streams - Reading/writing files, handling different file formats'
      ]
    },
    {
      title: 'Advanced Java',
      goal: 'Learn advanced Java features and modern programming techniques',
      content: [
        'Multithreading - Thread lifecycle, synchronization, concurrency',
        'Functional Programming - Lambda expressions, Stream API',
        'Generics - Type parameters, bounded types, wildcards',
        'Java 8+ Features - Default methods, static methods in interfaces',
        'Design Patterns - Singleton, Factory, Builder, Observer patterns'
      ]
    }
  ]
};

export const automationTestingSyllabus: CourseData = {
  title: 'Automation Testing Training',
  description: 'Complete automation testing course covering modern testing frameworks and best practices for web application testing.',
  duration: '8 Weeks',
  modules: [
    {
      title: 'Testing Fundamentals',
      goal: 'Understanding core testing concepts and automation basics',
      content: [
        'Introduction to Software Testing - Types, levels, and importance of testing',
        'Test Automation Fundamentals - When to automate, tools selection, frameworks',
        'Basic Programming Concepts - Java/Python basics for automation',
        'Version Control with Git - Basic commands, branching, pull requests',
        'Test Case Design - Writing effective test cases, test scenarios'
      ]
    },
    {
      title: 'Web Automation',
      goal: 'Master web automation using modern frameworks',
      content: [
        'Selenium WebDriver - Setup, locators, actions, waits',
        'Playwright - Modern automation, cross-browser testing',
        'TestNG/JUnit - Test organization, assertions, parallel execution',
        'Page Object Model - Design patterns in automation',
        'CI/CD Integration - Jenkins, GitHub Actions'
      ]
    }
  ]
};

export const mcpServerSyllabus: CourseData = {
  title: 'Model Context Protocol Server Training',
  description: 'Learn to build and deploy Model Context Protocol (MCP) servers for advanced AI applications.',
  duration: '6 Weeks',
  modules: [
    {
      title: 'MCP Fundamentals',
      goal: 'Understanding MCP architecture and basic implementation',
      content: [
        'Introduction to MCP - Protocol overview, use cases, architecture',
        'Server Setup - Environment configuration, dependencies',
        'Basic Server Implementation - Request handling, routing',
        'Authentication & Security - Token-based auth, secure communications',
        'Error Handling - Standard error responses, logging'
      ]
    },
    {
      title: 'Advanced MCP Development',
      goal: 'Build production-ready MCP servers with advanced features',
      content: [
        'Advanced Protocol Features - Streaming, bidirectional communication',
        'Performance Optimization - Caching, connection pooling',
        'Monitoring & Logging - Metrics collection, log aggregation',
        'Deployment - Docker containerization, cloud deployment',
        'Testing - Unit tests, integration tests, load testing'
      ]
    }
  ]
};
