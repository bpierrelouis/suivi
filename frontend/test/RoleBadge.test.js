import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import RoleBadge from "../src/components/RoleBadge.vue";

describe("RoleBadge", () => {
  it("affiche le libellé français du rôle", () => {
    const wrapper = mount(RoleBadge, { props: { role: "gestionnaire" } });
    expect(wrapper.text()).toBe("Gestionnaire");
  });
});
