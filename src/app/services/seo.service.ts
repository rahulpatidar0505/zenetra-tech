import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  canonicalUrl?: string;
  robots?: string;
  schemaMarkup?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly baseUrl = 'https://zenetratechnologies.com';
  private readonly defaultImage = '/assets/images/zenetra-logo.ico';
  private readonly defaultAuthor = 'Zenetra Technology';

  constructor(
    private titleService: Title, 
    private meta: Meta,
    private router: Router
  ) { }

  updateTitle(title: string) {
    this.titleService.setTitle(`${title} | Zenetra Technology`);
  }

  updateSEO(data: SEOData): void {
    // Update Title
    if (data.title) {
      this.titleService.setTitle(`${data.title} | Zenetra Technology`);
    }

    // Update Meta Description
    if (data.description) {
      this.meta.updateTag({ name: 'description', content: data.description });
    }

    // Update Keywords
    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    }

    // Update Author
    this.meta.updateTag({ name: 'author', content: data.author || this.defaultAuthor });

    // Update Robots
    this.meta.updateTag({ name: 'robots', content: data.robots || 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' });

    // Current URL
    const currentUrl = data.url || `${this.baseUrl}${this.router.url}`;
    const imageUrl = data.image ? `${this.baseUrl}${data.image}` : `${this.baseUrl}${this.defaultImage}`;

    // Update Canonical URL
    this.addCanonicalURL(data.canonicalUrl || currentUrl);

    // Update Open Graph
    this.updateOpenGraph({
      title: data.title || 'Zenetra Technology - IT Training & Development Services',
      description: data.description || 'Leading IT services company specializing in Playwright Automation, Java Development, Security Testing, and more.',
      image: imageUrl,
      url: currentUrl,
      type: data.type || 'website'
    });

    // Update Twitter Card
    this.updateTwitterCard({
      title: data.title || 'Zenetra Technology - IT Training & Development Services',
      description: data.description || 'Leading IT services company specializing in Playwright Automation, Java Development, Security Testing, and more.',
      image: imageUrl,
      url: currentUrl
    });

    // Update Schema Markup
    if (data.schemaMarkup) {
      this.addStructuredData(data.schemaMarkup);
    }

    // Update dates if provided
    if (data.publishedDate) {
      this.meta.updateTag({ name: 'article:published_time', content: data.publishedDate });
    }
    if (data.modifiedDate) {
      this.meta.updateTag({ name: 'article:modified_time', content: data.modifiedDate });
    }
  }

  private updateOpenGraph(data: { title: string; description: string; image: string; url: string; type: string }): void {
    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:image', content: data.image });
    this.meta.updateTag({ property: 'og:url', content: data.url });
    this.meta.updateTag({ property: 'og:type', content: data.type });
    this.meta.updateTag({ property: 'og:site_name', content: 'Zenetra Technology' });
    this.meta.updateTag({ property: 'og:locale', content: 'en_US' });
  }

  private updateTwitterCard(data: { title: string; description: string; image: string; url: string }): void {
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: data.title });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    this.meta.updateTag({ name: 'twitter:image', content: data.image });
    this.meta.updateTag({ name: 'twitter:url', content: data.url });
  }

  updateMetaTags(config: {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    author?: string;
  }) {
    if (config.title) {
      this.titleService.setTitle(config.title);
      this.meta.updateTag({ property: 'og:title', content: config.title });
      this.meta.updateTag({ name: 'twitter:title', content: config.title });
    }

    if (config.description) {
      this.meta.updateTag({ name: 'description', content: config.description });
      this.meta.updateTag({ property: 'og:description', content: config.description });
      this.meta.updateTag({ name: 'twitter:description', content: config.description });
    }

    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
      this.meta.updateTag({ name: 'twitter:image', content: config.image });
    }

    if (config.url) {
      this.meta.updateTag({ property: 'og:url', content: config.url });
      this.meta.updateTag({ name: 'twitter:url', content: config.url });
    }

    if (config.type) {
      this.meta.updateTag({ property: 'og:type', content: config.type });
    }

    if (config.author) {
      this.meta.updateTag({ name: 'author', content: config.author });
    }

    // Always ensure these base tags are present
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Zenetra Technology' });
  }

  // Method to add structured data (JSON-LD)
  addStructuredData(data: any) {
    // Remove existing schema markup
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new schema markup
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  // Method to add canonical URL
  addCanonicalURL(url: string) {
    const existing = document.querySelector('link[rel="canonical"]');
    if (existing) {
      existing.setAttribute('href', url);
    } else {
      const link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      document.head.appendChild(link);
    }
  }

  generateOrganizationSchema(): any {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Zenetra Technology",
      "url": "https://zenetratechnologies.com",
      "logo": "https://zenetratechnologies.com/assets/images/zenetra-logo.ico",
      "description": "Leading IT services company specializing in Playwright Automation, Java Development, Security Testing, Project Development, Online Training, and Expert Support Services.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      },
      "sameAs": [],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "info@zenetratechnologies.com"
      },
      "foundingDate": "2020",
      "numberOfEmployees": {
        "@type": "QuantitativeValue",
        "minValue": 1,
        "maxValue": 50
      },
      "knowsAbout": [
        "Playwright Automation",
        "Java Development",
        "Security Testing",
        "Project Development",
        "Online Training",
        "IT Workshops",
        "Project Support"
      ]
    };
  }

  generateCourseSchema(courseData: any): any {
    return {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": courseData.name,
      "description": courseData.description,
      "provider": {
        "@type": "Organization",
        "name": "Zenetra Technology",
        "url": "https://zenetratechnologies.com"
      },
      "courseMode": "online",
      "educationalLevel": courseData.level || "Intermediate",
      "timeRequired": courseData.duration,
      "occupationalCategory": courseData.category || "Information Technology",
      "skillsOffered": courseData.skills || [],
      "offers": {
        "@type": "Offer",
        "category": "Course",
        "availability": "InStock"
      }
    };
  }

  generateBlogPostSchema(postData: any): any {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": postData.title,
      "description": postData.description,
      "author": {
        "@type": "Organization",
        "name": "Zenetra Technology"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Zenetra Technology",
        "logo": {
          "@type": "ImageObject",
          "url": "https://zenetratechnologies.com/assets/images/zenetra-logo.ico"
        }
      },
      "datePublished": postData.publishedDate,
      "dateModified": postData.modifiedDate || postData.publishedDate,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": postData.url
      },
      "image": postData.image ? `https://zenetratechnologies.com${postData.image}` : "https://zenetratechnologies.com/assets/images/zenetra-logo.ico"
    };
  }

  validateSEO(): { issues: string[]; recommendations: string[] } {
    const issues = [];
    const recommendations = [];

    // Check title
    const title = this.titleService.getTitle();
    if (!title || title.length < 30) {
      issues.push('Page title is too short (should be 30-60 characters)');
    }
    if (title && title.length > 60) {
      issues.push('Page title is too long (should be 30-60 characters)');
    }

    // Check meta description
    const description = this.meta.getTag('name="description"')?.getAttribute('content');
    if (!description || description.length < 120) {
      issues.push('Meta description is too short (should be 120-160 characters)');
    }
    if (description && description.length > 160) {
      issues.push('Meta description is too long (should be 120-160 characters)');
    }

    // Check canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      issues.push('Missing canonical URL');
    }

    // Check Open Graph
    const ogTitle = this.meta.getTag('property="og:title"');
    const ogDescription = this.meta.getTag('property="og:description"');
    const ogImage = this.meta.getTag('property="og:image"');
    
    if (!ogTitle) issues.push('Missing Open Graph title');
    if (!ogDescription) issues.push('Missing Open Graph description');
    if (!ogImage) issues.push('Missing Open Graph image');

    // Recommendations
    recommendations.push('Add structured data for better rich snippets');
    recommendations.push('Optimize images with alt text and proper dimensions');
    recommendations.push('Implement breadcrumb navigation');
    recommendations.push('Add internal linking strategy');
    recommendations.push('Monitor Core Web Vitals regularly');

    return { issues, recommendations };
  }
}