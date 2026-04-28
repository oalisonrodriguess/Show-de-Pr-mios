const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const replacement = `
                    <div id="draw-and-prize-section" class="lg:col-span-4 grid grid-cols-1 xl:grid-cols-4 gap-6 relative">
                        <!-- NÚMERO ANUNCIADO -->
                        <div class="lg:col-span-4 xl:col-span-3 bg-gray-800 rounded-2xl shadow-2xl p-6 flex flex-col justify-center items-center h-full relative">
                            <p id="main-display-label" class="text-xl sm:text-2xl font-bold text-slate-400 tracking-wider uppercase" data-label-key="announcedNumberLabel">Número Anunciado</p>
                            <!-- Wrapper do Zoom para o Número Anunciado -->
                            <div id="current-number-wrapper" class="my-4 flex justify-center items-center w-full relative">
                                 <!-- Container para o número do bingo e para o número do brinde -->
                                <div id="current-number" class="font-black flex justify-center items-center gap-x-2 sm:gap-x-4 rounded-full w-64 h-64 sm:w-80 sm:h-80" style="font-size: clamp(6rem, 25vw, 15rem); line-height: 1; visibility: hidden;"></div>
                                 <!-- Container separado para o sorteio de brinde, para não interferir com o do bingo -->
                                <div id="prize-draw-display-container" class="absolute inset-0 flex items-center justify-center hidden"></div>
                            </div>
                            <div class="mt-4 text-center">
                                <h3 class="text-xl font-bold text-slate-300 mb-3" data-label-key="lastNumbersLabel">Últimos 5 Números</h3>
                                <div id="last-numbers-display" class="flex flex-wrap justify-center gap-4"></div>
                            </div>
                        </div>
                        
                        <!-- SORTEIO DE BRINDES -->
                        <div id="prize-draw-section" class="lg:col-span-4 xl:col-span-1 bg-gray-800 rounded-2xl p-4 w-full mx-auto flex flex-col">
                            <div class="flex items-center justify-between mb-3 relative">
                                <h2 class="text-lg font-bold text-center text-slate-300 w-full" data-label-key="prizeDrawTitle">Sorteio de Brindes</h2>
                                <button id="fullscreen-prize-btn" class="absolute right-0 p-1 bg-gray-700 hover:bg-gray-600 rounded text-slate-300 transition-colors" title="Tela Cheia">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                </button>
                            </div>
                            <form id="prize-draw-form" class="flex flex-col gap-2 flex-grow">
                                <button type="button" id="check-drawn-prizes-btn" class="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-lg text-xs shadow-lg mb-1" data-label-key="checkDrawnPrizesButton">Conferir Sorteados</button>
                                <div class="flex flex-col gap-1">
                                    <label for="prize-draw-min" class="text-xs text-slate-400" data-label-key="prizeDrawFromLabel">De:</label>
                                    <input type="number" id="prize-draw-min" value="1" class="w-full text-center text-base font-bold p-2 border-2 border-gray-600 bg-gray-700 rounded-lg">
                                    <label for="prize-draw-max" class="text-xs text-slate-400 mt-1" data-label-key="prizeDrawToLabel">Até:</label>
                                    <input type="number" id="prize-draw-max" value="500" class="w-full text-center text-base font-bold p-2 border-2 border-gray-600 bg-gray-700 rounded-lg">
                                </div>
                                <div class="flex items-center justify-center gap-2 text-xs text-slate-300">
                                    <input type="checkbox" id="no-repeat-prize-draw" class="h-3 w-3 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                                    <label for="no-repeat-prize-draw" data-label-key="noRepeatCheckboxLabel">Não repetir sorteados</label>
                                </div>
                                <button type="button" id="prize-draw-random-btn" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold p-3 rounded-lg text-lg shadow-lg mt-1" data-label-key="prizeDrawRandomButton">Sortear</button>
                                <input type="text" id="prize-draw-number-manual" data-label-key="prizeDrawTicketNumberPlaceholder" placeholder="Nº Cartela" class="text-center text-base font-bold p-2 border-2 border-gray-600 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 mt-2">
                                <input type="text" id="prize-draw-name" data-label-key="prizeDrawNamePlaceholder" placeholder="Nome (Opcional)" class="text-center text-base font-bold p-2 border-2 border-gray-600 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                                <input type="text" id="prize-draw-description" data-label-key="prizeDrawDescriptionPlaceholder" placeholder="Brinde (Opcional)" class="text-center text-base font-bold p-2 border-2 border-gray-600 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                                <button type="submit" class="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-xl text-sm shadow-lg mt-1" data-label-key="registerPrizeButton">Registrar Brinde</button>
                            </form>
                        </div>
                    </div>
                </div>
`;

html = html.replace(/<div id="draw-and-prize-section" class="lg:col-span-4 grid grid-cols-1 xl:grid-cols-4 gap-6 relative">[\s\S]*?<\/div>\n<\/div>\n/, replacement);

fs.writeFileSync('index.html', html);
console.log('Restored');
