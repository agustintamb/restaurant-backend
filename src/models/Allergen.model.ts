import { Schema, model, Types } from 'mongoose';
import { IAllergen } from '@/types/allergen.types';

const allergenSchema = new Schema<IAllergen>(
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
allergenSchema.methods.softDelete = function (deletedBy?: Types.ObjectId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  if (deletedBy) {
    this.deletedBy = deletedBy;
  }
  return this.save();
};

// Método para restaurar un documento eliminado
allergenSchema.methods.restore = function () {
  this.isDeleted = false;
  this.deletedAt = undefined;
  this.deletedBy = undefined;
  return this.save();
};

export const Allergen = model<IAllergen>('Allergen', allergenSchema);
