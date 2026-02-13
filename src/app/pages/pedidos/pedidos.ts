import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

type Categoria = 'Destilados' | 'Maguey' | 'Servicios';

type Presentacion = {
  id: string;
  nombre: string;
  precio: number; // MXN
};

type Producto = {
  id: string;
  categoria: Categoria;
  nombre: string;
  presentaciones: Presentacion[];
};

type CatalogoMx = {
  municipiosPorEstado: Record<string, string[]>;
  ciudadesPorEstadoMunicipio: Record<string, Record<string, string[]>>;
};

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.scss',
})
export class PedidosComponent implements OnInit {
  private readonly numeroDestino = '5217713442906';

  sendState: 'idle' | 'sending' | 'success' | 'error' = 'idle';
  formError = '';

  categorias: Categoria[] = ['Destilados', 'Maguey', 'Servicios'];

  estados: string[] = [];
  catalogoMx: CatalogoMx | null = null;

  municipiosSugeridos: string[] = [];
  ciudadesSugeridas: string[] = [];

  private municipiosActuales: string[] = [];
  private ciudadesActuales: string[] = [];

  envioMx: number | null = null;

  // ✅ ID fijo para litreo (1L)
  private readonly ID_LITRO = '1l';

  productos: Producto[] = [
    // DESTILADOS
    {
      id: 'dest_premium',
      categoria: 'Destilados',
      nombre: 'Destilado Premium (Tercera destilación)',
      presentaciones: [{ id: 'unit', nombre: '1 unidad', precio: 3000 }],
    },
    {
      id: 'dest_natural',
      categoria: 'Destilados',
      nombre: 'Destilado 100% Pulque - Natural',
      presentaciones: [
        { id: '750', nombre: '750 ml', precio: 500 },
        { id: '200', nombre: '200 ml', precio: 200 },
        // ✅ NUEVO: litreo (solo disponible en mayoreo por UI)
        { id: '1l', nombre: '1 Litro (a granel)', precio: 0 },
      ],
    },
    {
      id: 'dest_citrico',
      categoria: 'Destilados',
      nombre: 'Destilado 100% Pulque - Cítrico',
      presentaciones: [
        { id: '750', nombre: '750 ml', precio: 500 },
        { id: '200', nombre: '200 ml', precio: 200 },
        { id: '1l', nombre: '1 Litro (a granel)', precio: 0 },
      ],
    },
    {
      id: 'dest_cafe',
      categoria: 'Destilados',
      nombre: 'Destilado 100% Pulque - Café',
      presentaciones: [
        { id: '750', nombre: '750 ml', precio: 500 },
        { id: '200', nombre: '200 ml', precio: 200 },
        { id: '1l', nombre: '1 Litro (a granel)', precio: 0 },
      ],
    },
    {
      id: 'dest_hierbas',
      categoria: 'Destilados',
      nombre: 'Destilado 100% Pulque - Hierbas Naturales',
      presentaciones: [
        { id: '750', nombre: '750 ml', precio: 500 },
        { id: '200', nombre: '200 ml', precio: 200 },
        { id: '1l', nombre: '1 Litro (a granel)', precio: 0 },
      ],
    },
    {
      id: 'dest_altar',
      categoria: 'Destilados',
      nombre: 'Destilado 100% Pulque - Altar de Día de Muertos',
      presentaciones: [
        { id: '750', nombre: '750 ml', precio: 500 },
        { id: '200', nombre: '200 ml', precio: 200 },
        { id: '1l', nombre: '1 Litro (a granel)', precio: 0 },
      ],
    },
    {
      id: 'dest_chinicuil',
      categoria: 'Destilados',
      nombre: 'Destilado 100% Pulque - Chinicuil (temporada)',
      presentaciones: [
        { id: '750', nombre: '750 ml', precio: 500 },
        { id: '200', nombre: '200 ml', precio: 200 },
        { id: '1l', nombre: '1 Litro (a granel)', precio: 0 },
      ],
    },
    {
      id: 'dest_chile_rayado',
      categoria: 'Destilados',
      nombre: 'Destilado 100% Pulque - Chile Rayado',
      presentaciones: [
        { id: '750', nombre: '750 ml', precio: 500 },
        { id: '200', nombre: '200 ml', precio: 200 },
        { id: '1l', nombre: '1 Litro (a granel)', precio: 0 },
      ],
    },

    // MAGUEY
    {
      id: 'semilla_salmiana_90',
      categoria: 'Maguey',
      nombre: 'Semilla de Maguey Salmiana 90%',
      presentaciones: [{ id: 'kg', nombre: 'Por kilo', precio: 4000 }],
    },
    {
      id: 'semilla_salmiana_80',
      categoria: 'Maguey',
      nombre: 'Semilla de Maguey Salmiana 80%',
      presentaciones: [{ id: 'kg', nombre: 'Por kilo', precio: 3500 }],
    },
    {
      id: 'maguey_semilla_5_10',
      categoria: 'Maguey',
      nombre: 'Maguey de semilla (Manso) 5–10 cm (3 hojas, espina verdadera)',
      presentaciones: [{ id: 'pz', nombre: 'Por pieza', precio: 7 }],
    },
    {
      id: 'maguey_semilla_20_30',
      categoria: 'Maguey',
      nombre: 'Maguey de semilla (Manso) 20–30 cm (1 año)',
      presentaciones: [{ id: 'pz', nombre: 'Por pieza', precio: 15 }],
    },
    {
      id: 'hijuelo_20_30',
      categoria: 'Maguey',
      nombre: 'Maguey de hijuelo (Manso) 20–30 cm (1 año)',
      presentaciones: [{ id: 'pz', nombre: 'Por pieza', precio: 17 }],
    },
    {
      id: 'hijuelo_35_45',
      categoria: 'Maguey',
      nombre: 'Maguey de hijuelo (Manso) 35–45 cm (2 años)',
      presentaciones: [{ id: 'pz', nombre: 'Por pieza', precio: 28 }],
    },
    {
      id: 'hijuelo_50_75',
      categoria: 'Maguey',
      nombre: 'Maguey de hijuelo (Manso) 50–75 cm (4 años)',
      presentaciones: [{ id: 'pz', nombre: 'Por pieza', precio: 42 }],
    },
    {
      id: 'hijuelo_80_100',
      categoria: 'Maguey',
      nombre: 'Maguey de hijuelo (Manso) 80–100 cm',
      presentaciones: [{ id: 'pz', nombre: 'Por pieza', precio: 60 }],
    },
    {
      id: 'penca_maguey',
      categoria: 'Maguey',
      nombre: 'Penca de maguey (Manso)',
      presentaciones: [{ id: 'pz', nombre: 'Por pieza', precio: 6 }],
    },
    {
      id: 'pina_maguey',
      categoria: 'Maguey',
      nombre: 'Piña de maguey pulquero (20° Brix, jima baja)',
      presentaciones: [{ id: 'kg', nombre: 'Por kilo', precio: 11.5 }],
    },
    {
      id: 'sal_chinicuil',
      categoria: 'Maguey',
      nombre: 'Sal de Chinicuil',
      presentaciones: [
        { id: '50g', nombre: '50 g', precio: 100 },
        { id: '1kg', nombre: '1 kg', precio: 1000 },
      ],
    },

    // SERVICIOS
    {
      id: 'serv_diseno_plantio',
      categoria: 'Servicios',
      nombre: 'Diseño del plantío (evitar erosión / preservar humedad)',
      presentaciones: [{ id: 'ha', nombre: 'Por hectárea', precio: 350 }],
    },
    {
      id: 'serv_establecimiento_vivero',
      categoria: 'Servicios',
      nombre: 'Establecimiento de vivero (rescate/limpieza/plantación)',
      presentaciones: [{ id: 'pz', nombre: 'Por pieza', precio: 5 }],
    },
    {
      id: 'serv_mantenimiento_cultivo',
      categoria: 'Servicios',
      nombre: 'Mantenimiento de cultivo (nutrición / agroinsumos)',
      presentaciones: [{ id: 'ha', nombre: 'Por hectárea', precio: 750 }],
    },
  ];

