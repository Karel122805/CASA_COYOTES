import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

type PriceLine = { label: string; value: string };

interface DestiladoCard {
  title: string;
  description: string;
  prices: PriceLine[];
  image: string;
}

@Component({
  selector: 'app-destilados',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ RouterLink / navegación
  templateUrl: './destilados.html',
  styleUrls: ['./destilados.scss']
})
export class Destilados {

  constructor(private router: Router) {}

  heroImage = 'assets/24.png';

  // Modal
  selected: DestiladoCard | null = null;

  openModal(card: DestiladoCard): void {
    this.selected = card;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selected = null;
    document.body.style.overflow = '';
  }

  // ✅ IR A /pedidos (tu ruta está en minúsculas)
  goToPedidos(): void {
    // No cierres primero; navega y el componente se destruye
    this.router.navigateByUrl('/pedidos');
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.selected) this.closeModal();
  }

  cards: DestiladoCard[] = [
    {
      title: 'DESTILADO PREMIUM',
      description:
        'Técnica: Alambique de cobre, tipo árabe.\n' +
        'Tercera destilación. Afrutado, con notas\n' +
        'lácticas y aromas propios del maguey.\n' +
        'Notas ligeras del maguey con retrogusto\n' +
        'ligero y poca astringencia alcohólica',
      prices: [{ label: '750 ml', value: '$3,000' }],
      image: 'assets/25.jpeg'
    },
    {
      title: 'NATURAL',
      description:
        'Alambique de cobre, tipo árabe. Doble\n' +
        'destilación. Pulque. Sabor: dulce, da\n' +
        'retrogusto a pulque. Cuerpo: Cristalino y\n' +
        'ligero',
      prices: [
        { label: '750 ml', value: '$500' },
        { label: '200 ml', value: '$200' }
      ],
      image: 'assets/26.jpeg'
    },
    {
      title: 'CITRICO',
      description:
        'Alambique de cobre, tipo árabe. Doble\n' +
        'destilación. fragancia: Frutal, cítrica y\n' +
        'pulque. Sabor: naranja, mandarina, limón y\n' +
        'pulque',
      prices: [
        { label: '750 ml', value: '$500' },
        { label: '200 ml', value: '$200' }
      ],
      image: 'assets/27.jpeg'
    },
    {
      title: 'CAFE',
      description:
        'Alambique de cobre, tipo árabe. Doble\n' +
        'destilación. Fragancia: Café tostado y\n' +
        'pulque. Sabor: café con pulque..',
      prices: [
        { label: '750 ml', value: '$500' },
        { label: '200 ml', value: '$200' }
      ],
      image: 'assets/28.jpeg'
    },
    {
      title: 'HIERBAS NATURALES',
      description:
        'Alambique de cobre, tipo árabe. Doble\n' +
        'destilación. Fragancia: diversas hierbas\n' +
        'medicinales y pulque. Sabor: fuerte sabor\n' +
        'a especias y hierbas medicinales con\n' +
        'pulque.',
      prices: [
        { label: '750 ml', value: '$500' },
        { label: '200 ml', value: '$200' }
      ],
      image: 'assets/29.jpeg'
    },
    {
      title: 'ALTAR DE DIA DE MUERTOS',
      description:
        'Alambique de cobre, tipo árabe. Doble\n' +
        'destilación. Fragancia: flor de\n' +
        'cempaxúchitl, frutas de temporada, dulce\n' +
        'de calabaza y pulque. Sabor:\n' +
        'cempaxúchitl y fruta con pulque.',
      prices: [
        { label: '750 ml', value: '$500' },
        { label: '200 ml', value: '$200' }
      ],
      image: 'assets/30.jpeg'
    },
    {
      title: 'CHINICUIL',
      description:
        'Sólo de temporada, destilado de pulque,\n' +
        'abocado con Chinicuil. con esta mezcla se\n' +
        'produce una integración de sabores y\n' +
        'aromas, que destacan por su composición\n' +
        'única e inigualable',
      prices: [
        { label: '750 ml', value: '$500' },
        { label: '200 ml', value: '$200' }
      ],
      image: 'assets/31.jpeg'
    },
    {
      title: 'CHILE RAYADO',
      description:
        'Por sus cualidades únicas “el chile rayado”\n' +
        'endémico del estado de Hidalgo, da unas\n' +
        'notas interesantes al paladar ya que al\n' +
        'mezclarse con las fragancias del pulque se\n' +
        'da un retrogusto incomparable.',
      prices: [
        { label: '750 ml', value: '$500' },
        { label: '200 ml', value: '$200' }
      ],
      image: 'assets/32.jpeg'
    },
    {
      title: 'SAL DE CHINICUIL',
      description:
        'Con una fabricación artesanal y una receta\n' +
        'familiar única, se crea un producto con\n' +
        'solo dos ingredientes, siendo el principal el\n' +
        'gusano de maguey Salamina.',
      prices: [
        { label: '50 g', value: '$100' },
        { label: '1 kg', value: '$1,000' }
      ],
      image: 'assets/33.jpeg'
    }
  ];
}
