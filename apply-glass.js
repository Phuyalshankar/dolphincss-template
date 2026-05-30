const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/USER/Desktop/dolphincss-template/templates';

const componentsToGlassify = [
  'dolphin-card.html',
  'dolphin-dropdown.html',
  'dolphin-popover.html',
  'dolphin-tooltip.html',
  'dolphin-toast.html',
  'dolphin-alert.html',
  'dolphin-navbar.html',
  'dolphin-table.html',
  'dolphin-login.html',
  'dolphin-register.html',
  'dolphin-tabs.html',
  'dolphin-accordion.html',
  'dolphin-skeleton.html'
];

componentsToGlassify.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // A simple heuristic: find the first class=" or className=" and append the glass utilities
  // But wait, it's safer to just inject it if it's not already there.
  const glassClasses = ' glass bg-surface/70 border border-border/50 backdrop-blur-xl ';
  
  // For each specific file, we can do targeted replacements
  if (file === 'dolphin-card.html') {
    content = content.replace(/className="card /, 'className="card' + glassClasses);
  } else if (file === 'dolphin-dropdown.html') {
    content = content.replace(/bg-surface-alt/g, 'bg-surface/70 glass backdrop-blur-xl border border-border/50');
  } else if (file === 'dolphin-popover.html') {
    content = content.replace(/bg-surface-alt/g, 'bg-surface/70 glass backdrop-blur-xl border border-border/50');
  } else if (file === 'dolphin-tooltip.html') {
    content = content.replace(/bg-surface-dark/g, 'bg-surface-dark/80 glass backdrop-blur-md border border-border/20');
  } else if (file === 'dolphin-toast.html') {
    content = content.replace(/className="toast /g, 'className="toast' + glassClasses);
  } else if (file === 'dolphin-alert.html') {
    content = content.replace(/className="alert /g, 'className="alert' + glassClasses);
  } else if (file === 'dolphin-navbar.html') {
    content = content.replace(/bg-surface /g, 'bg-surface/70 glass backdrop-blur-xl border-b border-border/50 ');
  } else if (file === 'dolphin-table.html') {
    content = content.replace(/<div className="overflow-x-auto/g, '<div className="overflow-x-auto' + glassClasses + ' rounded-xl"');
  } else if (file === 'dolphin-login.html' || file === 'dolphin-register.html') {
    content = content.replace(/bg-surface-alt/g, 'bg-surface/70 glass backdrop-blur-2xl border border-border/50');
  } else if (file === 'dolphin-tabs.html') {
    // Add glass to the tab list background
    content = content.replace(/bg-surface-alt/g, 'bg-surface/50 glass backdrop-blur-md border border-border/30');
    // Add glass to tab content
    content = content.replace(/className="mt-2/g, 'className="mt-2 p-4 rounded-xl glass bg-surface/40 border border-border/20');
  } else if (file === 'dolphin-accordion.html') {
    content = content.replace(/border-border/g, 'border-border/50');
    content = content.replace(/className="w-full max-w-2xl"/, 'className="w-full max-w-2xl glass bg-surface/40 backdrop-blur-xl rounded-2xl border border-border/50 p-2"');
  }
  
  // Clean up duplicate glass or borders
  content = content.replace(/glass glass/g, 'glass');
  content = content.replace(/border border border/g, 'border');
  
  fs.writeFileSync(filePath, content);
});

console.log("Glass effect applied to components!");
