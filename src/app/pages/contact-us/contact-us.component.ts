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
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [''],
      course: [this.selectedCourse],
      message: [this.selectedCourse ? `I am interested in enrolling for the ${this.selectedCourse} course. Please provide more details.` : '']
    });
  }
  
  get f() { 
    return this.contactForm.controls; 
  }
  
  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    if (this.contactForm.invalid) {
      return;
    }
    
    this.sending = true;
    
    const formData = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      mobile: this.contactForm.value.mobile,
      address: this.contactForm.value.address,
      course: this.contactForm.value.course,
      message: this.contactForm.value.message
    };
    
    setTimeout(() => {
      this.successMessage = 'Your message has been sent successfully. We will get back to you soon!';
      this.contactForm.reset();
      this.submitted = false;
      this.sending = false;
    }, 1500);
    
    console.log('Form data to send:', formData);
  }
}
