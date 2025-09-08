import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-security-testing',
  templateUrl: './security-testing.component.html',
  styleUrls: ['./security-testing.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SecurityTestingComponent {
  activeModule: string | null = null;

  toggleModule(moduleId: string) {
    this.activeModule = this.activeModule === moduleId ? null : moduleId;
  }
}
