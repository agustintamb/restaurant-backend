import { Schema, model, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  categoryId: Types.ObjectId;
  subcategoryId?: string;
  name: string;
  description: string;
  ingredientes: string[];
  alergenos: string[];
  precio: number;
  img: string;
  isActive: boolean;
  createdBy?: string;
  updatedBy?: string;
}

const productSchema = new Schema<IProduct>(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategoryId: { type: String },
    name: { type: String, required: true },
    description: { type: String, required: true },
    ingredientes: [{ type: String }],
    alergenos: [{ type: String }],
    precio: { type: Number, required: true },
    img: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

// Índices para optimizar consultas
productSchema.index({ categoryId: 1, isActive: 1 });
productSchema.index({ name: 1, isActive: 1 });

export const Product = model<IProduct>('Product', productSchema);
