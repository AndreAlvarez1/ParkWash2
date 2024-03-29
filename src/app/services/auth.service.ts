import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserModel } from '../components/models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private url = 'https://identitytoolkit.googleapis.com/v1';
  private apikey = 'AIzaSyAJ7dEhx-4U7ysv5ifNNghssiBrVxTsEtU';
  userToken: any;


  constructor(private http: HttpClient,
              private router: Router) { 
                this.leerToken();
              }


  leerToken(): string {
    if ( ('idToken') ) {
      this.userToken = localStorage.getItem('idToken');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }
 

  login(usuario: any) {
    console.log('Service Login', usuario);
    const authData = {
                      email: usuario.email,
                      password: usuario.password,
                      returnSecureToken: true
                      };

    return this.http.post(`${this.url}/accounts:signInWithPassword?key=${this.apikey}`,
    authData).pipe(
        map((resp:any) => {
          this.guardarToken( resp["idToken"] );
          return resp;
        })
      );
  }

  private guardarToken(idToken: any) {
    this.userToken = idToken;

    const usuario = 
    localStorage.setItem('idToken', idToken);

    const hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem('expira', hoy.getTime().toString() );
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('pkuser');
    localStorage.removeItem('expira');
    this.router.navigateByUrl('home');
  }



  estaAutenticado(): boolean {
    if ( this.userToken.length < 2 ) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date() ) {
      console.log('token aun valido');
      return true;
    } else {
      console.log('token caduco');
      return false;
    }
  }

  nuevoUsuario( usuario: UserModel ) {

    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };

    return this.http.post(`${this.url}/accounts:signUp?key=${this.apikey}`, authData)
                     .pipe(
                            map( (resp: any) => {
                              this.guardarToken( resp['idToken']);
                              return resp;
                            })
                     );
  }


  resetPass(correo: string) {
    const payload = {
                    requestType: 'PASSWORD_RESET',
                    email: correo
                    };
    return this.http.post( `${this.url}/accounts:sendOobCode?key=${this.apikey}`, payload )
                    .pipe(
                      map( resp => {
                        return resp;
                      })
                    );
  }


}
