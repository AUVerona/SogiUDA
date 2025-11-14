import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITeacher extends Document {
  nome: string;
  cognome: string;
  email?: string;
  materie: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TeacherSchema: Schema = new Schema(
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
      trim: true,
      lowercase: true,
    },
    materie: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

const Teacher: Model<ITeacher> = mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', TeacherSchema);

export default Teacher;
