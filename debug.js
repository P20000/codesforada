const fs = require('fs');
const text = fs.readFileSync('C code.md', 'utf8');

const chunks = text.split(/(?:^|\n)### /).filter(c => c.trim().length > 0);
console.log(`Found ${chunks.length} chunks`);

chunks.forEach((chunk, i) => {
    const lines = chunk.split('\n');
    const title = lines[0].trim();
    const rest = lines.slice(1).join('\n');
    
    const codeMatch = rest.match(/```(\w+)?\s*\r?\n([\s\S]*?)```/);
    if (!codeMatch) {
        console.log(`[Error] Chunk ${i} (${title}) matched NO code!`);
    } else {
        console.log(`[Success] Chunk ${i} (${title}) matched! Code length: ${codeMatch[2].length}`);
    }
});
