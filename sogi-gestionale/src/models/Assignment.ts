import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAssignment extends Document {
  livello: 'Alpha' | 'Primo' | 'Secondo' | 'SecondoLivello';
  livelloNome: string;
  data: Date;
  docente?: {
    nome: string;
    cognome: string;
  };
  assegnazioni: {
    sectionId: string;
    sectionTitle: string;
    totalHours: number;
    subtopics: {
      id: string;
      code: string;
      label: string;
      hours: number;
      distanceHours: number;
    }[];
  }[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema: Schema = new Schema(
  {
    livello: {
      type: String,
      required: true,
      enum: ['Alpha', 'Primo', 'Secondo', 'SecondoLivello'],
    },
    livelloNome: {
      type: String,
      required: true,
    },
    data: {
      type: Date,
      default: Date.now,
    },
    docente: {
      nome: String,
      cognome: String,
    },
    assegnazioni: [{
      sectionId: String,
      sectionTitle: String,
      totalHours: Number,
      subtopics: [{
        id: String,
        code: String,
        label: String,
        hours: Number,
        distanceHours: Number,
      }],
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Assignment: Model<IAssignment> = mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);

export default Assignment;
