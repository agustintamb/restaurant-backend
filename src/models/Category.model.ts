import { Schema, model, Document } from 'mongoose';

export interface ISubcategory {
  name: string;
}

export interface ICategory extends Document {
  name: string;
  subcategories?: ISubcategory[];
}

const subcategorySchema = new Schema<ISubcategory>(
  {
    name: { type: String, required: true },
  },
  { _id: false }
);

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    subcategories: [subcategorySchema],
  },
  {
    timestamps: true,
  }
);

export const Category = model<ICategory>('Category', categorySchema);
