import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header'; // ajusta si tu archivo se llama header.ts
import { FooterComponent } from './shared/footer/footer'; // ajusta si tu archivo se llama footer.ts

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('CASA_COYOTES');
}
