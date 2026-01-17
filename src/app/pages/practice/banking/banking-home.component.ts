import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banking-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="banking-app">
      <header class="app-header">
        <h1 class="app-title">🏦 ZenetraBank</h1>
        <p class="app-subtitle">Practice Banking Application for Automation Testing</p>
      </header>

      <nav class="main-navigation">
        <ul class="nav-menu">
          <li><a href="#" class="nav-link active">Home</a></li>
          <li><a href="#" class="nav-link">About</a></li>
          <li><a href="#" class="nav-link">Services</a></li>
          <li><a href="#" class="nav-link">Contact</a></li>
        </ul>
      </nav>

      <main class="main-content">
        <div class="hero-section">
          <h2>Welcome to ZenetraBank</h2>
          <p>Your trusted partner for secure digital banking</p>
          
          <div class="action-buttons">
            <button 
              class="btn btn-primary" 
              id="login-btn"
              (click)="navigateToLogin()"
              data-testid="login-button">
              🔑 Login to ZenetraBank
            </button>
          </div>
        </div>

        <div class="features-section">
          <h3>Banking Features</h3>
          <div class="features-grid">
            <div class="feature-card">
              <span class="feature-icon">🛡️</span>
              <h4>Secure Banking</h4>
              <p>Advanced security measures to protect your money</p>
            </div>
            
            <div class="feature-card">
              <span class="feature-icon">📱</span>
              <h4>Mobile Access</h4>
              <p>Access your account anywhere, anytime</p>
            </div>
            
            <div class="feature-card">
              <span class="feature-icon">💸</span>
              <h4>Easy Transfers</h4>
              <p>Transfer money quickly and securely</p>
            </div>
            
            <div class="feature-card">
              <span class="feature-icon">📊</span>
              <h4>Account Management</h4>
              <p>Comprehensive account overview and management</p>
            </div>
          </div>
        </div>
      </main>

      <footer class="app-footer">
        <p>&copy; 2026 ZenetraBank - Practice Application for Testing</p>
        <p>This is a demo application for automation practice</p>
      </footer>
    </div>
  `,
  styles: [`
    .banking-app {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .app-header {
      background: rgba(255, 255, 255, 0.95);
      padding: 1.5rem 2rem;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .app-title {
      font-size: 2.5rem;
      margin: 0;
      color: #2c3e50;
      font-weight: 700;
    }

    .app-subtitle {
      margin: 0.5rem 0 0 0;
      color: #7f8c8d;
      font-size: 1.1rem;
    }

    .main-navigation {
      background: rgba(255, 255, 255, 0.9);
      padding: 1rem 2rem;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .nav-menu {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      gap: 2rem;
    }

    .nav-link {
      text-decoration: none;
      color: #2c3e50;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      transition: all 0.3s ease;
    }

    .nav-link:hover {
      background: #3498db;
      color: white;
    }

    .nav-link.active {
      background: #2980b9;
      color: white;
    }

    .main-content {
      padding: 3rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .hero-section {
      text-align: center;
      margin-bottom: 4rem;
      background: rgba(255, 255, 255, 0.95);
      padding: 3rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .hero-section h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #2c3e50;
    }

    .hero-section p {
      font-size: 1.2rem;
      color: #7f8c8d;
      margin-bottom: 2rem;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
      min-width: 200px;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover {
      background: #2980b9;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
    }

    .btn-secondary {
      background: #2ecc71;
      color: white;
    }

    .btn-secondary:hover {
      background: #27ae60;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(46, 204, 113, 0.4);
    }

    .features-section {
      background: rgba(255, 255, 255, 0.95);
      padding: 3rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .features-section h3 {
      text-align: center;
      font-size: 2rem;
      margin-bottom: 2rem;
      color: #2c3e50;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      text-align: center;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 10px;
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 1rem;
    }

    .feature-card h4 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .feature-card p {
      color: #7f8c8d;
    }

    .app-footer {
      background: rgba(44, 62, 80, 0.9);
      color: white;
      text-align: center;
      padding: 2rem;
      margin-top: 3rem;
    }

    .app-footer p {
      margin: 0.5rem 0;
    }

    @media (max-width: 768px) {
      .app-title {
        font-size: 2rem;
      }

      .nav-menu {
        flex-direction: column;
        gap: 1rem;
      }

      .hero-section h2 {
        font-size: 2rem;
      }

      .action-buttons {
        flex-direction: column;
        align-items: center;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BankingHomeComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/practice-app/banking/login']);
  }
}