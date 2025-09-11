import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-java-development',
  templateUrl: './java-development.component.html',
  styleUrls: ['./java-development.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class JavaDevelopmentComponent {
  activeModule: string | null = null;

  constructor(private router: Router) {}

  toggleModule(moduleId: string) {
    this.activeModule = this.activeModule === moduleId ? null : moduleId;
  }

  enrollNow() {
    this.router.navigate(['/contact-us'], { 
      queryParams: { 
        course: 'Java Development',
        courseType: 'training'
      }
    });
  }
}
