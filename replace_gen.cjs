const fs = require('fs');
let content = fs.readFileSync('index.tsx', 'utf8');

// Replace cardGenerator modal
const modalRegex = /cardGenerator:\s*`<div class="modal-content[^`]+<\/div>`/;
const newModal = `cardGenerator: \`<div class="modal-content bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-5xl w-full text-left flex flex-col h-[90vh]">
                                   <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex-shrink-0">Gerador de Cartelas</h2>
                                   <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 flex-shrink-0">
                                       <input type="text" id="card-batch-title" placeholder="Título (Ex: Bingo de Natal)" class="md:col-span-2 w-full text-base font-bold p-3 border-2 border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                                       <input type="number" id="card-quantity" placeholder="Quantidade" value="100" class="w-full text-center text-base font-bold p-3 border-2 border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                                       <select id="card-per-page" class="w-full text-base font-bold p-3 border-2 border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                                          <option value="1">1 por Folha</option>
                                          <option value="2">2 por Folha</option>
                                          <option value="4">4 por Folha</option>
                                          <option value="6" selected>6 por Folha</option>
                                       </select>
                                   </div>
                                   <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 flex-shrink-0">
                                       <textarea id="card-prizes-text" placeholder="Prêmios / Rodadas (Opcional, aparece à esquerda)" class="w-full text-sm p-3 border-2 border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-sky-500"></textarea>
                                       <textarea id="card-menu-text" placeholder="Cardápio (Opcional, aparece à direita)" class="w-full text-sm p-3 border-2 border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-sky-500"></textarea>
                                   </div>
                                   <div class="flex items-center gap-2 mb-4 flex-shrink-0">
                                       <input type="checkbox" id="card-use-logo" class="w-5 h-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500">
                                       <label for="card-use-logo" class="text-sm font-bold text-gray-800 dark:text-slate-200">Usar logomarca no espaço central da cartela (em vez de ★)</label>
                                   </div>
                                   <div class="flex justify-end gap-4 mb-4 flex-shrink-0">
                                        <button id="generate-cards-btn" class="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-full">Gerar e Visualizar</button>
                                        <button id="print-cards-btn" class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded-full hidden">Imprimir Cartelas</button>
                                   </div>
                                   <div id="card-print-preview" class="flex-grow bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-y-auto flex items-center justify-center">
                                        <p class="text-slate-400 text-center">Defina as opções, clique em "Gerar e Visualizar" para criar as cartelas.</p>
                                   </div>
                                   <button id="close-card-generator-btn" class="mt-4 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-full text-lg flex-shrink-0 self-center">\${appLabels.modalCloseButton}</button>
                               </div>\``;

content = content.replace(modalRegex, newModal);
fs.writeFileSync('index.tsx', content);
console.log('replaced modal');
