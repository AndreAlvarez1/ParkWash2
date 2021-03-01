import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { ResetComponent } from './reset/reset.component';

export const rutasLog: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'registro', component: RegistroComponent},
  {path: 'reset', component: ResetComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'login'}
];


