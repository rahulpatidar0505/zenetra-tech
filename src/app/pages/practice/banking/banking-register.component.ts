import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-banking-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="banking-app">
      <header class="app-header">
        <h1 class="app-title">🏦 ZenetraBank</h1>
        <nav class="nav-breadcrumb">
          <a routerLink="/practice-app/banking" class="breadcrumb-link">Home</a>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">Account Registration</span>
        </nav>
      </header>

      <main class="main-content">
        <div class="registration-container">
          <div class="registration-card">
            <h2>📝 Create New Account</h2>
            <p class="form-description">Fill in all the required information to open your ZenetraBank account</p>

            <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()" class="registration-form">
              
              <!-- Full Name -->
              <div class="form-group">
                <label for="fullName">Full Name *</label>
                <input 
                  type="text" 
                  id="fullName" 
                  formControlName="fullName"
                  data-testid="full-name-input"
                  class="form-control"
                  placeholder="Enter your full name">
                <div class="error-message" *ngIf="registrationForm.get('fullName')?.invalid && registrationForm.get('fullName')?.touched">
                  <span *ngIf="registrationForm.get('fullName')?.errors?.['required']">Full name is required</span>
                  <span *ngIf="registrationForm.get('fullName')?.errors?.['minlength']">Name must be at least 2 characters</span>
                </div>
              </div>

              <!-- Email -->
              <div class="form-group">
                <label for="email">Email Address *</label>
                <input 
                  type="email" 
                  id="email" 
                  formControlName="email"
                  data-testid="email-input"
                  class="form-control"
                  placeholder="Enter your email address">
                <div class="error-message" *ngIf="registrationForm.get('email')?.invalid && registrationForm.get('email')?.touched">
                  <span *ngIf="registrationForm.get('email')?.errors?.['required']">Email is required</span>
                  <span *ngIf="registrationForm.get('email')?.errors?.['email']">Please enter a valid email</span>
                </div>
              </div>

              <!-- Mobile Number -->
              <div class="form-group">
                <label for="mobile">Mobile Number *</label>
                <input 
                  type="tel" 
                  id="mobile" 
                  formControlName="mobile"
                  data-testid="mobile-input"
                  class="form-control"
                  placeholder="Enter your mobile number">
                <div class="error-message" *ngIf="registrationForm.get('mobile')?.invalid && registrationForm.get('mobile')?.touched">
                  <span *ngIf="registrationForm.get('mobile')?.errors?.['required']">Mobile number is required</span>
                  <span *ngIf="registrationForm.get('mobile')?.errors?.['pattern']">Please enter a valid mobile number</span>
                </div>
              </div>

              <!-- Gender -->
              <div class="form-group">
                <label>Gender *</label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      formControlName="gender" 
                      value="male"
                      data-testid="gender-male">
                    <span class="radio-text">Male</span>
                  </label>
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      formControlName="gender" 
                      value="female"
                      data-testid="gender-female">
                    <span class="radio-text">Female</span>
                  </label>
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      formControlName="gender" 
                      value="other"
                      data-testid="gender-other">
                    <span class="radio-text">Other</span>
                  </label>
                </div>
                <div class="error-message" *ngIf="registrationForm.get('gender')?.invalid && registrationForm.get('gender')?.touched">
                  <span *ngIf="registrationForm.get('gender')?.errors?.['required']">Please select your gender</span>
                </div>
              </div>

              <!-- Country -->
              <div class="form-group">
                <label for="country">Country *</label>
                <select 
                  id="country" 
                  formControlName="country"
                  data-testid="country-select"
                  class="form-control">
                  <option value="">Select your country</option>
                  <option value="india">India</option>
                  <option value="usa">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="canada">Canada</option>
                  <option value="australia">Australia</option>
                  <option value="germany">Germany</option>
                  <option value="france">France</option>
                  <option value="singapore">Singapore</option>
                  <option value="japan">Japan</option>
                </select>
                <div class="error-message" *ngIf="registrationForm.get('country')?.invalid && registrationForm.get('country')?.touched">
                  <span *ngIf="registrationForm.get('country')?.errors?.['required']">Please select your country</span>
                </div>
              </div>

              <!-- Date of Birth -->
              <div class="form-group">
                <label for="dateOfBirth">Date of Birth *</label>
                <input 
                  type="date" 
                  id="dateOfBirth" 
                  formControlName="dateOfBirth"
                  data-testid="dob-input"
                  class="form-control">
                <div class="error-message" *ngIf="registrationForm.get('dateOfBirth')?.invalid && registrationForm.get('dateOfBirth')?.touched">
                  <span *ngIf="registrationForm.get('dateOfBirth')?.errors?.['required']">Date of birth is required</span>
                </div>
              </div>

              <!-- File Upload -->
              <div class="form-group">
                <label for="idProof">Upload ID Proof (PDF, JPG, PNG) *</label>
                <input 
                  type="file" 
                  id="idProof" 
                  (change)="onFileSelect($event)"
                  data-testid="id-proof-upload"
                  class="form-control file-input"
                  accept=".pdf,.jpg,.jpeg,.png">
                <div class="file-info" *ngIf="selectedFile">
                  <span class="file-name">Selected: {{selectedFile.name}}</span>
                  <span class="file-size">({{formatFileSize(selectedFile.size)}})</span>
                </div>
                <div class="error-message" *ngIf="!selectedFile && formSubmitted">
                  <span>Please upload your ID proof</span>
                </div>
              </div>

              <!-- Terms Checkbox -->
              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    formControlName="acceptTerms"
                    data-testid="terms-checkbox">
                  <span class="checkmark"></span>
                  <span class="checkbox-text">I accept the <a href="#" class="link">Terms and Conditions</a> and <a href="#" class="link">Privacy Policy</a></span>
                </label>
                <div class="error-message" *ngIf="registrationForm.get('acceptTerms')?.invalid && registrationForm.get('acceptTerms')?.touched">
                  <span *ngIf="registrationForm.get('acceptTerms')?.errors?.['required']">You must accept terms and conditions</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="form-actions">
                <button 
                  type="button" 
                  class="btn btn-secondary"
                  data-testid="reset-button"
                  (click)="resetForm()">
                  🔄 Reset Form
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  data-testid="submit-button"
                  [disabled]="registrationForm.invalid || !selectedFile">
                  ✅ Create Account
                </button>
              </div>
            </form>

            <!-- Success Message -->
            <div class="success-message" *ngIf="showSuccessMessage" data-testid="success-message">
              <div class="success-content">
                <h3>🎉 Registration Successful!</h3>
                <p>Your account has been created successfully. You can now log in to your ZenetraBank account.</p>
                <button 
                  class="btn btn-primary" 
                  (click)="navigateToLogin()"
                  data-testid="go-to-login-button">
                  Go to Login
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div class="error-message global-error" *ngIf="showErrorMessage" data-testid="error-message">
              <p>❌ Registration failed. Please check your information and try again.</p>
            </div>

            <div class="form-footer">
              <p>Already have an account? <a routerLink="/practice-app/banking/login" class="link">Login here</a></p>
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

    .registration-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .registration-card {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .registration-card h2 {
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

    .registration-form {
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

    .form-control:invalid:not(:focus) {
      border-color: #e74c3c;
    }

    .radio-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .radio-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-weight: normal;
    }

    .radio-label input[type="radio"] {
      margin: 0;
    }

    .checkbox-group .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      cursor: pointer;
      font-weight: normal;
    }

    .checkbox-label input[type="checkbox"] {
      margin: 0;
    }

    .file-input {
      padding: 0.5rem;
    }

    .file-info {
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: #7f8c8d;
    }

    .file-name {
      font-weight: 600;
    }

    .file-size {
      font-style: italic;
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

    .success-message {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .success-content {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      text-align: center;
      max-width: 400px;
      margin: 1rem;
    }

    .success-content h3 {
      color: #27ae60;
      margin-bottom: 1rem;
    }

    .success-content p {
      color: #7f8c8d;
      margin-bottom: 1.5rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
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
      min-width: 140px;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2980b9;
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-secondary:hover {
      background: #7f8c8d;
      transform: translateY(-1px);
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

      .registration-card {
        padding: 1.5rem;
      }

      .form-actions {
        flex-direction: column;
      }

      .radio-group {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class BankingRegisterComponent implements OnInit {
  registrationForm!: FormGroup;
  selectedFile: File | null = null;
  formSubmitted = false;
  showSuccessMessage = false;
  showErrorMessage = false;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s\-\(\)]{10,15}$/)]],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  onFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  resetForm() {
    this.registrationForm.reset();
    this.selectedFile = null;
    this.formSubmitted = false;
    this.showErrorMessage = false;
    
    // Reset file input
    const fileInput = document.getElementById('idProof') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.registrationForm.valid && this.selectedFile) {
      // Simulate registration process
      setTimeout(() => {
        this.showSuccessMessage = true;
      }, 1000);
    } else {
      this.showErrorMessage = true;
      setTimeout(() => {
        this.showErrorMessage = false;
      }, 3000);
    }
  }

  navigateToLogin() {
    this.router.navigate(['/practice-app/banking/login']);
  }
}