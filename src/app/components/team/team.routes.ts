import { Routes } from '@angular/router';
import { WashComponent } from './wash/wash.component';
import { WashesComponent } from './washes/washes.component';


export const rutasTeam: Routes = [
  {path: 'washes', component: WashesComponent},
  {path: 'wash/:id', component: WashComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'login'}
];


