const fs = require('fs');

let content = fs.readFileSync('index.tsx', 'utf8');

const regexPreview = /let pendingPrintCardQuantity = 0;[\s\S]*?async function renderCardsForPreview\(title: string, quantity: number\) \{[\s\S]*?printBtn\.classList\.remove\('hidden'\);\n        \}/;

const newPreview = `let pendingPrintCardQuantity = 0;
        let pendingPrintCardTitle = "";
        let pendingPrintCardPerPage = 6;
        let pendingPrintPrizes = "";
        let pendingPrintMenu = "";
        let pendingPrintUseLogo = false;

        async function renderCardsForPreview(title: string, quantity: number) {
            pendingPrintCardQuantity = quantity;
            pendingPrintCardTitle = title;
            pendingPrintCardPerPage = parseInt((document.getElementById('card-per-page') as HTMLSelectElement).value) || 6;
            pendingPrintPrizes = (document.getElementById('card-prizes-text') as HTMLTextAreaElement).value.trim();
            pendingPrintMenu = (document.getElementById('card-menu-text') as HTMLTextAreaElement).value.trim();
            pendingPrintUseLogo = (document.getElementById('card-use-logo') as HTMLInputElement).checked;

            const previewContainer = document.getElementById('card-print-preview');
            const printBtn = document.getElementById('print-cards-btn');
            if (!previewContainer || !printBtn) return;

            previewContainer.innerHTML = '<p class="text-slate-400 text-center w-full col-span-full">Renderizando visualização...</p>'; 
            previewContainer.className = 'flex-grow bg-white rounded-lg p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';

            const newCardUUIDs = Object.keys(appStore.state.cardsData).slice(-quantity);
            const previewUUIDs = newCardUUIDs.slice(0, 15);
            let finalHTML = "";
            const logoData = appStore.state.appConfig.customLogo || '';

            for (const uuid of previewUUIDs) {
                const cardData = appStore.state.cardsData[uuid];
                if (!cardData) continue;
                
                let qrDataUrl = "";
                try {
                    qrDataUrl = await QRCode.toDataURL(uuid, { width: 80, margin: 1 });
                } catch (err) {}

                // In preview, we don't render the huge full layout, just a simplified card (but with bigger squares)
                finalHTML += \`
                    <div class="bingo-card-print p-4 border border-gray-300 rounded-lg text-black bg-white flex flex-col items-center shadow-md pb-2" style="page-break-inside: avoid;">
                        <h3 class="text-lg font-bold text-center leading-tight mb-1">\${title}</h3>
                        <p class="text-xs mb-2">Cartela N°: \${String(cardData.series).padStart(4, '0')}</p>
                        <div class="grid grid-cols-5 gap-0.5 w-full my-1">
                            \${['B', 'I', 'N', 'G', 'O'].map((letter, colIndex) => \`
                                <div class="text-center">
                                    <div class="font-black text-xl text-red-600 mb-1">\${letter}</div>
                                    \${cardData.numbers[colIndex].map(num => {
                                        if (num === 0) {
                                            if (pendingPrintUseLogo && logoData) {
                                                return \`<div class="w-10 h-10 flex items-center justify-center border border-gray-400"><img src="\${logoData}" class="max-w-full max-h-full object-contain p-0.5"></div>\`;
                                            }
                                            return \`<div class="w-10 h-10 flex items-center justify-center border border-gray-400 font-bold text-lg bg-gray-300">★</div>\`;
                                        }
                                        return \`<div class="w-10 h-10 flex items-center justify-center border border-gray-400 font-bold text-xl">\${num}</div>\`;
                                    }).join('')}
                                </div>
                            \`).join('')}
                        </div>
                        <img src="\${qrDataUrl}" alt="QR Code" class="mt-2 w-16 h-16">
                    </div>
                \`;
            }

            if (quantity > 15) {
                finalHTML += \`<div class="p-4 border border-transparent flex items-center justify-center text-gray-500 font-bold col-span-full">... e mais \${quantity - 15} cartelas prontas para impressão.</div>\`;
            }
            
            previewContainer.innerHTML = finalHTML;
            printBtn.classList.remove('hidden');
        }`;

content = content.replace(regexPreview, newPreview);

const regexPrint = /function handlePrintCards\(\) \{[\s\S]*?printWindow\.document\.close\(\);\n        \}/;

