import { Routes } from '@angular/router';

import { Inicio } from './pages/inicio/inicio';
import { Destilados } from './pages/destilados/destilados';
import { Maguey } from './pages/maguey/maguey';
import { Servicios } from './pages/servicios/servicios';
import { Nosotros } from './pages/nosotros/nosotros';
import { Pedidos } from './pages/pedidos/pedidos';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'destilados', component: Destilados },
  { path: 'maguey', component: Maguey },
  { path: 'servicios', component: Servicios },
  { path: 'nosotros', component: Nosotros },
  { path: 'pedidos', component: Pedidos },
  { path: '**', redirectTo: 'inicio' },
];
