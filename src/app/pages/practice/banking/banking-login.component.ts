import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-banking-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="banking-app">
      <header class="app-header">
        <h1 class="app-title">🏦 ZenetraBank</h1>
        <nav class="nav-breadcrumb">
          <a routerLink="/practice-app/banking" class="breadcrumb-link">Home</a>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">Login</span>
        </nav>
      </header>

      <main class="main-content">
        <div class="login-container">
          <div class="login-card">
            <h2>🔑 Login to Your Account</h2>
            <p class="form-description">Enter your credentials to access your ZenetraBank account</p>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
              
              <!-- Username -->
              <div class="form-group">
                <label for="username">Username or Email *</label>
                <input 
                  type="text" 
                  id="username" 
                  formControlName="username"
                  data-testid="username-input"
                  class="form-control"
                  placeholder="Enter your username or email"
                  autocomplete="username">
                <div class="error-message" *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
                  <span *ngIf="loginForm.get('username')?.errors?.['required']">Username is required</span>
                </div>
              </div>

              <!-- Password -->
              <div class="form-group">
                <label for="password">Password *</label>
                <div class="password-input-wrapper">
                  <input 
                    [type]="showPassword ? 'text' : 'password'" 
                    id="password" 
                    formControlName="password"
                    data-testid="password-input"
                    class="form-control"
                    placeholder="Enter your password"
                    autocomplete="current-password">
                  <button 
                    type="button" 
                    class="password-toggle"
                    data-testid="password-toggle"
                    (click)="togglePasswordVisibility()">
                    {{showPassword ? '🙈' : '👁️'}}
                  </button>
                </div>
                <div class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                  <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
                  <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
                </div>
              </div>

              <!-- Remember Me -->
              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    formControlName="rememberMe"
                    data-testid="remember-me-checkbox">
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Remember me for 30 days</span>
                </label>
              </div>

              <!-- Action Buttons -->
              <div class="form-actions">
                <button 
                  type="submit" 
                  class="btn btn-primary btn-full"
                  data-testid="login-button"
                  [disabled]="loginForm.invalid || isLoading">
                  <span *ngIf="!isLoading">🔓 Login to Account</span>
                  <span *ngIf="isLoading">🔄 Logging in...</span>
                </button>
              </div>

              <!-- Forgot Password -->
              <div class="forgot-password">
                <a href="#" class="link" data-testid="forgot-password-link">Forgot your password?</a>
              </div>
            </form>

            <!-- Error Message -->
            <div class="error-message global-error" *ngIf="loginError" data-testid="login-error">
              <p>❌ {{loginError}}</p>
            </div>

            <!-- Demo Credentials -->
            <div class="demo-credentials">
              <h4>Demo Credentials for Testing:</h4>
              <div class="demo-options">
                <div class="demo-user">
                  <strong>Valid Login:</strong>
                  <p>Username: <code>testuser@zenetra.com</code></p>
                  <p>Password: <code>password123</code></p>
                  <button 
                    type="button" 
                    class="btn btn-demo"
                    data-testid="use-demo-credentials"
                    (click)="useDemoCredentials()">
                    Use Demo Credentials
                  </button>
                </div>
                <div class="demo-user">
                  <strong>Invalid Login (for testing):</strong>
                  <p>Username: <code>wronguser</code></p>
                  <p>Password: <code>wrongpass</code></p>
                  <button 
                    type="button" 
                    class="btn btn-demo-invalid"
                    data-testid="use-invalid-credentials"
                    (click)="useInvalidCredentials()">
                    Use Invalid Credentials
                  </button>
                </div>
              </div>
            </div>

            <div class="form-footer">
              <p><a routerLink="/practice-app/banking" class="link">← Back to Home</a></p>
            </div>
          </div>
        </div>
      </main>
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
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .app-title {
      font-size: 2rem;
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
      font-weight: 700;
    }

    .nav-breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .breadcrumb-link {
      color: #3498db;
      text-decoration: none;
    }

    .breadcrumb-link:hover {
      text-decoration: underline;
    }

    .breadcrumb-separator {
      color: #7f8c8d;
    }

    .breadcrumb-current {
      color: #2c3e50;
      font-weight: 500;
    }

    .main-content {
      padding: 2rem;
    }

    .login-container {
      max-width: 500px;
      margin: 0 auto;
    }

    .login-card {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .login-card h2 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 1rem;
      font-size: 1.8rem;
    }

    .form-description {
      text-align: center;
      color: #7f8c8d;
      margin-bottom: 2rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .form-control {
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }

    .password-input-wrapper {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 5px;
    }

    .checkbox-group .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-weight: normal;
    }

    .checkbox-label input[type="checkbox"] {
      margin: 0;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }

    .global-error {
      background: #ffe6e6;
      border: 1px solid #e74c3c;
      border-radius: 5px;
      padding: 1rem;
      margin-top: 1rem;
      text-align: center;
    }

    .form-actions {
      margin-top: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-full {
      width: 100%;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2980b9;
      transform: translateY(-1px);
    }

    .btn-demo {
      background: #2ecc71;
      color: white;
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }

    .btn-demo:hover {
      background: #27ae60;
    }

    .btn-demo-invalid {
      background: #e74c3c;
      color: white;
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }

    .btn-demo-invalid:hover {
      background: #c0392b;
    }

    .forgot-password {
      text-align: center;
      margin-top: 1rem;
    }

    .demo-credentials {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 1.5rem;
      margin-top: 2rem;
    }

    .demo-credentials h4 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
      text-align: center;
    }

    .demo-options {
      display: grid;
      gap: 1rem;
    }

    .demo-user {
      background: white;
      padding: 1rem;
      border-radius: 5px;
      border: 1px solid #e0e0e0;
    }

    .demo-user strong {
      display: block;
      margin-bottom: 0.5rem;
      color: #2c3e50;
    }

    .demo-user p {
      margin: 0.25rem 0;
      font-size: 0.9rem;
    }

    .demo-user code {
      background: #f1f3f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
    }

    .form-footer {
      text-align: center;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
    }

    .link {
      color: #3498db;
      text-decoration: none;
    }

    .link:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 1rem;
      }

      .login-card {
        padding: 1.5rem;
      }

      .demo-options {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BankingLoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  loginError = '';

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  useDemoCredentials() {
    this.loginForm.patchValue({
      username: 'testuser@zenetra.com',
      password: 'password123'
    });
  }

  useInvalidCredentials() {
    this.loginForm.patchValue({
      username: 'wronguser',
      password: 'wrongpass'
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.loginError = '';

    const { username, password } = this.loginForm.value;

    // Simulate login process
    setTimeout(() => {
      this.isLoading = false;
      
      // Check for valid credentials
      if (username === 'testuser@zenetra.com' && password === 'password123') {
        // Simulate setting user data
        sessionStorage.setItem('bankingUser', JSON.stringify({
          username: username,
          accountNumber: 'ACC' + Date.now(),
          balance: 25000.00,
          name: 'John Smith'
        }));
        
        // Navigate to dashboard
        this.router.navigate(['/practice-app/banking/dashboard']);
      } else {
        // Show error for invalid credentials
        this.loginError = 'Invalid username or password. Please try again.';
        setTimeout(() => {
          this.loginError = '';
        }, 5000);
      }
    }, 1500); // Simulate network delay
  }
}