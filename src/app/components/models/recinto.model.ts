export class RecintoModel {
   id: number;
   nombre: string;
   direccion: string;
   lat: number;
   lng: number;
   status: number;
   reg_date: string;

  constructor() {
   this.id = 0;
   this.nombre = '';
   this.direccion = '';
   this.lat = 0;
   this.lng = 0;
   this.status = 0;
   this.reg_date = '';
  }
}


