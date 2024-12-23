export type Token = {
  access: string;
  refresh: string;
};

export interface Claims {
  [key: string]: any;
  userId: string;
}
