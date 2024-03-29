import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  email = '';

  constructor(private auth:AuthService,
              private router:Router) { }

  ngOnInit(): void {
  }

  login(form: NgForm) {
    if (form.invalid) { return; }
    console.log(this.email);

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Verificando datos'
    });
    Swal.showLoading();

    this.auth.resetPass(this.email)
              .subscribe(resp => {
                Swal.close();
                this.exito();
              }, (err) => {
                Swal.close();
                this.error();
              });
}

// Warnings

error() {
  Swal.fire({
    title: 'No tenemos este correo registrado',
    text: 'Quizás te registraste con otro email',
    icon: 'warning'
  });
}

exito() {
  Swal.fire({
    title: 'Correo Enviado!',
    text: 'Revisa tu casilla, te enviamos un link para que cambies tu password',
    icon: 'success'
  });
  this.router.navigateByUrl('/login');
}

}
