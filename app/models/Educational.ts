import mongoose from "mongoose";

interface IEducational {
  slug: string;
  title: string;
  description: string;
  image: string;
  imageCaption?: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: Date;
  updatedAt: Date;
  content: string[];
}

const educationalSchema = new mongoose.Schema<IEducational>(
  {
    slug: { 
      type: String, 
      required: true, 
      unique: true 
    },
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String, 
      required: true 
    },
    imageCaption: { 
      type: String 
    },
    author: {
      name: { type: String, required: true },
      avatar: { type: String, required: true }
    },
    content: [{ 
      type: String, 
      required: true 
    }],
    publishedAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  {
    timestamps: true,
    collection: "educational"
  }
);

const Educational = mongoose.models.Educational || mongoose.model<IEducational>("Educational", educationalSchema);

export default Educational;
export type { IEducational }; 