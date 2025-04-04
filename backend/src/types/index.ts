import { Document, Model, Schema, Types } from 'mongoose';

export interface User {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  googleCalendarId?: string;
}

export interface Appointment {
  userId: Types.ObjectId;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  googleCalendarEventId?: string;
}

export interface UserMethods {
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  googleCalendarId?: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export type UserModel = Model<UserDocument>;

export interface AppointmentDocument extends Document {
  userId: Types.ObjectId;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  googleCalendarEventId?: string;
}

// Express types
export interface AuthRequest {
  user?: UserDocument;
  query: any;
  params: any;
  body: any;
  headers: any;
  method: string;
  url: string;
}

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

export type RequestHandler = (
  req: any, 
  res: any, 
  next: any
) => Promise<void>; 