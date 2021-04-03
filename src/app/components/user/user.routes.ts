import { Routes } from '@angular/router';
import { CarsComponent } from './cars/cars.component';
import { InicioComponent } from './inicio/inicio.component';
import { LavadoComponent } from './lavado/lavado.component';
import { LavadosComponent } from './lavados/lavados.component';
import { PagosComponent } from './pagos/pagos.component';
import { PerfilComponent } from './perfil/perfil.component';

export const rutasUser: Routes = [
  {path: 'inicio', component: InicioComponent},
  {path: 'pagos', component: PagosComponent},
  {path: 'perfil', component: PerfilComponent},
  {path: 'cars', component: CarsComponent},
  {path: 'lavado/:id', component: LavadoComponent},
  {path: 'lavados', component: LavadosComponent},

  {path: '**', pathMatch: 'full', redirectTo: 'inicio'}
];


