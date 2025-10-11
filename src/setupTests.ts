import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "node:util";

// Corrige erro "ReferenceError: TextEncoder is not defined"
// sem conflito de tipos com o DOM
if (typeof global.TextEncoder === "undefined") {
  Object.assign(global, { TextEncoder });
}

if (typeof global.TextDecoder === "undefined") {
  Object.assign(global, { TextDecoder });
}
