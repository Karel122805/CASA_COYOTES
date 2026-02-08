import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss'],
})
export class Inicio {
  cards = [
    {
      pill: 'Destilados',
      title: 'Catalogo de Destilados\nde Pulque',
      text:
        'Premium, Natural, Citrico,\n' +
        'Cafe, Hierbas Naturales,\n' +
        'Altar de Muertos,\n' +
        'Chincuil, Chile Rayado.',
      link: '/destilados',
    },
    {
      pill: 'Maguey',
      title: 'Semilla, hijuelos y piñas',
      text:
        'Agave pulquero variedad\n' +
        'Manso — venta al detalle\n' +
        'y mayoreo.',
      link: '/maguey',
    },
    {
      pill: 'Servicios',
      title: 'Servicios agricolas',
      text:
        'Diseño de plantio,\n' +
        'establecimiento de vivero\n' +
        'y mantenimiento del\n' +
        'cultivo.',
      link: '/servicios',
    },
    {
      pill: 'Contacto',
      title: 'Haz tu pedido',
      text:
        'Envios a toda la Republica.\n' +
        'Puntos de venta en Hidalgo.',
      link: '/pedidos',
    },
  ];
}
