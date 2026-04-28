const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove Como Usar
html = html.replace(/<!-- 1\. COMO USAR\? \(TOPO ESQUERDO, AGORA PADRONIZADO\) -->[\s\S]*?<\/div>/, '');

// 2. Add Fullscreen to Sorteio de Brindes
html = html.replace(
    /<h2 class="text-lg font-bold text-slate-300 mb-3 text-center" data-label-key="prizeDrawTitle">Sorteio de Brindes<\/h2>/,
    `<div class="flex items-center justify-between mb-3 relative">
         <h2 class="text-lg font-bold text-center text-slate-300 w-full" data-label-key="prizeDrawTitle">Sorteio de Brindes</h2>
         <button id="fullscreen-prize-btn" class="absolute right-0 p-1 bg-gray-700 hover:bg-gray-600 rounded text-slate-300 transition-colors" title="Tela Cheia">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
             </svg>
         </button>
     </div>`
);

// 3. Add Fullscreen to Leilão
html = html.replace(
    /<section class="bg-gray-800 p-6 rounded-2xl shadow-xl">/,
    `<section id="auction-section" class="bg-gray-800 p-6 rounded-2xl shadow-xl relative flex flex-col justify-center">`
);
html = html.replace(
    /<h2 class="text-2xl font-bold text-slate-300 mb-4 text-center" data-label-key="auctionTitle">Leilão<\/h2>/,
    `<div class="flex items-center justify-between mb-4 relative">
         <h2 class="text-2xl font-bold text-center text-slate-300 w-full" data-label-key="auctionTitle">Leilão</h2>
         <button id="fullscreen-auction-btn" class="absolute right-0 p-2 bg-gray-700 hover:bg-gray-600 rounded text-slate-300 transition-colors" title="Tela Cheia">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
             </svg>
         </button>
     </div>`
);

fs.writeFileSync('index.html', html);
console.log('Fixed HTML');
