import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';

// Custom Validators
export class CustomValidators {
  // Phone number validator - only digits, spaces, hyphens, parentheses, plus sign
  static phoneNumber(control: AbstractControl): ValidationErrors | null {
    const phonePattern = /^[\+]?[\d\s\-\(\)]+$/;
    const value = control.value;
    
    if (!value) return null; // Don't validate empty values (use required validator)
    
    // Remove spaces and common phone characters to check if underlying digits exist
    const digitsOnly = value.replace(/[\s\-\(\)\+]/g, '');
    
    if (!phonePattern.test(value)) {
      return { phoneInvalid: true };
    }
    
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return { phoneLength: true };
    }
    
    return null;
  }
  
  // Name validator - only alphabets, spaces, hyphens, apostrophes
  static nameValidator(control: AbstractControl): ValidationErrors | null {
    const namePattern = /^[a-zA-Z\s\-\']+$/;
    const value = control.value;
    
    if (!value) return null;
    
    if (!namePattern.test(value)) {
      return { nameInvalid: true };
    }
    
    if (value.length < 2) {
      return { nameLength: true };
    }
    
    return null;
  }
  
  // Age validator
  static ageValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    
    if (!value) return null;
    
    const age = parseInt(value, 10);
    
    if (isNaN(age)) {
      return { ageInvalid: true };
    }
    
    if (age < 18 || age > 100) {
      return { ageRange: true };
    }
    
    return null;
  }
  
  // ZIP code validator
  static zipCodeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    
    if (!value) return null;
    
    // US ZIP code pattern (5 digits or 5+4 format)
    const zipPattern = /^\d{5}(-\d{4})?$/;
    
    if (!zipPattern.test(value)) {
      return { zipInvalid: true };
    }
    
    return null;
  }
  
  // Password strength validator
  static passwordStrength(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    
    if (!value) return null;
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    const errors: ValidationErrors = {};
    
    if (!hasUpperCase) errors['noUpperCase'] = true;
    if (!hasLowerCase) errors['noLowerCase'] = true;
    if (!hasNumbers) errors['noNumbers'] = true;
    if (!hasSpecialChar) errors['noSpecialChar'] = true;
    if (value.length < 8) errors['tooShort'] = true;
    
    return Object.keys(errors).length > 0 ? errors : null;
  }
  
  // Username validator
  static usernameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    
    if (!value) return null;
    
    // Username should contain only alphanumeric characters and underscores
    const usernamePattern = /^[a-zA-Z0-9_]+$/;
    
    if (!usernamePattern.test(value)) {
      return { usernameInvalid: true };
    }
    
    if (value.length < 3 || value.length > 20) {
      return { usernameLength: true };
    }
    
    return null;
  }
  
  // URL validator
  static urlValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    
    if (!value) return null;
    
    try {
      new URL(value);
      return null;
    } catch {
      return { urlInvalid: true };
    }
  }
  
  // Salary validator
  static salaryValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    
    if (!value) return null;
    
    const salary = parseFloat(value);
    
    if (isNaN(salary)) {
      return { salaryInvalid: true };
    }
    
    if (salary < 0) {
      return { salaryNegative: true };
    }
    
    if (salary > 10000000) {
      return { salaryTooHigh: true };
    }
    
    return null;
  }
  
  // Confirm password validator
  static confirmPassword(passwordField: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.parent?.get(passwordField)?.value;
      const confirmPassword = control.value;
      
      if (!confirmPassword) return null;
      
      if (password !== confirmPassword) {
        return { passwordMismatch: true };
      }
      
      return null;
    };
  }
}

