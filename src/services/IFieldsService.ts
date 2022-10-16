export interface IField {
  fieldName: string;
  fieldType: string;
  fieldLabel: string;
}

export interface IFieldService {
  getFields: () => Promise<IField[]>;
  updateFields: (fields: IField[]) => Promise<IField[]>;
}
