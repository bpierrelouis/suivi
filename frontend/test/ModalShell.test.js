import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ModalShell from "../src/components/ModalShell.vue";

describe("ModalShell", () => {
  it("utilise une fermeture unique et une hauteur stable à la demande", async () => {
    const wrapper = mount(ModalShell, {
      props: { title: "Projet", wide: true, stable: true },
      slots: { default: "<div class='modal__body'>Contenu</div>" },
    });

    expect(wrapper.get("[role='dialog']").classes()).toContain("modal--stable");
    expect(wrapper.findAll("[aria-label='Fermer']")).toHaveLength(1);

    await wrapper.get("[aria-label='Fermer']").trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(1);
  });

  it("ne ferme pas la fenêtre lors d'un clic sur l'arrière-plan", async () => {
    const wrapper = mount(ModalShell, { props: { title: "Projet" } });
    await wrapper.get(".modal-backdrop").trigger("mousedown");
    expect(wrapper.emitted("close")).toBeUndefined();
  });
});
