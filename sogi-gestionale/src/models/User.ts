import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  nome: string;
  cognome: string;
  email: string;
  password: string;
  scuola: string;
  ruolo: 'admin' | 'docente';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    nome: {
      type: String,
      required: [true, 'Il nome è obbligatorio'],
      trim: true,
    },
    cognome: {
      type: String,
      required: [true, 'Il cognome è obbligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'L\'email è obbligatoria'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'La password è obbligatoria'],
      minlength: 6,
    },
    scuola: {
      type: String,
      required: [true, 'La scuola è obbligatoria'],
      trim: true,
    },
    ruolo: {
      type: String,
      enum: ['admin', 'docente'],
      default: 'docente',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
