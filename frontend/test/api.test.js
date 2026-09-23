import { afterEach, describe, expect, it, vi } from "vitest";
import { api } from "../src/services/api.js";

describe("client API", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("utilise une URL relative relayée par le reverse proxy", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ status: 204, ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await api("/health/live");

    expect(fetchMock).toHaveBeenCalledWith("/api/health/live", expect.objectContaining({
      credentials: "include",
    }));
  });
});
