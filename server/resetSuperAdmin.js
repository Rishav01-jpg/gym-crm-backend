const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const resetSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const password = "admin123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.findOneAndUpdate(
      { email: "superadmin@gymcrm.com" },
      {
        password: hashedPassword,
        role: "superadmin",
        isActive: true,
        $unset: { gym: "" }
      },
      { new: true }
    );

    if (!user) {
      console.log("❌ Superadmin user not found");
    } else {
      console.log("✅ Superadmin password reset successfully");
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

resetSuperAdmin();
