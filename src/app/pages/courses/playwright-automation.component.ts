import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-playwright-automation',
  templateUrl: './playwright-automation.component.html',
  styleUrls: ['./playwright-automation.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PlaywrightAutomationComponent {
  activeModule: string | null = null;

  toggleModule(moduleId: string) {
    this.activeModule = this.activeModule === moduleId ? null : moduleId;
  }
}