  form: FormGroup;

  // ✅ Para mostrar aviso automático cuando ya van en domicilio
  private deliveryTouchedOnce = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      modoVenta: ['menudeo'],
      items: this.fb.array([this.createItem()]),
      cliente: this.fb.group({
        nombre: ['', [Validators.required]],
        apellidos: ['', [Validators.required]],
        whatsapp: ['', [Validators.required]],
        correo: ['', [Validators.email]],
      }),
      entrega: this.fb.group({
        calle: ['', [Validators.required]],
        exterior: ['', [Validators.required]],
        interior: [''],
        colonia: ['', [Validators.required]],
        cp: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
        estadoId: ['', [Validators.required]],
        municipio: ['', [Validators.required]],
        ciudad: ['', [Validators.required]],
        referencia: [''],
      }),
    });
  }

  ngOnInit(): void {
    this.cargarCatalogoCompleto();

    // ✅ Si cambian a MENUDERO, quitamos presentación 1L (granel) para evitar inconsistencias
    this.form.get('modoVenta')?.valueChanges.subscribe(() => {
      if (this.modoVenta === 'menudeo') {
        for (let i = 0; i < this.items.length; i++) {
          const fg = this.items.at(i);
          if ((fg.get('presentacionId')?.value || '') === this.ID_LITRO) {
            fg.patchValue({ presentacionId: '' });
          }
        }
      }
    });
  }

  get modoVenta(): 'menudeo' | 'mayoreo' {
    return (this.form.get('modoVenta')?.value ?? 'menudeo') as any;
  }

  cargarCatalogoCompleto(): void {
    this.http.get<CatalogoMx>('assets/mx-catalogo.json').subscribe({
      next: (data) => {
        this.catalogoMx = data;
        this.estados = Object.keys(data.municipiosPorEstado).sort((a, b) => a.localeCompare(b, 'es'));
      },
      error: (e) => console.warn('❌ No se pudo cargar assets/mx-catalogo.json', e),
    });
  }

  get items(): FormArray<FormGroup> {
    return this.form.get('items') as FormArray<FormGroup>;
  }

  private createItem(): FormGroup {
    return this.fb.group({
      categoria: ['' as any, Validators.required],
      productoId: ['', Validators.required],
      presentacionId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    if (this.items.length === 1) return;
    this.items.removeAt(index);
  }

  productosPorCategoria(categoria: Categoria | ''): Producto[] {
    if (!categoria) return [];
    return this.productos.filter(p => p.categoria === categoria);
  }

  // ✅ IMPORTANTE: el 1L solo aparece si modoVenta === mayoreo (para que no lo elijan en menudeo)
  presentacionesPorProducto(productoId: string): Presentacion[] {
    const prod = this.productos.find(p => p.id === productoId);
    const pres = prod?.presentaciones ?? [];
    if (this.modoVenta !== 'mayoreo') return pres.filter(x => x.id !== this.ID_LITRO);
    return pres;
  }

  onCategoriaChange(index: number): void {
    const fg = this.items.at(index);
    fg.patchValue({ productoId: '', presentacionId: '' });
  }

  onProductoChange(index: number): void {
    const fg = this.items.at(index);
    fg.patchValue({ presentacionId: '' });
  }

  onEstadoChange(): void {
    const entrega = this.form.get('entrega') as FormGroup;
    const estadoNombre = (entrega.get('estadoId')?.value || '').toString();

    entrega.patchValue({ municipio: '', ciudad: '' });

    if (!this.catalogoMx) {
      this.municipiosActuales = [];
      this.municipiosSugeridos = [];
      this.ciudadesActuales = [];
      this.ciudadesSugeridas = [];
      return;
    }

    this.municipiosActuales = this.catalogoMx.municipiosPorEstado?.[estadoNombre] ?? [];
    this.municipiosSugeridos = this.municipiosActuales.slice(0, 60);

    this.ciudadesActuales = [];
    this.ciudadesSugeridas = [];
  }

  onMunicipioInput(): void {
    const entrega = this.form.get('entrega') as FormGroup;
    const estadoNombre = (entrega.get('estadoId')?.value || '').toString();
    const muni = (entrega.get('municipio')?.value || '').toString().trim();

    if (!this.catalogoMx) return;

    this.municipiosSugeridos = this.filtrar(this.municipiosActuales, muni);

    const ciudades = this.catalogoMx.ciudadesPorEstadoMunicipio?.[estadoNombre]?.[muni] ?? [];
    this.ciudadesActuales = ciudades;
    this.ciudadesSugeridas = ciudades.slice(0, 60);

    entrega.patchValue({ ciudad: '' }, { emitEvent: false });
  }

  onCiudadInput(): void {
    const city = (this.form.get('entrega.ciudad')?.value || '').toString().trim();
    this.ciudadesSugeridas = this.filtrar(this.ciudadesActuales, city);
  }

  private filtrar(lista: string[], q: string): string[] {
    const query = (q || '').toLowerCase();
    if (!query) return lista.slice(0, 60);
    return lista.filter(x => x.toLowerCase().includes(query)).slice(0, 60);
  }

  // ✅ Se llama al escribir en domicilio para mostrar aviso si falta cliente
  onDeliveryInteract(): void {
    this.deliveryTouchedOnce = true;
    this.actualizarAvisoFaltantes();
  }

  private actualizarAvisoFaltantes(): void {
    if (!this.deliveryTouchedOnce) return;
    if (this.sendState !== 'idle') return;

    const nombre = (this.form.get('cliente.nombre')?.value || '').toString().trim();
    const apellidos = (this.form.get('cliente.apellidos')?.value || '').toString().trim();
    const whatsapp = (this.form.get('cliente.whatsapp')?.value || '').toString().trim();

    if (!nombre) { this.formError = 'Te falta llenar: Nombre (Datos del cliente).'; return; }
    if (!apellidos) { this.formError = 'Te falta llenar: Apellidos (Datos del cliente).'; return; }
    if (!this.whatsappValido(whatsapp)) { this.formError = 'Te falta llenar correctamente: WhatsApp (Datos del cliente).'; return; }

    this.formError = '';
  }

  // ✅ helper para HTML (hint)
  esLitreoLinea(index: number): boolean {
    const fg = this.items.at(index);
    return (fg.get('presentacionId')?.value || '') === this.ID_LITRO;
  }

  // ====== Precios ======
  unitario(index: number): number {
    const fg = this.items.at(index);
    const productoId = fg.get('productoId')?.value as string;
    const presentacionId = fg.get('presentacionId')?.value as string;
    const cantidad = Number(fg.get('cantidad')?.value ?? 0);

    const prod = this.productos.find(p => p.id === productoId);
    const pres = prod?.presentaciones.find(x => x.id === presentacionId);
    const base = pres?.precio ?? 0;

    // ✅ Mayoreo SOLO aplica a DESTILADOS (sal de chinicuil es Maguey => nunca entra)
    if (!prod || prod.categoria !== 'Destilados') return base;

    // ✅ Si no está mayoreo, destilados a precio normal
    if (this.modoVenta !== 'mayoreo') return base;

    // ✅ 1) Caja 12 botellas (SOLO 750ml) => $400 si cantidad >= 12
    if (presentacionId === '750' && cantidad >= 12) return 400;

    // ✅ 2) Litreo 1L (a partir de 10 litros) => $380/L si cantidad >= 10
    if (presentacionId === this.ID_LITRO) {
      if (cantidad >= 10) return 380;
      return 0; // no cumple mínimo, se bloquea el envío en validación
    }

    // Si no cumple reglas, se queda precio normal del destilado
    return base;
  }

  subtotalLinea(index: number): number {
    const cantidad = Number(this.items.at(index).get('cantidad')?.value ?? 0);
    return this.unitario(index) * cantidad;
  }

  subtotalArticulos(): number {
    let total = 0;
    for (let i = 0; i < this.items.length; i++) total += this.subtotalLinea(i);
    return total;
  }

  totalEstimado(): number {
    const envio = this.envioMx ?? 0;
    return this.subtotalArticulos() + envio;
  }

  usarMiUbicacion(): void {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1`;

        this.http.get<any>(url).subscribe({
          next: (res) => {
            const a = res?.address || {};

            const cp = a.postcode || '';
            const calle = a.road || a.pedestrian || '';
            const colonia = a.suburb || a.neighbourhood || '';
            const municipio = a.county || a.municipality || a.city_district || '';
            const ciudad = a.city || a.town || a.village || a.hamlet || '';
            const estadoNombre = a.state || '';

            const estadoOk =
              this.estados.find(e => e.toLowerCase() === String(estadoNombre).toLowerCase()) || '';

            const entrega = this.form.get('entrega') as FormGroup;
            entrega.patchValue({
              cp,
              calle,
              colonia,
              estadoId: estadoOk,
              municipio,
              ciudad,
            });

            if (estadoOk) this.onEstadoChange();

            setTimeout(() => {
              this.onMunicipioInput();
              this.onCiudadInput();
              this.onDeliveryInteract();
            }, 0);
          },
          error: () => alert('No se pudo autocompletar con la ubicación (CORS/permiso).'),
        });
      },
      () => alert('No se pudo obtener tu ubicación. Revisa permisos del navegador.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  private whatsappValido(valor: string): boolean {
    const v = (valor || '').toString().replace(/\s+/g, '');
    return /^(?:\+?52)?\d{10,13}$/.test(v);
  }

  // ✅ Validación extra: si eligen 1L deben ser >= 10 litros para enviar
  private litreoValido(): boolean {
    if (this.modoVenta !== 'mayoreo') return true;

    for (let i = 0; i < this.items.length; i++) {
      const fg = this.items.at(i);
      const productoId = fg.get('productoId')?.value as string;
      const presentacionId = fg.get('presentacionId')?.value as string;
      const cantidad = Number(fg.get('cantidad')?.value ?? 0);

      const prod = this.productos.find(p => p.id === productoId);
      if (!prod) continue;

      if (prod.categoria === 'Destilados' && presentacionId === this.ID_LITRO && cantidad < 10) {
        return false;
      }
    }
    return true;
  }

  puedeEnviar(): boolean {
    const itemsOk = this.items.controls.every((ctrl) => {
      const categoria = ctrl.get('categoria')?.value;
      const productoId = ctrl.get('productoId')?.value;
      const presentacionId = ctrl.get('presentacionId')?.value;
      const cantidad = Number(ctrl.get('cantidad')?.value ?? 0);
      return !!categoria && !!productoId && !!presentacionId && cantidad >= 1;
    });

    if (!itemsOk) return false;
    if (!this.litreoValido()) return false;

    if (this.form.invalid) return false;

    const whatsapp = this.form.get('cliente.whatsapp')?.value;
    if (!this.whatsappValido(whatsapp)) return false;

    return true;
  }

  private obtenerPrimerError(): string {
    for (let i = 0; i < this.items.length; i++) {
      const ctrl = this.items.at(i);
      const categoria = ctrl.get('categoria')?.value;
      const productoId = ctrl.get('productoId')?.value;
      const presentacionId = ctrl.get('presentacionId')?.value;
      const cantidad = Number(ctrl.get('cantidad')?.value ?? 0);

      if (!categoria || !productoId || !presentacionId || cantidad < 1) {
        return `Completa el producto #${i + 1}: categoría, producto, presentación y cantidad (mínimo 1).`;
      }

      // ✅ Error específico litreo
      const prod = this.productos.find(p => p.id === productoId);
      if (this.modoVenta === 'mayoreo' && prod?.categoria === 'Destilados' && presentacionId === this.ID_LITRO && cantidad < 10) {
        return `En el producto #${i + 1}: Para litreo, el mínimo es 10 litros para aplicar $380/L.`;
      }
    }

    const nombre = (this.form.get('cliente.nombre')?.value || '').toString().trim();
    const apellidos = (this.form.get('cliente.apellidos')?.value || '').toString().trim();
    const whatsapp = (this.form.get('cliente.whatsapp')?.value || '').toString().trim();

    if (!nombre) return 'Te falta llenar: Nombre (Datos del cliente).';
    if (!apellidos) return 'Te falta llenar: Apellidos (Datos del cliente).';
    if (!this.whatsappValido(whatsapp)) return 'Te falta llenar correctamente: WhatsApp (Datos del cliente).';

    const calle = (this.form.get('entrega.calle')?.value || '').toString().trim();
    const exterior = (this.form.get('entrega.exterior')?.value || '').toString().trim();
    const colonia = (this.form.get('entrega.colonia')?.value || '').toString().trim();
    const cp = (this.form.get('entrega.cp')?.value || '').toString().trim();
    const estado = (this.form.get('entrega.estadoId')?.value || '').toString().trim();
    const municipio = (this.form.get('entrega.municipio')?.value || '').toString().trim();
    const ciudad = (this.form.get('entrega.ciudad')?.value || '').toString().trim();

    if (!calle) return 'Falta la calle de entrega.';
    if (!exterior) return 'Falta el número exterior.';
    if (!colonia) return 'Falta colonia / fraccionamiento.';
    if (!cp || cp.length !== 5) return 'Falta código postal (5 dígitos).';
    if (!estado) return 'Selecciona un estado.';
    if (!municipio) return 'Falta municipio.';
    if (!ciudad) return 'Falta ciudad / localidad.';

    return 'Completa el formulario antes de enviar.';
  }

  cerrarEstadoEnvio(): void {
    this.sendState = 'idle';
  }

  confirmarYEnviarWhatsApp(): void {
    this.formError = '';
    this.form.markAllAsTouched();

    if (!this.puedeEnviar()) {
      this.formError = this.obtenerPrimerError();
      return;
    }

    const ok = window.confirm(
      '¿Confirmas el envío por WhatsApp?\n\n' +
      'Revisa tus datos y productos.\n' +
      'Al confirmar, ya no podrás hacer cambios.'
    );

    if (!ok) return;

    this.sendState = 'sending';

    setTimeout(() => {
      const opened = this.enviarWhatsAppConResultado();
      this.sendState = opened ? 'success' : 'error';
    }, 550);
  }

  private buildWhatsAppUrl(): string {
    const cliente = this.form.get('cliente')?.value as any;
    const entrega = this.form.get('entrega')?.value as any;

    const lineas = this.items.controls.map((ctrl, i) => {
      const categoria = ctrl.get('categoria')?.value as Categoria;
      const productoId = ctrl.get('productoId')?.value as string;
      const presentacionId = ctrl.get('presentacionId')?.value as string;
      const cantidad = Number(ctrl.get('cantidad')?.value ?? 0);

      const prod = this.productos.find(p => p.id === productoId);
      const pres = prod?.presentaciones.find(p => p.id === presentacionId);

      const unit = this.unitario(i);
      const sub = unit * cantidad;

      return `• (${categoria}) ${prod?.nombre ?? ''} - ${pres?.nombre ?? ''} x${cantidad} | Unit: $${unit} | Sub: $${sub}`;
    });

    const msg =
`CASA COYOTES - Pedido
Modo de compra: ${this.modoVenta.toUpperCase()}

1) Productos
${lineas.join('\n')}

Subtotal artículos: $${this.subtotalArticulos()}

2) Cliente
Nombre: ${cliente.nombre} ${cliente.apellidos}
WhatsApp: ${cliente.whatsapp}
Correo: ${cliente.correo || '(no proporcionado)'}

3) Entrega
Calle: ${entrega.calle} No. ${entrega.exterior}${entrega.interior ? ' Int. ' + entrega.interior : ''}
Colonia: ${entrega.colonia}
CP: ${entrega.cp}
Estado: ${entrega.estadoId}
Municipio: ${entrega.municipio}
Ciudad/Localidad: ${entrega.ciudad}
Referencia: ${entrega.referencia || '(sin referencia)'}

Nota: Favor de confirmar costo de envío.`;

    return `https://wa.me/${this.numeroDestino}?text=${encodeURIComponent(msg)}`;
  }

  private enviarWhatsAppConResultado(): boolean {
    try {
      const url = this.buildWhatsAppUrl();
      const win = window.open(url, '_blank');
      return !!win;
    } catch {
      return false;
    }
  }

  enviarWhatsApp(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const url = this.buildWhatsAppUrl();
    window.open(url, '_blank');
  }
}
