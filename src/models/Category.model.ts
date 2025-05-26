import { Schema, model, Document } from 'mongoose';

export interface ISubcategory {
  name: string;
}

export interface ICategory extends Document {
  name: string;
  subcategories?: ISubcategory[];
  isActive: boolean;
  createdBy?: string;
  updatedBy?: string;
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
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto para optimizar consultas
categorySchema.index({ name: 1, isActive: 1 });

export const Category = model<ICategory>('Category', categorySchema);
