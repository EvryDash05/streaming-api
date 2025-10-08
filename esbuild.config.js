import { build } from "esbuild";
import { readdirSync, rmSync, readFileSync, cpSync, existsSync, mkdirSync, statSync } from "fs";
import { join, dirname } from "path";

// Leer package.json
const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

// Rutas base
const lambdasDir = "src/infrastructure/lambdas";
const distDir = "dist";
const lambdasOutDir = join(distDir, "infrastructure/lambdas");

// Limpiar carpeta dist
rmSync(distDir, { recursive: true, force: true });

// Copiar Prisma si existe
const prismaSrc = "src/generated/prisma";
const prismaDest = join(distDir, "prisma/src/generated/prisma");
if (existsSync(prismaSrc)) {
  console.log("Copying Prisma binaries to build folder...");
  mkdirSync(prismaDest, { recursive: true });
  cpSync(prismaSrc, prismaDest, { recursive: true });
} else {
  console.warn("Prisma generated folder not found:", prismaSrc);
}

// Crear carpeta de salida principal
mkdirSync(lambdasOutDir, { recursive: true });

// 🔍 Función auxiliar: obtener todos los archivos .ts dentro de subcarpetas
function getAllLambdaFiles(dir) {
  const entries = readdirSync(dir);
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...getAllLambdaFiles(fullPath));
    } else if (entry.endsWith(".ts")) {
      files.push(fullPath);
    }
  }
  return files;
}

const lambdaFiles = getAllLambdaFiles(lambdasDir);

if (lambdaFiles.length === 0) {
  console.warn("Not found files with extension .ts", lambdasDir);
  process.exit(0);
}

// Compilar cada Lambda individualmente
for (const file of lambdaFiles) {
  const relativePath = file.replace("src/", "").replace(/\.ts$/, ".js");
  const outPath = join(distDir, relativePath);
  const outDir = dirname(outPath);
  mkdirSync(outDir, { recursive: true });

  console.log(`🔧 Build → ${relativePath}`);
  await build({
    entryPoints: [file],
    bundle: true,
    platform: "node",
    target: "node20",
    format: "cjs", // AWS Lambda usa CommonJS
    sourcemap: true,
    minify: process.env.NODE_ENV === "production",
    outfile: outPath,
    external: ["@prisma/client", ".prisma"],
  });
}

console.log("Build completed.");
