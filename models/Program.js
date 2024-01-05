const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
          text: String,
        },
      ],
    },
  ],
});

const Program = mongoose.model("Program", ProgramSchema);

module.exports = Program;
