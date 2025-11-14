import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubject extends Document {
  nome: string;
  codice: string;
  descrizione?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema: Schema = new Schema(
  {
    nome: {
      type: String,
      required: [true, 'Il nome della materia è obbligatorio'],
      trim: true,
    },
    codice: {
      type: String,
      required: [true, 'Il codice è obbligatorio'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    descrizione: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subject: Model<ISubject> = mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);

export default Subject;
