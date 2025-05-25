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
}
