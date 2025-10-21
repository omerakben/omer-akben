import { existsSync, mkdirSync, writeFileSync } from "fs";

const dir = "public/assets";

if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

const files = [
  "Omer_Akben_Resume.pdf",
  "Omer_Akben_Resume_Extended.pdf",
  "Omer-Akben-AWS-Certificate.pdf",
  "Omer-Akben-NSS-Certificate.pdf",
];

for (const file of files) {
  const filePath = `${dir}/${file}`;
  if (!existsSync(filePath)) {
    writeFileSync(filePath, "Replace with final file before public launch.\n");
  }
}

const readmePath = `${dir}/README.txt`;
if (!existsSync(readmePath)) {
  writeFileSync(readmePath, "Place final PDF/DOCX assets here before launch.\n");
}

console.log("Seeded placeholder assets.");
