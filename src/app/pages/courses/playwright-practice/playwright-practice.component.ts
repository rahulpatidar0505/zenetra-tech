import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-playwright-practice',
  templateUrl: './playwright-practice.component.html',
  styleUrls: ['./playwright-practice.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class PlaywrightPracticeComponent {
  
  ngOnInit() {
    // Open in new tab functionality will be handled here
    this.openPracticeApplication();
  }

  openPracticeApplication() {
    // Open the practice application in a new tab
    window.open('https://playground.bondaracademy.com/pages/forms/layouts', '_blank');
  }
}