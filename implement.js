const fs = require('fs');
const path = require('path');

const PLAN_FILE = path.join(__dirname, 'gtm-tracking-plan.json');
const LOG_FILE = path.join(__dirname, 'implementation-log.json');

// Get target dir from args or default to './src' relative to CWD
const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(process.cwd(), 'src');

function run() {
  if (!fs.existsSync(PLAN_FILE)) {
    console.error(`Error: Could not find tracking plan at ${PLAN_FILE}`);
    process.exit(1);
  }

  console.log(`Reading tracking plan from: ${PLAN_FILE}`);
  const planData = JSON.parse(fs.readFileSync(PLAN_FILE, 'utf-8'));
  const plan = planData.plan || [];

  if (plan.length === 0) {
    console.log("Tracking plan is empty. Nothing to implement.");
    process.exit(0);
  }

  console.log(`Scanning target directory for source files: ${targetDir}`);
  const sourceFiles = getFiles(targetDir, ['.js', '.jsx', '.ts', '.tsx']);
  console.log(`Found ${sourceFiles.length} source files.`);

  const log = [];

  sourceFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    let originalContent = content;
    let modified = false;
    let fileChanges = [];

    plan.forEach(item => {
      const element = item.element || {};
      const tags = item.tags || {};
      const gtmEvent = (tags.gtm && tags.gtm.event) ? tags.gtm.event : 'interact';
      const trackingClasses = `js-track js-${gtmEvent}`;

      // Strategy 1: Exact className match
      if (element.classes && element.classes.length > 0) {
        const classStr = `className="${element.classes.join(' ')}"`;
        const classStrSingle = `className='${element.classes.join(' ')}'`;
        
        if (content.includes(classStr) && !content.includes(trackingClasses)) {
          const replaceWith = `className="${element.classes.join(' ')} ${trackingClasses}"`;
          content = content.split(classStr).join(replaceWith);
          modified = true;
          fileChanges.push(`Injected '${trackingClasses}' via exact double-quote className match.`);
        }
        
        if (content.includes(classStrSingle) && !content.includes(trackingClasses)) {
          const replaceWith = `className='${element.classes.join(' ')} ${trackingClasses}'`;
          content = content.split(classStrSingle).join(replaceWith);
          modified = true;
          fileChanges.push(`Injected '${trackingClasses}' via exact single-quote className match.`);
        }
      }

      // Strategy 2: Exact tag + text match with no attributes (e.g. <button>Sign Up</button>)
      if (element.tag && element.text) {
        const exactMatch = `<${element.tag}>${element.text}</${element.tag}>`;
        if (content.includes(exactMatch) && !content.includes(trackingClasses)) {
          const replaceWith = `<${element.tag} className="${trackingClasses}">${element.text}</${element.tag}>`;
          content = content.split(exactMatch).join(replaceWith);
          modified = true;
          fileChanges.push(`Injected '${trackingClasses}' via exact tag+text match: ${exactMatch}`);
        }
      }

      // Strategy 3: Match id attribute
      if (element.id) {
        const idStr = `id="${element.id}"`;
        if (content.includes(idStr) && !content.includes(trackingClasses)) {
          // Simplistic injection: just append className after the id
          const replaceWith = `${idStr} className="${trackingClasses}"`;
          // Note: This could create duplicate className attrs if one already exists,
          // but works as an MVP string replacement.
          content = content.split(idStr).join(replaceWith);
          modified = true;
          fileChanges.push(`Injected '${trackingClasses}' by appending to id="${element.id}"`);
        }
      }
    });

    if (modified && content !== originalContent) {
      fs.writeFileSync(file, content, 'utf-8');
      log.push({
        file: file,
        changes: fileChanges
      });
      console.log(`Modified: ${file}`);
    }
  });

  const outputLog = {
    timestamp: new Date().toISOString(),
    filesModified: log.length,
    details: log
  };

  fs.writeFileSync(LOG_FILE, JSON.stringify(outputLog, null, 2));
  console.log(`Implementation complete. Modified ${log.length} files. Log written to ${LOG_FILE}`);
}

function getFiles(dir, extList, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file === 'node_modules' || file === '.git' || file === '.next') continue;
      getFiles(filePath, extList, fileList);
    } else {
      if (extList.includes(path.extname(filePath))) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

run();
