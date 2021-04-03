import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/log/login/login.component';
import { RegistroComponent } from './components/log/registro/registro.component';
import { ResetComponent } from './components/log/reset/reset.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { CarsComponent } from './components/user/cars/cars.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { WashesComponent } from './components/team/washes/washes.component';
import { WashComponent } from './components/team/wash/wash.component';
import { FilterPipe } from './pipes/filter.pipe';
import { InicioComponent } from './components/user/inicio/inicio.component';
import { LavadosComponent } from './components/user/lavados/lavados.component';
import { PagosComponent } from './components/user/pagos/pagos.component';
import { LavadoComponent } from './components/user/lavado/lavado.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegistroComponent,
    ResetComponent,
    PerfilComponent,
    SidebarComponent,
    CarsComponent,
    LoadingComponent,
    WashesComponent,
    WashComponent,
    FilterPipe,
    InicioComponent,
    LavadosComponent,
    PagosComponent,
    LavadoComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    ReactiveFormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
