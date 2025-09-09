import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-development',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1>Project Development</h1>
          <p class="hero-subtitle">Turn your ideas into reality with our expert development services</p>
          <a href="#features" class="cta-button">Explore Our Services</a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features-section">
      <div class="container">
        <h2>Our Development Services</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Custom Web Applications</h3>
            <p>Tailored solutions for your business needs</p>
            <ul class="feature-list">
              <li>React/Angular/Vue.js</li>
              <li>Responsive Design</li>
              <li>Progressive Web Apps</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M8 10l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3>Backend Development</h3>
            <p>Robust and scalable server solutions</p>
            <ul class="feature-list">
              <li>Node.js/Java/Python</li>
              <li>RESTful APIs</li>
              <li>Database Design</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Cloud Solutions</h3>
            <p>Modern cloud-native applications</p>
            <ul class="feature-list">
              <li>AWS/Azure/GCP</li>
              <li>Microservices</li>
              <li>Containerization</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8v8m-4-4h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3>Mobile Development</h3>
            <p>Native and cross-platform apps</p>
            <ul class="feature-list">
              <li>iOS/Android</li>
              <li>React Native</li>
              <li>Flutter</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="process-section">
      <div class="container">
        <h2>Our Development Process</h2>
        <div class="process-grid">
          <div class="process-step">
            <div class="step-number">1</div>
            <h3>Requirements Analysis</h3>
            <p>Understanding your business needs and objectives</p>
          </div>
          <div class="process-step">
            <div class="step-number">2</div>
            <h3>Design & Planning</h3>
            <p>Creating detailed technical specifications</p>
          </div>
          <div class="process-step">
            <div class="step-number">3</div>
            <h3>Development</h3>
            <p>Agile development with regular updates</p>
          </div>
          <div class="process-step">
            <div class="step-number">4</div>
            <h3>Testing & Deployment</h3>
            <p>Thorough testing and smooth deployment</p>
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
      background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/project-development.jpg');
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
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      line-height: 1.2;
      color: #ffffff;
      text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
    }

    .hero-subtitle {
      font-size: 1rem;
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
      background: #001a12;
      border-radius: 50%;
      color: #2AF598;
    }

    .feature-icon svg {
      width: 40px;
      height: 40px;
    }

    .feature-card h3 {
      font-size: 1.2rem;
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

    /* Process Section */
    .process-section {
      padding: 5rem 0;
      background: #f8f9fa;
    }

    .process-section h2 {
      text-align: center;
      font-size: 1.8rem;
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
    }

    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 1.8rem;
      }

      .features-grid,
      .process-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProjectDevelopmentComponent {}
