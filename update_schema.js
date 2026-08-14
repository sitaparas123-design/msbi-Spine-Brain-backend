const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
const models = [...schema.matchAll(/model\s+([A-Za-z0-9_]+)\s+{/g)].map(m => m[1]);

for (const model of models) {
  const mapStr = '  @@map("' + model.toLowerCase() + '")\n}';
  // Replace the closing brace of the model with the @@map declaration and the closing brace
  const regex = new RegExp('model ' + model + ' \\s*{[^}]*}(?=\\s*model|\\s*$)', 'g');
  schema = schema.replace(regex, (match) => {
    if (match.includes('@@map')) return match; // Already mapped
    return match.replace(/}\s*$/, mapStr + '\n');
  });
}

fs.writeFileSync('prisma/schema.prisma', schema);
console.log('Schema updated successfully.');
