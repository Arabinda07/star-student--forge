const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /(?<![:\w\-])bg-white(?![\w\-\/])/g, rep: 'bg-white dark:bg-stone-900' },
  { regex: /(?<![:\w\-])bg-stone-50(?![\w\-\/])/g, rep: 'bg-stone-50 dark:bg-stone-950' },
  { regex: /(?<![:\w\-])bg-stone-100(?![\w\-\/])/g, rep: 'bg-stone-100 dark:bg-stone-800' },
  { regex: /(?<![:\w\-])bg-stone-200(?![\w\-\/])/g, rep: 'bg-stone-200 dark:bg-stone-700' },
  { regex: /(?<![:\w\-])text-stone-900(?![\w\-\/])/g, rep: 'text-stone-900 dark:text-stone-50' },
  { regex: /(?<![:\w\-])text-stone-700(?![\w\-\/])/g, rep: 'text-stone-700 dark:text-stone-200' },
  { regex: /(?<![:\w\-])text-stone-600(?![\w\-\/])/g, rep: 'text-stone-600 dark:text-stone-300' },
  { regex: /(?<![:\w\-])text-stone-500(?![\w\-\/])/g, rep: 'text-stone-500 dark:text-stone-400' },
  { regex: /(?<![:\w\-])text-stone-400(?![\w\-\/])/g, rep: 'text-stone-400 dark:text-stone-500' },
  { regex: /(?<![:\w\-])border-stone-200(?![\w\-\/])/g, rep: 'border-stone-200 dark:border-stone-800' },
  { regex: /(?<![:\w\-])border-stone-300(?![\w\-\/])/g, rep: 'border-stone-300 dark:border-stone-700' },
  { regex: /(?<![:\w\-])border-stone-100(?![\w\-\/])/g, rep: 'border-stone-100 dark:border-stone-800/50' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const {regex, rep} of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, rep);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}
processDir('src');
console.log("Done adding dark variants");
