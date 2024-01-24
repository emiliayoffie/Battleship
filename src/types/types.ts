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
  type: string;
}

export type BoardLayout = (SQUARE_STATE | undefined)[];

export interface Vessel {
  name: string;
  length: number;
  position?: Coordinates;
  orientation: string;
  placed: boolean | null | undefined;
  sunk?: boolean;
}

export interface Ship {
  name: string;
  length: number;
  placed: boolean | null;
}
