const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

// The easiest way is to split by 'model ' and then process each chunk
let chunks = schema.split(/^model\s+/m);
let newSchema = chunks[0];

for (let i = 1; i < chunks.length; i++) {
  let chunk = chunks[i];
  const modelMatch = chunk.match(/^([A-Za-z0-9_]+)\s*\{/);
  if (modelMatch) {
    const modelName = modelMatch[1];
    // find the last '}' in the chunk
    const lastBraceIndex = chunk.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
      if (!chunk.includes('@@map')) {
        const mapStr = '  @@map("' + modelName.toLowerCase() + '")\n';
        chunk = chunk.substring(0, lastBraceIndex) + mapStr + chunk.substring(lastBraceIndex);
      }
    }
  }
  newSchema += 'model ' + chunk;
}

fs.writeFileSync('prisma/schema.prisma', newSchema);
console.log('Schema updated successfully.');
