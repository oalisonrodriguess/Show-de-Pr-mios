const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const regex = /(<!-- NÚMERO ANUNCIADO -->[\s\S]*?)(<!-- 2\. LEILÃO \(MOVIDO PARA O PAINEL CENTRAL\) -->)/;
html = html.replace(regex, (match, content, leilao) => {
    // The content contains the NÚMERO ANUNCIADO div, SORTEIO DE BRINDES div, and the closing </div> of middle-row-section.
    // Let's strip the last </div> before LEILÃO.
    
    // Split into lines to remove the last </div>
    const lines = content.split('\\n');
    let popped = lines.pop(); // Empty string or similar after last \n
    let lastDivIdx = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].includes('</div>')) {
            lastDivIdx = i;
            break;
        }
    }
    
    if (lastDivIdx !== -1) {
        lines.splice(lastDivIdx, 1); // remove the closing </div> of middle-row-section
    }
    
    let newContent = lines.join('\\n');
    
    // Replace col-span values to fit inside the new 4-column grid
    newContent = newContent.replace('class="lg:col-span-3 bg-gray-800', 'class="lg:col-span-3 bg-gray-800');
    // Actually, draw-and-prize-section is lg:col-span-4. Inside it, let's use a 4-col grid.
    newContent = newContent.replace('class="lg:col-span-3 bg-gray-800', 'class="lg:col-span-4 xl:col-span-3 bg-gray-800');
    
    // Change id="prize-draw-section" lg:col-span-1 to xl:col-span-1 lg:col-span-4
    newContent = newContent.replace('id="prize-draw-section" class="lg:col-span-1', 'id="prize-draw-section" class="lg:col-span-4 xl:col-span-1');

    return `<div id="draw-and-prize-section" class="lg:col-span-4 grid grid-cols-1 xl:grid-cols-4 gap-6 relative">\n${newContent}\n</div>\n</div>\n                 ${leilao}`;
});

fs.writeFileSync('index.html', html);
console.log('Nested HTML fixed');
