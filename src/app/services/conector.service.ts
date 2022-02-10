import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConectorService {


  // public url = 'http://localhost:9069';
  public url = 'https://loyal-conduit-314919.ue.r.appspot.com'



  public port = 9069;

  constructor(private http:HttpClient) { }


  getDatos( ruta:string ) {
    console.log('get ruta', this.url + ruta)

    return this.http.get( this.url + ruta );
 }

 guardarDato(ruta:string, body:any) {
   console.log('post ruta', this.url + ruta)
   console.log('body', body )
  return this.http.post( this.url + ruta, body );
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



sendMail(body:any){
    this.guardarDato('/sendEmail', body)
              .subscribe( (resp:any) => {
                console.log('resp mail', resp);
                }, err => { console.log('err', err)
              });           
}


}
