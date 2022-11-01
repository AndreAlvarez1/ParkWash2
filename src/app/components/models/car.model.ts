export class CarModel {
    id: number;
    patente: string;
    marca: string;	
    modelo: string;	
    color: string;	
    tipo: string;	
    recintoId: number;	
    userId: number;	
    reg_date: string;	
    status: number;
    password: string | undefined;
    size: number;
    planId: number;
    firstName: string;
    lastName: string;
    description: string;
    notToday: number;
    washDay: number;


   constructor() {
    this.id = 0;
    this.patente = '';
    this.marca = '';	
    this.modelo = '';	
    this.color = '';	
    this.tipo = 'Auto Hatchback';	
    this.recintoId = 0;	
    this.userId = 0;	
    this.reg_date = '';	
    this.status = 0;
    this.size = 1;
    this.planId = 0;
    this.firstName = '';
    this.lastName = '';
    this.description = '' ;
    this.notToday = 9 ;
    this.washDay = 9 ;

   }

}


