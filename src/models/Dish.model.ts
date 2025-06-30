import { Schema, model, Types } from 'mongoose';
import { IDish } from '@/types/dish.types';

const dishSchema = new Schema<IDish>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: 'https://placehold.co/600x400' },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: false,
    },
    ingredients: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Ingredient',
      },
    ],
    allergens: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Allergen',
      },
    ],

    // Campos de auditoría
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    deletedAt: {
      type: Date,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para mejorar las consultas
dishSchema.index({ name: 1 });
dishSchema.index({ category: 1 });
dishSchema.index({ subcategory: 1 });
dishSchema.index({ price: 1 });

// Método para eliminación lógica
dishSchema.methods.softDelete = function (deletedBy?: Types.ObjectId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  if (deletedBy) {
    this.deletedBy = deletedBy;
  }
  return this.save();
};

// Método para restaurar un documento eliminado
dishSchema.methods.restore = function () {
  this.isDeleted = false;
  this.deletedAt = undefined;
  this.deletedBy = undefined;
  return this.save();
};

export const Dish = model<IDish>('Dish', dishSchema);
