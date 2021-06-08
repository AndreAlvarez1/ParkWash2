import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserModel } from '../../models/user.model';
import Swal from 'sweetalert2';
import { ConectorService } from 'src/app/services/conector.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: UserModel = new UserModel();
  // week = [ {id:1, day: 'Lunes'},{id:2, day: 'Martes'},{id:3, day: 'Miércoles'},{id:4, day: 'Jueves'},{id:5, day: 'Viernes'},{id:6, day: 'Sabado'},{id:0, day: 'Domingo'},{id:9, day: 'No, pueden lavar cualquier día de la semana'},]
  week = [ {id:2, day: 'Martes'},{id:3, day: 'Miércoles'},{id:5, day: 'Viernes'},{id:9, day: 'No, pueden lavar cualquier día de la semana'},]

  constructor(private auth: AuthService,
              private conex: ConectorService,
              private router: Router) { 
    console.log('usuario', this.usuario);
  }

  ngOnInit(): void {
  }

  info() {
    console.log('usuario', this.usuario);
  }

  selectTipo(valor:any){
    console.log('gender', valor);
  }

  selectDia(valor:number){
    console.log('valor', valor);
  }

  guardar(f: NgForm) {
    console.log('guardar usuario', this.usuario);
    if (!f.valid){
      console.log('error formulario incompleto');
      return;
    }

    if (this.usuario.password.length < 5){
      console.log('error password muy corto');
      return;
    }

    if (this.usuario.password !== this.usuario.password2){
      console.log('error passwords no coinciden');
      return;
    }

    console.log('está bien el formulario', this.usuario);

    this.auth.nuevoUsuario( this.usuario)
              .subscribe( resp => {
                console.log('resp firebase', resp);
                this.guardarUsuario();
              }, (err) => {
                this.error(err.error.error.message)
              });
    
  }

  guardarUsuario() {
    this.conex.guardarDato('/post/usuarios/insert', this.usuario)
              .subscribe( resp => {
                console.log('usuario guardado en bd', resp);
                this.exito('Datos guardados con éxito');
                this.router.navigateByUrl('/logs/login');
              });
  }


//  =============================================  //
//  =============================================  //
//  ================== Warnings
//  =============================================  //
//  =============================================  //
//  =============================================  //

exito(texto: string) {
  // this._gs.sonido('exito.mp3');
  Swal.fire({
    title: 'Excelente',
    icon: 'success',
    text: texto,
    confirmButtonColor: '#3085d6',
    timer: 3000,
    timerProgressBar: true
  });
}

error(error: string) {
  // this.conex.sonido('exito.mp3');
  Swal.fire({
    title: 'Cuec',
    text: error,
    icon: 'error',
    timer: 3000,
    timerProgressBar: true
  });
}

 

}
