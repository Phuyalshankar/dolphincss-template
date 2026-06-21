const fs = require('fs');
const path = './config/markers.json';
const markers = JSON.parse(fs.readFileSync(path, 'utf8'));

const newComponents = [
  'dolphin-drawer',
  'dolphin-breadcrumbs',
  'dolphin-pagination',
  'dolphin-steps',
  'dolphin-hero',
  'dolphin-pricing',
  'dolphin-carousel',
  'dolphin-timeline',
  'dolphin-dropzone',
  'dolphin-chat',
  'dolphin-rating'
];

newComponents.forEach(comp => {
  markers[comp] = {
    templateFile: comp + '.html',
    addClasses: ''
  };
});

fs.writeFileSync(path, JSON.stringify(markers, null, 4));
console.log('Added 11 components to markers.json');
