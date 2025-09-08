import mongoose, { Schema, Document, model } from 'mongoose';

export interface INotification extends Document {
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'report' | string;
  resourceId?: string;
  imageUrl?: string;
  link?: string;
  createdAt: Date;
  usersRead: string[]; // userId do Clerk
  global: boolean;
}

const NotificationSchema = new Schema<INotification>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  resourceId: { type: String },
  imageUrl: { type: String },
  link: { type: String },
  createdAt: { type: Date, default: Date.now },
  usersRead: { type: [String], default: [] },
  global: { type: Boolean, default: true },
});

export default mongoose.models.Notification || model<INotification>('Notification', NotificationSchema); 