const fs = require('fs');

function replaceClasses(content) {
    let newContent = content;

    const replacements = {
        'bg-gray-900': 'bg-gray-50 dark:bg-gray-900',
        'bg-gray-800': 'bg-white dark:bg-gray-800',
        'bg-gray-700': 'bg-gray-200 dark:bg-gray-700',
        'bg-gray-600': 'bg-gray-300 dark:bg-gray-600',
        'text-white': 'text-gray-900 dark:text-white',
        'text-slate-200': 'text-gray-800 dark:text-slate-200',
        'text-slate-300': 'text-gray-700 dark:text-slate-300',
        'text-slate-400': 'text-gray-600 dark:text-slate-400',
        'border-gray-600': 'border-gray-300 dark:border-gray-600',
        'border-gray-700': 'border-gray-200 dark:border-gray-700'
    };

    for (const [key, value] of Object.entries(replacements)) {
        // Replace exact class matches, avoiding nested ones like bg-gray-900/50 etc if we aren't careful, 
        // but simple string replace might be enough if we just use a regex
        const regex = new RegExp(`\\b${key}\\b(?!/|\\w)`, 'g');
        newContent = newContent.replace(regex, value);
    }

    return newContent;
}

const htmlContent = fs.readFileSync('index.html', 'utf8');
fs.writeFileSync('index.html', replaceClasses(htmlContent));

const tsxContent = fs.readFileSync('index.tsx', 'utf8');
fs.writeFileSync('index.tsx', replaceClasses(tsxContent));

console.log("Refactored classes!");