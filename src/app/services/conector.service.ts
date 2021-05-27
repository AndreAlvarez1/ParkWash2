import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConectorService {


  // public url = 'http://localhost';
  // public url = 'http://node.clubgournet.cl'
  public url = 'https://loyal-conduit-314919.ue.r.appspot.com/'
  // public url = 'http://api.parkwash.cl'

  public port = 9069;

  constructor(private http:HttpClient) { }


  getDatos( ruta:string ) {
    return this.http.get( this.url + ruta );
    // return this.http.get( this.url + ':' + this.port + ruta );
 }

 guardarDato(ruta:string, body:any) {
  return this.http.post( this.url + ruta, body );
  // return this.http.post( this.url + ':' + this.port + ruta, body );
}


formatoSQL(fecha:any){
  console.log('fecha', fecha);
  const day = new Date(fecha).getDate();
  const month = new Date(fecha).getMonth() + 1;
  const year = new Date(fecha).getFullYear();
  console.log('dia', day);
  console.log('month', month);
  console.log('year', year);

  const newFecha = year + '-' + month + '-' + day;
  console.log('newFecha', newFecha);

  return newFecha;
}

}
