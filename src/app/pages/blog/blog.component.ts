import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
  blogPosts = [
    {
      date: 'September 3, 2025',
      readTime: '15 min read',
      image: '/assets/images/Playwright1.jpg',
      title: 'Playwright vs Cypress vs Selenium: A Comprehensive Comparison',
      excerpt: 'Discover the key differences between today\'s most popular automation testing frameworks. Learn which tool best suits your project needs.',
      route: '/blog/playwright-vs-cypress-selenium',
      tags: ['Automation', 'Testing', 'Frameworks']
    },
    {
      date: 'September 3, 2025',
      readTime: '12 min read',
      image: '/assets/images/MCP%20Image.jpg',
      title: 'Model Context Protocol (MCP) Server: Enhancing AI Development',
      excerpt: 'Discover how Model Context Protocol servers can revolutionize AI development by providing standardized communication and enhanced context management.',
      route: '/blog/mcp-server',
      tags: ['AI', 'Development', 'Innovation']
    }
  ];

  // Error handling is now done directly in the template
}
