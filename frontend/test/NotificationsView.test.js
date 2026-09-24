import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NotificationsView from "../src/views/NotificationsView.vue";
import { api } from "../src/services/api.js";

vi.mock("../src/services/api.js", () => ({ api: vi.fn() }));

describe("NotificationsView", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche et marque seulement la notification choisie comme lue", async () => {
    api.mockResolvedValueOnce({ nonLues: 1, notifications: [{ id: "n-1", titre: "Matériel archivé", message: "Un créneau a été libéré.", creeLe: "2026-09-24T08:00:00Z", luLe: null }] }).mockResolvedValueOnce(null);
    const wrapper = mount(NotificationsView, { global: { stubs: { AppLayout: { template: "<main><slot /></main>" } } } });
    await flushPromises();
    expect(wrapper.text()).toContain("Matériel archivé");
    await wrapper.get("button").trigger("click");
    await flushPromises();
    expect(api).toHaveBeenLastCalledWith("/notifications/n-1/lu", { method: "PATCH" });
    expect(wrapper.text()).toContain("0 non lue");
  });
});
