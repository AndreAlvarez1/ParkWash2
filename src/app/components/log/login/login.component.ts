import { Component, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorService } from 'src/app/services/conector.service';
import Swal from 'sweetalert2';
 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario = { email: '',
              password: ''
            }

  constructor(private auth: AuthService,
              private conex: ConectorService,
              private router: Router) { }

  ngOnInit(): void {
  }


 
  validarUsuario(form: NgForm) {
    if (form.invalid) { return; }

    console.log('validar usuario', this.usuario);

    this.auth.login(this.usuario)
        .subscribe( (resp:any) => {
                console.log('respuesta login', resp);
                this.getCliente(resp['email']);
                this.exito('logueado con exito');
                }, err => { 
                  console.log('error', err.error.error.message);
                  this.error('Revisa si ingresaste bien tus datos');
                 });
  }

  getCliente(email:string){
    console.log('busco cliente por el mail', email);
    this.conex.getDatos(`/usuarios/${email}`)
        .subscribe((resp: any) => {
          console.log('usuarios', resp);
          const user = resp['datos'][0];
          localStorage.setItem('pkUser', JSON.stringify(user));
          if (user.level === 1){
            this.router.navigateByUrl('/user/inicio');
          } else {
            this.router.navigateByUrl('/user/perfil');
          }
        }, err =>{ console.log('error', err)});
  }



//  =============================================  //
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






