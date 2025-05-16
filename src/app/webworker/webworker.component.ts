import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import { createPdfBytes } from './createPdfBytes';

@Component({
  selector: 'app-webworker',
  imports: [],
  templateUrl: './webworker.component.html',
  styleUrl: './webworker.component.css'
})
export class WebworkerComponent {
  counter = 1;

  generatePdf() {
    /**
    const data = createPdfBytes();
    const blob = new Blob([data], { type: 'application/pdf' });
    saveAs(blob, 'document.pdf');
    **/

    // /**
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('./app.worker.ts', import.meta.url));
      worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
        const blob = new Blob([data], { type: 'application/pdf' });

        saveAs(blob, 'document.pdf');
        worker.terminate();
      };
      worker.postMessage('hello');
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
    // **/
  }

  decrementCounter() {
    this.counter = this.counter - 1;
  }
  incrementCounter() {
    this.counter = this.counter + 1;
  }

}
