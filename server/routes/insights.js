const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const tenant = require("../middleware/tenant");

const Attendance = require("../models/Attendance");
const Member = require("../models/Member");
const Payment = require("../models/Payment"); // or Revenue model
const TrainingClass = require("../models/TrainingClass");

router.get("/", auth, tenant, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date("1970-01-01");
   const end = endDate
  ? new Date(endDate + "T23:59:59.999Z")
  : new Date();


    // 1️⃣ TOTAL CHECK-INS
    const totalCheckIns = await Attendance.countDocuments({
      gym: req.gymId,
      checkInTime: { $gte: start, $lte: end },
    });

    // 2️⃣ ACTIVE MEMBERS
    const activeMembers = await Attendance.distinct("member", {
      gym: req.gymId,
      checkInTime: { $gte: start, $lte: end },
    });

    // 3️⃣ TOTAL REVENUE
    const debugPayments = await Payment.find({
  gym: req.gymId,
});

    console.log("DEBUG → PAYMENTS FOUND:", debugPayments.length);
   const revenueAgg = await Payment.aggregate([
  {
    $match: {
      gym: req.gymId,
      paymentStatus: { $ne: "failed" },
      paymentDate: { $gte: start, $lte: end },
    },
  },
  {
    $group: {
      _id: null,
      total: { $sum: "$amount" },
    },
  },
]);


    const totalRevenue = revenueAgg[0]?.total || 0;
    console.log("REVENUE AGG RESULT:", revenueAgg);
console.log("TOTAL REVENUE:", totalRevenue);


    // 4️⃣ TRAINING CLASSES COUNT
    const trainingClasses = await TrainingClass.countDocuments({
      gym: req.gymId,
      createdAt: { $gte: start, $lte: end },
    });
res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
res.set("Pragma", "no-cache");
res.set("Expires", "0");
    res.json({
      summary: {
        totalRevenue,
        totalCheckIns,
        activeMembers: activeMembers.length,
        trainingClasses,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Insights server error" });
  }
});

module.exports = router;
