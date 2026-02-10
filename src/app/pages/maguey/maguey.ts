import { Component } from '@angular/core';

@Component({
  selector: 'app-maguey',
  templateUrl: './maguey.html',
  styleUrls: ['./maguey.scss']
})
export class Maguey {

  scrollTo(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (!el) return;

    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}
