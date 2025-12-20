const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const tenant = require("../middleware/tenant");
const TrainingClass = require("../models/TrainingClass");

/**
 * CREATE class
 */
router.post("/", auth, tenant, async (req, res) => {
  try {
    
    const newClass = new TrainingClass({
      gym: req.gymId,
      name: req.body.name,
      category: req.body.category,
      duration: req.body.duration,
      capacity: req.body.capacity,
      difficulty: req.body.difficulty,
      description: req.body.description,
      scheduleAt: req.body.scheduleAt,
      isActive: true
    });

    const saved = await newClass.save();
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

/**
 * GET all classes
 */
router.get("/", auth, tenant, async (req, res) => {
    console.log("REQ GYM ID:", req.gymId); 
  try {
    const classes = await TrainingClass.find({ gym: req.gymId });
    res.json(classes);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

/**
 * GET class by ID
 */
router.get("/:id", auth, tenant, async (req, res) => {
  const cls = await TrainingClass.findOne({
    _id: req.params.id,
    gym: req.gymId
  });

  if (!cls) return res.status(404).json({ msg: "Class not found" });
  res.json(cls);
});

/**
 * UPDATE class
 */
router.put("/:id", auth, tenant, async (req, res) => {
  const cls = await TrainingClass.findOneAndUpdate(
    { _id: req.params.id, gym: req.gymId },
    req.body,
    { new: true }
  );

  if (!cls) return res.status(404).json({ msg: "Class not found" });
  res.json(cls);
});
/**
 * DELETE class
 */
router.delete("/:id", auth, tenant, async (req, res) => {
  try {
    const cls = await TrainingClass.findOneAndDelete({
      _id: req.params.id,
      gym: req.gymId
    });

    if (!cls) {
      return res.status(404).json({ msg: "Class not found" });
    }

    res.json({ msg: "Training class deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


module.exports = router;
