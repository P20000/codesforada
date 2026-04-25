const fs = require('fs');
const text = fs.readFileSync('C code.md', 'utf8');
const chunks = text.split(/(?:^|\n)### /).filter(c => c.trim().length > 0);
console.log(`Found ${chunks.length} chunks`);
chunks.forEach((chunk, i) => {
    const lines = chunk.split('\n');
    const title = lines[0].trim();
    const rest = lines.slice(1).join('\n');
    const codeMatch = rest.match(/```(\w+)?\r?\n([\s\S]*?)```/);
    if (!codeMatch) {
        console.log(`Chunk ${i} Failed to match code! Rest starts with: ${rest.substring(0, 30)}`);
    } else {
        console.log(`Chunk ${i} matched: lang=${codeMatch[1]}`);
    }
});
