import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'courses', 
    loadComponent: () => import('./pages/courses/courses.component').then(m => m.CoursesComponent)
  },
  { 
    path: 'courses/playwright-automation', 
    loadComponent: () => import('./pages/courses/playwright-automation.component').then(m => m.PlaywrightAutomationComponent)
  },
  { 
    path: 'practice-app', 
    loadComponent: () => import('./pages/practice/practice-app.component').then(m => m.PracticeAppComponent),
    title: 'Playwright Practice Application - Standalone Testing Environment'
  },
  { 
    path: 'practice-standalone', 
    loadComponent: () => import('./pages/practice/practice-app.component').then(m => m.PracticeAppComponent),
    title: 'Playwright Practice Application - Standalone Testing Environment'
  },
  // Banking Practice Application Routes
  {
    path: 'practice-app/banking',
    loadComponent: () => import('./pages/practice/banking/banking-home.component').then(m => m.BankingHomeComponent),
    title: 'ZenetraBank - Practice Banking Application'
  },
  {
    path: 'practice-app/banking/register',
    loadComponent: () => import('./pages/practice/banking/banking-register.component').then(m => m.BankingRegisterComponent),
    title: 'Account Registration - ZenetraBank'
  },
  {
    path: 'practice-app/banking/login',
    loadComponent: () => import('./pages/practice/banking/banking-login.component').then(m => m.BankingLoginComponent),
    title: 'Login - ZenetraBank'
  },
  {
    path: 'practice-app/banking/dashboard',
    loadComponent: () => import('./pages/practice/banking/banking-dashboard.component').then(m => m.BankingDashboardComponent),
    title: 'Dashboard - ZenetraBank'
  },
  {
    path: 'practice-app/banking/account-setup',
    loadComponent: () => import('./pages/practice/banking/banking-account-setup.component').then(m => m.BankingAccountSetupComponent),
    title: 'Account Setup - ZenetraBank'
  },
  {
    path: 'practice-app/banking/transfer',
    loadComponent: () => import('./pages/practice/banking/banking-transfer.component').then(m => m.BankingTransferComponent),
    title: 'Fund Transfer - ZenetraBank'
  },
  {
    path: 'practice-app/banking/profile',
    loadComponent: () => import('./pages/practice/banking/banking-profile.component').then(m => m.BankingProfileComponent),
    title: 'Profile Settings - ZenetraBank'
  },
  { 
    path: 'courses/java-development', 
    loadComponent: () => import('./pages/courses/java-development.component').then(m => m.JavaDevelopmentComponent)
  },
  { 
    path: 'courses/security-testing', 
    loadComponent: () => import('./pages/courses/security-testing.component').then(m => m.SecurityTestingComponent)
  },
  { 
    path: 'admissions', 
    loadComponent: () => import('./pages/admissions/admissions.component').then(m => m.AdmissionsComponent)
  },
  { 
    path: 'gallery', 
    loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent)
  },
  { 
    path: 'services', 
    loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent)
  },
  { 
    path: 'services/project-development', 
    loadComponent: () => import('./pages/services/project-development.component').then(m => m.ProjectDevelopmentComponent)
  },
  { 
    path: 'services/project-support', 
    loadComponent: () => import('./pages/services/project-support.component').then(m => m.ProjectSupportComponent)
  },
  { 
    path: 'services/online-training', 
    loadComponent: () => import('./pages/services/online-training.component').then(m => m.OnlineTrainingComponent)
  },
  { 
    path: 'services/workshops', 
    loadComponent: () => import('./pages/services/workshops.component').then(m => m.WorkshopsComponent)
  },
  { 
    path: 'blog', 
    loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent)
  },
  { 
    path: 'blog/playwright-vs-cypress-selenium', 
    loadComponent: () => import('./pages/blog/playwright-vs-cypress-selenium/playwright-vs-cypress-selenium.component').then(m => m.PlaywrightVsCypressSeleniumComponent)
  },
  { 
    path: 'blog/mcp-server', 
    loadComponent: () => import('./pages/blog/mcp-server/mcp-server.component').then(m => m.McpServerComponent)
  },
  { 
    path: 'contact-us', 
    loadComponent: () => import('./pages/contact-us/contact-us.component').then(m => m.ContactUsComponent)
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' } // 404 fallback
];
