import { afterEach, describe, expect, it, vi } from "vitest";
import { api, apiFile } from "../src/services/api.js";

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

  it("envoie les fichiers directement vers une URL S3 signée puis confirme", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ status: 201, ok: true, json: async () => ({ pieceJointe: { id: "piece-1" }, uploadUrl: "http://localhost:9000/upload", headers: { "Content-Type": "application/pdf" } }) })
      .mockResolvedValueOnce({ status: 200, ok: true })
      .mockResolvedValueOnce({ status: 200, ok: true, json: async () => ({ pieceJointe: { id: "piece-1" } }) });
    vi.stubGlobal("fetch", fetchMock);
    const bytes = new TextEncoder().encode("%PDF-1.7");
    const file = { name: "facture.pdf", type: "application/pdf", size: bytes.byteLength, arrayBuffer: async () => bytes.buffer };

    await apiFile("/materiels/material-1/pieces-jointes", file);

    expect(fetchMock).toHaveBeenNthCalledWith(2, "http://localhost:9000/upload", expect.objectContaining({ method: "PUT", body: file }));
    expect(fetchMock.mock.calls[2][0]).toBe("/api/materiels/material-1/pieces-jointes/piece-1/confirmation");
  });
});
