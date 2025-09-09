import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  serviceOptions = [
    { value: 'project-development', label: 'Project Development' },
    { value: 'project-support', label: 'Project Support' },
    { value: 'online-training', label: 'Online Training' },
    { value: 'workshops', label: 'Workshops' }
  ];
  
  backgroundImageUrl = 'assets/images/our-services.jpg';
  
  ngOnInit() {
    // Preload the background image
    this.preloadBackgroundImage();
  }
  
  preloadBackgroundImage() {
    const img = new Image();
    img.src = this.backgroundImageUrl;
  }
}
