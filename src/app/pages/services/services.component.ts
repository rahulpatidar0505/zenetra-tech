import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  serviceOptions = [
    { value: 'project-development', label: 'Project Development' },
    { value: 'project-support', label: 'Project Support' },
    { value: 'online-training', label: 'Online Training' },
    { value: 'workshops', label: 'Workshops' }
  ];
}
