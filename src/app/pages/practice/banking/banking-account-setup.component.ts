import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-banking-account-setup',
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
          <span class="breadcrumb-current">Account Setup</span>
        </nav>
      </header>

      <main class="main-content">
        <div class="setup-container">
          <div class="setup-card">
            <h2>🏦 Bank Account Setup</h2>
            <p class="form-description">Complete your account setup by selecting account type and initial deposit</p>

            <form [formGroup]="setupForm" (ngSubmit)="onSubmit()" class="setup-form">
              
              <!-- Account Type Selection -->
              <div class="form-group">
                <label class="section-label">Account Type *</label>
                <div class="account-types">
                  
                  <div class="account-option">
                    <label class="account-card" [class.selected]="setupForm.get('accountType')?.value === 'savings'">
                      <input 
                        type="radio" 
                        formControlName="accountType" 
                        value="savings"
                        data-testid="savings-account"
                        class="radio-hidden">
                      <div class="account-header">
                        <div class="account-icon">💰</div>
                        <h3>Savings Account</h3>
                      </div>
                      <div class="account-details">
                        <ul>
                          <li>✅ 4% Annual Interest</li>
                          <li>✅ No Monthly Fees</li>
                          <li>✅ Free ATM Withdrawals</li>
                          <li>✅ Mobile Banking</li>
                          <li>✅ Minimum Balance: ₹1,000</li>
                        </ul>
                      </div>
                      <div class="account-badge">
                        <span class="badge recommended">Recommended</span>
                      </div>
                    </label>
                  </div>

                  <div class="account-option">
                    <label class="account-card" [class.selected]="setupForm.get('accountType')?.value === 'current'">
                      <input 
                        type="radio" 
                        formControlName="accountType" 
                        value="current"
                        data-testid="current-account"
                        class="radio-hidden">
                      <div class="account-header">
                        <div class="account-icon">🏢</div>
                        <h3>Current Account</h3>
                      </div>
                      <div class="account-details">
                        <ul>
                          <li>✅ No Interest</li>
                          <li>✅ No Transaction Limits</li>
                          <li>✅ Overdraft Facility</li>
                          <li>✅ Business Banking</li>
                          <li>✅ Minimum Balance: ₹10,000</li>
                        </ul>
                      </div>
                      <div class="account-badge">
                        <span class="badge business">For Business</span>
                      </div>
                    </label>
                  </div>

                </div>
                <div class="error-message" *ngIf="setupForm.get('accountType')?.invalid && setupForm.get('accountType')?.touched">
                  <span *ngIf="setupForm.get('accountType')?.errors?.['required']">Please select an account type</span>
                </div>
              </div>

              <!-- Initial Deposit -->
              <div class="form-group">
                <label for="initialDeposit" class="section-label">Initial Deposit Amount *</label>
                <div class="deposit-input-wrapper">
                  <span class="currency-symbol">₹</span>
                  <input 
                    type="number" 
                    id="initialDeposit" 
                    formControlName="initialDeposit"
                    data-testid="initial-deposit-input"
                    class="form-control deposit-input"
                    placeholder="Enter amount"
                    min="1000"
                    step="100">
                </div>
                <div class="deposit-suggestions">
                  <button 
                    type="button" 
                    class="suggestion-btn"
                    data-testid="deposit-5000"
                    (click)="setDeposit(5000)">
                    ₹5,000
                  </button>
                  <button 
                    type="button" 
                    class="suggestion-btn"
                    data-testid="deposit-10000"
                    (click)="setDeposit(10000)">
                    ₹10,000
                  </button>
                  <button 
                    type="button" 
                    class="suggestion-btn"
                    data-testid="deposit-25000"
                    (click)="setDeposit(25000)">
                    ₹25,000
                  </button>
                  <button 
                    type="button" 
                    class="suggestion-btn"
                    data-testid="deposit-50000"
                    (click)="setDeposit(50000)">
                    ₹50,000
                  </button>
                </div>
                <div class="error-message" *ngIf="setupForm.get('initialDeposit')?.invalid && setupForm.get('initialDeposit')?.touched">
                  <span *ngIf="setupForm.get('initialDeposit')?.errors?.['required']">Initial deposit is required</span>
                  <span *ngIf="setupForm.get('initialDeposit')?.errors?.['min']">Minimum deposit is ₹{{getMinimumDeposit()}}</span>
                </div>
              </div>

              <!-- Account Summary -->
              <div class="account-summary" *ngIf="setupForm.valid">
                <h4>📋 Account Summary</h4>
                <div class="summary-details">
                  <div class="summary-item">
                    <span class="summary-label">Account Type:</span>
                    <span class="summary-value">{{getAccountTypeName()}} Account</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Initial Deposit:</span>
                    <span class="summary-value">₹{{formatAmount(setupForm.get('initialDeposit')?.value)}}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Minimum Balance:</span>
                    <span class="summary-value">₹{{formatAmount(getMinimumDeposit())}}</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="form-actions">
                <button 
                  type="button" 
                  class="btn btn-secondary"
                  data-testid="cancel-button"
                  routerLink="/practice-app/banking/dashboard">
                  ❌ Cancel
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  data-testid="submit-button"
                  [disabled]="setupForm.invalid || isSubmitting">
                  <span *ngIf="!isSubmitting">✅ Create Account</span>
                  <span *ngIf="isSubmitting">⏳ Creating...</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      </main>

      <!-- Confirmation Popup -->
      <div class="popup-overlay" *ngIf="showConfirmation" data-testid="confirmation-popup">
        <div class="popup-content">
          <h3>🎉 Account Setup Successful!</h3>
          <div class="confirmation-details">
            <p><strong>Account Type:</strong> {{getAccountTypeName()}} Account</p>
            <p><strong>Account Number:</strong> {{userInfo?.accountNumber}}</p>
            <p><strong>Opening Balance:</strong> ₹{{formatAmount(setupForm.get('initialDeposit')?.value)}}</p>
          </div>
          <p class="success-message">Your account has been successfully set up. You can now access all banking features.</p>
          <button 
            class="btn btn-primary"
            data-testid="goto-dashboard-button"
            (click)="goToDashboard()">
            Go to Dashboard
          </button>
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

    .setup-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .setup-card {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .setup-card h2 {
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

    .setup-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .section-label {
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .account-types {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .account-option {
      position: relative;
    }

    .radio-hidden {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .account-card {
      display: block;
      background: #f8f9fa;
      border: 3px solid #e9ecef;
      border-radius: 15px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      height: 100%;
    }

    .account-card:hover {
      border-color: #3498db;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(52, 152, 219, 0.15);
    }

    .account-card.selected {
      border-color: #27ae60;
      background: #e8f5e8;
      box-shadow: 0 8px 25px rgba(39, 174, 96, 0.2);
    }

    .account-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .account-icon {
      font-size: 2.5rem;
    }

    .account-header h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.3rem;
    }

    .account-details ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .account-details li {
      padding: 0.25rem 0;
      color: #555;
      font-size: 0.95rem;
    }

    .account-badge {
      margin-top: 1rem;
    }

    .badge {
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge.recommended {
      background: #d4edda;
      color: #155724;
    }

    .badge.business {
      background: #d1ecf1;
      color: #0c5460;
    }

    .deposit-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .currency-symbol {
      position: absolute;
      left: 1rem;
      font-size: 1.2rem;
      font-weight: bold;
      color: #2c3e50;
      z-index: 2;
    }

    .deposit-input {
      padding-left: 3rem;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .form-control {
      padding: 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      width: 100%;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }

    .deposit-suggestions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .suggestion-btn {
      background: #e9ecef;
      border: 1px solid #ced4da;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
    }

    .suggestion-btn:hover {
      background: #3498db;
      color: white;
      border-color: #3498db;
    }

    .account-summary {
      background: #e8f4fd;
      border: 1px solid #b8daff;
      border-radius: 10px;
      padding: 1.5rem;
    }

    .account-summary h4 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
    }

    .summary-details {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .summary-label {
      font-weight: 600;
      color: #495057;
    }

    .summary-value {
      font-weight: 700;
      color: #2c3e50;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1rem;
    }

    .btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 150px;
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

    .popup-overlay {
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

    .popup-content {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      text-align: center;
      max-width: 500px;
      margin: 1rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .popup-content h3 {
      color: #27ae60;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }

    .confirmation-details {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      text-align: left;
    }

    .confirmation-details p {
      margin: 0.5rem 0;
      display: flex;
      justify-content: space-between;
    }

    .success-message {
      color: #7f8c8d;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 1rem;
      }

      .setup-card {
        padding: 1.5rem;
      }

      .account-types {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .deposit-suggestions {
        justify-content: center;
      }

      .summary-item {
        flex-direction: column;
        gap: 0.25rem;
        align-items: flex-start;
      }
    }
  `]
})
export class BankingAccountSetupComponent implements OnInit {
  setupForm!: FormGroup;
  isSubmitting = false;
  showConfirmation = false;
  userInfo: any = null;

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

    // Check if account is already set up
    const accountType = sessionStorage.getItem('accountType');
    if (accountType) {
      // Redirect to dashboard if already set up
      this.router.navigate(['/practice-app/banking/dashboard']);
      return;
    }

    this.setupForm = this.fb.group({
      accountType: ['', Validators.required],
      initialDeposit: ['', [Validators.required, Validators.min(1000)]]
    });

    // Update minimum deposit validation when account type changes
    this.setupForm.get('accountType')?.valueChanges.subscribe((accountType) => {
      const minDeposit = this.getMinimumDeposit();
      this.setupForm.get('initialDeposit')?.setValidators([
        Validators.required,
        Validators.min(minDeposit)
      ]);
      this.setupForm.get('initialDeposit')?.updateValueAndValidity();
    });
  }

  getMinimumDeposit(): number {
    const accountType = this.setupForm.get('accountType')?.value;
    return accountType === 'current' ? 10000 : 1000;
  }

  getAccountTypeName(): string {
    const accountType = this.setupForm.get('accountType')?.value;
    return accountType === 'current' ? 'Current' : 'Savings';
  }

  setDeposit(amount: number) {
    this.setupForm.patchValue({ initialDeposit: amount });
  }

  formatAmount(amount: number): string {
    if (!amount) return '0';
    return amount.toLocaleString('en-IN');
  }

  onSubmit() {
    if (this.setupForm.invalid) return;

    this.isSubmitting = true;

    // Simulate account creation process
    setTimeout(() => {
      const { accountType, initialDeposit } = this.setupForm.value;

      // Update user balance
      this.userInfo.balance = initialDeposit;
      sessionStorage.setItem('bankingUser', JSON.stringify(this.userInfo));

      // Save account type
      sessionStorage.setItem('accountType', accountType);

      // Add initial transaction
      const transactions = [{
        id: Date.now(),
        type: 'credit',
        description: 'Account Opening Deposit',
        amount: initialDeposit,
        date: new Date().toISOString(),
        balance: initialDeposit
      }];
      sessionStorage.setItem('bankingTransactions', JSON.stringify(transactions));

      this.isSubmitting = false;
      this.showConfirmation = true;
    }, 2000);
  }

  goToDashboard() {
    this.router.navigate(['/practice-app/banking/dashboard']);
  }
}