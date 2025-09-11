import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-security-testing',
  templateUrl: './security-testing.component.html',
  styleUrls: ['./security-testing.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SecurityTestingComponent {
  activeModule: string | null = null;

  constructor(private router: Router) {}

  toggleModule(moduleId: string) {
    this.activeModule = this.activeModule === moduleId ? null : moduleId;
  }

  enrollNow() {
    this.router.navigate(['/contact-us'], { 
      queryParams: { 
        course: 'Security Testing',
        courseType: 'training'
      }
    });
  }
}
