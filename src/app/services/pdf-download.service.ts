import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor() { }

  public downloadCoursePdf(courseName: string): void {
    this.downloadPdfFromAssets(courseName);
  }

  public downloadAllCoursesPdf(): void {
    // For now, just download the Playwright course PDF
    // You can extend this later for multiple courses
    this.downloadPdfFromAssets('Playwright Automation');
  }

  private downloadPdfFromAssets(courseName: string): void {
    const pdfMappings: { [key: string]: string } = {
      'Playwright Automation Testing Training': '/assets/syllabus/Playwright Automation Testing Training.pdf',
      'Playwright Automation': '/assets/syllabus/Playwright Automation Testing Training.pdf',
      'Java Development': '/assets/syllabus/Java Development Training.pdf',
      'Security Testing': '/assets/syllabus/Security Testing Training.pdf',
      // Add more course PDF mappings here as needed
    };

    const pdfPath = pdfMappings[courseName];
    
    if (!pdfPath) {
      console.error(`PDF not found for course: ${courseName}`);
      alert('PDF syllabus not available for this course yet. Please contact us for more details.');
      return;
    }

    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = `${courseName.replace(/\s+/g, '-').toLowerCase()}-syllabus.pdf`;
    link.style.display = 'none';
    
    // Add link to DOM, click it, then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
