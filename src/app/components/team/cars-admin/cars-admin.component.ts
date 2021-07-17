import { Component, OnInit } from '@angular/core';
import { ConectorService } from 'src/app/services/conector.service';
import { RecintoModel } from '../../models/recinto.model';

@Component({
  selector: 'app-cars-admin',
  templateUrl: './cars-admin.component.html',
  styleUrls: ['./cars-admin.component.css']
})
export class CarsAdminComponent implements OnInit {

  loading = false;
  searchString = '';

  recinto: RecintoModel = new RecintoModel();
  recintos: any[] = [];
  cars: any[] = [];
  carsAll: any[] = [];

  constructor(private conex:ConectorService) {     
    this.getRecintos()
  }

  ngOnInit(): void {
  }

  info(){
    console.log('recintos', this.recintos)
    console.log('cars', this.cars)
  }

  getRecintos(){
    this.conex.getDatos(`/recintos`)
              .subscribe( (resp:any) => { 
                console.log('recintos', resp)
                this.recintos = resp['datos'].filter( (u:any) => u.status > 0);
                this.getCars('todos');
              });
  }

  getCars(id:any) {
    console.log('id', id);
    this.loading = true;

    this.conex.getDatos('/carsXrecinto/' + id)
        .subscribe( (resp:any) => { 
          console.log('resp cars', resp);
          this.carsAll = resp['datos'];
          this.cars = this.carsAll;
          this.loading = false;
        });
  }


  filtrarRecinto(value:any){
    console.log('filtro recintos', value);
    if ( value === 'todos'){
      this.recinto = new RecintoModel();
      this.cars = this.carsAll;
      return;
    }

    console.log('recinto id', value);
    this.recinto = this.recintos.find( rec => rec.id === Number(value));
    console.log('este es', this.recinto);
    this.cars = this.carsAll.filter( p => p.recintoId === Number(value))
  }

  selectCar(car:any){
    console.log('este auto', car);
  }

}
