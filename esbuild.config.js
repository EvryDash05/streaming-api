import { build } from "esbuild";
import { readdirSync, rmSync, readFileSync, cpSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { execSync } from "child_process";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

const lambdasDir = "src/infrastructure/lambdas";
const distDir = "dist";
const lambdasOutDir = join(distDir, "lambdas");

// Limpiar carpeta dist
rmSync(distDir, { recursive: true, force: true });

// Copiar binarios de Prisma al dist
const prismaSrc = join("src/generated/prisma");
const prismaDest = join(distDir, "prisma/src/generated/prisma");

if (existsSync(prismaSrc)) {
  console.log("Copying Prisma binaries to build folder...");
  mkdirSync(prismaDest, { recursive: true });
  cpSync(prismaSrc, prismaDest, { recursive: true });
} else {
  console.warn("Prisma generated folder not found:", prismaSrc);
}

// Crear carpeta /lambdas en dist
mkdirSync(lambdasOutDir, { recursive: true });

// Detectar lambdas
const lambdas = readdirSync(lambdasDir).filter(f => f.endsWith(".ts"));

for (const file of lambdas) {
  const name = file.replace(".ts", ".js");
  const outPath = join(lambdasOutDir, name);

  await build({
    entryPoints: [join(lambdasDir, file)],
    bundle: true,
    platform: "node",
    target: "node20",
    format: "cjs", // CommonJS compatible con AWS Lambda
    sourcemap: true,
    minify: process.env.NODE_ENV === "production",
    outfile: outPath,
    external: ["@prisma/client", ".prisma"], // Evitar bundlear Prisma y binarios
  });
}
