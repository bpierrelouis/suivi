import "dotenv/config";
import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import projetsRoutes from "./routes/projets.routes.js";
import materielRoutes from "./routes/materiel.routes.js";
import tachesRoutes from "./routes/taches.routes.js";
import utilisateursRoutes from "./routes/utilisateurs.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", projetsRoutes);
app.use("/api", materielRoutes);
app.use("/api", tachesRoutes);
app.use("/api", utilisateursRoutes);
app.use("/api", authRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API SUIVI disponible sur http://localhost:${port}`);
});
