const fs = require('fs');
let tsx = fs.readFileSync('index.tsx', 'utf8');

const regex = /document\.addEventListener\('fullscreenchange', \(\) => \{[\s\S]*?\}\);/;

const newCode = `document.addEventListener('fullscreenchange', () => {
                const section = document.getElementById('board-section');
                const fsControls = document.getElementById('fullscreen-controls');
                if (section) {
                    const htmlElement = document.documentElement;
                    if (document.fullscreenElement === section) {
                        section.classList.remove('rounded-2xl', 'shadow-xl');
                        section.classList.add('overflow-y-auto');
                        // Move modals to inside section
                        ['floating-number-modal', 'custom-alert-modal', 'congrats-modal', 'winner-modal', 'sponsor-display-modal'].forEach(id => {
                             const el = document.getElementById(id);
                             if (el) section.appendChild(el);
                        });
                        if (fsControls) fsControls.classList.remove('hidden');
                        if (fsControls) fsControls.classList.add('flex');
                        
                        // Sync slider
                        const fsZoomSlider = document.getElementById('fs-board-zoom-slider') as HTMLInputElement;
                        if (fsZoomSlider) fsZoomSlider.value = appStore.state.appConfig.boardScale.toString();
                        const fsZoomValue = document.getElementById('fs-board-zoom-value');
                        if (fsZoomValue) fsZoomValue.textContent = appStore.state.appConfig.boardScale.toString();

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
                        if (fsControls) fsControls.classList.add('hidden');
                        if (fsControls) fsControls.classList.remove('flex');
                    }
                }
            });
            
            // FS controls events
            const fsZoomSlider = document.getElementById('fs-board-zoom-slider');
            if (fsZoomSlider) {
                fsZoomSlider.addEventListener('input', (e) => {
                    const scale = parseInt((e.target as HTMLInputElement).value);
                    appStore.state.appConfig.boardScale = scale;
                    applyBoardZoom(scale);
                    const fsBoardZoomValue = document.getElementById('fs-board-zoom-value');
                    if (fsBoardZoomValue) fsBoardZoomValue.textContent = \`\${scale}%\`;
                    const boardZoomSlider = document.getElementById('board-zoom-slider') as HTMLInputElement;
                    if (boardZoomSlider) boardZoomSlider.value = scale.toString();
                    const boardZoomValue = document.getElementById('board-zoom-value');
                    if (boardZoomValue) boardZoomValue.textContent = \`\${scale}%\`;
                });
                fsZoomSlider.addEventListener('change', () => appStore.debouncedSave());
            }

            const fsNextBtn = document.getElementById('fs-next-round-btn');
            if (fsNextBtn) {
                fsNextBtn.addEventListener('click', () => {
                    // find next incomplete round
                    const games = appStore.state.gamesData;
                    const keys = Object.keys(games).filter(k => parseInt(k) > 0).sort((a,b)=>parseInt(a)-parseInt(b));
                    let nextKey = null;
                    let currentKeyIdx = appStore.state.activeGameNumber ? keys.indexOf(appStore.state.activeGameNumber) : -1;
                    for (let i = currentKeyIdx + 1; i < keys.length; i++) {
                        if (!games[keys[i]].isComplete) {
                            nextKey = keys[i];
                            break;
                        }
                    }
                    if (!nextKey) {
                        for (let i = 0; i <= currentKeyIdx; i++) {
                            if (!games[keys[i]].isComplete) {
                                nextKey = keys[i];
                                break;
                            }
                        }
                    }
                    if (nextKey) {
                        handleGameSelect(nextKey);
                    } else {
                        showAlert('Todas as rodadas foram concluídas!');
                    }
                });
            }

            const fsAutoDrawBtn = document.getElementById('fs-auto-draw-btn');
            if (fsAutoDrawBtn) {
                fsAutoDrawBtn.addEventListener('click', handleAutoDraw);
            }
`;

tsx = tsx.replace(regex, newCode);

fs.writeFileSync('index.tsx', tsx);
console.log('index.tsx updated');
