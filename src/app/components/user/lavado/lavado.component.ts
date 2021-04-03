import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConectorService } from 'src/app/services/conector.service';
import { CarModel } from '../../models/car.model';
import { WashModel } from '../../models/wash.model';

@Component({
  selector: 'app-lavado',
  templateUrl: './lavado.component.html',
  styleUrls: ['./lavado.component.css']
})
export class LavadoComponent implements OnInit {

  id: any;
  car: CarModel = new CarModel();
  wash: WashModel = new WashModel();

  antes: any[]       = [];
  despues: any[]       = [];

  loading = true;
  loading2 = true;

  constructor(private route: ActivatedRoute,
              private conex: ConectorService) { 
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.getWash();
  }

  ngOnInit(): void {
    this.getFotos();
  }

  info(){
    console.log('wash', this.wash);
    console.log('car', this.car);
  }

  getWash(){
    this.conex.getDatos('/wash/' + this.id).subscribe( (resp:any) => {
      this.wash = resp['datos'][0];
      console.log('wash', this.wash);
      this.getCars(this.wash.recintoId);
    });
  }

  getCars(id:any) {
    console.log('id', id);
    this.loading = true;
    this.conex.getDatos('/carsXrecinto/' + id)
        .subscribe( (resp:any) => { 
          const cars = resp['datos'];
          if (this.id !== 'nuevo'){
            this.car = cars.find( (c:any) => c.id === this.wash.carId);
          }
          this.loading = false;
        });
  }


  getFotos(){
    this.antes = [];
    this.despues = [];
    if (this.id === 'nuevo'){
      return;
    }
    this.loading2 = true;
    this.conex.getDatos('/photos/' + this.id)
              .subscribe( (resp:any) => { 
                          console.log('fotos', resp);
                          const fotos = resp['datos'];  
                          for (let f of fotos){
                            if (f.tipo === 'antes' && f.status > 0){
                              this.antes.push(f)
                            } else if(f.tipo === 'despues' && f.status > 0){
                              this.despues.push(f)
                            }
                          }
                          this.loading2 = false;
                        });
  }
  

}
