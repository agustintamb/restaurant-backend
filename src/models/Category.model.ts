import { Schema, model, Types } from 'mongoose';
import { ICategory } from '@/types/category.types';
import { generateSlug } from '@/utils/slug';

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    nameSlug: { type: String, required: true, unique: true },
    subcategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Subcategory',
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

// Middleware para generar nameSlug automáticamente antes de guardar
categorySchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.nameSlug = generateSlug(this.name);
  }
  next();
});

// Índice para el slug
categorySchema.index({ nameSlug: 1 });

// Método para eliminación lógica
categorySchema.methods.softDelete = function (deletedBy?: Types.ObjectId) {
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
categorySchema.methods.restore = function (restoredBy?: Types.ObjectId) {
  this.isDeleted = false;
  this.restoredAt = new Date();
  if (restoredBy) {
    this.restoredBy = restoredBy;
  }
  return this.save();
};

export const Category = model<ICategory>('Category', categorySchema);
