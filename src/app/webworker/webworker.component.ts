import { Component } from '@angular/core';

@Component({
  selector: 'app-webworker',
  imports: [],
  templateUrl: './webworker.component.html',
  styleUrl: './webworker.component.css'
})
export class WebworkerComponent {

  generatePdf() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('./app.worker.ts', import.meta.url));
      worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
      };
      worker.postMessage('hello');
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

}
