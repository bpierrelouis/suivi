import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProjectsView from "../src/views/ProjectsView.vue";
import { api } from "../src/services/api.js";

vi.mock("../src/services/api.js", () => ({ api: vi.fn() }));

const global = {
  stubs: {
    AppLayout: { template: "<main><slot /></main>" },
    RouterLink: { template: "<a><slot /></a>" },
  },
};

describe("ProjectsView", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche uniquement les projets renvoyés par l'API", async () => {
    api.mockResolvedValue({
      projets: [
        {
          id: "project-1",
          nom: "Modernisation du laboratoire",
          description: "Description du projet",
          visibilite: "prive",
          statut: "actif",
          responsable: { identifiant: "lea.fournier@demo.local" },
          nombreMembres: 1,
        },
      ],
    });

    const wrapper = mount(ProjectsView, { global });
    await flushPromises();

    expect(api).toHaveBeenCalledWith("/projets");
    expect(wrapper.text()).toContain("Modernisation du laboratoire");
    expect(wrapper.text()).toContain("Privé");
    expect(wrapper.text()).toContain("lea.fournier@demo.local");
  });

  it("présente un message clair lorsque le chargement échoue", async () => {
    api.mockRejectedValue(new Error("ERREUR_RESEAU"));

    const wrapper = mount(ProjectsView, { global });
    await flushPromises();

    expect(wrapper.get("[role='alert']").text()).toBe("Impossible de charger les projets.");
  });
});
