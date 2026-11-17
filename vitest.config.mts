import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    include: ["tests/**/*.test.ts"],
    coverage: { include: ["src/lib/format.ts", "src/lib/booking.ts", "src/components/strand/geometry.ts", "src/data/salon.ts"] },
  },
});
