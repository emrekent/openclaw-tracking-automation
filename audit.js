#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2];

if (!targetDir) {
  console.error('Usage: node audit.js <target-directory>');
  process.exit(1);
}

const report = {
  timestamp: new Date().toISOString(),
  scannedDirectory: targetDir,
  filesScanned: 0,
  elementsFound: []
};

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      report.filesScanned++;
      auditFile(fullPath);
    }
  }
}

function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Basic regex for MVP
  const buttonRegex = /<button[^>]*>/gi;
  const linkRegex = /<a\s[^>]*href[^>]*>/gi;
  const formRegex = /<form[^>]*>/gi;

  const addMatches = (regex, type) => {
    let match;
    while ((match = regex.exec(content)) !== null) {
      report.elementsFound.push({
        file: filePath,
        type: type,
        match: match[0],
        line: content.substring(0, match.index).split('\n').length
      });
    }
  };

  addMatches(buttonRegex, 'button');
  addMatches(linkRegex, 'link');
  addMatches(formRegex, 'form');
}

try {
  const resolvedDir = path.resolve(targetDir);
  scanDir(resolvedDir);
  const reportPath = path.join(process.cwd(), 'audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Audit complete. Scanned ${report.filesScanned} files. Found ${report.elementsFound.length} interactive elements. Report saved to ${reportPath}`);
} catch (err) {
  console.error('Error during audit:', err.message);
  process.exit(1);
}
