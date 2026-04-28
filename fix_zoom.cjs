const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/<section class="p-4 bg-gray-800 rounded-2xl shadow-xl">[\s\S]*?<h2 class="text-xl font-bold mb-4 text-center text-slate-300" data-label-key="bingoBoardTitle">Painel de Números<\/h2>/, 
`<section id="board-section" class="p-4 bg-gray-800 rounded-2xl shadow-xl">
                    <div class="flex items-center justify-between mb-4 relative">
                        <h2 class="text-xl font-bold text-center text-slate-300 w-full" data-label-key="bingoBoardTitle">Painel de Números</h2>
                        <button id="fullscreen-board-btn" class="absolute right-0 p-2 bg-gray-700 hover:bg-gray-600 rounded text-slate-300 transition-colors" title="Tela Cheia">
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                             </svg>
                        </button>
                    </div>`);

fs.writeFileSync('index.html', html);

let tsx = fs.readFileSync('index.tsx', 'utf8');

// Replace applyBoardZoom
tsx = tsx.replace(/function applyBoardZoom\(scale: number\) \{[\s\S]*?\}\n/, 
`function applyBoardZoom(scale: number) {
    const wrapper = DOMElements.bingoBoardWrapper;
    const zoomValueEl = document.getElementById('board-zoom-value');
    if (wrapper) {
        // Use CSS zoom (cleanest approach that updates layout properly in Chromium)
        wrapper.style.zoom = \`\${scale}%\`;
    }
    if (zoomValueEl) {
        zoomValueEl.textContent = \`\${scale}%\`;
    }
}
`);

// Add fullscreen event listener logic inside main load loop
// Find the place where board-zoom-slider event is attached to attach fullscreen there
tsx = tsx.replace(/(boardZoomSlider\.addEventListener\('change', \(\) => appStore\.debouncedSave\(\)\);)/, 
`$1
            const fullScreenBoardBtn = document.getElementById('fullscreen-board-btn');
            if (fullScreenBoardBtn) {
                fullScreenBoardBtn.addEventListener('click', () => {
                    const section = document.getElementById('board-section');
                    if (section) {
                        if (!document.fullscreenElement) {
                            section.requestFullscreen().catch(err => {
                                showAlert(\`Erro ao entrar em tela cheia: \${err.message}\`);
                            });
                        } else {
                            document.exitFullscreen();
                        }
                    }
                });
            }
            
            // Listen to fullscreen changes to style the section properly
            document.addEventListener('fullscreenchange', () => {
                const section = document.getElementById('board-section');
                if (section) {
                    const htmlElement = document.documentElement;
                    if (document.fullscreenElement === section) {
                        section.classList.remove('rounded-2xl', 'shadow-xl');
                        section.classList.add('overflow-y-auto');
                        if (htmlElement.classList.contains('dark')) {
                             section.classList.add('bg-gray-800');
                             section.classList.remove('bg-white');
                        } else {
                             section.classList.remove('bg-gray-800');
                             section.classList.add('bg-white');
                        }
                    } else {
                        section.classList.add('rounded-2xl', 'shadow-xl');
                        section.classList.remove('overflow-y-auto');
                    }
                }
            });
`);

fs.writeFileSync('index.tsx', tsx);
console.log('Fixed zoom and added fullscreen');
