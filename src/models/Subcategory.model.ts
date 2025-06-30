import { Schema, model, Types } from 'mongoose';
import { ISubcategory } from '@/types/subcategory.types';

const subcategorySchema = new Schema<ISubcategory>(
  {
    name: { type: String, required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

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
    restoredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    restoredAt: {
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

// Índice compuesto para evitar subcategorías duplicadas dentro de la misma categoría
subcategorySchema.index({ name: 1, category: 1 }, { unique: true });

// Método para eliminación lógica
subcategorySchema.methods.softDelete = function (deletedBy?: Types.ObjectId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  if (deletedBy) {
    this.deletedBy = deletedBy;
  }
  // Limpiar campos de restore
  this.restoredAt = undefined;
  this.restoredBy = undefined;
  return this.save();
};

// Método para restaurar un documento eliminado
subcategorySchema.methods.restore = function (restoredBy?: Types.ObjectId) {
  this.isDeleted = false;
  this.restoredAt = new Date();
  if (restoredBy) {
    this.restoredBy = restoredBy;
  }
  return this.save();
};

export const Subcategory = model<ISubcategory>('Subcategory', subcategorySchema);