@Component({
  selector: 'app-practice-app',
  templateUrl: './practice-app.component.html',
  styleUrls: ['./practice-app.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class PracticeAppComponent implements OnInit, OnDestroy {
  
  // Form Groups
  gridForm!: FormGroup;
  combinedForm!: FormGroup;
  createBookingForm!: FormGroup;
  updateBookingForm!: FormGroup;
  authForm!: FormGroup;
  
  // State variables
  isLoading = false;
  submitMessage = '';
  selectedTab = 'using-the-grid';
  completedModules: Set<string> = new Set();
  
  // Track module completion
  private moduleInteractions: { [key: string]: number } = {};
  
  // Modal & Overlay states
  showDialog = false;
  showWindow = false;
  showPopover = false;
  showToastr = false;
  showTooltip = false;
  toastrMessage = '';
  toastrType = 'success'; // success, error, warning, info
  
  // Table states
  tableData: any[] = [];
  editingRowId: number | null = null;
  showAddRow = false;
  newRowData: any = {};
  editRowData: any = {};
  
  // Options for dropdowns
  countries = ['USA', 'Canada', 'India', 'UK', 'Australia', 'Germany', 'France', 'Japan', 'Brazil', 'Mexico'];

  // Quiz Properties
  quizStarted = false;
  quizCompleted = false;
  reviewMode = false;
  currentQuestionIndex = 0;
  selectedAnswer = '';
  showAnswer = false;
  correctAnswers = 0;
  userAnswers: string[] = [];
  quizQuestions: any[] = [];
  cities = ['New York', 'Toronto', 'Mumbai', 'London', 'Sydney', 'Berlin', 'Paris', 'Tokyo', 'São Paulo', 'Mexico City'];
  jobRoles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'QA Engineer', 'Test Automation Engineer', 'Product Manager', 'UI/UX Designer', 'Data Scientist'];
  experienceLevels = ['0-1 years', '1-2 years', '2-5 years', '5-10 years', '10+ years'];
  skillsList = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Spring Boot', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Playwright', 'Selenium', 'Jest', 'Cypress'];
  
  // Link interaction properties
  isLinkToggled = false;
  linkClickCounter = 0;
  
  // UI Elements properties
  sliderValues = {
    volume: 50,
    brightness: 75,
    price: 250
  };
  
  progressValues = {
    download: 0,
    upload: 0
  };
  
  accordionItems = [
    {
      title: 'What is Playwright?',
      content: 'Playwright is a modern web automation framework for testing web applications across different browsers.',
      isOpen: false
    },
    {
      title: 'Browser Support',
      content: 'Playwright supports Chrome, Firefox, Safari, and Edge browsers with full automation capabilities.',
      isOpen: false
    },
    {
      title: 'Best Practices',
      content: 'Use proper locators, implement page object models, and write maintainable test code.',
      isOpen: false
    }
  ];
  
  draggableItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  droppedItems: string[] = [];
  
  carouselImages = [
    { url: '/assets/images/automation-testing.gif', alt: 'Automation Testing', caption: 'Automation Testing' },
    { url: '/assets/images/security-testing.gif', alt: 'Security Testing', caption: 'Security Testing' },
    { url: '/assets/images/java-development.jpg', alt: 'Java Development', caption: 'Java Development' },
    { url: '/assets/images/online-training.jpg', alt: 'Online Training', caption: 'Online Training' }
  ];
  currentImageIndex = 0;
  
  selectedColor = '#3498db';
  selectedDateTime = '';
  selectedWeek = '';
  
  stars = [1, 2, 3, 4, 5];
  currentRating = 0;
  hoverRating = 0;
  
  loadingStates = {
    button: false,
    skeleton: false
  };
  
  // API Practice properties
  apiResults: any = null;
  authToken: string = '';
  selectedBookingId: number | null = null;
  filterFirstname: string = '';
  filterLastname: string = '';
  filterCheckin: string = '';
  filterCheckout: string = '';
  patchBookingId: number | null = null;
  patchField: string = '';
  patchValue: string = '';
  deleteBookingId: number | null = null;
  
  // Swagger UI state management
  expandedSections: { [key: string]: boolean } = {
    'auth': true,
    'bookings': true,
    'health': false
  };
  
  expandedEndpoints: { [key: string]: boolean } = {};
  
  apiServerStatus = false;
  bookingIdToGet: number | null = null;
  
  filterParams = {
    firstname: '',
    lastname: '',
    checkin: '',
    checkout: ''
  };
  
  lastApiResponse: any = null;
  
  // File operation properties
  selectedFiles: {
    single: File | null;
    multiple: File[];
  } = {
    single: null,
    multiple: []
  };
  
  isDragOver = false;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.initializeForms();
  }  ngOnInit() {
    // Add class to body to hide header/footer for standalone mode
    document.body.classList.add('practice-app-active');
    
    // Initialize any additional setup
    this.setActiveTab('using-the-grid');
    this.initializeTableData();
    this.checkApiHealth();
    this.initializeQuiz();
  }

  ngOnDestroy() {
    // Remove class from body when component is destroyed
    document.body.classList.remove('practice-app-active');
  }

  // Form Error Handling Methods
  getFieldError(formName: 'gridForm' | 'combinedForm', fieldName: string): string {
    const form = this[formName];
    const field = form.get(fieldName);
    
    if (!field?.errors || !field.touched) return '';
    
    const errors = field.errors;
    
    // Generic error messages
    if (errors['required']) return `${this.getFieldDisplayName(fieldName)} is required.`;
    if (errors['email']) return 'Please enter a valid email address.';
    if (errors['min']) return `Value must be at least ${errors['min'].min}.`;
    if (errors['max']) return `Value must be at most ${errors['max'].max}.`;
    if (errors['minlength']) return `Must be at least ${errors['minlength'].requiredLength} characters.`;
    if (errors['maxlength']) return `Must be no more than ${errors['maxlength'].requiredLength} characters.`;
    if (errors['requiredTrue']) return 'You must accept the terms and conditions.';
    
    // Custom validator error messages
    if (errors['nameInvalid']) return 'Name can only contain letters, spaces, hyphens, and apostrophes.';
    if (errors['nameLength']) return 'Name must be at least 2 characters long.';
    if (errors['phoneInvalid']) return 'Phone number can only contain digits, spaces, hyphens, parentheses, and plus sign.';
    if (errors['phoneLength']) return 'Phone number must be between 10 and 15 digits.';
    if (errors['ageInvalid']) return 'Age must be a valid number.';
    if (errors['ageRange']) return 'Age must be between 18 and 100.';
    if (errors['zipInvalid']) return 'ZIP code must be in format 12345 or 12345-6789.';

    return this.continueGetFieldError(errors);

    return 'Invalid input.';
  }

  // Helper methods to avoid ICU message confusion in templates
  getCombinedFormError(fieldName: string): string {
    return this.getFieldError('combinedForm', fieldName);
  }

  getGridFormError(fieldName: string): string {
    return this.getFieldError('gridForm', fieldName);
  }

  // Helper methods for template display
  getFormValidStatus(): string {
    return this.combinedForm.valid ? 'Enabled' : 'Disabled';
  }

  getLinkToggleStatus(): string {
    return this.isLinkToggled ? 'ON' : 'OFF';
  }

  // API Status helpers
  getApiServerStatus(): string {
    return this.apiServerStatus ? 'Server Online' : 'Checking...';
  }

  // Section expansion helpers
  getAuthSectionIcon(): string {
    return this.expandedSections['auth'] ? '▼' : '▶';
  }

  getBookingsSectionIcon(): string {
    return this.expandedSections['bookings'] ? '▼' : '▶';
  }

  getHealthSectionIcon(): string {
    return this.expandedSections['health'] ? '▼' : '▶';
  }

  // Endpoint expansion helpers
  getAuthPostIcon(): string {
    return this.expandedEndpoints['auth-post'] ? '▲' : '▼';
  }

  getBookingPostIcon(): string {
    return this.expandedEndpoints['booking-post'] ? '▲' : '▼';
  }

  getBookingGetAllIcon(): string {
    return this.expandedEndpoints['booking-get-all'] ? '▲' : '▼';
  }

  getBookingGetIdIcon(): string {
    return this.expandedEndpoints['booking-get-id'] ? '▲' : '▼';
  }

  getBookingPutIcon(): string {
    return this.expandedEndpoints['booking-put'] ? '▲' : '▼';
  }

  getBookingPatchIcon(): string {
    return this.expandedEndpoints['booking-patch'] ? '▲' : '▼';
  }

  getBookingDeleteIcon(): string {
    return this.expandedEndpoints['booking-delete'] ? '▲' : '▼';
  }

  getPingIcon(): string {
    return this.expandedEndpoints['ping'] ? '▲' : '▼';
  }

  // Slider value helpers
  getVolumeValue(): string {
    return `${this.sliderValues.volume || 50}%`;
  }

  getBrightnessValue(): string {
    return `${this.sliderValues.brightness || 75}%`;
  }

  getPriceValue(): string {
    return `$${this.sliderValues.price || 250}`;
  }

  getDownloadProgress(): string {
    return `${this.progressValues.download}%`;
  }

  getUploadProgress(): string {
    return `${this.progressValues.upload}%`;
  }

  // Color and datetime helpers
  getSelectedColor(): string {
    return this.selectedColor || '#3498db';
  }

  getSelectedDateTime(): string {
    return this.selectedDateTime || 'Not selected';
  }

  getSelectedWeek(): string {
    return this.selectedWeek || 'Not selected';
  }

  // JSON Schema helpers to avoid template syntax conflicts
  getAuthRequestSchema(): string {
    return `{
  "username": "admin",
  "password": "password123"
}`;
  }

  getAuthResponseSchema(): string {
    return `{
  "token": "abc123def456"
}`;
  }

  getBookingRequestSchema(): string {
    return `{
  "firstname": "Jim",
  "lastname": "Brown", 
  "totalprice": 111,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2024-01-01",
    "checkout": "2024-01-02"
  },
  "additionalneeds": "Breakfast"
}`;
  }

  getBookingResponseSchema(): string {
    return `{
  "bookingid": 1,
  "booking": {
    "firstname": "Jim",
    "lastname": "Brown",
    "totalprice": 111,
    "depositpaid": true,
    "bookingdates": {
      "checkin": "2024-01-01", 
      "checkout": "2024-01-02"
    },
    "additionalneeds": "Breakfast"
  }
}`;
  }

  getBookingListResponse(): string {
    return `[
  {"bookingid": 1},
  {"bookingid": 2},
  {"bookingid": 3}
]`;
  }

  getBookingByIdPath(): string {
    return '/booking/{id}';
  }

  getDeleteBookingPath(): string {
    return '/booking/{id}';
  }

  getUpdateBookingPath(): string {
    return '/booking/{id}';
  }

  getAccordionIcon(isOpen: boolean): string {
    return isOpen ? '▼' : '▶';
  }

  getApiExamples(): any {
    return {
      postBooking: "await request.post('/booking', { data: bookingData })",
      responseValidation: "expect(response.status()).toBe(200)",
      jsonValidation: "const data = await response.json(); expect(data.bookingid).toBeDefined()",
      authentication: "await request.post('/auth', { data: { username, password } })",
      headers: "await request.get('/booking', { headers: { 'Authorization': token } })"
    };
  }

  getCarouselCaption(): string {
    return this.carouselImages[this.currentImageIndex]?.caption || '';
  }

  getSkeletonButtonText(): string {
    return this.loadingStates.skeleton ? 'Hide' : 'Show';
  }

  getPlaywrightExamples(): any {
    return {
      roleLocator: "page.getByRole('button', { name: 'Submit' })",
      waitForVisible: "await page.waitForSelector('.modal', { state: 'visible' })",
      waitForHidden: "await page.waitForSelector('.modal', { state: 'hidden' })"
    };
  }

  getApiTestDescriptions(): any {
    return {
      getBookingById: "Test GET /booking/{id} - retrieve specific booking by ID",
      putBookingById: "Test PUT /booking/{id} - update existing booking", 
      deleteBookingById: "Test DELETE /booking/{id} - delete booking"
    };
  }

  getBookingDetailsSchema(): string {
    return `{
  "firstname": "Jim",
  "lastname": "Brown",
  "totalprice": 111,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2024-01-01",
    "checkout": "2024-01-02"
  },
  "additionalneeds": "Breakfast"
}`;
  }

  getPopoverToggleText(): string {
    return this.showPopover ? 'Hide' : 'Show';
  }

  getApiResponseTiming(): string {
    return `⏱️ ${this.lastApiResponse.timing}ms`;
  }

  getApiResponseHeaders(): string {
    return JSON.stringify(this.lastApiResponse.headers, null, 2);
  }

  getApiResponseBody(): string {
    return JSON.stringify(this.lastApiResponse.body, null, 2);
  }

  private continueGetFieldError(errors: any): string {
    if (errors['usernameInvalid']) return 'Username can only contain letters, numbers, and underscores.';
    if (errors['usernameLength']) return 'Username must be between 3 and 20 characters.';
    if (errors['urlInvalid']) return 'Please enter a valid URL (e.g., https://example.com).';
    if (errors['salaryInvalid']) return 'Salary must be a valid number.';
    if (errors['salaryNegative']) return 'Salary cannot be negative.';
    if (errors['salaryTooHigh']) return 'Salary seems too high. Please check the value.';
    if (errors['passwordMismatch']) return 'Passwords do not match.';
    
    // Password strength errors
    if (errors['tooShort']) return 'Password must be at least 8 characters long.';
    if (errors['noUpperCase']) return 'Password must contain at least one uppercase letter.';
    if (errors['noLowerCase']) return 'Password must contain at least one lowercase letter.';
    if (errors['noNumbers']) return 'Password must contain at least one number.';
    if (errors['noSpecialChar']) return 'Password must contain at least one special character.';
    
    return 'Please enter a valid value.';
  }
  
  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone Number',
      dateOfBirth: 'Date of Birth',
      age: 'Age',
      country: 'Country',
      city: 'City',
      address: 'Address',
      zipCode: 'ZIP Code',
      jobRole: 'Job Role',
      company: 'Company',
      salary: 'Salary',
      username: 'Username',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      website: 'Website',
      linkedIn: 'LinkedIn Profile',
      skills: 'Skills',
      comments: 'Comments',
      communicationPref: 'Communication Preference',
      workMode: 'Work Mode',
      experience: 'Experience',
      terms: 'Terms and Conditions'
    };
    
    return fieldNames[fieldName] || fieldName;
  }
  
  isFieldInvalid(formName: 'gridForm' | 'combinedForm', fieldName: string): boolean {
    const form = this[formName];
    const field = form.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
  
  isFieldValid(formName: 'gridForm' | 'combinedForm', fieldName: string): boolean {
    const form = this[formName];
    const field = form.get(fieldName);
    return !!(field?.valid && field?.touched);
  }

  // Helper methods for progress tracker
  getTabIcon(tab: string): string {
    const icons: { [key: string]: string } = {
      'using-the-grid': '📊',
      'combined-forms': '📝',
      'modal-overlays': '🪟',
      'smart-table': '📋',
      'file-operations': '📁',
      'api-practice': '🔗',
      'ui-elements': '🎨',
      'playwright-quiz': '🧠'
    };
    return icons[tab] || '📄';
  }

  getTabName(tab: string): string {
    const names: { [key: string]: string } = {
      'using-the-grid': 'Grid Forms',
      'combined-forms': 'Form Practice',
      'modal-overlays': 'Modals',
      'smart-table': 'Smart Table',
      'file-operations': 'File Ops',
      'api-practice': 'API Testing',
      'ui-elements': 'UI Elements',
      'playwright-quiz': 'Quiz'
    };
    return names[tab] || tab;
  }
  
  private initializeTableData() {
    this.tableData = [
      { id: 1, firstName: 'Mark', lastName: 'Otto', username: '@mdo', email: 'mdo@gmail.com', age: 28 },
      { id: 2, firstName: 'Jacob', lastName: 'Thornton', username: '@fat', email: 'fat@yandex.ru', age: 45 },
      { id: 3, firstName: 'Larry', lastName: 'Bird', username: '@twitter', email: 'twitter@outlook.com', age: 18 },
      { id: 4, firstName: 'John', lastName: 'Snow', username: '@snow', email: 'snow@gmail.com', age: 20 },
      { id: 5, firstName: 'Jack', lastName: 'Sparrow', username: '@jack', email: 'jack@yandex.ru', age: 30 },
      { id: 6, firstName: 'Ann', lastName: 'Smith', username: '@ann', email: 'ann@gmail.com', age: 21 },
      { id: 7, firstName: 'Barbara', lastName: 'Black', username: '@barbara', email: 'barbara@yandex.ru', age: 43 },
      { id: 8, firstName: 'Sevan', lastName: 'Bagrat', username: '@sevan', email: 'sevan@outlook.com', age: 13 }
    ];
    
    this.resetNewRowData();
  }
  
  private resetNewRowData() {
    this.newRowData = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      age: ''
    };
  }
  
  private initializeForms() {
    // Grid Form with comprehensive validation
    this.gridForm = this.formBuilder.group({
      firstName: ['', [Validators.required, CustomValidators.nameValidator]],
      lastName: ['', [Validators.required, CustomValidators.nameValidator]],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      city: ['', Validators.required],
      jobRole: ['', Validators.required],
      experience: ['', Validators.required]
    });
    
    // Combined Form - includes all form elements with real-world validation
    this.combinedForm = this.formBuilder.group({
      // Personal Information (All Required)
      firstName: ['', [Validators.required, CustomValidators.nameValidator]],
      lastName: ['', [Validators.required, CustomValidators.nameValidator]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, CustomValidators.phoneNumber]],
      dateOfBirth: ['', [Validators.required]],
      age: ['', [CustomValidators.ageValidator]], // Optional but validated if provided
      
      // Address Information (Required)
      country: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(10)]],
      zipCode: ['', [Validators.required, CustomValidators.zipCodeValidator]],
      
      // Professional Information (Required)
      jobRole: ['', Validators.required],
      company: ['', [Validators.required, Validators.minLength(2)]],
      salary: ['', [Validators.required, CustomValidators.salaryValidator]],
      
      // Account Information (Required)
      username: ['', [Validators.required, CustomValidators.usernameValidator]],
      password: ['', [Validators.required, CustomValidators.passwordStrength]],
      confirmPassword: ['', [Validators.required, CustomValidators.confirmPassword('password')]],
      
      // Preferences (Optional)
      newsletter: [false],
      notifications: [false],
      terms: [false, Validators.requiredTrue], // Required to be true
      
      // Additional Fields (Optional but validated if provided)
      website: ['', CustomValidators.urlValidator],
      linkedIn: ['', CustomValidators.urlValidator],
      skills: ['', Validators.maxLength(500)],
      comments: ['', Validators.maxLength(1000)],
      
      // Radio Button Fields (Required)
      communicationPref: ['', Validators.required],
      workMode: ['', Validators.required]
    });

    // Add password confirmation validator that updates when password changes
    this.combinedForm.get('password')?.valueChanges.subscribe(() => {
      this.combinedForm.get('confirmPassword')?.updateValueAndValidity();
    });

    // API Practice Forms
    this.createBookingForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      totalprice: [100, [Validators.required, Validators.min(1)]],
      depositpaid: ['true', Validators.required],
      checkin: ['', Validators.required],
      checkout: ['', Validators.required],
      additionalneeds: ['']
    });

    this.updateBookingForm = this.formBuilder.group({
      bookingId: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      totalprice: [100, [Validators.required, Validators.min(1)]],
      depositpaid: ['true', Validators.required],
      checkin: ['', Validators.required],
      checkout: ['', Validators.required],
      additionalneeds: ['']
    });

    // Authentication Form
    this.authForm = this.formBuilder.group({
      username: ['admin', Validators.required],
      password: ['password123', Validators.required]
    });
  }
  
  setActiveTab(tabName: string) {
    this.selectedTab = tabName;
    
    // Track module interaction
    this.moduleInteractions[tabName] = (this.moduleInteractions[tabName] || 0) + 1;
    
    // Mark as completed after some interactions (simulating engagement)
    if (this.moduleInteractions[tabName] >= 3) {
      this.completedModules.add(tabName);
    }
  }

  // Practice-specific navigation methods
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.showToastrNotification('info', 'Scrolled to top of practice app');
  }

  scrollToSection(sectionId: string) {
    // For practice purposes, just switch to the form tab and show notification
    this.setActiveTab('combined-forms');
    this.showToastrNotification('info', `Navigated to ${sectionId} section`);
  }

  handleLinkClick(linkType: string) {
    this.showToastrNotification('info', `Clicked ${linkType} link - Practice mode`);
  }

  onGridFormSubmit() {
    if (this.gridForm.valid) {
      this.isLoading = true;
      this.submitMessage = '';
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.submitMessage = 'Grid form submitted successfully!';
        console.log('Grid Form Data:', this.gridForm.value);
      }, 2000);
    } else {
      this.submitMessage = 'Please fill all required fields correctly.';
    }
  }

  onCombinedFormSubmit() {
    if (this.combinedForm.valid) {
      // Check if passwords match
      const password = this.combinedForm.get('password')?.value;
      const confirmPassword = this.combinedForm.get('confirmPassword')?.value;
      
      if (password !== confirmPassword) {
        this.submitMessage = 'Passwords do not match!';
        return;
      }
      
      this.isLoading = true;
      this.submitMessage = '';
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.submitMessage = 'Combined form submitted successfully! All data validated and processed.';
        console.log('Combined Form Data:', this.combinedForm.value);
      }, 3000);
    } else {
      this.submitMessage = 'Please fill all required fields correctly.';
      this.markFormGroupTouched(this.combinedForm);
    }
  }
  
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
  
  // Utility methods for testing
  clearForm(formType: string) {
    switch(formType) {
      case 'grid':
        this.gridForm.reset();
        break;
      case 'combined':
        this.combinedForm.reset();
        break;
    }
    this.submitMessage = '';
  }
  
  fillSampleData(formType: string) {
    switch(formType) {
      case 'grid':
        this.gridForm.patchValue({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          country: 'USA',
          city: 'New York',
          jobRole: 'Software Engineer',
          experience: '2-5 years'
        });
        break;
      case 'combined':
        this.combinedForm.patchValue({
          firstName: 'Alex',
          lastName: 'Johnson',
          email: 'alex.johnson@example.com',
          phone: '+1-555-0123',
          dateOfBirth: '1990-01-15',
          country: 'USA',
          city: 'San Francisco',
          address: '123 Tech Street',
          zipCode: '94105',
          jobRole: 'Senior Software Engineer',
          company: 'Tech Corp',
          salary: '120000',
          username: 'alexj',
          password: 'securePass123',
          confirmPassword: 'securePass123',
          newsletter: true,
          notifications: false,
          terms: true,
          website: 'https://alexjohnson.dev',
          linkedIn: 'https://linkedin.com/in/alexjohnson',
          skills: 'JavaScript, TypeScript, Angular, React, Node.js',
          comments: 'Experienced full-stack developer looking for new opportunities.',
          communicationPref: 'email',
          workMode: 'hybrid'
        });
        break;
    }
  }
  
  // Modal & Overlay Methods
  openDialog() {
    this.showDialog = true;
  }
  
  closeDialog() {
    this.showDialog = false;
  }
  
  openWindow() {
    this.showWindow = true;
  }
  
  closeWindow() {
    this.showWindow = false;
  }
  
  togglePopover() {
    this.showPopover = !this.showPopover;
  }
  
  showToastrNotification(type: string, message: string) {
    this.toastrType = type;
    this.toastrMessage = message;
    this.showToastr = true;
    
    // Auto hide after 4 seconds
    setTimeout(() => {
      this.showToastr = false;
    }, 4000);
  }
  
  hideToastr() {
    this.showToastr = false;
  }
  
  toggleTooltip() {
    this.showTooltip = !this.showTooltip;
  }
  
  // Demo methods for different notification types
  showSuccessToastr() {
    this.showToastrNotification('success', 'Success! Operation completed successfully.');
  }
  
  showErrorToastr() {
    this.showToastrNotification('error', 'Error! Something went wrong.');
  }
  
  showWarningToastr() {
    this.showToastrNotification('warning', 'Warning! Please check your input.');
  }
  
  showInfoToastr() {
    this.showToastrNotification('info', 'Info: Here is some useful information.');
  }
  
  // Table Management Methods
  showAddRowForm() {
    this.showAddRow = true;
    this.resetNewRowData();
  }
  
  hideAddRowForm() {
    this.showAddRow = false;
    this.resetNewRowData();
  }
  
  addNewRow() {
    if (this.newRowData.firstName && this.newRowData.lastName && this.newRowData.email) {
      const newId = Math.max(...this.tableData.map(row => row.id)) + 1;
      const newRow = {
        id: newId,
        firstName: this.newRowData.firstName,
        lastName: this.newRowData.lastName,
        username: this.newRowData.username || `@${this.newRowData.firstName.toLowerCase()}`,
        email: this.newRowData.email,
        age: parseInt(this.newRowData.age) || 0
      };
      
      this.tableData.push(newRow);
      this.hideAddRowForm();
      this.showToastrNotification('success', 'New row added successfully!');
    } else {
      this.showToastrNotification('error', 'Please fill all required fields.');
    }
  }
  
  editRow(rowId: number) {
    this.editingRowId = rowId;
    const row = this.tableData.find(r => r.id === rowId);
    if (row) {
      this.editRowData = { ...row };
    }
  }
  
  saveRowEdit() {
    if (this.editingRowId && this.editRowData.firstName && this.editRowData.lastName && this.editRowData.email) {
      const rowIndex = this.tableData.findIndex(r => r.id === this.editingRowId);
      if (rowIndex !== -1) {
        this.tableData[rowIndex] = { ...this.editRowData };
        this.cancelRowEdit();
        this.showToastrNotification('success', 'Row updated successfully!');
      }
    } else {
      this.showToastrNotification('error', 'Please fill all required fields.');
    }
  }
  
  cancelRowEdit() {
    this.editingRowId = null;
    this.editRowData = {};
  }
  
  deleteRow(rowId: number) {
    const rowIndex = this.tableData.findIndex(r => r.id === rowId);
    if (rowIndex !== -1) {
      this.tableData.splice(rowIndex, 1);
      this.showToastrNotification('success', 'Row deleted successfully!');
    }
  }
  
  isEditing(rowId: number): boolean {
    return this.editingRowId === rowId;
  }
  
  // Utility method to generate sample table data
  generateSampleData() {
    const sampleData = [
      { firstName: 'Alice', lastName: 'Johnson', username: '@alice', email: 'alice@example.com', age: 25 },
      { firstName: 'Bob', lastName: 'Williams', username: '@bob', email: 'bob@example.com', age: 32 },
      { firstName: 'Charlie', lastName: 'Brown', username: '@charlie', email: 'charlie@example.com', age: 28 }
    ];
    
    sampleData.forEach(data => {
      const newId = Math.max(...this.tableData.map(row => row.id)) + 1;
      this.tableData.push({ id: newId, ...data });
    });
    
    this.showToastrNotification('info', 'Sample data added to table!');
  }
  
  clearAllTableData() {
    this.tableData = [];
    this.showToastrNotification('warning', 'All table data cleared!');
  }
  
  resetTableData() {
    this.initializeTableData();
    this.showToastrNotification('info', 'Table data reset to default!');
  }
  
  trackByRowId(index: number, row: any): number {
    return row.id;
  }

  // Link interaction methods
  toggleLink(event: Event) {
    event.preventDefault();
    this.isLinkToggled = !this.isLinkToggled;
    this.showToastrNotification('info', `Link toggled ${this.isLinkToggled ? 'ON' : 'OFF'}`);
  }
  
  incrementCounter(event: Event) {
    event.preventDefault();
    this.linkClickCounter++;
    this.showToastrNotification('success', `Counter increased to ${this.linkClickCounter}`);
  }

  // File operation methods
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }
  
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }
  
  onFileDrop(event: DragEvent, type: 'single' | 'multiple') {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      if (type === 'single') {
        this.selectedFiles.single = files[0];
        this.showToastrNotification('success', `File "${files[0].name}" dropped successfully!`);
      } else {
        for (let i = 0; i < files.length; i++) {
          this.selectedFiles.multiple.push(files[i]);
        }
        this.showToastrNotification('success', `${files.length} files dropped successfully!`);
      }
    }
  }
  
  onFileSelect(event: any, type: 'single' | 'multiple') {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (type === 'single') {
        this.selectedFiles.single = files[0];
        this.showToastrNotification('success', `File "${files[0].name}" selected!`);
      } else {
        for (let i = 0; i < files.length; i++) {
          this.selectedFiles.multiple.push(files[i]);
        }
        this.showToastrNotification('success', `${files.length} files selected!`);
      }
    }
    // Reset input
    event.target.value = '';
  }
  
  removeFile(type: 'single' | 'multiple', index?: number) {
    if (type === 'single') {
      this.selectedFiles.single = null;
      this.showToastrNotification('info', 'File removed!');
    } else if (index !== undefined) {
      const fileName = this.selectedFiles.multiple[index].name;
      this.selectedFiles.multiple.splice(index, 1);
      this.showToastrNotification('info', `File "${fileName}" removed!`);
    }
  }
  
  clearAllFiles() {
    const count = this.selectedFiles.multiple.length;
    this.selectedFiles.multiple = [];
    this.showToastrNotification('info', `${count} files cleared!`);
  }
  
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  downloadSampleFile(type: string) {
    let content = '';
    let filename = '';
    let mimeType = '';
    
    switch (type) {
      case 'pdf':
        content = 'Sample PDF content for testing';
        filename = 'sample-document.pdf';
        mimeType = 'application/pdf';
        break;
      case 'csv':
        content = 'Name,Age,City,Role\nJohn Doe,30,New York,Developer\nJane Smith,25,San Francisco,Designer\nMike Johnson,35,Chicago,Manager';
        filename = 'sample-data.csv';
        mimeType = 'text/csv';
        break;
      case 'txt':
        content = 'Sample Text File\n\nThis is a sample text file for testing download functionality.\n\nGenerated on: ' + new Date().toISOString();
        filename = 'sample-notes.txt';
        mimeType = 'text/plain';
        break;
      case 'json':
        content = JSON.stringify({
          "sampleData": {
            "users": [
              {"id": 1, "name": "John Doe", "email": "john@example.com"},
              {"id": 2, "name": "Jane Smith", "email": "jane@example.com"}
            ],
            "metadata": {
              "generated": new Date().toISOString(),
              "version": "1.0",
              "purpose": "Testing automation download"
            }
          }
        }, null, 2);
        filename = 'sample-data.json';
        mimeType = 'application/json';
        break;
    }
    
    // Create and trigger download
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
    
    this.showToastrNotification('success', `${filename} downloaded!`);
  }

  // UI Elements drag and drop methods
  onDragStart(event: DragEvent, item: string) {
    event.dataTransfer?.setData('text/plain', item);
  }

  onDragEnd(event: DragEvent) {
    // Cleanup if needed
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const item = event.dataTransfer?.getData('text/plain');
    if (item && !this.droppedItems.includes(item)) {
      this.droppedItems.push(item);
    }
  }

  getAverageAge(): number {
    if (this.tableData.length === 0) return 0;
    const sum = this.tableData.reduce((total, row) => total + row.age, 0);
    return Math.round((sum / this.tableData.length) * 10) / 10;
  }

  // API Practice Methods

  // Swagger UI state management methods
  toggleSection(sectionKey: string) {
    this.expandedSections[sectionKey] = !this.expandedSections[sectionKey];
  }

  toggleEndpoint(endpointKey: string) {
    this.expandedEndpoints[endpointKey] = !this.expandedEndpoints[endpointKey];
  }

  checkApiHealth() {
    // Simulate API health check
    setTimeout(() => {
      this.apiServerStatus = true;
    }, 1000);
  }

  // Updated API methods with real response simulation
  executeAuth() {
    if (this.authForm.invalid) {
      this.showToastrNotification('error', 'Please fill all required fields');
      return;
    }

    const startTime = Date.now();
    const username = this.authForm.value.username;
    const password = this.authForm.value.password;
    
    // Input validation checks
    if (!username || username.trim().length === 0) {
      this.lastApiResponse = {
        method: 'POST',
        url: 'https://restful-booker.herokuapp.com/auth',
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Username is required and cannot be empty',
          details: 'The username field must contain a valid string value'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Username is required');
      return;
    }
    
    if (!password || password.trim().length === 0) {
      this.lastApiResponse = {
        method: 'POST',
        url: 'https://restful-booker.herokuapp.com/auth',
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Password is required and cannot be empty',
          details: 'The password field must contain a valid string value'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Password is required');
      return;
    }
    
    if (username.length < 3) {
      this.lastApiResponse = {
        method: 'POST',
        url: 'https://restful-booker.herokuapp.com/auth',
        status: 400,
        timing: 75,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Username must be at least 3 characters long',
          details: 'Username validation failed: minimum length requirement not met'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Username too short');
      return;
    }
    
    if (password.length < 6) {
      this.lastApiResponse = {
        method: 'POST',
        url: 'https://restful-booker.herokuapp.com/auth',
        status: 400,
        timing: 75,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Password must be at least 6 characters long',
          details: 'Password validation failed: minimum length requirement not met'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Password too short');
      return;
    }

    this.showToastrNotification('info', 'Authenticating...');
    
    // Simulate real API call
    setTimeout(() => {
      const endTime = Date.now();
      
      // Successful authentication for admin/password123
      if (username === 'admin' && password === 'password123') {
        this.authToken = 'abc123def456ghi789';
        
        this.lastApiResponse = {
          method: 'POST',
          url: 'https://restful-booker.herokuapp.com/auth',
          status: 200,
          timing: endTime - startTime,
          headers: {
            'Content-Type': 'application/json',
            'Server': 'Cowboy'
          },
          body: {
            token: this.authToken
          }
        };
        
        this.showToastrNotification('success', 'Authentication successful! Token generated.');
      } else {
        // Invalid credentials - 401 Unauthorized
        this.lastApiResponse = {
          method: 'POST',
          url: 'https://restful-booker.herokuapp.com/auth',
          status: 401,
          timing: endTime - startTime,
          headers: {
            'Content-Type': 'application/json',
            'Server': 'Cowboy'
          },
          body: {
            error: 'Unauthorized',
            message: 'Invalid username or password',
            details: 'Authentication failed: credentials do not match any registered user'
          }
        };
        this.showToastrNotification('error', 'Authentication failed: Invalid credentials');
      }
    }, 1200);
  }

  executeCreateBooking() {
    if (this.createBookingForm.invalid) {
      this.showToastrNotification('error', 'Please fill all required fields');
      return;
    }

    const startTime = Date.now();
    const formData = this.createBookingForm.value;
    
    // Comprehensive validation checks
    if (!formData.firstname || formData.firstname.trim().length === 0) {
      this.lastApiResponse = {
        method: 'POST',
        url: 'https://restful-booker.herokuapp.com/booking',
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'First name is required and cannot be empty',
          field: 'firstname'
        }
      };
      this.showToastrNotification('error', 'Validation Error: First name is required');
      return;
    }
    
    if (!formData.lastname || formData.lastname.trim().length === 0) {
      this.lastApiResponse = {
        method: 'POST',
        url: 'https://restful-booker.herokuapp.com/booking',
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Last name is required and cannot be empty',
          field: 'lastname'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Last name is required');
      return;
    }
    
    if (!formData.totalprice || formData.totalprice <= 0) {
      this.lastApiResponse = {
        method: 'POST',
        url: 'https://restful-booker.herokuapp.com/booking',
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Total price must be a positive number greater than 0',
          field: 'totalprice'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Invalid total price');
      return;
    }
    
    if (formData.totalprice > 10000) {
      this.lastApiResponse = {
        method: 'POST',
        url: 'https://restful-booker.herokuapp.com/booking',
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Total price cannot exceed $10,000',
          field: 'totalprice'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Price exceeds maximum limit');
      return;
    }
    
    if (!formData.checkin || !formData.checkout) {
      this.lastApiResponse = {
        method: 'POST',
        url: 'https://restful-booker.herokuapp.com/booking',
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Both check-in and check-out dates are required',
          field: 'bookingdates'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Booking dates are required');
      return;
    }
    
    const checkinDate = new Date(formData.checkin);
    const checkoutDate = new Date(formData.checkout);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkinDate < today) {
      this.lastApiResponse = {
        method: 'POST',
        url: 'https://restful-booker.herokuapp.com/booking',
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Check-in date cannot be in the past',
          field: 'checkin'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Invalid check-in date');
      return;
    }
    
    if (checkoutDate <= checkinDate) {
      this.lastApiResponse = {
        method: 'POST',
        url: 'https://restful-booker.herokuapp.com/booking',
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Check-out date must be after check-in date',
          field: 'checkout'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Invalid check-out date');
      return;
    }
    
    const daysDiff = Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 3600 * 24));
    if (daysDiff > 365) {
      this.lastApiResponse = {
        method: 'POST',
        url: 'https://restful-booker.herokuapp.com/booking',
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Booking duration cannot exceed 365 days',
          field: 'bookingdates'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Booking duration too long');
      return;
    }

    this.showToastrNotification('info', 'Creating booking...');
    
    const bookingData = {
      ...formData,
      depositpaid: formData.depositpaid === 'true',
      bookingdates: {
        checkin: formData.checkin,
        checkout: formData.checkout
      }
    };
    
    delete bookingData.checkin;
    delete bookingData.checkout;

    setTimeout(() => {
      const endTime = Date.now();
      const bookingId = Math.floor(Math.random() * 1000) + 1;
      
      this.lastApiResponse = {
        method: 'POST',
        url: 'https://restful-booker.herokuapp.com/booking',
        status: 200,
        timing: endTime - startTime,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          bookingid: bookingId,
          booking: bookingData
        }
      };
      
      this.showToastrNotification('success', `Booking created successfully with ID: ${bookingId}`);
    }, 1500);
  }

  executeGetAllBookings() {
    const startTime = Date.now();
    this.showToastrNotification('info', 'Fetching bookings...');
    
    setTimeout(() => {
      const endTime = Date.now();
      const mockBookings = [
        { bookingid: 1 },
        { bookingid: 2 },
        { bookingid: 3 },
        { bookingid: 4 },
        { bookingid: 5 },
        { bookingid: 10 },
        { bookingid: 15 }
      ];
      
      // Apply filters
      let filteredBookings = mockBookings;
      if (this.filterParams.firstname || this.filterParams.lastname) {
        filteredBookings = mockBookings.slice(0, 3);
      }
      
      this.lastApiResponse = {
        method: 'GET',
        url: `https://restful-booker.herokuapp.com/booking${this.buildQueryString()}`,
        status: 200,
        timing: endTime - startTime,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: filteredBookings
      };
      
      this.showToastrNotification('success', `Found ${filteredBookings.length} bookings`);
    }, 800);
  }

  executeGetBookingById() {
    if (!this.bookingIdToGet) {
      this.lastApiResponse = {
        method: 'GET',
        url: 'https://restful-booker.herokuapp.com/booking/',
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Booking ID is required',
          details: 'Please provide a valid booking ID in the URL path'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Booking ID is required');
      return;
    }

    // Validate booking ID format and range
    if (this.bookingIdToGet <= 0) {
      this.lastApiResponse = {
        method: 'GET',
        url: `https://restful-booker.herokuapp.com/booking/${this.bookingIdToGet}`,
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Booking ID must be a positive integer',
          details: 'Invalid booking ID format provided'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Invalid booking ID');
      return;
    }

    if (this.bookingIdToGet > 99999) {
      this.lastApiResponse = {
        method: 'GET',
        url: `https://restful-booker.herokuapp.com/booking/${this.bookingIdToGet}`,
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Booking ID exceeds maximum value',
          details: 'Booking ID must be less than 100000'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Booking ID too large');
      return;
    }

    const startTime = Date.now();
    this.showToastrNotification('info', `Fetching booking ${this.bookingIdToGet}...`);
    
    setTimeout(() => {
      const endTime = Date.now();
      
      // Simulate 404 for specific IDs (999, 777, 000)
      if (this.bookingIdToGet === 999 || this.bookingIdToGet === 777 || this.bookingIdToGet === 0) {
        this.lastApiResponse = {
          method: 'GET',
          url: `https://restful-booker.herokuapp.com/booking/${this.bookingIdToGet}`,
          status: 404,
          timing: endTime - startTime,
          headers: {
            'Content-Type': 'application/json',
            'Server': 'Cowboy'
          },
          body: {
            error: 'Not Found',
            message: `Booking with ID ${this.bookingIdToGet} does not exist`,
            details: 'The specified booking could not be found in the system'
          }
        };
        this.showToastrNotification('error', 'Booking not found');
      } else if (this.bookingIdToGet === 500) {
        // Simulate server error for ID 500
        this.lastApiResponse = {
          method: 'GET',
          url: `https://restful-booker.herokuapp.com/booking/${this.bookingIdToGet}`,
          status: 500,
          timing: endTime - startTime,
          headers: {
            'Content-Type': 'application/json',
            'Server': 'Cowboy'
          },
          body: {
            error: 'Internal Server Error',
            message: 'An unexpected error occurred while processing your request',
            details: 'Database connection timeout'
          }
        };
        this.showToastrNotification('error', 'Server error occurred');
      } else {
        // Successful response
        this.lastApiResponse = {
          method: 'GET',
          url: `https://restful-booker.herokuapp.com/booking/${this.bookingIdToGet}`,
          status: 200,
          timing: endTime - startTime,
          headers: {
            'Content-Type': 'application/json',
            'Server': 'Cowboy'
          },
          body: {
            firstname: 'Jim',
            lastname: 'Brown',
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
              checkin: '2024-01-01',
              checkout: '2024-01-02'
            },
            additionalneeds: 'Breakfast'
          }
        };
        this.showToastrNotification('success', 'Booking details retrieved successfully');
      }
    }, 600);
  }

  executeUpdateBooking() {
    if (this.updateBookingForm.invalid) {
      this.showToastrNotification('error', 'Please fill all required fields');
      return;
    }

    const startTime = Date.now();
    const formData = this.updateBookingForm.value;
    
    // Authentication check first
    if (!this.authToken) {
      this.lastApiResponse = {
        method: 'PUT',
        url: `https://restful-booker.herokuapp.com/booking/${formData.bookingId}`,
        status: 403,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Forbidden',
          message: 'Authentication required',
          details: 'You must provide a valid authentication token to update bookings'
        }
      };
      this.showToastrNotification('error', 'Authentication required. Please authenticate first.');
      return;
    }

    // Validate booking ID
    if (!formData.bookingId || formData.bookingId <= 0) {
      this.lastApiResponse = {
        method: 'PUT',
        url: `https://restful-booker.herokuapp.com/booking/${formData.bookingId}`,
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Valid booking ID is required',
          field: 'bookingId'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Valid booking ID required');
      return;
    }

    // Validate first name
    if (!formData.firstname || formData.firstname.trim().length === 0) {
      this.lastApiResponse = {
        method: 'PUT',
        url: `https://restful-booker.herokuapp.com/booking/${formData.bookingId}`,
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'First name is required and cannot be empty',
          field: 'firstname'
        }
      };
      this.showToastrNotification('error', 'Validation Error: First name is required');
      return;
    }

    // Validate last name
    if (!formData.lastname || formData.lastname.trim().length === 0) {
      this.lastApiResponse = {
        method: 'PUT',
        url: `https://restful-booker.herokuapp.com/booking/${formData.bookingId}`,
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Last name is required and cannot be empty',
          field: 'lastname'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Last name is required');
      return;
    }

    // Validate total price
    if (!formData.totalprice || formData.totalprice <= 0) {
      this.lastApiResponse = {
        method: 'PUT',
        url: `https://restful-booker.herokuapp.com/booking/${formData.bookingId}`,
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Total price must be a positive number greater than 0',
          field: 'totalprice'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Invalid total price');
      return;
    }

    // Validate booking dates
    if (!formData.checkin || !formData.checkout) {
      this.lastApiResponse = {
        method: 'PUT',
        url: `https://restful-booker.herokuapp.com/booking/${formData.bookingId}`,
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Both check-in and check-out dates are required',
          field: 'bookingdates'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Booking dates are required');
      return;
    }

    const checkinDate = new Date(formData.checkin);
    const checkoutDate = new Date(formData.checkout);
    
    if (checkoutDate <= checkinDate) {
      this.lastApiResponse = {
        method: 'PUT',
        url: `https://restful-booker.herokuapp.com/booking/${formData.bookingId}`,
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Check-out date must be after check-in date',
          field: 'checkout'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Invalid check-out date');
      return;
    }

    this.showToastrNotification('info', 'Updating booking...');
    
    setTimeout(() => {
      const endTime = Date.now();
      
      // Simulate booking not found for ID 999
      if (formData.bookingId === 999) {
        this.lastApiResponse = {
          method: 'PUT',
          url: `https://restful-booker.herokuapp.com/booking/${formData.bookingId}`,
          status: 404,
          timing: endTime - startTime,
          headers: {
            'Content-Type': 'application/json',
            'Server': 'Cowboy'
          },
          body: {
            error: 'Not Found',
            message: `Booking with ID ${formData.bookingId} does not exist`,
            details: 'Cannot update a booking that does not exist'
          }
        };
        this.showToastrNotification('error', 'Booking not found');
        return;
      }

      // Successful update
      const updatedBooking = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        totalprice: formData.totalprice,
        depositpaid: formData.depositpaid === 'true',
        bookingdates: {
          checkin: formData.checkin,
          checkout: formData.checkout
        },
        additionalneeds: formData.additionalneeds
      };
      
      this.lastApiResponse = {
        method: 'PUT',
        url: `https://restful-booker.herokuapp.com/booking/${formData.bookingId}`,
        status: 200,
        timing: endTime - startTime,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: updatedBooking
      };
      this.showToastrNotification('success', 'Booking updated successfully');
    }, 1000);
  }

  executePatchBooking() {
    // Validate required fields
    if (!this.patchBookingId) {
      this.lastApiResponse = {
        method: 'PATCH',
        url: 'https://restful-booker.herokuapp.com/booking/',
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Booking ID is required for partial update',
          field: 'bookingId'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Booking ID is required');
      return;
    }

    if (!this.patchField) {
      this.lastApiResponse = {
        method: 'PATCH',
        url: `https://restful-booker.herokuapp.com/booking/${this.patchBookingId}`,
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Field name is required for partial update',
          field: 'fieldName'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Field name is required');
      return;
    }

    if (!this.patchValue || this.patchValue.trim().length === 0) {
      this.lastApiResponse = {
        method: 'PATCH',
        url: `https://restful-booker.herokuapp.com/booking/${this.patchBookingId}`,
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Field value is required and cannot be empty',
          field: 'fieldValue'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Field value is required');
      return;
    }

    // Validate booking ID format
    if (this.patchBookingId <= 0) {
      this.lastApiResponse = {
        method: 'PATCH',
        url: `https://restful-booker.herokuapp.com/booking/${this.patchBookingId}`,
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Booking ID must be a positive integer',
          field: 'bookingId'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Invalid booking ID format');
      return;
    }

    // Validate field name
    const validFields = ['firstname', 'lastname', 'totalprice', 'depositpaid', 'additionalneeds'];
    if (!validFields.includes(this.patchField)) {
      this.lastApiResponse = {
        method: 'PATCH',
        url: `https://restful-booker.herokuapp.com/booking/${this.patchBookingId}`,
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: `Invalid field name. Allowed fields: ${validFields.join(', ')}`,
          field: 'fieldName'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Invalid field name');
      return;
    }

    // Field-specific validations
    if (this.patchField === 'totalprice') {
      const price = parseFloat(this.patchValue);
      if (isNaN(price) || price <= 0) {
        this.lastApiResponse = {
          method: 'PATCH',
          url: `https://restful-booker.herokuapp.com/booking/${this.patchBookingId}`,
          status: 400,
          timing: 50,
          headers: {
            'Content-Type': 'application/json',
            'Server': 'Cowboy'
          },
          body: {
            error: 'Bad Request',
            message: 'Total price must be a positive number greater than 0',
            field: 'totalprice'
          }
        };
        this.showToastrNotification('error', 'Validation Error: Invalid price value');
        return;
      }
    }

    if (this.patchField === 'depositpaid') {
      if (!['true', 'false'].includes(this.patchValue.toLowerCase())) {
        this.lastApiResponse = {
          method: 'PATCH',
          url: `https://restful-booker.herokuapp.com/booking/${this.patchBookingId}`,
          status: 400,
          timing: 50,
          headers: {
            'Content-Type': 'application/json',
            'Server': 'Cowboy'
          },
          body: {
            error: 'Bad Request',
            message: 'Deposit paid value must be "true" or "false"',
            field: 'depositpaid'
          }
        };
        this.showToastrNotification('error', 'Validation Error: Invalid deposit paid value');
        return;
      }
    }

    // Authentication check
    if (!this.authToken) {
      this.lastApiResponse = {
        method: 'PATCH',
        url: `https://restful-booker.herokuapp.com/booking/${this.patchBookingId}`,
        status: 403,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Forbidden',
          message: 'Authentication required',
          details: 'You must provide a valid authentication token to update bookings'
        }
      };
      this.showToastrNotification('error', 'Authentication required. Please authenticate first.');
      return;
    }

    const startTime = Date.now();
    this.showToastrNotification('info', 'Updating booking field...');
    
    setTimeout(() => {
      const endTime = Date.now();
      
      // Simulate booking not found for ID 999
      if (this.patchBookingId === 999) {
        this.lastApiResponse = {
          method: 'PATCH',
          url: `https://restful-booker.herokuapp.com/booking/${this.patchBookingId}`,
          status: 404,
          timing: endTime - startTime,
          headers: {
            'Content-Type': 'application/json',
            'Server': 'Cowboy'
          },
          body: {
            error: 'Not Found',
            message: `Booking with ID ${this.patchBookingId} does not exist`,
            details: 'Cannot update a booking that does not exist'
          }
        };
        this.showToastrNotification('error', 'Booking not found');
        return;
      }

      // Successful partial update
      const patchData: any = {};
      patchData[this.patchField] = this.patchValue;
      
      this.lastApiResponse = {
        method: 'PATCH',
        url: `https://restful-booker.herokuapp.com/booking/${this.patchBookingId}`,
        status: 200,
        timing: endTime - startTime,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          firstname: 'Jim',
          lastname: 'Brown',
          totalprice: 111,
          depositpaid: true,
          bookingdates: {
            checkin: '2024-01-01',
            checkout: '2024-01-02'
          },
          additionalneeds: 'Breakfast',
          ...patchData
        }
      };
      this.showToastrNotification('success', `Updated ${this.patchField} successfully`);
    }, 800);
  }

  executeDeleteBooking() {
    if (!this.deleteBookingId) {
      this.lastApiResponse = {
        method: 'DELETE',
        url: 'https://restful-booker.herokuapp.com/booking/',
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Booking ID is required for deletion',
          details: 'Please provide a valid booking ID in the URL path'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Booking ID is required');
      return;
    }

    // Validate booking ID format
    if (this.deleteBookingId <= 0) {
      this.lastApiResponse = {
        method: 'DELETE',
        url: `https://restful-booker.herokuapp.com/booking/${this.deleteBookingId}`,
        status: 400,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Bad Request',
          message: 'Booking ID must be a positive integer',
          details: 'Invalid booking ID format provided'
        }
      };
      this.showToastrNotification('error', 'Validation Error: Invalid booking ID format');
      return;
    }

    // Authentication check
    if (!this.authToken) {
      this.lastApiResponse = {
        method: 'DELETE',
        url: `https://restful-booker.herokuapp.com/booking/${this.deleteBookingId}`,
        status: 403,
        timing: 50,
        headers: {
          'Content-Type': 'application/json',
          'Server': 'Cowboy'
        },
        body: {
          error: 'Forbidden',
          message: 'Authentication required',
          details: 'You must provide a valid authentication token to delete bookings'
        }
      };
      this.showToastrNotification('error', 'Authentication required. Please authenticate first.');
      return;
    }

    const startTime = Date.now();
    this.showToastrNotification('info', 'Deleting booking...');

    setTimeout(() => {
      const endTime = Date.now();
      
      // Simulate booking not found for ID 999
      if (this.deleteBookingId === 999) {
        this.lastApiResponse = {
          method: 'DELETE',
          url: `https://restful-booker.herokuapp.com/booking/${this.deleteBookingId}`,
          status: 404,
          timing: endTime - startTime,
          headers: {
            'Content-Type': 'application/json',
            'Server': 'Cowboy'
          },
          body: {
            error: 'Not Found',
            message: `Booking with ID ${this.deleteBookingId} does not exist`,
            details: 'Cannot delete a booking that does not exist'
          }
        };
        this.showToastrNotification('error', 'Booking not found');
        return;
      }

      // Simulate conflict for ID 777 (already deleted)
      if (this.deleteBookingId === 777) {
        this.lastApiResponse = {
          method: 'DELETE',
          url: `https://restful-booker.herokuapp.com/booking/${this.deleteBookingId}`,
          status: 409,
          timing: endTime - startTime,
          headers: {
            'Content-Type': 'application/json',
            'Server': 'Cowboy'
          },
          body: {
            error: 'Conflict',
            message: 'Booking has already been deleted',
            details: 'Cannot delete a booking that is already marked as deleted'
          }
        };
        this.showToastrNotification('error', 'Booking already deleted');
        return;
      }

      // Successful deletion
      this.lastApiResponse = {
        method: 'DELETE',
        url: `https://restful-booker.herokuapp.com/booking/${this.deleteBookingId}`,
        status: 201,
        timing: endTime - startTime,
        headers: {
          'Content-Type': 'text/plain',
          'Server': 'Cowboy'
        },
        body: 'Created'
      };
      this.showToastrNotification('success', 'Booking deleted successfully');
    }, 600);
  }

  executePing() {
    const startTime = Date.now();
    this.showToastrNotification('info', 'Pinging API...');
    
    setTimeout(() => {
      const endTime = Date.now();
      this.lastApiResponse = {
        method: 'GET',
        url: 'https://restful-booker.herokuapp.com/ping',
        status: 201,
        timing: endTime - startTime,
        headers: {
          'Content-Type': 'text/plain',
          'Server': 'Cowboy'
        },
        body: 'Created'
      };
      this.showToastrNotification('success', 'API is healthy and responding');
    }, 300);
  }

  buildQueryString(): string {
    const params = [];
    if (this.filterParams.firstname) params.push(`firstname=${this.filterParams.firstname}`);
    if (this.filterParams.lastname) params.push(`lastname=${this.filterParams.lastname}`);
    if (this.filterParams.checkin) params.push(`checkin=${this.filterParams.checkin}`);
    if (this.filterParams.checkout) params.push(`checkout=${this.filterParams.checkout}`);
    return params.length > 0 ? `?${params.join('&')}` : '';
  }

  testAuth() {
    this.executeAuth();
  }

  createBooking() {
    this.executeCreateBooking();
  }

  getAllBookings() {
    this.executeGetAllBookings();
  }

  getBookingById() {
    this.executeGetBookingById();
  }

  updateBooking() {
    this.executeUpdateBooking();
  }

  patchBooking() {
    this.executePatchBooking();
  }

  deleteBooking() {
    this.executeDeleteBooking();
  }

  pingAPI() {
    this.executePing();
  }

  getStatusClass(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) return 'success';
    if (statusCode >= 400 && statusCode < 500) return 'client-error';
    if (statusCode >= 500) return 'server-error';
    return 'info';
  }

  // UI Elements methods
  onSliderChange(type: string, event: any) {
    const value = parseInt(event.target.value);
    this.sliderValues = { ...this.sliderValues, [type]: value };
  }

  simulateProgress(type: 'download' | 'upload') {
    this.progressValues[type] = 0;
    const interval = setInterval(() => {
      this.progressValues[type] += Math.random() * 20;
      if (this.progressValues[type] >= 100) {
        this.progressValues[type] = 100;
        clearInterval(interval);
      }
    }, 200);
  }

  toggleAccordion(index: number) {
    this.accordionItems[index].isOpen = !this.accordionItems[index].isOpen;
  }

  resetDragDrop() {
    this.droppedItems = [];
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.carouselImages.length - 1) {
      this.currentImageIndex++;
    }
  }

  goToImage(index: number) {
    this.currentImageIndex = index;
  }

  onColorChange(event: any) {
    this.selectedColor = event.target.value;
  }

  onDateTimeChange(event: any) {
    this.selectedDateTime = event.target.value;
  }

  onWeekChange(event: any) {
    this.selectedWeek = event.target.value;
  }

  setRating(rating: number) {
    this.currentRating = rating;
  }

  setHoverRating(rating: number) {
    this.hoverRating = rating;
  }

  getRatingText(): string {
    if (this.currentRating === 0) return 'Not rated';
    const ratings = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return `${this.currentRating}/5 - ${ratings[this.currentRating - 1]}`;
  }

  simulateLoading(type: 'button' | 'skeleton') {
    this.loadingStates[type] = true;
    
    if (type === 'button') {
      setTimeout(() => {
        this.loadingStates[type] = false;
      }, 3000);
    }
    // For skeleton, it's toggled manually
  }

  // Quiz Methods
  initializeQuiz() {
    this.quizQuestions = [
      // BASIC QUESTIONS (5)
      {
        id: 1,
        difficulty: 'basic',
        title: 'Browser Launch and Page Navigation',
        scenario: 'You need to test a login page at <code>https://example.com/login</code> using Playwright. Your test needs to launch a browser, navigate to the page, and take a screenshot.',
        question: 'Which code correctly launches a browser, navigates to the login page, and captures a screenshot?',
        options: [
          { key: 'A', text: '<code>const browser = await playwright.chromium.launch();<br>const page = await browser.newPage();<br>await page.goto("https://example.com/login");<br>await page.screenshot({ path: "login.png" });</code>' },
          { key: 'B', text: '<code>const browser = await chromium.launch();<br>const page = await browser.newPage();<br>await page.navigate("https://example.com/login");<br>await page.capture("login.png");</code>' },
          { key: 'C', text: '<code>const page = await playwright.launch("https://example.com/login");<br>await page.screenshot("login.png");</code>' },
          { key: 'D', text: '<code>const browser = await playwright.firefox.launch();<br>await browser.goto("https://example.com/login");<br>await browser.screenshot({ path: "login.png" });</code>' }
        ],
        correctAnswer: 'A',
        explanation: '<strong>A is correct</strong> because it properly imports playwright, launches a browser, creates a new page context, navigates with <code>goto()</code>, and takes a screenshot with the correct API. <br><br><strong>B is wrong</strong> - uses <code>navigate()</code> instead of <code>goto()</code> and <code>capture()</code> instead of <code>screenshot()</code>. <br><strong>C is wrong</strong> - playwright.launch() doesn\'t take a URL directly. <br><strong>D is wrong</strong> - tries to call <code>goto()</code> and <code>screenshot()</code> on browser instead of page.',
        copilotTip: '💡 <strong>Copilot Tip:</strong> Type <code>// launch browser and navigate to login page</code> and let Copilot generate the boilerplate. It usually suggests the correct <code>playwright.chromium.launch()</code> pattern.'
      },
      {
        id: 2,
        difficulty: 'basic',
        title: 'Element Interaction and Text Input',
        scenario: 'You\'re testing a contact form with username field <code>id="username"</code>, password field <code>id="password"</code>, and submit button with text "Login".',
        question: 'What\'s the correct way to fill the form and click submit?',
        options: [
          { key: 'A', text: '<code>await page.fill("#username", "testuser");<br>await page.fill("#password", "testpass");<br>await page.click("text=Login");</code>' },
          { key: 'B', text: '<code>await page.type("#username", "testuser");<br>await page.type("#password", "testpass");<br>await page.submit("Login");</code>' },
          { key: 'C', text: '<code>await page.input("#username").value("testuser");<br>await page.input("#password").value("testpass");<br>await page.button("Login").click();</code>' },
          { key: 'D', text: '<code>await page.locator("#username").type("testuser");<br>await page.locator("#password").type("testpass");<br>await page.locator("text=Login").submit();</code>' }
        ],
        correctAnswer: 'A',
        explanation: '<strong>A is correct</strong> because <code>page.fill()</code> is the recommended method for text input (faster than typing), and <code>page.click("text=Login")</code> uses the correct text locator syntax. <br><br><strong>B is wrong</strong> - <code>page.submit()</code> doesn\'t exist. <br><strong>C is wrong</strong> - <code>page.input()</code> and <code>page.button()</code> are not valid Playwright methods. <br><strong>D is wrong</strong> - locators don\'t have <code>type()</code> and <code>submit()</code> methods.',
        copilotTip: '🤖 <strong>Copilot Tip:</strong> When you type <code>page.</code> in VS Code, Copilot will show autocomplete for <code>fill()</code>, <code>click()</code>, and other page methods. Use <code>fill()</code> over <code>type()</code> for better performance.'
      },
      {
        id: 3,
        difficulty: 'basic',
        title: 'Waiting for Elements',
        scenario: 'After clicking a "Load Data" button, a table with <code>data-testid="results-table"</code> appears dynamically. You need to wait for it before proceeding.',
        question: 'Which approach correctly waits for the table to appear?',
        options: [
          { key: 'A', text: '<code>await page.click("text=Load Data");<br>await page.waitForSelector(\'[data-testid="results-table"]\');</code>' },
          { key: 'B', text: '<code>await page.click("text=Load Data");<br>await page.waitFor(\'[data-testid="results-table"]\');</code>' },
          { key: 'C', text: '<code>await page.click("text=Load Data");<br>setTimeout(() => {<br>&nbsp;&nbsp;// continue with test<br>}, 3000);</code>' },
          { key: 'D', text: '<code>await page.click("text=Load Data");<br>await page.locator(\'[data-testid="results-table"]\').waitForVisible();</code>' }
        ],
        correctAnswer: 'A',
        explanation: '<strong>A is correct</strong> because <code>waitForSelector()</code> is the standard method to wait for elements to appear in the DOM with proper error handling and timeout. <br><br><strong>B is wrong</strong> - <code>waitFor()</code> is deprecated in newer Playwright versions. <br><strong>C is wrong</strong> - <code>setTimeout()</code> creates brittle tests with hardcoded waits. <br><strong>D is wrong</strong> - <code>waitForVisible()</code> doesn\'t exist; locators use <code>waitFor()</code> with state options.',
        copilotTip: '⚡ <strong>MCP Tip:</strong> You can ask MCP: "What are the different wait strategies in Playwright?" to get a comprehensive list of wait methods and when to use each one.'
      },
      {
        id: 4,
        difficulty: 'basic',
        title: 'Basic Assertions',
        scenario: 'You need to verify that a success message "Account created successfully!" appears after user registration, and that the URL changes to "/dashboard".',
        question: 'Which assertions correctly verify both the message and URL change?',
        options: [
          { key: 'A', text: '<code>await expect(page.locator("text=Account created successfully!")).toBeVisible();<br>await expect(page).toHaveURL("/dashboard");</code>' },
          { key: 'B', text: '<code>await expect(page).toContainText("Account created successfully!");<br>await expect(page.url()).toBe("/dashboard");</code>' },
          { key: 'C', text: '<code>assert(page.textContent().includes("Account created successfully!"));<br>assert(page.url() === "/dashboard");</code>' },
          { key: 'D', text: '<code>await page.waitForText("Account created successfully!");<br>await page.expectURL("/dashboard");</code>' }
        ],
        correctAnswer: 'A',
        explanation: '<strong>A is correct</strong> because it uses proper Playwright expect assertions: <code>expect(locator).toBeVisible()</code> for element visibility and <code>expect(page).toHaveURL()</code> for URL validation with auto-waiting. <br><br><strong>B is wrong</strong> - <code>page.toContainText()</code> doesn\'t exist and <code>page.url()</code> with <code>toBe()</code> doesn\'t provide auto-waiting. <br><strong>C is wrong</strong> - uses Node.js assert instead of Playwright expect, and methods don\'t exist. <br><strong>D is wrong</strong> - <code>waitForText()</code> and <code>expectURL()</code> are not valid Playwright methods.',
        copilotTip: '🎯 <strong>Copilot Tip:</strong> Type <code>await expect(</code> and Copilot will suggest common Playwright assertions like <code>toBeVisible()</code>, <code>toHaveText()</code>, <code>toHaveURL()</code>.'
      },
      {
        id: 5,
        difficulty: 'basic',
        title: 'Page Object and Locator Strategy',
        scenario: 'You\'re testing an e-commerce product page with multiple "Add to Cart" buttons. You need to click the specific button for product ID "prod-123".',
        question: 'Which locator strategy best targets the specific product\'s Add to Cart button?',
        options: [
          { key: 'A', text: '<code>await page.click(\'[data-product-id="prod-123"] button:has-text("Add to Cart")\');</code>' },
          { key: 'B', text: '<code>await page.click("text=Add to Cart");</code>' },
          { key: 'C', text: '<code>await page.click("button.add-to-cart");</code>' },
          { key: 'D', text: '<code>await page.click("//button[contains(text(), \'Add to Cart\')][1]");</code>' }
        ],
        correctAnswer: 'A',
        explanation: '<strong>A is correct</strong> because it combines a specific product identifier with the button text using CSS selectors with <code>:has-text()</code>, ensuring you click the right button even with multiple similar buttons. <br><br><strong>B is wrong</strong> - too generic, will click the first "Add to Cart" button found. <br><strong>C is wrong</strong> - relies only on CSS class, may not be unique. <br><strong>D is wrong</strong> - uses XPath which is less preferred in Playwright and [1] gets first match regardless of product.',
        copilotTip: '🔍 <strong>MCP Tip:</strong> Ask MCP "Show me different ways to create specific locators in Playwright" to learn about combining selectors, using data attributes, and role-based locators.'
      },

      // INTERMEDIATE QUESTIONS (5)
      {
        id: 6,
        difficulty: 'intermediate',
        title: 'API Mocking with page.route()',
        scenario: 'You need to test how your app handles a slow API response. The app calls <code>GET /api/products</code> and displays loading state, then products.',
        question: 'How do you mock this API to delay response by 3 seconds?',
        options: [
          { key: 'A', text: '<code>await page.route("**/api/products", async route => {<br>&nbsp;&nbsp;await new Promise(resolve => setTimeout(resolve, 3000));<br>&nbsp;&nbsp;await route.fulfill({ json: { products: [] } });<br>});</code>' },
          { key: 'B', text: '<code>await page.interceptor("/api/products", {<br>&nbsp;&nbsp;delay: 3000,<br>&nbsp;&nbsp;response: { products: [] }<br>});</code>' },
          { key: 'C', text: '<code>await page.mockAPI("GET", "/api/products", {<br>&nbsp;&nbsp;timeout: 3000,<br>&nbsp;&nbsp;data: { products: [] }<br>});</code>' },
          { key: 'D', text: '<code>await page.route("**/api/products", route => {<br>&nbsp;&nbsp;route.delay(3000);<br>&nbsp;&nbsp;route.respond({ json: { products: [] } });<br>});</code>' }
        ],
        correctAnswer: 'A',
        explanation: '<strong>A is correct</strong> because it properly uses <code>page.route()</code> with glob pattern, implements async delay with setTimeout wrapped in Promise, and fulfills the route with <code>route.fulfill()</code>. <br><br><strong>B is wrong</strong> - <code>page.interceptor()</code> doesn\'t exist in Playwright. <br><strong>C is wrong</strong> - <code>page.mockAPI()</code> is not a Playwright method. <br><strong>D is wrong</strong> - <code>route.delay()</code> and <code>route.respond()</code> don\'t exist; should use <code>route.fulfill()</code>.',
        copilotTip: '🌐 <strong>Copilot Tip:</strong> When working with API mocking, type <code>page.route</code> and Copilot will often suggest the complete pattern including async handlers and <code>route.fulfill()</code>.'
      },
      {
        id: 7,
        difficulty: 'intermediate',
        title: 'Authentication and Storage State',
        scenario: 'Your app uses JWT tokens stored in localStorage. You want to run multiple tests with a pre-authenticated user without repeating login for each test.',
        question: 'What\'s the best approach to handle authentication across multiple tests?',
        options: [
          { key: 'A', text: '<code>// In setup script<br>await page.goto("/login");<br>await page.fill("#username", "testuser");<br>await page.fill("#password", "password");<br>await page.context().storageState({ path: "auth.json" });<br><br>// In tests<br>await page.context().addInitScript(fs.readFileSync("auth.json"));</code>' },
          { key: 'B', text: '<code>// In each test<br>await page.goto("/login");<br>await page.fill("#username", "testuser");<br>await page.fill("#password", "password");<br>await page.click("text=Login");</code>' },
          { key: 'C', text: '<code>// In setup script<br>await page.goto("/login");<br>await page.fill("#username", "testuser");<br>await page.fill("#password", "password");<br>await page.context().storageState({ path: "auth.json" });<br><br>// In playwright.config.js<br>use: { storageState: "auth.json" }</code>' },
          { key: 'D', text: '<code>// In beforeEach<br>await page.evaluate(() => {<br>&nbsp;&nbsp;localStorage.setItem("token", "fake-jwt-token");<br>});</code>' }
        ],
        correctAnswer: 'C',
        explanation: '<strong>C is correct</strong> because it properly saves authenticated state with <code>storageState()</code> after real login, then reuses it via Playwright config for all tests, avoiding repeated logins. <br><br><strong>A is wrong</strong> - <code>addInitScript()</code> with file content isn\'t the right approach for storage state. <br><strong>B is wrong</strong> - repeating login in each test is slow and defeats the purpose of state management. <br><strong>D is wrong</strong> - manually setting fake tokens may not work with real authentication flows.',
        copilotTip: '🔐 <strong>MCP Tip:</strong> Ask MCP "How to set up authentication fixtures in Playwright with storage state" to get complete examples of auth setup patterns and best practices.'
      },
      {
        id: 8,
        difficulty: 'intermediate',
        title: 'Test Fixtures and Data Setup',
        scenario: 'You need to create reusable test data (user accounts, test products) and cleanup after tests. Each test should get fresh data.',
        question: 'Which fixture pattern correctly provides fresh test data for each test?',
        options: [
          { key: 'A', text: '<code>const test = base.extend({<br>&nbsp;&nbsp;testUser: async ({}, use) => {<br>&nbsp;&nbsp;&nbsp;&nbsp;const user = await createTestUser();<br>&nbsp;&nbsp;&nbsp;&nbsp;await use(user);<br>&nbsp;&nbsp;&nbsp;&nbsp;await deleteTestUser(user.id);<br>&nbsp;&nbsp;}<br>});</code>' },
          { key: 'B', text: '<code>const globalUser = await createTestUser();<br><br>test("my test", async ({ page }) => {<br>&nbsp;&nbsp;// use globalUser<br>});</code>' },
          { key: 'C', text: '<code>test.beforeEach(async () => {<br>&nbsp;&nbsp;this.testUser = await createTestUser();<br>});<br><br>test.afterEach(async () => {<br>&nbsp;&nbsp;await deleteTestUser(this.testUser.id);<br>});</code>' },
          { key: 'D', text: '<code>test("my test", async ({ page }) => {<br>&nbsp;&nbsp;const user = await createTestUser();<br>&nbsp;&nbsp;// test logic<br>&nbsp;&nbsp;await deleteTestUser(user.id);<br>});</code>' }
        ],
        correctAnswer: 'A',
        explanation: '<strong>A is correct</strong> because it uses Playwright\'s fixture system with <code>test.extend()</code>, providing automatic setup/teardown per test with the <code>use()</code> pattern ensuring cleanup even if tests fail. <br><br><strong>B is wrong</strong> - global data is shared across tests and not cleaned up. <br><strong>C is wrong</strong> - <code>this</code> context doesn\'t work in Playwright tests, and setup/teardown in beforeEach/afterEach is less robust. <br><strong>D is wrong</strong> - inline setup/cleanup in each test is repetitive and error-prone.',
        copilotTip: '🧪 <strong>Copilot Tip:</strong> Type <code>const test = base.extend({</code> and Copilot will often suggest fixture patterns. It\'s especially good at generating database fixture patterns.'
      },
      {
        id: 9,
        difficulty: 'intermediate',
        title: 'Debugging with Trace Viewer',
        scenario: 'A test is failing intermittently in CI but passes locally. You need to capture detailed execution traces to debug the issue.',
        question: 'How do you properly configure tracing for CI debugging?',
        options: [
          { key: 'A', text: '<code>// In playwright.config.js<br>use: {<br>&nbsp;&nbsp;trace: "on-first-retry",<br>&nbsp;&nbsp;screenshot: "only-on-failure",<br>&nbsp;&nbsp;video: "retain-on-failure"<br>}</code>' },
          { key: 'B', text: '<code>// In test file<br>await page.tracing.start({ screenshots: true });<br>// ... test code ...<br>await page.tracing.stop({ path: "trace.zip" });</code>' },
          { key: 'C', text: '<code>// In package.json<br>"scripts": {<br>&nbsp;&nbsp;"test:debug": "playwright test --debug --trace"<br>}</code>' },
          { key: 'D', text: '<code>// In test file<br>test("my test", async ({ page }) => {<br>&nbsp;&nbsp;await page.enableTracing();<br>&nbsp;&nbsp;// test logic<br>});</code>' }
        ],
        correctAnswer: 'A',
        explanation: '<strong>A is correct</strong> because configuring tracing in playwright.config.js with <code>"on-first-retry"</code> captures traces only when tests fail and retry, perfect for CI debugging without excessive overhead. <br><br><strong>B is wrong</strong> - manual tracing in each test is verbose and you need to remember to add it. <br><strong>C is wrong</strong> - <code>--trace</code> flag doesn\'t exist; tracing is configured via config file or programmatically. <br><strong>D is wrong</strong> - <code>page.enableTracing()</code> is not a valid Playwright method.',
        copilotTip: '🔍 <strong>MCP Tip:</strong> Ask MCP "Show me Playwright trace configuration options and when to use each one" to understand different trace modes like "on", "off", "on-first-retry", and "retain-on-failure".'
      },
      {
        id: 10,
        difficulty: 'intermediate',
        title: 'Mobile and Cross-Browser Testing',
        scenario: 'You need to test your responsive web app on mobile devices and multiple browsers with different viewport sizes.',
        question: 'Which configuration properly sets up mobile and cross-browser testing?',
        options: [
          { key: 'A', text: '<code>// playwright.config.js<br>projects: [<br>&nbsp;&nbsp;{ name: "Desktop Chrome", use: { ...devices["Desktop Chrome"] } },<br>&nbsp;&nbsp;{ name: "Mobile Safari", use: { ...devices["iPhone 12"] } },<br>&nbsp;&nbsp;{ name: "Mobile Chrome", use: { ...devices["Pixel 5"] } }<br>]</code>' },
          { key: 'B', text: '<code>// In test file<br>test("mobile test", async ({ page }) => {<br>&nbsp;&nbsp;await page.setViewportSize({ width: 375, height: 667 });<br>&nbsp;&nbsp;await page.emulate("iPhone");<br>});</code>' },
          { key: 'C', text: '<code>// playwright.config.js<br>use: {<br>&nbsp;&nbsp;viewport: { width: 375, height: 667 },<br>&nbsp;&nbsp;userAgent: "Mobile Safari",<br>&nbsp;&nbsp;browsers: ["chromium", "firefox", "webkit"]<br>}</code>' },
          { key: 'D', text: '<code>// In test file<br>for (const browser of ["chrome", "firefox", "safari"]) {<br>&nbsp;&nbsp;test(\`test on \${browser}\`, async ({ page }) => {<br>&nbsp;&nbsp;&nbsp;&nbsp;// test logic<br>&nbsp;&nbsp;});<br>}</code>' }
        ],
        correctAnswer: 'A',
        explanation: '<strong>A is correct</strong> because it uses Playwright\'s project configuration with predefined device profiles from <code>devices</code> which include proper viewport, user agent, and browser engine combinations. <br><br><strong>B is wrong</strong> - <code>page.emulate()</code> doesn\'t exist and manual viewport setting doesn\'t include other mobile characteristics. <br><strong>C is wrong</strong> - <code>browsers</code> property doesn\'t exist in config; should use projects with different browsers. <br><strong>D is wrong</strong> - programmatic loop doesn\'t leverage Playwright\'s project system and won\'t run in parallel.',
        copilotTip: '📱 <strong>Copilot Tip:</strong> Type <code>devices["</code> in your config and Copilot will suggest available device profiles like "iPhone 12", "Pixel 5", "Desktop Chrome", etc.'
      },

      // ADVANCED QUESTIONS (5)
      {
        id: 11,
        difficulty: 'advanced',
        title: 'Parallel Testing and Test Isolation',
        scenario: 'You have 100+ tests that need to run in parallel across multiple workers, but some tests modify shared database state.',
        question: 'How do you configure optimal parallel execution with proper test isolation?',
        options: [
          { key: 'A', text: '<code>// playwright.config.js<br>workers: process.env.CI ? 2 : 4,<br>fullyParallel: true,<br>projects: [<br>&nbsp;&nbsp;{ name: "api-tests", testDir: "./api", workers: 1 },<br>&nbsp;&nbsp;{ name: "ui-tests", testDir: "./ui", fullyParallel: true }<br>]</code>' },
          { key: 'B', text: '<code>// playwright.config.js<br>workers: 1,<br>globalSetup: "./global-setup.js",<br>globalTeardown: "./global-teardown.js"</code>' },
          { key: 'C', text: '<code>// playwright.config.js<br>workers: "50%",<br>maxFailures: 5,<br>use: { testIdAttribute: "data-test" }</code>' },
          { key: 'D', text: '<code>test.describe.configure({ mode: "parallel" });<br><br>test.beforeAll(async () => {<br>&nbsp;&nbsp;await setupDatabase();<br>});</code>' }
        ],
        correctAnswer: 'A',
        explanation: '<strong>A is correct</strong> because it uses different worker configurations per project type: API tests (database-touching) run serially with 1 worker to avoid conflicts, while UI tests run fully parallel. This provides optimal speed with proper isolation. <br><br><strong>B is wrong</strong> - running everything with 1 worker defeats the purpose of parallel testing. <br><strong>C is wrong</strong> - doesn\'t address test isolation concerns, just configures worker count. <br><strong>D is wrong</strong> - describe-level configuration doesn\'t solve database state conflicts.',
        copilotTip: '⚡ <strong>MCP Tip:</strong> Ask MCP "How to design test architecture for parallel execution with database dependencies" to learn about isolation strategies, test databases, and worker management.'
      },
      {
        id: 12,
        difficulty: 'advanced',
        title: 'Visual Regression Testing',
        scenario: 'You need to implement visual regression testing for a dashboard with dynamic charts and date ranges that should be consistent across test runs.',
        question: 'Which approach ensures stable visual comparisons?',
        options: [
          { key: 'A', text: '<code>// Mock time and data<br>await page.addInitScript(() => {<br>&nbsp;&nbsp;Date.now = () => 1640995200000; // Fixed timestamp<br>});<br>await page.route("**/api/chart-data", route => <br>&nbsp;&nbsp;route.fulfill({ json: mockChartData }));<br>await expect(page.locator(".dashboard")).toHaveScreenshot();</code>' },
          { key: 'B', text: '<code>await page.waitForLoadState("networkidle");<br>await page.screenshot({ path: "dashboard.png" });<br>// Manual comparison in CI</code>' },
          { key: 'C', text: '<code>await expect(page).toHaveScreenshot({ fullPage: true });</code>' },
          { key: 'D', text: '<code>await page.waitForSelector(".chart");<br>await expect(page.locator(".dashboard")).toHaveScreenshot({<br>&nbsp;&nbsp;threshold: 0.5<br>});</code>' }
        ],
        correctAnswer: 'A',
        explanation: '<strong>A is correct</strong> because it eliminates non-deterministic elements by mocking time (for date displays) and API data (for charts), ensuring consistent screenshots across runs. This is essential for reliable visual regression testing. <br><br><strong>B is wrong</strong> - manual comparison doesn\'t scale and waiting for network idle doesn\'t guarantee visual stability. <br><strong>C is wrong</strong> - doesn\'t handle dynamic content that changes between runs. <br><strong>D is wrong</strong> - high threshold (0.5) makes tests less sensitive to real regressions.',
        copilotTip: '📸 <strong>Copilot Tip:</strong> When setting up visual tests, type <code>page.addInitScript</code> and Copilot often suggests common mocking patterns for Date, Math.random, and other non-deterministic APIs.'
      },
      {
        id: 13,
        difficulty: 'advanced',
        title: 'API Testing with Request Context',
        scenario: 'You need to test a REST API that requires authentication headers and correlate API responses with UI changes in the same test.',
        question: 'How do you properly combine API and UI testing?',
        options: [
          { key: 'A', text: '<code>test("api + ui flow", async ({ page, request }) => {<br>&nbsp;&nbsp;// API call<br>&nbsp;&nbsp;const response = await request.post("/api/orders", {<br>&nbsp;&nbsp;&nbsp;&nbsp;headers: { "Authorization": "Bearer token" },<br>&nbsp;&nbsp;&nbsp;&nbsp;data: { productId: "123", quantity: 2 }<br>&nbsp;&nbsp;});<br>&nbsp;&nbsp;const order = await response.json();<br>&nbsp;&nbsp;<br>&nbsp;&nbsp;// UI verification<br>&nbsp;&nbsp;await page.goto("/orders");<br>&nbsp;&nbsp;await expect(page.locator(\`text=Order #\${order.id}\`)).toBeVisible();<br>});</code>' },
          { key: 'B', text: '<code>test("api test", async ({ page }) => {<br>&nbsp;&nbsp;const apiResponse = await page.evaluate(async () => {<br>&nbsp;&nbsp;&nbsp;&nbsp;return fetch("/api/orders", {<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;method: "POST",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;body: JSON.stringify({ productId: "123" })<br>&nbsp;&nbsp;&nbsp;&nbsp;}).then(r => r.json());<br>&nbsp;&nbsp;});<br>});</code>' },
          { key: 'C', text: '<code>test("combined test", async ({ page }) => {<br>&nbsp;&nbsp;await page.route("**/api/orders", route => {<br>&nbsp;&nbsp;&nbsp;&nbsp;route.fulfill({ json: { id: "order-123" } });<br>&nbsp;&nbsp;});<br>&nbsp;&nbsp;await page.goto("/orders");<br>});</code>' },
          { key: 'D', text: '<code>import axios from "axios";<br><br>test("api + ui", async ({ page }) => {<br>&nbsp;&nbsp;const response = await axios.post("/api/orders", data);<br>&nbsp;&nbsp;await page.goto("/orders");<br>});</code>' }
        ],
        correctAnswer: 'A',
        explanation: '<strong>A is correct</strong> because it uses Playwright\'s built-in <code>request</code> fixture which shares cookies/auth with the browser context, making real API calls and then verifying the UI reflects those changes. <br><br><strong>B is wrong</strong> - <code>page.evaluate()</code> with fetch runs in browser context which may have CORS issues and doesn\'t share Playwright\'s auth context. <br><strong>C is wrong</strong> - this mocks the API instead of testing real API + UI integration. <br><strong>D is wrong</strong> - external HTTP libraries don\'t share authentication state with the browser context.',
        copilotTip: '🔗 <strong>MCP Tip:</strong> Ask MCP "Show me patterns for API + UI testing in Playwright" to learn about request fixtures, context sharing, and testing full user workflows that span both API and UI layers.'
      },
      {
        id: 14,
        difficulty: 'advanced',
        title: 'CI/CD Integration and Reporting',
        scenario: 'You need to set up Playwright tests in GitHub Actions with proper artifact collection, test sharding, and integration with existing deployment pipeline.',
        question: 'Which GitHub Actions configuration provides optimal CI setup?',
        options: [
          { key: 'A', text: '<code>- name: Run Playwright tests<br>&nbsp;&nbsp;run: npx playwright test --shard=${{ matrix.shard }}/${{ strategy.matrix.total }}<br>&nbsp;&nbsp;strategy:<br>&nbsp;&nbsp;&nbsp;&nbsp;matrix:<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;shard: [1, 2, 3, 4]<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;total: [4]<br>- uses: actions/upload-artifact@v3<br>&nbsp;&nbsp;if: always()<br>&nbsp;&nbsp;with:<br>&nbsp;&nbsp;&nbsp;&nbsp;name: playwright-report-${{ matrix.shard }}<br>&nbsp;&nbsp;&nbsp;&nbsp;path: playwright-report/</code>' },
          { key: 'B', text: '<code>- name: Run Playwright tests<br>&nbsp;&nbsp;run: npx playwright test<br>&nbsp;&nbsp;timeout-minutes: 60<br>- name: Upload results<br>&nbsp;&nbsp;run: cp test-results/* $GITHUB_WORKSPACE/</code>' },
          { key: 'C', text: '<code>- name: Run tests<br>&nbsp;&nbsp;run: |<br>&nbsp;&nbsp;&nbsp;&nbsp;npm test<br>&nbsp;&nbsp;&nbsp;&nbsp;playwright test --reporter=github<br>&nbsp;&nbsp;continue-on-error: true</code>' },
          { key: 'D', text: '<code>- name: Playwright<br>&nbsp;&nbsp;uses: microsoft/playwright-github-action@v1<br>&nbsp;&nbsp;with:<br>&nbsp;&nbsp;&nbsp;&nbsp;browsers: "chromium,firefox"<br>&nbsp;&nbsp;&nbsp;&nbsp;reporter: "html"</code>' }
        ],
        correctAnswer: 'A',
        explanation: '<strong>A is correct</strong> because it implements test sharding across matrix runners for faster execution, properly uploads artifacts with <code>if: always()</code> to capture results even on failure, and uses unique artifact names per shard. <br><br><strong>B is wrong</strong> - no sharding for speed, and manual file copying instead of proper artifact upload. <br><strong>C is wrong</strong> - <code>--reporter=github</code> doesn\'t exist, and <code>continue-on-error</code> can hide real issues. <br><strong>D is wrong</strong> - <code>microsoft/playwright-github-action@v1</code> doesn\'t exist; Playwright setup is manual in GHA.',
        copilotTip: '🚀 <strong>Copilot Tip:</strong> When writing GitHub Actions workflows, Copilot is excellent at suggesting matrix strategies and artifact upload patterns. Start typing <code>strategy:</code> and let it build the matrix configuration.'
      },
      {
        id: 15,
        difficulty: 'advanced',
        title: 'Copilot & MCP Integration for Test Generation',
        scenario: 'You want to use AI tools to automatically generate Playwright tests from user stories and maintain them as the application evolves.',
        question: 'Which approach best leverages AI for sustainable test automation?',
        options: [
          { key: 'A', text: '<code>// Use MCP to analyze app structure<br>const testPlan = await mcp.generateTestPlan({<br>&nbsp;&nbsp;userStory: "As a user, I want to add items to cart",<br>&nbsp;&nbsp;pageStructure: await mcp.analyzeDOM(page),<br>&nbsp;&nbsp;existingTests: testSuite<br>});<br><br>// Use Copilot for implementation<br>// Type: "Generate test for adding items to cart"<br>// Let Copilot suggest the test structure</code>' },
          { key: 'B', text: '<code>// Fully automated test generation<br>const tests = await ai.generateAllTests(appUrl);<br>fs.writeFileSync("auto-tests.spec.js", tests);</code>' },
          { key: 'C', text: '<code>// Use Playwright codegen only<br>npx playwright codegen https://example.com</code>' },
          { key: 'D', text: '<code>// Manual test writing with AI comments<br>test("login test", async ({ page }) => {<br>&nbsp;&nbsp;// TODO: Ask AI to implement this<br>&nbsp;&nbsp;// AI: Please write login test<br>});</code>' }
        ],
        correctAnswer: 'A',
        explanation: '<strong>A is correct</strong> because it shows a thoughtful hybrid approach: using MCP for high-level analysis and test planning (understanding app structure and avoiding duplicate tests), then leveraging Copilot\'s code completion strengths for actual implementation. This balances automation with human oversight. <br><br><strong>B is wrong</strong> - fully automated test generation typically produces low-quality, unmaintainable tests without business logic understanding. <br><strong>C is wrong</strong> - codegen is useful for exploration but doesn\'t provide the AI-powered analysis and planning benefits. <br><strong>D is wrong</strong> - this doesn\'t actually use AI capabilities, just adds comments hoping for magic.',
        copilotTip: '🧠 <strong>MCP Power Tip:</strong> MCP excels at analyzing existing codebases and generating test strategies. Try: "Analyze my React app structure and suggest a comprehensive test plan covering user workflows, edge cases, and integration points." Then use Copilot to implement the individual test methods with proper selectors and assertions.'
      }
    ];
    
    this.resetQuiz();
  }

  startQuiz() {
    this.quizStarted = true;
    this.currentQuestionIndex = 0;
    this.selectedAnswer = '';
    this.showAnswer = false;
    this.correctAnswers = 0;
    this.userAnswers = new Array(this.quizQuestions.length).fill('');
  }

  getCurrentQuestion() {
    return this.quizQuestions[this.currentQuestionIndex];
  }

  selectAnswer(answer: string) {
    if (!this.showAnswer) {
      this.selectedAnswer = answer;
    }
  }

  submitAnswer() {
    if (this.selectedAnswer) {
      this.userAnswers[this.currentQuestionIndex] = this.selectedAnswer;
      if (this.selectedAnswer === this.getCurrentQuestion().correctAnswer) {
        this.correctAnswers++;
      }
      this.showAnswer = true;
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.quizQuestions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedAnswer = '';
      this.showAnswer = false;
    } else {
      this.quizCompleted = true;
      this.quizStarted = false;
    }
  }

  isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.quizQuestions.length - 1;
  }

  getQuizProgress(): number {
    return ((this.currentQuestionIndex + 1) / this.quizQuestions.length) * 100;
  }

  getScorePercentage(): number {
    return Math.round((this.correctAnswers / this.quizQuestions.length) * 100);
  }

  getScoreByDifficulty(difficulty: string): number {
    const questionsOfDifficulty = this.quizQuestions.filter(q => q.difficulty === difficulty);
    const correctAnswersOfDifficulty = questionsOfDifficulty.reduce((count, question, index) => {
      const globalIndex = this.quizQuestions.indexOf(question);
      return count + (this.userAnswers[globalIndex] === question.correctAnswer ? 1 : 0);
    }, 0);
    return correctAnswersOfDifficulty;
  }

  getSkillAssessment(): string {
    const percentage = this.getScorePercentage();
    if (percentage >= 90) {
      return '<div class="assessment expert"><h4>🏆 Expert Level</h4><p>Outstanding! You have mastery of advanced Playwright concepts, CI/CD integration, and AI-assisted testing workflows.</p></div>';
    } else if (percentage >= 75) {
      return '<div class="assessment advanced"><h4>🎯 Advanced Level</h4><p>Great job! You understand most Playwright features. Focus on advanced topics like visual testing and AI integration.</p></div>';
    } else if (percentage >= 60) {
      return '<div class="assessment intermediate"><h4>📈 Intermediate Level</h4><p>Good progress! You grasp the fundamentals. Work on fixtures, debugging, and parallel testing concepts.</p></div>';
    } else {
      return '<div class="assessment beginner"><h4>🌱 Beginner Level</h4><p>Keep learning! Focus on core concepts like locators, waits, assertions, and basic browser automation.</p></div>';
    }
  }

  getRecommendations(): string {
    const basicScore = this.getScoreByDifficulty('basic');
    const intermediateScore = this.getScoreByDifficulty('intermediate');
    const advancedScore = this.getScoreByDifficulty('advanced');
    
    let recommendations = '<ul>';
    
    if (basicScore < 4) {
      recommendations += '<li>📚 Study Playwright basics: <a href="https://playwright.dev/docs/intro" target="_blank">Getting Started Guide</a></li>';
      recommendations += '<li>🎯 Practice with locators and basic interactions</li>';
    }
    
    if (intermediateScore < 4) {
      recommendations += '<li>🔧 Learn about fixtures and test organization</li>';
      recommendations += '<li>🐛 Practice debugging with trace viewer and screenshots</li>';
    }
    
    if (advancedScore < 4) {
      recommendations += '<li>⚡ Explore parallel testing and CI/CD integration</li>';
      recommendations += '<li>🤖 Practice with GitHub Copilot for test generation</li>';
      recommendations += '<li>🔗 Learn about MCP integration for advanced workflows</li>';
    }
    
    recommendations += '<li>💡 Join the <a href="https://discord.gg/playwright" target="_blank">Playwright Discord</a> community</li>';
    recommendations += '</ul>';
    
    return recommendations;
  }

  resetQuiz() {
    this.quizStarted = false;
    this.quizCompleted = false;
    this.reviewMode = false;
    this.currentQuestionIndex = 0;
    this.selectedAnswer = '';
    this.showAnswer = false;
    this.correctAnswers = 0;
    this.userAnswers = [];
  }

  reviewAnswers() {
    this.reviewMode = true;
  }

  closeReview() {
    this.reviewMode = false;
  }
}