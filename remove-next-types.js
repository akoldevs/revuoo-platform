const fs = require('fs');
const path = require('path');

const tsconfigPath = path.join(__dirname, 'tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

if (tsconfig.include) {
  tsconfig.include = tsconfig.include.filter(
    (item) => item !== '.next/types/**/*.ts'
  );
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  console.log('Removed .next/types/**/*.ts from tsconfig.json include array.');
}