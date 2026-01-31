import { Component, OnInit, OnDestroy, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import localeFr from '@angular/common/locales/fr';
import localeDe from '@angular/common/locales/de';

// Register locale data for French and German
registerLocaleData(localeFr);
registerLocaleData(localeDe);

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
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PracticeAppComponent implements OnInit, OnDestroy, AfterViewInit {
  
  // Form Groups
  gridForm!: FormGroup;
  combinedForm!: FormGroup;
  createBookingForm!: FormGroup;
  updateBookingForm!: FormGroup;
  authForm!: FormGroup;
  
  // State variables
  isLoading = false;
  submitMessage = '';
  messageType: 'success' | 'error' | 'warning' | 'info' = 'success';
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
  alertResult = ''; // Store alert interaction results
  
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
  
  // Authentication properties for Playwright session storage testing
  authUsers = [
    { 
      id: 'admin', 
      username: 'admin', 
      password: 'admin123', 
      role: 'admin', 
      name: 'Admin User',
      permissions: ['read', 'write', 'delete', 'manage-users'] 
    },
    { 
      id: 'manager', 
      username: 'manager', 
      password: 'manager123', 
      role: 'manager', 
      name: 'Manager User',
      permissions: ['read', 'write', 'manage-content'] 
    },
    { 
      id: 'user', 
      username: 'user', 
      password: 'user123', 
      role: 'user', 
      name: 'Regular User',
      permissions: ['read'] 
    }
  ];
  
  currentUser: any = null;
  authenticationStatus = '';
  sessionData: any = {};
  isAuthenticated = false;
  loginForm!: FormGroup;
  protectedActionResult = '';
  
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
  
  // Network Internals properties
  networkDemoType: 'rest' | 'graphql' | 'websocket' | 'sse' | 'fetch-variations' | 'cors' | 'performance' | '' = '';
  networkResponse: any = null;
  networkLoading = false;
  networkTiming: number = 0;
  demonstrationText = '';
  requestHeaders: any = {};
  responseHeaders: any = {};
  requestPayload: any = null;
  statusCode: number = 0;
  networkError: string = '';
  networkSteps: string[] = [];
  currentStepIndex: number = 0;
  showNetworkTabs = false;
  
  // iFrame properties
  frameLoading = false;
  frameLoaded = false;
  frameUrl: SafeResourceUrl | string = '';

  // Auto Waiting properties
  slowLoadingInProgress = false;
  slowLoadingResult = '';
  showDynamicElement = false;
  inputEnabled = false;
  animationScale = 'scale(1)';
  showLoadingSpinner = false;
  showAnimationResult = false;
  showFormSuccess = false;

  // Practice form data
  practiceFormData = {
    name: '',
    email: '',
    experience: '',
    newsletter: false
  };
  
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    this.initializeForms();
  }

  // Message Handling Methods
  setMessage(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') {
    this.submitMessage = message;
    this.messageType = type;
    this.isLoading = false;
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
      this.submitMessage = '';
    }, 5000);
  }

  setSuccessMessage(message: string) {
    this.setMessage(message, 'success');
  }

  setErrorMessage(message: string) {
    this.setMessage(message, 'error');
  }

  setWarningMessage(message: string) {
    this.setMessage(message, 'warning');
  }

  setInfoMessage(message: string) {
    this.setMessage(message, 'info');
  }

  // Show both main message and toastr for important operations
  setMessageWithToastr(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') {
    this.setMessage(message, type);
    this.showToastrNotification(type, message);
  }

  ngOnInit() {
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
      'network-internals': '🌐',
      'frames': '🖼️',
      'ui-elements': '🎨',
      'shadow-dom': '👤',
      'authentication': '🔐',
      'auto-waiting': '⏱️',
      'playwright-quiz': '🧠',
      'dynamic-ui': '🎭',
      'role-based-access': '👥',
      'localization': '🌍',
      'accessibility': '♿',
      'visual-regression': '📸',
      'error-handling': '⚠️'
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
      'network-internals': 'Network Internals',
      'frames': 'Frames',
      'ui-elements': 'UI Elements',
      'shadow-dom': 'Shadow DOM',
      'authentication': 'Authentication',
      'auto-waiting': 'Auto Waiting',
      'playwright-quiz': 'Quiz',
      'dynamic-ui': 'Dynamic UI',
      'role-based-access': 'Role Access',
      'localization': 'Localization',
      'accessibility': 'Accessibility',
      'visual-regression': 'Visual Tests',
      'error-handling': 'Error Handling'
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
    
    // Login Form for session storage testing
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    
    // Check for existing session on init
    this.checkExistingSession();
  }
  
  setActiveTab(tabName: string) {
    this.selectedTab = tabName;
    
    // Track module interaction
    this.moduleInteractions[tabName] = (this.moduleInteractions[tabName] || 0) + 1;
    
    // Mark as completed after some interactions (simulating engagement)
    if (this.moduleInteractions[tabName] >= 3) {
      this.completedModules.add(tabName);
    }
    
    // Initialize Shadow DOM when that tab is selected
    if (tabName === 'shadow-dom') {
      setTimeout(() => {
        this.initializeSimpleShadowDOM();
      }, 100);
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
      
      // Check for specific validation scenarios to show different message types
      const formData = this.gridForm.value;
      
      // Simulate API call
      setTimeout(() => {
        // Demo: Show different message types based on form data
        if (formData.email && formData.email.includes('test')) {
          this.setWarningMessage('Form submitted successfully, but test email detected. Please use a real email for production.');
        } else if (formData.firstName && formData.firstName.toLowerCase().includes('admin')) {
          this.setInfoMessage('Admin user detected. Form submitted with special privileges.');
        } else {
          this.setSuccessMessage('Grid form submitted successfully!');
        }
        console.log('Grid Form Data:', this.gridForm.value);
      }, 2000);
    } else {
      // Show specific error based on validation state
      const firstInvalidField = Object.keys(this.gridForm.controls).find(key => 
        this.gridForm.get(key)?.invalid
      );
      
      if (firstInvalidField) {
        this.setErrorMessage(`Please fix the validation errors. First invalid field: ${firstInvalidField}`);
      } else {
        this.setErrorMessage('Please fill all required fields correctly.');
      }
    }
  }

  onCombinedFormSubmit() {
    if (this.combinedForm.valid) {
      // Check if passwords match
      const password = this.combinedForm.get('password')?.value;
      const confirmPassword = this.combinedForm.get('confirmPassword')?.value;
      
      if (password !== confirmPassword) {
        this.setErrorMessage('Passwords do not match!');
        return;
      }
      
      this.isLoading = true;
      this.submitMessage = '';
      
      // Simulate API call
      setTimeout(() => {
        const formData = this.combinedForm.value;
        
        // Demo: Show different message types based on form data
        if (formData.salary && formData.salary < 30000) {
          this.setWarningMessage('Form submitted successfully, but salary seems low. Please verify the amount.');
        } else if (formData.age && formData.age > 65) {
          this.setInfoMessage('Senior applicant detected. Form submitted with age verification note.');
        } else if (formData.skills && formData.skills.length > 5) {
          this.setSuccessMessage('Excellent! Combined form submitted successfully with multiple skills!');
        } else {
          this.setSuccessMessage('Combined form submitted successfully! All data validated and processed.');
        }
        console.log('Combined Form Data:', this.combinedForm.value);
      }, 3000);
    } else {
      // Show specific error information
      const invalidFields = Object.keys(this.combinedForm.controls).filter(key => 
        this.combinedForm.get(key)?.invalid
      );
      
      if (invalidFields.length > 0) {
        this.setErrorMessage(`Please fix validation errors in: ${invalidFields.join(', ')}`);
      } else {
        this.setErrorMessage('Please fill all required fields correctly.');
      }
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
  
  // New Tab Handling Methods
  openNewTab() {
    // Opens the same practice app in a new tab
    const newTab = window.open('/practice-app', '_blank');
    if (newTab) {
      this.showToastrNotification('success', 'New tab opened! Use Playwright to handle multiple tabs.');
    } else {
      this.showToastrNotification('error', 'Popup blocked! Please allow popups for this site.');
    }
  }
  
  openNewWindow() {
    // Opens a new window with specific dimensions
    const newWindow = window.open('/practice-app', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    if (newWindow) {
      this.showToastrNotification('success', 'New window opened! Practice window handling in Playwright.');
    } else {
      this.showToastrNotification('error', 'Popup blocked! Please allow popups for this site.');
    }
  }
  
  openExternalLink() {
    // Opens an external website in a new tab
    const externalTab = window.open('https://playwright.dev/', '_blank');
    if (externalTab) {
      this.showToastrNotification('info', 'External site opened! Practice cross-origin navigation.');
    } else {
      this.showToastrNotification('error', 'Popup blocked! Please allow popups for this site.');
    }
  }
  
  // JavaScript Alert Methods
  showSimpleAlert() {
    alert('This is a simple JavaScript alert! Playwright can handle this with page.on("dialog") listeners.');
    this.alertResult = 'Simple alert was shown';
    this.showToastrNotification('info', 'Simple alert triggered!');
  }
  
  showConfirmAlert() {
    const result = confirm('Do you want to continue? Click OK or Cancel to test Playwright dialog handling.');
    this.alertResult = result ? 'User clicked OK' : 'User clicked Cancel';
    this.showToastrNotification('success', `Confirm result: ${this.alertResult}`);
  }
  
  showPromptAlert() {
    const userInput = prompt('Please enter your test data:', 'Default text for automation');
    this.alertResult = userInput !== null ? `User entered: "${userInput}"` : 'User cancelled the prompt';
    this.showToastrNotification('info', 'Prompt dialog completed!');
  }
  
  showHiddenAlert() {
    // This alert is triggered by a nearly invisible button for teaching purposes
    alert('Congratulations! You found the hidden alert button. This tests your element location skills!');
    this.alertResult = 'Hidden alert was triggered - well done!';
    this.showToastrNotification('success', 'Hidden element successfully located and clicked!');
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

  // Network Internals Demonstration Methods
  
  demonstrateRestAPI() {
    this.networkDemoType = 'rest';
    this.resetNetworkDemo();
    this.networkLoading = true;
    
    const startTime = performance.now();
    
    this.demonstrationText = 'Making a RESTful API call to JSONPlaceholder...';
    this.networkSteps = [
      '🌐 DNS Lookup: Resolving jsonplaceholder.typicode.com',
      '🤝 TCP Connection: Establishing connection on port 443',
      '🔐 SSL/TLS Handshake: Securing the connection',
      '📤 HTTP Request: Sending GET request with headers',
      '⏳ Server Processing: Waiting for server response',
      '📥 HTTP Response: Receiving data from server',
      '✅ Connection Complete: Request finished successfully'
    ];
    
    this.animateNetworkSteps();
    
    // Simulate real network request
    this.http.get('https://jsonplaceholder.typicode.com/posts/1').subscribe({
      next: (response: any) => {
        const endTime = performance.now();
        this.networkTiming = Math.round(endTime - startTime);
        this.networkResponse = response;
        this.statusCode = 200;
        this.requestHeaders = {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        };
        this.responseHeaders = {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'max-age=43200',
          'Server': 'cloudflare',
          'Content-Length': '292'
        };
        this.networkLoading = false;
        this.demonstrationText = `✅ REST API call completed in ${this.networkTiming}ms`;
        this.showNetworkTabs = true;
      },
      error: (error) => {
        this.networkLoading = false;
        this.networkError = error.message;
        this.demonstrationText = '❌ Network request failed';
      }
    });
  }
  
  demonstrateGraphQL() {
    this.networkDemoType = 'graphql';
    this.resetNetworkDemo();
    this.networkLoading = true;
    
    const startTime = performance.now();
    
    this.demonstrationText = 'Making a GraphQL query to SpaceX API...';
    this.networkSteps = [
      '🌐 DNS Lookup: Resolving api.spacex.land',
      '🤝 TCP Connection: Establishing connection',
      '🔐 SSL/TLS Handshake: Securing the connection',
      '📤 GraphQL Query: Sending POST request with query',
      '🔍 Server Processing: Parsing and executing GraphQL query',
      '📥 GraphQL Response: Receiving structured data',
      '✅ Query Complete: GraphQL request finished'
    ];
    
    this.animateNetworkSteps();
    
    const graphqlQuery = {
      query: `
        query GetCompanyInfo {
          company {
            name
            founder
            founded
            employees
            headquarters {
              address
              city
              state
            }
          }
        }
      `
    };
    
    this.requestPayload = graphqlQuery;
    
    this.http.post('https://api.spacex.land/graphql/', graphqlQuery).subscribe({
      next: (response: any) => {
        const endTime = performance.now();
        this.networkTiming = Math.round(endTime - startTime);
        this.networkResponse = response.data;
        this.statusCode = 200;
        this.requestHeaders = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        };
        this.responseHeaders = {
          'Content-Type': 'application/json',
          'Server': 'nginx',
          'Access-Control-Allow-Origin': '*'
        };
        this.networkLoading = false;
        this.demonstrationText = `✅ GraphQL query completed in ${this.networkTiming}ms`;
        this.showNetworkTabs = true;
      },
      error: (error) => {
        this.networkLoading = false;
        this.networkError = error.message;
        this.demonstrationText = '❌ GraphQL request failed';
      }
    });
  }
  
  demonstrateFetchVariations() {
    this.networkDemoType = 'fetch-variations';
    this.resetNetworkDemo();
    this.networkLoading = true;
    
    this.demonstrationText = 'Demonstrating different HTTP methods and request types...';
    this.networkSteps = [
      '📤 GET Request: Fetching data (no body)',
      '📤 POST Request: Sending JSON data',
      '📤 PUT Request: Updating resource',
      '📤 DELETE Request: Removing resource',
      '📤 PATCH Request: Partial update',
      '📤 HEAD Request: Headers only (no body)',
      '✅ All Methods: Demonstrated successfully'
    ];
    
    this.animateNetworkSteps();
    
    const demoAPIs = [
      { method: 'GET', url: 'https://httpbin.org/get' },
      { method: 'POST', url: 'https://httpbin.org/post', data: { message: 'Hello World', timestamp: Date.now() } },
      { method: 'PUT', url: 'https://httpbin.org/put', data: { id: 1, updated: true } },
      { method: 'DELETE', url: 'https://httpbin.org/delete' }
    ];
    
    // Demonstrate multiple request types
    Promise.all([
      this.http.get(demoAPIs[0].url).toPromise(),
      this.http.post(demoAPIs[1].url, demoAPIs[1].data).toPromise()
    ]).then(responses => {
      this.networkResponse = {
        get: responses[0],
        post: responses[1]
      };
      this.statusCode = 200;
      this.networkLoading = false;
      this.demonstrationText = '✅ Multiple HTTP methods demonstrated successfully';
      this.showNetworkTabs = true;
    }).catch(error => {
      this.networkError = error.message;
      this.networkLoading = false;
      this.demonstrationText = '❌ Request demonstration failed';
    });
  }
  
  demonstrateCORS() {
    this.networkDemoType = 'cors';
    this.resetNetworkDemo();
    this.networkLoading = true;
    
    this.demonstrationText = 'Demonstrating CORS (Cross-Origin Resource Sharing)...';
    this.networkSteps = [
      '🌐 Same-Origin Request: Making request to same domain',
      '🔒 Preflight Check: Browser checking CORS policy',
      '🤝 CORS Headers: Server responding with allowed origins',
      '📤 Actual Request: Sending the real request',
      '✅ CORS Success: Request allowed by CORS policy',
      '⚠️ Alternative: Demonstrating potential CORS issues',
      '✅ Complete: CORS demonstration finished'
    ];
    
    this.animateNetworkSteps();
    
    // Use CORS-enabled API
    this.http.get('https://api.github.com/users/octocat').subscribe({
      next: (response: any) => {
        this.networkResponse = response;
        this.statusCode = 200;
        this.requestHeaders = {
          'Origin': window.location.origin,
          'Accept': 'application/json'
        };
        this.responseHeaders = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        };
        this.networkLoading = false;
        this.demonstrationText = '✅ CORS request completed successfully';
        this.showNetworkTabs = true;
      },
      error: (error) => {
        this.networkError = error.message;
        this.networkLoading = false;
        this.demonstrationText = '❌ CORS request failed';
      }
    });
  }
  
  demonstratePerformance() {
    this.networkDemoType = 'performance';
    this.resetNetworkDemo();
    this.networkLoading = true;
    
    this.demonstrationText = 'Analyzing network performance metrics...';
    this.networkSteps = [
      '⏱️ Navigation Timing: Measuring page load phases',
      '🌐 DNS Resolution Time: Domain name lookup',
      '🤝 Connection Time: TCP handshake duration',
      '🔐 SSL Time: TLS negotiation duration',
      '📤 Request Time: Time to send request',
      '📥 Response Time: Time to receive response',
      '📊 Performance Analysis: Complete timing breakdown'
    ];
    
    this.animateNetworkSteps();
    
    // Get performance timing data
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const resources = performance.getEntriesByType('resource').slice(0, 5);
    
    setTimeout(() => {
      this.networkResponse = {
        navigation: {
          domainLookupStart: navigation.domainLookupStart,
          domainLookupEnd: navigation.domainLookupEnd,
          connectStart: navigation.connectStart,
          connectEnd: navigation.connectEnd,
          secureConnectionStart: navigation.secureConnectionStart,
          requestStart: navigation.requestStart,
          responseStart: navigation.responseStart,
          responseEnd: navigation.responseEnd,
          domComplete: navigation.domComplete,
          loadEventEnd: navigation.loadEventEnd
        },
        resources: resources.map(resource => ({
          name: resource.name,
          duration: Math.round(resource.duration),
          startTime: Math.round(resource.startTime),
          transferSize: (resource as any).transferSize || 'N/A'
        })),
        metrics: {
          dnsLookupTime: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
          tcpConnectionTime: Math.round(navigation.connectEnd - navigation.connectStart),
          tlsTime: navigation.secureConnectionStart ? Math.round(navigation.connectEnd - navigation.secureConnectionStart) : 0,
          requestTime: Math.round(navigation.responseStart - navigation.requestStart),
          responseTime: Math.round(navigation.responseEnd - navigation.responseStart),
          totalTime: Math.round(navigation.loadEventEnd - navigation.fetchStart)
        }
      };
      
      this.networkLoading = false;
      this.demonstrationText = '✅ Performance analysis completed';
      this.showNetworkTabs = true;
    }, 1500);
  }
  
  private resetNetworkDemo() {
    this.networkResponse = null;
    this.networkError = '';
    this.statusCode = 0;
    this.requestHeaders = {};
    this.responseHeaders = {};
    this.requestPayload = null;
    this.networkSteps = [];
    this.currentStepIndex = 0;
    this.showNetworkTabs = false;
  }
  
  private animateNetworkSteps() {
    this.currentStepIndex = 0;
    const stepInterval = setInterval(() => {
      if (this.currentStepIndex < this.networkSteps.length - 1) {
        this.currentStepIndex++;
      } else {
        clearInterval(stepInterval);
      }
    }, 300);
  }

  // Auto Waiting Demo Methods
  simulateSlowLoadingDemo() {
    this.slowLoadingInProgress = true;
    this.slowLoadingResult = '';
    setTimeout(() => {
      this.slowLoadingInProgress = false;
      this.slowLoadingResult = '✅ Process completed! Playwright would wait for this result.';
    }, 3000);
  }

  toggleDynamicElementDemo() {
    this.showDynamicElement = !this.showDynamicElement;
  }

  enableFormInputDemo() {
    this.inputEnabled = true;
  }

  triggerAnimationDemo() {
    this.showLoadingSpinner = true;
    this.showAnimationResult = false;
    
    // Simulate animation
    this.animationScale = 'scale(0.8)';
    
    setTimeout(() => {
      this.animationScale = 'scale(1.2)';
      setTimeout(() => {
        this.animationScale = 'scale(1)';
        this.showLoadingSpinner = false;
        this.showAnimationResult = true;
        
        // Hide result after 3 seconds
        setTimeout(() => {
          this.showAnimationResult = false;
        }, 3000);
      }, 1000);
    }, 1500);
  }

  submitPracticeFormDemo() {
    if (this.practiceFormData.name && this.practiceFormData.email) {
      this.showFormSuccess = true;
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        this.showFormSuccess = false;
        // Reset form
        this.practiceFormData = {
          name: '',
          email: '',
          experience: '',
          newsletter: false
        };
      }, 5000);
    } else {
      alert('Please fill in at least name and email to test the form submission!');
    }
  }

  ngAfterViewInit() {
    // Add click handlers for network tabs
    setTimeout(() => {
      const tabButtons = document.querySelectorAll('.response-tabs .tab-btn');
      const tabPanels = document.querySelectorAll('.response-tabs .tab-panel');
      
      tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          const tabId = target.getAttribute('data-tab');
          
          // Remove active class from all buttons and panels
          tabButtons.forEach(btn => btn.classList.remove('active'));
          tabPanels.forEach(panel => panel.classList.remove('active'));
          
          // Add active class to clicked button and corresponding panel
          target.classList.add('active');
          const targetPanel = document.querySelector(`.tab-panel[data-panel="${tabId}"]`);
          if (targetPanel) {
            targetPanel.classList.add('active');
          }
        });
      });
      
      // UI elements are now initialized
    }, 100);
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

  // Shadow DOM Methods for Practice Examples

  initializeShadowDOMComponents() {
    this.createShadowButton();
    this.createShadowForm();
    this.createNestedShadowDOM();
    this.createCustomCounterElement();
    this.createDynamicShadowDOM();
  }

  createShadowButton() {
    const host = document.getElementById('shadow-button-host');
    if (!host) return;

    const shadowRoot = host.attachShadow({ mode: 'open' });
    
    shadowRoot.innerHTML = `
      <style>
        .shadow-button {
          background: linear-gradient(45deg, #007bff, #0056b3);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .shadow-button:hover {
          background: linear-gradient(45deg, #0056b3, #004085);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .shadow-button.clicked {
          background: linear-gradient(45deg, #28a745, #1e7e34);
        }
      </style>
      <button class="shadow-button" data-testid="shadow-button">
        Click Me (Shadow DOM)
      </button>
    `;

    const button = shadowRoot.querySelector('.shadow-button') as HTMLButtonElement;
    button.addEventListener('click', () => {
      button.classList.add('clicked');
      button.textContent = 'Clicked! (Shadow DOM)';
      const resultElement = document.getElementById('shadow-button-result')?.querySelector('.status-text');
      if (resultElement) {
        resultElement.textContent = 'Button clicked successfully!';
        resultElement.className = 'status-text status-success';
      }
    });
  }

  createShadowForm() {
    const host = document.getElementById('shadow-form-host');
    if (!host) return;

    const shadowRoot = host.attachShadow({ mode: 'open' });
    
    shadowRoot.innerHTML = `
      <style>
        .shadow-form {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #dee2e6;
          max-width: 400px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #495057;
        }
        .form-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
        }
        .form-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }
        .form-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        .form-button:hover {
          background: #0056b3;
        }
        .error {
          color: #dc3545;
          font-size: 12px;
          margin-top: 5px;
        }
        .success {
          color: #28a745;
          margin-top: 10px;
        }
      </style>
      <form class="shadow-form" data-testid="shadow-form">
        <div class="form-group">
          <label class="form-label" for="shadow-name">Name</label>
          <input type="text" class="form-input" name="name" id="shadow-name" data-testid="shadow-name-input" required>
          <div class="error" id="name-error"></div>
        </div>
        <div class="form-group">
          <label class="form-label" for="shadow-email">Email</label>
          <input type="email" class="form-input" name="email" id="shadow-email" data-testid="shadow-email-input" required>
          <div class="error" id="email-error"></div>
        </div>
        <div class="form-group">
          <button type="submit" class="form-button" data-testid="shadow-submit-button">Submit</button>
        </div>
        <div id="form-success" class="success" style="display: none;"></div>
      </form>
    `;

    const form = shadowRoot.querySelector('.shadow-form') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = shadowRoot.querySelector('#shadow-name') as HTMLInputElement;
      const emailInput = shadowRoot.querySelector('#shadow-email') as HTMLInputElement;
      const nameError = shadowRoot.querySelector('#name-error') as HTMLElement;
      const emailError = shadowRoot.querySelector('#email-error') as HTMLElement;
      const successDiv = shadowRoot.querySelector('#form-success') as HTMLElement;
      
      // Clear previous errors
      nameError.textContent = '';
      emailError.textContent = '';
      successDiv.style.display = 'none';
      
      let isValid = true;
      
      if (!nameInput.value.trim()) {
        nameError.textContent = 'Name is required';
        isValid = false;
      }
      
      if (!emailInput.value.trim()) {
        emailError.textContent = 'Email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email';
        isValid = false;
      }
      
      if (isValid) {
        successDiv.textContent = `Form submitted successfully! Name: ${nameInput.value}, Email: ${emailInput.value}`;
        successDiv.style.display = 'block';
        
        const resultElement = document.getElementById('shadow-form-result')?.querySelector('.status-text');
        if (resultElement) {
          resultElement.textContent = `Submitted: ${nameInput.value} (${emailInput.value})`;
          resultElement.className = 'status-text status-success';
        }
      }
    });
  }

  createNestedShadowDOM() {
    const host = document.getElementById('nested-shadow-host');
    if (!host) return;

    const shadowRoot = host.attachShadow({ mode: 'open' });
    
    shadowRoot.innerHTML = `
      <style>
        .parent-container {
          background: #e3f2fd;
          padding: 20px;
          border-radius: 8px;
          border: 2px solid #2196f3;
        }
        .parent-title {
          color: #1976d2;
          font-weight: bold;
          margin-bottom: 15px;
        }
      </style>
      <div class="parent-container">
        <div class="parent-title">Parent Shadow DOM Component</div>
        <div id="child-host" class="child-component" data-testid="child-component"></div>
      </div>
    `;

    const childHost = shadowRoot.getElementById('child-host');
    if (childHost) {
      const childShadow = childHost.attachShadow({ mode: 'open' });
      
      childShadow.innerHTML = `
        <style>
          .child-container {
            background: #fff3e0;
            padding: 15px;
            border-radius: 6px;
            border: 2px solid #ff9800;
          }
          .child-button {
            background: #ff9800;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          }
          .child-button:hover {
            background: #f57c00;
          }
          .child-button.active {
            background: #4caf50;
          }
        </style>
        <div class="child-container">
          <div style="color: #e65100; font-weight: bold; margin-bottom: 10px;">Child Shadow DOM Component</div>
          <button class="child-button" data-testid="nested-child-button">Nested Shadow Button</button>
        </div>
      `;

      const childButton = childShadow.querySelector('.child-button') as HTMLButtonElement;
      childButton.addEventListener('click', () => {
        childButton.classList.add('active');
        childButton.textContent = 'Nested Button Clicked!';
        
        const resultElement = document.getElementById('nested-shadow-result')?.querySelector('.status-text');
        if (resultElement) {
          resultElement.textContent = 'Nested shadow DOM interaction successful!';
          resultElement.className = 'status-text status-success';
        }
      });
    }
  }

  createCustomCounterElement() {
    if (!customElements.get('custom-counter')) {
      class CustomCounter extends HTMLElement {
        private count: number = 0;
        private countDisplay: HTMLElement | null = null;
        private customShadowRoot: ShadowRoot;

        constructor() {
          super();
          this.customShadowRoot = this.attachShadow({ mode: 'open' });
          this.count = parseInt(this.getAttribute('initial-count') || '0');
        }

        connectedCallback() {
          this.render();
          this.setupEventListeners();
        }

        render() {
          this.customShadowRoot.innerHTML = `
            <style>
              .counter-container {
                background: #f3e5f5;
                padding: 20px;
                border-radius: 8px;
                border: 2px solid #9c27b0;
                text-align: center;
                max-width: 300px;
              }
              .counter-title {
                color: #7b1fa2;
                font-weight: bold;
                margin-bottom: 15px;
              }
              .counter-display {
                font-size: 24px;
                font-weight: bold;
                color: #4a148c;
                margin: 15px 0;
                padding: 10px;
                background: white;
                border-radius: 4px;
              }
              .counter-button {
                background: #9c27b0;
                color: white;
                border: none;
                padding: 8px 16px;
                margin: 0 5px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
              }
              .counter-button:hover {
                background: #7b1fa2;
              }
              .counter-button.reset {
                background: #f44336;
              }
              .counter-button.reset:hover {
                background: #d32f2f;
              }
            </style>
            <div class="counter-container">
              <div class="counter-title">Custom Counter Element</div>
              <div class="counter-display" data-testid="counter-display">${this.count}</div>
              <div>
                <button class="counter-button increment" data-testid="increment-button">+</button>
                <button class="counter-button decrement" data-testid="decrement-button">-</button>
                <button class="counter-button reset" data-testid="reset-button">Reset</button>
              </div>
            </div>
          `;

          this.countDisplay = this.customShadowRoot.querySelector('.counter-display');
        }

        setupEventListeners() {
          const incrementBtn = this.customShadowRoot.querySelector('.increment') as HTMLButtonElement;
          const decrementBtn = this.customShadowRoot.querySelector('.decrement') as HTMLButtonElement;
          const resetBtn = this.customShadowRoot.querySelector('.reset') as HTMLButtonElement;

          incrementBtn.addEventListener('click', () => {
            this.count++;
            this.updateDisplay();
          });

          decrementBtn.addEventListener('click', () => {
            this.count--;
            this.updateDisplay();
          });

          resetBtn.addEventListener('click', () => {
            this.count = 0;
            this.updateDisplay();
          });
        }

        updateDisplay() {
          if (this.countDisplay) {
            this.countDisplay.textContent = this.count.toString();
          }
          
          const resultElement = document.getElementById('custom-element-result')?.querySelector('.status-text');
          if (resultElement) {
            resultElement.textContent = this.count.toString();
            resultElement.className = 'status-text status-info';
          }
        }
      }

      customElements.define('custom-counter', CustomCounter);
    }
  }

  createDynamicShadowDOM() {
    const host = document.getElementById('dynamic-shadow-host');
    if (!host) return;

    const shadowRoot = host.attachShadow({ mode: 'open' });
    
    shadowRoot.innerHTML = `
      <style>
        .dynamic-container {
          background: #e8f5e8;
          padding: 20px;
          border-radius: 8px;
          border: 2px solid #4caf50;
        }
        .dynamic-title {
          color: #2e7d32;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .load-button {
          background: #4caf50;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 15px;
        }
        .load-button:hover {
          background: #388e3c;
        }
        .load-button:disabled {
          background: #c8e6c9;
          cursor: not-allowed;
        }
        .dynamic-content {
          min-height: 100px;
        }
        .loading {
          color: #666;
          font-style: italic;
        }
        .dynamic-item {
          background: white;
          padding: 10px;
          margin: 5px 0;
          border-radius: 4px;
          border-left: 4px solid #4caf50;
        }
        .loaded-content {
          animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
      <div class="dynamic-container">
        <div class="dynamic-title">Dynamic Shadow DOM Content</div>
        <button class="load-button" data-testid="load-content-button">Load Dynamic Content</button>
        <div class="dynamic-content" id="dynamic-content">
          <div class="loading">Click the button to load content...</div>
        </div>
      </div>
    `;

    const loadButton = shadowRoot.querySelector('.load-button') as HTMLButtonElement;
    const contentDiv = shadowRoot.querySelector('#dynamic-content') as HTMLElement;
    
    loadButton.addEventListener('click', () => {
      loadButton.disabled = true;
      loadButton.textContent = 'Loading...';
      contentDiv.innerHTML = '<div class="loading">Loading dynamic content...</div>';
      
      setTimeout(() => {
        const items = [
          'Dynamic Item 1: User Profile Data',
          'Dynamic Item 2: Recent Activities',
          'Dynamic Item 3: Notification Settings',
          'Dynamic Item 4: Security Preferences'
        ];
        
        contentDiv.innerHTML = '<div class="loaded-content">' + 
          items.map(item => `<div class="dynamic-item" data-testid="dynamic-item">${item}</div>`).join('') +
          '</div>';
        
        loadButton.disabled = false;
        loadButton.textContent = 'Reload Content';
        
        const resultElement = document.getElementById('dynamic-shadow-result')?.querySelector('.status-text');
        if (resultElement) {
          resultElement.textContent = `Loaded ${items.length} items successfully`;
          resultElement.className = 'status-text status-success';
        }
      }, 2000);
    });
  }

  // Simple Shadow DOM method for basic testing
  initializeSimpleShadowDOM() {
    const shadowHost = document.getElementById('shadow-button-host');
    if (!shadowHost) {
      console.log('Shadow host element not found');
      return;
    }

    // Check if shadow root already exists
    if (shadowHost.shadowRoot) {
      return;
    }

    const shadow = shadowHost.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        button {
          background: #3498db;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        button:hover {
          background: #2980b9;
          transform: translateY(-1px);
        }
        button.clicked {
          background: #27ae60;
        }
      </style>
      <button data-testid="shadow-button">Click Me</button>
    `;

    const button = shadow.querySelector('button');
    if (button) {
      button.addEventListener('click', () => {
        button.textContent = 'Clicked!';
        button.classList.add('clicked');
        const resultSpan = document.querySelector('#shadow-button-result');
        if (resultSpan) {
          resultSpan.textContent = 'Button clicked successfully!';
        }
      });
    }
  }

  // Authentication Methods for Playwright Session Storage Testing
  
  checkExistingSession() {
    try {
      const sessionData = localStorage.getItem('authSession');
      const localStorageData = localStorage.getItem('userPreferences');
      
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        this.currentUser = parsed;
        this.isAuthenticated = true;
        this.authenticationStatus = `Welcome back, ${parsed.name}! Session restored from localStorage.`;
      }
      
      // Also check sessionStorage
      const sessionStorageData = sessionStorage.getItem('tempAuthData');
      if (sessionStorageData) {
        const tempData = JSON.parse(sessionStorageData);
        this.sessionData = tempData;
      }
    } catch (error) {
      console.log('No existing session found');
      this.authenticationStatus = 'No existing session found.';
    }
  }
  
  login() {
    if (this.loginForm.invalid) {
      this.authenticationStatus = 'Please fill in all required fields.';
      return;
    }
    
    const { username, password } = this.loginForm.value;
    const user = this.authUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
      this.currentUser = user;
      this.isAuthenticated = true;
      
      // Save to localStorage for persistent session
      localStorage.setItem('authSession', JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        permissions: user.permissions,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      }));
      
      // Save user preferences to localStorage
      localStorage.setItem('userPreferences', JSON.stringify({
        theme: 'default',
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        lastLogin: new Date().toISOString()
      }));
      
      // Save temporary session data to sessionStorage
      sessionStorage.setItem('tempAuthData', JSON.stringify({
        sessionId: 'session_' + Math.random().toString(36).substr(2, 9),
        browserSession: true,
        loginMethod: 'form',
        ipAddress: '192.168.1.100', // Mock IP
        userAgent: navigator.userAgent.substring(0, 50) + '...'
      }));
      
      this.authenticationStatus = `Successfully logged in as ${user.name} (${user.role}). Session data saved to both localStorage and sessionStorage.`;
      
      // Mark authentication module as interacted
      this.moduleInteractions['authentication'] = (this.moduleInteractions['authentication'] || 0) + 1;
      if (this.moduleInteractions['authentication'] >= 2) {
        this.completedModules.add('authentication');
      }
      
    } else {
      this.authenticationStatus = 'Invalid credentials. Try admin/admin123, manager/manager123, or user/user123';
    }
  }
  
  logout() {
    // Clear all authentication data
    localStorage.removeItem('authSession');
    localStorage.removeItem('userPreferences');
    sessionStorage.removeItem('tempAuthData');
    
    this.currentUser = null;
    this.isAuthenticated = false;
    this.sessionData = {};
    this.authenticationStatus = 'Logged out successfully. All session data cleared.';
    this.loginForm.reset();
  }
  
  performProtectedAction() {
    if (this.isAuthenticated && this.currentUser) {
      const actions = {
        'admin': 'Admin action: Full system access granted',
        'manager': 'Manager action: Content management access granted', 
        'user': 'User action: Read-only access confirmed'
      };
      
      this.protectedActionResult = actions[this.currentUser.role as keyof typeof actions] || 'Action completed';
      
      // Auto-clear after 3 seconds
      setTimeout(() => {
        this.protectedActionResult = '';
      }, 3000);
    }
  }
  
  refreshPage() {
    window.location.reload();
  }
  
  quickLogin(userType: 'admin' | 'manager' | 'user') {
    const user = this.authUsers.find(u => u.role === userType);
    if (user) {
      this.loginForm.patchValue({
        username: user.username,
        password: user.password
      });
      this.login();
    }
  }
  
  saveToSessionStorage() {
    const customData = {
      customKey1: 'Custom Value for Testing',
      customKey2: Math.random().toString(36),
      timestamp: new Date().toISOString(),
      complexObject: {
        nested: {
          data: 'This is nested data',
          array: [1, 2, 3, 'test']
        }
      }
    };
    
    sessionStorage.setItem('customTestData', JSON.stringify(customData));
    sessionStorage.setItem('simpleKey', 'Simple string value');
    sessionStorage.setItem('numberKey', '42');
    
    this.authenticationStatus = 'Custom data saved to sessionStorage for testing purposes.';
  }
  
  saveToLocalStorage() {
    const persistentData = {
      userId: this.currentUser?.id || 'anonymous',
      settings: {
        theme: 'dark',
        notifications: true,
        autoSave: true
      },
      history: [
        'action1_' + Date.now(),
        'action2_' + Date.now(),
        'action3_' + Date.now()
      ]
    };
    
    localStorage.setItem('appSettings', JSON.stringify(persistentData));
    localStorage.setItem('lastVisit', new Date().toISOString());
    localStorage.setItem('visitCount', (parseInt(localStorage.getItem('visitCount') || '0') + 1).toString());
    
    this.authenticationStatus = 'Custom data saved to localStorage for testing purposes.';
  }
  
  clearStorageData(storageType: 'localStorage' | 'sessionStorage' | 'both') {
    if (storageType === 'localStorage' || storageType === 'both') {
      localStorage.clear();
    }
    if (storageType === 'sessionStorage' || storageType === 'both') {
      sessionStorage.clear();
    }
    
    if (storageType === 'both') {
      this.currentUser = null;
      this.isAuthenticated = false;
      this.sessionData = {};
      this.loginForm.reset();
    }
    
    this.authenticationStatus = `${storageType} cleared successfully.`;
  }
  
  getStorageInfo() {
    const localStorageKeys = Object.keys(localStorage);
    const sessionStorageKeys = Object.keys(sessionStorage);
    
    return {
      localStorage: {
        keys: localStorageKeys,
        count: localStorageKeys.length,
        data: localStorageKeys.reduce((acc: any, key) => {
          try {
            acc[key] = JSON.parse(localStorage.getItem(key) || '');
          } catch {
            acc[key] = localStorage.getItem(key);
          }
          return acc;
        }, {})
      },
      sessionStorage: {
        keys: sessionStorageKeys,
        count: sessionStorageKeys.length,
        data: sessionStorageKeys.reduce((acc: any, key) => {
          try {
            acc[key] = JSON.parse(sessionStorage.getItem(key) || '');
          } catch {
            acc[key] = sessionStorage.getItem(key);
          }
          return acc;
        }, {})
      }
    };
  }

  // iFrame methods
  loadSimpleFrame(): void {
    this.frameLoading = true;
    // Create a comprehensive simple form for Playwright practice
    const frameContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Playwright Practice Form</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            padding: 2rem; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            line-height: 1.6;
            margin: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }
          h1 { 
            text-align: center; 
            color: #4a5568; 
            margin-bottom: 0.5rem;
            font-size: 1.8rem;
          }
          .subtitle {
            text-align: center;
            color: #718096;
            margin-bottom: 2rem;
            font-size: 1rem;
          }
          .form-group { 
            margin-bottom: 1.5rem; 
          }
          label { 
            display: block; 
            margin-bottom: 0.5rem; 
            font-weight: 600; 
            color: #2d3748;
          }
          input, textarea, select { 
            width: 100%; 
            padding: 0.75rem 1rem; 
            border: 2px solid #e2e8f0; 
            border-radius: 6px; 
            font-size: 1rem;
            transition: border-color 0.3s ease;
          }
          input:focus, textarea:focus, select:focus {
            outline: none;
            border-color: #4299e1;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
          }
          .checkbox-group {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .checkbox-group input {
            width: auto;
          }
          .radio-group {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }
          .radio-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .radio-item input {
            width: auto;
          }
          .btn-group {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
          }
          button { 
            background: #4299e1; 
            color: white; 
            padding: 0.75rem 2rem; 
            border: none; 
            border-radius: 6px; 
            cursor: pointer; 
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          button:hover { 
            background: #3182ce; 
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          }
          button:active {
            transform: translateY(0);
          }
          .btn-clear {
            background: #e53e3e;
          }
          .btn-clear:hover {
            background: #c53030;
          }
          .success-message { 
            background: #c6f6d5; 
            color: #22543d; 
            padding: 1rem; 
            border-radius: 6px; 
            margin-top: 1rem; 
            display: none;
            border: 2px solid #9ae6b4;
            text-align: center;
            font-weight: 600;
          }
          .form-info {
            background: #ebf8ff;
            border: 1px solid #90cdf4;
            border-radius: 6px;
            padding: 1rem;
            margin-bottom: 1.5rem;
          }
          .form-info h3 {
            margin: 0 0 0.5rem 0;
            color: #2b6cb0;
          }
          .form-info ul {
            margin: 0;
            padding-left: 1.2rem;
            color: #2c5282;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎭 Playwright Practice Form</h1>
          <p class="subtitle">Simple form for iframe automation testing</p>
          
          <div class="form-info">
            <h3>📋 Form Elements to Practice:</h3>
            <ul>
              <li>Text inputs with various types</li>
              <li>Dropdown selection</li>
              <li>Checkboxes and radio buttons</li>
              <li>Textarea for messages</li>
              <li>Form submission and validation</li>
            </ul>
          </div>

          <form id="practiceForm">
            <div class="form-group">
              <label for="name">Full Name *</label>
              <input type="text" id="name" data-testid="frame-name-input" 
                     placeholder="Enter your full name" required>
            </div>

            <div class="form-group">
              <label for="email">Email Address *</label>
              <input type="email" id="email" data-testid="frame-email-input" 
                     placeholder="Enter your email address" required>
            </div>

            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input type="tel" id="phone" data-testid="frame-phone-input" 
                     placeholder="Enter your phone number">
            </div>

            <div class="form-group">
              <label for="country">Country</label>
              <select id="country" data-testid="frame-country-select">
                <option value="">Select your country</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="ca">Canada</option>
                <option value="au">Australia</option>
                <option value="in">India</option>
                <option value="de">Germany</option>
                <option value="fr">France</option>
                <option value="jp">Japan</option>
              </select>
            </div>

            <div class="form-group">
              <label>Experience Level</label>
              <div class="radio-group">
                <div class="radio-item">
                  <input type="radio" id="beginner" name="experience" value="beginner" data-testid="experience-beginner">
                  <label for="beginner">Beginner</label>
                </div>
                <div class="radio-item">
                  <input type="radio" id="intermediate" name="experience" value="intermediate" data-testid="experience-intermediate">
                  <label for="intermediate">Intermediate</label>
                </div>
                <div class="radio-item">
                  <input type="radio" id="advanced" name="experience" value="advanced" data-testid="experience-advanced">
                  <label for="advanced">Advanced</label>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" data-testid="frame-message-textarea" rows="4" 
                        placeholder="Tell us about your testing experience or ask any questions..."></textarea>
            </div>

            <div class="form-group">
              <div class="checkbox-group">
                <input type="checkbox" id="newsletter" data-testid="frame-newsletter-checkbox">
                <label for="newsletter">Subscribe to newsletter for testing tips</label>
              </div>
            </div>

            <div class="form-group">
              <div class="checkbox-group">
                <input type="checkbox" id="terms" data-testid="frame-terms-checkbox">
                <label for="terms">I agree to the terms and conditions *</label>
              </div>
            </div>

            <div class="btn-group">
              <button type="button" data-testid="frame-submit-btn" onclick="submitForm()">
                ✅ Submit Form
              </button>
              <button type="button" class="btn-clear" data-testid="frame-clear-btn" onclick="clearForm()">
                🧹 Clear Form
              </button>
            </div>

            <div class="success-message" data-testid="success-message" id="successMsg">
              <h3>🎉 Form Submitted Successfully!</h3>
              <p>Thank you for practicing with Playwright automation. All form data has been captured.</p>
            </div>
          </form>
        </div>

        <script>
          function submitForm() {
            const form = document.getElementById('practiceForm');
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const terms = document.getElementById('terms').checked;
            
            // Simple validation
            if (!name.trim()) {
              alert('Please enter your name');
              document.getElementById('name').focus();
              return;
            }
            
            if (!email.trim()) {
              alert('Please enter your email');
              document.getElementById('email').focus();
              return;
            }
            
            if (!terms) {
              alert('Please agree to terms and conditions');
              document.getElementById('terms').focus();
              return;
            }
            
            // Show success message
            document.getElementById('successMsg').style.display = 'block';
            
            // Scroll to success message
            document.getElementById('successMsg').scrollIntoView({ behavior: 'smooth' });
          }
          
          function clearForm() {
            document.getElementById('practiceForm').reset();
            document.getElementById('successMsg').style.display = 'none';
          }
          
          // Add some interactivity for better practice
          document.addEventListener('DOMContentLoaded', function() {
            // Auto-hide success message after 5 seconds
            let successTimeout;
            
            document.getElementById('practiceForm').addEventListener('input', function() {
              if (successTimeout) {
                clearTimeout(successTimeout);
              }
              document.getElementById('successMsg').style.display = 'none';
            });
          });
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([frameContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    
    setTimeout(() => {
      this.frameLoading = false;
      this.frameLoaded = true;
    }, 1000);
  }

  // Module 1: Dynamic UI
  dynamicButton = { loading: false, text: '🚀 Trigger Random Delay' };
  apiLoadingElement = { visible: false, text: '✅ Element appeared after random delay!' };
  conditionalButton = { enabled: true, condition: '✅ Click Me Now!' };
  dynamicIdCounter = 0;
  rerenderCounter = 0;

  triggerRandomDelayElement() {
    this.dynamicButton.loading = true;
    this.dynamicButton.text = '⏳ Loading...';
    this.apiLoadingElement.visible = false;
    const randomDelay = Math.floor(Math.random() * 7000) + 1000;
    setTimeout(() => {
      this.dynamicButton.loading = false;
      this.dynamicButton.text = '🚀 Trigger Random Delay';
      this.apiLoadingElement.visible = true;
    }, randomDelay);
  }

  toggleConditionalButton() {
    if (this.conditionalButton.enabled) {
      this.conditionalButton.enabled = false;
      this.conditionalButton.condition = '⏳ Button will enable in 3 seconds...';
      setTimeout(() => {
        this.conditionalButton.enabled = true;
        this.conditionalButton.condition = '✅ Click Me Now!';
      }, 3000);
    }
  }

  changeDynamicId() { this.dynamicIdCounter++; }
  triggerRerender() { this.rerenderCounter++; }

  // Module 2: Role-Based Access
  currentRole: 'admin' | 'user' | 'guest' | null = null;
  roleAuthMessage = '';
  roleUsers = [
    { name: 'Alice Admin', role: 'admin' as 'admin' | 'user' | 'guest', username: 'admin@test.com', password: 'admin123' },
    { name: 'Bob User', role: 'user' as 'admin' | 'user' | 'guest', username: 'user@test.com', password: 'user123' },
    { name: 'Charlie Guest', role: 'guest' as 'admin' | 'user' | 'guest', username: 'guest@test.com', password: 'guest123' }
  ];

  loginWithRole(role: 'admin' | 'user' | 'guest') {
    this.currentRole = role;
    if (role === 'admin') this.roleAuthMessage = '👑 Full access granted! You can view and modify all data.';
    else if (role === 'user') this.roleAuthMessage = '👤 Standard access. You can view data and edit your own content.';
    else this.roleAuthMessage = '👁️ Read-only access. You can only view public information.';
  }

  logoutRole() { this.currentRole = null; this.roleAuthMessage = ''; }

  // Module 3: Localization
  currentLocale: 'en' | 'fr' | 'de' = 'en';
  sampleDate = new Date('2024-01-15');
  samplePrice = 99.99;
  translations = {
    en: { welcome: 'Welcome to Playwright Testing', description: 'Master automation testing with real-world scenarios', button: 'Get Started' },
    fr: { welcome: 'Bienvenue aux tests Playwright', description: 'Maîtrisez les tests d\'automation avec des scénarios réels', button: 'Commencer' },
    de: { welcome: 'Willkommen beim Playwright-Testing', description: 'Meistern Sie Automatisierungstests mit realen Szenarien', button: 'Loslegen' }
  };

  switchLocale(locale: 'en' | 'fr' | 'de') { this.currentLocale = locale; }

  get formattedDateEN(): string {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(this.sampleDate);
  }

  get formattedDateFR(): string {
    return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(this.sampleDate);
  }

  get formattedDateDE(): string {
    return new Intl.DateTimeFormat('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(this.sampleDate);
  }

  get formattedCurrencyUSD(): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.samplePrice);
  }

  get formattedCurrencyEUR(): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(this.samplePrice);
  }

  // Module 4: Accessibility
  currentTheme: 'light' | 'dark' = 'light';
  keyboardNavigationItems = ['1. Press Tab to move to next element', '2. Press Shift+Tab to move to previous element', '3. Press Enter to activate buttons', '4. Press Escape to close modals'];
  switchTheme() { this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light'; }

  // Module 5: Visual Regression
  currentViewport = 'desktop';
  visualChangeTrigger = false;
  viewportSizes = [
    { name: 'mobile', icon: '📱', width: 375, height: 667 },
    { name: 'tablet', icon: '�', width: 768, height: 1024 },
    { name: 'desktop', icon: '💻', width: 1920, height: 1080 }
  ];

  switchViewport(viewport: string) { 
    this.currentViewport = viewport;
    // Note: In real testing, Playwright would use page.setViewportSize()
    // This is for demonstration - showing the viewport state changes
  }
  triggerVisualChange() { this.visualChangeTrigger = !this.visualChangeTrigger; }

  // Module 6: Error Handling
  errorResponse = '';
  errorFormData = { email: '', phone: '', age: null as number | null };
  errorFormErrors: string[] = [];
  retryInProgress = false;
  retryAttempts = 0;
  retrySuccess = false;

  simulateApiError(statusCode: '401' | '403' | '500' | 'network' | 'timeout') {
    this.errorResponse = '';
    setTimeout(() => {
      if (statusCode === '401') this.errorResponse = 'Error 401: Unauthorized\nYou need to log in to access this resource.';
      else if (statusCode === '403') this.errorResponse = 'Error 403: Forbidden\nYou don\'t have permission to access this resource.';
      else if (statusCode === '500') this.errorResponse = 'Error 500: Internal Server Error\nSomething went wrong on our end. Please try again later.';
    }, 300);
  }

  simulateTimeout() { this.errorResponse = 'Request Timeout\nThe server took too long to respond. Please try again.'; }

  validateErrorForm() {
    this.errorFormErrors = [];
    if (!this.errorFormData.email || !this.errorFormData.email.includes('@')) this.errorFormErrors.push('Invalid email format');
    if (this.errorFormData.phone && !/^\d+$/.test(this.errorFormData.phone)) this.errorFormErrors.push('Phone number must contain only digits');
    if (this.errorFormData.age !== null && this.errorFormData.age < 0) this.errorFormErrors.push('Age cannot be negative');
  }

  testRetryLogic() {
    this.retryInProgress = true;
    this.retrySuccess = false;
    this.retryAttempts = 0;
    const attemptRetry = () => {
      this.retryAttempts++;
      const randomSuccess = Math.random() > 0.5;
      if (randomSuccess || this.retryAttempts >= 3) {
        this.retrySuccess = true;
        this.retryInProgress = false;
      } else {
        setTimeout(attemptRetry, 1000);
      }
    };
    attemptRetry();
  }
}