const newPrint = `async function handlePrintCards() {
            const quantity = pendingPrintCardQuantity;
            const title = pendingPrintCardTitle;
            const perPage = pendingPrintCardPerPage;
            const prizesText = pendingPrintPrizes;
            const menuText = pendingPrintMenu;
            const useLogo = pendingPrintUseLogo;
            const logoData = appStore.state.appConfig.customLogo || '';

            if (quantity === 0) return;

            showAlert("Preparando PDF para " + quantity + " cartelas. Isso pode levar alguns segundos...");

            const allNewUUIDs = Object.keys(appStore.state.cardsData).slice(-quantity);
            let printHTML = "";

            /* 
               Grid logic:
               Using Tailwind:
               1 per page => grid-cols-1
               2 per page => grid-cols-1 (stack vertically) or grid-cols-2
               4 per page => grid-cols-2
               6 per page => grid-cols-2
            */
            const colsClass = (perPage === 1 || perPage === 2) ? 'grid-cols-1' : 'grid-cols-2';
            
            // To ensure 6 per page works nicely on A4 portrait, we make the cards relatively small.
            // If they have winged menus/prizes, it gets tighter.

            for (let i = 0; i < allNewUUIDs.length; i += 50) {
                const batch = allNewUUIDs.slice(i, i + 50);
                const batchPromises = batch.map(async (uuid) => {
                    const cardData = appStore.state.cardsData[uuid];
                    if (!cardData) return "";
                    let qrDataUrl = await QRCode.toDataURL(uuid, { width: 80, margin: 1 }).catch(()=>"");

                    // Generate the wings
                    const prizesHtml = prizesText ? \`
                    <div class="w-1/4 border-r border-black p-2 text-[10px] sm:text-xs text-center flex flex-col justify-center bg-gray-50 uppercase font-bold break-all">
                        <div class="mb-2 text-sm text-sky-800">Prêmios/Rodadas</div>
                        <pre class="whitespace-pre-wrap font-sans text-left leading-tight">\${prizesText.replace(/</g,'&lt;')}</pre>
                    </div>\` : '';

                    const menuHtml = menuText ? \`
                    <div class="w-1/4 border-l border-black p-2 text-[10px] sm:text-xs text-center flex flex-col justify-center bg-gray-50 uppercase font-bold break-all relative">
                        <div class="mb-2 text-sm text-sky-800">Cardápio</div>
                        <pre class="whitespace-pre-wrap font-sans text-left leading-tight">\${menuText.replace(/</g,'&lt;')}</pre>
                        <div class="absolute bottom-1 right-2 text-[8px] text-gray-500 font-normal">Identificação: \${String(cardData.series).padStart(4,'0')}</div>
                    </div>\` : '';

                    const centerWidth = (prizesText && menuText) ? 'w-1/2' : (prizesText || menuText) ? 'w-3/4' : 'w-full';

                    return \`
                        <div class="border-2 border-black flex flex-row items-stretch text-black bg-white shadow-sm break-inside-avoid print:break-inside-avoid" style="page-break-inside: avoid; margin-bottom: 2mm;">
                            \${prizesHtml}

                            <!-- CENTER: BINGO CARD -->
                            <div class="\${centerWidth} p-2 flex flex-col items-center justify-between">
                                <div class="flex flex-col items-center mb-1">
                                    <h3 class="text-base sm:text-xl font-bold text-center uppercase tracking-tight leading-none">\${title}</h3>
                                    <div class="text-[10px] sm:text-xs font-bold text-gray-600 mt-1">Cartela N° \${String(cardData.series).padStart(4, '0')}</div>
                                </div>
                                <div class="grid grid-cols-5 gap-0 w-full mb-1 border-2 border-black">
                                    \${['B', 'I', 'N', 'G', 'O'].map((letter, colIndex) => \`
                                        <div class="text-center flex flex-col">
                                            <div class="font-black text-lg sm:text-2xl text-white bg-black border-b border-r border-black">\${letter}</div>
                                            \${cardData.numbers[colIndex].map(num => {
                                                const borderClass = colIndex === 4 ? 'border-b border-black' : 'border-b border-r border-black';
                                                if (num === 0) {
                                                    if (useLogo && logoData) {
                                                        return \`<div class="aspect-square flex items-center justify-center \${borderClass}"><img src="\${logoData}" class="max-w-[80%] max-h-[80%] object-contain" /></div>\`;
                                                    }
                                                    return \`<div class="aspect-square flex items-center justify-center bg-gray-300 font-bold text-lg sm:text-xl \${borderClass}">★</div>\`;
                                                }
                                                return \`<div class="aspect-square flex items-center justify-center font-bold text-lg sm:text-2xl \${borderClass}">\${num}</div>\`;
                                            }).join('')}
                                        </div>
                                    \`).join('')}
                                </div>
                                <div class="flex flex-row justify-between w-full items-center px-2">
                                    <div class="text-[8px] text-gray-500 uppercase tracking-widest">\${uuid.split('-')[0]}</div>
                                    <img src="\${qrDataUrl}" alt="QR Code" class="w-12 h-12 object-contain">
                                </div>
                            </div>
                            
                            \${menuHtml}
                        </div>
                    \`;
                });

                const resolvedBatchHTML = await Promise.all(batchPromises);
                printHTML += resolvedBatchHTML.join("");
                if (allNewUUIDs.length > 200) await new Promise(res => setTimeout(res, 5));
            }

            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                showAlert('Não foi possível abrir a janela de impressão. Verifique se o seu navegador está bloqueando pop-ups.');
                return;
            }
            
            // To force page break natively, we inject perPage wrappers
            let finalPagesHTML = '';
            // Just use Tailwind's screen columns unless they specify a strict limit
            // Actually CSS column grid takes care of standard splits
            
            let gridStyles = '';
            if (perPage === 1) gridStyles = 'grid-cols-1 gap-8 max-w-2xl mx-auto';
            if (perPage === 2) gridStyles = 'grid-cols-1 gap-4 max-w-2xl mx-auto my-4';
            if (perPage === 4) gridStyles = 'grid-cols-2 gap-2 max-w-5xl mx-auto my-4';
            if (perPage === 6) gridStyles = 'grid-cols-2 gap-x-2 gap-y-1 mx-auto my-1';

            printWindow.document.write(\`
                <html>
                    <head>
                        <title>\${title}</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                            /* Minimal margins for 6 per page */
                            @media print {
                                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
                                @page { size: A4 portrait; margin: \${perPage === 6 ? '5mm' : '10mm'}; }
                                .print\\\\:break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
                            }
                            body { font-family: 'Helvetica', 'Arial', sans-serif; background: white; margin: 0; padding: \${perPage===6?'5px':'20px'}; }
                        </style>
                    </head>
                    <body>
                        <div class="grid \${gridStyles}">
                            \${printHTML}
                        </div>
                        <script>
                            setTimeout(() => {
                                window.print();
                                window.close();
                            }, 500);
                        </script>
                    </body>
                </html>
            \`);
            printWindow.document.close();
        }`;

content = content.replace(regexPrint, newPrint);
fs.writeFileSync('index.tsx', content);
console.log('replaced print logic');
