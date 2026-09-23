import { buildDashboard } from "../services/dashboard.service.js";

export function getDashboard(req, res) {
  res.json(buildDashboard(req.utilisateur));
}
