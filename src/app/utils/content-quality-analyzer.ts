export interface ContentQualityMetrics {
  readabilityScore: number;
  seoScore: number;
  engagementScore: number;
  professionalismScore: number;
  consistencyScore: number;
}

export interface ContentIssue {
  type: 'grammar' | 'consistency' | 'seo' | 'accessibility' | 'branding';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  element?: string;
  suggestion?: string;
}

export class ContentQualityAnalyzer {
  
  /**
   * Analyze content quality across the application
   */
  static analyzeContent(): {
    metrics: ContentQualityMetrics;
    issues: ContentIssue[];
    recommendations: string[];
  } {
    const issues: ContentIssue[] = [];
    const recommendations: string[] = [];

    // Analyze text content
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, li, a');
    let totalWords = 0;
    let readabilityScore = 100;
    let seoScore = 100;
    let professionalismScore = 100;
    let consistencyScore = 100;
    let engagementScore = 100;

    // Check for consistent branding
    const brandTermVariations = this.checkBrandConsistency(textElements);
    if (brandTermVariations.length > 0) {
      issues.push({
        type: 'branding',
        severity: 'medium',
        message: 'Inconsistent brand terminology found',
        suggestion: `Standardize usage: ${brandTermVariations.join(', ')}`
      });
      consistencyScore -= 10;
    }

    // Check for proper headings hierarchy
    const headingIssues = this.checkHeadingHierarchy();
    if (headingIssues.length > 0) {
      headingIssues.forEach(issue => issues.push(issue));
      seoScore -= 5 * headingIssues.length;
    }

    // Check for alt text on images
    const imageIssues = this.checkImageAccessibility();
    if (imageIssues.length > 0) {
      imageIssues.forEach(issue => issues.push(issue));
      seoScore -= 5 * imageIssues.length;
    }

    // Check for empty or duplicate content
    const contentIssues = this.checkContentQuality(textElements);
    if (contentIssues.length > 0) {
      contentIssues.forEach(issue => issues.push(issue));
      professionalismScore -= 5 * contentIssues.length;
    }

    // Check for CTA effectiveness
    const ctaIssues = this.checkCTAEffectiveness();
    if (ctaIssues.length > 0) {
      ctaIssues.forEach(issue => issues.push(issue));
      engagementScore -= 10 * ctaIssues.length;
    }

    // Generate recommendations
    recommendations.push(...this.generateRecommendations(issues));

    return {
      metrics: {
        readabilityScore: Math.max(0, readabilityScore),
        seoScore: Math.max(0, seoScore),
        engagementScore: Math.max(0, engagementScore),
        professionalismScore: Math.max(0, professionalismScore),
        consistencyScore: Math.max(0, consistencyScore)
      },
      issues,
      recommendations
    };
  }

  private static checkBrandConsistency(elements: NodeListOf<Element>): string[] {
    const brandTerms = new Set<string>();
    const brandPattern = /(zenetra|zenetra[\s-]technology|zenetra[\s-]tech)/gi;

    Array.from(elements).forEach(element => {
      const text = element.textContent || '';
      const matches = text.match(brandPattern);
      if (matches) {
        matches.forEach(match => brandTerms.add(match.toLowerCase()));
      }
    });

    return Array.from(brandTerms);
  }

