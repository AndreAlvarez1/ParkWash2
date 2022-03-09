export class PhotoModel {
    id: number;
    washId: number;
    tipo:string;
    url:string;
    filename: string;
    status: number;
    reg_date: string;



   constructor() {
    this.id         = 0;
    this.washId     = 0;
    this.tipo       = '';
    this.url        = '';
    this.filename   = '';
    this.status     = 0;
    this.reg_date   = '';

   }

}


