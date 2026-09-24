import { dashboardRepository } from "../repositories/dashboard.repository.js";
import { createDashboardService } from "../services/dashboard.service.js";

const service = createDashboardService(dashboardRepository);

export async function getDashboard(req, res) {
  res.json(await service.build(req.utilisateur));
}
