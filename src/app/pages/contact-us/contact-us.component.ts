import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent implements OnInit {
  contactForm!: FormGroup;
  submitted = false;
  sending = false;
  successMessage = '';
  errorMessage = '';
  selectedCourse = '';
  
  constructor(
    private formBuilder: FormBuilder, 
    private emailService: EmailService,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit() {
    // Check for course query parameter
    this.route.queryParams.subscribe(params => {
      if (params['course']) {
        this.selectedCourse = params['course'];
      }
    });

    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      course: [this.selectedCourse],
      message: [this.selectedCourse ? `I am interested in enrolling for the ${this.selectedCourse} course. Please provide more details.` : '', Validators.required]
    });
  }
  
  // Easy access for form fields
  get f() { 
    return this.contactForm.controls; 
  }
  
  onSubmit() {
    this.submitted = true;
    
    // Clear previous messages
    this.successMessage = '';
    this.errorMessage = '';
    
    // Stop if form is invalid
    if (this.contactForm.invalid) {
      return;
    }
    
    this.sending = true;
    
    // Create an object with all the form data
    const formData = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      course: this.contactForm.value.course,
      message: this.contactForm.value.message
    };
    
    // For demo purposes, simulate a successful email sending
    setTimeout(() => {
      this.successMessage = 'Your message has been sent successfully. We will get back to you soon!';
      this.contactForm.reset();
      this.submitted = false;
      this.sending = false;
    }, 1500);
    
    // Log the data that would be sent (for demonstration purposes)
    console.log('Form data to send:', formData);
    
    // In a real implementation, you would uncomment this:
    // this.emailService.sendEmail(formData).subscribe(
    //   response => {
    //     if (response && response.error) {
    //       this.errorMessage = 'Failed to send message. Please try again later or contact us directly via email.';
    //     } else {
    //       this.successMessage = 'Your message has been sent successfully. We will get back to you soon!';
    //       this.contactForm.reset();
    //       this.submitted = false;
    //     }
    //     this.sending = false;
    //   },
    //   error => {
    //     this.errorMessage = 'Failed to send message. Please try again later or contact us directly via email.';
    //     console.error('Error sending email:', error);
    //     this.sending = false;
    //   }
    // );
  }
}
