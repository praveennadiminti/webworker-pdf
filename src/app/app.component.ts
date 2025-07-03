import { Component } from '@angular/core';
import { WebworkerComponent } from "./webworker/webworker.component"

@Component({
  selector: 'app-root',
  imports: [WebworkerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'webworker-pdf';
}