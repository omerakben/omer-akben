const fs = require("fs");
const path = require("path");

const root = __dirname;

const manifestFiles = [
  ".next/server/app/page_client-reference-manifest.js",
  ".next/server/app/skills/page_client-reference-manifest.js",
  ".next/server/app/projects/page_client-reference-manifest.js",
  ".next/server/app/contact/page_client-reference-manifest.js",
];

const ensureManifest = (filePath) => {
  const absolutePath = path.resolve(root, filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(
      `Missing ${filePath}. Run \"pnpm run build\" before \"pnpm run size\".`
    );
  }
  require(absolutePath);
};

globalThis.__RSC_MANIFEST = {};
manifestFiles.forEach(ensureManifest);

const manifest = globalThis.__RSC_MANIFEST;

const getEntryFiles = (routeKey, entryKey) => {
  const route = manifest[routeKey];
  const entryFiles = route?.entryJSFiles?.[entryKey];

  if (!entryFiles) {
    throw new Error(`Missing entryJSFiles for ${routeKey} (${entryKey}).`);
  }

  return entryFiles.map((file) => path.join(".next", file));
};

const layoutEntryKey = "[project]/src/app/layout";
const layoutFiles = new Set(getEntryFiles("/page", layoutEntryKey));

const routes = [
  {
    name: "Homepage",
    routeKey: "/page",
    entryKey: "[project]/src/app/page",
    limit: "40 kB",
  },
  {
    name: "Skills Page",
    routeKey: "/skills/page",
    entryKey: "[project]/src/app/skills/page",
    limit: "10 kB",
  },
  {
    name: "Projects Page",
    routeKey: "/projects/page",
    entryKey: "[project]/src/app/projects/page",
    limit: "15 kB",
  },
  {
    name: "Contact Page",
    routeKey: "/contact/page",
    entryKey: "[project]/src/app/contact/page",
    limit: "10 kB",
  },
];

const routeFiles = routes.reduce((acc, route) => {
  const files = getEntryFiles(route.routeKey, route.entryKey).filter(
    (file) => !layoutFiles.has(file)
  );

  acc[route.name] = Array.from(new Set(files));
  return acc;
}, {});

const fileCounts = Object.values(routeFiles)
  .flat()
  .reduce((acc, file) => {
    acc[file] = (acc[file] || 0) + 1;
    return acc;
  }, {});

const sharedFiles = new Set(
  Object.entries(fileCounts)
    .filter(([, count]) => count > 1)
    .map(([file]) => file)
);

module.exports = routes.map((route) => {
  const files = routeFiles[route.name].filter(
    (file) => !sharedFiles.has(file)
  );

  if (files.length === 0) {
    throw new Error(`No route-specific chunks found for ${route.routeKey}.`);
  }

  return {
    name: route.name,
    path: files,
    limit: route.limit,
  };
});
