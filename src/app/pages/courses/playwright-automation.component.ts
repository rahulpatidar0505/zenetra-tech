import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-playwright-automation',
  templateUrl: './playwright-automation.component.html',
  styleUrls: ['./playwright-automation.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PlaywrightAutomationComponent {
  activeModule: string | null = null;

  constructor(private router: Router) {}

  toggleModule(moduleId: string) {
    this.activeModule = this.activeModule === moduleId ? null : moduleId;
  }

  enrollNow() {
    this.router.navigate(['/contact-us'], { 
      queryParams: { 
        course: 'Playwright Automation',
        courseType: 'training'
      }
    });
  }
}
