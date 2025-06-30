import { Schema, model, Types } from 'mongoose';
import { IIngredient } from '@/types/ingredient.types';

const ingredientSchema = new Schema<IIngredient>(
  {
    name: { type: String, required: true, unique: true },

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

// Método para eliminación lógica
ingredientSchema.methods.softDelete = function (deletedBy?: Types.ObjectId) {
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
ingredientSchema.methods.restore = function (restoredBy?: Types.ObjectId) {
  this.isDeleted = false;
  this.restoredAt = new Date();
  if (restoredBy) {
    this.restoredBy = restoredBy;
  }
  return this.save();
};

export const Ingredient = model<IIngredient>('Ingredient', ingredientSchema);
