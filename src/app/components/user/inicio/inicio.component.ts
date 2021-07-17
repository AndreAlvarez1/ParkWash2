import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConectorService } from 'src/app/services/conector.service';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  loading = false;
  user: UserModel = JSON.parse( localStorage.getItem('pkUser')|| '{}') ;

  date = new Date();
  firstDay = this.conex.formatoSQL(new Date(this.date.getFullYear(), this.date.getMonth(), 1));
  lastDay = this.conex.formatoSQL(new Date(this.date.getFullYear(), this.date.getMonth() + 2, 1));
  hoy = new Date().toLocaleString().slice(0, 19).replace('T', ' ');


  cars: any[] = [];
  washes: any[] = [];
  recintos: any[] = [];
  // recinto: RecintoModel = new RecintoModel();



  constructor(private conex: ConectorService,
              private router: Router) { 
    this.getCars(this.user.id)
    // this.getWashes('Todos');
  }

  ngOnInit(): void {
  }

  info(){
    console.log('user', this.user);
    console.log('cars', this.cars);
    console.log('washes', this.washes);
  }


  getCars(userId:any){
    this.loading = true;
    this.conex.getDatos(`/cars/${userId}`)
              .subscribe( (resp:any) => { 
                console.log('cars', resp)
                this.cars = resp['datos'];
                for (let c of this.cars){
                  this.getWashes(c.id)
                }
                this.loading = false;
              });
  }




  getWashes(car:any){
    this.loading = true;
    console.log('busco', car);
    this.conex.getDatos(`/washesXcar/${this.firstDay}/${this.lastDay}/${car}`)
              .subscribe( (resp:any) => { 
                console.log('washes', resp)
                const lavados = resp['datos'].filter( (was:any) => was.status != 0);
                for ( let l of lavados){
                  if (l.status > 0 && l.status < 3){
                    this.washes.push(l);
                  }
                }
              });
  }

  abrirLavado(w:any){
    console.log('w', w);
    this.router.navigateByUrl('/user/lavado/'+ w.id);
  }

}
