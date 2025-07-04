import { Schema, model } from 'mongoose';
import { IContact } from '@/types/contact.types';

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },

    // Campos de auditoría para lectura
    readBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    readAt: {
      type: Date,
      required: false,
    },

    // Campos de auditoría para eliminación
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

export const Contact = model<IContact>('Contact', contactSchema);
