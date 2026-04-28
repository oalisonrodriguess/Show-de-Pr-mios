const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Insert the fullscreen-controls inside #board-section
const boardSectionRegex = /(<section id="board-section"[^>]*>[\s\S]*?<div id="bingo-board-wrapper"[^>]*>[\s\S]*?<\/div>)/;

const fullscreenControlsHTML = `
                    <div id="fullscreen-controls" class="hidden flex-row gap-4 justify-between items-center mt-4 bg-gray-700 p-4 rounded-lg">
                        <div class="flex-1">
                            <label for="fs-board-zoom-slider" class="block text-xs font-bold text-slate-400 mb-1">Zoom do Painel (<span id="fs-board-zoom-value">100</span>%)</label>
                            <input type="range" id="fs-board-zoom-slider" min="50" max="150" value="100" class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer">
                        </div>
                        <div class="flex gap-2">
                             <button id="fs-next-round-btn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-sm shadow-lg transition-transform transform hover:scale-105">Próxima Rodada</button>
                             <button id="fs-auto-draw-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl text-sm shadow-lg transition-transform transform hover:scale-105" data-label-key="autoDrawButton">Sorteio Automático</button>
                        </div>
                    </div>
`;

html = html.replace(boardSectionRegex, `$1${fullscreenControlsHTML}`);

fs.writeFileSync('index.html', html);

console.log('index.html updated');
