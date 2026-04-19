const fs = require('fs');
const path = require('path');

const replacements = [
  // 1. Touch targets (P1)
  { regex: /w-10 h-10/g, rep: 'w-11 h-11' },
  { regex: /w-10/g, rep: 'w-11' }, // Safety check for unaccompanied w-10
  { regex: /h-10/g, rep: 'h-11' }, 
  // Wait, I shouldn't replace solitary w-10/h-10 unless I know they represent touch targets. Let's just do `w-10 h-10` and `w-11 h-11`.
  // Wait! The previous regex matches w-10 h-10 then w-10 separately, replacing it to w-11 h-11. I should be precise.
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
      
      // P1: Replace touch targets w-10 h-10 -> w-11 h-11
      if (content.includes('w-10 h-10')) {
        content = content.replace(/w-10 h-10/g, 'w-11 h-11');
        changed = true;
      }
      
      // Also catch w-10 and h-10 if they are standing alone for touch targets. Wait, `w-10` is 40px. 
      // What about `min-w-[40px]`? None used.
      
      // P1: Colorize contrast text-stone-400 dark:text-stone-500 -> text-stone-500 dark:text-stone-400
      if (content.includes('text-stone-400 dark:text-stone-500')) {
        content = content.replace(/text-stone-400 dark:text-stone-500/g, 'text-stone-500 dark:text-stone-400');
        changed = true;
      }
      
      // Fix P1 Colorize contrast for text-amber-500 -> text-amber-600
      if (content.includes('text-amber-500')) {
        content = content.replace(/(?<!bg-)text-amber-500/g, 'text-amber-600');
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir('src');
console.log("Done applying adapt, colorize rules");