  private static checkHeadingHierarchy(): ContentIssue[] {
    const issues: ContentIssue[] = [];
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;

    // Check for H1
    const h1Elements = document.querySelectorAll('h1');
    if (h1Elements.length === 0) {
      issues.push({
        type: 'seo',
        severity: 'high',
        message: 'Missing H1 heading',
        suggestion: 'Add a single H1 heading per page'
      });
    } else if (h1Elements.length > 1) {
      issues.push({
        type: 'seo',
        severity: 'medium',
        message: 'Multiple H1 headings found',
        suggestion: 'Use only one H1 per page'
      });
    }

    // Check heading hierarchy
    Array.from(headings).forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (index > 0 && level > previousLevel + 1) {
        issues.push({
          type: 'seo',
          severity: 'medium',
          message: `Heading hierarchy skip detected: ${heading.tagName}`,
          element: heading.textContent?.substring(0, 50) || '',
          suggestion: 'Use consecutive heading levels'
        });
      }
      
      previousLevel = level;
    });

    return issues;
  }

  private static checkImageAccessibility(): ContentIssue[] {
    const issues: ContentIssue[] = [];
    const images = document.querySelectorAll('img');

    Array.from(images).forEach(img => {
      if (!img.alt) {
        issues.push({
          type: 'accessibility',
          severity: 'high',
          message: 'Missing alt text',
          element: img.src.substring(img.src.lastIndexOf('/') + 1),
          suggestion: 'Add descriptive alt text for screen readers'
        });
      } else if (img.alt.length < 5) {
        issues.push({
          type: 'accessibility',
          severity: 'medium',
          message: 'Alt text too short',
          element: img.src.substring(img.src.lastIndexOf('/') + 1),
          suggestion: 'Provide more descriptive alt text'
        });
      }

      // Check for decorative images
      if (img.alt === '' && !img.getAttribute('role')) {
        issues.push({
          type: 'accessibility',
          severity: 'low',
          message: 'Decorative image without role attribute',
          element: img.src.substring(img.src.lastIndexOf('/') + 1),
          suggestion: 'Add role="presentation" for decorative images'
        });
      }
    });

    return issues;
  }

  private static checkContentQuality(elements: NodeListOf<Element>): ContentIssue[] {
    const issues: ContentIssue[] = [];
    const seenContent = new Set<string>();

    Array.from(elements).forEach(element => {
      const text = element.textContent?.trim() || '';
      
      if (text.length === 0 && element.tagName !== 'IMG') {
        issues.push({
          type: 'grammar',
          severity: 'low',
          message: 'Empty text element',
          element: element.tagName.toLowerCase(),
          suggestion: 'Remove empty elements or add content'
        });
      }

      // Check for duplicate content
      if (text.length > 20 && seenContent.has(text)) {
        issues.push({
          type: 'consistency',
          severity: 'medium',
          message: 'Duplicate content detected',
          element: text.substring(0, 50) + '...',
          suggestion: 'Remove or rephrase duplicate content'
        });
      } else if (text.length > 20) {
        seenContent.add(text);
      }

      // Check for placeholder text
      if (text.toLowerCase().includes('lorem ipsum') || 
          text.toLowerCase().includes('placeholder') ||
          text.toLowerCase().includes('sample text')) {
        issues.push({
          type: 'grammar',
          severity: 'critical',
          message: 'Placeholder text found',
          element: text.substring(0, 50) + '...',
          suggestion: 'Replace with actual content'
        });
      }
    });

    return issues;
  }

  private static checkCTAEffectiveness(): ContentIssue[] {
    const issues: ContentIssue[] = [];
    const buttons = document.querySelectorAll('button, .btn, .cta, a[href*="contact"], a[href*="download"]');
    
    Array.from(buttons).forEach(button => {
      const text = button.textContent?.trim() || '';
      
      // Check for generic CTAs
      const genericCTAs = ['click here', 'read more', 'learn more', 'submit', 'button'];
      if (genericCTAs.some(generic => text.toLowerCase() === generic)) {
        issues.push({
          type: 'seo',
          severity: 'medium',
          message: 'Generic CTA text',
          element: text,
          suggestion: 'Use specific, action-oriented CTA text'
        });
      }

      // Check for proper button labeling
      if (text.length < 3) {
        issues.push({
          type: 'accessibility',
          severity: 'high',
          message: 'CTA text too short',
          element: text || 'unnamed button',
          suggestion: 'Provide descriptive button text'
        });
      }
    });

    return issues;
  }

  private static generateRecommendations(issues: ContentIssue[]): string[] {
    const recommendations: string[] = [];
    const issueTypes = new Set(issues.map(issue => issue.type));
    const severityCounts = issues.reduce((acc, issue) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // General recommendations based on issues found
    if (issueTypes.has('grammar')) {
      recommendations.push('Proofread all content for grammar and spelling errors');
      recommendations.push('Use tools like Grammarly or Hemingway Editor for content review');
    }

    if (issueTypes.has('seo')) {
      recommendations.push('Optimize heading structure for better SEO');
      recommendations.push('Improve meta descriptions and title tags');
    }

    if (issueTypes.has('accessibility')) {
      recommendations.push('Add alt text to all images');
      recommendations.push('Ensure proper color contrast ratios');
    }

    if (issueTypes.has('branding')) {
      recommendations.push('Create a brand style guide for consistent terminology');
      recommendations.push('Review all content for brand voice consistency');
    }

    if (severityCounts['critical'] && severityCounts['critical'] > 0) {
      recommendations.push('Address critical issues immediately before launch');
    }

    // Always include these general recommendations
    recommendations.push('Implement a content review process');
    recommendations.push('Consider professional copywriting for key pages');
    recommendations.push('Add social proof and testimonials');
    recommendations.push('Optimize image sizes and formats for web');
    recommendations.push('Create compelling calls-to-action');

    return recommendations;
  }

  /**
   * Generate a content quality report
   */
  static generateReport(): string {
    const analysis = this.analyzeContent();
    const averageScore = Object.values(analysis.metrics).reduce((sum, score) => sum + score, 0) / 5;
    
    let report = `# Content Quality Report\n\n`;
    report += `**Overall Score: ${averageScore.toFixed(1)}/100**\n\n`;
    
    report += `## Metrics Breakdown:\n`;
    report += `- Readability: ${analysis.metrics.readabilityScore}/100\n`;
    report += `- SEO: ${analysis.metrics.seoScore}/100\n`;
    report += `- Engagement: ${analysis.metrics.engagementScore}/100\n`;
    report += `- Professionalism: ${analysis.metrics.professionalismScore}/100\n`;
    report += `- Consistency: ${analysis.metrics.consistencyScore}/100\n\n`;
    
    if (analysis.issues.length > 0) {
      report += `## Issues Found (${analysis.issues.length}):\n\n`;
      
      ['critical', 'high', 'medium', 'low'].forEach(severity => {
        const severityIssues = analysis.issues.filter(issue => issue.severity === severity);
        if (severityIssues.length > 0) {
          report += `### ${severity.toUpperCase()} Priority:\n`;
          severityIssues.forEach(issue => {
            report += `- **${issue.type}**: ${issue.message}\n`;
            if (issue.element) report += `  - Element: ${issue.element}\n`;
            if (issue.suggestion) report += `  - Suggestion: ${issue.suggestion}\n`;
          });
          report += `\n`;
        }
      });
    }
    
    if (analysis.recommendations.length > 0) {
      report += `## Recommendations:\n\n`;
      analysis.recommendations.forEach(rec => {
        report += `- ${rec}\n`;
      });
    }
    
    return report;
  }
}