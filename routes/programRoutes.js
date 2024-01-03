const express = require("express");
const router = express.Router();
const Program = require("../models/Program");

router.get("/", async (req, res) => {
  try {
    const programs = await Program.find();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProgram = new Program(req.body);
    await newProgram.save();
    res.status(201).json(newProgram);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      res.status(404).json({ message: "Programme non trouvé" });
    } else {
      res.json(program);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Program.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).json({ message: "Programme non trouvé" });
    } else {
      res.json({ message: "Programme supprimé" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const programId = req.params.id;
    const updatedProgram = await Program.findByIdAndUpdate(
      programId,
      req.body,
      { new: true }
    );
    if (!updatedProgram) {
      return res.status(404).json({ message: "Programme non trouvé" });
    }
    res.json(updatedProgram);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
