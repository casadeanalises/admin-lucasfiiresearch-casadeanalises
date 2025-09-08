import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastVerified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "Admin",
  },
);

// Método para verificar senha
adminSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

// Hash da senha antes de salvar
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;
