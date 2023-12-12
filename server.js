const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

app.use(cors());
app.use(express.json()); // Pour parser les requêtes JSON entrantes

mongoose.connect("mongodb://127.0.0.1:27017/programs");

const ProgramSchema = new mongoose.Schema({
  programTitle: String,
  courses: [
    {
      moduleId: String,
      title: String,
      lessons: [
        {
          title: String,
          vimeoId: String,
        },
      ],
    },
  ],
});

const Program = mongoose.model("Program", ProgramSchema);

app.get("/programs", async (req, res) => {
  try {
    const programs = await Program.find();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/programs", async (req, res) => {
  console.log(req.body);
  req.body.courses.forEach((course, index) => {
    // Remplacez 'modules' par 'courses'
    console.log(`Course ${index + 1}: ${course.title}`);
    course.lessons.forEach((lesson, lessonIndex) => {
      console.log(
        `  Lesson ${lessonIndex + 1}: ${lesson.title}, Vimeo ID: ${
          lesson.vimeoId
        }`
      );
    });
  });
  try {
    const newProgram = new Program(req.body);
    await newProgram.save();
    res.status(201).json(newProgram);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
