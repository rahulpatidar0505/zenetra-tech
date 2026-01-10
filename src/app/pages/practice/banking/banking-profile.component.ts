import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-banking-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="banking-app">
      <header class="app-header">
        <h1 class="app-title">🏦 ZenetraBank</h1>
        <nav class="nav-breadcrumb">
          <a routerLink="/practice-app/banking" class="breadcrumb-link">Home</a>
          <span class="breadcrumb-separator">></span>
          <a routerLink="/practice-app/banking/dashboard" class="breadcrumb-link">Dashboard</a>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">Profile Settings</span>
        </nav>
      </header>

      <main class="main-content">
        <div class="profile-container">
          <div class="profile-card">
            <h2>👤 Profile Settings</h2>
            <p class="form-description">Update your personal information and preferences</p>

            <!-- Profile Picture Section -->
            <div class="profile-picture-section">
              <div class="profile-avatar" data-testid="profile-avatar">
                <span class="avatar-text">{{getInitials()}}</span>
              </div>
              <div class="avatar-info">
                <h3>{{userInfo?.name}}</h3>
                <p>Account: {{userInfo?.accountNumber}}</p>
                <button 
                  class="btn btn-small btn-secondary"
                  data-testid="change-avatar-button"
                  (click)="changeAvatar()">
                  📷 Change Photo
                </button>
              </div>
            </div>

            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
              
              <!-- Personal Information -->
              <div class="form-section">
                <h3 class="section-title">📝 Personal Information</h3>
                
                <!-- Full Name (Read-only) -->
                <div class="form-group">
                  <label for="fullName">Full Name</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    formControlName="fullName"
                    data-testid="full-name-input"
                    class="form-control readonly"
                    readonly>
                  <small class="form-help">Contact customer service to change your name</small>
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
                  <div class="error-message" *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched">
                    <span *ngIf="profileForm.get('email')?.errors?.['required']">Email is required</span>
                    <span *ngIf="profileForm.get('email')?.errors?.['email']">Please enter a valid email</span>
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
                  <div class="error-message" *ngIf="profileForm.get('mobile')?.invalid && profileForm.get('mobile')?.touched">
                    <span *ngIf="profileForm.get('mobile')?.errors?.['required']">Mobile number is required</span>
                    <span *ngIf="profileForm.get('mobile')?.errors?.['pattern']">Please enter a valid mobile number</span>
                  </div>
                </div>

                <!-- Date of Birth (Read-only) -->
                <div class="form-group">
                  <label for="dateOfBirth">Date of Birth</label>
                  <input 
                    type="text" 
                    id="dateOfBirth" 
                    formControlName="dateOfBirth"
                    data-testid="dob-input"
                    class="form-control readonly"
                    readonly>
                  <small class="form-help">Contact customer service to update date of birth</small>
                </div>
              </div>

              <!-- Notification Preferences -->
              <div class="form-section">
                <h3 class="section-title">🔔 Notification Preferences</h3>
                
                <div class="notification-options">
                  
                  <!-- Email Notifications -->
                  <div class="notification-item">
                    <div class="notification-info">
                      <h4>📧 Email Notifications</h4>
                      <p>Receive transaction alerts and account updates via email</p>
                    </div>
                    <label class="toggle-switch" data-testid="email-notifications-toggle">
                      <input 
                        type="checkbox" 
                        formControlName="emailNotifications"
                        class="toggle-input">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>

                  <!-- SMS Notifications -->
                  <div class="notification-item">
                    <div class="notification-info">
                      <h4>📱 SMS Notifications</h4>
                      <p>Get instant SMS alerts for all transactions</p>
                    </div>
                    <label class="toggle-switch" data-testid="sms-notifications-toggle">
                      <input 
                        type="checkbox" 
                        formControlName="smsNotifications"
                        class="toggle-input">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>

                  <!-- Push Notifications -->
                  <div class="notification-item">
                    <div class="notification-info">
                      <h4>🔔 Push Notifications</h4>
                      <p>Enable mobile app push notifications</p>
                    </div>
                    <label class="toggle-switch" data-testid="push-notifications-toggle">
                      <input 
                        type="checkbox" 
                        formControlName="pushNotifications"
                        class="toggle-input">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>

                  <!-- Marketing Communications -->
                  <div class="notification-item">
                    <div class="notification-info">
                      <h4>📢 Marketing Communications</h4>
                      <p>Receive offers, promotions, and product updates</p>
                    </div>
                    <label class="toggle-switch" data-testid="marketing-notifications-toggle">
                      <input 
                        type="checkbox" 
                        formControlName="marketingNotifications"
                        class="toggle-input">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>

                </div>
              </div>

              <!-- Security Settings -->
              <div class="form-section">
                <h3 class="section-title">🔒 Security Settings</h3>
                
                <div class="security-options">
                  
                  <!-- Two-Factor Authentication -->
                  <div class="security-item">
                    <div class="security-info">
                      <h4>🔐 Two-Factor Authentication</h4>
                      <p>Add an extra layer of security to your account</p>
                      <span class="status-badge enabled" *ngIf="twoFactorEnabled">Enabled</span>
                      <span class="status-badge disabled" *ngIf="!twoFactorEnabled">Disabled</span>
                    </div>
                    <button 
                      type="button"
                      class="btn btn-small"
                      [class.btn-danger]="twoFactorEnabled"
                      [class.btn-success]="!twoFactorEnabled"
                      data-testid="two-factor-toggle"
                      (click)="toggleTwoFactor()">
                      {{twoFactorEnabled ? 'Disable' : 'Enable'}}
                    </button>
                  </div>

                  <!-- Account Alerts -->
                  <div class="security-item">
                    <div class="security-info">
                      <h4>⚠️ Security Alerts</h4>
                      <p>Get notified of suspicious account activity</p>
                      <span class="status-badge enabled">Always On</span>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Action Buttons -->
              <div class="form-actions">
                <button 
                  type="button" 
                  class="btn btn-secondary"
                  data-testid="cancel-button"
                  (click)="resetForm()">
                  ↺ Reset Changes
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  data-testid="save-button"
                  [disabled]="profileForm.invalid || !hasChanges() || isSubmitting">
                  <span *ngIf="!isSubmitting">💾 Save Changes</span>
                  <span *ngIf="isSubmitting">⏳ Saving...</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      </main>

      <!-- Success Message -->
      <div class="success-toast" *ngIf="showSuccessMessage" data-testid="success-toast">
        <div class="toast-content">
          <span class="toast-icon">✅</span>
          <span class="toast-message">Profile updated successfully!</span>
        </div>
      </div>

      <!-- Logout Confirmation -->
      <div class="modal-overlay" *ngIf="showLogoutModal" data-testid="logout-modal">
        <div class="modal-content">
          <h3>🚪 Logout Confirmation</h3>
          <p>Are you sure you want to logout from your account?</p>
          <div class="modal-actions">
            <button 
              class="btn btn-secondary"
              data-testid="cancel-logout-button"
              (click)="showLogoutModal = false">
              Cancel
            </button>
            <button 
              class="btn btn-danger"
              data-testid="confirm-logout-button"
              (click)="confirmLogout()">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

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

    .profile-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .profile-card {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .profile-card h2 {
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

    .profile-picture-section {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 10px;
      margin-bottom: 2rem;
    }

    .profile-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3498db, #2980b9);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
    }

    .avatar-info h3 {
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
    }

    .avatar-info p {
      margin: 0 0 0.75rem 0;
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-section {
      border: 1px solid #e9ecef;
      border-radius: 10px;
      padding: 1.5rem;
      background: #fafbfc;
    }

    .section-title {
      color: #2c3e50;
      margin: 0 0 1.5rem 0;
      font-size: 1.2rem;
      border-bottom: 2px solid #3498db;
      padding-bottom: 0.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 1.5rem;
    }

    .form-group:last-child {
      margin-bottom: 0;
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

    .form-control.readonly {
      background: #f8f9fa;
      color: #6c757d;
      cursor: not-allowed;
    }

    .form-help {
      margin-top: 0.25rem;
      font-size: 0.8rem;
      color: #6c757d;
      font-style: italic;
    }

    .notification-options, .security-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .notification-item, .security-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .notification-info, .security-info {
      flex: 1;
    }

    .notification-info h4, .security-info h4 {
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
      font-size: 1rem;
    }

    .notification-info p, .security-info p {
      margin: 0;
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
    }

    .toggle-input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.4s;
      border-radius: 34px;
    }

    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }

    .toggle-input:checked + .toggle-slider {
      background-color: #3498db;
    }

    .toggle-input:checked + .toggle-slider:before {
      transform: translateX(26px);
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 0.5rem;
    }

    .status-badge.enabled {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.disabled {
      background: #f8d7da;
      color: #721c24;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1.5rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      text-align: center;
    }

    .btn-small {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
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

    .btn-success {
      background: #27ae60;
      color: white;
    }

    .btn-success:hover {
      background: #229954;
    }

    .btn-danger {
      background: #e74c3c;
      color: white;
    }

    .btn-danger:hover {
      background: #c0392b;
    }

    .success-toast {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #27ae60;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
      z-index: 1000;
      animation: slideInRight 0.3s ease-out;
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .toast-icon {
      font-size: 1.2rem;
    }

    .modal-overlay {
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

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      text-align: center;
      max-width: 400px;
      margin: 1rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .modal-content h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .modal-content p {
      color: #7f8c8d;
      margin-bottom: 1.5rem;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 1rem;
      }

      .profile-card {
        padding: 1.5rem;
      }

      .profile-picture-section {
        flex-direction: column;
        text-align: center;
      }

      .notification-item, .security-item {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .form-actions, .modal-actions {
        flex-direction: column;
      }

      .success-toast {
        top: 10px;
        right: 10px;
        left: 10px;
      }
    }
  `]
})
export class BankingProfileComponent implements OnInit {
  profileForm!: FormGroup;
  userInfo: any = null;
  isSubmitting = false;
  showSuccessMessage = false;
  showLogoutModal = false;
  twoFactorEnabled = true;
  originalFormData: any = {};

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    // Get user info from session storage
    const userInfoStr = sessionStorage.getItem('bankingUser');
    if (userInfoStr) {
      this.userInfo = JSON.parse(userInfoStr);
    } else {
      // Redirect to login if no user data
      this.router.navigate(['/practice-app/banking/login']);
      return;
    }

    // Get saved profile data from sessionStorage
    const savedProfile = JSON.parse(sessionStorage.getItem('bankingProfile') || '{}');

    this.profileForm = this.fb.group({
      fullName: [{ value: this.userInfo?.name || '', disabled: true }],
      email: [savedProfile.email || 'testuser@zenetra.com', [Validators.required, Validators.email]],
      mobile: [savedProfile.mobile || '+91 9876543210', [Validators.required, Validators.pattern(/^[\+]?[\d\s\-\(\)]{10,15}$/)]],
      dateOfBirth: [{ value: '15-Jan-1990', disabled: true }],
      emailNotifications: [savedProfile.emailNotifications !== undefined ? savedProfile.emailNotifications : true],
      smsNotifications: [savedProfile.smsNotifications !== undefined ? savedProfile.smsNotifications : true],
      pushNotifications: [savedProfile.pushNotifications !== undefined ? savedProfile.pushNotifications : false],
      marketingNotifications: [savedProfile.marketingNotifications !== undefined ? savedProfile.marketingNotifications : false]
    });

    // Store original form data for comparison
    this.originalFormData = this.profileForm.getRawValue();
    this.twoFactorEnabled = savedProfile.twoFactorEnabled !== undefined ? savedProfile.twoFactorEnabled : true;
  }

  getInitials(): string {
    const name = this.userInfo?.name || 'User';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
  }

  hasChanges(): boolean {
    const currentData = this.profileForm.getRawValue();
    return JSON.stringify(this.originalFormData) !== JSON.stringify(currentData);
  }

  resetForm() {
    this.profileForm.reset(this.originalFormData);
  }

  changeAvatar() {
    alert('📷 Avatar upload feature is under construction. This is a demo for automation testing.');
  }

  toggleTwoFactor() {
    this.twoFactorEnabled = !this.twoFactorEnabled;
    
    if (this.twoFactorEnabled) {
      alert('🔐 Two-factor authentication has been enabled. You will receive a verification code via SMS for future logins.');
    } else {
      alert('⚠️ Two-factor authentication has been disabled. Your account is less secure without this feature.');
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.isSubmitting = true;

    // Simulate save process
    setTimeout(() => {
      const formData = this.profileForm.getRawValue();
      
      // Save profile data to sessionStorage
      const profileData = {
        ...formData,
        twoFactorEnabled: this.twoFactorEnabled
      };
      sessionStorage.setItem('bankingProfile', JSON.stringify(profileData));

      // Update original form data
      this.originalFormData = formData;

      this.isSubmitting = false;
      this.showSuccessMessage = true;

      // Hide success message after 3 seconds
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
    }, 1500);
  }

  logout() {
    this.showLogoutModal = true;
  }

  confirmLogout() {
    // Clear session data
    sessionStorage.removeItem('bankingUser');
    sessionStorage.removeItem('accountType');
    sessionStorage.removeItem('bankingTransactions');
    sessionStorage.removeItem('bankingProfile');
    
    // Redirect to home
    this.router.navigate(['/practice-app/banking']);
  }
}