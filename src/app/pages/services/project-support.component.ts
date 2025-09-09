import { Component } from '@angular/core';

@Component({
  selector: 'app-project-support',
  standalone: true,
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1>Project Support Services</h1>
          <p class="hero-subtitle">Expert guidance and support for your software development journey</p>
          <a href="#support-plans" class="cta-button">Explore Support Plans</a>
        </div>
      </div>
    </section>

    <!-- Support Features -->
    <section class="features-section">
      <div class="container">
        <h2>How We Support Your Projects</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8v8m-4-6l4 4l4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3>Technical Consultation</h3>
            <p>Expert advice on architecture, design patterns, and best practices</p>
            <ul class="feature-list">
              <li>System Architecture Review</li>
              <li>Code Quality Assessment</li>
              <li>Performance Optimization</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M7 12h10M12 7v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3>Development Support</h3>
            <p>Hands-on assistance with implementation and bug fixing</p>
            <ul class="feature-list">
              <li>Code Review & Debugging</li>
              <li>Feature Implementation</li>
              <li>Technical Documentation</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8v8m-4-4h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3>Testing & QA</h3>
            <p>Comprehensive testing solutions for quality assurance</p>
            <ul class="feature-list">
              <li>Test Strategy Planning</li>
              <li>Automated Testing Setup</li>
              <li>Performance Testing</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <h3>DevOps Integration</h3>
            <p>Streamline your development and deployment pipeline</p>
            <ul class="feature-list">
              <li>CI/CD Setup</li>
              <li>Cloud Infrastructure</li>
              <li>Monitoring Solutions</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Support Plans -->
    <section id="support-plans" class="plans-section">
      <div class="container">
        <h2>Support Plans</h2>
        <div class="plans-grid">
          <div class="plan-card">
            <div class="plan-header">
              <h3>Basic Support</h3>
              <p class="plan-price">10 Hours/Month</p>
            </div>
            <ul class="plan-features">
              <li>Technical Consultation</li>
              <li>Code Review</li>
              <li>Bug Fixing Support</li>
              <li>Email Support</li>
            </ul>
            <button class="plan-cta">Get Started</button>
          </div>

          <div class="plan-card featured">
            <div class="plan-header">
              <h3>Premium Support</h3>
              <p class="plan-price">20 Hours/Month</p>
            </div>
            <ul class="plan-features">
              <li>All Basic Features</li>
              <li>Priority Response</li>
              <li>Architecture Review</li>
              <li>Performance Optimization</li>
              <li>24/7 Emergency Support</li>
            </ul>
            <button class="plan-cta">Get Started</button>
          </div>

          <div class="plan-card">
            <div class="plan-header">
              <h3>Enterprise Support</h3>
              <p class="plan-price">Custom Hours</p>
            </div>
            <ul class="plan-features">
              <li>All Premium Features</li>
              <li>Dedicated Support Team</li>
              <li>Custom SLA</li>
              <li>On-site Support</li>
              <li>Training Sessions</li>
            </ul>
            <button class="plan-cta">Contact Us</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="process-section">
      <div class="container">
        <h2>Our Support Process</h2>
        <div class="process-grid">
          <div class="process-step">
            <div class="step-number">1</div>
            <h3>Initial Assessment</h3>
            <p>We analyze your project requirements and challenges</p>
          </div>
          <div class="process-step">
            <div class="step-number">2</div>
            <h3>Plan Creation</h3>
            <p>Develop a customized support strategy</p>
          </div>
          <div class="process-step">
            <div class="step-number">3</div>
            <h3>Implementation</h3>
            <p>Execute the plan with regular check-ins</p>
          </div>
          <div class="process-step">
            <div class="step-number">4</div>
            <h3>Continuous Support</h3>
            <p>Ongoing assistance and improvements</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Hero Section */
    .hero-section {
      background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/project-support.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      background-attachment: fixed;
      color: white;
      padding: 5rem 0;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    @media (max-width: 768px) {
      .hero-section {
        background-attachment: scroll;
      }
    }

    .hero-content h1 {
      font-size: 2.2rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      line-height: 1.2;
      color: #ffffff;
      text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
    }

    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 2.5rem;
      color: #ffffff;
      text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
    }

    .cta-button {
      display: inline-block;
      background: #2AF598;
      color: #013024;
      padding: 1rem 2.5rem;
      border-radius: 50px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .cta-button:hover {
      transform: translateY(-2px);
      background: #1ce589;
      box-shadow: 0 10px 20px rgba(42, 245, 152, 0.2);
    }

    /* Features Section */
    .features-section {
      padding: 5rem 0;
      background: #f8f9fa;
    }

    .features-section h2 {
      text-align: center;
      font-size: 1.8rem;
      color: #013024;
      margin-bottom: 3rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }

    .feature-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(1, 48, 36, 0.1);
    }

    .feature-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #013024 0%, #025c46 100%);
      border-radius: 50%;
      color: #2AF598;
    }

    .feature-icon svg {
      width: 40px;
      height: 40px;
    }

    .feature-card h3 {
      font-size: 1.5rem;
      color: #013024;
      margin-bottom: 1rem;
    }

    .feature-card p {
      color: #666;
      margin-bottom: 1.5rem;
    }

    .feature-list {
      list-style: none;
      padding: 0;
      text-align: left;
    }

    .feature-list li {
      color: #666;
      margin-bottom: 0.5rem;
      padding-left: 1.5rem;
      position: relative;
    }

    .feature-list li::before {
      content: "•";
      color: #2AF598;
      position: absolute;
      left: 0;
    }

    /* Plans Section */
    .plans-section {
      padding: 5rem 0;
      background: white;
    }

    .plans-section h2 {
      text-align: center;
      font-size: 1.8rem;
      color: #013024;
      margin-bottom: 3rem;
    }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .plan-card {
      background: #f8f9fa;
      border-radius: 1rem;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;
      position: relative;
    }

    .plan-card.featured {
      background: white;
      box-shadow: 0 10px 30px rgba(1, 48, 36, 0.1);
      transform: translateY(-20px);
    }

    .plan-header {
      margin-bottom: 2rem;
    }

    .plan-header h3 {
      font-size: 1.5rem;
      color: #013024;
      margin-bottom: 0.5rem;
    }

    .plan-price {
      font-size: 1.25rem;
      color: #666;
      font-weight: 600;
    }

    .plan-features {
      list-style: none;
      padding: 0;
      margin-bottom: 2rem;
    }

    .plan-features li {
      color: #666;
      margin-bottom: 0.5rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .plan-cta {
      background: #2AF598;
      color: #013024;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .plan-cta:hover {
      background: #1ce589;
      transform: translateY(-2px);
    }

    /* Process Section */
    .process-section {
      padding: 5rem 0;
      background: #f8f9fa;
    }

    .process-section h2 {
      text-align: center;
      font-size: 2.5rem;
      color: #013024;
      margin-bottom: 3rem;
    }

    .process-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }

    .process-step {
      text-align: center;
      position: relative;
    }

    .step-number {
      width: 40px;
      height: 40px;
      background: #2AF598;
      color: #013024;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      margin: 0 auto 1rem;
    }

    .process-step h3 {
      color: #013024;
      margin-bottom: 0.5rem;
    }

    .process-step p {
      color: #666;
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .features-grid,
      .process-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .plans-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .plan-card.featured {
        transform: none;
      }
    }

    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2.5rem;
      }

      .features-grid,
      .process-grid,
      .plans-grid {
        grid-template-columns: 1fr;
      }

      .plan-card {
        margin-bottom: 1rem;
      }
    }
  `]
})
export class ProjectSupportComponent {}
