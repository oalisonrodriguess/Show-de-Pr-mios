const fs = require('fs');

let content = fs.readFileSync('index.tsx', 'utf8');

// Find all classList.add or classList.remove calls and replace spaced arguments with separate arguments
const regex = /classList\.(add|remove)\(([^)]+)\)/g;

content = content.replace(regex, (match, op, args) => {
    // split the args by comma, then trim, then if any of them contain a space, split them further
    let newArgs = [];
    const parts = args.split(',').map(p => p.trim());
    for (let part of parts) {
        if (part.startsWith("'") && part.endsWith("'") && part.includes(' ')) {
            const inner = part.slice(1, -1);
            const classes = inner.split(/\s+/);
            for (let cls of classes) {
                if (cls) newArgs.push(`'${cls}'`);
            }
        } else if (part.startsWith('"') && part.endsWith('"') && part.includes(' ')) {
             const inner = part.slice(1, -1);
             const classes = inner.split(/\s+/);
             for (let cls of classes) {
                 if (cls) newArgs.push(`"${cls}"`);
             }
        } else {
            newArgs.push(part);
        }
    }
    return `classList.${op}(${newArgs.join(', ')})`;
});

fs.writeFileSync('index.tsx', content);
console.log('Fixed classList');
