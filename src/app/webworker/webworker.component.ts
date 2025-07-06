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
    const data = createPdfBytes();
    const blob = new Blob([data], { type: 'application/pdf' });
    saveAs(blob, 'document.pdf');
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
      const worker = new Worker(new URL('./pdfComplete.worker.ts', import.meta.url));
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
      const worker = new Worker(new URL('./pdfCompleteApi.worker.ts', import.meta.url));
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
      worker.postMessage('/api/DownloadFiles/SampleFile?filename=sampledocs-100mb-pdf-file&ext=pdf');
    }
  }

  downloadFileWithCharts() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./charts.worker.ts', import.meta.url));
      worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
        const blob = new Blob([data], { type: 'application/pdf' });

        saveAs(blob, 'document.pdf');
        worker.terminate();
      };
      // Bar chart data
      const barChartData = {
        title: 'Sales Report',
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        values: [120, 150, 170, 200],
        type: 'bar',
        data: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [{
            label: 'Sales',
            data: [120, 150, 170, 200],
            backgroundColor: 'rgba(75, 192, 192, 0.5)'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Sales Report' }
          }
        }
      };
      // Pie chart data
      const pieChartData = {
        title: 'Market Share',
        labels: ['Product A', 'Product B', 'Product C'],
        values: [45, 30, 25],
        type: 'pie',
        data: {
          labels: ['Product A', 'Product B', 'Product C'],
          datasets: [{
            label: 'Market Share',
            data: [45, 30, 25],
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Market Share' }
          }
        }
      };
      // Send both chart data objects to the worker
      worker.postMessage({ charts: [barChartData, pieChartData] });
    }
  }
}
