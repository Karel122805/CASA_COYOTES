import {
  Component,
  HostListener,
  AfterViewInit,
  ElementRef,
  signal
} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'cc-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent implements AfterViewInit {

  /* =========================
     ESTADO
  ========================= */
  menuOpen = signal(false);
  isHeaderHidden = false;

  private lastY = 0;
  private threshold = 12;

  constructor(private el: ElementRef<HTMLElement>) {}

  /* =========================
     CICLO DE VIDA
  ========================= */
  ngAfterViewInit() {
    this.updateHeaderHeightVar();
    this.lastY = window.scrollY || 0;
  }

  /* =========================
     MENU
  ========================= */
  openMenu() {
    this.menuOpen.set(true);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  // cierra el menú al navegar
  onNavClick() {
    this.closeMenu();
  }

  /* =========================
     SCROLL
  ========================= */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const y = window.scrollY || 0;

    // arriba del todo → siempre visible
    if (y <= 10) {
      this.isHeaderHidden = false;
      this.lastY = y;
      return;
    }

    const goingDown = y > this.lastY + this.threshold;
    const goingUp   = y < this.lastY - this.threshold;

    if (goingDown) this.isHeaderHidden = true;
    if (goingUp)   this.isHeaderHidden = false;

    this.lastY = y;
  }

  /* =========================
     RESIZE (alto dinámico)
  ========================= */
  @HostListener('window:resize')
  onResize() {
    this.updateHeaderHeightVar();
  }

  private updateHeaderHeightVar() {
    const headerEl =
      this.el.nativeElement.querySelector('.cc-header') as HTMLElement | null;

    const height = headerEl?.offsetHeight ?? 76;

    document.documentElement.style
      .setProperty('--cc-header-h', `${height}px`);
  }
}
