import { build } from "esbuild";
import pkg from "./package.json" assert { type: "json" };
import { readdirSync } from "fs";
import { join } from "path";

const lambdasDir = "src/infrastructure/lambdas";
const lambdas = readdirSync(lambdasDir).filter(f => f.endsWith(".ts"));

for (const file of lambdas) {
  const name = file.replace(".ts", ".js");

  await build({
    entryPoints: [join(lambdasDir, file)],
    bundle: true,
    platform: "node",
    target: "node20",
    outfile: `dist/lambdas/${name}`,
    format: "esm",
    sourcemap: true,
    external: [
      ...Object.keys(pkg.dependencies || {})
    ],
  });

}
