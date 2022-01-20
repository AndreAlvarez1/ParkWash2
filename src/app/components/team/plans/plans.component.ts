import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConectorService } from 'src/app/services/conector.service';
import { PlanModel } from '../../models/plan.model';
import { RecintoModel } from '../../models/recinto.model';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {

  loading = false;
  searchString = '';
  
  recinto: RecintoModel = new RecintoModel()
  recintos: any[] = [];

  plan: PlanModel = new PlanModel()
  plans: any[] = [];
  plansAll: any[] = [];
  

  modalPlan = false;

  constructor(private conex: ConectorService) { 
        this.getRecintos();
        this.getPlans();
  }

  ngOnInit(): void {
  }


info(){
  console.log('planes', this.plans)
  console.log('recintos', this.recintos)
}

  getRecintos(){
    this.conex.getDatos(`/recintos`)
              .subscribe( (resp:any) => { 
                console.log('recintos', resp)
                this.recintos = resp['datos'].filter( (u:any) => u.status > 0);
              });
  }
  
  getPlans(){
    this.conex.getDatos(`/plans`)
              .subscribe( (resp:any) => { 
                console.log('plans', resp)
                this.plansAll = resp['datos'].filter( (u:any) => u.status > 0);
                this.plans = this.plansAll;
              });
  }


  filtrarRecinto(value:any){
    console.log('filtro recintos', value);
    if ( value === 'todos'){
      this.recinto = new RecintoModel();
      this.plans = this.plansAll
      return;
    }

    console.log('recinto id', value);
    this.recinto = this.recintos.find( rec => rec.id === Number(value));
    console.log('este es', this.recinto);
    this.plans = this.plansAll.filter( p => p.recintoId === Number(value))
  }

  
  selectPlan(value:any){
    console.log('plan', value);
    this.plan = value;
    this.modalPlan = true;
  }
  


    crearPlan(){
    console.log('crear plan')
    this.plan = new PlanModel();
    this.modalPlan = true;
    }




  guardarPlan(f:NgForm){

    if (!f.valid){
      console.log('error formulario incompleto');
      return;
    }

    if (this.plan.recintoId === 0){
      return;
    }


    let tarea = 'update';

    if (this.plan.id === 0){
      tarea = 'insert'
      this.plan.created_at =  this.conex.formatoSQL(new Date());
    }

    this.plan.recintoId = Number(this.plan.recintoId);
    console.log('guardar plan', this.plan);

    this.conex.guardarDato(`/post/plans/${tarea}`, this.plan)
        .subscribe( (resp:any) => {
                  console.log('guardado con exito');
                 this.getPlans();
                 this.modalPlan = false;
        },err =>{ console.log('error', err)})
  }


  BorrarPlan(){
    console.log('borrar plan')
    this.conex.guardarDato('/post/plans/borrar', this.plan)
    .subscribe( (resp:any) => {
              console.log('borrado con exito');
             this.getPlans();
             this.modalPlan = false;
    },err =>{ console.log('error')})
  }

}
