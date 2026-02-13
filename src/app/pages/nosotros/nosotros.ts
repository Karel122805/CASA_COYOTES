import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit
} from '@angular/core';

type InstaPost = {
  image: string;
  url: string;
  alt: string;
};

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nosotros.html',
  styleUrls: ['./nosotros.scss']
})
export class Nosotros implements OnInit, OnDestroy {

  posts: InstaPost[] = [
    { image: 'assets/34.jpeg', url: 'https://www.instagram.com/p/C1nCrZ3uem8/?utm_source=ig_web_copy_link', alt: 'Publicación Casa Coyotes 35' },
    { image: 'assets/35.jpeg', url: 'https://www.instagram.com/p/C6bVF1eOsap/?utm_source=ig_web_copy_link', alt: 'Publicación Casa Coyotes 35' },
    { image: 'assets/36.jpeg', url: 'https://www.instagram.com/p/C-naF2OOasj/?utm_source=ig_web_copy_link', alt: 'Publicación Casa Coyotes 36' },
    { image: 'assets/37.jpeg', url: 'https://www.instagram.com/p/DGyBvTFvjoo/?utm_source=ig_web_copy_link', alt: 'Publicación Casa Coyotes 37' },
    { image: 'assets/38.jpeg', url: 'https://www.instagram.com/p/DJ1pmFkuIKz/?utm_source=ig_web_copy_link', alt: 'Publicación Casa Coyotes 38' },
    { image: 'assets/39.jpeg', url: 'https://www.instagram.com/p/DKGPpRaOtHO/?utm_source=ig_web_copy_link', alt: 'Publicación Casa Coyotes 39' }
  ];

  active = 2;

  private timerId: number | null = null;
  private readonly intervalMs = 3000; // ✅ 10 segundos

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  private startAutoplay(): void {
    this.stopAutoplay();

    // ✅ evitamos que Angular se "duerma" en zoneless:
    this.timerId = window.setInterval(() => {
      this.zone.run(() => {
        this.active = (this.active + 1) % this.posts.length;
        this.cdr.detectChanges();
      });
    }, this.intervalMs);
  }

  private stopAutoplay(): void {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private restartAutoplay(): void {
    this.startAutoplay();
  }

  prev(): void {
    this.active = (this.active - 1 + this.posts.length) % this.posts.length;
    this.restartAutoplay();
  }

  next(): void {
    this.active = (this.active + 1) % this.posts.length;
    this.restartAutoplay();
  }

  /** ✅ Click: si es centro => abre; si es lateral => se vuelve centro */
  onSlideClick(index: number, url: string): void {
    if (index === this.active) {
      this.openPost(url);
      return;
    }
    this.active = index;
    this.restartAutoplay();
  }

  openPost(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /** Coverflow: -2,-1,0,1,2 alrededor del activo */
  getPos(index: number): string {
    const len = this.posts.length;

    let d = index - this.active;
    if (d > len / 2) d -= len;
    if (d < -len / 2) d += len;

    if (d === 0) return '0';
    if (d === 1) return '1';
    if (d === -1) return '-1';
    if (d === 2) return '2';
    if (d === -2) return '-2';
    return 'hidden';
  }
}
