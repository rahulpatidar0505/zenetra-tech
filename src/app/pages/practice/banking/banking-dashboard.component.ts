import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-banking-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="banking-app">
      <header class="app-header">
        <h1 class="app-title">🏦 ZenetraBank</h1>
        <nav class="nav-breadcrumb">
          <a routerLink="/practice-app/banking" class="breadcrumb-link">Home</a>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">Dashboard</span>
        </nav>
        <div class="header-actions">
          <button 
            class="btn btn-logout"
            data-testid="logout-button"
            (click)="logout()">
            🚪 Logout
          </button>
        </div>
      </header>

      <main class="main-content">
        <div class="dashboard-container">
          
          <!-- Welcome Section -->
          <div class="welcome-section">
            <h2 data-testid="welcome-message">Welcome back, {{userInfo?.name}}! 👋</h2>
            <p class="welcome-subtitle">Here's your account overview</p>
          </div>

          <!-- Account Info Cards -->
          <div class="account-grid">
            
            <!-- Account Number Card -->
            <div class="account-card">
              <div class="card-header">
                <h3>🏦 Account Details</h3>
              </div>
              <div class="card-content">
                <div class="info-item">
                  <label>Account Number:</label>
                  <div class="readonly-field" data-testid="account-number">
                    {{userInfo?.accountNumber}}
                  </div>
                </div>
                <div class="info-item">
                  <label>Account Type:</label>
                  <div class="readonly-field">
                    Savings Account
                  </div>
                </div>
                <div class="info-item">
                  <label>Account Holder:</label>
                  <div class="readonly-field">
                    {{userInfo?.name}}
                  </div>
                </div>
              </div>
            </div>

            <!-- Balance Card -->
            <div class="balance-card">
              <div class="card-header">
                <h3>💰 Current Balance</h3>
              </div>
              <div class="card-content">
                <div class="balance-amount" data-testid="account-balance">
                  ₹{{formatBalance(userInfo?.balance || 0)}}
                </div>
                <div class="balance-status" [ngClass]="getBalanceStatusClass()">
                  {{getBalanceStatus()}}
                </div>
              </div>
            </div>

          </div>

          <!-- Quick Actions -->
          <div class="quick-actions">
            <h3>Quick Actions</h3>
            <div class="actions-grid">
              
              <div class="action-card">
                <div class="action-icon">💸</div>
                <h4>Quick Transfer</h4>
                <p>Send ₹1,000 to John Doe</p>
                <button 
                  class="btn btn-primary"
                  data-testid="quick-transfer-button"
                  (click)="performQuickTransfer()">
                  Transfer Now
                </button>
              </div>

              <div class="action-card">
                <div class="action-icon">📊</div>
                <h4>Account Summary</h4>
                <p>View your account details</p>
                <button 
                  class="btn btn-secondary"
                  data-testid="view-summary-button"
                  (click)="viewSummary()">
                  View Summary
                </button>
              </div>

            </div>
          </div>

          <!-- Simple Info Alert -->
          <div class="status-alert info-alert" data-testid="info-alert">
            <div class="alert-content">
              <span class="alert-icon">ℹ️</span>
              <div class="alert-text">
                <strong>Demo Banking Application</strong>
                <p>This is a practice application for automation testing. All transactions are simulated.</p>
              </div>
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .header-left {
      flex: 1;
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

    .header-actions .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-logout {
      background: #e74c3c;
      color: white;
    }

    .btn-logout:hover {
      background: #c0392b;
    }

    .main-content {
      padding: 2rem;
    }

    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .welcome-section {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .welcome-section h2 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
      font-size: 1.8rem;
    }

    .welcome-subtitle {
      color: #7f8c8d;
      font-size: 1.1rem;
    }

    .account-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .account-card, .balance-card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .card-header {
      background: #3498db;
      color: white;
      padding: 1rem 1.5rem;
    }

    .card-header h3 {
      margin: 0;
      font-size: 1.2rem;
    }

    .card-content {
      padding: 1.5rem;
    }

    .info-item {
      margin-bottom: 1rem;
    }

    .info-item:last-child {
      margin-bottom: 0;
    }

    .info-item label {
      display: block;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .readonly-field {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      padding: 0.75rem;
      border-radius: 5px;
      font-family: 'Courier New', monospace;
      font-size: 1rem;
      color: #495057;
    }

    .balance-card .card-header {
      background: #27ae60;
    }

    .balance-amount {
      font-size: 2.5rem;
      font-weight: bold;
      color: #27ae60;
      text-align: center;
      margin-bottom: 0.5rem;
    }

    .balance-status {
      text-align: center;
      padding: 0.5rem;
      border-radius: 20px;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.85rem;
    }

    .balance-status.healthy {
      background: #d4edda;
      color: #155724;
    }

    .balance-status.monitor {
      background: #fff3cd;
      color: #856404;
    }

    .quick-actions {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .quick-actions h3 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
      text-align: center;
      font-size: 1.5rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .action-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 10px;
      text-align: center;
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .action-card:hover {
      border-color: #3498db;
      transform: translateY(-2px);
    }

    .action-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .action-card h4 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .action-card p {
      color: #7f8c8d;
      margin-bottom: 1rem;
      font-size: 0.9rem;
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
      display: inline-block;
      text-align: center;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover {
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

    .btn-warning {
      background: #f39c12;
      color: white;
    }

    .btn-warning:hover {
      background: #d68910;
    }

    .recent-activity {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .recent-activity h3 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }

    .transactions-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .transaction-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #3498db;
    }

    .transaction-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .transaction-type {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .transaction-icon {
      font-size: 1.2rem;
    }

    .transaction-description {
      font-weight: 600;
      color: #2c3e50;
    }

    .transaction-date {
      font-size: 0.85rem;
      color: #7f8c8d;
    }

    .transaction-amount {
      font-size: 1.1rem;
      font-weight: bold;
    }

    .transaction-amount.credit {
      color: #27ae60;
    }

    .transaction-amount.debit {
      color: #e74c3c;
    }

    .status-alert {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 10px;
      padding: 1.5rem;
    }

    .alert-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .alert-icon {
      font-size: 2rem;
    }

    .alert-text {
      flex: 1;
    }

    .alert-text strong {
      color: #856404;
      display: block;
      margin-bottom: 0.25rem;
    }

    .alert-text p {
      color: #856404;
      margin: 0;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 1rem;
      }

      .app-header {
        flex-direction: column;
        align-items: stretch;
      }

      .account-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }

      .alert-content {
        flex-direction: column;
        text-align: center;
      }

      .balance-amount {
        font-size: 2rem;
      }
    }
  `]
})
export class BankingDashboardComponent implements OnInit {
  userInfo: any = null;

  constructor(private router: Router) {}

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

    // Set default balance if not exists
    if (!this.userInfo.balance) {
      this.userInfo.balance = 25000;
      sessionStorage.setItem('bankingUser', JSON.stringify(this.userInfo));
    }
  }

  formatBalance(amount: number): string {
    return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getBalanceStatus(): string {
    const balance = this.userInfo?.balance || 0;
    return balance > 5000 ? 'Healthy Balance' : 'Monitor Balance';
  }

  getBalanceStatusClass(): string {
    const balance = this.userInfo?.balance || 0;
    return balance > 5000 ? 'healthy' : 'monitor';
  }

  performQuickTransfer() {
    if (this.userInfo.balance >= 1000) {
      this.userInfo.balance -= 1000;
      sessionStorage.setItem('bankingUser', JSON.stringify(this.userInfo));
      alert('✅ Successfully transferred ₹1,000 to John Doe! New balance: ₹' + this.formatBalance(this.userInfo.balance));
    } else {
      alert('❌ Insufficient funds for this transfer.');
    }
  }

  viewSummary() {
    alert(`📊 Account Summary:\\n\\nAccount Holder: ${this.userInfo.name}\\nAccount Number: ${this.userInfo.accountNumber}\\nBalance: ₹${this.formatBalance(this.userInfo.balance)}\\nAccount Type: Savings`);
  }

  logout() {
    // Confirm logout
    if (confirm('Are you sure you want to logout?')) {
      // Clear session data
      sessionStorage.removeItem('bankingUser');
      sessionStorage.removeItem('accountType');
      sessionStorage.removeItem('bankingTransactions');
      
      // Redirect to home
      this.router.navigate(['/practice-app/banking']);
    }
  }
}