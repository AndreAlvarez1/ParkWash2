export class PlanModel {
    id: number;
    name: string;
    description: string;	
    recintoId: number;	
    price_normal_car: number;	
    price_xl_car: number;	
    price_big_car: number;	
    frequency_top: number;	
    frequency_full: number;	
    discount: number;	
    porcentaje: number;	
    status: number;	
    created_at: string;	

   constructor() {
    this.id                 = 0;
    this.name               = '';
    this.description        = '';
    this.recintoId          = 0;
    this.price_normal_car   = 0;	
    this.price_xl_car       = 0;
    this.price_big_car      = 0;
    this.frequency_top      = 0;
    this.frequency_full     = 0;	
    this.discount           = 0;	
    this.porcentaje         = 0;	
    this.status             = 0;	
    this.created_at         = '';	
   }

}
