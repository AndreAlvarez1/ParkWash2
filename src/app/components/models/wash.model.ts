export class WashModel {
    id: number;
    washerId: number;
    carId: number;;
    recintoId: number;
    discount: number;
    status: number;
    receipt: string;
    observation: string;
    washDate: string;
    updateDate: string;
    reg_date: string;

   constructor() {
    this.id = 0;
    this.washerId = 0;
    this.carId = 0;
    this.recintoId = 0;
    this.discount = 0;
    this.status = 1;
    this.receipt = '';
    this.observation = '';
    this.washDate = '';
    this.updateDate = '';
    this.reg_date = '';
   }
 }
 

//  
// status:
// 0 -> Borrado
// 1 -> pendiente de lavar
// 2 -> Lavando
// 3 -> Lavado
// 4 -> No se pudo lavar
 
 
