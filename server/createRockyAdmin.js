const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/gym-crm";

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    const email = "rocky@gmail.com";
    const plainPassword = "admin123";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    let user = await User.findOne({ email });

    if (user) {
      console.log("⚠️ User already exists. Updating password & role...");
      user.password = hashedPassword;
      user.role = "admin";
      user.isActive = true;
      await user.save();
    } else {
      user = new User({
        name: "Rocky Admin",
        email,
        password: hashedPassword,
        role: "admin",
        isActive: true
      });
      await user.save();
    }

    console.log("✅ Admin ready");
    console.log("Email:", email);
    console.log("Password:", plainPassword);

    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

createAdmin();
