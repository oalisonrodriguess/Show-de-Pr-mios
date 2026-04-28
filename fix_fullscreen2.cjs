const fs = require('fs');

let tsx = fs.readFileSync('index.tsx', 'utf8');

// 1. Version Bump
tsx = tsx.replace(
    /const currentVersion = "7\.0"; \/\/ Foco 100% Local/,
    'const currentVersion = "7.1"; // Foco 100% Local'
);

// 2. Add handlers for fullscreen
const newListeners = `
            const fullScreenAuctionBtn = document.getElementById('fullscreen-auction-btn');
            if (fullScreenAuctionBtn) {
                fullScreenAuctionBtn.addEventListener('click', () => {
                    const section = document.getElementById('auction-section');
                    if (section) {
                        if (!document.fullscreenElement) {
                            section.requestFullscreen().catch(err => showAlert(\`Erro: \${err.message}\`));
                        } else {
                            document.exitFullscreen();
                        }
                    }
                });
            }

            const fullScreenPrizeBtn = document.getElementById('fullscreen-prize-btn');
            if (fullScreenPrizeBtn) {
                fullScreenPrizeBtn.addEventListener('click', () => {
                    const section = document.getElementById('prize-draw-section');
                    if (section) {
                        if (!document.fullscreenElement) {
                            section.requestFullscreen().catch(err => showAlert(\`Erro: \${err.message}\`));
                        } else {
                            document.exitFullscreen();
                        }
                    }
                });
            }
`;

tsx = tsx.replace(
    /const fullScreenBoardBtn = document\.getElementById\('fullscreen-board-btn'\);/,
    newListeners + '\n            const fullScreenBoardBtn = document.getElementById(\'fullscreen-board-btn\');'
);

const oldFullscreenChange = /document\.addEventListener\('fullscreenchange', \(\) => \{[\s\S]*?if \(fsControls\) fsControls\.classList\.remove\('flex'\);\n                    }\n                }\n            \}\);/;

const newFullscreenChange = `
            document.addEventListener('fullscreenchange', () => {
                const fsControls = document.getElementById('fullscreen-controls');
                const htmlElement = document.documentElement;
                const isDark = htmlElement.classList.contains('dark');
                
                ['board-section', 'auction-section', 'prize-draw-section'].forEach(id => {
                    const section = document.getElementById(id);
                    if (!section) return;

                    if (document.fullscreenElement === section) {
                        section.classList.remove('rounded-2xl', 'shadow-xl');
                        section.classList.add('overflow-y-auto');
                        
                        ['floating-number-modal', 'custom-alert-modal', 'congrats-modal', 'winner-modal', 'sponsor-display-modal', 'verification-modal', 'event-break-modal'].forEach(modalId => {
                             const el = document.getElementById(modalId);
                             if (el) section.appendChild(el);
                        });

                        if (id === 'board-section') {
                            if (fsControls) fsControls.classList.remove('hidden');
                            if (fsControls) fsControls.classList.add('flex');
                            
                            const fsZoomSlider = document.getElementById('fs-board-zoom-slider') as HTMLInputElement;
                            if (fsZoomSlider) fsZoomSlider.value = appStore.state.appConfig.boardScale.toString();
                            const fsZoomValue = document.getElementById('fs-board-zoom-value');
                            if (fsZoomValue) fsZoomValue.textContent = appStore.state.appConfig.boardScale.toString();
                        }

                        if (isDark) {
                             section.classList.add('bg-gray-800');
                             section.classList.remove('bg-white');
                        } else {
                             section.classList.remove('bg-gray-800');
                             section.classList.add('bg-white');
                        }
                    } else if (!document.fullscreenElement) {
                        section.classList.add('rounded-2xl', 'shadow-xl');
                        section.classList.remove('overflow-y-auto');
                        if (id === 'board-section') {
                            if (fsControls) fsControls.classList.add('hidden');
                            if (fsControls) fsControls.classList.remove('flex');
                        }
                        
                        if (!document.fullscreenElement) {
                            ['floating-number-modal', 'custom-alert-modal', 'congrats-modal', 'winner-modal', 'sponsor-display-modal', 'verification-modal', 'event-break-modal'].forEach(modalId => {
                                const el = document.getElementById(modalId);
                                if (el) document.body.appendChild(el);
                            });
                        }
                    }
                });
            });
`;

tsx = tsx.replace(oldFullscreenChange, newFullscreenChange.trim());

fs.writeFileSync('index.tsx', tsx);
console.log('Fixed TSX in fix_fullscreen2.cjs');
