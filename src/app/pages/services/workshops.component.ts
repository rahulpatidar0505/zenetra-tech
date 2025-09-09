import { Component } from '@angular/core';

@Component({
  selector: 'app-workshops',
  standalone: true,
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1>Interactive Tech Workshops</h1>
          <p class="hero-subtitle">Hands-on learning experiences led by industry experts to boost your practical skills</p>
          <a href="#upcoming" class="cta-button">View Upcoming Workshops</a>
        </div>
      </div>
    </section>

    <!-- Workshop Categories -->
    <section class="categories-section">
      <div class="container">
        <h2>Our Workshop Categories</h2>
        <div class="categories-grid">
          <div class="category-card">
            <div class="category-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" stroke="currentColor" stroke-width="2"/>
                <path d="M12 3v9m0 9v-9m0 0l8-4.5M12 12l-8-4.5" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <h3>Test Automation</h3>
            <ul class="workshop-features">
              <li>Framework Development</li>
              <li>CI/CD Integration</li>
              <li>Best Practices</li>
            </ul>
          </div>

          <div class="category-card">
            <div class="category-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3>DevOps & Cloud</h3>
            <ul class="workshop-features">
              <li>AWS/Azure Setup</li>
              <li>Docker & Kubernetes</li>
              <li>Pipeline Creation</li>
            </ul>
          </div>

          <div class="category-card">
            <div class="category-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <h3>Security Testing</h3>
            <ul class="workshop-features">
              <li>Penetration Testing</li>
              <li>Security Tools</li>
              <li>Vulnerability Assessment</li>
            </ul>
          </div>

          <div class="category-card">
            <div class="category-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8c2.5 0 4 1.5 4 3s-1.5 3-4 3m0 0c-2.5 0-4-1.5-4-3s1.5-3 4-3m0 6v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3>Java Development</h3>
            <ul class="workshop-features">
              <li>Spring Boot</li>
              <li>Microservices</li>
              <li>REST APIs</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Workshop Format -->
    <section class="format-section">
      <div class="container">
        <h2>Workshop Format</h2>
        <div class="format-grid">
          <div class="format-item">
            <div class="format-icon">🎯</div>
            <h3>Hands-on Practice</h3>
            <p>Real-time coding sessions with immediate feedback from experts</p>
          </div>
          <div class="format-item">
            <div class="format-icon">👥</div>
            <h3>Small Groups</h3>
            <p>Maximum 10 participants for personalized attention</p>
          </div>
          <div class="format-item">
            <div class="format-icon">💻</div>
            <h3>Live Projects</h3>
            <p>Work on real-world scenarios and industry projects</p>
          </div>
          <div class="format-item">
            <div class="format-icon">🏆</div>
            <h3>Certification</h3>
            <p>Earn a certificate upon successful completion</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming Workshops -->
    <section id="upcoming" class="upcoming-section">
      <div class="container">
        <h2>Upcoming Workshops</h2>
        <div class="workshop-grid">
          <div class="workshop-card">
            <div class="workshop-date">
              <span class="month">COMING</span>
              <span class="day">SOON</span>
            </div>
            <div class="workshop-info">
              <h3>Playwright Automation Masterclass</h3>
              <p class="duration">2 Days Workshop • Online Live</p>
              <ul class="highlights">
                <li>Framework Development from Scratch</li>
                <li>Advanced Test Patterns</li>
                <li>CI/CD Integration</li>
              </ul>
              <button class="register-btn">Enquire Now</button>
            </div>
          </div>

          <div class="workshop-card">
            <div class="workshop-date">
              <span class="month">COMING</span>
              <span class="day">SOON</span>
            </div>
            <div class="workshop-info">
              <h3>AWS DevOps Intensive</h3>
              <p class="duration">3 Days Workshop • Online Live</p>
              <ul class="highlights">
                <li>Cloud Infrastructure Setup</li>
                <li>Pipeline Automation</li>
                <li>Monitoring & Logging</li>
              </ul>
              <button class="register-btn">Enquire Now</button>
            </div>
          </div>

          <div class="workshop-card">
            <div class="workshop-date">
              <span class="month">COMING</span>
              <span class="day">SOON</span>
            </div>
            <div class="workshop-info">
              <h3>Web Security Testing</h3>
              <p class="duration">2 Days Workshop • Online Live</p>
              <ul class="highlights">
                <li>OWASP Top 10 Vulnerabilities</li>
                <li>Security Tool Usage</li>
                <li>Report Generation</li>
              </ul>
              <button class="register-btn">Enquire Now</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Our Workshops -->
    <section class="benefits-section">
      <div class="container">
        <h2>Why Choose Our Workshops?</h2>
        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon">👨‍💻</div>
            <h3>Expert Instructors</h3>
            <p>Learn from professionals with years of industry experience</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">🔄</div>
            <h3>Updated Content</h3>
            <p>Stay current with the latest industry trends and tools</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">📱</div>
            <h3>Post-Workshop Support</h3>
            <p>30 days of mentoring support after workshop completion</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">📊</div>
            <h3>Performance Analysis</h3>
            <p>Get detailed feedback on your workshop performance</p>
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
      background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/workshop.jpg');
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

    /* Categories Section */
    .categories-section {
      padding: 5rem 0;
      background: #f8f9fa;
    }

    .categories-section h2 {
      text-align: center;
      font-size: 1.8rem;
      color: #013024;
      margin-bottom: 3rem;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }

    .category-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;
    }

    .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(1, 48, 36, 0.1);
    }

    .category-icon {
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

    .category-icon svg {
      width: 40px;
      height: 40px;
    }

    .category-card h3 {
      font-size: 1.5rem;
      color: #013024;
      margin-bottom: 1rem;
    }

    .workshop-features {
      list-style: none;
      padding: 0;
      color: #666;
    }

    .workshop-features li {
      margin-bottom: 0.5rem;
    }

    /* Format Section */
    .format-section {
      padding: 5rem 0;
      background: white;
    }

    .format-section h2 {
      text-align: center;
      font-size: 1.8rem;
      color: #013024;
      margin-bottom: 3rem;
    }

    .format-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }

    .format-item {
      text-align: center;
    }

    .format-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .format-item h3 {
      color: #013024;
      margin-bottom: 0.5rem;
    }

    .format-item p {
      color: #666;
    }

    /* Upcoming Workshops */
    .upcoming-section {
      padding: 5rem 0;
      background: #f8f9fa;
    }

    .upcoming-section h2 {
      text-align: center;
      font-size: 2.5rem;
      color: #013024;
      margin-bottom: 3rem;
    }

    .workshop-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .workshop-card {
      background: white;
      border-radius: 1rem;
      overflow: hidden;
      display: flex;
      transition: all 0.3s ease;
    }

    .workshop-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(1, 48, 36, 0.1);
    }

    .workshop-date {
      background: #001a12;
      color: white;
      padding: 1rem;
      text-align: center;
      min-width: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .month {
      font-size: 1.2rem;
      font-weight: 600;
    }

    .day {
      font-size: 2rem;
      font-weight: 700;
      color: #2AF598;
    }

    .workshop-info {
      padding: 1.5rem;
      flex: 1;
    }

    .workshop-info h3 {
      color: #013024;
      margin-bottom: 0.5rem;
      font-size: 1.25rem;
    }

    .duration {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .highlights {
      list-style: none;
      padding: 0;
      margin-bottom: 1.5rem;
    }

    .highlights li {
      color: #666;
      margin-bottom: 0.5rem;
      padding-left: 1.5rem;
      position: relative;
    }

    .highlights li::before {
      content: "•";
      color: #2AF598;
      position: absolute;
      left: 0;
    }

    .register-btn {
      background: #2AF598;
      color: #013024;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .register-btn:hover {
      background: #1ce589;
      transform: translateY(-2px);
    }

    /* Benefits Section */
    .benefits-section {
      padding: 5rem 0;
      background: white;
    }

    .benefits-section h2 {
      text-align: center;
      font-size: 1.8rem;
      color: #013024;
      margin-bottom: 3rem;
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }

    .benefit-card {
      text-align: center;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 1rem;
      transition: all 0.3s ease;
    }

    .benefit-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(1, 48, 36, 0.1);
    }

    .benefit-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .benefit-card h3 {
      color: #013024;
      margin-bottom: 0.5rem;
    }

    .benefit-card p {
      color: #666;
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .categories-grid,
      .format-grid,
      .benefits-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2.5rem;
      }

      .workshop-card {
        flex-direction: column;
      }

      .workshop-date {
        padding: 0.5rem;
      }

      .categories-grid,
      .format-grid,
      .workshop-grid,
      .benefits-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WorkshopsComponent {}
