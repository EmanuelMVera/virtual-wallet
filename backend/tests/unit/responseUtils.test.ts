import { sendError } from "../../src/utils/responseUtils.js";
import { jest } from "@jest/globals";

describe("Utils - Response", () => {
  it("debe enviar un JSON con código de estado y mensaje", () => {
    const mockStatus = jest.fn().mockReturnThis();
    const mockJson = jest.fn();

    const mockRes = { status: mockStatus, json: mockJson } as any;

    sendError(mockRes, 404, "No encontrado");

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({ message: "No encontrado" });
  });
});
