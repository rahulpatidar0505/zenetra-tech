import { Component } from '@angular/core';

@Component({
  selector: 'app-online-training',
  standalone: true,
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1>Transform Your Career with Expert-Led Online Training</h1>
          <p class="hero-subtitle">Unlock your potential with interactive, hands-on learning experiences designed for today's tech landscape</p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">1000+</span>
              <span class="stat-label">Successful Students</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">98%</span>
              <span class="stat-label">Success Rate</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">24/7</span>
              <span class="stat-label">Support Available</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2>Why Choose Our Online Training?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Personalized Learning Path</h3>
            <p>Customized curriculum tailored to your goals and skill level, ensuring optimal learning outcomes.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💻</div>
            <h3>Live Interactive Sessions</h3>
            <p>Real-time engagement with industry experts, ensuring immediate doubt resolution and better understanding.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🛠️</div>
            <h3>Hands-on Projects</h3>
            <p>Work on real-world projects to build a strong portfolio and gain practical experience.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Progress Tracking</h3>
            <p>Detailed analytics and progress reports to monitor your learning journey.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Training Process -->
    <section class="process-section">
      <div class="container">
        <h2>Our Training Process</h2>
        <div class="process-steps">
          <div class="process-step">
            <div class="step-number">1</div>
            <h3>Skill Assessment</h3>
            <p>We evaluate your current skill level and understand your goals</p>
          </div>
          <div class="process-step">
            <div class="step-number">2</div>
            <h3>Custom Learning Plan</h3>
            <p>Create a personalized curriculum aligned with your objectives</p>
          </div>
          <div class="process-step">
            <div class="step-number">3</div>
            <h3>Interactive Learning</h3>
            <p>Engage in live sessions and hands-on projects</p>
          </div>
          <div class="process-step">
            <div class="step-number">4</div>
            <h3>Progress Review</h3>
            <p>Regular assessments and feedback to ensure learning effectiveness</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Training Programs -->
    <section class="programs-section">
      <div class="container">
        <h2>Available Training Programs</h2>
        <div class="programs-grid">
          <div class="program-card">
            <div class="program-header">
              <h3>Individual Training</h3>
              <div class="program-price">From Rs 25000</div>
            </div>
            <ul class="program-features">
              <li>✓ One-on-one mentorship</li>
              <li>✓ Personalized curriculum</li>
              <li>✓ Flexible scheduling</li>
              <li>✓ Project-based learning</li>
              <li>✓ Career guidance</li>
            </ul>
            <button class="cta-button">Get Started</button>
          </div>
          <div class="program-card featured">
            <div class="program-header">
              <h3>Corporate Training</h3>
              <div class="program-price">Custom Quote</div>
            </div>
            <ul class="program-features">
              <li>✓ Customized team training</li>
              <li>✓ Skill gap analysis</li>
              <li>✓ Progress tracking</li>
              <li>✓ Team collaboration tools</li>
              <li>✓ Certification program</li>
            </ul>
            <button class="cta-button">Contact Us</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Technologies Section -->
    <section class="tech-section">
      <div class="container">
        <h2>Technologies We Cover</h2>
        <div class="tech-grid">
          <div class="tech-item">
            <div class="tech-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" stroke="currentColor" stroke-width="2"/>
                <path d="M12 3v9m0 9v-9m0 0l8-4.5M12 12l-8-4.5" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span>Automation Testing</span>
            <p>Playwright, Selenium, Cypress</p>
          </div>
          
          <div class="tech-item">
            <div class="tech-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 10h16M4 14h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <span>Full Stack Development</span>
            <p>MEAN, MERN, Java Full Stack</p>
          </div>

          <div class="tech-item">
            <div class="tech-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 15a4 4 0 004 4h10a4 4 0 004-4v-3a4 4 0 00-4-4H7a4 4 0 01-4-4v0a4 4 0 014-4h10a4 4 0 014 4" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span>Cloud Technologies</span>
            <p>AWS, Azure, DevOps</p>
          </div>

          <div class="tech-item">
            <div class="tech-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span>Security Testing</span>
            <p>Penetration Testing, OWASP</p>
          </div>

          <div class="tech-item">
            <div class="tech-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 8h14M5 12h14M5 16h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <span>API Testing</span>
            <p>Postman, REST Assured</p>
          </div>

          <div class="tech-item">
            <div class="tech-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8v8m-4-4h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <span>Performance Testing</span>
            <p>JMeter, K6, Gatling</p>
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
      background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/online-training.jpg');
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
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      line-height: 1.2;
      color: #ffffff;
      text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
    }

    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 3rem;
      color: #ffffff;
      text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
    }

    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 4rem;
      margin-top: 3rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 2.5rem;
      font-weight: 700;
      color: #2AF598;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    }

    .stat-label {
      font-size: 1.1rem;
      color: #ffffff;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
    }

    /* Features Section */
    .features-section {
      padding: 5rem 0;
      background: #f8f9fa;
    }

    .features-section h2 {
      text-align: center;
      font-size: 2.5rem;
      color: #013024;
      margin-bottom: 3rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    @media (max-width: 1024px) {
      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .features-grid {
        grid-template-columns: 1fr;
      }
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      text-align: center;
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      color: #013024;
      margin-bottom: 1rem;
    }

    /* Process Section */
    .process-section {
      padding: 5rem 0;
      background: white;
    }

    .process-section h2 {
      text-align: center;
      font-size: 2.5rem;
      color: #013024;
      margin-bottom: 3rem;
    }

    .process-steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 2rem;
    }

    .process-step {
      text-align: center;
      position: relative;
    }

    .step-number {
      width: 3rem;
      height: 3rem;
      background: #2AF598;
      color: #013024;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 auto 1rem;
    }

    /* Programs Section */
    .programs-section {
      padding: 5rem 0;
      background: #f8f9fa;
    }

    .programs-section h2 {
      text-align: center;
      font-size: 2.5rem;
      color: #013024;
      margin-bottom: 3rem;
    }

    .programs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .program-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      text-align: center;
      transition: transform 0.3s ease;
    }

    .program-card.featured {
      border: 2px solid #2AF598;
      transform: scale(1.05);
    }

    .program-card:hover {
      transform: translateY(-5px);
    }

    .program-header h3 {
      color: #013024;
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .program-price {
      color: #2AF598;
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
    }

    .program-features {
      list-style: none;
      padding: 0;
      margin: 0 0 2rem;
    }

    .program-features li {
      margin-bottom: 0.75rem;
      color: #666;
    }

    .cta-button {
      background: #2AF598;
      color: #013024;
      border: none;
      padding: 1rem 2rem;
      border-radius: 2rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cta-button:hover {
      background: #1ce589;
      transform: translateY(-2px);
    }

    /* Technologies Section */
    .tech-section {
      padding: 5rem 0;
      background: white;
    }

    .tech-section h2 {
      text-align: center;
      font-size: 2.5rem;
      color: #013024;
      margin-bottom: 3rem;
    }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2.5rem;
      text-align: center;
      padding: 1rem;
    }

    .tech-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 16px;
      transition: all 0.3s ease;
      border: 1px solid transparent;
    }

    .tech-item:hover {
      transform: translateY(-5px);
      border-color: #2AF598;
      box-shadow: 0 10px 30px rgba(42, 245, 152, 0.1);
    }

    .tech-icon {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #001a12;
      border-radius: 12px;
      margin-bottom: 1rem;
      color: #2AF598;
      transition: all 0.3s ease;
    }

    .tech-icon svg {
      width: 32px;
      height: 32px;
    }

    .tech-item:hover .tech-icon {
      transform: scale(1.1);
      box-shadow: 0 5px 15px rgba(42, 245, 152, 0.2);
    }

    .tech-item span {
      color: #013024;
      font-weight: 600;
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }

    .tech-item p {
      color: #666;
      font-size: 0.9rem;
      margin: 0;
      line-height: 1.4;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2.5rem;
      }

      .hero-stats {
        flex-direction: column;
        gap: 2rem;
      }

      .programs-grid {
        grid-template-columns: 1fr;
      }

      .program-card.featured {
        transform: none;
      }

      .tech-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .tech-item {
        padding: 1.5rem;
      }
    }
  `]
})
export class OnlineTrainingComponent {}
