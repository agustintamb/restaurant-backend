import { Schema, model, Types } from 'mongoose';
import { IUser } from '@/types/user.types';
import bcrypt from 'bcryptjs';

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: false },
    role: { type: String, enum: ['admin'], default: 'admin' },

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

// Middleware para hashear password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.password) this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Método para eliminación lógica
userSchema.methods.softDelete = function (deletedBy?: Types.ObjectId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  if (deletedBy) {
    this.deletedBy = deletedBy;
  }
  return this.save();
};

// Método para restaurar un documento eliminado
userSchema.methods.restore = function () {
  this.isDeleted = false;
  this.deletedAt = undefined;
  this.deletedBy = undefined;
  return this.save();
};

export const User = model<IUser>('User', userSchema);
