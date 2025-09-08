import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-java-development',
  templateUrl: './java-development.component.html',
  styleUrls: ['./java-development.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class JavaDevelopmentComponent {
  activeModule: string | null = null;

  toggleModule(moduleId: string) {
    this.activeModule = this.activeModule === moduleId ? null : moduleId;
  }
}
