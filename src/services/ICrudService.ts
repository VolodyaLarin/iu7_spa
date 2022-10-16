export interface ICrudService<T, F, U> {
  filter(filter: F): Promise<T[]>;
  update(id: string, row: U): Promise<T>;
  insert(row: U): Promise<T>;
  read(id: string): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
