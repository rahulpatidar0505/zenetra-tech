import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private formspreeUrl = 'https://formspree.io/f/YOUR_FORMSPREE_ID'; // Replace with your Formspree form ID
  
  constructor(private http: HttpClient) {}
  
  /**
   * Send an email using Formspree (no API key needed, works out of the box)
   * @param data Form data containing name, email, message
   */
  sendEmail(data: any): Observable<any> {
    const formData = {
      name: data.name,
      email: data.email,
      message: data.message,
      _subject: `Contact Form Submission from ${data.name}`,
      _replyto: data.email,
      _to: 'contactus@zenetratechnologies.com'
    };
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    // For demo purpose, simulate a successful response
    // REMOVE THIS FOR PRODUCTION AND UNCOMMENT THE ACTUAL HTTP REQUEST BELOW
    console.log('Form data that would be sent:', formData);
    return of({ success: true });
    
    // UNCOMMENT THIS FOR PRODUCTION
    // return this.http.post(this.formspreeUrl, formData, { headers })
    //   .pipe(
    //     catchError(error => {
    //       console.error('Error sending email:', error);
    //       return of({ error: true, message: 'Failed to send email' });
    //     })
    //   );
  }
}
