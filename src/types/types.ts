export enum SQUARE_STATE {
    empty = 'empty',
    ship = 'ship',
    hit = 'hit',
    miss = 'miss',
    ship_sunk = 'ship-sunk',
    forbidden = 'forbidden',
    awaiting = 'awaiting',
  }
  
  export interface Coordinates {
    x: number;
    y: number;
  }
  
  export interface Hit {
    position: Coordinates;
  }
  
  export type BoardLayout = (SQUARE_STATE | undefined)[];
  
  export interface Vessel {
    length: number;
    position: Coordinates;
    orientation: 'vertical' | 'horizontal';
    placed?: boolean;
    // sunk: boolean; // not sure if this is needed
  }
  
  export interface Ship { 
    name: string; 
    length: number; 
    placed: boolean | null;
  }
  