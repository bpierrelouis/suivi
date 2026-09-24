import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CalendarView from "../src/views/CalendarView.vue";
import { api } from "../src/services/api.js";

vi.mock("../src/services/api.js", () => ({ api: vi.fn() }));

describe("CalendarView", () => {
  beforeEach(() => vi.clearAllMocks());

  it("distingue un créneau réservé d'une journée disponible", async () => {
    const monday = new Date(); monday.setHours(0, 0, 0, 0); const day = monday.getDay() || 7; monday.setDate(monday.getDate() - day + 1);
    const start = new Date(monday); start.setHours(8); const end = new Date(monday); end.setHours(10);
    api.mockResolvedValue({ materiels: [{ id: "m-1", nom: "Oscilloscope", numeroInventaire: "INV-1", numeroSerie: null, reservations: [{ id: "r-1", debut: start.toISOString(), fin: end.toISOString(), projet: { id: null, nom: "Réservé" } }] }] });
    const wrapper = mount(CalendarView, { global: { stubs: { AppLayout: { template: "<main><slot /></main>" }, RouterLink: { template: "<a><slot /></a>" } } } });
    await flushPromises();
    expect(wrapper.text()).toContain("Oscilloscope");
    expect(wrapper.text()).toContain("Réservé");
    expect(wrapper.text()).toContain("Disponible");
  });
});
