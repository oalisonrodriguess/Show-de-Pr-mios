import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, doc, setDoc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

        // --- Variáveis de Estado ---
        let floatingNumberTimeout = null;
        let currentVersion = "6.0.0"; // Patrocinadores por número, Zoom refeito, Novos atalhos
        
        // Mapeamento de letras dinâmico
        let DYNAMIC_LETTERS = ['B', 'I', 'N', 'G', 'O'];
        let DYNAMIC_LETTERS_AJUDE = ['A', 'J', 'U', 'D', 'E'];

        const BINGO_CONFIG = { B: { min: 1, max: 15 }, I: { min: 16, max: 30 }, N: { min: 31, max: 45 }, G: { min: 46, max: 60 }, O: { min: 61, max: 75 },
                               A: { min: 1, max: 15 }, J: { min: 16, max: 30 }, U: { min: 31, max: 45 }, D: { min: 46, max: 60 }, E: { min: 61, max: 75 } };
        const LETTERS = Object.keys(BINGO_CONFIG);
        const roundColors = ['#16a34a', '#ca8a04', '#c2410c', '#0e7490', '#be185d', '#6d28d9', '#059669', '#b45309'];
        
        let gamesData: {[key: string]: any} = {}; 
        let activeGameNumber = null;
        let currentBingoType = ''; 
        let gameCount = 6;
        let menuItems = [ "Refrigerante - R$ 5,00", "Cerveja - R$ 7,00", "Água - R$ 3,00", "Espetinho - R$ 8,00", "Pastel - R$ 6,00", "Porção de Fritas - R$ 15,00" ];
        let menuInterval: any;
        const predefinedPrizes = [ { prize1: 'R$ 100,00', prize2: '', prize3: '' }, { prize1: 'R$ 100,00', prize2: 'R$ 200,00', prize3: '' }, { prize1: 'R$ 200,00', prize2: '', prize3: '' }, { prize1: 'R$ 100,00', prize2: 'R$ 300,00', prize3: '' }, { prize1: 'R$ 300,00', prize2: '', prize3: 'R$ 300,00' }, { prize1: 'R$ 200,00', prize2: 'R$ 2.000,00', prize3: '' } ];
        let confettiAnimationId: number;
        let spinTimeout: any;
        let cycloneInterval: any;
        let saveTimeout: any; // Debounce timer for saving state
        let drawnPrizeNumbers: number[] = [];
        let winnerDisplayTimeout: any; 
        const winnerDisplayDuration = 5000;
        let versionHistory = `**v6.0.0 (Atual)**
- **PATROCINADOR POR NÚMERO:** Nova funcionalidade permite associar um patrocinador (nome e imagem) a cada número do bingo. Ao sortear, um modal especial exibe o número e o patrocinador lado a lado.
- **REFORMULAÇÃO TOTAL DO ZOOM:** A lógica de zoom do Painel de Números e do modal de Verificação foi refeita para ajustar o tamanho dos números individualmente, eliminando quebras de layout e melhorando a visibilidade.
- **NOVOS ATALHOS DE TECLADO:** Adicionados atalhos para: Sortear Brinde (CTRL+B), Registrar Brinde (CTRL+S), Vender Leilão (CTRL+L) e Abrir Intervalo (CTRL+I).
- **DATA DE ATUALIZAÇÃO ESTÁTICA:** A data no rodapé agora reflete a data de desenvolvimento da versão, não a de carregamento da página.

**v5.9.1**
- **DIFERENCIAÇÃO VISUAL:** O botão "Encerrar Evento" foi alterado para a cor roxa, distinguindo-o claramente do botão vermelho "Reiniciar Evento" para evitar cliques acidentais.

**v5.9.0**
- **ATALHOS PERSONALIZÁVEIS:** A aba "Atalhos" nas configurações foi remodelada para permitir que o usuário defina suas próprias combinações de teclas para as ações principais (Sorteio, Verificar, Limpar).
- **LEGENDA DE ATALHOS NA TELA:** Adicionada uma legenda de "Atalhos Rápidos" na barra lateral esquerda. Ela é atualizada dinamicamente para refletir os atalhos personalizados pelo usuário.

**v5.8.0**
- **PERSISTÊNCIA DE ZOOM:** O nível de zoom aplicado no painel de "Verificando Números" agora é salvo. Ao reabrir o painel, ele manterá o último tamanho configurado.
- **HISTÓRICO DE VERSÕES APRIMORADO:** O histórico de versões agora exibe apenas as 10 últimas atualizações e não é mais editável, garantindo a integridade das informações.
- **LISTA DE ATALHOS:** Adicionada uma nova aba de "Atalhos" no menu "Personalizar", listando os comandos de teclado disponíveis para agilizar o uso.
- **AJUSTES VISUAIS:** O botão "Reiniciar Evento" agora é vermelho, para melhor indicar uma ação destrutiva.
- **LINK ACADÊMICO:** Adicionado o link para o Trabalho de Conclusão de Curso no rodapé.

**v5.7.0**
- **LAYOUT DO VERIFICADOR APRIMORADO:** Os números no painel de verificação agora são compostos por letra e número lado a lado, com espaçamento, garantindo que o layout se mantenha consistente mesmo com a aplicação de zoom.
- **DATA E HORA DINÂMICAS:** A data de "Última atualização" no rodapé agora reflete a data e hora exatas em que a aplicação foi carregada, em vez de um valor fixo.

**v5.6.0**
- **ATALHOS DE TECLADO:** Adicionados atalhos para agilizar a operação: Sorteio Automático (CTRL + ENTER), Verificar Números (CTRL + Espaço) e Limpar Rodada (CTRL + DELETE).
- **CONFERÊNCIA INTERATIVA MELHORADA:** No modal de "Verificando Números", a funcionalidade de clicar para marcar em verde foi mantida, e os números foram significativamente ampliados (mais largos e altos) para visibilidade máxima.
- **CORES DA RODADA EM DESTAQUE:** A cor personalizada de cada rodada agora é aplicada dinamicamente ao fundo do número anunciado e na animação de sorteio automático, criando uma identidade visual consistente.

**v5.5.0**
- **ZOOM NA VERIFICAÇÃO:** Adicionado um controle de zoom deslizante dentro do modal de "Verificando Números", permitindo ajustar o tamanho dos números sorteados em tempo real para melhor visualização.
- **NÚMEROS MAIORES E MAIS LARGOS:** O design dos números no modal de verificação foi aprimorado. Eles agora são maiores e mais largos, com uma fonte mais forte, melhorando drasticamente a legibilidade.
- **LAYOUT OTIMIZADO:** O modal de verificação foi reestruturado para garantir que a rolagem da lista de números funcione perfeitamente, mesmo com o zoom aplicado.

**v5.4.0**
- **VISIBILIDADE MÁXIMA:** Os números no modal de verificação e no painel do número anunciado foram significativamente ampliados para garantir a melhor legibilidade possível em projetores e telas grandes.
- **CONTROLES DE ZOOM APRIMORADOS:** A lógica dos controles de escala foi completamente refeita. O painel de números agora expande a partir do topo, evitando quebras de layout, e o zoom do número anunciado foi refinado para uma experiência mais suave e centralizada.

**v5.3.0**
- **PERSONALIZAÇÃO TOTAL DE TEXTOS:** Implementada a capacidade de editar todos os textos e rótulos do aplicativo através do menu "Personalizar", oferecendo controle total sobre a comunicação do evento.
- **CONFERÊNCIA DE NÚMEROS APRIMORADA:** O modal de verificação agora exibe números significativamente maiores. Além disso, os números são interativos: clique para marcá-los em verde, facilitando a conferência visual na cartela do jogador.

**v5.2.0**
- **CONFIRMAÇÃO PARA LIMPAR RODADA:** Adicionado um modal de confirmação com animação para a ação de "Limpar Rodada Atual", evitando cliques acidentais. Os textos do modal são personalizáveis.
- **LAYOUT OTIMIZADO:** O botão "Limpar Rodada Atual" foi movido para uma posição mais intuitiva abaixo do painel de números.
- **PAINEL DE NÚMEROS COM CORES DA RODADA:** O fundo dos números não sorteados no painel agora reflete sutilmente a cor da rodada ativa, melhorando a imersão visual.
- **CORES NO MODAL DE SORTEIO:** O modal de anúncio de número (ao clicar no painel) agora também utiliza a cor da rodada ativa.
- **MODAL DE VERIFICAÇÃO APRIMORADO:** O modal de verificação de números foi ampliado e os números internos foram redimensionados para que mais sorteados caibam na tela sem rolagem.`;

        // --- Configurações Globais da Aplicação (Persistidas no Firebase) ---
        let appConfig = {
            // FIXOS
            pixKey: '1e8e4af0-4d23-440c-9f3d-b4e527f65911',
            paypalLink: 'https://www.paypal.com/donate/?hosted_button_id=WJBLF3LV3RZRW',
            tutorialVideoLink: 'https://youtu.be/8iOOW-CR-WQ?si=Jolrp2qR38xhY5EZ', 
            // CONFIGURÁVEIS
            bingoTitle: 'BINGO',
            boardColor: 'default',
            boardScale: 100,
            displayScale: 100,
            verificationPanelZoom: 100,
            drawnTextColor: '#FFFFFF',
            drawnTextStrokeColor: '#000000',
            drawnTextStrokeWidth: 2,
            isEventClosed: false,
            customLogoBase64: '',
            enableSponsorsByNumber: false,
            sponsorsByNumber: {},
            shortcuts: {
                autoDraw: 'Control+Enter',
                verify: 'Control+Space',
                clearRound: 'Control+Delete',
                drawPrize: 'Control+B',
                registerPrize: 'Control+S',
                sellAuction: 'Control+L',
                showInterval: 'Control+I',
            }
        };

        // Objeto para todos os textos customizáveis (i18n)
        let appLabels = {
            mainTitle: "Show de Prêmios",
            howToUseTitle: "🎬 Como Usar?",
            howToUseButton: "Em Breve!",
            versionHistoryButton: "Histórico de Versões",
            customizeButton: "Personalizar",
            intervalButton: "Intervalo",
            generateProofButton: "Gerar Prova",
            endEventButton: "Encerrar Evento",
            resetEventButton: "Reiniciar Evento",
            winnersTitle: "Vencedores",
            bingoBoardTitle: "Painel de Números",
            activeRoundIndicatorDefault: "Selecione uma Rodada",
            activeRoundIndicatorLabel: "Rodada Ativa:",
            controlsPanelTitle: "Controles",
            boardScaleLabel: "Escala Painel Números",
            displayScaleLabel: "Escala Número Anunciado",
            manualAnnounceButton: "Anunciar Manual",
            autoDrawButton: "Sorteio Automático",
            verifyButton: "Verificar",
            clearRoundButton: "Limpar Rodada Atual",
            announcedNumberLabel: "Número Anunciado",
            lastNumbersLabel: "Últimos 5 Números",
            prizeDrawTitle: "Sorteio de Brindes",
            checkDrawnPrizesButton: "Conferir Sorteados",
            prizeDrawFromLabel: "De:",
            prizeDrawToLabel: "Até:",
            noRepeatCheckboxLabel: "Não repetir sorteados",
            prizeDrawRandomButton: "Sortear",
            prizeDrawTicketNumberPlaceholder: "Nº Cartela",
            prizeDrawNamePlaceholder: "Nome (Opcional)",
            prizeDrawDescriptionPlaceholder: "Brinde (Opcional)",
            registerPrizeButton: "Registrar Brinde",
            supportTitle: "Apoie o Seminarista 🤝",
            supportButton: "Faça sua Doação",
            roundsAndPrizesTitle: "Rodadas e Prêmios",
            addExtraRoundButton: "Adicionar Rodada Extra",
            subscribeTitle: "Inscreva-se no Canal",
            subscribeButton: "Inscrever-se no Canal",
            prize1Label: "Quina",
            prize2Label: "Cartela Cheia",
            prize3Label: "Azarão",
            intervalModalTitle: "Intervalo",
            intervalModalSubtitle: "Voltamos em breve!",
            verificationModalTitle: "Verificando Números",
            verificationModalBackButton: "Voltar ao App",
            auctionTitle: "Leilão",
            sellItemButton: "Vender Item",
            clearRoundConfirmTitle: "Confirmar Limpeza",
            clearRoundConfirmMessage: "Tem certeza que deseja limpar todos os números sorteados da rodada atual?",
            clearRoundConfirmButton: "Limpar",
            clearRoundCancelButton: "Cancelar",
            modalBackButton: "Voltar ao App",
            winnerModalNamePlaceholder: "Nome do Ganhador",
            winnerModalRegisterButton: "Registrar Ganhador",
            alertModalTitle: "Atenção",
            alertModalOkButton: "OK",
            congratsModalTitle: "Parabéns!",
            congratsModalPrizeLabel: "Ganhou:",
            congratsModalMessage: "Parabéns e muita sorte!",
            congratsModalCloseButton: "Fechar",
            menuEditModalTitle: "Editar Cardápio",
            menuEditModalDescription: "Digite cada item em uma nova linha.",
            modalCancelButton: "Cancelar",
            modalSaveButton: "Salvar",
            winnerEditModalTitle: "Editar Vencedor",
            winnerEditModalNamePlaceholder: "Nome do Ganhador",
            winnerEditModalPrizePlaceholder: "Prêmio",
            winnerEditModalRemoveButton: "Remover",
            deleteConfirmModalTitle: "Confirmar Exclusão",
            deleteConfirmModalDeleteButton: "Excluir",
            proofOptionsModalTitle: "Gerar Prova",
            proofOptionsModalDescription: "Selecione quais rodadas e brindes incluir no documento.",
            proofOptionsModalGenerateButton: "Gerar Prova",
            spinningWheelSkipButton: "Pular Animação",
            resetConfirmModalTitle: "Atenção!",
            resetConfirmModalMessage: "Tem certeza que deseja reiniciar todo o evento? Todos os dados de rodadas, prêmios e vencedores serão perdidos permanentemente.",
            resetConfirmModalConfirmButton: "Sim, Reiniciar",
            drawnPrizesModalTitle: "Cartelas de Brinde Já Sorteadas",
            modalCloseButton: "Fechar",
            donationModalTitle: "Apoio ao Projeto Seminarista",
            donationModalDescription: "Sua doação ajuda a manter este projeto ativo. Agradecemos imensamente!",
            donationModalPaypalLabel: "Doação via PayPal",
            donationModalPixLabel: "PIX (Chave Aleatória)",
            donationModalCopyButton: "Copiar Chave PIX",
            finalWinnersModalTitle: "Vencedores do Evento",
            finalWinnersModalProofButton: "Gerar Prova Final",
            finalWinnersModalSupportButton: "Apoie o Seminarista (PIX/PayPal)",
            changelogModalTitle: "Histórico de Versões",
            changelogModalCurrentVersionLabel: "Versão Atual:",
            settingsModalTitle: "Configurações de Personalização",
            settingsTabAppearance: "Aparência",
            settingsTabLabels: "Textos e Rótulos",
            settingsTabShortcuts: "Atalhos",
            settingsTabSponsors: "Patrocinadores",
            quickShortcutsTitle: "Atalhos Rápidos",
            shortcutsEditTitle: "Personalizar Atalhos",
            shortcutsEditDescription: "Clique em um campo e pressione a nova combinação de teclas. As alterações são salvas automaticamente.",
            shortcutLabelAutoDraw: "Sorteio Automático",
            shortcutLabelVerify: "Verificar Números",
            shortcutLabelClearRound: "Limpar Rodada",
            shortcutLabelDrawPrize: "Sortear Brinde",
            shortcutLabelRegisterPrize: "Registrar Brinde",
            shortcutLabelSellAuction: "Vender Leilão",
            shortcutLabelShowInterval: "Abrir Intervalo",
            settingsLogoTitle: "Logo do Evento",
            settingsLogoDescription: "Cole o código Base64 da sua imagem. A imagem será redimensionada para caber no espaço.",
            settingsLogoRemoveButton: "Remover Logo",
            settingsSponsorsByNumberTitle: "Patrocinadores por Número",
            settingsSponsorsByNumberEnable: "Habilitar exibição de patrocinador ao sortear número",
            settingsSponsorsByNumberDescription: "Cadastre um nome e uma imagem (Base64) para cada número. Eles aparecerão em um modal especial durante o sorteio.",
            settingsSponsorNumberLabel: "Nº",
            settingsSponsorNameLabel: "Nome do Patrocinador",
            settingsSponsorImageLabel: "Imagem (Base64)",
            settingsBingoTitleLabel: "Título do Grito de Vitória",
            settingsBingoTitleDescription: "Mude o 'BINGO!' para 'AJUDE!'.",
            settingsBoardColorLabel: "Cor de Fundo da Cartela",
            settingsBoardColorDescription: "Cor base dos números não sorteados.",
            settingsBoardColorResetButton: "Limpar Cor",
            settingsDrawnNumberTitle: "Aparência do Número Sorteado",
            settingsDrawnTextColorLabel: "Cor do Texto (Letra e Número)",
            settingsDrawnStrokeColorLabel: "Cor da Borda (Contorno)",
            settingsDrawnStrokeWidthLabel: "Largura da Borda",
            settingsTestDataButton: "Gerar Vencedores de Teste",
            settingsCloseSaveButton: "Fechar e Salvar"
        };


        // --- Firebase Vars ---
        let db, auth, userId, dbRef;
        let firebaseReady = false;

        // --- Seletores de Elementos ---
        const DOMElements = {
            mainTitle: document.getElementById('main-title'),
            connectionIndicator: document.getElementById('connection-indicator'),
            connectionStatusText: document.getElementById('connection-status-text'),
            version: document.getElementById('version'),
            lastUpdated: document.getElementById('last-updated'),
            clearRoundBtnTop: document.getElementById('clear-round-btn-top'),
            clearRoundBtnBottom: document.getElementById('clear-round-btn-bottom'),
            currentNumberEl: document.getElementById('current-number'),
            mainDisplayLabel: document.getElementById('main-display-label'),
            bingoBoardEl: document.getElementById('bingo-board'),
            bingoBoardWrapper: document.getElementById('bingo-board-wrapper'),
// FIX: Cast element to HTMLFormElement to access form-specific properties and methods.
            manualInputForm: document.getElementById('manual-input-form') as HTMLFormElement,
// FIX: Cast element to HTMLInputElement to access input-specific properties like 'value'.
            letterInput: document.getElementById('letter-input') as HTMLInputElement,
// FIX: Cast element to HTMLInputElement to access input-specific properties like 'value'.
            numberInput: document.getElementById('number-input') as HTMLInputElement,
            errorMessageEl: document.getElementById('error-message'),
            winnersContainer: document.getElementById('winners-container'),
            shareBtn: document.getElementById('share-btn'),
            endEventBtn: document.getElementById('end-event-btn'),
            resetEventBtn: document.getElementById('reset-event-btn'),
            intervalBtn: document.getElementById('interval-btn'),
            lastNumbersDisplay: document.getElementById('last-numbers-display'),
            gamesListEl: document.getElementById('games-list'),
            addExtraGameBtn: document.getElementById('add-extra-game-btn'),
// FIX: Cast element to HTMLFormElement to access form-specific properties and methods like 'requestSubmit'.
            prizeDrawForm: document.getElementById('prize-draw-form') as HTMLFormElement,
            checkDrawnPrizesBtn: document.getElementById('check-drawn-prizes-btn'),
// FIX: Cast element to HTMLInputElement to access input-specific properties like 'checked'.
            noRepeatPrizeDrawCheckbox: document.getElementById('no-repeat-prize-draw') as HTMLInputElement,
// FIX: Cast element to HTMLCanvasElement to access canvas-specific properties and methods like 'getContext'.
            confettiCanvas: document.getElementById('confetti-canvas') as HTMLCanvasElement,
            verificationModal: document.getElementById('verification-modal'),
            floatingNumberModal: document.getElementById('floating-number-modal'),
            sponsorDisplayModal: document.getElementById('sponsor-display-modal'),
            winnerModal: document.getElementById('winner-modal'),
            customAlertModal: document.getElementById('custom-alert-modal'),
            congratsModal: document.getElementById('congrats-modal'),
            eventBreakModal: document.getElementById('event-break-modal'),
            menuEditModal: document.getElementById('menu-edit-modal'),
            winnerEditModal: document.getElementById('winner-edit-modal'),
            deleteConfirmModal: document.getElementById('delete-confirm-modal'),
            clearRoundConfirmModal: document.getElementById('clear-round-confirm-modal'),
            proofOptionsModal: document.getElementById('proof-options-modal'),
            spinningWheelModal: document.getElementById('spinning-wheel-modal'),
            resetConfirmModal: document.getElementById('reset-confirm-modal'),
            drawnPrizesModal: document.getElementById('drawn-prizes-modal'),
            donationModal: document.getElementById('donation-modal'),
            showDonationModalBtn: document.getElementById('show-donation-modal-btn'),
            showChangelogBtn: document.getElementById('show-changelog-btn'),
            changelogModal: document.getElementById('changelog-modal'),
            showSettingsBtn: document.getElementById('show-settings-btn'),
            settingsModal: document.getElementById('settings-modal'),
            currentRoundDisplay: document.getElementById('current-round-display'), 
            currentNumberWrapper: document.getElementById('current-number-wrapper'),
// FIX: Cast element to HTMLFormElement to access form-specific properties and methods.
            auctionForm: document.getElementById('auction-form') as HTMLFormElement,
        };
        const confettiCtx = DOMElements.confettiCanvas.getContext('2d');

        // --- Funções de Template HTML ---
        function getModalTemplates() {
            return {
                verification: `<div id="verification-modal-content" class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-7xl w-full text-center flex flex-col h-[90vh]">
                                   <h2 class="text-3xl font-bold text-white mb-2 flex-shrink-0" data-label-key="verificationModalTitle">${appLabels.verificationModalTitle}</h2>
                                   <div class="my-4 max-w-sm mx-auto w-full flex-shrink-0">
                                       <label for="verification-zoom-slider" class="block text-sm font-bold text-slate-400 mb-1">Zoom dos Números</label>
                                       <input type="range" id="verification-zoom-slider" min="50" max="200" value="100" class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg">
                                   </div>
                                   <div class="flex-grow overflow-hidden -mx-4">
                                       <div id="verification-numbers-wrapper" class="h-full overflow-y-auto px-4">
                                           <div id="verification-numbers" class="flex flex-wrap gap-4 justify-center items-start content-start"></div>
                                       </div>
                                   </div>
                                   <div class="flex justify-center gap-4 flex-wrap mt-6 flex-shrink-0">
                                       <button id="confirm-prize1-btn" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full text-lg disabled:opacity-50 disabled:cursor-not-allowed">1: ${appLabels.prize1Label}</button>
                                       <button id="confirm-prize2-btn" class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg disabled:opacity-50 disabled:cursor-not-allowed">2: ${appLabels.prize2Label}</button>
                                       <button id="confirm-prize3-btn" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg disabled:opacity-50 disabled:cursor-not-allowed">3: ${appLabels.prize3Label}</button>
                                       <button id="reject-bingo-btn" class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg mt-2 sm:mt-0" data-label-key="verificationModalBackButton">${appLabels.verificationModalBackButton}</button>
                                   </div>
                               </div>`,
                floatingNumber: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center"><div id="floating-number-display" class="font-black text-white flex justify-center items-center gap-x-2 sm:gap-x-4 w-full h-96 mx-auto rounded-full shadow-inner my-4 animate-bounce-in" style="font-size: clamp(10rem, 30vw, 20rem); line-height: 1; text-shadow: 2px 2px 5px #000;"></div><button id="close-floating-btn" class="mt-8 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-full text-lg">${appLabels.modalBackButton}</button></div>`,
                sponsorDisplay: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl w-[95vw] h-[90vh] text-center grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                    <div id="sponsor-number-display" class="font-black text-white flex justify-center items-center gap-x-2 sm:gap-x-4 w-full h-full mx-auto rounded-full shadow-inner animate-bounce-in"></div>
                                    <div id="sponsor-info-display" class="flex flex-col items-center justify-center h-full animate-fade-in-up">
                                        <img id="sponsor-image" src="" class="max-w-full max-h-[70%] object-contain rounded-lg shadow-lg mb-6">
                                        <p id="sponsor-name" class="text-4xl md:text-5xl font-bold text-amber-400"></p>
                                    </div>
                                    <div class="lg:col-span-2">
                                        <button id="close-sponsor-display-btn" class="mt-4 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-full text-lg">${appLabels.modalBackButton}</button>
                                    </div>
                                </div>`,
                winner: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center"><h1 id="winner-title-display" class="text-7xl sm:text-8xl font-black text-amber-400" style="text-shadow: 0 0 20px #f59e0b;"></h1><div id="winner-prize-display" class="my-6"><p id="game-text-winner" class="text-2xl font-bold text-sky-400"></p><p id="prize-text-winner" class="text-3xl font-bold text-yellow-400 mt-1"></p></div><input type="text" id="winner-name-input" placeholder="${appLabels.winnerModalNamePlaceholder}" class="w-full text-center text-xl font-bold p-3 border-2 border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"><button id="register-winner-btn" class="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full text-lg">${appLabels.winnerModalRegisterButton}</button></div>`,
                alert: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center"><h2 class="text-2xl font-bold text-red-500 mb-4">${appLabels.alertModalTitle}</h2><p id="custom-alert-message" class="text-slate-300 text-lg"></p><button id="custom-alert-close-btn" class="mt-8 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-full text-lg">${appLabels.alertModalOkButton}</button></div>`,
                congrats: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-2xl w-full text-center"><h2 class="text-5xl font-black text-yellow-400">${appLabels.congratsModalTitle}</h2><div id="congrats-winner-name" contenteditable="true" class="text-4xl font-bold text-white my-4 focus:outline-none focus:ring-2 ring-amber-500 rounded-lg px-2"></div><div id="congrats-prize-value" contenteditable="true" class="text-2xl text-slate-300 mb-6 focus:outline-none focus:ring-2 ring-amber-500 rounded-lg px-2"></div><p class="text-2xl text-sky-300 mt-4">${appLabels.congratsModalMessage}</p><button id="close-congrats-modal-btn" class="mt-8 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-full text-lg">${appLabels.congratsModalCloseButton}</button></div>`,
                eventBreak: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-4xl w-full text-center h-5/6 flex flex-col"><h2 id="event-break-title" class="text-5xl font-black text-sky-400 px-2">${appLabels.intervalModalTitle}</h2><p id="event-break-subtitle" class="text-2xl text-slate-300 mt-6 px-2">${appLabels.intervalModalSubtitle}</p><div class="flex-grow mt-6 grid grid-cols-1 gap-8 overflow-hidden"><div id="break-content-area" class="bg-gray-700 p-4 rounded-lg text-left flex flex-col"></div></div><div class="mt-8 flex justify-center gap-4"><button id="generate-proof-end-btn" class="hidden bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg">${appLabels.generateProofButton}</button><button id="close-break-modal-btn" class="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-full text-lg">${appLabels.modalBackButton}</button></div><footer class="text-center pt-4 mt-4 border-t border-gray-700 text-xs text-gray-400"><p>Criado em 2025 por Alison Fernando Rodrigues dos Santos, com tecnologia Google Gemini 2.5 PRO no formato HTML.</p><p>Siga <a href="https://www.instagram.com/oalison.rodrigues" target="_blank" class="text-sky-400 hover:underline">@oalison.rodrigues</a> no Instagram e <a href="https://www.tiktok.com/@oalison.rodrigues" target="_blank" class="text-sky-400 hover:underline">TikTok</a></p><p id="version-modal" class="mt-2 focus:outline-none focus:ring-2 ring-gray-600 rounded-lg px-2 inline-block"></p></footer></div>`,
                menuEdit: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full"><h2 class="text-3xl font-bold text-white mb-4">${appLabels.menuEditModalTitle}</h2><p class="text-slate-400 mb-4">${appLabels.menuEditModalDescription}</p><textarea id="menu-textarea" class="w-full h-48 bg-gray-900 text-white p-2 rounded-lg focus:outline-none focus:ring-2 ring-amber-500"></textarea><div class="flex justify-end gap-4 mt-4"><button id="cancel-menu-edit-btn" class="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-full">${appLabels.modalCancelButton}</button><button id="save-menu-btn" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-full">${appLabels.modalSaveButton}</button></div></div>`,
                winnerEdit: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full"><h2 class="text-3xl font-bold text-white mb-6">${appLabels.winnerEditModalTitle}</h2><div class="space-y-4"><input type="text" id="edit-winner-name" placeholder="${appLabels.winnerEditModalNamePlaceholder}" class="w-full text-center text-xl font-bold p-3 border-2 border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"><input type="text" id="edit-winner-prize" placeholder="${appLabels.winnerEditModalPrizePlaceholder}" class="w-full text-center text-xl font-bold p-3 border-2 border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"></div><div class="flex justify-between items-center mt-8 gap-4"><button id="remove-winner-btn" class="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-6 rounded-full">${appLabels.winnerEditModalRemoveButton}</button><div><button id="cancel-winner-edit-btn" class="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-full">${appLabels.modalCancelButton}</button><button id="save-winner-changes-btn" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-full ml-2">${appLabels.modalSaveButton}</button></div></div></div>`,
                deleteConfirm: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center"><h2 class="text-2xl font-bold text-yellow-400 mb-4">${appLabels.deleteConfirmModalTitle}</h2><p id="delete-confirm-message" class="text-slate-300 text-lg mb-8"></p><div class="flex justify-center gap-4"><button id="cancel-delete-btn" class="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-full text-lg">${appLabels.modalCancelButton}</button><button id="confirm-delete-btn" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full text-lg">${appLabels.deleteConfirmModalDeleteButton}</button></div></div>`,
                clearRoundConfirm: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
                                       <h2 class="text-2xl font-bold text-yellow-400 mb-4" data-label-key="clearRoundConfirmTitle">${appLabels.clearRoundConfirmTitle}</h2>
                                       <p class="text-slate-300 text-lg mb-8" data-label-key="clearRoundConfirmMessage">${appLabels.clearRoundConfirmMessage}</p>
                                       <div class="flex justify-center gap-4">
                                           <button id="cancel-clear-round-btn" class="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-full text-lg" data-label-key="clearRoundCancelButton">${appLabels.clearRoundCancelButton}</button>
                                           <button id="confirm-clear-round-btn" class="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-full text-lg" data-label-key="clearRoundConfirmButton">${appLabels.clearRoundConfirmButton}</button>
                                       </div>
                                   </div>`,
                proofOptions: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full"><h2 class="text-3xl font-bold text-white mb-6">${appLabels.proofOptionsModalTitle}</h2><p class="text-slate-400 mb-4">${appLabels.proofOptionsModalDescription}</p><div id="proof-options-list" class="space-y-2 max-h-60 overflow-y-auto"></div><div class="flex justify-end gap-4 mt-6"><button id="cancel-proof-btn" class="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-full">${appLabels.modalCancelButton}</button><button id="generate-selected-proof-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full">${appLabels.proofOptionsModalGenerateButton}</button></div></div>`,
                spinningWheel: `<div class="w-full h-full max-w-3xl max-h-[40rem] relative flex items-center justify-center"><div id="bingo-cage" class="w-full h-full absolute spinning-cage"><div id="number-cyclone" class="absolute w-full h-full transform-gpu"></div><div class="absolute w-full h-full border-8 border-gray-500 rounded-full" style="transform: rotateY(0deg) translateZ(0px);"></div><div class="absolute w-full h-full border-8 border-gray-500 rounded-full" style="transform: rotateY(30deg) translateZ(0px);"></div><div class="absolute w-full h-full border-8 border-gray-500 rounded-full" style="transform: rotateY(60deg) translateZ(0px);"></div><div class="absolute w-full h-full border-8 border-gray-500 rounded-full" style="transform: rotateY(90deg) translateZ(0px);"></div><div class="absolute w-full h-full border-8 border-gray-500 rounded-full" style="transform: rotateY(120deg) translateZ(0px);"></div><div class="absolute w-full h-full border-8 border-gray-500 rounded-full" style="transform: rotateY(150deg) translateZ(0px);"></div></div><div id="drawn-ball-container" class="z-10 opacity-0"></div></div><div class="absolute bottom-10 flex gap-4"><button id="skip-animation-btn" class="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-full text-lg">${appLabels.spinningWheelSkipButton}</button><button id="close-drawn-btn" class="hidden bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded-full text-lg">${appLabels.modalBackButton}</button></div>`,
                resetConfirm: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center"><h2 class="text-2xl font-bold text-red-500 mb-4">${appLabels.resetConfirmModalTitle}</h2><p class="text-slate-300 text-lg mb-8">${appLabels.resetConfirmModalMessage}</p><div class="flex justify-center gap-4"><button id="cancel-reset-btn" class="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-full text-lg">${appLabels.modalCancelButton}</button><button id="confirm-reset-btn" class="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-6 rounded-full text-lg">${appLabels.resetConfirmModalConfirmButton}</button></div></div>`,
                drawnPrizes: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-2xl w-full text-center"><h2 class="text-3xl font-bold text-white">${appLabels.drawnPrizesModalTitle}</h2><p id="drawn-prizes-subtitle" class="text-xl font-bold text-yellow-400 mb-6"></p><div id="drawn-prizes-list" class="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto flex flex-wrap gap-3 justify-center mb-6"></div><button id="close-drawn-prizes-btn" class="mt-8 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-full text-lg">${appLabels.modalCloseButton}</button></div>`,
                donation: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center"><h2 class="text-3xl font-black text-amber-400 mb-6">${appLabels.donationModalTitle}</h2><p class="text-slate-300 mb-4">${appLabels.donationModalDescription}</p><div class="space-y-6 text-left"><div class="text-center border-b border-gray-700 pb-6"><p class="text-lg font-bold text-white mb-4">${appLabels.donationModalPaypalLabel}</p><div class="flex justify-center"><form action="https://www.paypal.com/donate" method="post" target="_top"><input type="hidden" name="hosted_button_id" value="FLVDNY994MNQS" /><input type="image" src="https://www.paypalobjects.com/pt_BR/BR/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Faça doações com o botão do PayPal" /></form></div></div><div class="pt-6"><p class="text-lg font-bold text-white mb-2">${appLabels.donationModalPixLabel}</p><div class="flex flex-col items-center"><div id="pix-key-display" contenteditable="false" class="bg-gray-700 text-white p-3 rounded-lg text-center text-sm font-mono select-all cursor-text max-w-full overflow-hidden whitespace-nowrap overflow-ellipsis"></div><button id="copy-pix-btn" class="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all">${appLabels.donationModalCopyButton}</button></div></div></div><button id="close-donation-btn" class="mt-8 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-full text-lg">${appLabels.modalCloseButton}</button></div>`,
                finalWinners: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-4xl w-full text-center h-5/6 flex flex-col justify-between"><h2 id="end-title" class="text-5xl font-black text-yellow-400 mb-4 flex-shrink-0">${appLabels.finalWinnersModalTitle}</h2><div id="end-winner-display" class="flex-grow flex items-center justify-center p-4 min-h-[150px]"><div id="current-winner-card" class="bg-gray-700 p-8 rounded-xl shadow-2xl w-full max-w-2xl text-center transform scale-90 opacity-0 transition-all duration-500"></div></div><div class="mt-4 flex flex-col items-center gap-2 flex-shrink-0"><div class="flex justify-center gap-4 w-full max-w-md"><button id="generate-proof-final-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-8 rounded-full text-lg">${appLabels.finalWinnersModalProofButton}</button><button id="close-final-modal-btn" class="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-8 rounded-full text-lg">${appLabels.modalCloseButton}</button></div><button id="donation-final-btn" class="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all shadow-lg w-full max-w-xs">${appLabels.finalWinnersModalSupportButton}</button></div><footer class="text-center py-2 px-4 text-xs text-gray-400 dark:text-gray-500 mt-4 border-t border-gray-700 flex-shrink-0"><p>Este programa é o resultado do Trabalho de Conclusão de Curso de <a href="https://www.instagram.com/oalison.rodrigues" target="_blank" class="text-sky-500 dark:text-sky-400 hover:underline">Alison Fernando Rodrigues dos Santos</a>, sob orientação do <a href="https://www.instagram.com/danilonobresant/" target="_blank" class="text-sky-500 dark:text-sky-400 hover:underline">Prof. Pe. Dr. Danilo Nobre</a>.</p><p class="mt-1">Título: "<a href="https://drive.google.com/file/d/1ePRuNoD-4jQZLrgFIanilhur3mB4-S19/view?usp=sharing" target="_blank" class="text-sky-500 dark:text-sky-400 hover:underline">E O VERBO SE FEZ I.A.?</a> DA REFLEXÃO TEOLÓGICA E COMUNICATIVA AO DESENVOLVIMENTO DE SOLUÇÕES PASTORAIS COM INTELIGÊNCIA ARTIFICIAL".</p><p class="mt-1">Desenvolvido inteiramente com a Inteligência Artificial Gemini 2.5 PRO da Google.</p><p class="mt-2">Versão <span id="version-footer-modal" class="focus:outline-none focus:ring-2 ring-gray-600 rounded-lg px-2 inline-block">${currentVersion}</span>- <span id="last-updated-footer-modal"></span></p></footer></div>`,
                changelog: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col h-[90vh]">
                               <h2 class="text-3xl font-black text-white mb-2 flex-shrink-0">${appLabels.changelogModalTitle}</h2>
                               <p class="text-xl font-bold text-sky-400 mb-4 flex-shrink-0">${appLabels.changelogModalCurrentVersionLabel} ${currentVersion}</p>
                               <div id="version-history-content" class="flex-grow w-full bg-gray-900 text-white p-4 rounded-lg overflow-y-auto text-sm leading-snug"></div>
                               <div class="flex justify-end gap-4 mt-4 flex-shrink-0">
                                   <button id="close-changelog-btn" class="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-full">${appLabels.modalCloseButton}</button>
                               </div>
                           </div>`,
                settings: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-4xl w-full">
                    <h2 class="text-3xl font-black text-amber-400 mb-4">${appLabels.settingsModalTitle}</h2>
                    
                    <div class="border-b border-gray-700 mb-4">
                        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                            <button id="tab-appearance" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg border-sky-500 text-sky-400">${appLabels.settingsTabAppearance}</button>
                            <button id="tab-sponsors" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500">${appLabels.settingsTabSponsors}</button>
                            <button id="tab-labels" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500">${appLabels.settingsTabLabels}</button>
                            <button id="tab-shortcuts" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500">${appLabels.settingsTabShortcuts}</button>
                        </nav>
                    </div>

                    <div id="settings-content-container" class="max-h-[60vh] overflow-y-auto pr-4">
                        <div id="tab-content-appearance" class="space-y-6 text-left">
                           <div class="border-b border-gray-700 pb-6">
                                <label class="block text-xl font-bold text-slate-300 mb-2">${appLabels.settingsLogoTitle}</label>
                                <p class="text-xs text-slate-400 mb-4">${appLabels.settingsLogoDescription}</p>
                                <textarea id="custom-logo-input" placeholder="Cole o código Base64 da imagem aqui..." class="w-full h-24 bg-gray-600 text-white p-2 rounded-lg font-mono text-xs"></textarea>
                                <button id="remove-custom-logo-btn" class="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg text-sm">${appLabels.settingsLogoRemoveButton}</button>
                            </div>
                            <div class="border-b border-gray-700 pb-6">
                                <label class="block text-xl font-bold text-slate-300 mb-2">${appLabels.settingsBingoTitleLabel}</label>
                                <p class="text-xs text-slate-400 mb-4">${appLabels.settingsBingoTitleDescription}</p>
                                <select id="bingo-title-select" class="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-sky-500 focus:border-sky-500">
                                    <option value="BINGO">BINGO!</option>
                                    <option value="AJUDE">AJUDE!</option>
                                </select>
                            </div>
                            <div class="border-b border-gray-700 pb-6">
                                <label class="block text-xl font-bold text-slate-300 mb-2">${appLabels.settingsBoardColorLabel}</label>
                                <p class="text-xs text-slate-400 mb-4">${appLabels.settingsBoardColorDescription}</p>
                                <div class="flex items-center justify-center gap-4">
                                     <input type="color" id="board-color-picker" class="w-12 h-12 p-1 border-2 border-gray-600 rounded-full cursor-pointer" value="#FFFFFF">
                                     <button id="reset-board-color-btn" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all">${appLabels.settingsBoardColorResetButton}</button>
                                </div>
                            </div>
                            <h3 class="text-lg font-bold text-white mb-3">${appLabels.settingsDrawnNumberTitle}</h3>
                            <div>
                                <label class="block text-sm font-bold text-slate-400 mb-1">${appLabels.settingsDrawnTextColorLabel}</label>
                                <input type="color" id="drawn-text-color-picker" class="w-12 h-12 p-1 border-2 border-gray-600 rounded-full cursor-pointer" value="#FFFFFF">
                            </div>
                             <div>
                                <label class="block text-sm font-bold text-slate-400 mb-1">${appLabels.settingsDrawnStrokeColorLabel}</label>
                                <input type="color" id="drawn-stroke-color-picker" class="w-12 h-12 p-1 border-2 border-gray-600 rounded-full cursor-pointer" value="#000000">
                            </div>
                            <div>
                                <label for="drawn-stroke-width-slider" class="block text-sm font-bold text-slate-400 mb-1">${appLabels.settingsDrawnStrokeWidthLabel} (<span id="drawn-stroke-width-value">2</span>px)</label>
                                <input type="range" id="drawn-stroke-width-slider" min="0" max="10" value="2" class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg">
                            </div>
                        </div>

                        <div id="tab-content-sponsors" class="hidden space-y-4 text-left">
                           <h3 class="text-xl font-bold text-slate-300">${appLabels.settingsSponsorsByNumberTitle}</h3>
                           <div class="flex items-center gap-3 bg-gray-700 p-3 rounded-lg">
                                <input type="checkbox" id="enable-sponsors-by-number-checkbox" class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                                <label for="enable-sponsors-by-number-checkbox" class="text-slate-200 font-medium">${appLabels.settingsSponsorsByNumberEnable}</label>
                           </div>
                           <p class="text-sm text-slate-400">${appLabels.settingsSponsorsByNumberDescription}</p>
                           <div id="sponsors-by-number-container" class="space-y-3"></div>
                        </div>
                        
                        <div id="tab-content-labels" class="hidden">
                             <div id="labels-form-container" class="space-y-4 text-left grid grid-cols-1 md:grid-cols-2 gap-4">
                             </div>
                        </div>

                        <div id="tab-content-shortcuts" class="hidden space-y-6 text-left">
                            <h3 class="text-xl font-bold text-slate-300">${appLabels.shortcutsEditTitle}</h3>
                            <p class="text-sm text-slate-400">${appLabels.shortcutsEditDescription}</p>
                            <div id="shortcuts-form-container" class="space-y-4">
                                <!-- Os campos de atalho serão inseridos aqui pelo JS -->
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-6 flex justify-between items-center">
                        <button id="generate-test-data-btn" class="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all">${appLabels.settingsTestDataButton}</button>
                        <button id="close-settings-btn" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full text-lg">${appLabels.settingsCloseSaveButton}</button>
                    </div>
                </div>`
            };
        }

        const debouncedSave = () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveStateToFirestore, 1500); 
        };
        
        function generateTestData() {
            gameCount = 6;
            gamesData = {};
            drawnPrizeNumbers = [12, 45, 101, 300]; 
            activeGameNumber = '3';

            for (let i = 1; i <= gameCount; i++) {
                gamesData[i] = {
                    prizes: {
                        prize1: predefinedPrizes[i - 1]?.prize1 || '',
                        prize2: predefinedPrizes[i - 1]?.prize2 || '',
                        prize3: predefinedPrizes[i - 1]?.prize3 || ''
                    },
                    calledNumbers: Array.from({ length: 30 }, (_, index) => (i - 1) * 5 + index + 1),
                    winners: [],
                    isComplete: false,
                    color: roundColors[(i-1) % roundColors.length],
                };
            }
            
            gamesData[1].winners.push({ id: 101, name: "Maria " + appLabels.prize1Label, prize: gamesData[1].prizes.prize1, gameNumber: '1', bingoType: 'prize1', numbers: gamesData[1].calledNumbers });
            gamesData[2].winners.push({ id: 201, name: "João " + appLabels.prize2Label, prize: gamesData[2].prizes.prize2, gameNumber: '2', bingoType: 'prize2', numbers: gamesData[2].calledNumbers });
            gamesData[2].isComplete = true;
            gamesData[4].winners.push({ id: 401, name: "Pedro Teste", prize: gamesData[4].prizes.prize2, gameNumber: '4', bingoType: 'prize2', numbers: gamesData[4].calledNumbers });
            gamesData[4].isComplete = true;
            gamesData[5].winners.push({ id: 501, name: "Ana " + appLabels.prize3Label, prize: gamesData[5].prizes.prize3, gameNumber: '5', bingoType: 'prize3', numbers: gamesData[5].calledNumbers });
            gamesData[5].isComplete = true;
            gamesData[6].winners.push({ id: 601, name: "Final Evento", prize: gamesData[6].prizes.prize2, gameNumber: '6', bingoType: 'prize2', numbers: gamesData[6].calledNumbers });
            gamesData[6].isComplete = true;

            if (!gamesData['Brindes']) gamesData['Brindes'] = { winners: [] };
            gamesData['Brindes'].winners.push({ id: 901, name: "Carla", prize: "Ventilador", gameNumber: 'Brinde', bingoType: 'Sorteio', cartela: '12' });
            gamesData['Brindes'].winners.push({ id: 902, name: "Ronaldo", prize: "Rádio", gameNumber: 'Brinde', bingoType: 'Sorteio', cartela: '101' });

            if (!gamesData['Leilão']) gamesData['Leilão'] = { winners: [] };
            gamesData['Leilão'].winners.push({ id: 1001, name: "Marcos", prize: "Bolo (Leilão)", gameNumber: 'Leilão', bingoType: 'Leilão', itemName: "Bolo de Chocolate", bid: "150" });
            
            appConfig.isEventClosed = false;
            activeGameNumber = '3';
            gamesData[3].calledNumbers = gamesData[3].calledNumbers.slice(0, 10);

            saveStateToFirestore().then(() => {
                showAlert("Dados de teste gerados com sucesso! O aplicativo será recarregado com o novo histórico.");
                DOMElements.settingsModal.classList.add('hidden');
                window.location.reload(); 
            });
        }
        
        // --- Funções Auxiliares ---
        function applyLabels() {
            // Itera sobre o objeto de labels e atualiza os elementos correspondentes
            for (const key in appLabels) {
                const elements = document.querySelectorAll(`[data-label-key="${key}"]`);
                elements.forEach(el => {
// FIX: Check if element is an input or textarea before setting placeholder to avoid type errors.
                    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
                        el.placeholder = appLabels[key as keyof typeof appLabels];
                    } else if (el.tagName === 'LABEL') {
                        // Para labels que contêm inputs, só muda o texto
                        const textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                        if (textNode) textNode.textContent = appLabels[key as keyof typeof appLabels];
                    }
                    else {
                        el.textContent = appLabels[key as keyof typeof appLabels];
                    }
                });
            }
             // Casos especiais
            DOMElements.mainTitle.innerHTML = `${appLabels.mainTitle} <span id="subtitle-version" class="block text-xl sm:text-2xl text-slate-300"></span>`;
            
            // Atualiza os placeholders dos inputs de prêmio nas rodadas existentes
            document.querySelectorAll('.prize-input-label').forEach((label, index) => {
                label.textContent = `${appLabels[('prize' + (index % 3 + 1) + 'Label') as keyof typeof appLabels]}:`;
            });
            renderUpdateInfo(); // Para re-renderizar a versão no subtítulo
        }

        function hexToRgba(hex, alpha = 1) {
            if (!hex || !/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return null;
            let c = hex.substring(1).split('');
            if (c.length === 3) { c = [c[0], c[0], c[1], c[1], c[2], c[2]]; }
            c = '0x' + c.join('');
            return `rgba(${(c >> 16) & 255}, ${(c >> 8) & 255}, ${c & 255}, ${alpha})`;
        }

        function isLightColor(hex) {
            if (!hex || hex === 'default') return false; 
            const color = hex.startsWith('#') ? hex.slice(1) : hex;
            const r = parseInt(color.substring(0, 2), 16);
            const g = parseInt(color.substring(2, 4), 16);
            const b = parseInt(color.substring(4, 6), 16);
            const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; 
            return luma > 160;
        }

        function findNextGameNumber() {
            const sortedGameNumbers = Object.keys(gamesData).filter(key => !isNaN(parseInt(key))).map(Number).sort((a, b) => a - b);
            for (const num of sortedGameNumbers) { if (!gamesData[num].isComplete) return num.toString(); }
            return null;
        }

        function areAllGamesComplete() {
            const gameKeys = Object.keys(gamesData).filter(key => !isNaN(parseInt(key)));
            if (gameKeys.length === 0) return false;
            return gameKeys.every(key => gamesData[key].isComplete);
        }

        function renderUpdateInfo() {
            const now = new Date();
            const formattedDate = now.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            if (document.getElementById('version')) document.getElementById('version').innerText = currentVersion;
            const subtitle = document.getElementById('subtitle-version');
            if (subtitle) subtitle.innerText = `Versão ${currentVersion}`;
            if (DOMElements.lastUpdated) DOMElements.lastUpdated.innerText = `Última atualização: ${formattedDate}`;
        }

        async function saveStateToFirestore() {
            if (!firebaseReady || !dbRef) return;
            const versionToSave = currentVersion;

            appConfig.tutorialVideoLink = 'https://youtu.be/8iOOW-CR-WQ?si=Jolrp2qR38xhY5EZ'; 
            appConfig.paypalLink = 'https://www.paypal.com/donate/?hosted_button_id=WJBLF3LV3RZRW';
            appConfig.pixKey = '1e8e4af0-4d23-440c-9f3d-b4e527f65911';
            
            const appState = {
                gamesData: gamesData,
                gameCount: gameCount,
                activeGameNumber: activeGameNumber,
                menuItems: menuItems,
                drawnPrizeNumbers: drawnPrizeNumbers,
                mainTitleHTML: DOMElements.mainTitle.innerHTML,
                versionText: versionToSave,
                versionHistory: versionHistory,
                appConfig: appConfig,
                appLabels: appLabels, // Salva os textos customizados
            };
            try {
                await setDoc(dbRef, appState);
                renderUpdateInfo(); 

                if (areAllGamesComplete() && !appConfig.isEventClosed) { 
// FIX: Safely access 'winners' property by casting 'game' to 'any' and providing a fallback empty array to prevent runtime errors with flatMap.
                    const allWinners = Object.values(gamesData).flatMap(game => (game as any).winners || []).filter(w => w.bingoType !== 'Sorteio').reverse();
                    if (allWinners.length > 0) {
                        appConfig.isEventClosed = true;
                        await saveStateToFirestore();
                        setTimeout(() => startFinalWinnerSlide(allWinners), 1500); 
                    }
                }
            } catch (error) {
                console.error("Erro ao salvar dados no Firestore: ", error);
                showAlert("Não foi possível salvar os dados. Verifique a conexão.");
            }
        }

        async function loadStateFromFirestore() {
            if (!dbRef) return;
            let forceSave = false;
            try {
                const docSnap = await getDoc(dbRef);
                if (docSnap.exists()) {
                    const appState = docSnap.data();
                    
                    gamesData = appState.gamesData || {};
                    gameCount = appState.gameCount || 6;
                    activeGameNumber = appState.activeGameNumber || null;
                    menuItems = appState.menuItems || [ "Refrigerante - R$ 5,00", "Cerveja - R$ 7,00", "Água - R$ 3,00", "Espetinho - R$ 8,00", "Pastel - R$ 6,00", "Porção de Fritas - R$ 15,00" ];
                    drawnPrizeNumbers = appState.drawnPrizeNumbers || [];
                    versionHistory = appState.versionHistory || versionHistory;
                    
                    if (appState.versionText && appState.versionText !== currentVersion) {
                        console.log(`[UPGRADE] Versão local (${currentVersion}) forçada sobre a versão salva (${appState.versionText}).`);
                        forceSave = true;
                    }
                    
                    if (appState.mainTitleHTML) DOMElements.mainTitle.innerHTML = appState.mainTitleHTML;
                    
                    // Carrega configurações e labels
                    const loadedConfig = appState.appConfig || {};
                    appConfig = { ...appConfig, ...loadedConfig };
                    const loadedLabels = appState.appLabels || {};
                    appLabels = { ...appLabels, ...loadedLabels };

                    appConfig.tutorialVideoLink = 'https://youtu.be/8iOOW-CR-WQ?si=Jolrp2qR38xhY5EZ';
                    appConfig.paypalLink = 'https://www.paypal.com/donate/?hosted_button_id=WJBLF3LV3RZRW';
                    appConfig.pixKey = '1e8e4af0-4d23-440c-9f3d-b4e527f65911';

                } else {
                    gameCount = 6;
                    gamesData = {};
                    for (let i = 1; i <= gameCount; i++) {
                        gamesData[i] = {
                            prizes: {
                                prize1: predefinedPrizes[i - 1]?.prize1 || '',
                                prize2: predefinedPrizes[i - 1]?.prize2 || '',
                                prize3: predefinedPrizes[i - 1]?.prize3 || ''
                            },
                            calledNumbers: [],
                            winners: [],
                            isComplete: false,
                            color: roundColors[(i-1) % roundColors.length],
                        };
                    }
                    forceSave = true;
                }
            } catch (error) {
                console.error("Erro ao carregar dados do Firestore: ", error);
                showAlert("Não foi possível carregar os dados salvos.");
            }
            
            applyLabels(); // Aplica os textos customizados
            renderUIFromState();
            
            if (forceSave) {
                 await saveStateToFirestore();
            }
        }

        function renderUIFromState() {
            renderCustomLogo();
            renderMasterBoard(); 
            DOMElements.gamesListEl.innerHTML = '';
            
            if (Object.keys(gamesData).length > 0) {
                const sortedGameNumbers = Object.keys(gamesData).filter(key => !isNaN(parseInt(key))).sort((a, b) => parseInt(a) - parseInt(b));
                for (const gameNum of sortedGameNumbers) {
                    if (gamesData[gameNum] && typeof gamesData[gameNum] === 'object') {
                        const gameEl = createGameElement(parseInt(gameNum), gamesData[gameNum].prizes);
                        DOMElements.gamesListEl.appendChild(gameEl);
                        if (gamesData[gameNum].isComplete) updateGameItemUI(gameEl, true);
                        else updateGameItemUI(gameEl, false);
                    }
                }
            }
            
            document.querySelectorAll('.game-item').forEach(el => el.classList.remove('active-round-highlight'));
            
            if (activeGameNumber && gamesData[activeGameNumber]) {
                if (gamesData[activeGameNumber].calledNumbers) {
                    gamesData[activeGameNumber].calledNumbers.forEach((num: number) => updateMasterBoardCell(num));
                }
                loadRoundState(activeGameNumber);
                const activeGameItem = DOMElements.gamesListEl.querySelector(`.game-item[data-game-number="${activeGameNumber}"]`);
                if (activeGameItem) {
                    activeGameItem.classList.add('active-round-highlight');
                    const playBtn = activeGameItem.querySelector('.play-btn');
                    if (playBtn) playBtn.textContent = 'Jogando...';
                    activeGameItem.classList.remove('game-completed-style');
                }
            } else {
                 if (DOMElements.currentRoundDisplay) DOMElements.currentRoundDisplay.textContent = appLabels.activeRoundIndicatorDefault;
            }
            
            renderAllWinners();
            renderShortcutsLegend();
            
// FIX: Safely access 'winners' property by casting 'game' to 'any' to avoid type errors on heterogeneous objects.
            if (Object.values(gamesData).some(game => (game as any).winners && (game as any).winners.length > 0)) {
                DOMElements.shareBtn.classList.remove('hidden');
                DOMElements.endEventBtn.classList.remove('hidden');
            }
            
            const boardZoomSlider = document.getElementById('board-zoom-slider') as HTMLInputElement;
            const displayZoomSlider = document.getElementById('display-zoom-slider') as HTMLInputElement;
// FIX: Add a null check before accessing 'value' property.
            if (boardZoomSlider) boardZoomSlider.value = appConfig.boardScale.toString();
// FIX: Add a null check before accessing 'value' property.
            if (displayZoomSlider) displayZoomSlider.value = appConfig.displayScale.toString();
            applyBoardZoom(appConfig.boardScale);
            applyDisplayZoom(appConfig.displayScale); 
            
            DOMElements.noRepeatPrizeDrawCheckbox.checked = true;
        }

        // --- Funções do Jogo ---

        function announceNumber(number: number) {
            if (!activeGameNumber) {
                showAlert("Por favor, selecione uma rodada clicando em 'Jogar' para iniciar.");
                return;
            }
            const game = gamesData[activeGameNumber];
            if (game.calledNumbers.includes(number)) {
                showError(`O número ${number} já foi anunciado.`);
                return;
            }
            const letter = getLetterForNumber(number);
            if (!letter) {
                showError(`Número inválido. Digite um valor entre 1 e 75.`);
                return;
            }
            DOMElements.mainDisplayLabel.textContent = appLabels.announcedNumberLabel;
            const currentNumberEl = DOMElements.currentNumberEl as HTMLElement;
            currentNumberEl.style.cursor = 'default';
            
            const mainColor = appConfig.drawnTextColor;
            const strokeColor = appConfig.drawnTextStrokeColor;
            const strokeWidth = appConfig.drawnTextStrokeWidth;
            let strokeStyle = `${strokeWidth}px ${strokeColor}`;

            currentNumberEl.classList.remove('w-11/12', 'max-w-lg', 'py-8', 'rounded-lg', 'bg-white', 'text-purple-600', 'bg-slate-50', 'text-gray-800', 'text-white', 'text-gray-900', 'animate-custom-flash');
            currentNumberEl.classList.add('w-64', 'h-64', 'sm:w-[420px]', 'sm:h-[420px]', 'rounded-full', 'shadow-inner');
            
            const roundColor = gamesData[activeGameNumber]?.color;
            currentNumberEl.style.backgroundColor = roundColor || (appConfig.boardColor !== 'default' ? appConfig.boardColor : '#f1f5f9');
            
            currentNumberEl.style.color = mainColor;
            currentNumberEl.style.webkitTextStroke = strokeStyle; 
            currentNumberEl.style.textShadow = 'none';

            currentNumberEl.innerHTML = `<span>${letter}</span><span>${number}</span>`;
            currentNumberEl.style.visibility = 'visible';
            currentNumberEl.classList.remove('animate-bounce-in');
            void currentNumberEl.offsetWidth; 
            currentNumberEl.classList.add('animate-bounce-in');
            updateMasterBoardCell(number);
            updateLastNumbers(letter, number, true);
            DOMElements.numberInput.value = '';
            DOMElements.letterInput.value = '';
            saveStateToFirestore();
        }

        function showFloatingNumber(number: number) {
            if (!activeGameNumber) {
                showAlert("Por favor, selecione uma rodada clicando em 'Jogar' para iniciar.");
                return;
            }
            const game = gamesData[activeGameNumber];
            if (game.calledNumbers.includes(number)) {
                showError(`O número ${number} já foi anunciado.`);
                return;
            }

            const sponsor = appConfig.sponsorsByNumber[number as keyof typeof appConfig.sponsorsByNumber];
            if (appConfig.enableSponsorsByNumber && sponsor && (sponsor as any).image) {
                showSponsorDisplayModal(number, sponsor);
            } else {
                showClassicFloatingNumberModal(number);
            }
        }

        function showClassicFloatingNumberModal(number: number) {
            const roundColor = gamesData[activeGameNumber]?.color;
            const mainColor = appConfig.drawnTextColor;
            const strokeColor = appConfig.drawnTextStrokeColor;
            const strokeWidth = appConfig.drawnTextStrokeWidth;
            let strokeStyle = `${strokeWidth}px ${strokeColor}`;
            let bgColorStyle = `background-color: ${roundColor || '#0ea5e9'};`;
            
            DOMElements.floatingNumberModal.innerHTML = getModalTemplates().floatingNumber;
            const floatingNumberDisplay = document.getElementById('floating-number-display') as HTMLElement;
            const closeFloatingBtn = document.getElementById('close-floating-btn');
            const letter = getLetterForNumber(number);
            
            floatingNumberDisplay.innerHTML = `<span>${letter}</span><span>${number}</span>`;
            floatingNumberDisplay.classList.remove('bg-sky-500'); 
            floatingNumberDisplay.setAttribute('style', `font-size: clamp(10rem, 30vw, 20rem); line-height: 1; text-shadow: 2px 2px 5px #000; ${bgColorStyle}; color: ${mainColor}; -webkit-text-stroke: ${strokeStyle};`);
            
            DOMElements.floatingNumberModal.classList.remove('hidden');
            closeFloatingBtn.addEventListener('click', () => {
                DOMElements.floatingNumberModal.classList.add('hidden');
                clearTimeout(floatingNumberTimeout);
                announceNumber(number);
            });
            clearTimeout(floatingNumberTimeout);
            floatingNumberTimeout = setTimeout(() => {
                DOMElements.floatingNumberModal.classList.add('hidden');
                announceNumber(number);
            }, 5000);
        }

        function showSponsorDisplayModal(number: number, sponsor: any) {
            DOMElements.sponsorDisplayModal.innerHTML = getModalTemplates().sponsorDisplay;
            
            const numberDisplay = document.getElementById('sponsor-number-display') as HTMLElement;
// FIX: Cast element to HTMLImageElement to correctly access the 'src' property.
            const imageEl = document.getElementById('sponsor-image') as HTMLImageElement;
            const nameEl = document.getElementById('sponsor-name');
            const closeBtn = document.getElementById('close-sponsor-display-btn');

            const letter = getLetterForNumber(number);
            const roundColor = gamesData[activeGameNumber]?.color;
            const mainColor = appConfig.drawnTextColor;
            const strokeColor = appConfig.drawnTextStrokeColor;
            const strokeWidth = appConfig.drawnTextStrokeWidth;
            const strokeStyle = `${strokeWidth}px ${strokeColor}`;
            const bgColorStyle = `background-color: ${roundColor || '#0ea5e9'};`;

            numberDisplay.innerHTML = `<span>${letter}</span><span>${number}</span>`;
            numberDisplay.setAttribute('style', `font-size: clamp(10rem, 30vw, 20rem); line-height: 1; text-shadow: 2px 2px 5px #000; ${bgColorStyle}; color: ${mainColor}; -webkit-text-stroke: ${strokeStyle};`);

            imageEl.src = sponsor.image;
            nameEl.textContent = sponsor.name || 'Patrocinador';

            DOMElements.sponsorDisplayModal.classList.remove('hidden');

            const closeModal = () => {
                DOMElements.sponsorDisplayModal.classList.add('hidden');
                clearTimeout(floatingNumberTimeout);
                announceNumber(number);
            };

            closeBtn.addEventListener('click', closeModal);
            clearTimeout(floatingNumberTimeout);
            floatingNumberTimeout = setTimeout(closeModal, 8000); // Longer timeout for sponsor
        }

        function handleAutoDraw() {
            if (!activeGameNumber) {
                showAlert("Selecione uma rodada para o sorteio automático.");
                return;
            }
            const game = gamesData[activeGameNumber];
            const allNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
            const availableNumbers = allNumbers.filter(num => !game.calledNumbers.includes(num));

            if (availableNumbers.length === 0) {
                showAlert("Todos os números já foram sorteados nesta rodada!");
                return;
            }
            
// FIX: Cast element to HTMLButtonElement to correctly access the 'disabled' property.
            document.querySelectorAll('[data-label-key="autoDrawButton"]').forEach(btn => (btn as HTMLButtonElement).disabled = true);

            DOMElements.spinningWheelModal.innerHTML = getModalTemplates().spinningWheel;
            DOMElements.spinningWheelModal.classList.remove('hidden');

            const cycloneEl = document.getElementById('number-cyclone');
            const cageEl = document.getElementById('bingo-cage') as HTMLElement;
            const ballContainer = document.getElementById('drawn-ball-container') as HTMLElement;
            const skipBtn = document.getElementById('skip-animation-btn') as HTMLElement;
            const closeBtn = document.getElementById('close-drawn-btn') as HTMLElement;

            cycloneEl.innerHTML = '';
            const particles = Math.min(availableNumbers.length, 50);
            for (let i = 0; i < particles; i++) {
                const particle = document.createElement('div');
                particle.className = 'number-cyclone-particle text-2xl';
// FIX: Convert number to string for textContent property.
                particle.textContent = availableNumbers[i % availableNumbers.length].toString();
                const anim = Math.ceil(Math.random() * 4);
                particle.style.animation = `fly-in-cage-${anim} ${3 + Math.random() * 4}s ${Math.random() * -2}s alternate infinite`;
                cycloneEl.appendChild(particle);
            }

            const finishAnimation = (drawnNumber: number) => {
                clearTimeout(spinTimeout);
                clearInterval(cycloneInterval);
                const letter = getLetterForNumber(drawnNumber);
                
                const finalColor = appConfig.drawnTextColor;
                const finalStroke = `${appConfig.drawnTextStrokeWidth}px ${appConfig.drawnTextStrokeColor}`;
                const roundColor = gamesData[activeGameNumber]?.color;
                const revealColor = roundColor || (appConfig.boardColor !== 'default' && appConfig.boardColor !== '#FFFFFF' ? appConfig.boardColor : '#10b981');
                
                ballContainer.innerHTML = `<div class="font-black flex justify-center items-center gap-x-2 sm:gap-x-4 w-64 h-64 sm:w-96 sm:h-96 rounded-full shadow-inner ball-fall-in" style="font-size: clamp(8rem, 40vw, 25rem); line-height: 1; background-color: ${revealColor}; color: ${finalColor}; -webkit-text-stroke: ${finalStroke}; text-shadow: none;"><span>${letter}</span><span>${drawnNumber}</span></div>`;
                
                cageEl.style.animationPlayState = 'paused';
                cageEl.style.opacity = '0.3';
                ballContainer.style.opacity = '1';
                skipBtn.style.display = 'none';
                closeBtn.style.display = 'block';

                closeBtn.onclick = () => {
                    DOMElements.spinningWheelModal.classList.add('hidden');
// FIX: Cast element to HTMLButtonElement to correctly access the 'disabled' property.
                    document.querySelectorAll('[data-label-key="autoDrawButton"]').forEach(btn => (btn as HTMLButtonElement).disabled = false);
                     showFloatingNumber(drawnNumber);
                };
            };
            
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            const drawnNumber = availableNumbers[randomIndex];

            spinTimeout = setTimeout(() => finishAnimation(drawnNumber), 4000);
            skipBtn.onclick = () => finishAnimation(drawnNumber);
        }
        
        function cancelAnnouncedNumber(number: number) {
            if (!activeGameNumber) return;
            const game = gamesData[activeGameNumber];
            const numberIndex = game.calledNumbers.indexOf(number);
            if (numberIndex === -1) return;
            game.calledNumbers.splice(numberIndex, 1);
            const cell = document.getElementById(`master-cell-${number}`) as HTMLElement;
            if (cell) {
                cell.classList.remove('bg-green-500', 'text-white', 'scale-125');
                cell.style.backgroundColor = ''; // Limpa a cor inline
                const activeRoundColor = gamesData[activeGameNumber]?.color;

                if (activeRoundColor) {
                    cell.style.backgroundColor = hexToRgba(activeRoundColor, 0.25);
                    cell.classList.add('text-slate-200');
                } else if (appConfig.boardColor !== 'default') {
                    cell.style.backgroundColor = appConfig.boardColor;
                    cell.classList.add(isLightColor(appConfig.boardColor) ? 'text-gray-900' : 'text-white');
                } else {
                    cell.classList.add('bg-gray-700', 'text-slate-300');
                    cell.classList.remove('text-gray-900');
                }
            }
            DOMElements.lastNumbersDisplay.innerHTML = '';
            const lastFive = game.calledNumbers.slice(-5).reverse();
            lastFive.forEach((num: number) => {
                const letter = getLetterForNumber(num);
                const numberEl = document.createElement('div');
                numberEl.className = 'bg-gray-700 text-slate-100 font-bold rounded-lg w-24 h-16 flex items-center justify-center text-3xl shadow-md';
                numberEl.textContent = `${letter}-${num}`;
                DOMElements.lastNumbersDisplay.appendChild(numberEl);
            });
            const lastCalledNumber = game.calledNumbers[game.calledNumbers.length - 1];
            if (lastCalledNumber) {
                const letter = getLetterForNumber(lastCalledNumber);
                const mainColor = appConfig.drawnTextColor;
                const strokeColor = appConfig.drawnTextStrokeColor;
                const strokeWidth = appConfig.drawnTextStrokeWidth;
                (DOMElements.currentNumberEl as HTMLElement).style.color = mainColor;
                (DOMElements.currentNumberEl as HTMLElement).style.webkitTextStroke = `${strokeWidth}px ${strokeColor}`;
                DOMElements.currentNumberEl.innerHTML = `<span>${letter}</span><span>${lastCalledNumber}</span>`;
                (DOMElements.currentNumberEl as HTMLElement).style.visibility = 'visible';
                DOMElements.currentNumberEl.classList.remove('animate-bounce-in');
                void (DOMElements.currentNumberEl as HTMLElement).offsetWidth; 
                DOMElements.currentNumberEl.classList.add('animate-bounce-in');
            } else {
                (DOMElements.currentNumberEl as HTMLElement).style.visibility = 'hidden';
            }
            saveStateToFirestore();
        }

        function startNewRound() {
            if (!activeGameNumber) {
                showAlert("Selecione uma rodada clicando em 'Jogar' primeiro.");
                return;
            }
            gamesData[activeGameNumber].calledNumbers = [];
            loadRoundState(activeGameNumber);
            saveStateToFirestore();
        }

        function loadRoundState(gameNumber: string) {
            activeGameNumber = gameNumber;
            const game = gamesData[gameNumber];
            
            if (DOMElements.currentRoundDisplay) DOMElements.currentRoundDisplay.textContent = `${appLabels.activeRoundIndicatorLabel} ${gameNumber}`;

            (DOMElements.currentNumberEl as HTMLElement).style.visibility = 'hidden';
            DOMElements.currentNumberEl.classList.remove('animate-bounce-in');
            DOMElements.errorMessageEl.textContent = '';
            DOMElements.lastNumbersDisplay.innerHTML = '';
            DOMElements.numberInput.value = '';
            DOMElements.letterInput.value = '';
            clearMasterBoard(true);
            game.calledNumbers.forEach((num: number) => updateMasterBoardCell(num));
            const lastFive = game.calledNumbers.slice(-5).reverse();
            lastFive.forEach((num: number) => {
                const letter = getLetterForNumber(num);
                updateLastNumbers(letter, num, false);
            });
            const lastNumber = game.calledNumbers[game.calledNumbers.length - 1];
            if (lastNumber) {
                const letter = getLetterForNumber(lastNumber);
                const mainColor = appConfig.drawnTextColor;
                const strokeColor = appConfig.drawnTextStrokeColor;
                const strokeWidth = appConfig.drawnTextStrokeWidth;
                (DOMElements.currentNumberEl as HTMLElement).style.color = mainColor;
                (DOMElements.currentNumberEl as HTMLElement).style.webkitTextStroke = `${strokeWidth}px ${strokeColor}`;

                DOMElements.currentNumberEl.innerHTML = `<span>${letter}</span><span>${lastNumber}</span>`;
                (DOMElements.currentNumberEl as HTMLElement).style.visibility = 'visible';
            }
        }

        function renderMasterBoard() {
            DOMElements.bingoBoardEl.innerHTML = '';
            const currentLetters = appConfig.bingoTitle === 'AJUDE' ? DYNAMIC_LETTERS_AJUDE : DYNAMIC_LETTERS;
            const scale = appConfig.boardScale / 100;
            const baseSize = 80; // 5rem
            const baseFontSize = 48; // 3rem
            const newSize = baseSize * scale;
            const newFontSize = baseFontSize * scale;

            currentLetters.forEach(letter => {
                const columnWrapper = document.createElement('div');
                columnWrapper.className = 'col-span-2 flex flex-col items-center';
                
                const headerEl = document.createElement('div');
                headerEl.className = 'font-black text-sky-400 mb-4';
                headerEl.textContent = letter;
                headerEl.style.fontSize = `${newFontSize * 1.2}px`;
                columnWrapper.appendChild(headerEl);

                const numbersGrid = document.createElement('div');
                numbersGrid.className = 'grid grid-cols-2 gap-2';

                let baseLetter = DYNAMIC_LETTERS[currentLetters.indexOf(letter)];
                const { min, max } = BINGO_CONFIG[baseLetter as keyof typeof BINGO_CONFIG];

                for (let i = min; i <= max; i++) {
                    const cell = document.createElement('div');
                    cell.id = `master-cell-${i}`;
                    cell.textContent = i.toString();
                    
                    let cellClasses = 'bingo-cell flex items-center justify-center font-black rounded-full transition-all duration-300';
                    if (appConfig.boardColor !== 'default') {
                        cell.style.backgroundColor = appConfig.boardColor;
                        cellClasses += isLightColor(appConfig.boardColor) ? ' text-gray-900' : ' text-white';
                    } else {
                        cellClasses += ' bg-gray-700 text-slate-300';
                    }
                    cell.className = cellClasses;
                    cell.style.width = `${newSize}px`;
                    cell.style.height = `${newSize}px`;
                    cell.style.fontSize = `${newFontSize}px`;

                    cell.addEventListener('click', () => {
                        if (!activeGameNumber) {
                            showAlert("Por favor, selecione uma rodada clicando em 'Jogar' para iniciar.");
                            return;
                        }
                        const game = gamesData[activeGameNumber];
                        if (game.calledNumbers.includes(i)) cancelAnnouncedNumber(i);
                        else showFloatingNumber(i);
                    });
                    numbersGrid.appendChild(cell);
                }
                columnWrapper.appendChild(numbersGrid);
                DOMElements.bingoBoardEl.appendChild(columnWrapper);
            });
        }
        
        function clearMasterBoard(applyCustomColor = false) {
            const activeRoundColor = (activeGameNumber && gamesData[activeGameNumber]?.color) ? gamesData[activeGameNumber].color : null;
            for (let i = 1; i <= 75; i++) {
                const cell = document.getElementById(`master-cell-${i}`) as HTMLElement;
                if (cell) {
                    cell.classList.remove('bg-green-500', 'text-white', 'scale-125', 'text-gray-900', 'text-slate-200');
                    cell.style.backgroundColor = '';
                    cell.style.transform = '';
                    // Re-apply base classes, except for color
                    cell.className = 'bingo-cell flex items-center justify-center font-black rounded-full transition-all duration-300';

                    if (applyCustomColor && activeRoundColor) {
                        cell.style.backgroundColor = hexToRgba(activeRoundColor, 0.25); // Cor da rodada translúcida
                        cell.classList.add('text-slate-200');
                    } else if (applyCustomColor && appConfig.boardColor !== 'default') {
                        cell.style.backgroundColor = appConfig.boardColor;
                        cell.classList.add(isLightColor(appConfig.boardColor) ? 'text-gray-900' : 'text-white');
                    } else {
                        cell.classList.add('bg-gray-700', 'text-slate-300');
                    }
                }
            }
        }

        function handleManualInput(event: Event) {
            event.preventDefault();
            const numValue = DOMElements.numberInput.value;
            if (!numValue) return;
            const number = parseInt(numValue, 10);
            const letterValue = DOMElements.letterInput.value.toUpperCase();
            if (letterValue && getLetterForNumber(number) !== letterValue) {
                showError('A letra não corresponde ao número.');
                return;
            }
            announceNumber(number);
        }
        
        function updateLastNumbers(letter: string, number: number, addToState: boolean) {
            if (addToState && activeGameNumber) {
                gamesData[activeGameNumber].calledNumbers.push(number);
                gamesData[activeGameNumber].calledNumbers.sort((a: number, b: number) => a - b);
            }
            const numberEl = document.createElement('div');
            numberEl.className = 'bg-gray-700 text-slate-100 font-bold rounded-lg w-24 h-16 flex items-center justify-center text-3xl shadow-md';
            numberEl.textContent = `${letter}-${number}`;
            DOMElements.lastNumbersDisplay.prepend(numberEl);
            if (DOMElements.lastNumbersDisplay.children.length > 5) {
                DOMElements.lastNumbersDisplay.lastChild.remove();
            }
        }

        function getLetterForNumber(number: number) {
            for (const letter of DYNAMIC_LETTERS) {
                const baseLetter = DYNAMIC_LETTERS[DYNAMIC_LETTERS.indexOf(letter)];
                if (number >= BINGO_CONFIG[baseLetter as keyof typeof BINGO_CONFIG].min && number <= BINGO_CONFIG[baseLetter as keyof typeof BINGO_CONFIG].max) {
                    return appConfig.bingoTitle === 'AJUDE' ? DYNAMIC_LETTERS_AJUDE[DYNAMIC_LETTERS.indexOf(letter)] : letter;
                }
            }
            return null;
        }

        function updateMasterBoardCell(number: number) {
            const cell = document.getElementById(`master-cell-${number}`) as HTMLElement;
            if (cell) {
                const roundColor = gamesData[activeGameNumber]?.color;
                cell.classList.remove('bg-gray-700', 'text-slate-300', 'text-gray-900', 'bg-green-500', 'text-white', 'text-slate-200');
                cell.style.backgroundColor = '';
                cell.style.transform = 'scale(1.15)';

                if (roundColor) {
                    cell.style.backgroundColor = roundColor;
                    cell.classList.add(isLightColor(roundColor) ? 'text-gray-900' : 'text-white');
                } else {
                    cell.classList.add('bg-green-500', 'text-white');
                }
            }
        }

        function showError(message: string) {
            DOMElements.errorMessageEl.textContent = message;
            setTimeout(() => { DOMElements.errorMessageEl.textContent = ''; }, 3000);
        }

        function showAlert(message: string) {
            DOMElements.customAlertModal.innerHTML = getModalTemplates().alert;
            document.getElementById('custom-alert-message').textContent = message;
            DOMElements.customAlertModal.classList.remove('hidden');
            document.getElementById('custom-alert-close-btn').addEventListener('click', () => DOMElements.customAlertModal.classList.add('hidden'));
        }

        function showVerificationModal() {
            if (!activeGameNumber) {
                showAlert("Nenhuma rodada ativa para verificar.");
                return;
            }
             if (gamesData[activeGameNumber].calledNumbers.length === 0) {
                showAlert("Nenhum número foi sorteado nesta rodada para verificar.");
                return;
            }
            const gameItem = DOMElements.gamesListEl.querySelector(`.game-item[data-game-number="${activeGameNumber}"]`);
            if(gameItem) {
                gameItem.querySelectorAll('.prize-input').forEach(input => {
// FIX: Cast element to HTMLElement to access dataset and innerText properties.
                    gamesData[activeGameNumber].prizes[(input as HTMLElement).dataset.type] = (input as HTMLElement).innerText.trim();
                });
            }

            DOMElements.verificationModal.innerHTML = getModalTemplates().verification;
            const verificationNumbersContainer = document.getElementById('verification-numbers');
            const zoomSlider = document.getElementById('verification-zoom-slider') as HTMLInputElement;
// FIX: Cast element to HTMLButtonElement to correctly access the 'disabled' property.
            const confirmPrize1Btn = document.getElementById('confirm-prize1-btn') as HTMLButtonElement;
// FIX: Cast element to HTMLButtonElement to correctly access the 'disabled' property.
            const confirmPrize2Btn = document.getElementById('confirm-prize2-btn') as HTMLButtonElement;
// FIX: Cast element to HTMLButtonElement to correctly access the 'disabled' property.
            const confirmPrize3Btn = document.getElementById('confirm-prize3-btn') as HTMLButtonElement;
            document.getElementById('reject-bingo-btn').addEventListener('click', handleRejectBingo);
            const prizes = gamesData[activeGameNumber].prizes;
            confirmPrize1Btn.disabled = !prizes.prize1;
            confirmPrize2Btn.disabled = !prizes.prize2;
            confirmPrize3Btn.disabled = !prizes.prize3;

            const renderVerificationNumbers = (scale: number) => {
                verificationNumbersContainer.innerHTML = '';
                const baseWidth = 200;
                const baseHeight = 176; // 11rem
                const baseFontSize = 80; // 5rem
                const newWidth = baseWidth * (scale / 100);
                const newHeight = baseHeight * (scale / 100);
                const newFontSize = baseFontSize * (scale / 100);

                gamesData[activeGameNumber].calledNumbers.forEach((n: number) => {
                    const letter = getLetterForNumber(n);
                    const numberEl = document.createElement('div');
                    numberEl.className = 'verification-cell bg-gray-700 text-white font-black rounded-lg flex items-center justify-center shadow-md cursor-pointer transition-colors duration-200';
                    numberEl.textContent = `${letter} - ${n}`;
                    numberEl.style.width = `${newWidth}px`;
                    numberEl.style.height = `${newHeight}px`;
                    numberEl.style.fontSize = `${newFontSize}px`;
                     numberEl.addEventListener('click', () => {
                        numberEl.classList.toggle('bg-green-500');
                        numberEl.classList.toggle('bg-gray-700');
                    });
                    verificationNumbersContainer.appendChild(numberEl);
                });
            };
            
            if (zoomSlider) {
                const initialZoom = appConfig.verificationPanelZoom || 100;
                zoomSlider.value = initialZoom.toString();
                renderVerificationNumbers(initialZoom);
                zoomSlider.addEventListener('input', (e) => {
// FIX: Cast event target to HTMLInputElement to access 'value' property.
                    const scale = parseInt((e.target as HTMLInputElement).value, 10);
                    renderVerificationNumbers(scale);
                    appConfig.verificationPanelZoom = scale;
                    debouncedSave();
                });
            }
            
            const setupConfirmationListener = (button: HTMLElement, type: string) => { button.addEventListener('click', () => { currentBingoType = type; showWinnerModal(); }); };
            setupConfirmationListener(confirmPrize1Btn, 'prize1');
            setupConfirmationListener(confirmPrize2Btn, 'prize2');
            setupConfirmationListener(confirmPrize3Btn, 'prize3');
            DOMElements.verificationModal.classList.remove('hidden');
            startConfetti();
        }
        
        function handleRejectBingo() {
            document.getElementById('verification-modal-content').classList.add('animate-shake-error');
            setTimeout(() => {
                DOMElements.verificationModal.classList.add('hidden');
            }, 800);
            stopConfetti();
        }

        function handleWinnerRegistration() {
// FIX: Cast element to HTMLInputElement to access 'value' property.
            const winnerNameInput = document.getElementById('winner-name-input') as HTMLInputElement;
            stopConfetti();
            const winnerName = winnerNameInput.value.trim();
            if (!winnerName) {
                showAlert("Por favor, preencha o nome do ganhador.");
                return;
            }
            const prizeValue = gamesData[activeGameNumber].prizes[currentBingoType] || "Prêmio não especificado";
            const originalActiveGame = activeGameNumber;
            
            gamesData[activeGameNumber].winners = gamesData[activeGameNumber].winners.filter((w: any) => w.bingoType !== currentBingoType);
            const winnerData = {
                id: Date.now(),
                name: winnerName,
                prize: prizeValue,
                gameNumber: activeGameNumber,
                bingoType: currentBingoType,
                numbers: [...gamesData[activeGameNumber].calledNumbers]
            };
            gamesData[activeGameNumber].winners.push(winnerData);
            
            renderAllWinners();
            hideWinnerModal();
            DOMElements.shareBtn.classList.remove('hidden');
            DOMElements.endEventBtn.classList.remove('hidden');
            
            const prizes = gamesData[activeGameNumber].prizes;
            const allPrizesEmpty = !prizes.prize1 && !prizes.prize2 && !prizes.prize3;
            const prizeLabel = appLabels[(currentBingoType + 'Label') as keyof typeof appLabels];
            const prize2Label = appLabels.prize2Label;
            const prize3Label = appLabels.prize3Label;

            const isGame1Or3 = originalActiveGame === '1' || originalActiveGame === '3';
            const isJustPrize1 = !prizes.prize2 && !prizes.prize3;

            if (prizeLabel === prize2Label || prizeLabel === prize3Label || allPrizesEmpty || (isGame1Or3 && isJustPrize1)) {
                 gamesData[activeGameNumber].isComplete = true;
            }

            saveStateToFirestore();
            renderUIFromState();
            showCongratsModal(winnerName, prizeValue);
        }
        
        function updateGameItemUI(gameItem: HTMLElement, isComplete: boolean) {
            const playBtn = gameItem.querySelector('.play-btn');
            gameItem.classList.remove('active-round-highlight', 'animate-flash-complete');

            if (isComplete) {
                gameItem.classList.add('game-completed-style'); 
                playBtn.textContent = 'Jogado';
                playBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
                playBtn.classList.add('bg-gray-500', 'hover:bg-gray-600');
            } else {
                gameItem.classList.remove('game-completed-style'); 
                playBtn.textContent = 'Jogar';
                playBtn.classList.remove('bg-gray-500', 'hover:bg-gray-600');
                playBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
            }
            
            const winners = gamesData[gameItem.dataset.gameNumber]?.winners || [];
            
            ['prize1', 'prize2', 'prize3'].forEach(type => {
                const prizeElement = gameItem.querySelector(`.prize-input[data-type="${type}"]`) as HTMLElement;
                if (prizeElement) {
                    const prizeValue = prizeElement.innerText.trim();
                    const hasWinner = winners.some((w: any) => w.bingoType === type);
                    let iconHtml = (prizeValue && hasWinner) ? ' <span class="text-yellow-400">🏆</span>' : '';
                    prizeElement.innerHTML = prizeValue + iconHtml;
                }
            });
        }

        function renderAllWinners() {
            DOMElements.winnersContainer.innerHTML = '';
// FIX: Safely access 'winners' property by casting 'game' to 'any' and providing a fallback empty array.
            const allWinners = Object.values(gamesData).flatMap(game => (game as any).winners || []).reverse();
            allWinners.forEach(winner => renderWinnerCard(winner));
        }

        function renderWinnerCard(data: any) {
            const cardWrapper = document.createElement('div');
            cardWrapper.className = 'winner-card bg-gray-700 p-3 rounded-lg shadow-md transition-transform hover:scale-105';
            cardWrapper.dataset.winnerId = data.id;
            
            let nameAndCardHtml, prizeHtml, detailsHtml;

            switch (data.bingoType) {
                case 'Sorteio':
                    nameAndCardHtml = `<h3 class="text-lg font-bold text-amber-400 pointer-events-none">${data.name || 'Ganhador não informado'}</h3>
                                       <p class="text-slate-300 pointer-events-none"><strong>Cartela:</strong> ${data.cartela}</p>`;
                    prizeHtml = `<p class="text-slate-300 mt-1 pointer-events-none"><strong>🎁 Brinde:</strong> ${data.prize}</p>`;
                    detailsHtml = '';
                    break;
                case 'Leilão':
                    nameAndCardHtml = `<h3 class="text-lg font-bold text-amber-400 pointer-events-none">${data.name || 'Arrematador'}</h3>
                                       <p class="text-slate-300 pointer-events-none"><strong>Item:</strong> ${data.itemName}</p>`;
                    prizeHtml = `<p class="text-slate-300 mt-1 pointer-events-none"><strong>🔨 Lance:</strong> R$ ${data.bid}</p>`;
                    detailsHtml = '';
                    break;
                default: // Rodadas de Bingo
                    const prizeLabel = appLabels[(data.bingoType + 'Label') as keyof typeof appLabels] || data.bingoType;
                    nameAndCardHtml = `<h3 class="text-lg font-bold text-amber-400 pointer-events-none">${data.name || 'Ganhador não informado'}</h3>
                                       <p class="text-slate-300 pointer-events-none"><strong>Rodada:</strong> ${data.gameNumber} (${prizeLabel})</p>`;
                    prizeHtml = `<p class="text-slate-300 mt-1 pointer-events-none"><strong>Prêmio:</strong> ${data.prize}</p>`;
                    detailsHtml = data.numbers ? `<details class="pointer-events-auto"><summary class="text-sm cursor-pointer text-slate-400">Ver números (${data.numbers.length})</summary><p class="text-xs text-slate-400 break-words mt-1">${data.numbers.map((n: number) => `<span class="font-bold">${getLetterForNumber(n)}-${n}</span>`).join(', ')}</p></details>` : '';
                    break;
            }
            
            cardWrapper.innerHTML = `${nameAndCardHtml}${prizeHtml}${detailsHtml}`;
            cardWrapper.addEventListener('click', (e) => {
// FIX: Cast event target to Element to access tagName property.
                if ((e.target as Element).tagName !== 'SUMMARY' && (e.target as Element).tagName !== 'P' && (e.target as Element).tagName !== 'SPAN') {
                    showWinnerEditModal(data.id);
                }
            });
            DOMElements.winnersContainer.appendChild(cardWrapper);
        }

        function generateProofDocument(selectedKeys: string[]) {
            const proofWindow = window.open('', '_blank');
// FIX: Safely access 'winners' property by casting 'game' to 'any'.
            const allWinners = Object.values(gamesData).flatMap(game => (game as any).winners);
            const filteredWinners = allWinners.filter(winner => {
                const gameKey = winner.bingoType === 'Sorteio' ? 'Brindes' : winner.bingoType === 'Leilão' ? 'Leilão' : `${winner.gameNumber}`;
                return selectedKeys.includes(gameKey);
            });
            const now = new Date();
            const timestamp = now.toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'medium' });
            let htmlContent = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Prova de Resultados - ${appLabels.mainTitle}</title><style>body{font-family:Arial,sans-serif;margin:2rem;font-size:14pt;}h1,h2,h3{margin:0;padding:0;}#proof-title{text-align:center;margin-bottom:1rem;}#proof-title h1{font-size:2.8rem;color:#333;}#proof-title h2{font-size:2rem;color:#555;}.timestamp{text-align:center;font-size:1.2rem;color:#666;margin-bottom:2rem;}.winner-section{border:2px solid #ccc;padding:1.5rem;margin-bottom:1.5rem;page-break-inside:avoid;border-radius:8px;}.winner-section h3{font-size:1.8rem;color:#000;margin-bottom:0.5rem;}.winner-section p{font-size:1.3rem;margin:0.2rem 0;}.numbers-list{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem;}.number-ball{background-color:#eee;border:1px solid #ddd;border-radius:50%;width:45px;height:45px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;}.signature-section{margin-top:5rem;text-align:center;page-break-inside:avoid;}.signature-line{border-bottom:2px solid #333;width:300px;margin:0 auto;}.signature-label{margin-top:0.5rem;font-size:1.2rem;}.print-btn{display:block;margin:2rem auto;padding:.8rem 2rem;font-size:1.2rem;cursor:pointer;}@media print{.no-print{display:none}}</style></head><body><div id="proof-title">${DOMElements.mainTitle.innerHTML.replace(/<span/g, '<h2').replace(/<\/span/g, '</h2>').replace(/div/g, 'h1')}</div><p class="timestamp">Documento gerado em: ${timestamp}</p><button class="no-print print-btn" onclick="window.print()">Imprimir Prova</button><button class="no-print print-btn" onclick="window.close()">Voltar ao Aplicativo</button><hr>`;
            
            filteredWinners.forEach((winner) => {
                let title, cardHtml, prizeHtml, numbersSection;
                switch(winner.bingoType) {
                    case 'Sorteio':
                        title = `🎁 Ganhador de Brinde: ${winner.name || 'Ganhador'}`;
                        cardHtml = `<p><strong>Cartela:</strong> ${winner.cartela}</p>`;
                        prizeHtml = `<p><strong>Prêmio:</strong> ${winner.prize}</p>`;
                        numbersSection = '';
                        break;
                    case 'Leilão':
                         title = `🔨 Venda em Leilão: ${winner.name || 'Arrematador'}`;
                        cardHtml = `<p><strong>Item:</strong> ${winner.itemName}</p>`;
                        prizeHtml = `<p><strong>Lance Final:</strong> R$ ${winner.bid}</p>`;
                        numbersSection = '';
                        break;
                    default:
                        const prizeLabel = appLabels[(winner.bingoType + 'Label') as keyof typeof appLabels] || winner.bingoType;
                        title = `🏆 Ganhador da Rodada ${winner.gameNumber} (${prizeLabel}): ${winner.name || 'Ganhador'}`;
                        cardHtml = '';
                        prizeHtml = `<p><strong>Prêmio:</strong> ${winner.prize}</p>`;
                        numbersSection = winner.numbers ? `<p><strong>🔢 Números Sorteados (${winner.numbers.length}):</strong></p><div class="numbers-list">${winner.numbers.map((n: number) => `<span class="number-ball">${getLetterForNumber(n)}-${n}</span>`).join('')}</div>` : '';
                        break;
                }
                htmlContent += `<div class="winner-section"><h3>${title}</h3>${cardHtml}${prizeHtml}${numbersSection}</div>`;
            });

            htmlContent += `<div class="signature-section"><div class="signature-line"></div><p class="signature-label">Assinatura do Organizador</p><p>Declaro que os resultados apresentados neste documento são verdadeiros e corretos.</p></div></body></html>`;
            proofWindow.document.write(htmlContent);
            proofWindow.document.close();
        }

        function showWinnerModal() {
            stopConfetti(); 
            if (!activeGameNumber) {
                showError("Selecione uma rodada clicando em 'Jogar' antes.");
                return;
            }
            DOMElements.winnerModal.innerHTML = getModalTemplates().winner;
            document.getElementById('winner-title-display').textContent = appConfig.bingoTitle + '!';
            const prizeLabel = appLabels[(currentBingoType + 'Label') as keyof typeof appLabels];
            document.getElementById('game-text-winner').textContent = `Rodada ${activeGameNumber} - ${prizeLabel}`;
            document.getElementById('prize-text-winner').textContent = gamesData[activeGameNumber].prizes[currentBingoType] || 'Prêmio não definido';
            document.getElementById('register-winner-btn').addEventListener('click', handleWinnerRegistration);
            DOMElements.winnerModal.classList.remove('hidden');
        }

        function hideWinnerModal() {
            DOMElements.winnerModal.classList.add('hidden');
        }
        
        function showCongratsModal(winnerName: string, prizeValue: string, cartelaNumber = null) {
            DOMElements.congratsModal.innerHTML = getModalTemplates().congrats;
            document.getElementById('congrats-winner-name').innerHTML = cartelaNumber ? `Cartela: ${cartelaNumber} - ${winnerName}` : winnerName;
            document.getElementById('congrats-prize-value').innerHTML = `${appLabels.congratsModalPrizeLabel} ${prizeValue}`;
            document.getElementById('close-congrats-modal-btn').addEventListener('click', () => { DOMElements.congratsModal.classList.add('hidden'); stopConfetti(); });
            DOMElements.congratsModal.classList.remove('hidden');
            startConfetti();
            setTimeout(stopConfetti, 5000);
        }

        function createGameElement(gameNumber: number, prizes: any = {}) {
            const gameWrapper = document.createElement('div');
            const color = gamesData[gameNumber].color || '#4b5563';
            gameWrapper.className = 'game-item flex flex-col gap-2 p-3 rounded-lg';
            gameWrapper.style.backgroundColor = color;
            gameWrapper.dataset.gameNumber = gameNumber.toString();

            const header = document.createElement('div');
            header.className = 'flex items-center justify-between w-full';
            
            const leftGroup = document.createElement('div');
            leftGroup.className = 'flex items-center gap-2';
            const colorPicker = document.createElement('input');
            colorPicker.type = 'color';
            colorPicker.value = color;
            const gameLabel = document.createElement('span');
            gameLabel.className = 'font-bold text-lg text-slate-100';
            gameLabel.textContent = `Rodada ${gameNumber}`;
            leftGroup.appendChild(colorPicker);
            leftGroup.appendChild(gameLabel);

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'flex items-center gap-2';
            const playBtn = document.createElement('button');
            playBtn.className = 'play-btn bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1 rounded text-sm';
            playBtn.textContent = 'Jogar';
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/></svg>`;
            deleteBtn.className = 'delete-btn bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded';
            
            buttonGroup.appendChild(playBtn);
            buttonGroup.appendChild(deleteBtn);
            header.appendChild(leftGroup);
            header.appendChild(buttonGroup);

            const prizesContainer = document.createElement('div');
            prizesContainer.className = 'w-full space-y-1 text-sm';
            const createPrizeInput = (prizeKey: string, value: string) => {
                const prizeWrapper = document.createElement('div');
                prizeWrapper.className = 'flex items-center gap-1';
                const prizeLabelEl = document.createElement('span');
                prizeLabelEl.className = 'prize-input-label text-slate-300 w-20 text-right';
                prizeLabelEl.textContent = `${appLabels[(prizeKey + 'Label') as keyof typeof appLabels]}:`;
                const prizeInput = document.createElement('div');
                prizeInput.className = `prize-input flex-grow text-white bg-black bg-opacity-20 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500`;
// FIX: Set contentEditable property to a string value "true".
                prizeInput.contentEditable = "true";
                prizeInput.dataset.type = prizeKey;
                prizeInput.innerText = value;
                prizeInput.addEventListener('input', () => {
                    const gameNum = parseInt((gameWrapper as HTMLElement).dataset.gameNumber, 10);
// FIX: Safely access 'prizes' property by casting to 'any'.
                    if (!(gamesData[gameNum] as any).prizes) (gamesData[gameNum] as any).prizes = {};
                    (gamesData[gameNum] as any).prizes[(prizeInput as HTMLElement).dataset.type] = prizeInput.innerText.trim();
                    debouncedSave();
                });
                prizeWrapper.appendChild(prizeLabelEl);
                prizeWrapper.appendChild(prizeInput);
                return prizeWrapper;
            };
            prizesContainer.appendChild(createPrizeInput('prize1', prizes.prize1 || ''));
            prizesContainer.appendChild(createPrizeInput('prize2', prizes.prize2 || ''));
            prizesContainer.appendChild(createPrizeInput('prize3', prizes.prize3 || ''));

            colorPicker.addEventListener('input', (e) => {
// FIX: Cast event target to HTMLInputElement to access 'value' property.
                const newColor = (e.target as HTMLInputElement).value;
                gameWrapper.style.backgroundColor = newColor;
                gamesData[gameNumber].color = newColor;
                if (activeGameNumber === gameNumber) {
                    loadRoundState(gameNumber.toString()); // Recarrega o estado para aplicar a cor no painel
                }
                debouncedSave();
            });

            playBtn.addEventListener('click', () => {
                const currentActiveGameNumber = activeGameNumber;
                document.querySelectorAll('.game-item').forEach(el => el.classList.remove('active-round-highlight'));
                document.querySelectorAll('.play-btn').forEach(btn => { if(btn.textContent === 'Jogando...') btn.textContent = 'Jogar'; });
                if (currentActiveGameNumber && currentActiveGameNumber !== gameNumber) {
                    const oldGameData = gamesData[currentActiveGameNumber];
                    const oldGameItem = DOMElements.gamesListEl.querySelector(`.game-item[data-game-number="${currentActiveGameNumber}"]`) as HTMLElement;
                    if (oldGameItem && !oldGameData.isComplete) {
                        updateGameItemUI(oldGameItem, false);
                    }
                }
                gameWrapper.classList.add('active-round-highlight');
                playBtn.textContent = 'Jogando...';
                if (gamesData[gameNumber].isComplete) {
                    updateGameItemUI(gameWrapper, false); 
                    gamesData[gameNumber].isComplete = false;
                }
                prizesContainer.querySelectorAll('.prize-input').forEach(input => {
// FIX: Cast element to HTMLElement to access dataset and innerText properties.
                    (gamesData[gameNumber] as any).prizes[(input as HTMLElement).dataset.type] = (input as HTMLElement).innerText.trim();
                });
                loadRoundState(gameNumber.toString());
                saveStateToFirestore();
            });

            deleteBtn.addEventListener('click', (e) => { e.stopPropagation(); showDeleteConfirmModal(gameNumber.toString()); });
            gameWrapper.appendChild(header);
            gameWrapper.appendChild(prizesContainer);
            return gameWrapper;
        }
        
        function handlePrizeDraw(event: Event) {
            event.preventDefault();
// FIX: Cast element to HTMLInputElement to access 'value' property.
            const ticket = (document.getElementById('prize-draw-number-manual') as HTMLInputElement).value.trim();
// FIX: Cast element to HTMLInputElement to access 'value' property.
            let description = (document.getElementById('prize-draw-description') as HTMLInputElement).value.trim();
// FIX: Cast element to HTMLInputElement to access 'value' property.
            const name = (document.getElementById('prize-draw-name') as HTMLInputElement).value.trim() || `Ganhador da Cartela ${ticket}`;
            if (!ticket) { showAlert("Por favor, preencha o número da cartela."); return; }
            if (!description) description = "Brinde";
            const ticketNumber = parseInt(ticket, 10);

            if (drawnPrizeNumbers.includes(ticketNumber)) {
// FIX: Safely access 'winners' property with a fallback to avoid errors.
                const existingWinner = (gamesData['Brindes']?.winners || []).find((w: any) => parseInt(w.cartela, 10) === ticketNumber);
                if (existingWinner) {
                    showAlert(`A cartela ${ticketNumber} já foi registrada para ${existingWinner.name}. Por favor, remova o vencedor se quiser registrar novamente.`);
                    return;
                }
            } else if (DOMElements.noRepeatPrizeDrawCheckbox.checked) {
                drawnPrizeNumbers.push(ticketNumber);
            }

            if (!gamesData['Brindes']) gamesData['Brindes'] = { winners: [] };
            gamesData['Brindes'].winners.push({ id: Date.now(), name: name, prize: description, gameNumber: 'Brinde', bingoType: 'Sorteio', cartela: ticket });
            renderAllWinners();
            DOMElements.shareBtn.classList.remove('hidden');
            DOMElements.endEventBtn.classList.remove('hidden');
            showCongratsModal(name, description, ticket);
// FIX: Cast element to HTMLInputElement to access 'value' property.
            (document.getElementById('prize-draw-number-manual') as HTMLInputElement).value = '';
// FIX: Cast element to HTMLInputElement to access 'value' property.
            (document.getElementById('prize-draw-description') as HTMLInputElement).value = '';
// FIX: Cast element to HTMLInputElement to access 'value' property.
            (document.getElementById('prize-draw-name') as HTMLInputElement).value = '';
            saveStateToFirestore();
        }
        
        function handleRandomPrizeDraw() {
// FIX: Cast element to HTMLInputElement to access 'value' property.
            const min = parseInt((document.getElementById('prize-draw-min') as HTMLInputElement).value, 10) || 1;
// FIX: Cast element to HTMLInputElement to access 'value' property.
            const max = parseInt((document.getElementById('prize-draw-max') as HTMLInputElement).value, 10) || 500;
            const allPossibleNumbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);
            const availableNumbers = allPossibleNumbers.filter(num => !drawnPrizeNumbers.includes(num));

            if (DOMElements.noRepeatPrizeDrawCheckbox.checked && availableNumbers.length === 0) {
                showAlert("Todos os números nesta faixa já foram sorteados.");
                return;
            }
            
            const randomNumber = DOMElements.noRepeatPrizeDrawCheckbox.checked 
                ? availableNumbers[Math.floor(Math.random() * availableNumbers.length)]
                : Math.floor(Math.random() * (max - min + 1)) + min;
            
            if (DOMElements.noRepeatPrizeDrawCheckbox.checked && !drawnPrizeNumbers.includes(randomNumber)) {
                drawnPrizeNumbers.push(randomNumber);
                saveStateToFirestore();
            }

            DOMElements.mainDisplayLabel.textContent = "Sorteando Brinde...";
            const currentNumberEl = DOMElements.currentNumberEl as HTMLElement;
            currentNumberEl.style.visibility = 'visible';
            currentNumberEl.classList.remove('w-64', 'h-64', 'sm:w-[420px]', 'sm:h-[420px]', 'rounded-full', 'bg-slate-50', 'text-gray-800', 'text-gray-900');
            currentNumberEl.classList.add('w-11/12', 'max-w-lg', 'py-8', 'rounded-lg', 'bg-white', 'text-white');
            currentNumberEl.style.backgroundColor = '#9333ea';
            currentNumberEl.innerHTML = '';

            let intervalId = setInterval(() => {
// FIX: Convert number to string for textContent property.
                currentNumberEl.textContent = (Math.floor(Math.random() * (max - min + 1)) + min).toString();
            }, 50);

            setTimeout(() => {
                clearInterval(intervalId);
                DOMElements.mainDisplayLabel.textContent = "Cartela Sorteada";
// FIX: Convert number to string for textContent property.
                currentNumberEl.textContent = randomNumber.toString();
                currentNumberEl.classList.remove('animate-bounce-in');
                void currentNumberEl.offsetWidth;
                currentNumberEl.classList.add('animate-bounce-in');
                currentNumberEl.style.backgroundColor = 'white';
                currentNumberEl.classList.add('text-gray-900');
                currentNumberEl.classList.remove('text-white');
                currentNumberEl.style.webkitTextStroke = 'none';
// FIX: Convert number to string for input value property.
                (document.getElementById('prize-draw-number-manual') as HTMLInputElement).value = randomNumber.toString();
                startConfetti();
                setTimeout(stopConfetti, 4000);
            }, 3000);
        }
        
        function showWinnerEditModal(winnerId: number) {
            DOMElements.winnerEditModal.innerHTML = getModalTemplates().winnerEdit;
            document.getElementById('save-winner-changes-btn').addEventListener('click', () => saveWinnerChanges(winnerId));
            document.getElementById('cancel-winner-edit-btn').addEventListener('click', hideWinnerEditModal);
            document.getElementById('remove-winner-btn').addEventListener('click', () => removeWinner(winnerId));
// FIX: Safely access 'winners' property by casting 'game' to 'any' and providing a fallback empty array.
            const winner = Object.values(gamesData).flatMap(game => (game as any).winners || []).find((w: any) => w.id === winnerId);
            if (!winner) return;
// FIX: Cast element to HTMLInputElement to access 'value' property.
            (document.getElementById('edit-winner-name') as HTMLInputElement).value = winner.name;
// FIX: Cast element to HTMLInputElement to access 'value' property.
            (document.getElementById('edit-winner-prize') as HTMLInputElement).value = winner.prize;
            DOMElements.winnerEditModal.classList.remove('hidden');
        }

        function hideWinnerEditModal() { DOMElements.winnerEditModal.classList.add('hidden'); }

        function saveWinnerChanges(winnerId: number) {
// FIX: Cast element to HTMLInputElement to access 'value' property.
            const newName = (document.getElementById('edit-winner-name') as HTMLInputElement).value.trim();
// FIX: Cast element to HTMLInputElement to access 'value' property.
            const newPrize = (document.getElementById('edit-winner-prize') as HTMLInputElement).value.trim();
            if (!newName || !newPrize) { showAlert("Nome e prêmio não podem estar vazios."); return; }
            for (const gameNumber in gamesData) {
                const winnerIndex = (gamesData[gameNumber] as any).winners.findIndex((w: any) => w.id === winnerId);
                if (winnerIndex > -1) {
                    (gamesData[gameNumber] as any).winners[winnerIndex].name = newName;
                    (gamesData[gameNumber] as any).winners[winnerIndex].prize = newPrize;
                    break;
                }
            }
            renderAllWinners();
            hideWinnerEditModal();
            saveStateToFirestore();
        }

        function removeWinner(winnerId: number) {
            for (const gameNumber in gamesData) {
                const winnerData = (gamesData[gameNumber] as any).winners.find((w: any) => w.id === winnerId);
                if (winnerData && winnerData.bingoType === 'Sorteio') {
                    const ticketNumber = parseInt(winnerData.cartela, 10);
                    const index = drawnPrizeNumbers.indexOf(ticketNumber);
                    if (index > -1) drawnPrizeNumbers.splice(index, 1);
                }
                (gamesData[gameNumber] as any).winners = (gamesData[gameNumber] as any).winners.filter((w: any) => w.id !== winnerId);
            }
            renderAllWinners();
            hideWinnerEditModal();
            saveStateToFirestore();
        }

        function showDeleteConfirmModal(gameNumber: string) {
            DOMElements.deleteConfirmModal.innerHTML = getModalTemplates().deleteConfirm;
            document.getElementById('delete-confirm-message').textContent = `Tem certeza que deseja excluir a Rodada ${gameNumber}? Esta ação não pode ser desfeita.`;
            document.getElementById('confirm-delete-btn').onclick = () => handleDeleteRound(gameNumber);
            document.getElementById('cancel-delete-btn').onclick = () => DOMElements.deleteConfirmModal.classList.add('hidden');
            DOMElements.deleteConfirmModal.classList.remove('hidden');
        }
        
        function showClearRoundConfirmModal() {
            if (!activeGameNumber) {
                showAlert("Nenhuma rodada ativa para limpar.");
                return;
            }
            DOMElements.clearRoundConfirmModal.innerHTML = getModalTemplates().clearRoundConfirm;
            DOMElements.clearRoundConfirmModal.classList.remove('hidden');
            document.getElementById('confirm-clear-round-btn').addEventListener('click', () => {
                startNewRound();
                DOMElements.clearRoundConfirmModal.classList.add('hidden');
            });
            document.getElementById('cancel-clear-round-btn').addEventListener('click', () => {
                DOMElements.clearRoundConfirmModal.classList.add('hidden');
            });
        }

        function handleDeleteRound(gameNumberToDelete: string) {
            if (activeGameNumber === gameNumberToDelete) {
                activeGameNumber = null;
                (DOMElements.currentNumberEl as HTMLElement).style.visibility = 'hidden';
                DOMElements.lastNumbersDisplay.innerHTML = '';
                clearMasterBoard(true);
                if (DOMElements.currentRoundDisplay) DOMElements.currentRoundDisplay.textContent = appLabels.activeRoundIndicatorDefault;
            }
            delete gamesData[gameNumberToDelete];
            const gameItem = DOMElements.gamesListEl.querySelector(`.game-item[data-game-number="${gameNumberToDelete}"]`);
            if (gameItem) gameItem.remove();
            DOMElements.deleteConfirmModal.classList.add('hidden');
            saveStateToFirestore();
        }

        function showProofOptionsModal() {
            DOMElements.proofOptionsModal.innerHTML = getModalTemplates().proofOptions;
            const optionsList = document.getElementById('proof-options-list');
            optionsList.innerHTML = '';
            const gameKeys = Object.keys(gamesData).filter(key => gamesData[key].winners && gamesData[key].winners.length > 0);
            if(gameKeys.length === 0){ showAlert("Nenhum vencedor foi registrado ainda para gerar uma prova."); return; }
            
            const keyOrder = ['Leilão', 'Brindes', ...Object.keys(gamesData).filter(k => !isNaN(parseInt(k))).sort((a, b) => parseInt(a) - parseInt(b))];

            keyOrder.forEach(key => {
                if (gameKeys.includes(key)) {
                    let labelText;
                    if(key === 'Brindes') labelText = 'Sorteio de Brindes';
                    else if (key === 'Leilão') labelText = 'Itens de Leilão';
                    else labelText = `Rodada ${key}`;
                    optionsList.innerHTML += `<div class="flex items-center"><input id="proof-${key}" type="checkbox" value="${key}" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked><label for="proof-${key}" class="ml-3 block text-sm font-medium text-slate-300">${labelText}</label></div>`;
                }
            });

            document.getElementById('generate-selected-proof-btn').addEventListener('click', () => {
                const selectedKeys = Array.from((optionsList.querySelectorAll('input:checked') as NodeListOf<HTMLInputElement>)).map(cb => cb.value);
                generateProofDocument(selectedKeys);
                DOMElements.proofOptionsModal.classList.add('hidden');
            });
            document.getElementById('cancel-proof-btn').addEventListener('click', () => DOMElements.proofOptionsModal.classList.add('hidden'));
            DOMElements.proofOptionsModal.classList.remove('hidden');
        }
        
        function removeDrawnPrizeNumber(numberToRemove: number) {
            const index = drawnPrizeNumbers.indexOf(numberToRemove);
            if (index > -1) {
                drawnPrizeNumbers.splice(index, 1);
                if (gamesData['Brindes']) {
                     (gamesData['Brindes'] as any).winners = (gamesData['Brindes'] as any).winners.filter((w: any) => parseInt(w.cartela, 10) !== numberToRemove);
                }
                renderAllWinners();
                saveStateToFirestore();
                showAlert(`Cartela ${numberToRemove} removida da lista de sorteados. Ela pode ser sorteada novamente.`);
            }
            showDrawnPrizesModal();
        }

         function showDrawnPrizesModal() {
            DOMElements.drawnPrizesModal.innerHTML = getModalTemplates().drawnPrizes;
            const listEl = document.getElementById('drawn-prizes-list');
            const sortedDrawnNumbers = [...drawnPrizeNumbers].sort((a, b) => a - b);
            document.getElementById('drawn-prizes-subtitle').textContent = `Total de ${sortedDrawnNumbers.length} Cartelas Únicas Sorteadas`;
            if (sortedDrawnNumbers.length === 0) {
                listEl.innerHTML = '<p class="text-slate-500">Nenhuma cartela de brinde foi sorteada ainda.</p>';
            } else {
                sortedDrawnNumbers.forEach(number => {
                    listEl.innerHTML += `<div class="bg-purple-600 text-white font-bold rounded-full w-20 h-20 flex flex-col items-center justify-center text-xl shadow-md transition-all duration-300 transform hover:scale-110 relative group"><span class="text-3xl">${number}</span><button class="absolute top-0 right-0 p-1 bg-red-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onclick="removeDrawnPrizeNumber(${number});"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg></button></div>`;
                });
            }
            document.getElementById('close-drawn-prizes-btn').addEventListener('click', () => DOMElements.drawnPrizesModal.classList.add('hidden'));
            DOMElements.drawnPrizesModal.classList.remove('hidden');
        }
