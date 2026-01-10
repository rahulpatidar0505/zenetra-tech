import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-banking-transfer',
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
          <span class="breadcrumb-current">Fund Transfer</span>
        </nav>
      </header>

      <main class="main-content">
        <div class="transfer-container">
          <div class="transfer-card">
            <h2>💸 Fund Transfer</h2>
            <p class="form-description">Transfer money securely to other accounts</p>

            <!-- Current Balance Display -->
            <div class="balance-display">
              <div class="balance-info">
                <span class="balance-label">Available Balance:</span>
                <span class="balance-amount" data-testid="available-balance">₹{{formatBalance(userInfo?.balance || 0)}}</span>
              </div>
            </div>

            <form [formGroup]="transferForm" (ngSubmit)="onSubmit()" class="transfer-form">
              
              <!-- Beneficiary Selection -->
              <div class="form-group">
                <label for="beneficiary">Select Beneficiary *</label>
                <select 
                  id="beneficiary" 
                  formControlName="beneficiary"
                  data-testid="beneficiary-select"
                  class="form-control">
                  <option value="">Choose beneficiary</option>
                  <option value="john-doe">John Doe - **** 4567</option>
                  <option value="jane-smith">Jane Smith - **** 8901</option>
                  <option value="bob-wilson">Bob Wilson - **** 2345</option>
                  <option value="alice-brown">Alice Brown - **** 6789</option>
                  <option value="mike-davis">Mike Davis - **** 1234</option>
                  <option value="sarah-jones">Sarah Jones - **** 5678</option>
                </select>
                <div class="error-message" *ngIf="transferForm.get('beneficiary')?.invalid && transferForm.get('beneficiary')?.touched">
                  <span *ngIf="transferForm.get('beneficiary')?.errors?.['required']">Please select a beneficiary</span>
                </div>
              </div>

              <!-- Beneficiary Details Display -->
              <div class="beneficiary-details" *ngIf="selectedBeneficiary" data-testid="beneficiary-details">
                <h4>📋 Beneficiary Details</h4>
                <div class="details-grid">
                  <div class="detail-item">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">{{selectedBeneficiary.name}}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Account:</span>
                    <span class="detail-value">{{selectedBeneficiary.account}}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Bank:</span>
                    <span class="detail-value">{{selectedBeneficiary.bank}}</span>
                  </div>
                </div>
              </div>

              <!-- Transfer Amount -->
              <div class="form-group">
                <label for="amount">Transfer Amount *</label>
                <div class="amount-input-wrapper">
                  <span class="currency-symbol">₹</span>
                  <input 
                    type="number" 
                    id="amount" 
                    formControlName="amount"
                    data-testid="transfer-amount-input"
                    class="form-control amount-input"
                    placeholder="Enter amount"
                    min="1"
                    step="0.01">
                </div>
                <div class="quick-amounts">
                  <button 
                    type="button" 
                    class="quick-amount-btn"
                    data-testid="quick-amount-100"
                    (click)="setAmount(100)">
                    ₹100
                  </button>
                  <button 
                    type="button" 
                    class="quick-amount-btn"
                    data-testid="quick-amount-500"
                    (click)="setAmount(500)">
                    ₹500
                  </button>
                  <button 
                    type="button" 
                    class="quick-amount-btn"
                    data-testid="quick-amount-1000"
                    (click)="setAmount(1000)">
                    ₹1,000
                  </button>
                  <button 
                    type="button" 
                    class="quick-amount-btn"
                    data-testid="quick-amount-5000"
                    (click)="setAmount(5000)">
                    ₹5,000
                  </button>
                </div>
                <div class="error-message" *ngIf="transferForm.get('amount')?.invalid && transferForm.get('amount')?.touched">
                  <span *ngIf="transferForm.get('amount')?.errors?.['required']">Transfer amount is required</span>
                  <span *ngIf="transferForm.get('amount')?.errors?.['min']">Amount must be at least ₹1</span>
                  <span *ngIf="transferForm.get('amount')?.errors?.['max']">Amount exceeds available balance</span>
                </div>
              </div>

              <!-- Transfer Date -->
              <div class="form-group">
                <label for="transferDate">Transfer Date *</label>
                <input 
                  type="date" 
                  id="transferDate" 
                  formControlName="transferDate"
                  data-testid="transfer-date-input"
                  class="form-control"
                  [min]="minDate"
                  [max]="maxDate">
                <div class="date-options">
                  <button 
                    type="button" 
                    class="date-option-btn"
                    data-testid="today-button"
                    (click)="setToday()">
                    Today
                  </button>
                  <button 
                    type="button" 
                    class="date-option-btn"
                    data-testid="tomorrow-button"
                    (click)="setTomorrow()">
                    Tomorrow
                  </button>
                </div>
                <div class="error-message" *ngIf="transferForm.get('transferDate')?.invalid && transferForm.get('transferDate')?.touched">
                  <span *ngIf="transferForm.get('transferDate')?.errors?.['required']">Transfer date is required</span>
                </div>
              </div>

              <!-- Transaction Purpose -->
              <div class="form-group">
                <label for="purpose">Purpose (Optional)</label>
                <input 
                  type="text" 
                  id="purpose" 
                  formControlName="purpose"
                  data-testid="purpose-input"
                  class="form-control"
                  placeholder="e.g., Rent, Gift, Business">
              </div>

              <!-- Transfer Summary -->
              <div class="transfer-summary" *ngIf="transferForm.valid && selectedBeneficiary" data-testid="transfer-summary">
                <h4>📄 Transfer Summary</h4>
                <div class="summary-details">
                  <div class="summary-row">
                    <span class="summary-label">To:</span>
                    <span class="summary-value">{{selectedBeneficiary.name}}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-label">Amount:</span>
                    <span class="summary-value amount-highlight">₹{{formatBalance(transferForm.get('amount')?.value || 0)}}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-label">Date:</span>
                    <span class="summary-value">{{formatDate(transferForm.get('transferDate')?.value)}}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-label">Remaining Balance:</span>
                    <span class="summary-value">₹{{formatBalance(getRemainingBalance())}}</span>
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
                  data-testid="transfer-button"
                  [disabled]="transferForm.invalid || isSubmitting">
                  <span *ngIf="!isSubmitting">💸 Transfer Money</span>
                  <span *ngIf="isSubmitting">⏳ Processing...</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      </main>

      <!-- Success Message Modal -->
      <div class="modal-overlay" *ngIf="showSuccessMessage" data-testid="success-modal">
        <div class="modal-content">
          <h3>🎉 Transfer Successful!</h3>
          <div class="success-details">
            <div class="success-icon">✅</div>
            <div class="transaction-info">
              <p><strong>Transaction ID:</strong> {{transactionId}}</p>
              <p><strong>Amount Transferred:</strong> ₹{{formatBalance(transferredAmount)}}</p>
              <p><strong>To:</strong> {{transferredTo}}</p>
              <p><strong>Status:</strong> <span class="status-completed">Completed</span></p>
            </div>
          </div>
          <div class="modal-actions">
            <button 
              class="btn btn-secondary"
              data-testid="view-receipt-button"
              (click)="viewReceipt()">
              📄 View Receipt
            </button>
            <button 
              class="btn btn-primary"
              data-testid="back-to-dashboard-button"
              (click)="backToDashboard()">
              🏠 Back to Dashboard
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

    .transfer-container {
      max-width: 700px;
      margin: 0 auto;
    }

    .transfer-card {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .transfer-card h2 {
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

    .balance-display {
      background: #e8f5e8;
      border: 1px solid #c8e6c8;
      border-radius: 10px;
      padding: 1rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .balance-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .balance-label {
      font-weight: 600;
      color: #2c3e50;
    }

    .balance-amount {
      font-size: 1.3rem;
      font-weight: bold;
      color: #27ae60;
    }

    .transfer-form {
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

    .beneficiary-details {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 1rem;
      margin-top: 1rem;
    }

    .beneficiary-details h4 {
      margin: 0 0 0.75rem 0;
      color: #2c3e50;
    }

    .details-grid {
      display: grid;
      gap: 0.5rem;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
    }

    .detail-label {
      font-weight: 600;
      color: #495057;
    }

    .detail-value {
      color: #2c3e50;
    }

    .amount-input-wrapper {
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

    .amount-input {
      padding-left: 3rem;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .quick-amounts {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
      flex-wrap: wrap;
    }

    .quick-amount-btn, .date-option-btn {
      background: #e9ecef;
      border: 1px solid #ced4da;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .quick-amount-btn:hover, .date-option-btn:hover {
      background: #3498db;
      color: white;
      border-color: #3498db;
    }

    .date-options {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }

    .transfer-summary {
      background: #e8f4fd;
      border: 1px solid #b8daff;
      border-radius: 10px;
      padding: 1.5rem;
    }

    .transfer-summary h4 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
    }

    .summary-details {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .summary-row {
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

    .amount-highlight {
      color: #e74c3c;
      font-size: 1.1rem;
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
      margin-top: 1.5rem;
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
      max-width: 500px;
      margin: 1rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .modal-content h3 {
      color: #27ae60;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }

    .success-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      text-align: left;
    }

    .success-icon {
      font-size: 3rem;
    }

    .transaction-info p {
      margin: 0.5rem 0;
      display: flex;
      justify-content: space-between;
    }

    .status-completed {
      color: #27ae60;
      font-weight: bold;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 1rem;
      }

      .transfer-card {
        padding: 1.5rem;
      }

      .form-actions, .modal-actions {
        flex-direction: column;
      }

      .balance-info {
        flex-direction: column;
        gap: 0.5rem;
      }

      .quick-amounts {
        justify-content: center;
      }

      .summary-row {
        flex-direction: column;
        gap: 0.25rem;
        align-items: flex-start;
      }

      .success-details {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class BankingTransferComponent implements OnInit {
  transferForm!: FormGroup;
  userInfo: any = null;
  isSubmitting = false;
  showSuccessMessage = false;
  selectedBeneficiary: any = null;
  transactionId = '';
  transferredAmount = 0;
  transferredTo = '';
  minDate = '';
  maxDate = '';

  beneficiaries = [
    { id: 'john-doe', name: 'John Doe', account: '**** **** **** 4567', bank: 'State Bank of India' },
    { id: 'jane-smith', name: 'Jane Smith', account: '**** **** **** 8901', bank: 'HDFC Bank' },
    { id: 'bob-wilson', name: 'Bob Wilson', account: '**** **** **** 2345', bank: 'ICICI Bank' },
    { id: 'alice-brown', name: 'Alice Brown', account: '**** **** **** 6789', bank: 'Axis Bank' },
    { id: 'mike-davis', name: 'Mike Davis', account: '**** **** **** 1234', bank: 'Punjab National Bank' },
    { id: 'sarah-jones', name: 'Sarah Jones', account: '**** **** **** 5678', bank: 'Kotak Mahindra Bank' }
  ];

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

    // Check if account is set up
    const accountType = sessionStorage.getItem('accountType');
    if (!accountType) {
      // Redirect to account setup if not set up
      this.router.navigate(['/practice-app/banking/account-setup']);
      return;
    }

    // Set date constraints
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    this.maxDate = maxDate.toISOString().split('T')[0];

    this.transferForm = this.fb.group({
      beneficiary: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      transferDate: [this.minDate, Validators.required],
      purpose: ['']
    });

    // Watch for beneficiary changes
    this.transferForm.get('beneficiary')?.valueChanges.subscribe((beneficiaryId) => {
      this.selectedBeneficiary = this.beneficiaries.find(b => b.id === beneficiaryId) || null;
    });

    // Watch for amount changes to validate against balance
    this.transferForm.get('amount')?.valueChanges.subscribe((amount) => {
      this.updateAmountValidation();
    });
  }

  updateAmountValidation() {
    const amountControl = this.transferForm.get('amount');
    const currentBalance = this.userInfo?.balance || 0;
    
    amountControl?.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(currentBalance)
    ]);
    amountControl?.updateValueAndValidity({ emitEvent: false });
  }

  setAmount(amount: number) {
    this.transferForm.patchValue({ amount: amount });
  }

  setToday() {
    this.transferForm.patchValue({ transferDate: this.minDate });
  }

  setTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.transferForm.patchValue({ transferDate: tomorrow.toISOString().split('T')[0] });
  }

  formatBalance(amount: number): string {
    if (!amount) return '0.00';
    return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getRemainingBalance(): number {
    const amount = this.transferForm.get('amount')?.value || 0;
    return (this.userInfo?.balance || 0) - amount;
  }

  onSubmit() {
    if (this.transferForm.invalid || !this.selectedBeneficiary) return;

    this.isSubmitting = true;

    // Simulate transfer process
    setTimeout(() => {
      const { amount, transferDate, purpose } = this.transferForm.value;

      // Update user balance
      this.userInfo.balance -= amount;
      sessionStorage.setItem('bankingUser', JSON.stringify(this.userInfo));

      // Add transaction to history
      const transactions = JSON.parse(sessionStorage.getItem('bankingTransactions') || '[]');
      const newTransaction = {
        id: Date.now(),
        type: 'debit',
        description: `Transfer to ${this.selectedBeneficiary.name}${purpose ? ' - ' + purpose : ''}`,
        amount: amount,
        date: new Date().toISOString(),
        balance: this.userInfo.balance,
        beneficiary: this.selectedBeneficiary.name
      };
      
      transactions.push(newTransaction);
      sessionStorage.setItem('bankingTransactions', JSON.stringify(transactions));

      // Set success message data
      this.transactionId = 'TXN' + Date.now();
      this.transferredAmount = amount;
      this.transferredTo = this.selectedBeneficiary.name;

      this.isSubmitting = false;
      this.showSuccessMessage = true;
    }, 2000);
  }

  viewReceipt() {
    alert(`📄 Transaction Receipt\n\nTransaction ID: ${this.transactionId}\nAmount: ₹${this.formatBalance(this.transferredAmount)}\nTo: ${this.transferredTo}\nStatus: Completed\n\nThis is a demo receipt for automation testing.`);
  }

  backToDashboard() {
    this.router.navigate(['/practice-app/banking/dashboard']);
  }
}