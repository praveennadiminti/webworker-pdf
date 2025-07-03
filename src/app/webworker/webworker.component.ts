import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import { createPdfBytes } from './createPdfBytes';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-webworker',
  imports: [],
  templateUrl: './webworker.component.html',
  styleUrl: './webworker.component.css'
})
export class WebworkerComponent {

  counter = 1;

  generatePdf() {
    // /**
    const data = createPdfBytes();
    const blob = new Blob([data], { type: 'application/pdf' });
    saveAs(blob, 'document.pdf');
    // **/

    /**
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./app.worker.ts', import.meta.url));
      worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
        const blob = new Blob([data], { type: 'application/pdf' });

        saveAs(blob, 'document.pdf');
        worker.terminate();
      };
      worker.postMessage('hello');
    }
    **/
  }

  decrementCounter() {
    this.counter = this.counter - 1;
  }
  incrementCounter() {
    this.counter = this.counter + 1;
  }

  generatePdfFromHtml() {

    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('./pdfTemplate.worker.ts', import.meta.url));
      worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
        // const doc = new jsPDF();
        // doc.html(data,
        //   {
        //     callback: function (generatedDoc) {
        //       generatedDoc.save();
        //     }
        //   });
        var printWindow = window.open('', '', 'height=400,width=800');
        if (printWindow) {
          printWindow.document.write(data);
          printWindow.document.close();
          printWindow.print();
        }
        worker.terminate();
      };
      worker.postMessage('hello');
    }
  }

  generatePdfCompleteFromWebWorker() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./app2.worker.ts', import.meta.url));
      worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
        const blob = new Blob([data], { type: 'application/pdf' });

        saveAs(blob, 'document.pdf');
        worker.terminate();
      };
      worker.postMessage('hello');
    }
  }

  generatePdfFromWebWorkerAPI() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./app3.worker.ts', import.meta.url));
      worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
        const blob = new Blob([data], { type: 'application/pdf' });

        saveAs(blob, 'document.pdf');
        worker.terminate();
      };
      worker.postMessage('hello');
    }
  }

  downloadLargeFile() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./largeFile.worker.ts', import.meta.url));
      worker.onmessage = ({ data }) => {
        if (data.progress) {
          // Log progress updates from the worker
          console.log(`Download progress: ${data.progress}%`);
        } else if (data.done) {
          // Log when the file is fully received
          console.log('File download complete, size:', data.fileData.length, 'bytes');
          // When the file is fully received
          const blob = new Blob([data.fileData], { type: 'application/pdf' });
          saveAs(blob, 'largeFile.pdf');
          worker.terminate();
        } else {
          // Fallback for unexpected messages
          console.log('Received unknown message from worker:', data);
        }
      };
      // Example of a large data URL (replace with your actual large file endpoint)
      // For demonstration, using a sample large PDF file from the internet:
      // Use the proxy to avoid CORS issues
      worker.postMessage('/api/DownloadFiles/SampleFile?filename=sampledocs-100mb-pdf-file&ext=pdf');
    }
  }
}
