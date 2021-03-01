import { Routes } from '@angular/router';
import { CarsComponent } from './cars/cars.component';
import { PerfilComponent } from './perfil/perfil.component';

export const rutasUser: Routes = [
  {path: 'perfil', component: PerfilComponent},
  {path: 'cars', component: CarsComponent},

  {path: '**', pathMatch: 'full', redirectTo: 'perfil'}
];


