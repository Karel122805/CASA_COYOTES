import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'cc-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  menuOpen = signal(false);

  openMenu() { this.menuOpen.set(true); }
  closeMenu() { this.menuOpen.set(false); }
  toggleMenu() { this.menuOpen.update(v => !v); }

  // ✅ cierra el menú al navegar
  onNavClick() {
    this.closeMenu();
  }
}