// FIX: Assign function to window property to make it accessible from inline onclick handler.
        (window as any).removeDrawnPrizeNumber = removeDrawnPrizeNumber;

        function showDonationModal() {
            DOMElements.donationModal.innerHTML = getModalTemplates().donation;
            document.getElementById('pix-key-display').textContent = appConfig.pixKey;
            document.getElementById('copy-pix-btn').addEventListener('click', () => {
                 try {
                    navigator.clipboard.writeText(appConfig.pixKey).then(() => {
                        showAlert("Chave PIX copiada para a área de transferência!");
                    });
                } catch (err) {
                    showAlert("Não foi possível copiar automaticamente. Por favor, selecione e copie a chave PIX manualmente.");
                }
            });
            document.getElementById('close-donation-btn').addEventListener('click', () => DOMElements.donationModal.classList.add('hidden'));
            DOMElements.donationModal.classList.remove('hidden');
        }

        function showChangelogModal() {
            DOMElements.changelogModal.innerHTML = getModalTemplates().changelog;
            const contentEl = document.getElementById('version-history-content');
            
            const versions = versionHistory.split('**v').slice(1);
            const last10Versions = versions.slice(0, 10);

            let html = '';
            last10Versions.forEach(versionBlock => {
                const lines = versionBlock.trim().split('\n');
                const titleLine = lines.shift(); 
                const title = titleLine.replace(/\*\*|\(.*\)/g, '').trim();
                const status = (titleLine.match(/\((.*)\)/) || [])[1] || '';

                html += `<div class="mb-4"><strong class="text-sky-400">v${title}</strong> ${status ? `<span class="text-xs bg-sky-500 text-white font-bold px-2 py-1 rounded-full">${status}</span>` : ''}<ul class="list-disc pl-6 mt-1 space-y-1">`;
                lines.forEach(line => {
                    if (line.trim().startsWith('-')) {
                        let cleanLine = line.trim().substring(1).trim();
                        cleanLine = cleanLine.replace(/(\w+?):/g, '<strong class="text-amber-400">$1:</strong>');
                        html += `<li class="text-slate-300">${cleanLine}</li>`;
                    }
                });
                html += `</ul></div>`;
            });
            contentEl.innerHTML = html;

            document.getElementById('close-changelog-btn').addEventListener('click', () => DOMElements.changelogModal.classList.add('hidden'));
            DOMElements.changelogModal.classList.remove('hidden');
        }

        function renderShortcutsLegend() {
            const legendList = document.getElementById('shortcuts-legend-list');
            if (!legendList) return;
            
            const shortcuts = appConfig.shortcuts;
            const labels = {
                autoDraw: appLabels.shortcutLabelAutoDraw,
                verify: appLabels.shortcutLabelVerify,
                clearRound: appLabels.shortcutLabelClearRound,
                drawPrize: appLabels.shortcutLabelDrawPrize,
                registerPrize: appLabels.shortcutLabelRegisterPrize,
                sellAuction: appLabels.shortcutLabelSellAuction,
                showInterval: appLabels.shortcutLabelShowInterval,
            };

            legendList.innerHTML = '';
            for (const key in shortcuts) {
                if (labels[key as keyof typeof labels]) {
                    const li = document.createElement('li');
                    const keysHtml = shortcuts[key as keyof typeof shortcuts].split('+').map(k => `<kbd class="font-mono bg-gray-900 px-2 py-1 rounded text-amber-400">${k}</kbd>`).join(' + ');
                    li.innerHTML = `${labels[key as keyof typeof labels]}: ${keysHtml}`;
                    legendList.appendChild(li);
                }
            }
        }
        
        function eventToShortcutString(event: KeyboardEvent) {
            if (['Control', 'Alt', 'Shift', 'Meta'].includes(event.key)) return null;

            let keyString = "";
            if (event.ctrlKey) keyString += "Control+";
            if (event.altKey) keyString += "Alt+";
            if (event.shiftKey) keyString += "Shift+";

            if (event.code === 'Space') {
                keyString += 'Space';
            } else {
                keyString += event.key.length === 1 ? event.key.toUpperCase() : event.key;
            }
            return keyString;
        }

        function showSettingsModal() {
            DOMElements.settingsModal.innerHTML = getModalTemplates().settings;

            const tabs = {
                appearance: document.getElementById('tab-appearance'),
                sponsors: document.getElementById('tab-sponsors'),
                labels: document.getElementById('tab-labels'),
                shortcuts: document.getElementById('tab-shortcuts'),
            };

            const contents = {
                appearance: document.getElementById('tab-content-appearance'),
                sponsors: document.getElementById('tab-content-sponsors'),
                labels: document.getElementById('tab-content-labels'),
                shortcuts: document.getElementById('tab-content-shortcuts'),
            };
            
            const inactiveTabClass = 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500';
            const activeTabClass = 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg border-sky-500 text-sky-400';

            const switchTab = (activeTabKey: string) => {
                for (const key in tabs) {
                    tabs[key as keyof typeof tabs].className = (key === activeTabKey) ? activeTabClass : inactiveTabClass;
                    contents[key as keyof typeof contents].classList.toggle('hidden', key !== activeTabKey);
                }
            };

            for (const key in tabs) {
                tabs[key as keyof typeof tabs].addEventListener('click', () => switchTab(key));
            }
            
            // --- ABA APARÊNCIA ---
// FIX: Cast element to HTMLTextAreaElement to access 'value' property.
            const customLogoInput = document.getElementById('custom-logo-input') as HTMLTextAreaElement;
            const removeCustomLogoBtn = document.getElementById('remove-custom-logo-btn');
// FIX: Cast element to HTMLSelectElement to access 'value' property.
            const titleSelect = document.getElementById('bingo-title-select') as HTMLSelectElement;
// FIX: Cast element to HTMLInputElement to access 'value' property.
            const colorPicker = document.getElementById('board-color-picker') as HTMLInputElement;
            const resetColorBtn = document.getElementById('reset-board-color-btn');
// FIX: Cast element to HTMLInputElement to access 'value' property.
            const drawnTextColorPicker = document.getElementById('drawn-text-color-picker') as HTMLInputElement;
// FIX: Cast element to HTMLInputElement to access 'value' property.
            const drawnStrokeColorPicker = document.getElementById('drawn-stroke-color-picker') as HTMLInputElement;
// FIX: Cast element to HTMLInputElement to access 'value' property.
            const drawnStrokeWidthSlider = document.getElementById('drawn-stroke-width-slider') as HTMLInputElement;
            const drawnStrokeWidthValue = document.getElementById('drawn-stroke-width-value');
            
            customLogoInput.value = appConfig.customLogoBase64;
            titleSelect.value = appConfig.bingoTitle;
            colorPicker.value = appConfig.boardColor === 'default' ? '#FFFFFF' : appConfig.boardColor;
            drawnTextColorPicker.value = appConfig.drawnTextColor;
            drawnStrokeColorPicker.value = appConfig.drawnTextStrokeColor;
// FIX: Convert number to string for input value property.
            drawnStrokeWidthSlider.value = appConfig.drawnTextStrokeWidth.toString();
            drawnStrokeWidthValue.textContent = appConfig.drawnTextStrokeWidth.toString();

            removeCustomLogoBtn.addEventListener('click', () => customLogoInput.value = '');
// FIX: Cast event target to HTMLInputElement to access 'value' property.
            drawnStrokeWidthSlider.addEventListener('input', (e) => drawnStrokeWidthValue.textContent = (e.target as HTMLInputElement).value);
            resetColorBtn.addEventListener('click', () => colorPicker.value = '#FFFFFF');

            // --- ABA PATROCINADORES ---
// FIX: Cast element to HTMLInputElement to access 'checked' property.
            const enableSponsorsCheckbox = document.getElementById('enable-sponsors-by-number-checkbox') as HTMLInputElement;
            const sponsorsContainer = document.getElementById('sponsors-by-number-container');
            enableSponsorsCheckbox.checked = appConfig.enableSponsorsByNumber;
            sponsorsContainer.innerHTML = '';
            for (let i = 1; i <= 75; i++) {
                const sponsorData = (appConfig.sponsorsByNumber as any)[i] || { name: '', image: '' };
                const div = document.createElement('div');
                div.className = 'grid grid-cols-12 gap-2 items-center border-b border-gray-700 pb-2';
                div.innerHTML = `
                    <label class="col-span-1 text-center font-bold text-sky-400">${i}</label>
                    <input type="text" value="${sponsorData.name}" placeholder="${appLabels.settingsSponsorNameLabel}" data-sponsor-number="${i}" data-sponsor-type="name" class="col-span-4 p-1 bg-gray-600 text-white rounded border border-gray-500 text-sm">
                    <textarea placeholder="${appLabels.settingsSponsorImageLabel}" data-sponsor-number="${i}" data-sponsor-type="image" class="col-span-7 p-1 bg-gray-600 text-white rounded border border-gray-500 text-xs font-mono h-12 resize-y">${sponsorData.image}</textarea>
                `;
                sponsorsContainer.appendChild(div);
            }

            // --- ABA TEXTOS ---
            const labelsFormContainer = document.getElementById('labels-form-container');
            labelsFormContainer.innerHTML = '';
            const labelOrder = ["mainTitle", "roundsAndPrizesTitle", "winnersTitle", "bingoBoardTitle", "prizeDrawTitle", "auctionTitle", "prize1Label", "prize2Label", "prize3Label", "intervalModalTitle", "intervalModalSubtitle", "announcedNumberLabel", "lastNumbersLabel", "controlsPanelTitle", "boardScaleLabel", "displayScaleLabel", "manualAnnounceButton", "autoDrawButton", "verifyButton", "clearRoundButton", "clearRoundConfirmTitle", "clearRoundConfirmMessage", "clearRoundConfirmButton", "clearRoundCancelButton", "checkDrawnPrizesButton", "prizeDrawRandomButton", "registerPrizeButton", "sellItemButton", "addExtraRoundButton", "supportTitle", "supportButton", "howToUseTitle", "versionHistoryButton", "customizeButton", "intervalButton", "generateProofButton", "endEventButton", "resetEventButton", "subscribeTitle", "subscribeButton", "verificationModalTitle", "verificationModalBackButton", "modalBackButton", "winnerModalNamePlaceholder", "winnerModalRegisterButton", "alertModalTitle", "alertModalOkButton", "congratsModalTitle", "congratsModalPrizeLabel", "congratsModalMessage", "congratsModalCloseButton", "menuEditModalTitle", "menuEditModalDescription", "modalCancelButton", "modalSaveButton", "winnerEditModalTitle", "winnerEditModalNamePlaceholder", "winnerEditModalPrizePlaceholder", "winnerEditModalRemoveButton", "deleteConfirmModalTitle", "deleteConfirmModalDeleteButton", "proofOptionsModalTitle", "proofOptionsModalDescription", "proofOptionsModalGenerateButton", "spinningWheelSkipButton", "resetConfirmModalTitle", "resetConfirmModalMessage", "resetConfirmModalConfirmButton", "drawnPrizesModalTitle", "modalCloseButton", "donationModalTitle", "donationModalDescription", "donationModalPaypalLabel", "donationModalPixLabel", "donationModalCopyButton", "finalWinnersModalTitle", "finalWinnersModalProofButton", "finalWinnersModalSupportButton", "changelogModalTitle", "changelogModalCurrentVersionLabel", "settingsModalTitle", "settingsTabAppearance", "settingsTabLabels", "settingsTabShortcuts", "quickShortcutsTitle", "shortcutsEditTitle", "shortcutsEditDescription", "shortcutLabelAutoDraw", "shortcutLabelVerify", "shortcutLabelClearRound", "shortcutLabelDrawPrize", "shortcutLabelRegisterPrize", "shortcutLabelSellAuction", "shortcutLabelShowInterval", "settingsLogoTitle", "settingsLogoDescription", "settingsLogoRemoveButton", "settingsSponsorsByNumberTitle", "settingsSponsorsByNumberEnable", "settingsSponsorsByNumberDescription", "settingsBingoTitleLabel", "settingsBingoTitleDescription", "settingsBoardColorLabel", "settingsBoardColorDescription", "settingsBoardColorResetButton", "settingsDrawnNumberTitle", "settingsDrawnTextColorLabel", "settingsDrawnStrokeColorLabel", "settingsDrawnStrokeWidthLabel", "settingsTestDataButton", "settingsCloseSaveButton"];
            const labelDescriptions: {[key: string]: string} = { mainTitle: "Título Principal do Evento", prize1Label: "Nome do Prêmio 1 (Ex: Quina)", prize2Label: "Nome do Prêmio 2 (Ex: Cartela Cheia)", prize3Label: "Nome do Prêmio 3 (Ex: Azarão)", shortcutLabelDrawPrize: "Atalho: Sortear Brinde", shortcutLabelRegisterPrize: "Atalho: Registrar Brinde", shortcutLabelSellAuction: "Atalho: Vender Leilão", shortcutLabelShowInterval: "Atalho: Abrir Intervalo", settingsTabSponsors: "Aba: Patrocinadores", settingsSponsorsByNumberTitle: "Patrocinadores: Título", settingsSponsorsByNumberEnable: "Patrocinadores: Habilitar Recurso", settingsSponsorsByNumberDescription: "Patrocinadores: Descrição", settingsSponsorNumberLabel: "Patrocinadores: Rótulo 'Nº'", settingsSponsorNameLabel: "Patrocinadores: Placeholder Nome", settingsSponsorImageLabel: "Patrocinadores: Placeholder Imagem" };
            labelOrder.forEach(key => { if (appLabels[key as keyof typeof appLabels] !== undefined) { const labelText = labelDescriptions[key] || key; const div = document.createElement('div'); div.innerHTML = `<label for="label-input-${key}" class="block text-sm font-bold text-slate-400 mb-1">${labelText}</label><input type="text" id="label-input-${key}" data-label-key-input="${key}" value="${appLabels[key as keyof typeof appLabels]}" class="w-full p-2 bg-gray-600 text-white rounded-lg focus:ring-sky-500 border border-gray-500">`; labelsFormContainer.appendChild(div); } });

            // --- ABA ATALHOS ---
            const shortcutsFormContainer = document.getElementById('shortcuts-form-container');
            shortcutsFormContainer.innerHTML = '';
            const shortcutLabels = { autoDraw: appLabels.shortcutLabelAutoDraw, verify: appLabels.shortcutLabelVerify, clearRound: appLabels.shortcutLabelClearRound, drawPrize: appLabels.shortcutLabelDrawPrize, registerPrize: appLabels.shortcutLabelRegisterPrize, sellAuction: appLabels.shortcutLabelSellAuction, showInterval: appLabels.shortcutLabelShowInterval };
            for (const key in appConfig.shortcuts) {
                if(shortcutLabels[key as keyof typeof shortcutLabels]) {
                    const div = document.createElement('div');
                    div.className = 'grid grid-cols-3 items-center gap-4';
                    const label = document.createElement('label');
                    label.htmlFor = `shortcut-input-${key}`;
                    label.className = 'text-slate-300 col-span-1';
                    label.textContent = shortcutLabels[key as keyof typeof shortcutLabels];
                    
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.id = `shortcut-input-${key}`;
                    input.readOnly = true;
                    input.value = appConfig.shortcuts[key as keyof typeof appConfig.shortcuts];
                    input.className = 'col-span-2 p-2 bg-gray-600 text-white rounded-lg font-mono text-center cursor-pointer focus:ring-sky-500 border border-gray-500';
                    
                    input.addEventListener('keydown', (e) => { e.preventDefault(); const newShortcut = eventToShortcutString(e); if (newShortcut) { input.value = newShortcut; (appConfig.shortcuts as any)[key] = newShortcut; renderShortcutsLegend(); debouncedSave(); } });
                    div.appendChild(label);
                    div.appendChild(input);
                    shortcutsFormContainer.appendChild(div);
                }
            }

            // --- BOTÕES FINAIS ---
            document.getElementById('generate-test-data-btn').addEventListener('click', generateTestData);
            document.getElementById('close-settings-btn').addEventListener('click', () => {
                // Salvar Aba Aparência
                appConfig.customLogoBase64 = customLogoInput.value.trim();
                appConfig.bingoTitle = titleSelect.value;
                appConfig.boardColor = colorPicker.value.toUpperCase();
                if (appConfig.boardColor === '#FFFFFF') appConfig.boardColor = 'default';
                appConfig.drawnTextColor = drawnTextColorPicker.value.toUpperCase();
                appConfig.drawnTextStrokeColor = drawnStrokeColorPicker.value.toUpperCase();
                appConfig.drawnTextStrokeWidth = parseInt(drawnStrokeWidthSlider.value, 10);
                
                // Salvar Aba Patrocinadores
                appConfig.enableSponsorsByNumber = enableSponsorsCheckbox.checked;
                appConfig.sponsorsByNumber = {};
                sponsorsContainer.querySelectorAll('[data-sponsor-number]').forEach(el => {
// FIX: Cast element to access dataset and value properties.
                    const num = (el as HTMLElement).dataset.sponsorNumber;
                    const type = (el as HTMLElement).dataset.sponsorType;
                    if (!(appConfig.sponsorsByNumber as any)[num]) (appConfig.sponsorsByNumber as any)[num] = { name: '', image: '' };
                    if ((el as HTMLInputElement).value.trim()) (appConfig.sponsorsByNumber as any)[num][type] = (el as HTMLInputElement).value.trim();
                });

                // Salvar Aba Textos
// FIX: Cast element to access dataset and value properties.
                document.querySelectorAll('[data-label-key-input]').forEach(input => { (appLabels as any)[(input as HTMLElement).dataset.labelKeyInput] = (input as HTMLInputElement).value; });

                saveStateToFirestore();
                applyLabels();
                renderUIFromState();
                DOMElements.settingsModal.classList.add('hidden');
            });
            DOMElements.settingsModal.classList.remove('hidden');
        }

        function applyBoardZoom(scalePercent: number) {
            const scale = scalePercent / 100;
            const baseSize = 80;
            const baseFontSize = 48;
            const newSize = baseSize * scale;
            const newFontSize = baseFontSize * scale;

            document.querySelectorAll('.bingo-cell').forEach(cell => {
                (cell as HTMLElement).style.width = `${newSize}px`;
                (cell as HTMLElement).style.height = `${newSize}px`;
                (cell as HTMLElement).style.fontSize = `${newFontSize}px`;
            });

             document.querySelectorAll('#bingo-board .font-black.text-sky-400').forEach(header => {
                (header as HTMLElement).style.fontSize = `${newFontSize * 1.2}px`;
            });

            const labelEl = document.querySelector('label[for="board-zoom-slider"]');
            if (labelEl) labelEl.textContent = `${appLabels.boardScaleLabel} (${scalePercent}%)`;
        }
        
        function applyDisplayZoom(scalePercent: number) {
            const scale = scalePercent / 100;
            const currentNumberEl = DOMElements.currentNumberEl as HTMLElement;

            // Base sizes derived from CSS for consistent scaling
            const baseWidth = 420; // from sm:w-[420px]
            const baseHeight = 420; // from sm:h-[420px]
            const baseFontSize = 240; // from 15rem (clamp max value)

            const newSize = baseWidth * scale;
            const newFontSize = baseFontSize * scale;

            currentNumberEl.style.width = `${newSize}px`;
            currentNumberEl.style.height = `${newSize}px`;
            // Using clamp to ensure responsiveness on smaller screens while still allowing zoom
            currentNumberEl.style.fontSize = `clamp(${6 * scale}rem, ${25 * scale}vw, ${15 * scale}rem)`;

            // Reset transform on wrapper to avoid conflicting scaling methods
            (DOMElements.currentNumberWrapper as HTMLElement).style.transform = 'scale(1)';

            const labelEl = document.querySelector('label[for="display-zoom-slider"]');
            if (labelEl) labelEl.textContent = `${appLabels.displayScaleLabel} (${scalePercent}%)`;
        }
        
        function handleAuctionSale(event: Event) {
            event.preventDefault();
// FIX: Cast element to HTMLInputElement to access 'value' property.
            const itemName = (document.getElementById('auction-item-name') as HTMLInputElement).value.trim();
// FIX: Cast element to HTMLInputElement to access 'value' property.
            const bid = (document.getElementById('auction-item-current-bid') as HTMLInputElement).value.trim();
// FIX: Cast element to HTMLInputElement to access 'value' property.
            const winnerName = (document.getElementById('auction-winner-name') as HTMLInputElement).value.trim();

            if (!itemName || !bid || !winnerName) {
                showAlert("Por favor, preencha todos os campos do leilão.");
                return;
            }

            if (!gamesData['Leilão']) gamesData['Leilão'] = { winners: [] };
            
            const auctionData = {
                id: Date.now(),
                name: winnerName,
                prize: `${itemName} (Leilão)`,
                gameNumber: 'Leilão',
                bingoType: 'Leilão',
                itemName: itemName,
                bid: bid
            };

            gamesData['Leilão'].winners.push(auctionData);
            renderAllWinners();
            DOMElements.shareBtn.classList.remove('hidden');
            DOMElements.endEventBtn.classList.remove('hidden');
            showCongratsModal(winnerName, `Arrematou "${itemName}" por R$ ${bid}`);
            
            const bidDisplay = document.getElementById('auction-current-bid-display');
            if (bidDisplay) bidDisplay.textContent = 'R$ 0';
            
            DOMElements.auctionForm.reset();
            saveStateToFirestore();
        }

        function handleQuickBid(amount: number) {
// FIX: Cast element to HTMLInputElement to access 'value' property.
            const currentBidInput = document.getElementById('auction-item-current-bid') as HTMLInputElement;
            const currentBidDisplay = document.getElementById('auction-current-bid-display');
            const currentBid = parseFloat(currentBidInput.value) || 0;
            const newBid = currentBid + amount;
            currentBidInput.value = newBid.toString();

            if (currentBidDisplay) {
                currentBidDisplay.textContent = `R$ ${newBid}`;
                currentBidDisplay.classList.remove('scale-110');
                void currentBidDisplay.offsetWidth;
                currentBidDisplay.classList.add('scale-110');
                setTimeout(() => currentBidDisplay.classList.remove('scale-110'), 200);
            }

            const gavelIcon = document.getElementById('gavel-icon');
            gavelIcon.classList.remove('animate-gavel-strike');
            void gavelIcon.offsetWidth; // Trigger reflow
            gavelIcon.classList.add('animate-gavel-strike');
        }

        function renderCustomLogo() {
            const logoContainer = document.getElementById('app-logo');
            if (appConfig.customLogoBase64) {
                logoContainer.innerHTML = `<img src="${appConfig.customLogoBase64}" alt="Logo do Evento" class="w-full h-full object-contain">`;
            } else {
                logoContainer.innerHTML = `<svg viewBox="0 0 100 100" class="logo-animation w-full h-full">
                        <defs>
                            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#FFD700;" />
                                <stop offset="100%" style="stop-color:#FFA500;" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#gold-gradient)" d="M50 0 L61.2 34.5 L97.5 34.5 L68.1 55.9 L79.4 90.5 L50 69.1 L20.6 90.5 L31.9 55.9 L2.5 34.5 L38.8 34.5 Z" />
                        <text x="50" y="62" font-family="Inter, sans-serif" font-weight="900" font-size="30" fill="white" text-anchor="middle" stroke="rgba(0,0,0,0.5)" stroke-width="1">SP</text>
                    </svg>`;
            }
        }

        let particles: any[] = [];
        const colors = ["#fde047", "#f97316", "#22c55e", "#0ea5e9", "#ef4444", "#a855f7"];
        function setupConfettiCanvas() {
            DOMElements.confettiCanvas.width = window.innerWidth;
            DOMElements.confettiCanvas.height = window.innerHeight;
        }
        function startConfetti(continuous = false) {
            particles = [];
            for (let i = 0; i < 200; i++) particles.push({ x: Math.random() * DOMElements.confettiCanvas.width, y: Math.random() * DOMElements.confettiCanvas.height - DOMElements.confettiCanvas.height, vx: Math.random() * 10 - 5, vy: Math.random() * 5 + 2, radius: Math.random() * 5 + 2, color: colors[Math.floor(Math.random() * colors.length)], alpha: Math.random() * 0.5 + 0.5 });
            animateConfetti(continuous);
        }
        function stopConfetti() {
            cancelAnimationFrame(confettiAnimationId);
            if(confettiCtx) confettiCtx.clearRect(0, 0, DOMElements.confettiCanvas.width, DOMElements.confettiCanvas.height);
        }
        function animateConfetti(continuous: boolean) {
            if(!confettiCtx) return;
            confettiCtx.clearRect(0, 0, DOMElements.confettiCanvas.width, DOMElements.confettiCanvas.height);
            particles.forEach((p, index) => {
                p.y += p.vy; p.x += p.vx;
                if (!continuous) { p.vy += 0.05; p.alpha -= 0.005; }
                if (p.y > DOMElements.confettiCanvas.height) {
                    if (continuous) particles[index] = { x: Math.random() * DOMElements.confettiCanvas.width, y: -20, vx: Math.random() * 10 - 5, vy: Math.random() * 5 + 2, radius: Math.random() * 5 + 2, color: colors[Math.floor(Math.random() * colors.length)], alpha: Math.random() * 0.5 + 0.5 };
                    else p.alpha = 0;
                }
                if (p.alpha > 0) {
                    confettiCtx.globalAlpha = p.alpha;
                    confettiCtx.fillStyle = p.color;
                    confettiCtx.beginPath();
                    confettiCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    confettiCtx.fill();
                }
            });
            particles = particles.filter(p => p.alpha > 0);
            if (continuous && particles.length < 200) {
                 for (let i = 0; i < 5; i++) particles.push({ x: Math.random() * DOMElements.confettiCanvas.width, y: -20, vx: Math.random() * 10 - 5, vy: Math.random() * 5 + 2, radius: Math.random() * 5 + 2, color: colors[Math.floor(Math.random() * colors.length)], alpha: Math.random() * 0.5 + 0.5 });
            }
            if (particles.length > 0 || continuous) confettiAnimationId = requestAnimationFrame(() => animateConfetti(continuous));
        }
        
        function startMenuAnimation() {
            DOMElements.eventBreakModal.innerHTML = getModalTemplates().eventBreak;
            document.getElementById('close-break-modal-btn').addEventListener('click', () => { DOMElements.eventBreakModal.classList.add('hidden'); stopConfetti(); clearInterval(menuInterval); });
            clearInterval(menuInterval);

            const breakContentArea = document.getElementById('break-content-area');
// FIX: Safely access properties on sponsor objects by casting to 'any'.
            const sponsors = Object.values(appConfig.sponsorsByNumber).filter(s => s && (s as any).image);
            const combinedContent = [...menuItems, ...sponsors];

            if (combinedContent.length === 0) {
                breakContentArea.innerHTML = '<p class="text-2xl text-slate-400 text-center">Nenhum item no cardápio ou patrocinador para exibir.</p>';
                return;
            }

            breakContentArea.innerHTML = `<div class="flex justify-between items-center mb-4"><h3 id="menu-title" contenteditable="true" class="text-3xl font-bold text-amber-400 focus:outline-none focus:ring-2 ring-amber-500 rounded-lg">Cardápio & Patrocinadores</h3><button id="edit-menu-btn-modal" class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-1 px-3 rounded-lg text-sm">Editar Cardápio</button></div><div id="slideshow-container" class="flex-grow flex items-center justify-center relative overflow-hidden"></div>`;
            const slideshowContainer = document.getElementById('slideshow-container');
            
            let currentIndex = 0;
            const showNextItem = () => {
                const currentItem = combinedContent[currentIndex];
                let contentHtml;

// FIX: Cast currentItem to 'any' to safely access 'image' and 'name' properties.
                if (typeof currentItem === 'object' && (currentItem as any).image) {
                     contentHtml = `<div class="flex flex-col items-center justify-center w-full h-full animate-fade-in-up">
                                        <img src="${(currentItem as any).image}" class="max-h-[80%] max-w-full object-contain">
                                        <p class="mt-4 text-3xl font-bold text-white">${(currentItem as any).name}</p>
                                    </div>`;
                } else if (typeof currentItem === 'string') {
                    contentHtml = `<div class="w-full text-6xl font-bold text-center animate-fade-in-up">${currentItem}</div>`;
                }

                slideshowContainer.innerHTML = contentHtml;
                currentIndex = (currentIndex + 1) % combinedContent.length;
            };

            showNextItem();
            menuInterval = setInterval(showNextItem, 5000);

            document.getElementById('edit-menu-btn-modal').addEventListener('click', () => {
                DOMElements.menuEditModal.innerHTML = getModalTemplates().menuEdit;
// FIX: Cast element to HTMLTextAreaElement to access 'value' property.
                (document.getElementById('menu-textarea') as HTMLTextAreaElement).value = menuItems.join('\n');
                DOMElements.menuEditModal.classList.remove('hidden');
                document.getElementById('save-menu-btn').addEventListener('click', () => {
// FIX: Cast element to HTMLTextAreaElement to access 'value' property.
                    menuItems = (document.getElementById('menu-textarea') as HTMLTextAreaElement).value.split('\n').filter(item => item.trim() !== '');
                    DOMElements.menuEditModal.classList.add('hidden');
                    startMenuAnimation();
                    saveStateToFirestore();
                });
                document.getElementById('cancel-menu-edit-btn').addEventListener('click', () => { DOMElements.menuEditModal.classList.add('hidden'); });
            });
        }

        function startFinalWinnerSlide(allWinners: any[]) {
            DOMElements.eventBreakModal.innerHTML = getModalTemplates().finalWinners;
            DOMElements.eventBreakModal.classList.remove('hidden');
            const displayEl = document.getElementById('current-winner-card') as HTMLElement;
// FIX: Convert number to string for innerText property.
            (document.getElementById('version-footer-modal') as HTMLElement).innerText = currentVersion.toString();
            (document.getElementById('last-updated-footer-modal') as HTMLElement).innerText = DOMElements.lastUpdated.innerText;
            document.getElementById('donation-final-btn').addEventListener('click', () => {
                DOMElements.eventBreakModal.classList.add('hidden');
                showDonationModal();
                clearTimeout(winnerDisplayTimeout);
                stopConfetti();
            });
            let winnerIndex = 0;
            const showWinner = (winner: any) => {
                const prizeLabel = appLabels[(winner.bingoType + 'Label') as keyof typeof appLabels] || winner.bingoType;
                const winnerText = winner.bingoType === 'Sorteio' 
                    ? `<p class="text-4xl font-bold text-amber-400">Cartela ${winner.cartela}</p><p class="text-3xl text-white">${winner.name || 'Ganhador não informado'}</p><p class="text-2xl text-sky-300 mt-2">Ganhou: ${winner.prize}</p>`
                    : `<p class="text-4xl font-bold text-amber-400">Rodada ${winner.gameNumber}</p><p class="text-3xl text-white">${winner.name || 'Ganhador não informado'}</p><p class="text-2xl text-sky-300 mt-2">Prêmio: ${winner.prize} (${prizeLabel})</p>`;
                displayEl.style.opacity = '0';
                displayEl.style.transform = 'scale(0.9)';
                setTimeout(() => { displayEl.innerHTML = winnerText; displayEl.style.opacity = '1'; displayEl.style.transform = 'scale(1)'; }, 500);
            };
            const nextWinner = () => {
                clearTimeout(winnerDisplayTimeout);
                if (allWinners.length === 0) { displayEl.innerHTML = `<p class="text-5xl font-black text-white">Nenhum vencedor registrado!</p>`; return; }
                showWinner(allWinners[winnerIndex]);
                winnerIndex = (winnerIndex + 1) % allWinners.length;
                winnerDisplayTimeout = setTimeout(nextWinner, winnerDisplayDuration);
            };
            nextWinner();
            startConfetti(true); 
            document.getElementById('generate-proof-final-btn').addEventListener('click', () => { showProofOptionsModal(); clearTimeout(winnerDisplayTimeout); stopConfetti(); DOMElements.eventBreakModal.classList.add('hidden'); });
            document.getElementById('close-final-modal-btn').addEventListener('click', () => { DOMElements.eventBreakModal.classList.add('hidden'); clearTimeout(winnerDisplayTimeout); stopConfetti(); });
        }
        
        function setupEventListeners() {
            DOMElements.clearRoundBtnTop.addEventListener('click', showClearRoundConfirmModal);
            DOMElements.clearRoundBtnBottom.addEventListener('click', showClearRoundConfirmModal);
            document.querySelectorAll('[data-label-key="verifyButton"]').forEach(btn => btn.addEventListener('click', showVerificationModal));
            DOMElements.manualInputForm.addEventListener('submit', handleManualInput);
            DOMElements.prizeDrawForm.addEventListener('submit', handlePrizeDraw);
            document.querySelector('[data-label-key="prizeDrawRandomButton"]').addEventListener('click', handleRandomPrizeDraw);
            DOMElements.checkDrawnPrizesBtn.addEventListener('click', showDrawnPrizesModal);
            DOMElements.shareBtn.addEventListener('click', showProofOptionsModal);
            DOMElements.showDonationModalBtn.addEventListener('click', showDonationModal);
            DOMElements.showChangelogBtn.addEventListener('click', showChangelogModal);
            DOMElements.showSettingsBtn.addEventListener('click', showSettingsModal);
            document.querySelectorAll('[data-label-key="autoDrawButton"]').forEach(btn => btn.addEventListener('click', handleAutoDraw));
            DOMElements.auctionForm.addEventListener('submit', handleAuctionSale);
            
            document.getElementById('add-50-bid').addEventListener('click', () => handleQuickBid(50));
            document.getElementById('add-100-bid').addEventListener('click', () => handleQuickBid(100));
            document.getElementById('add-custom-bid-btn').addEventListener('click', () => {
// FIX: Cast element to HTMLInputElement to access 'value' property.
                const customAmount = parseFloat((document.getElementById('custom-bid-input') as HTMLInputElement).value) || 0;
                if (customAmount > 0) handleQuickBid(customAmount);
// FIX: Cast element to HTMLInputElement to access 'value' property.
                (document.getElementById('custom-bid-input') as HTMLInputElement).value = '';
            });
            const bidInput = document.getElementById('auction-item-current-bid');
            const bidDisplay = document.getElementById('auction-current-bid-display');
            if(bidInput && bidDisplay) {
                bidInput.addEventListener('input', (e) => {
// FIX: Cast event target to HTMLInputElement to access 'value' property.
                    const value = parseFloat((e.target as HTMLInputElement).value) || 0;
                    bidDisplay.textContent = `R$ ${value}`;
                });
            }

            document.getElementById('board-zoom-slider')?.addEventListener('input', (e) => {
// FIX: Cast event target to HTMLInputElement to access 'value' property.
                const scale = parseInt((e.target as HTMLInputElement).value, 10);
                appConfig.boardScale = scale;
                applyBoardZoom(scale);
                debouncedSave();
            });
            document.getElementById('display-zoom-slider')?.addEventListener('input', (e) => {
// FIX: Cast event target to HTMLInputElement to access 'value' property.
                const scale = parseInt((e.target as HTMLInputElement).value, 10);
                appConfig.displayScale = scale;
                applyDisplayZoom(scale);
                debouncedSave();
            });
            document.querySelector('[data-label-key="howToUseButton"]')?.addEventListener('click', () => {
                if (appConfig.tutorialVideoLink && appConfig.tutorialVideoLink.startsWith('http')) window.open(appConfig.tutorialVideoLink, '_blank');
                else showAlert("O link do vídeo tutorial não está configurado.");
            });

            DOMElements.endEventBtn.addEventListener('click', () => {
// FIX: Safely access 'winners' property by casting 'game' to 'any' and providing a fallback empty array.
                const allWinners = Object.values(gamesData).flatMap(game => (game as any).winners || []).filter((w: any) => w.bingoType !== 'Sorteio').reverse();
                if (allWinners.length === 0) { showAlert("Nenhum vencedor foi registrado ainda."); return; }
                startFinalWinnerSlide(allWinners);
            });
            DOMElements.intervalBtn.addEventListener('click', () => { DOMElements.eventBreakModal.classList.remove('hidden'); startMenuAnimation(); startConfetti(true); });
            DOMElements.addExtraGameBtn.addEventListener('click', () => {
                gameCount++;
                gamesData[gameCount] = { 
                    prizes: {prize1: '', prize2: '', prize3: ''}, 
                    calledNumbers: [], 
                    winners: [], 
                    isComplete: false,
                    color: roundColors[gameCount % roundColors.length] 
                };
                DOMElements.gamesListEl.appendChild(createGameElement(gameCount, { prize1: '', prize2: '', prize3: '' }));
                saveStateToFirestore();
            });
            DOMElements.resetEventBtn.addEventListener('click', () => { 
                DOMElements.resetConfirmModal.innerHTML = getModalTemplates().resetConfirm;
                DOMElements.resetConfirmModal.classList.remove('hidden');
                document.getElementById('confirm-reset-btn').addEventListener('click', async () => { if (dbRef) await deleteDoc(dbRef); window.location.reload(); });
                document.getElementById('cancel-reset-btn').addEventListener('click', () => DOMElements.resetConfirmModal.classList.add('hidden'));
            });
            window.addEventListener('resize', setupConfettiCanvas);
            
            // Atalhos de teclado
            window.addEventListener('keydown', (e) => {
                const settingsModalVisible = !DOMElements.settingsModal.classList.contains('hidden');
                const shortcutInputFocused = settingsModalVisible && document.activeElement && document.activeElement.id.startsWith('shortcut-input-');

// FIX: Cast event target to HTMLElement to safely access properties like isContentEditable and tagName.
                const target = e.target as HTMLElement;
                if (target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || shortcutInputFocused) {
                    return;
                }

                const keyString = eventToShortcutString(e);
                if (!keyString) return;
                
                const shortcuts = appConfig.shortcuts;
                switch (keyString) {
                    case shortcuts.autoDraw:
                        e.preventDefault();
// FIX: Cast selected element to HTMLElement to access the click method.
                        (document.querySelector('#auto-draw-btn-top:not(:disabled)') as HTMLElement)?.click();
                        break;
                    case shortcuts.verify:
                        e.preventDefault();
                        showVerificationModal();
                        break;
                    case shortcuts.clearRound:
                        e.preventDefault();
                        showClearRoundConfirmModal();
                        break;
                    case shortcuts.drawPrize:
                        e.preventDefault();
                        (document.getElementById('prize-draw-random-btn') as HTMLElement)?.click();
                        break;
                    case shortcuts.registerPrize:
                        e.preventDefault();
                        DOMElements.prizeDrawForm.requestSubmit();
                        break;
                    case shortcuts.sellAuction:
                        e.preventDefault();
                        DOMElements.auctionForm.requestSubmit();
                        break;
                    case shortcuts.showInterval:
                        e.preventDefault();
                        (DOMElements.intervalBtn as HTMLElement).click();
                        break;
                }
            });
        }

        async function startApp() {
            const indicator = DOMElements.connectionIndicator;
            const indicatorText = DOMElements.connectionStatusText;
            const dot = indicator.querySelector('div');

            try {
                const firebaseConfig = { apiKey: "AIzaSyDULAgBMD6g__7TuLgNIrjsEyC9es_gEZg", authDomain: "show-de-premios-65d20.firebaseapp.com", projectId: "show-de-premios-65d20", storageBucket: "show-de-prêmios-65d20.appspot.com", messagingSenderId: "454374708177", appId: "1:454374708177:web:7372a5fe967277973006f0", measurementId: "G-43DSKKVD0P" };
                const app = initializeApp(firebaseConfig);
                db = getFirestore(app);
                auth = getAuth(app);

                onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        userId = user.uid;
                        dbRef = doc(db, 'artifacts', 'show-de-prêmios-netlify', 'users', userId);
                        firebaseReady = true;

                        indicator.className = 'flex items-center justify-center gap-2 px-3 py-1 rounded-lg text-white text-xs font-bold transition-all duration-500 bg-green-500 mt-2 mx-auto';
                        dot.className = 'w-2 h-2 rounded-full bg-white';
                        indicatorText.textContent = 'Online (Nuvem)';
                        indicator.title = 'Conectado! Seu progresso está sendo salvo na nuvem.';
                        
                        await loadStateFromFirestore(); 
                    }
                });
                await signInAnonymously(auth);
            } catch (error) {
                console.error("Firebase initialization failed:", error);
                
                indicator.className = 'flex items-center justify-center gap-2 px-3 py-1 rounded-lg text-white text-xs font-bold transition-all duration-500 bg-yellow-500 mt-2 mx-auto';
                dot.className = 'w-2 h-2 rounded-full bg-white';
                indicatorText.textContent = 'Modo Offline (Local)';
                indicator.title = 'Não foi possível conectar. O progresso NÃO será salvo.';
                showAlert("Falha na conexão. O aplicativo está em modo offline e seu progresso não será salvo.");
                
                applyLabels();
                renderUIFromState();
            }
            setupConfettiCanvas();
            setupEventListeners();
        }
        
        startApp();