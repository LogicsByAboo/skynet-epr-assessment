import express from "express";
import peopleRoutes from "./routes/people.route";
import eprRoutes from "./routes/epr.routes";
import { mockAuth } from "./middleware/mockAuth";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use(mockAuth);

app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

/* LEVEL 1 ROUTES */
app.use("/api/people", peopleRoutes);
app.use("/api/epr", eprRoutes);





app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});