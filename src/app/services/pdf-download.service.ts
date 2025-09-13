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
    console.log('Attempting to download PDF for course:', courseName);
    
    const pdfMappings: { [key: string]: string } = {
      'Playwright Automation Testing Training': 'assets/syllabus/Playwright Automation Testing Training.pdf',
      'Java Development Training': 'assets/syllabus/Java Development Training.pdf',
      'Security Testing Training': 'assets/syllabus/Security Testing Training.pdf',
      // Add more course PDF mappings here as needed
    };

    const pdfPath = pdfMappings[courseName];
    console.log('PDF path found:', pdfPath);
    
    if (!pdfPath) {
      console.error(`PDF not found for course: ${courseName}`);
      console.log('Available courses:', Object.keys(pdfMappings));
      alert('PDF syllabus not available for this course yet. Please contact us for more details.');
      return;
    }

    console.log('Fetching PDF from:', pdfPath);
    
    // Try to fetch the file first to check if it exists
    fetch(pdfPath)
      .then(response => {
        console.log('Fetch response status:', response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        console.log('Blob received, size:', blob.size);
        // Create a blob URL and download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${courseName.replace(/\s+/g, '-').toLowerCase()}-syllabus.pdf`;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        window.URL.revokeObjectURL(url);
        console.log('Download initiated successfully');
      })
      .catch(error => {
        console.error('Error downloading PDF:', error);
        console.error('Failed URL:', pdfPath);
        alert(`Error downloading PDF: ${error.message}. Please check console for details.`);
      });
  }
}
