import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import AppLayout from "../src/components/AppLayout.vue";

vi.mock("../src/stores/auth.js", () => ({
  useAuthStore: () => ({
    utilisateur: { identifiant: "admin@demo.local", role: "administrateur" },
    deconnexion: vi.fn(),
  }),
}));
vi.mock("../src/services/api.js", () => ({ api: vi.fn().mockResolvedValue({ nonLues: 2 }) }));
vi.mock("vue-router", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("AppLayout", () => {
  it("regroupe le compte et la déconnexion et n'affiche qu'un accès aux notifications", async () => {
    const wrapper = mount(AppLayout, {
      global: {
        stubs: {
          RouterLink: {
            props: ["to"],
            template: "<a :data-to=\"typeof to === 'string' ? to : ''\"><slot /></a>",
          },
        },
      },
    });
    await flushPromises();

    expect(wrapper.text().match(/admin@demo\.local/g)).toHaveLength(1);
    expect(wrapper.findAll('[data-to="/notifications"]')).toHaveLength(1);
    expect(wrapper.get(".sidebar-account").text()).toContain("Déconnexion");
  });
});
