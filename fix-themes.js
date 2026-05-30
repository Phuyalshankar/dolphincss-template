const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/USER/Desktop/dolphincss-template/templates';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Remove all dark: classes completely
  content = content.replace(/dark:bg-[a-zA-Z0-9-]+\b/g, '');
  content = content.replace(/dark:text-[a-zA-Z0-9-]+\b/g, '');
  content = content.replace(/dark:border-[a-zA-Z0-9-]+\b/g, '');
  content = content.replace(/dark:[a-zA-Z0-9-]+\b/g, '');
  
  // 2. Replace hardcoded light mode colors with semantic variables
  // Backgrounds
  content = content.replace(/\bbg-gray-[5-9]00\b/g, 'bg-surface-dark');
  content = content.replace(/\bbg-gray-[1-4]00\b/g, 'bg-surface-alt');
  content = content.replace(/\bbg-gray-50\b/g, 'bg-surface');
  // Only replace bg-white if it's not followed by a slash (like bg-white/10)
  content = content.replace(/\bbg-white(?![\/\w-])\b/g, 'bg-surface');
  
  // Text
  content = content.replace(/\btext-gray-[7-9]00\b/g, 'text-text');
  content = content.replace(/\btext-gray-[4-6]00\b/g, 'text-text-muted');
  content = content.replace(/\btext-black\b/g, 'text-text');
  
  // Borders
  content = content.replace(/\bborder-gray-\d+\b/g, 'border-border');
  
  // Clean up spaces left by removals
  content = content.replace(/\s{2,}/g, ' ');
  content = content.replace(/ class=\s+"/g, ' class="');
  content = content.replace(/ className=\s+"/g, ' className="');
  content = content.replace(/"\s+>/g, '">');

  fs.writeFileSync(filePath, content);
});
console.log('Templates updated successfully!');
