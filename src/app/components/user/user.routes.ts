import { Routes } from '@angular/router';
import { CardComponent } from './card/card.component';
import { CardsComponent } from './cards/cards.component';
import { CarsComponent } from './cars/cars.component';
import { DecardComponent } from './decard/decard.component';
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
  {path: 'card', component: CardComponent},
  {path: 'cards', component: CardsComponent},
  {path: 'decard', component: DecardComponent},

  {path: '**', pathMatch: 'full', redirectTo: 'inicio'}
];


