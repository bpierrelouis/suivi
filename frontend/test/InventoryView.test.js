import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import InventoryView from "../src/views/InventoryPreviewView.vue";
import { api } from "../src/services/api.js";

let role = "utilisateur";
vi.mock("../src/services/api.js", () => ({ api: vi.fn(), apiBlob: vi.fn(), apiFile: vi.fn() }));
vi.mock("../src/stores/auth.js", () => ({ useAuthStore: () => ({ utilisateur: { role } }) }));
const global = { stubs: { AppLayout: { template: "<main><slot /></main>" }, ModalShell: { template: "<section><slot name='actions' /><slot /></section>" } } };

describe("InventoryView", () => {
  beforeEach(() => {
    vi.clearAllMocks(); role = "utilisateur";
    api.mockImplementation(async (path) => path.startsWith("/materiels/categories") ? { categories: [{ id: "cat-1", nom: "Mesure" }] } : { materiels: [{ id: "mat-1", nom: "Oscilloscope", modeSuivi: "individualise", numeroInventaire: "INV-1", numeroSerie: null, referenceConstructeur: null, categories: [{ id: "cat-1", nom: "Mesure" }], modifieLe: "2026-09-24T08:00:00Z" }] });
  });

  it("affiche les données actives renvoyées par l'API", async () => {
    const wrapper = mount(InventoryView, { global }); await flushPromises();
    expect(wrapper.text()).toContain("Oscilloscope"); expect(wrapper.text()).toContain("INV-1"); expect(wrapper.text()).toContain("Mesure");
  });

  it("masque les actions de gestion à un utilisateur", async () => {
    const wrapper = mount(InventoryView, { global }); await flushPromises();
    expect(wrapper.text()).not.toContain("Nouveau matériel"); expect(wrapper.find(".page-actions").exists()).toBe(false);
  });
});
