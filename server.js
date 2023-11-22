const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // Permet les requêtes CORS

// Simulez les données des cours
const courseData = [
  {
    moduleId: "1",
    title: "🎯 Module 1: Vision, objectif et plan d'action sur-mesure",
    lessons: [
      {
        title: "Introduction",
        vimeoId: "872525023",
      },
      {
        title: "Clarification de la vision avec le froid",
        vimeoId: "872527912",
      },
      {
        title: "Ton nouvel objectif avec la douche froide",
        vimeoId: "872530511",
      },
      {
        title: "3 méthodes pour prendre des douches froides",
        vimeoId: "872531319",
      },
      {
        title: "Construction de ton plan d’action sur-mesure",
        vimeoId: "872532012",
      },
      { title: "L'état d'esprit indispensable pour toi", vimeoId: "872533537" },
    ],
  },
  {
    moduleId: "2",
    title: "🧊 Module 2 : 7 techniques pour améliorer ton rapport au froid",
    lessons: [
      {
        title: "Comment bien respirer sous tes douches froides",
        vimeoId: "872534368",
      },
      {
        title:
          "Tips simples et puissants pour te sentir plus à l'aise avec le froid",
        vimeoId: "872535440",
      },
    ],
  },
  {
    moduleId: "3",
    title: "🗓️ Module 3 : Routine solide et régularité",
    lessons: [
      {
        title:
          "Le best moment de la journée pour tes douches froides (pour toi)",
        vimeoId: "872536608",
      },
      {
        title: "Faut-il arrêter les douches chaudes ?",
        vimeoId: "872538611",
      },
      {
        title: "Faire de la douche froide une habitude quotidienne et solide",
        vimeoId: "872539834",
      },
      {
        title: "La règle d'or pour être régulier(ère)",
        vimeoId: "872540578",
      },
      {
        title:
          "Réduire ta procrastination pour passer à l’action plus facilement",
        vimeoId: "872541362",
      },
      {
        title: "L'outil magique pour booster ta régularité et ta satisfaction",
        vimeoId: "872542849",
      },
    ],
  },
];

// Route pour obtenir les données des cours
app.get("/courses", (req, res) => {
  res.json(courseData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
