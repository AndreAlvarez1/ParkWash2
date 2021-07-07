export class CardModel {
    id: number;
    number: string;
    status: number;
    active: number;
    created_at: string;
    short: string;
    userId: number;

   constructor() {
    this.id = 0;
    this.number = '';
    this.status = 1;
    this.active = 1;
    this.created_at = '';
    this.short = '';
    this.userId = 0;
   }

}


