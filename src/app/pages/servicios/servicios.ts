import { Component } from '@angular/core';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.html',
  styleUrls: ['./servicios.scss']
})
export class Servicios {
  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}
