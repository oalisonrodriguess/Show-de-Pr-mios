
        // FIX: Added declaration for the 'confetti' library function to resolve "Cannot find name 'confetti'" errors.
        declare var confetti: any;
        
        // --- Variáveis de Estado ---
        let floatingNumberTimeout: ReturnType<typeof setTimeout> | null = null;
        let currentVersion = "7.0"; // Foco 100% Local
        
        // Mapeamento de letras dinâmico
        let DYNAMIC_LETTERS = ['B', 'I', 'N', 'G', 'O'];
        let DYNAMIC_LETTERS_AJUDE = ['A', 'J', 'U', 'D', 'E'];

        const BINGO_CONFIG: { [key: string]: { min: number; max: number } } = { B: { min: 1, max: 15 }, I: { min: 16, max: 30 }, N: { min: 31, max: 45 }, G: { min: 46, max: 60 }, O: { min: 61, max: 75 },
                               A: { min: 1, max: 15 }, J: { min: 16, max: 30 }, U: { min: 31, max: 45 }, D: { min: 46, max: 60 }, E: { min: 61, max: 75 } };
        const LETTERS = Object.keys(BINGO_CONFIG);
        const roundColors = ['#16a34a', '#ca8a04', '#c2410c', '#0e7490', '#be185d', '#6d28d9', '#059669', '#b45309'];
        
        let gamesData: {[key: string]: any} = {}; 
        let activeGameNumber: string | null = null;
        let currentBingoType = ''; 
        let gameCount = 6;
        let menuItems = [ "Refrigerante - R$ 5,00", "Cerveja - R$ 7,00", "Água - R$ 3,00", "Espetinho - R$ 8,00", "Pastel - R$ 6,00", "Porção de Fritas - R$ 15,00" ];
        let intervalContentInterval: any;
        let intervalClockInterval: any;
        let breakConfettiInterval: any;
        let finalConfettiInterval: any;
        let clockInterval: any;
        const predefinedPrizes = [ { prize1: 'R$ 100,00', prize2: '', prize3: '' }, { prize1: 'R$ 100,00', prize2: 'R$ 200,00', prize3: '' }, { prize1: 'R$ 200,00', prize2: '', prize3: '' }, { prize1: 'R$ 100,00', prize2: 'R$ 300,00', prize3: '' }, { prize1: 'R$ 300,00', prize2: '', prize3: 'R$ 300,00' }, { prize1: 'R$ 200,00', prize2: 'R$ 2.000,00', prize3: '' } ];
        let confettiAnimationId: number;
        let spinTimeout: any;
        let cycloneInterval: any;
        let saveTimeout: any; // Debounce timer for saving state
        let drawnPrizeNumbers: number[] = [];
        let winnerDisplayTimeout: any; 
        const winnerDisplayDuration = 5000;
        let versionHistory = `**v7.0.0 (Atual)**
- **REMARCA E FOCO LOCAL:** O programa foi renomeado para "Bingo Show". Toda a funcionalidade online e de sincronização com a nuvem (Firebase) foi removida. O aplicativo agora opera em um modo 100% local, salvando todos os dados (incluindo imagens de patrocinadores) diretamente no navegador para máxima confiabilidade e simplicidade em eventos presenciais.
- **NOVO LOGOTIPO:** O aplicativo agora apresenta um novo logotipo para refletir a marca "Bingo Show".
- **PATROCINADOR GLOBAL:** Adicionada uma nova seção nas configurações para cadastrar um "Patrocinador Global". Uma única imagem e nome podem ser definidos para aparecer em todos os números que não possuam um patrocinador individual, garantindo que a tela de sorteio sempre exiba um apoio.
- **INTERFACE SIMPLIFICADA:** Removidos os indicadores de status de conexão e a tela de seleção de modo (Online/Local), tornando a inicialização do programa mais direta.
- **MELHORIA NO BACKUP:** A função "Salvar no Computador" agora é o método principal de backup, garantindo que 100% dos dados, incluindo todas as imagens de patrocinadores (individuais e global), sejam salvas no arquivo .json.

**v6.8.0**
- **REFORMULAÇÃO DA INTERFACE DE INTERVALO:** A tela de intervalo foi redesenhada para projetores, exibindo em tela cheia o cardápio e os patrocinadores (ou vencedores) em um ciclo contínuo e com letras grandes, com uma animação constante de confetes ao fundo.
- **FLUXO DE VENCEDOR UNIFICADO:** O modal de parabéns e o de registro de nome foram unificados em uma única tela. O modal se fecha automaticamente após 20 segundos ou ao pressionar Enter (para salvar) ou Esc.
- **GESTÃO DE RODADAS APRIMORADA:** Rodadas extras agora são adicionadas no topo da lista com uma animação "fade-in". Rodadas concluídas agora podem ser reabertas com um clique, facilitando correções.
- **GERENCIAMENTO DE BRINDES FACILITADO:** No modal de conferência de brindes, agora é possível excluir números sorteados por engano. O último número sorteado é destacado visualmente.
- **MELHORIAS DE USABILIDADE E VISUAIS:** O tempo de exibição padrão do modal de número sorteado foi aumentado para 5 segundos. Os controles de zoom nos modais foram ajustados para não serem sobrepostos por animações. O rodapé agora exibe "última atualização do aplicativo". O sorteio de brinde agora tem uma animação pulsante.

**v6.6.0**
- **SALVAMENTO LOCAL NO COMPUTADOR:** Adicionada a funcionalidade para "Salvar no Computador" e "Carregar do Computador". Os usuários agora podem exportar todo o estado do evento (rodadas, vencedores, configurações, etc.) para um arquivo .json e importá-lo posteriormente. Isso cria um backup seguro e confiável, independente da conexão com a internet ou do cache do navegador.
- **CORREÇÃO DE DIAGNÓSTICO:** Aprimorada a explicação sobre o motivo do não salvamento em nuvem, direcionando o usuário para a solução de backup local como alternativa principal à configuração do Firebase.

**v6.5.0**
- **SORTEIO DE BRINDES EM DESTAQUE:** O número da cartela sorteada no sorteio de brindes agora é exibido no painel principal, utilizando o mesmo espaço do número de bingo para máximo destaque. A exibição inclui uma animação de "caça-níquel" e utiliza a cor da rodada ativa.
- **MODAL DE PATROCINADOR CORRIGIDO:** O painel de fundo do modal de patrocinador agora acompanha o zoom corretamente, garantindo uma aparência consistente e profissional em qualquer nível de escala. O modal também foi ampliado para maior impacto.
- **INCREMENTO DE VERSÃO:** O versionamento do aplicativo é atualizado a cada nova implementação.

**v6.4.0**
- **LOGO PADRÃO:** O programa agora inicia com a logomarca oficial do Bingo Cloud, que pode ser removida ou substituída pelo usuário nas configurações. O tamanho da logo no cabeçalho também foi aumentado.
- **GESTÃO DE RODADAS:** Adicionado um ícone de lixeira (🗑️) em cada rodada, permitindo sua exclusão mediante confirmação.
- **CORES DINÂMICAS E CONSISTENTES:** O número sorteado no painel principal agora é pintado com a cor exata da rodada ativa. O cabeçalho do modal de "Brindes Sorteados" também adota a cor da rodada.
- **FEEDBACK VISUAL APRIMORADO:** O botão da rodada ativa agora fica verde e exibe o texto "Jogando...", facilitando a identificação.
- **CONTROLE DE MODAIS:** Adicionada uma nova seção nas configurações para desativar o fechamento automático dos modais de sorteio ou ajustar seu tempo de exibição (de 3 a 15 segundos).`;

        // --- Configurações Globais da Aplicação (Persistidas no LocalStorage) ---
        let appConfig = {
            // FIXOS
            pixKey: '1e8e4af0-4d23-440c-9f3d-b4e527f65911',
            paypalLink: 'https://www.paypal.com/donate/?hosted_button_id=WJBLF3LV3RZRW',
            tutorialVideoLink: 'https://youtu.be/8iOOW-CR-WQ?si=Jolrp2qR38xhY5EZ', 
            // CONFIGURÁVEIS
            bingoTitle: 'BINGO',
            boardColor: 'default',
            boardScale: 90,
            displayScale: 100,
            verificationPanelZoom: 100,
            floatingNumberZoom: 100,
            sponsorDisplayZoom: 100,
            drawnTextColor: '#FFFFFF',
            drawnTextStrokeColor: '#000000',
            drawnTextStrokeWidth: 2,
            isEventClosed: false,
            customLogoBase64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ29sZEdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkQ3MDA7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQTUwMDtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxmaWx0ZXIgaWQ9Imdsb3ciPgogICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxMCIgcmVzdWx0PSJjb2xvcmVkQmx1ciIvPgogICAgICAgICAgICA8ZmVNZXJnZT4KICAgICAgICAgICAgICAgIDxmZU1lcmdlTm9kZSBpbj0iY29sb3JlZEJsdXIiLz4KICAgICAgICAgICAgICAgIDxmZU1lcmdlTm9kZSBpbj0iU291cmNlR3JhcGhpYyIvPgogICAgICAgICAgICA8L2ZlTWVyZ2U+CiAgICAgICAgPC9maWx0ZXI+CiAgICA8L2RlZnM+CiAgICA8cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0iIzExMTgyNyIgcng9IjUwIiAvPgogICAgPGcgZmlsdGVyPSJ1cmwoI2dsb3cpIj4KICAgICAgICA8dGV4dCB4PSI1MCUiIHk9IjQ1JSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IidJbnRlcicsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIwIiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSJ1cmwoI2dvbGRHcmFkaWVudCkiIGxldHRlci1zcGFjaW5nPSIyIj4KICAgICAgICAgICAgQklOR08KICAgICAgICA8L3RleHQ+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI2NSUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQתYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSInSW50ZXInLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2MCIgZm9udC1zZWlnaHQ9IjkwMCIgZmlsbD0id2hpdGUiIHN0cm9rZT0iI0ZGQTUwMCIgc3Ryb2tlLXdpZHRoPSI0IiBsZXR0ZXItc3BhY2luZz0iNSI+CiAgICAgICAgICAgIFNIT1cKICAgICAgICA8L3RleHQ+CiAgICA8L2c+Cjwvc3ZnPg==',
            enableSponsorsByNumber: false,
            enableModalAutoclose: true,
            modalAutocloseSeconds: 5,
            sponsorsByNumber: {} as Record<number, {name: string, image: string}>,
            globalSponsor: { name: '', image: '' },
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
            howToUseTitle: "🎬 Como Usar?",
            howToUseButton: "Em Breve!",
            versionHistoryButton: "Histórico de Versões",
            customizeButton: "Personalizar",
            intervalButton: "Intervalo",
            generateProofButton: "Gerar Prova",
            endEventButton: "Encerrar Evento",
            resetEventButton: "Reiniciar Evento",
            saveToFileButton: "Salvar no Computador",
            loadFromFileButton: "Carregar do Computador",
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
            settingsLogoDescription: "Selecione uma imagem do seu computador (PNG, JPG). A imagem será redimensionada para caber no espaço.",
            settingsLogoRemoveButton: "Remover Logo",
            settingsGlobalSponsorTitle: "Patrocinador Global",
            settingsGlobalSponsorDescription: "Este patrocinador será exibido para qualquer número sorteado que não tenha um patrocinador individual cadastrado.",
            settingsSponsorsByNumberTitle: "Patrocinadores por Número",
            settingsSponsorsByNumberEnable: "Habilitar exibição de patrocinador ao sortear número",
            settingsSponsorsByNumberDescription: "Cadastre um nome e uma imagem para cada número. Eles aparecerão em um modal especial durante o sorteio.",
            settingsSponsorNumberLabel: "Nº",
            settingsSponsorNameLabel: "Nome do Patrocinador",
            settingsSponsorImageLabel: "Imagem do Patrocinador",
            settingsBingoTitleLabel: "Título do Grito de Vitória",
            settingsBingoTitleDescription: "Mude o 'BINGO!' para 'AJUDE!'. Isso também altera as letras no painel.",
            settingsBoardColorLabel: "Cor de Fundo da Cartela",
            settingsBoardColorDescription: "Cor base dos números não sorteados.",
            settingsBoardColorResetButton: "Limpar Cor",
            settingsDrawnNumberTitle: "Aparência do Número Sorteado",
            settingsDrawnTextColorLabel: "Cor do Texto (Letra e Número)",
            settingsDrawnStrokeColorLabel: "Cor da Borda (Contorno)",
            settingsDrawnStrokeWidthLabel: "Largura da Borda",
            settingsModalAutocloseTitle: "Fechamento Automático do Modal",
            settingsModalAutocloseEnable: "Fechar modais de sorteio automaticamente",
            settingsModalAutocloseTimeLabel: "Tempo de Exibição",
            settingsTestDataButton: "Gerar Vencedores de Teste",
            settingsCloseSaveButton: "Fechar e Salvar"
        };


        // --- Variáveis Locais ---
        const LOCAL_STORAGE_KEY = 'bingoShowState';

        // --- Seletores de Elementos ---
        const DOMElements = {
            mainTitle: document.getElementById('main-title'),
            version: document.getElementById('version'),
            lastUpdated: document.getElementById('last-updated'),
            clearRoundBtnTop: document.getElementById('clear-round-btn-top'),
            clearRoundBtnBottom: document.getElementById('clear-round-btn-bottom'),
            currentNumberEl: document.getElementById('current-number'),
            prizeDrawDisplayContainer: document.getElementById('prize-draw-display-container'),
            mainDisplayLabel: document.getElementById('main-display-label'),
            bingoBoardEl: document.getElementById('bingo-board'),
            bingoBoardWrapper: document.getElementById('bingo-board-wrapper'),
            manualInputForm: document.getElementById('manual-input-form') as HTMLFormElement,
            letterInput: document.getElementById('letter-input') as HTMLInputElement,
            numberInput: document.getElementById('number-input') as HTMLInputElement,
            errorMessageEl: document.getElementById('error-message'),
            winnersContainer: document.getElementById('winners-container'),
            shareBtn: document.getElementById('share-btn'),
            endEventBtn: document.getElementById('end-event-btn'),
            resetEventBtn: document.getElementById('reset-event-btn'),
            intervalBtn: document.getElementById('interval-btn'),
            editMenuBtn: document.getElementById('edit-menu-btn'),
            lastNumbersDisplay: document.getElementById('last-numbers-display'),
            gamesListEl: document.getElementById('games-list'),
            addExtraGameBtn: document.getElementById('add-extra-game-btn'),
            prizeDrawForm: document.getElementById('prize-draw-form') as HTMLFormElement,
            checkDrawnPrizesBtn: document.getElementById('check-drawn-prizes-btn'),
            noRepeatPrizeDrawCheckbox: document.getElementById('no-repeat-prize-draw') as HTMLInputElement,
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
            finalWinnersModal: document.getElementById('final-winners-modal'),
            changelogModal: document.getElementById('changelog-modal'),
            showDonationModalBtn: document.getElementById('show-donation-modal-btn'),
            showChangelogBtn: document.getElementById('show-changelog-btn'),
            showSettingsBtn: document.getElementById('show-settings-btn'),
            settingsModal: document.getElementById('settings-modal'),
            activeRoundPanel: document.getElementById('active-round-panel'),
            noActiveRoundPanel: document.getElementById('no-active-round-panel'),
            currentNumberWrapper: document.getElementById('current-number-wrapper'),
            auctionForm: document.getElementById('auction-form') as HTMLFormElement,
            roundEditModal: document.getElementById('round-edit-modal'),
        };
        const confettiCtx = DOMElements.confettiCanvas.getContext('2d');

function renderCustomLogo() {
    const headerLogoContainer = document.getElementById('app-logo');
    if (!headerLogoContainer) return;

    if (appConfig.customLogoBase64) {
        headerLogoContainer.innerHTML = `<img id="header-logo" src="${appConfig.customLogoBase64}" alt="Logo do Evento" class="w-full h-full object-contain">`;
    } else {
        headerLogoContainer.innerHTML = ''; 
    }
    
    const settingsPreview = document.getElementById('custom-logo-preview') as HTMLImageElement;
    if (settingsPreview) {
        settingsPreview.src = appConfig.customLogoBase64 || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    }
}

function renderShortcutsLegend() {
    const container = document.getElementById('shortcuts-legend-list');
    if (!container) return;

    container.innerHTML = ''; 

    const shortcutMap: { [key in keyof typeof appConfig.shortcuts]: keyof typeof appLabels } = {
        autoDraw: 'shortcutLabelAutoDraw',
        verify: 'shortcutLabelVerify',
        clearRound: 'shortcutLabelClearRound',
        drawPrize: 'shortcutLabelDrawPrize',
        registerPrize: 'shortcutLabelRegisterPrize',
        sellAuction: 'shortcutLabelSellAuction',
        showInterval: 'shortcutLabelShowInterval',
    };

    for (const key in appConfig.shortcuts) {
        const shortcutKey = key as keyof typeof appConfig.shortcuts;
        const labelKey = shortcutMap[shortcutKey];
        if (labelKey && appLabels[labelKey]) {
            const legendItem = document.createElement('li');
            legendItem.className = 'flex justify-between items-center';
            
            const labelSpan = document.createElement('span');
            labelSpan.textContent = `${appLabels[labelKey]}:`;

            const keySpan = document.createElement('span');
            keySpan.className = 'font-mono bg-gray-700 text-sky-300 rounded px-2 py-1';
            keySpan.textContent = appConfig.shortcuts[shortcutKey];

            legendItem.appendChild(labelSpan);
            legendItem.appendChild(keySpan);
            container.appendChild(legendItem);
        }
    }
}


function updateAuctionBidDisplay(bid: number) {
    const displayEl = document.getElementById('auction-current-bid-display');
    if (displayEl) {
        displayEl.textContent = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(bid);
        displayEl.classList.remove('animate-bid-update');
        void displayEl.offsetWidth; 
        displayEl.classList.add('animate-bid-update');
    }
}

function incrementAuctionBid(amount: number) {
    const bidInput = document.getElementById('auction-item-current-bid') as HTMLInputElement;
    if (bidInput) {
        const currentBid = parseInt(bidInput.value, 10) || 0;
        const newBid = currentBid + amount;
        bidInput.value = newBid.toString();
        updateAuctionBidDisplay(newBid);

        const feedbackContainer = document.getElementById('bid-feedback-container');
        if (feedbackContainer && amount !== 0) {
            const feedbackEl = document.createElement('span');
            const isPositive = amount > 0;
            feedbackEl.textContent = `${isPositive ? '+' : ''} ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}`;
            feedbackEl.className = `bid-feedback-animation ${isPositive ? 'text-green-400' : 'text-red-500'}`;
            feedbackContainer.appendChild(feedbackEl);
            setTimeout(() => feedbackEl.remove(), 1000); 
        }
    }
}


function populateSettingsLabelsTab() {
    const container = document.getElementById('labels-form-container');
    if (!container) return;

    container.innerHTML = '';

    Object.keys(appLabels).forEach(key => {
        const labelKey = key as keyof typeof appLabels;

        const wrapper = document.createElement('div');
        wrapper.className = 'flex flex-col';

        const label = document.createElement('label');
        label.htmlFor = `label-input-${labelKey}`;
        label.className = 'text-sm font-bold text-slate-400 mb-1';
        label.textContent = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `label-input-${labelKey}`;
        input.value = appLabels[labelKey];
        input.className = 'bg-gray-900 text-white p-2 rounded-lg text-sm focus:ring-sky-500 focus:border-sky-500';

        input.addEventListener('change', (e) => {
            appLabels[labelKey] = (e.target as HTMLInputElement).value;
            debouncedSave();
        });

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        container.appendChild(wrapper);
    });
}

function populateSettingsShortcutsTab() {
    const container = document.getElementById('shortcuts-form-container');
    if (!container) return;

    container.innerHTML = '';

    const shortcutMap: { [key in keyof typeof appConfig.shortcuts]: keyof typeof appLabels } = {
        autoDraw: 'shortcutLabelAutoDraw',
        verify: 'shortcutLabelVerify',
        clearRound: 'shortcutLabelClearRound',
        drawPrize: 'shortcutLabelDrawPrize',
        registerPrize: 'shortcutLabelRegisterPrize',
        sellAuction: 'shortcutLabelSellAuction',
        showInterval: 'shortcutLabelShowInterval',
    };

    Object.keys(appConfig.shortcuts).forEach(key => {
        const shortcutKey = key as keyof typeof appConfig.shortcuts;
        const labelKey = shortcutMap[shortcutKey];

        const wrapper = document.createElement('div');
        wrapper.className = 'flex flex-col sm:flex-row sm:items-center sm:justify-between';

        const label = document.createElement('label');
        label.htmlFor = `shortcut-input-${shortcutKey}`;
        label.className = 'text-base font-medium text-slate-300 mb-1 sm:mb-0';
        label.textContent = appLabels[labelKey];

        const input = document.createElement('input');
        input.type = 'text';
        input.readOnly = true;
        input.id = `shortcut-input-${shortcutKey}`;
        input.value = appConfig.shortcuts[shortcutKey];
        input.className = 'bg-gray-900 text-center text-sky-300 font-mono p-2 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer w-full sm:w-auto';

        input.addEventListener('focus', () => {
            input.value = 'Pressione a nova tecla...';
        });
        input.addEventListener('blur', () => {
            input.value = appConfig.shortcuts[shortcutKey];
        });

        input.addEventListener('keydown', (e) => {
            e.preventDefault();
            
            if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
                return;
            }

            let shortcutString = '';
            if (e.ctrlKey) shortcutString += 'Control+';
            if (e.altKey) shortcutString += 'Alt+';
            if (e.shiftKey) shortcutString += 'Shift+';
            
            let key = e.key;
            if (key === ' ') {
                key = 'Space';
            } else if (key.length === 1) {
                key = key.toUpperCase();
            } else {
                key = key.charAt(0).toUpperCase() + key.slice(1);
            }
            
            shortcutString += key;
            
            input.value = shortcutString;
            appConfig.shortcuts[shortcutKey] = shortcutString;
            renderShortcutsLegend();
            debouncedSave();
            input.blur(); 
        });


        wrapper.appendChild(label);
        wrapper.appendChild(input);
        container.appendChild(wrapper);
    });
}
        // --- Funções de Template HTML ---
        function getModalTemplates() {
            return {
                verification: `<div id="verification-modal-content" class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-7xl w-full text-center flex flex-col h-[90vh]">
                                   <div class="flex-shrink-0 flex justify-between items-center mb-2">
                                       <h2 class="text-3xl font-bold text-white" data-label-key="verificationModalTitle">${appLabels.verificationModalTitle}</h2>
                                       <div class="flex items-center gap-2">
                                           <button id="zoom-out-btn-verification" class="bg-gray-700 w-10 h-10 rounded-full font-bold text-2xl">-</button>
                                           <span id="verification-zoom-value" class="font-bold text-lg w-16 text-center">100%</span>
                                           <button id="zoom-in-btn-verification" class="bg-gray-700 w-10 h-10 rounded-full font-bold text-2xl">+</button>
                                       </div>
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
                floatingNumber: `<div class="modal-content text-center flex flex-col items-center justify-center p-4">
                                    <div id="floating-number-display-wrapper" class="transition-transform duration-300 flex items-center justify-center" style="width: 420px; height: 420px;">
                                        <div id="floating-number-display" class="font-black text-white flex justify-center items-center w-full h-full gap-x-2 sm:gap-x-4 mx-auto rounded-full shadow-inner my-4 animate-bounce-in" style="font-size: 240px; line-height: 1; text-shadow: 2px 2px 5px #000;"></div>
                                    </div>
                                    <div class="flex-shrink-0 mt-4 flex flex-col items-center z-10">
                                         <div class="my-2 max-w-xs mx-auto w-full flex items-center justify-center gap-2">
                                           <button id="zoom-out-btn-floating" class="bg-gray-700 w-10 h-10 rounded-full font-bold text-2xl">-</button>
                                           <span id="floating-number-zoom-value" class="font-bold text-lg w-16 text-center">100%</span>
                                           <button id="zoom-in-btn-floating" class="bg-gray-700 w-10 h-10 rounded-full font-bold text-2xl">+</button>
                                       </div>
                                        <button id="close-floating-btn" class="mt-2 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-full text-lg">${appLabels.modalBackButton}</button>
                                    </div>
                                </div>`,
                sponsorDisplay: `<div class="modal-content text-center flex flex-col items-center justify-center p-4">
                                    <div id="sponsor-display-content-wrapper" class="bg-gray-800 p-8 rounded-2xl shadow-2xl transition-transform duration-300 w-full max-w-7xl">
                                        <div id="sponsor-display-content" class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-items-center">
                                            <div id="sponsor-number-display" class="font-black text-white flex justify-center items-center gap-x-4 rounded-full shadow-inner animate-bounce-in w-[500px] h-[500px] text-[300px]"></div>
                                            <div id="sponsor-info-display" class="flex flex-col items-center justify-center animate-fade-in-up p-4">
                                                <img id="sponsor-image" src="" class="max-w-full max-h-[450px] object-contain rounded-lg shadow-lg mb-6">
                                                <p id="sponsor-name" class="font-bold text-amber-400 text-[52px]"></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex-shrink-0 mt-4 flex flex-col items-center z-10">
                                         <div class="my-2 max-w-xs mx-auto w-full flex items-center justify-center gap-2">
                                           <button id="zoom-out-btn-sponsor" class="bg-gray-700 w-10 h-10 rounded-full font-bold text-2xl">-</button>
                                           <span id="sponsor-display-zoom-value" class="font-bold text-lg w-16 text-center">100%</span>
                                           <button id="zoom-in-btn-sponsor" class="bg-gray-700 w-10 h-10 rounded-full font-bold text-2xl">+</button>
                                       </div>
                                        <button id="close-sponsor-display-btn" class="mt-2 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-full text-lg">${appLabels.modalBackButton}</button>
                                    </div>
                                </div>`,
                winner: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-2xl w-full text-center relative">
                            <div id="winner-countdown-timer" class="absolute top-4 right-4 bg-gray-900 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl border-2 border-sky-500">20</div>
                            <h1 id="winner-title-display" class="text-7xl sm:text-8xl font-black text-amber-400" style="text-shadow: 0 0 20px #f59e0b;"></h1>
                            <div id="winner-prize-display" class="my-6">
                                <p id="game-text-winner" class="text-2xl font-bold text-sky-400"></p>
                                <p id="prize-text-winner" class="text-3xl font-bold text-yellow-400 mt-1"></p>
                            </div>
                            <input type="text" id="winner-name-input" placeholder="${appLabels.winnerModalNamePlaceholder}" class="w-full text-center text-2xl font-bold p-4 border-2 border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                            <button id="register-winner-btn" class="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-10 rounded-full text-xl">${appLabels.winnerModalRegisterButton}</button>
                            <p class="text-xs text-slate-400 mt-4">Pressione ENTER para registrar ou ESC para cancelar</p>
                         </div>`,
                alert: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center"><h2 class="text-2xl font-bold text-red-500 mb-4">${appLabels.alertModalTitle}</h2><p id="custom-alert-message" class="text-slate-300 text-lg"></p><button id="custom-alert-close-btn" class="mt-8 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-full text-lg">${appLabels.alertModalOkButton}</button></div>`,
                congrats: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-2xl w-full text-center"><h2 class="text-5xl font-black text-yellow-400">${appLabels.congratsModalTitle}</h2><div id="congrats-winner-name" contenteditable="true" class="text-4xl font-bold text-white my-4 focus:outline-none focus:ring-2 ring-amber-500 rounded-lg px-2"></div><div id="congrats-prize-value" contenteditable="true" class="text-2xl text-slate-300 mb-6 focus:outline-none focus:ring-2 ring-amber-500 rounded-lg px-2"></div><p class="text-2xl text-sky-300 mt-4">${appLabels.congratsModalMessage}</p><button id="close-congrats-modal-btn" class="mt-8 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-full text-lg">${appLabels.congratsModalCloseButton}</button></div>`,
                eventBreak: `<div class="modal-content bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full h-full text-center flex flex-col justify-between">
                                <header class="flex-shrink-0">
                                    <h2 id="event-break-title" class="text-6xl font-black text-sky-400">${appLabels.intervalModalTitle}</h2>
                                </header>
                                <main class="flex-grow my-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden">
                                    <div id="break-left-column" class="flex flex-col items-center justify-center bg-black/20 p-6 rounded-xl">
                                        <h3 id="break-left-title" class="text-5xl font-bold text-amber-400 mb-6">Cardápio</h3>
                                        <div id="break-left-content" class="text-7xl font-black text-white text-center transition-opacity duration-500 opacity-0"></div>
                                    </div>
                                    <div id="break-right-column" class="flex flex-col items-center justify-center bg-black/20 p-6 rounded-xl">
                                        <h3 id="break-right-title" class="text-5xl font-bold text-amber-400 mb-6">Apoio</h3>
                                        <div id="break-right-content" class="text-7xl font-black text-white text-center transition-opacity duration-500 opacity-0"></div>
                                    </div>
                                </main>
                                <footer class="flex-shrink-0 flex justify-between items-center w-full">
                                    <div id="break-clock" class="text-4xl font-bold text-slate-300"></div>
                                    <button id="close-break-modal-btn" class="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-full text-lg">${appLabels.modalBackButton}</button>
                                </footer>
                             </div>`,
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
                drawnPrizes: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-3xl w-full text-center"><h2 id="drawn-prizes-title" class="text-3xl font-bold text-white">${appLabels.drawnPrizesModalTitle}</h2><p id="drawn-prizes-subtitle" class="text-xl font-bold text-yellow-400 mb-6"></p><div id="drawn-prizes-list" class="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto flex flex-wrap gap-3 justify-center mb-6"></div><button id="close-drawn-prizes-btn" class="mt-8 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-full text-lg">${appLabels.modalCloseButton}</button></div>`,
                donation: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center"><h2 class="text-3xl font-black text-amber-400 mb-6">${appLabels.donationModalTitle}</h2><p class="text-slate-300 mb-4">${appLabels.donationModalDescription}</p><div class="space-y-6 text-left"><div class="text-center border-b border-gray-700 pb-6"><p class="text-lg font-bold text-white mb-4">${appLabels.donationModalPaypalLabel}</p><div class="flex justify-center"><form action="https://www.paypal.com/donate" method="post" target="_top"><input type="hidden" name="hosted_button_id" value="FLVDNY994MNQS" /><input type="image" src="https://www.paypalobjects.com/pt_BR/BR/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Faça doações com o botão do PayPal" /></form></div></div><div class="pt-6"><p class="text-lg font-bold text-white mb-2">${appLabels.donationModalPixLabel}</p><div class="flex flex-col items-center"><div id="pix-key-display" contenteditable="false" class="bg-gray-700 text-white p-3 rounded-lg text-center text-sm font-mono select-all cursor-text max-w-full overflow-hidden whitespace-nowrap overflow-ellipsis"></div><button id="copy-pix-btn" class="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all">${appLabels.donationModalCopyButton}</button></div></div></div><button id="close-donation-btn" class="mt-8 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-full text-lg">${appLabels.modalCloseButton}</button></div>`,
                finalWinners: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-5xl w-full text-center h-[95vh] flex flex-col justify-between">
                                <h2 id="end-title" class="text-5xl font-black text-yellow-400 mb-4 flex-shrink-0">${appLabels.finalWinnersModalTitle}</h2>
                                <div id="end-winner-display" class="flex-grow flex items-center justify-center p-4 min-h-[150px]">
                                    <div id="current-winner-card" class="bg-gray-700 p-8 rounded-xl shadow-2xl w-full max-w-2xl text-center transform scale-90 opacity-0 transition-all duration-500"></div>
                                </div>
                                <!-- Seção de Patrocinadores -->
                                <div id="final-sponsors-section" class="flex-shrink-0 my-4">
                                    <h3 class="text-2xl font-bold text-slate-300 mb-3">Agradecimento aos Patrocinadores</h3>
                                    <div id="final-sponsors-list" class="bg-gray-900 p-3 rounded-lg max-h-40 overflow-y-auto flex flex-wrap justify-center gap-4">
                                        <!-- Lista de patrocinadores aqui -->
                                    </div>
                                </div>
                                <div class="mt-4 flex flex-col items-center gap-2 flex-shrink-0">
                                    <div class="flex justify-center gap-4 w-full max-w-md">
                                        <button id="generate-proof-final-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-8 rounded-full text-lg">${appLabels.finalWinnersModalProofButton}</button>
                                        <button id="close-final-modal-btn" class="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-8 rounded-full text-lg">${appLabels.modalCloseButton}</button>
                                    </div>
                                    <button id="donation-final-btn" class="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all shadow-lg w-full max-w-xs">${appLabels.finalWinnersModalSupportButton}</button>
                                </div>
                               </div>`,
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
                                <div class="flex items-center gap-4">
                                    <img id="custom-logo-preview" src="" alt="Pré-visualização do Logo" class="w-24 h-24 bg-gray-700 rounded-lg object-contain border border-gray-600">
                                    <div class="flex-grow">
                                        <label for="custom-logo-upload" class="block text-sm font-medium text-slate-300 mb-2">Selecione uma imagem</label>
                                        <input type="file" id="custom-logo-upload" accept="image/png, image/jpeg, image/gif, image/webp" class="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100">
                                    </div>
                                </div>
                                <button id="remove-custom-logo-btn" class="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg text-sm">${appLabels.settingsLogoRemoveButton}</button>
                            </div>
                             <div class="border-b border-gray-700 pb-6">
                                <h3 class="text-xl font-bold text-slate-300 mb-2">${appLabels.settingsModalAutocloseTitle}</h3>
                                <div class="flex items-center gap-3 bg-gray-700 p-3 rounded-lg mb-4">
                                    <input type="checkbox" id="enable-modal-autoclose" class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                                    <label for="enable-modal-autoclose" class="text-slate-200 font-medium">${appLabels.settingsModalAutocloseEnable}</label>
                                </div>
                                <div>
                                    <label for="modal-autoclose-timer" class="block text-sm font-bold text-slate-400 mb-1">${appLabels.settingsModalAutocloseTimeLabel} (<span id="modal-autoclose-value">5</span>s)</label>
                                    <input type="range" id="modal-autoclose-timer" min="3" max="15" value="5" class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg">
                                </div>
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
                            <div class="border-b border-gray-700 pb-6 mb-6">
                               <h3 class="text-xl font-bold text-slate-300 mb-2" data-label-key="settingsGlobalSponsorTitle">${appLabels.settingsGlobalSponsorTitle}</h3>
                               <p class="text-sm text-slate-400 mb-4" data-label-key="settingsGlobalSponsorDescription">${appLabels.settingsGlobalSponsorDescription}</p>
                               <div class="flex items-center gap-4">
                                   <img id="global-sponsor-preview" src="" alt="Pré-visualização do Patrocinador Global" class="w-24 h-24 bg-gray-900 rounded-lg object-contain border border-gray-600">
                                   <div class="flex-grow space-y-2">
                                       <div>
                                           <label for="global-sponsor-name" class="block text-sm font-medium text-slate-300 mb-1">Nome do Patrocinador Global</label>
                                           <input type="text" id="global-sponsor-name" class="block w-full text-sm p-2 bg-gray-900 text-white rounded-lg">
                                       </div>
                                       <div>
                                            <label for="global-sponsor-upload" class="block text-sm font-medium text-slate-300 mb-1">Imagem do Patrocinador Global</label>
                                           <input type="file" id="global-sponsor-upload" accept="image/*" class="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100">
                                       </div>
                                   </div>
                               </div>
                           </div>
                           <h3 class="text-xl font-bold text-slate-300">${appLabels.settingsSponsorsByNumberTitle}</h3>
                           <div class="flex items-center gap-3 bg-gray-700 p-3 rounded-lg">
                                <input type="checkbox" id="enable-sponsors-by-number-checkbox" class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                                <label for="enable-sponsors-by-number-checkbox" class="text-slate-200 font-medium">${appLabels.settingsSponsorsByNumberEnable}</label>
                           </div>
                           <p class="text-sm text-slate-400">${appLabels.settingsSponsorsByNumberDescription}</p>
                           <div id="sponsors-by-number-container" class="space-y-1"></div>
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
                </div>`,
                roundEdit: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full">
                    <h2 id="round-edit-title" class="text-3xl font-bold text-white mb-6">Editar Rodada</h2>
                    <div class="space-y-4">
                        <div id="round-edit-prizes-container" class="space-y-4">
                            <!-- Inputs de prêmios serão inseridos dinamicamente aqui -->
                        </div>
                        <div>
                            <label for="round-edit-description" class="block text-sm font-medium text-slate-400 mb-1">Descrição da Rodada (Opcional)</label>
                            <textarea id="round-edit-description" class="w-full h-24 bg-gray-900 text-white p-2 rounded-lg text-sm focus:ring-sky-500 focus:border-sky-500" placeholder="Ex: Rodada especial em prol da construção..."></textarea>
                        </div>
                    </div>
                    <div class="flex justify-end gap-4 mt-8">
                        <button id="cancel-round-edit-btn" class="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-full">${appLabels.modalCancelButton}</button>
                        <button id="save-round-edit-btn" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-full">${appLabels.modalSaveButton}</button>
                    </div>
                </div>`
            };
        }
        
        function getAppState() {
            const state = {
                gamesData,
                gameCount,
                activeGameNumber,
                menuItems,
                drawnPrizeNumbers,
                versionText: currentVersion,
                versionHistory,
                appConfig,
                appLabels,
            };
            return state;
        }

        function loadAppState(state: any) {
            gamesData = state.gamesData || {};
            gameCount = state.gameCount || 6;
            activeGameNumber = state.activeGameNumber || null;
            menuItems = state.menuItems || [ "Refrigerante - R$ 5,00", "Cerveja - R$ 7,00", "Água - R$ 3,00", "Espetinho - R$ 8,00", "Pastel - R$ 6,00", "Porção de Fritas - R$ 15,00" ];
            drawnPrizeNumbers = state.drawnPrizeNumbers || [];
            versionHistory = state.versionHistory || versionHistory;
            const loadedConfig = state.appConfig || {};
            appConfig = { ...appConfig, ...loadedConfig };
            const loadedLabels = state.appLabels || {};
            appLabels = { ...appLabels, ...loadedLabels };
        }
        
        const debouncedSave = () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                saveStateToLocalStorage();
            }, 1000); 
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
                    description: i === 3 ? 'Esta é uma rodada de teste com descrição.' : '',
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

            const savePromise = saveStateToLocalStorage();
            savePromise.then(() => {
                showAlert("Dados de teste gerados com sucesso! O aplicativo será recarregado com o novo histórico.");
                DOMElements.settingsModal.classList.add('hidden');
                setTimeout(() => window.location.reload(), 1500);
            });
        }
        
        // --- Funções Auxiliares ---

function triggerConfetti(options = {}) {
    const defaults = {
        particleCount: 150,
        spread: 180,
        origin: { y: 0.6 },
        zIndex: 1000,
    };
    if (typeof confetti === 'function') {
        confetti({ ...defaults, ...options });
    }
}

function triggerBingoWinConfetti() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    if (confettiAnimationId) {
        clearInterval(confettiAnimationId);
    }

    const interval = setInterval(function() {
        if (typeof confetti !== 'function') {
             clearInterval(interval);
             return;
        }
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
    confettiAnimationId = interval as unknown as number;
}

function applyBoardZoom(scale: number) {
    const wrapper = DOMElements.bingoBoardWrapper;
    const zoomValueEl = document.getElementById('board-zoom-value');
    if (wrapper) {
        wrapper.style.transform = `scale(${scale / 100})`;
    }
    if (zoomValueEl) {
        zoomValueEl.textContent = `${scale}%`;
    }
    renderMasterBoard(); 
}

function applyDisplayZoom(scale: number) {
    const wrapper = DOMElements.currentNumberWrapper;
    const zoomValueEl = document.getElementById('display-zoom-value');
    if (wrapper) {
        wrapper.style.transform = `scale(${scale / 100})`;
    }
     if (zoomValueEl) {
        zoomValueEl.textContent = `${scale}%`;
    }
}

        const fileToBase64 = (file: File): Promise<string> =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });
            
        function applyLabels() {
            for (const key in appLabels) {
                const elements = document.querySelectorAll(`[data-label-key="${key}"]`);
                elements.forEach(el => {
                    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
                        el.placeholder = appLabels[key as keyof typeof appLabels];
                    } else if (el.tagName === 'LABEL') {
                        const textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                        if (textNode) textNode.textContent = appLabels[key as keyof typeof appLabels];
                    }
                    else {
                        el.textContent = appLabels[key as keyof typeof appLabels];
                    }
                });
            }
             renderAppName();
            (document.getElementById('no-active-round-panel') as HTMLElement).textContent = appLabels.activeRoundIndicatorDefault;
            
            document.querySelectorAll('.prize-input-label').forEach((label, index) => {
                label.textContent = `${appLabels[('prize' + (index % 3 + 1) + 'Label') as keyof typeof appLabels]}:`;
            });
            renderUpdateInfo(); 
        }

        function hexToRgba(hex: string, alpha = 1) {
            if (!hex || !/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return null;
            let c: any = hex.substring(1).split('');
            if (c.length === 3) { c = [c[0], c[0], c[1], c[1], c[2], c[2]]; }
            c = '0x' + c.join('');
            return `rgba(${(c >> 16) & 255}, ${(c >> 8) & 255}, ${c & 255}, ${alpha})`;
        }

        function isLightColor(hex: string) {
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

        function updateProgramTitle() {
            document.title = "Bingo Show";
        }

        function renderAppName() {
            const mainTitle = `Bingo Show`;
            DOMElements.mainTitle.innerHTML = `${mainTitle}<span id="subtitle-version" class="block text-xl sm:text-2xl text-slate-300 font-normal"></span>`;
        }
        
        function renderUpdateInfo() {
            const now = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
            if (document.getElementById('version')) document.getElementById('version')!.innerText = currentVersion;
            const subtitle = document.getElementById('subtitle-version');
            if (subtitle) subtitle.innerText = `Versão ${currentVersion}`;
            if (DOMElements.lastUpdated) DOMElements.lastUpdated.innerText = `Salvo localmente às: ${now}`;
        }
        
        // --- Funções de Salvamento ---
        const DB_NAME = 'BingoShowDB';
        const STORE_NAME = 'sponsorImages';
        let dbPromise: Promise<IDBDatabase>;

        function openDb() {
            if (!dbPromise) {
                dbPromise = new Promise((resolve, reject) => {
                    const request = indexedDB.open(DB_NAME, 1);
                    request.onerror = () => reject("Error opening IndexedDB.");
                    request.onsuccess = () => resolve(request.result);
                    request.onupgradeneeded = (event) => {
                        const db = (event.target as IDBOpenDBRequest).result;
                        if (!db.objectStoreNames.contains(STORE_NAME)) {
                            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                        }
                    };
                });
            }
            return dbPromise;
        }

        async function saveSponsorImage(id: string, image: string) {
            const db = await openDb();
            return new Promise<void>((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.put({ id, image });
                request.onsuccess = () => resolve();
                request.onerror = () => reject("Failed to save image to IndexedDB.");
            });
        }

        async function loadSponsorImages() {
            try {
                const db = await openDb();
                return new Promise<void>((resolve, reject) => {
                    const transaction = db.transaction(STORE_NAME, 'readonly');
                    const store = transaction.objectStore(STORE_NAME);
                    const request = store.getAll();

                    request.onsuccess = () => {
                        const images = request.result;
                        images.forEach(item => {
                            if (item.id === 'global' && appConfig.globalSponsor) {
                                appConfig.globalSponsor.image = item.image;
                            }
                            else if (appConfig.sponsorsByNumber[item.id]) {
                                appConfig.sponsorsByNumber[item.id].image = item.image;
                            }
                        });
                        resolve();
                    };
                    request.onerror = () => reject("Failed to load images from IndexedDB.");
                });
            } catch (error) {
                console.error("Could not initialize IndexedDB for loading images:", error);
            }
        }

        function saveStateToFile() {
            try {
                const appState = getAppState();
                const stateString = JSON.stringify(appState, null, 2); 
                const blob = new Blob([stateString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
        
                const a = document.createElement('a');
                a.href = url;
                const date = new Date().toISOString().slice(0, 10); 
                a.download = `bingo-show-backup-${date}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showAlert("Backup salvo com sucesso no seu computador!");
        
            } catch (error) {
                console.error("Falha ao salvar o estado em arquivo:", error);
                showAlert("Ocorreu um erro ao tentar salvar o backup.");
            }
        }
        
        function loadStateFromFile(event: Event) {
            const input = event.target as HTMLInputElement;
            if (!input.files || input.files.length === 0) {
                return;
            }
        
            const file = input.files[0];
            const reader = new FileReader();
        
            reader.onload = (e) => {
                try {
                    const result = e.target?.result as string;
                    if (!result) throw new Error("Arquivo vazio ou ilegível.");
                    
                    const loadedState = JSON.parse(result);
                    
                    if (!loadedState.gamesData || !loadedState.appConfig) {
                         throw new Error("O arquivo selecionado não parece ser um backup válido do Bingo Show.");
                    }
        
                    loadAppState(loadedState);
                    renderUIFromState();
                    applyLabels();
                    debouncedSave();
                    showAlert("Backup carregado com sucesso! O evento foi restaurado.");
        
                } catch (error: any) {
                    console.error("Falha ao carregar estado do arquivo:", error);
                    showAlert(`Erro ao carregar o arquivo: ${error.message}`);
                } finally {
                    input.value = '';
                }
            };
        
            reader.onerror = () => {
                showAlert("Não foi possível ler o arquivo selecionado.");
                 input.value = '';
            };
        
            reader.readAsText(file);
        }

        async function saveStateToLocalStorage() {
            try {
                const appState = getAppState();
                const stateToStore = JSON.parse(JSON.stringify(appState));
        
                // Lidar com imagens de patrocinadores individuais e global
                const imageSavePromises: Promise<void>[] = [];
                if (stateToStore.appConfig && stateToStore.appConfig.sponsorsByNumber) {
                    for (const num in stateToStore.appConfig.sponsorsByNumber) {
                        const sponsor = stateToStore.appConfig.sponsorsByNumber[num];
                        if (sponsor.image && sponsor.image.startsWith('data:image')) {
                            imageSavePromises.push(saveSponsorImage(num, sponsor.image));
                            delete sponsor.image;
                        }
                    }
                }
                if (stateToStore.appConfig && stateToStore.appConfig.globalSponsor) {
                    const globalSponsor = stateToStore.appConfig.globalSponsor;
                    if (globalSponsor.image && globalSponsor.image.startsWith('data:image')) {
                         imageSavePromises.push(saveSponsorImage('global', globalSponsor.image));
                         delete globalSponsor.image;
                    }
                }
                
                await Promise.all(imageSavePromises);
                
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToStore));
                renderUpdateInfo();
            } catch (error) {
                console.error("Falha ao salvar estado no localStorage:", error);
            }
        }
        
        async function loadStateFromLocalStorage(): Promise<boolean> {
            try {
                const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
                if (savedState) {
                    const appState = JSON.parse(savedState);
                    loadAppState(appState);
                    await loadSponsorImages();
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Falha ao carregar estado do localStorage:", error);
                return false;
            }
        }
        
        async function loadInitialState() {
            let stateLoaded = false;
            let forceSave = false;
        
            stateLoaded = await loadStateFromLocalStorage();
        
            if (!stateLoaded || Object.keys(gamesData).length === 0) {
                console.log("Nenhum estado salvo encontrado. Inicializando com dados padrão.");
                gameCount = 6;
                gamesData = {};
                for (let i = 1; i <= gameCount; i++) {
                    gamesData[i] = {
                        prizes: {
                            prize1: predefinedPrizes[i - 1]?.prize1 || '',
                            prize2: predefinedPrizes[i - 1]?.prize2 || '',
                            prize3: predefinedPrizes[i - 1]?.prize3 || ''
                        },
                        description: '',
                        calledNumbers: [],
                        winners: [],
                        isComplete: false,
                        color: roundColors[(i-1) % roundColors.length],
                    };
                }
                forceSave = true; 
            }
        
            appConfig.tutorialVideoLink = 'https://youtu.be/8iOOW-CR-WQ?si=Jolrp2qR38xhY5EZ';
            appConfig.paypalLink = 'https://www.paypal.com/donate/?hosted_button_id=WJBLF3LV3RZRW';
            appConfig.pixKey = '1e8e4af0-4d23-440c-9f3d-b4e527f65911';
        
            applyLabels();
            updateProgramTitle();
            renderUIFromState();
            
            if (forceSave) {
                debouncedSave();
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
                        updateGameItemUI(gameEl, gamesData[gameNum].isComplete);
                    }
                }
            }
        
            renderAllWinners();
            renderShortcutsLegend();
        
            if (Object.values(gamesData).some(game => (game as any).winners && (game as any).winners.length > 0)) {
                DOMElements.shareBtn.classList.remove('hidden');
                DOMElements.endEventBtn.classList.remove('hidden');
            }
        
            const boardZoomSlider = document.getElementById('board-zoom-slider') as HTMLInputElement;
            const displayZoomSlider = document.getElementById('display-zoom-slider') as HTMLInputElement;
            if (boardZoomSlider) boardZoomSlider.value = appConfig.boardScale.toString();
            if (displayZoomSlider) displayZoomSlider.value = appConfig.displayScale.toString();
            applyBoardZoom(appConfig.boardScale);
            applyDisplayZoom(appConfig.displayScale);
        
            DOMElements.noRepeatPrizeDrawCheckbox.checked = true;
        
            document.querySelectorAll('.game-item').forEach(el => el.classList.remove('active-round-highlight'));
            if (activeGameNumber && gamesData[activeGameNumber]) {
                const activeGameItem = DOMElements.gamesListEl.querySelector(`.game-item[data-game-number="${activeGameNumber}"]`);
                if (activeGameItem) {
                    activeGameItem.classList.add('active-round-highlight');
                    const playBtn = activeGameItem.querySelector('.play-btn');
                    if (playBtn) {
                        playBtn.textContent = 'Jogando...';
                        playBtn.classList.add('playing-btn');
                    }
                }
                loadRoundState(activeGameNumber);
            } else {
                loadRoundState(null);
            }
        }

        // --- Funções do Jogo ---

        function announceNumber(number: number) {
            if (!activeGameNumber) {
                showAlert("Por favor, selecione uma rodada clicando em 'Jogar' para iniciar.");
                return;
            }
            const game = gamesData[activeGameNumber];
            if (!game) {
                console.error(`Erro: Rodada ativa ${activeGameNumber} não encontrada.`);
                return;
            }
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
            DOMElements.prizeDrawDisplayContainer.classList.add('hidden'); 
            
            const mainColor = appConfig.drawnTextColor;
            const strokeColor = appConfig.drawnTextStrokeColor;
            const strokeWidth = appConfig.drawnTextStrokeWidth;
            let strokeStyle = `${strokeWidth}px ${strokeColor}`;
            
            const roundColor = gamesData[activeGameNumber]?.color;
            currentNumberEl.style.backgroundColor = roundColor || (appConfig.boardColor !== 'default' ? appConfig.boardColor : '#f1f5f9');
            
            currentNumberEl.style.color = mainColor;
            currentNumberEl.style.webkitTextStroke = strokeStyle; 

            currentNumberEl.innerHTML = `<span>${letter}</span><span>${number}</span>`;
            currentNumberEl.style.visibility = 'visible';

            currentNumberEl.classList.remove('animate-bounce-in');
            void currentNumberEl.offsetWidth; 
            currentNumberEl.classList.add('animate-bounce-in');
            
            updateMasterBoardCell(number);
            updateLastNumbers(letter, number, true);
            updateActiveRoundStats();
            
            DOMElements.numberInput.value = '';
            DOMElements.letterInput.value = '';
            debouncedSave();
        }

        function showFloatingNumber(number: number) {
            if (!activeGameNumber) {
                showAlert("Por favor, selecione uma rodada clicando em 'Jogar' para iniciar.");
                return;
            }
            const game = gamesData[activeGameNumber];
            if (!game) {
                console.error(`Erro: Rodada ativa ${activeGameNumber} não encontrada.`);
                return;
            }

            if (game.calledNumbers.includes(number)) {
                showError(`O número ${number} já foi anunciado.`);
                return;
            }

            const individualSponsor = appConfig.sponsorsByNumber[number];
            const globalSponsor = appConfig.globalSponsor;

            if (appConfig.enableSponsorsByNumber && individualSponsor && individualSponsor.image) {
                showSponsorDisplayModal(number, individualSponsor);
            } else if (appConfig.enableSponsorsByNumber && globalSponsor && globalSponsor.image) {
                showSponsorDisplayModal(number, globalSponsor);
            }
            else {
                showClassicFloatingNumberModal(number);
            }
        }

        function showClassicFloatingNumberModal(number: number) {
            DOMElements.floatingNumberModal.innerHTML = getModalTemplates().floatingNumber;
            const game = gamesData[activeGameNumber!];
            if (!game) {
                 console.error(`Rodada ativa ${activeGameNumber} não encontrada.`);
                 DOMElements.floatingNumberModal.classList.add('hidden');
                 return;
            }

            const floatingNumberDisplay = document.getElementById('floating-number-display') as HTMLElement;
            const displayWrapper = document.getElementById('floating-number-display-wrapper') as HTMLElement;
            const zoomValue = document.getElementById('floating-number-zoom-value')!;
            const closeFloatingBtn = document.getElementById('close-floating-btn')!;
            const zoomOutBtn = document.getElementById('zoom-out-btn-floating')!;
            const zoomInBtn = document.getElementById('zoom-in-btn-floating')!;

            const letter = getLetterForNumber(number);
            const roundColor = game.color;
            const mainColor = appConfig.drawnTextColor;
            const strokeColor = appConfig.drawnTextStrokeColor;
            const strokeWidth = appConfig.drawnTextStrokeWidth;
            let strokeStyle = `${strokeWidth}px ${strokeColor}`;
            let bgColorStyle = `background-color: ${roundColor || '#0ea5e9'};`;
            
            floatingNumberDisplay.innerHTML = `<span>${letter}</span><span>${number}</span>`;
            floatingNumberDisplay.style.cssText += `color: ${mainColor}; -webkit-text-stroke: ${strokeStyle}; ${bgColorStyle}`;
            
            const applyZoom = (scale: number) => {
                displayWrapper.style.transform = `scale(${scale / 100})`;
                if (zoomValue) zoomValue.textContent = `${scale}%`;
                appConfig.floatingNumberZoom = scale;
            };

            const adjustZoom = (amount: number) => {
                 const newZoom = Math.max(50, Math.min(200, appConfig.floatingNumberZoom + amount));
                 applyZoom(newZoom);
                 debouncedSave();
            };

            const initialZoom = appConfig.floatingNumberZoom || 100;
            applyZoom(initialZoom);

            zoomInBtn.addEventListener('click', () => adjustZoom(5));
            zoomOutBtn.addEventListener('click', () => adjustZoom(-5));

            DOMElements.floatingNumberModal.classList.remove('hidden');
            closeFloatingBtn.addEventListener('click', () => {
                DOMElements.floatingNumberModal.classList.add('hidden');
                clearTimeout(floatingNumberTimeout as ReturnType<typeof setTimeout>);
                announceNumber(number);
            });
            clearTimeout(floatingNumberTimeout as ReturnType<typeof setTimeout>);

            if (appConfig.enableModalAutoclose) {
                floatingNumberTimeout = setTimeout(() => {
                    DOMElements.floatingNumberModal.classList.add('hidden');
                    announceNumber(number);
                }, appConfig.modalAutocloseSeconds * 1000);
            }
        }

        function showSponsorDisplayModal(number: number, sponsor: any) {
            DOMElements.sponsorDisplayModal.innerHTML = getModalTemplates().sponsorDisplay;
            
            const game = gamesData[activeGameNumber!];
            if (!game) {
                 console.error(`Rodada ativa ${activeGameNumber} não encontrada.`);
                 DOMElements.sponsorDisplayModal.classList.add('hidden');
                 return;
            }

            const numberDisplay = document.getElementById('sponsor-number-display') as HTMLElement;
            const imageEl = document.getElementById('sponsor-image') as HTMLImageElement;
            const nameEl = document.getElementById('sponsor-name') as HTMLElement;
            const closeBtn = document.getElementById('close-sponsor-display-btn')!;
            const zoomValue = document.getElementById('sponsor-display-zoom-value')!;
            const displayWrapper = document.getElementById('sponsor-display-content-wrapper') as HTMLElement;
            const zoomOutBtn = document.getElementById('zoom-out-btn-sponsor')!;
            const zoomInBtn = document.getElementById('zoom-in-btn-sponsor')!;

            const letter = getLetterForNumber(number);
            const roundColor = game.color;
            const mainColor = appConfig.drawnTextColor;
            const strokeColor = appConfig.drawnTextStrokeColor;
            const strokeWidth = appConfig.drawnTextStrokeWidth;
            const strokeStyle = `${strokeWidth}px ${strokeColor}`;
            const bgColorStyle = `background-color: ${roundColor || '#0ea5e9'};`;

            numberDisplay.innerHTML = `<span>${letter}</span><span>${number}</span>`;
            numberDisplay.style.cssText += `line-height: 1; text-shadow: 2px 2px 5px #000; color: ${mainColor}; -webkit-text-stroke: ${strokeStyle}; ${bgColorStyle}`;

            imageEl.src = sponsor.image;
            nameEl.textContent = sponsor.name || 'Patrocinador';
            
            const applyZoom = (scale: number) => {
                displayWrapper.style.transform = `scale(${scale / 100})`;
                if (zoomValue) zoomValue.textContent = `${scale}%`;
                appConfig.sponsorDisplayZoom = scale;
            };

            const adjustZoom = (amount: number) => {
                 const newZoom = Math.max(50, Math.min(200, appConfig.sponsorDisplayZoom + amount));
                 applyZoom(newZoom);
                 debouncedSave();
            };

            const initialZoom = appConfig.sponsorDisplayZoom || 100;
            applyZoom(initialZoom);

            zoomInBtn.addEventListener('click', () => adjustZoom(5));
            zoomOutBtn.addEventListener('click', () => adjustZoom(-5));


            DOMElements.sponsorDisplayModal.classList.remove('hidden');

            const closeModal = () => {
                DOMElements.sponsorDisplayModal.classList.add('hidden');
                clearTimeout(floatingNumberTimeout as ReturnType<typeof setTimeout>);
                announceNumber(number);
            };

            closeBtn.addEventListener('click', closeModal);
            clearTimeout(floatingNumberTimeout as ReturnType<typeof setTimeout>);

            if (appConfig.enableModalAutoclose) {
                const sponsorDuration = (appConfig.modalAutocloseSeconds + 3) * 1000; 
                floatingNumberTimeout = setTimeout(closeModal, sponsorDuration); 
            }
        }

        function handleAutoDraw() {
            if (!activeGameNumber) {
                showAlert("Selecione uma rodada para o sorteio automático.");
                return;
            }
            const game = gamesData[activeGameNumber];
            if (!game) {
                console.error(`Erro: Rodada ativa ${activeGameNumber} não encontrada.`);
                return;
            }

            const allNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
            const availableNumbers = allNumbers.filter(num => !game.calledNumbers.includes(num));

            if (availableNumbers.length === 0) {
                showAlert("Todos os números já foram sorteados nesta rodada!");
                return;
            }
            
            document.querySelectorAll('[data-label-key="autoDrawButton"]').forEach(btn => (btn as HTMLButtonElement).disabled = true);

            DOMElements.spinningWheelModal.innerHTML = getModalTemplates().spinningWheel;
            DOMElements.spinningWheelModal.classList.remove('hidden');

            const cycloneEl = document.getElementById('number-cyclone')!;
            const cageEl = document.getElementById('bingo-cage') as HTMLElement;
            const ballContainer = document.getElementById('drawn-ball-container') as HTMLElement;
            const skipBtn = document.getElementById('skip-animation-btn') as HTMLElement;
            const closeBtn = document.getElementById('close-drawn-btn') as HTMLElement;

            cycloneEl.innerHTML = '';
            const particles = Math.min(availableNumbers.length, 50);
            for (let i = 0; i < particles; i++) {
                const particle = document.createElement('div');
                particle.className = 'number-cyclone-particle text-2xl';
                particle.textContent = availableNumbers[i % availableNumbers.length].toString();
                const anim = Math.ceil(Math.random() * 4);
                particle.style.animation = `fly-in-cage-${anim} ${3 + Math.random() * 4}s ${Math.random() * -2}s alternate infinite`;
                cycloneEl.appendChild(particle);
            }

            const finishAnimation = (drawnNumber: number) => {
                clearTimeout(spinTimeout);
                if(cycloneInterval) clearInterval(cycloneInterval);
                const letter = getLetterForNumber(drawnNumber);
                
                const finalColor = appConfig.drawnTextColor;
                const finalStroke = `${appConfig.drawnTextStrokeWidth}px ${appConfig.drawnTextStrokeColor}`;
                const roundColor = gamesData[activeGameNumber!]?.color;
                const revealColor = roundColor || (appConfig.boardColor !== 'default' && appConfig.boardColor !== '#FFFFFF' ? appConfig.boardColor : '#10b981');
                
                ballContainer.innerHTML = `<div class="font-black flex justify-center items-center gap-x-2 sm:gap-x-4 w-64 h-64 sm:w-96 sm:h-96 rounded-full shadow-inner ball-fall-in" style="font-size: clamp(8rem, 40vw, 25rem); line-height: 1; background-color: ${revealColor}; color: ${finalColor}; -webkit-text-stroke: ${finalStroke}; text-shadow: none;"><span>${letter}</span><span>${drawnNumber}</span></div>`;
                
                cageEl.style.animationPlayState = 'paused';
                cageEl.style.opacity = '0.3';
                ballContainer.style.opacity = '1';
                skipBtn.style.display = 'none';
                closeBtn.style.display = 'block';

                closeBtn.onclick = () => {
                    DOMElements.spinningWheelModal.classList.add('hidden');
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
            if (!game) return;
            const numberIndex = game.calledNumbers.indexOf(number);
            if (numberIndex === -1) return;
            game.calledNumbers.splice(numberIndex, 1);
            const cell = document.getElementById(`master-cell-${number}`) as HTMLElement;
            if (cell) {
                cell.classList.remove('text-white', 'scale-125', 'text-gray-900');
                cell.style.backgroundColor = ''; 
                cell.style.transform = '';
                const activeRoundColor = gamesData[activeGameNumber]?.color;

                if (activeRoundColor) {
                    cell.style.backgroundColor = hexToRgba(activeRoundColor, 0.25)!;
                    cell.classList.add('text-slate-200');
                } else if (appConfig.boardColor !== 'default') {
                    cell.style.backgroundColor = appConfig.boardColor;
                    cell.classList.add(isLightColor(appConfig.boardColor) ? 'text-gray-900' : 'text-white');
                } else {
                    cell.classList.add('bg-gray-700', 'text-slate-300');
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
            updateActiveRoundStats();
            debouncedSave();
        }

        function startNewRound() {
            if (!activeGameNumber) {
                showAlert("Selecione uma rodada clicando em 'Jogar' primeiro.");
                return;
            }
            const game = gamesData[activeGameNumber];
            if (!game) {
                console.error(`Erro: Rodada ativa ${activeGameNumber} não encontrada.`);
                return;
            }
            game.calledNumbers = [];
            loadRoundState(activeGameNumber);
            debouncedSave();
        }

        function loadRoundState(gameNumber: string | null) {
            clearInterval(clockInterval);
            if (gameNumber === null) {
                activeGameNumber = null;
                DOMElements.activeRoundPanel.classList.add('hidden');
                DOMElements.noActiveRoundPanel.classList.remove('hidden');
                (DOMElements.currentNumberEl as HTMLElement).style.visibility = 'hidden';
                 DOMElements.prizeDrawDisplayContainer.classList.add('hidden');
                DOMElements.lastNumbersDisplay.innerHTML = '';
                clearMasterBoard(false);
                return;
            }
            
            activeGameNumber = gameNumber;
            const game = gamesData[gameNumber];

            if (!game) {
                console.error(`Tentativa de carregar estado para uma rodada inexistente: ${gameNumber}`);
                loadRoundState(null); 
                return;
            }
            
            DOMElements.noActiveRoundPanel.classList.add('hidden');
            DOMElements.activeRoundPanel.classList.remove('hidden');

            const nameEl = document.getElementById('active-round-name')!;
            const dateEl = document.getElementById('active-round-date')!;
            const timeEl = document.getElementById('active-round-time')!;
            const prizesEl = document.getElementById('active-round-prizes')!;
            const descriptionContainer = document.getElementById('active-round-description-display')!;
            
            nameEl.textContent = `Rodada ${gameNumber}`;
            prizesEl.innerHTML = '';
            
            const createPrizeEl = (label: string, value: string) => {
                if (!value) return null;
                const p = document.createElement('p');
                p.className = 'text-base';
                p.innerHTML = `<span class="font-bold text-slate-300">${label}:</span> <span class="text-amber-300">${value}</span>`;
                return p;
            };

            const prize1 = createPrizeEl(appLabels.prize1Label, game.prizes.prize1);
            const prize2 = createPrizeEl(appLabels.prize2Label, game.prizes.prize2);
            const prize3 = createPrizeEl(appLabels.prize3Label, game.prizes.prize3);
            if (prize1) prizesEl.appendChild(prize1);
            if (prize2) prizesEl.appendChild(prize2);
            if (prize3) prizesEl.appendChild(prize3);

            if (game.description) {
                (descriptionContainer.querySelector('.marquee-text') as HTMLElement).textContent = game.description;
                descriptionContainer.classList.remove('hidden');
            } else {
                descriptionContainer.classList.add('hidden');
            }
            
            const updateClock = () => {
                const now = new Date();
                dateEl.textContent = now.toLocaleDateString('pt-BR');
                timeEl.textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            };
            updateClock();
            clockInterval = setInterval(updateClock, 1000);

            updateActiveRoundStats();
            
            (DOMElements.currentNumberEl as HTMLElement).style.visibility = 'hidden';
            DOMElements.prizeDrawDisplayContainer.classList.add('hidden');
            DOMElements.errorMessageEl.textContent = '';
            DOMElements.lastNumbersDisplay.innerHTML = '';
            DOMElements.numberInput.value = '';
            DOMElements.letterInput.value = '';

            clearMasterBoard(true);
            game.calledNumbers.forEach((num: number) => updateMasterBoardCell(num));
            
            const lastFive = game.calledNumbers.slice(-5).reverse();
            lastFive.forEach((num: number) => {
                const letter = getLetterForNumber(num);
                updateLastNumbers(letter!, num, false);
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

        function updateActiveRoundStats() {
            if (!activeGameNumber) return;
            const game = gamesData[activeGameNumber];
            if (!game) return;
            const countEl = document.getElementById('active-round-called-count')!;
            countEl.textContent = `${game.calledNumbers.length} / 75`;
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
                    
                    if (appConfig.enableSponsorsByNumber && appConfig.sponsorsByNumber[i] && appConfig.sponsorsByNumber[i].image) {
                         cell.classList.add('has-sponsor');
                    }

                    cell.addEventListener('click', () => {
                        if (!activeGameNumber) {
                            showAlert("Por favor, selecione uma rodada clicando em 'Jogar' para iniciar.");
                            return;
                        }
                        const game = gamesData[activeGameNumber];
                        if (!game) return;
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
                    cell.classList.remove('scale-125', 'text-gray-900', 'text-slate-200', 'text-white');
                    cell.style.backgroundColor = '';
                    cell.style.transform = '';
                    cell.className = 'bingo-cell flex items-center justify-center font-black rounded-full transition-all duration-300';

                    if (applyCustomColor && activeRoundColor) {
                        cell.style.backgroundColor = hexToRgba(activeRoundColor, 0.25)!; 
                        cell.classList.add('text-slate-200');
                    } else if (applyCustomColor && appConfig.boardColor !== 'default') {
                        cell.style.backgroundColor = appConfig.boardColor;
                        cell.classList.add(isLightColor(appConfig.boardColor) ? 'text-gray-900' : 'text-white');
                    } else {
                        cell.classList.add('bg-gray-700', 'text-slate-300');
                    }
                    if (appConfig.enableSponsorsByNumber && appConfig.sponsorsByNumber[i] && appConfig.sponsorsByNumber[i].image) {
                         cell.classList.add('has-sponsor');
                    }
                }
            }
        }

        function updateMasterBoardCell(number: number) {
            const cell = document.getElementById(`master-cell-${number}`) as HTMLElement;
            if (cell) {
                cell.classList.remove('bg-gray-700', 'text-slate-300', 'text-gray-900', 'text-white');
                cell.style.backgroundColor = ''; 
                const activeRoundColor = (activeGameNumber && gamesData[activeGameNumber]?.color) ? gamesData[activeGameNumber].color : '#16a34a'; 
                cell.style.backgroundColor = activeRoundColor;
                cell.classList.add(isLightColor(activeRoundColor) ? 'text-gray-900' : 'text-white', 'scale-125');
                cell.style.transform = `scale(${(appConfig.boardScale / 100) * 1.1})`;
            }
        }
        
        function updateLastNumbers(letter: string, number: number, shouldAddToState: boolean) {
            if (shouldAddToState && activeGameNumber) {
                const game = gamesData[activeGameNumber];
                if (!game) return;
                game.calledNumbers.push(number);
            }
            DOMElements.lastNumbersDisplay.innerHTML = '';
            if (!activeGameNumber || !gamesData[activeGameNumber]) return;

            const lastFive = gamesData[activeGameNumber].calledNumbers.slice(-5).reverse();
            lastFive.forEach((num: number) => {
                const l = getLetterForNumber(num);
                const numberEl = document.createElement('div');
                numberEl.className = 'bg-gray-700 text-slate-100 font-bold rounded-lg w-24 h-16 flex items-center justify-center text-3xl shadow-md';
                numberEl.textContent = `${l}-${num}`;
                DOMElements.lastNumbersDisplay.appendChild(numberEl);
            });
        }
        
        function showError(message: string) {
            DOMElements.errorMessageEl.textContent = message;
            DOMElements.errorMessageEl.classList.add('animate-shake-error');
            setTimeout(() => {
                DOMElements.errorMessageEl.textContent = '';
                DOMElements.errorMessageEl.classList.remove('animate-shake-error');
            }, 3000);
        }

        // --- Funções da Interface (UI) ---

        function createGameElement(gameNumber: number, prizes: { prize1: string, prize2: string, prize3: string }) {
            const gameItem = document.createElement('div');
            gameItem.className = 'game-item bg-gray-700 p-4 rounded-xl shadow-lg transition-all duration-300 ease-in-out border border-transparent';
            gameItem.dataset.gameNumber = gameNumber.toString();

            const header = document.createElement('div');
            header.className = 'flex justify-between items-center';
            const title = document.createElement('h3');
            title.className = 'text-lg font-bold text-white';
            title.textContent = `Rodada ${gameNumber}`;

            const controlsWrapper = document.createElement('div');
            controlsWrapper.className = 'flex items-center gap-2';

            const colorPicker = document.createElement('input');
            colorPicker.type = 'color';
            colorPicker.className = 'w-8 h-8 p-0 border-2 border-gray-600 rounded-full cursor-pointer';
            colorPicker.value = gamesData[gameNumber]?.color || '#FFFFFF'; 
            colorPicker.addEventListener('input', (e) => {
                const newColor = (e.target as HTMLInputElement).value;
                gamesData[gameNumber].color = newColor;
                if (activeGameNumber === gameNumber.toString()) {
                    loadRoundState(activeGameNumber);
                }
                debouncedSave();
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.title = `Excluir Rodada ${gameNumber}`;
            deleteBtn.className = 'text-lg hover:text-red-500 transition-colors';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                confirmDeleteRound(gameNumber.toString());
            });

            controlsWrapper.appendChild(colorPicker);
            controlsWrapper.appendChild(deleteBtn);
            header.appendChild(title);
            header.appendChild(controlsWrapper);

            const prizesContainer = document.createElement('div');
            prizesContainer.className = 'mt-2 space-y-1';
            
            Object.keys(prizes).forEach((prizeKey, index) => {
                const prizeInputWrapper = document.createElement('div');
                prizeInputWrapper.className = 'flex items-center gap-2';
                
                const label = document.createElement('label');
                label.className = 'text-xs font-bold text-slate-400 prize-input-label';
                label.textContent = `${appLabels[('prize' + (index + 1) + 'Label') as keyof typeof appLabels]}:`;

                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'prize-input w-full text-sm font-bold p-1 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500';
                input.value = prizes[prizeKey as keyof typeof prizes];
                input.dataset.prizeKey = prizeKey;
                input.addEventListener('change', (e) => {
                    gamesData[gameNumber].prizes[prizeKey as keyof typeof prizes] = (e.target as HTMLInputElement).value;
                    debouncedSave();
                });
                prizeInputWrapper.appendChild(label);
                prizeInputWrapper.appendChild(input);
                prizesContainer.appendChild(prizeInputWrapper);
            });
            
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'mt-3';
            
            gameItem.appendChild(header);
            gameItem.appendChild(prizesContainer);
            gameItem.appendChild(buttonContainer);
            return gameItem;
        }

        function addExtraGame() {
            gameCount++;
            gamesData[gameCount] = {
                prizes: { prize1: '', prize2: '', prize3: '' },
                description: '',
                calledNumbers: [],
                winners: [],
                isComplete: false,
                color: roundColors[(gameCount - 1) % roundColors.length]
            };
            const gameEl = createGameElement(gameCount, gamesData[gameCount].prizes);
            gameEl.classList.add('animate-fade-in-down'); 
            DOMElements.gamesListEl.prepend(gameEl); 
            updateGameItemUI(gameEl, false);
            debouncedSave();
        }

        function confirmDeleteRound(gameNumber: string) {
            DOMElements.deleteConfirmModal.innerHTML = getModalTemplates().deleteConfirm;
            (document.getElementById('delete-confirm-message') as HTMLElement).textContent = `Tem certeza que deseja excluir a Rodada ${gameNumber}? Esta ação não pode ser desfeita.`;
            (document.getElementById('confirm-delete-btn') as HTMLElement).textContent = "Excluir Rodada";
            DOMElements.deleteConfirmModal.classList.remove('hidden');
        
            document.getElementById('confirm-delete-btn')!.addEventListener('click', () => {
                delete gamesData[gameNumber];
                
                const gameEl = document.querySelector(`.game-item[data-game-number="${gameNumber}"]`);
                if (gameEl) {
                    gameEl.remove();
                }
        
                if (activeGameNumber === gameNumber) {
                    activeGameNumber = null;
                    loadRoundState(null); 
                }
        
                DOMElements.deleteConfirmModal.classList.add('hidden');
                debouncedSave();
            });
            
            document.getElementById('cancel-delete-btn')!.addEventListener('click', () => {
                DOMElements.deleteConfirmModal.classList.add('hidden');
            });
        }
        
        function getLetterForNumber(number: number): string | null {
            const lettersToCheck = appConfig.bingoTitle === 'AJUDE' ? DYNAMIC_LETTERS_AJUDE : DYNAMIC_LETTERS;
            const baseLetters = DYNAMIC_LETTERS; 
            
            for (let i = 0; i < baseLetters.length; i++) {
                const baseLetter = baseLetters[i];
                const displayLetter = lettersToCheck[i];
                const config = BINGO_CONFIG[baseLetter as keyof typeof BINGO_CONFIG];
                if (number >= config.min && number <= config.max) {
                    return displayLetter;
                }
            }
            return null;
        }

        function showVerificationPanel() {
            if (!activeGameNumber) {
                showAlert("Nenhuma rodada ativa para verificar.");
                return;
            }
            const game = gamesData[activeGameNumber];
            if (!game) {
                console.error(`Erro: Rodada ativa ${activeGameNumber} não encontrada.`);
                return;
            }
            if (game.calledNumbers.length === 0) {
                showAlert("Nenhum número foi sorteado nesta rodada.");
                return;
            }

            DOMElements.verificationModal.innerHTML = getModalTemplates().verification;
            const verificationNumbersContainer = document.getElementById('verification-numbers') as HTMLElement;
            const zoomValue = document.getElementById('verification-zoom-value')!;
            const zoomInBtn = document.getElementById('zoom-in-btn-verification')!;
            const zoomOutBtn = document.getElementById('zoom-out-btn-verification')!;
            
            verificationNumbersContainer.innerHTML = '';
            
            const sortedNumbers = [...game.calledNumbers].sort((a, b) => a - b);

            const applyZoom = (scale: number) => {
                const baseSize = 96; 
                const baseFontSize = 48; 
                const newSize = Math.round(baseSize * (scale / 100));
                const newFontSize = Math.round(baseFontSize * (scale / 100));
                
                verificationNumbersContainer.querySelectorAll('.verification-number').forEach(el => {
                    const htmlEl = el as HTMLElement;
                    htmlEl.style.width = `${newSize}px`;
                    htmlEl.style.height = `${newSize}px`;
                    htmlEl.style.fontSize = `${newFontSize}px`;
                });
                
                if (zoomValue) zoomValue.textContent = `${scale}%`;
                appConfig.verificationPanelZoom = scale;
            };
            
            const adjustZoom = (amount: number) => {
                const newZoom = Math.max(50, Math.min(200, appConfig.verificationPanelZoom + amount));
                applyZoom(newZoom);
                debouncedSave();
            };


            sortedNumbers.forEach((num: number) => {
                const letter = getLetterForNumber(num);
                const numberEl = document.createElement('div');
                numberEl.className = 'verification-number flex items-center justify-center font-black rounded-full transition-colors duration-200 cursor-pointer bg-gray-700 text-slate-200';
                numberEl.dataset.number = num.toString();
                numberEl.innerHTML = `<span>${letter}</span><span class="ml-1">${num}</span>`;
                
                numberEl.addEventListener('click', () => {
                    numberEl.classList.toggle('bg-green-500');
                    numberEl.classList.toggle('text-white');
                    numberEl.classList.toggle('bg-gray-700');
                    numberEl.classList.toggle('text-slate-200');
                });
                verificationNumbersContainer.appendChild(numberEl);
            });

            const initialZoom = appConfig.verificationPanelZoom || 100;
            applyZoom(initialZoom);

            zoomInBtn.addEventListener('click', () => adjustZoom(5));
            zoomOutBtn.addEventListener('click', () => adjustZoom(-5));
            
            DOMElements.verificationModal.classList.remove('hidden');

            document.getElementById('confirm-prize1-btn')!.addEventListener('click', () => handlePrizeConfirmation('prize1'));
            document.getElementById('confirm-prize2-btn')!.addEventListener('click', () => handlePrizeConfirmation('prize2'));
            document.getElementById('confirm-prize3-btn')!.addEventListener('click', () => handlePrizeConfirmation('prize3'));
            document.getElementById('reject-bingo-btn')!.addEventListener('click', () => DOMElements.verificationModal.classList.add('hidden'));

             const prize1Btn = document.getElementById('confirm-prize1-btn') as HTMLButtonElement;
             const prize2Btn = document.getElementById('confirm-prize2-btn') as HTMLButtonElement;
             const prize3Btn = document.getElementById('confirm-prize3-btn') as HTMLButtonElement;
             
             const hasPrize2Winner = game.winners?.some((w: any) => w.bingoType === 'prize2');

            // Se a Cartela Cheia (prêmio 2) já foi ganha, a rodada terminou. Desabilita outros prêmios.
            if (hasPrize2Winner) {
                prize1Btn.disabled = true;
                prize2Btn.disabled = true;
                prize3Btn.disabled = true;
            } else {
                if (!game.prizes.prize1) prize1Btn.disabled = true;
                if (!game.prizes.prize2) prize2Btn.disabled = true;
                if (!game.prizes.prize3) prize3Btn.disabled = true;
            }
        }

        function handlePrizeConfirmation(bingoType: 'prize1' | 'prize2' | 'prize3') {
            DOMElements.verificationModal.classList.add('hidden');
            if (!activeGameNumber) return;
            currentBingoType = bingoType;
            const game = gamesData[activeGameNumber];
            if (!game) return;

            triggerBingoWinConfetti();

            DOMElements.winnerModal.innerHTML = getModalTemplates().winner;
            (document.getElementById('winner-title-display') as HTMLElement).textContent = appLabels.congratsModalTitle;
            (document.getElementById('game-text-winner') as HTMLElement).textContent = `Rodada ${activeGameNumber}`;
            let prizeLabelKey = 'prize1Label';
            if (bingoType === 'prize2') prizeLabelKey = 'prize2Label';
            if (bingoType === 'prize3') prizeLabelKey = 'prize3Label';

            const prizeLabel = appLabels[prizeLabelKey as keyof typeof appLabels];
            (document.getElementById('prize-text-winner') as HTMLElement).textContent = `${prizeLabel}: ${game.prizes[bingoType]}`;

            DOMElements.winnerModal.classList.remove('hidden');

            const winnerNameInput = document.getElementById('winner-name-input') as HTMLInputElement;
            const countdownEl = document.getElementById('winner-countdown-timer')!;
            winnerNameInput.focus();

            let countdown = 20;
            countdownEl.textContent = countdown.toString();
            
            const closeModal = () => {
                clearInterval(countdownInterval);
                window.removeEventListener('keydown', keydownHandler);
                DOMElements.winnerModal.classList.add('hidden');
            };
            
            const registerAndClose = () => {
                registerWinner(winnerNameInput.value);
                closeModal();
            };

            const countdownInterval = setInterval(() => {
                countdown--;
                countdownEl.textContent = countdown.toString();
                if (countdown <= 0) {
                    registerAndClose();
                }
            }, 1000);
            
            const keydownHandler = (e: KeyboardEvent) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    registerAndClose();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    closeModal();
                }
            };
            
            window.addEventListener('keydown', keydownHandler);
            document.getElementById('register-winner-btn')!.addEventListener('click', registerAndClose);
        }
        
        function registerWinner(winnerName: string) {
            if (!winnerName.trim()) {
                showAlert("O nome do ganhador não pode estar vazio.");
                return;
            }
            if (!activeGameNumber || !currentBingoType) return;
            const game = gamesData[activeGameNumber];
            if (!game) return;
            
            const winnerData = {
                id: Date.now(),
                name: winnerName,
                prize: game.prizes[currentBingoType as keyof typeof game.prizes],
                gameNumber: activeGameNumber,
                bingoType: currentBingoType,
                numbers: [...game.calledNumbers] 
            };
            
            if (!game.winners) game.winners = [];
            game.winners.push(winnerData);
            
            const prizeLabelKey = (currentBingoType + 'Label') as keyof typeof appLabels;
            const prizeLabel = appLabels[prizeLabelKey];

            if (currentBingoType === 'prize2' || currentBingoType === 'prize3' || (currentBingoType === 'prize1' && !game.prizes.prize2)) {
                game.isComplete = true;
                const gameEl = document.querySelector(`.game-item[data-game-number="${activeGameNumber}"]`);
                if (gameEl) updateGameItemUI(gameEl, true);
                
                const nextGame = findNextGameNumber();
                 if (nextGame) {
                     setTimeout(() => {
                         const nextGameButton = document.querySelector(`.game-item[data-game-number="${nextGame}"] .play-btn`) as HTMLElement;
                         if (nextGameButton) nextGameButton.click();
                     }, 1000);
                 } else {
                     if (areAllGamesComplete() && !appConfig.isEventClosed) {
                         appConfig.isEventClosed = true;
                         debouncedSave(); 
                         const allWinners = Object.values(gamesData).flatMap(g => (g as any).winners || []).filter(w => w.bingoType !== 'Sorteio').reverse();
                         if (allWinners.length > 0) startFinalWinnerSlide(allWinners);
                     }
                 }
            }

            DOMElements.winnerModal.classList.add('hidden');
            renderAllWinners();
            debouncedSave();
        }

        function renderAllWinners() {
            DOMElements.winnersContainer.innerHTML = '';
            const allWinners = Object.values(gamesData).flatMap(game => (game as any).winners || []).reverse();
            if (allWinners.length > 0) {
                 DOMElements.shareBtn.classList.remove('hidden');
                 DOMElements.endEventBtn.classList.remove('hidden');
            } else {
                 DOMElements.shareBtn.classList.add('hidden');
                 DOMElements.endEventBtn.classList.add('hidden');
            }
            allWinners.forEach(winner => {
                const winnerCard = document.createElement('div');
                winnerCard.className = 'winner-card bg-gray-700 p-3 rounded-lg shadow-md transition-transform transform hover:scale-105';
                winnerCard.dataset.winnerId = winner.id.toString();

                const winnerNameEl = document.createElement('p');
                winnerNameEl.className = 'font-bold text-white text-base';
                winnerNameEl.textContent = winner.name;
                
                const prizeEl = document.createElement('p');
                prizeEl.className = 'text-sm text-yellow-400';
                
                if (winner.bingoType === 'Sorteio') {
                    prizeEl.textContent = `Brinde: ${winner.prize || 'Não especificado'}`;
                } else if (winner.bingoType === 'Leilão') {
                     prizeEl.textContent = `Leilão: ${winner.itemName} (R$ ${winner.bid})`;
                } else {
                    const prizeLabelKey = (winner.bingoType + 'Label') as keyof typeof appLabels;
                    const prizeLabel = appLabels[prizeLabelKey] || winner.bingoType;
                    prizeEl.textContent = `Rodada ${winner.gameNumber} - ${prizeLabel}`;
                }

                winnerCard.appendChild(winnerNameEl);
                winnerCard.appendChild(prizeEl);
                DOMElements.winnersContainer.appendChild(winnerCard);

                winnerCard.addEventListener('click', () => openWinnerEditModal(winner));
            });
        }
        
        // --- Funções dos Modals ---

function generateProof(selectedOptions: { [key: string]: boolean }) {
    let proofContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Prova do Evento - ${document.title}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .no-print { display: none; }
                }
                .break-inside-avoid { page-break-inside: avoid; }
            </style>
        </head>
        <body class="bg-gray-100 text-gray-800 font-sans p-8">
            <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <header class="text-center border-b pb-4 mb-8">
                    <h1 class="text-4xl font-bold">Bingo Show - Prova do Evento</h1>
                    <p class="text-gray-600">Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
                </header>
                <main>`;

    const sortedGameKeys = Object.keys(gamesData).sort((a, b) => {
        if (a === 'Brindes' || a === 'Leilão') return 1;
        if (b === 'Brindes' || b === 'Leilão') return -1;
        return parseInt(a) - parseInt(b);
    });

    for (const gameKey of sortedGameKeys) {
        if (selectedOptions[gameKey]) {
            const game = gamesData[gameKey];
            if (!game) continue;

            if (!isNaN(parseInt(gameKey))) { 
                proofContent += `
                    <section class="mb-8 break-inside-avoid">
                        <h2 class="text-2xl font-bold text-sky-700 border-b-2 border-sky-200 pb-2 mb-4">Rodada ${gameKey}</h2>
                        <div class="grid grid-cols-2 gap-x-8">
                            <div>
                                <h3 class="font-bold text-lg mb-2">Prêmios:</h3>
                                <ul class="list-disc list-inside">
                                    ${game.prizes.prize1 ? `<li><strong>${appLabels.prize1Label}:</strong> ${game.prizes.prize1}</li>` : ''}
                                    ${game.prizes.prize2 ? `<li><strong>${appLabels.prize2Label}:</strong> ${game.prizes.prize2}</li>` : ''}
                                    ${game.prizes.prize3 ? `<li><strong>${appLabels.prize3Label}:</strong> ${game.prizes.prize3}</li>` : ''}
                                </ul>
                            </div>
                             <div>
                                <h3 class="font-bold text-lg mb-2">Vencedores:</h3>
                                ${game.winners && game.winners.length > 0 ?
                                    `<ul class="list-disc list-inside">${game.winners.map((w: any) => `<li><strong>${w.name}</strong> (${appLabels[(w.bingoType + 'Label') as keyof typeof appLabels] || w.bingoType})</li>`).join('')}</ul>` :
                                    '<p class="text-gray-500">Nenhum vencedor registrado.</p>'
                                }
                            </div>
                        </div>
                        <div class="mt-4">
                             <h3 class="font-bold text-lg mb-2">Números Sorteados (${game.calledNumbers.length}):</h3>
                             <div class="flex flex-wrap gap-2 text-sm">
                                ${game.calledNumbers.map((n: number) => `<span class="bg-gray-200 font-mono rounded px-2 py-1">${getLetterForNumber(n)}-${n}</span>`).join(' ')}
                             </div>
                        </div>
                    </section>`;
            } else { 
                 proofContent += `
                    <section class="mb-8 break-inside-avoid">
                        <h2 class="text-2xl font-bold text-amber-700 border-b-2 border-amber-200 pb-2 mb-4">${gameKey}</h2>
                         ${game.winners && game.winners.length > 0 ?
                            `<ul class="list-disc list-inside space-y-1">${game.winners.map((w: any) => {
                                let details = '';
                                if (w.bingoType === 'Sorteio') details = `Cartela: ${w.cartela || 'N/A'}, Brinde: ${w.prize || 'N/A'}`;
                                if (w.bingoType === 'Leilão') details = `Item: ${w.itemName}, Arremate: R$ ${w.bid}`;
                                return `<li><strong>${w.name}:</strong> ${details}</li>`;
                            }).join('')}</ul>` :
                            '<p class="text-gray-500">Nenhum registro.</p>'
                        }
                    </section>`;
            }
        }
    }

    proofContent += `
                </main>
                 <footer class="text-center mt-8 pt-4 border-t">
                    <p class="text-sm text-gray-500">Bingo Show - ${currentVersion}</p>
                </footer>
            </div>
             <div class="no-print max-w-4xl mx-auto text-center mt-4">
                <button onclick="window.print()" class="bg-sky-600 text-white font-bold py-2 px-6 rounded-lg">Imprimir</button>
            </div>
        </body>
        </html>`;

    const proofWindow = window.open('', '_blank');
    if (proofWindow) {
        proofWindow.document.write(proofContent);
        proofWindow.document.close();
    } else {
        showAlert("Não foi possível abrir a janela de prova. Verifique se o seu navegador está bloqueando pop-ups.");
    }
}

function showProofOptions() {
    DOMElements.proofOptionsModal.innerHTML = getModalTemplates().proofOptions;
    const listContainer = document.getElementById('proof-options-list')!;
    listContainer.innerHTML = ''; 

    listContainer.innerHTML = `
        <div class="flex items-center p-2 rounded-lg bg-gray-900 border-b border-gray-700">
            <input id="proof-select-all" type="checkbox" class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
            <label for="proof-select-all" class="ml-3 block text-base font-bold text-white">Selecionar Tudo</label>
        </div>
    `;

    const createCheckbox = (id: string, label: string) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'flex items-center p-2 rounded-lg hover:bg-gray-700';
        wrapper.innerHTML = `
            <input id="proof-option-${id}" name="proof-option" value="${id}" type="checkbox" class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 proof-option-checkbox">
            <label for="proof-option-${id}" class="ml-3 block text-base font-medium text-slate-300">${label}</label>
        `;
        return wrapper;
    };

    const sortedGameNumbers = Object.keys(gamesData).filter(key => !isNaN(parseInt(key))).sort((a, b) => parseInt(a) - parseInt(b));
    sortedGameNumbers.forEach(gameNum => {
        listContainer.appendChild(createCheckbox(gameNum, `Rodada ${gameNum}`));
    });

    if (gamesData['Brindes'] && gamesData['Brindes'].winners && gamesData['Brindes'].winners.length > 0) {
        listContainer.appendChild(createCheckbox('Brindes', 'Sorteio de Brindes'));
    }
    if (gamesData['Leilão'] && gamesData['Leilão'].winners && gamesData['Leilão'].winners.length > 0) {
        listContainer.appendChild(createCheckbox('Leilão', 'Leilão'));
    }

    DOMElements.proofOptionsModal.classList.remove('hidden');

    const selectAllCheckbox = document.getElementById('proof-select-all') as HTMLInputElement;
    const allCheckboxes = listContainer.querySelectorAll('.proof-option-checkbox') as NodeListOf<HTMLInputElement>;
    
    selectAllCheckbox.addEventListener('change', () => {
        allCheckboxes.forEach(cb => {
            cb.checked = selectAllCheckbox.checked;
        });
    });

    document.getElementById('cancel-proof-btn')!.addEventListener('click', () => {
        DOMElements.proofOptionsModal.classList.add('hidden');
    });

    document.getElementById('generate-selected-proof-btn')!.addEventListener('click', () => {
        const selectedOptions: { [key: string]: boolean } = {};
        allCheckboxes.forEach(cb => {
            if (cb.checked) {
                selectedOptions[cb.value] = true;
            }
        });
        
        if (Object.keys(selectedOptions).length === 0) {
            showAlert("Selecione pelo menos uma rodada para gerar a prova.");
            return;
        }

        generateProof(selectedOptions);
        DOMElements.proofOptionsModal.classList.add('hidden');
    });
}

function updateGameItemUI(gameEl: Element, isComplete: boolean) {
    if (!gameEl) return;
    const buttonContainer = gameEl.querySelector('.mt-3');
    if (!buttonContainer) return;
    
    buttonContainer.innerHTML = ''; 

    if (isComplete) {
        gameEl.classList.add('game-completed-style');
        const statusText = document.createElement('p');
        statusText.className = 'text-center text-green-400 font-bold py-2';
        statusText.textContent = 'Concluída';
        
        const reopenBtn = document.createElement('button');
        reopenBtn.textContent = 'Reabrir Rodada';
        reopenBtn.className = 'w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded-lg text-xs transition-all';
        reopenBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const gameNumber = (gameEl as HTMLElement).dataset.gameNumber;
            if (gameNumber && gamesData[gameNumber]) {
                gamesData[gameNumber].isComplete = false;
                updateGameItemUI(gameEl, false);
                debouncedSave();
            }
        });

        buttonContainer.appendChild(statusText);
        buttonContainer.appendChild(reopenBtn);
        (gameEl.querySelectorAll('.prize-input') as NodeListOf<HTMLInputElement>).forEach(input => input.disabled = true);
    } else {
        gameEl.classList.remove('game-completed-style');
        const playBtn = document.createElement('button');
        playBtn.className = 'play-btn w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-transform transform hover:scale-105';
        
        const gameNumber = (gameEl as HTMLElement).dataset.gameNumber;
        if (gameNumber === activeGameNumber) {
             playBtn.textContent = 'Jogando...';
             playBtn.classList.add('playing-btn');
        } else {
            playBtn.textContent = 'Jogar';
        }

        playBtn.addEventListener('click', () => {
            document.querySelectorAll('.game-item').forEach(el => {
                const btn = el.querySelector('.play-btn');
                if (btn) {
                    btn.textContent = 'Jogar';
                    btn.classList.remove('playing-btn');
                }
                el.classList.remove('active-round-highlight');
            });
            
            if (activeGameNumber === gameNumber) {
                activeGameNumber = null;
                loadRoundState(null);
            } else {
                gameEl.classList.add('active-round-highlight');
                playBtn.textContent = 'Jogando...';
                playBtn.classList.add('playing-btn');
                loadRoundState(gameNumber as string);
            }
            debouncedSave();
        });

        buttonContainer.appendChild(playBtn);
        (gameEl.querySelectorAll('.prize-input') as NodeListOf<HTMLInputElement>).forEach(input => input.disabled = false);
    }
}


function openWinnerEditModal(winner: any) {
    DOMElements.winnerEditModal.innerHTML = getModalTemplates().winnerEdit;
    
    const nameInput = document.getElementById('edit-winner-name') as HTMLInputElement;
    const prizeInput = document.getElementById('edit-winner-prize') as HTMLInputElement;

    nameInput.value = winner.name;
    prizeInput.value = winner.prize || (winner.itemName ? `${winner.itemName} (R$ ${winner.bid})` : '');

    DOMElements.winnerEditModal.classList.remove('hidden');

    document.getElementById('save-winner-changes-btn')!.addEventListener('click', () => {
        const game = gamesData[winner.gameNumber];
        if (game && game.winners) {
            const winnerToUpdate = game.winners.find((w: any) => w.id === winner.id);
            if (winnerToUpdate) {
                winnerToUpdate.name = nameInput.value;
                winnerToUpdate.prize = prizeInput.value;
            }
        }
        DOMElements.winnerEditModal.classList.add('hidden');
        renderAllWinners();
        debouncedSave();
    });

    document.getElementById('remove-winner-btn')!.addEventListener('click', () => {
        DOMElements.deleteConfirmModal.innerHTML = getModalTemplates().deleteConfirm;
        (document.getElementById('delete-confirm-message') as HTMLElement).textContent = `Tem certeza que deseja remover o vencedor "${winner.name}"?`;
        DOMElements.deleteConfirmModal.classList.remove('hidden');
        
        document.getElementById('confirm-delete-btn')!.addEventListener('click', () => {
             const game = gamesData[winner.gameNumber];
             if (game && game.winners) {
                 game.winners = game.winners.filter((w: any) => w.id !== winner.id);
             }
             DOMElements.deleteConfirmModal.classList.add('hidden');
             DOMElements.winnerEditModal.classList.add('hidden');
             renderAllWinners();
             debouncedSave();
        });
        
        document.getElementById('cancel-delete-btn')!.addEventListener('click', () => {
            DOMElements.deleteConfirmModal.classList.add('hidden');
        });
    });

    document.getElementById('cancel-winner-edit-btn')!.addEventListener('click', () => {
        DOMElements.winnerEditModal.classList.add('hidden');
    });
}

function startInfiniteConfetti() {
    if (typeof confetti !== 'function') return;
    const defaults = { startVelocity: 25, spread: 360, ticks: 90, zIndex: 999 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    finalConfettiInterval = setInterval(() => {
        const particleCount = 40;
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 } });
    }, 400);
}

function startFinalWinnerSlide(allWinners: any[]) {
    if (allWinners.length === 0) {
        showAlert("Nenhum vencedor de rodada para exibir.");
        return;
    }

    DOMElements.finalWinnersModal.innerHTML = getModalTemplates().finalWinners;
    DOMElements.finalWinnersModal.classList.remove('hidden');
    startInfiniteConfetti();

    const winnerCard = document.getElementById('current-winner-card')!;
    let currentIndex = 0;
    let winnerInterval: any;

    const displayWinner = (index: number) => {
        const winner = allWinners[index];
        if (!winner) return;
        
        const prizeLabelKey = (winner.bingoType + 'Label') as keyof typeof appLabels;
        const prizeLabel = appLabels[prizeLabelKey] || winner.bingoType;

        winnerCard.innerHTML = `
            <p class="text-3xl font-bold text-white mb-2">${winner.name}</p>
            <p class="text-xl text-yellow-400">Rodada ${winner.gameNumber} - ${prizeLabel}</p>
            <p class="text-2xl font-bold text-amber-300 mt-1">${winner.prize}</p>
        `;
        winnerCard.classList.remove('scale-90', 'opacity-0');
        winnerCard.classList.add('scale-100', 'opacity-100');

        setTimeout(() => {
            winnerCard.classList.remove('scale-100', 'opacity-100');
            winnerCard.classList.add('scale-90', 'opacity-0');
        }, 4500);
    };

    const cycleWinners = () => {
        displayWinner(currentIndex);
        currentIndex = (currentIndex + 1) % allWinners.length;
    };
    
    const sponsorsContainer = document.getElementById('final-sponsors-list')!;
    const allSponsors = Object.values(appConfig.sponsorsByNumber).filter(s => s.name || s.image);
    if (appConfig.globalSponsor && (appConfig.globalSponsor.name || appConfig.globalSponsor.image)) {
        allSponsors.unshift(appConfig.globalSponsor);
    }
    const uniqueSponsors = Array.from(new Map(allSponsors.map(item => [item.name, item])).values());


    if (uniqueSponsors.length > 0) {
        uniqueSponsors.forEach(sponsor => {
            if (!sponsor.name && !sponsor.image) return;
            const sponsorEl = document.createElement('div');
            sponsorEl.className = 'flex items-center gap-2 bg-gray-800 p-2 rounded';
            if (sponsor.image) {
                sponsorEl.innerHTML += `<img src="${sponsor.image}" class="w-8 h-8 rounded-full object-cover">`;
            }
            if (sponsor.name) {
                sponsorEl.innerHTML += `<span class="text-sm font-medium text-slate-300">${sponsor.name}</span>`;
            }
            sponsorsContainer.appendChild(sponsorEl);
        });
    } else {
        document.getElementById('final-sponsors-section')!.classList.add('hidden');
    }

    cycleWinners();
    winnerInterval = setInterval(cycleWinners, 5000);

    document.getElementById('close-final-modal-btn')!.addEventListener('click', () => {
        clearInterval(winnerInterval);
        clearInterval(finalConfettiInterval);
        DOMElements.finalWinnersModal.classList.add('hidden');
    });

    document.getElementById('generate-proof-final-btn')!.addEventListener('click', showProofOptions);
    document.getElementById('donation-final-btn')!.addEventListener('click', showDonationModal);
}
        
function showDonationModal() {
    DOMElements.donationModal.innerHTML = getModalTemplates().donation;
    (document.getElementById('pix-key-display') as HTMLElement).textContent = appConfig.pixKey;
    DOMElements.donationModal.classList.remove('hidden');

    document.getElementById('copy-pix-btn')!.addEventListener('click', (e) => {
        navigator.clipboard.writeText(appConfig.pixKey);
        const btn = e.target as HTMLButtonElement;
        const originalText = btn.textContent;
        btn.textContent = 'Copiado!';
        setTimeout(() => { btn.textContent = originalText; }, 2000);
    });

    document.getElementById('close-donation-btn')!.addEventListener('click', () => {
        DOMElements.donationModal.classList.add('hidden');
    });
}

function showMenuEditModal() {
    DOMElements.menuEditModal.innerHTML = getModalTemplates().menuEdit;
    DOMElements.menuEditModal.classList.remove('hidden');

    const textarea = document.getElementById('menu-textarea') as HTMLTextAreaElement;
    textarea.value = menuItems.join('\n');

    document.getElementById('save-menu-btn')!.addEventListener('click', () => {
        menuItems = textarea.value.split('\n').map(item => item.trim()).filter(item => item.length > 0);
        debouncedSave();
        DOMElements.menuEditModal.classList.add('hidden');
    });

    document.getElementById('cancel-menu-edit-btn')!.addEventListener('click', () => {
        DOMElements.menuEditModal.classList.add('hidden');
    });
}

function showChangelogModal() {
    DOMElements.changelogModal.innerHTML = getModalTemplates().changelog;
    const historyContainer = document.getElementById('version-history-content')!;
    
    let htmlContent = versionHistory.trim().split('\n\n').map(block => {
        if (block.startsWith('**v')) {
            return `<h3 class="text-lg font-bold text-sky-400 mt-4 first:mt-0">${block.replace(/\*\*/g, '')}</h3>`;
        }
        return `<ul>${block.split('\n').map(line => `<li class="ml-4 list-disc">${line.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`;
    }).join('');

    historyContainer.innerHTML = htmlContent;
    
    DOMElements.changelogModal.classList.remove('hidden');
    document.getElementById('close-changelog-btn')!.addEventListener('click', () => {
        DOMElements.changelogModal.classList.add('hidden');
    });
}

function populateSettingsSponsorsTab() {
    const container = document.getElementById('sponsors-by-number-container')!;
    const enableCheckbox = document.getElementById('enable-sponsors-by-number-checkbox') as HTMLInputElement;

    // Global Sponsor Elements
    const globalSponsorPreview = document.getElementById('global-sponsor-preview') as HTMLImageElement;
    const globalSponsorNameInput = document.getElementById('global-sponsor-name') as HTMLInputElement;
    const globalSponsorUpload = document.getElementById('global-sponsor-upload') as HTMLInputElement;
    
    if (appConfig.globalSponsor.image) globalSponsorPreview.src = appConfig.globalSponsor.image;
    if (appConfig.globalSponsor.name) globalSponsorNameInput.value = appConfig.globalSponsor.name;
    
    globalSponsorNameInput.addEventListener('change', e => {
        appConfig.globalSponsor.name = (e.target as HTMLInputElement).value;
        debouncedSave();
    });

    globalSponsorUpload.addEventListener('change', async e => {
        const file = (e.target as HTMLInputElement).files![0];
        if (file) {
            const base64 = await fileToBase64(file);
            appConfig.globalSponsor.image = base64;
            globalSponsorPreview.src = base64;
            debouncedSave();
        }
    });


    // Individual Sponsors
    enableCheckbox.checked = appConfig.enableSponsorsByNumber;
    enableCheckbox.addEventListener('change', e => {
        appConfig.enableSponsorsByNumber = (e.target as HTMLInputElement).checked;
        renderMasterBoard();
        debouncedSave();
    });

    container.innerHTML = '';
    for (let i = 1; i <= 75; i++) {
        const sponsor = appConfig.sponsorsByNumber[i] || { name: '', image: '' };
        
        const wrapper = document.createElement('details');
        wrapper.className = 'bg-gray-900 rounded-lg p-2 sponsor-item';
        
        const summary = document.createElement('summary');
        summary.className = 'font-bold text-slate-300 cursor-pointer flex justify-between items-center';
        summary.innerHTML = `<span>${appLabels.settingsSponsorNumberLabel} ${i}</span> <span class="text-xs font-normal text-amber-400" id="sponsor-status-${i}">${sponsor.name || 'Vazio'}</span>`;
        
        const formContent = document.createElement('div');
        formContent.className = 'mt-2 p-2 border-t border-gray-700 space-y-2';

        formContent.innerHTML = `
            <div>
                <label class="text-sm font-medium text-slate-400">${appLabels.settingsSponsorNameLabel}</label>
                <input type="text" value="${sponsor.name}" class="mt-1 w-full text-sm p-1 bg-gray-800 text-white rounded" data-number="${i}" data-field="name">
            </div>
            <div>
                 <label class="text-sm font-medium text-slate-400">${appLabels.settingsSponsorImageLabel}</label>
                <input type="file" accept="image/*" class="mt-1 block w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" data-number="${i}" data-field="image-upload">
                <img src="${sponsor.image}" class="mt-1 h-16 w-16 object-cover rounded bg-gray-700" id="sponsor-preview-${i}" />
            </div>
        `;

        wrapper.appendChild(summary);
        wrapper.appendChild(formContent);
        container.appendChild(wrapper);

        const nameInput = wrapper.querySelector('input[data-field="name"]') as HTMLInputElement;
        const fileInput = wrapper.querySelector('input[data-field="image-upload"]') as HTMLInputElement;
        const previewImg = wrapper.querySelector(`#sponsor-preview-${i}`) as HTMLImageElement;

        nameInput.addEventListener('change', e => {
            const num = (e.target as HTMLElement).dataset.number!;
            if (!appConfig.sponsorsByNumber[num as any]) appConfig.sponsorsByNumber[num as any] = { name: '', image: '' };
            appConfig.sponsorsByNumber[num as any].name = (e.target as HTMLInputElement).value;
            document.getElementById(`sponsor-status-${num}`)!.textContent = appConfig.sponsorsByNumber[num as any].name || 'Vazio';
            debouncedSave();
        });

        fileInput.addEventListener('change', async e => {
            const file = (e.target as HTMLInputElement).files![0];
            const num = (e.target as HTMLElement).dataset.number!;
            if (file) {
                const base64 = await fileToBase64(file);
                if (!appConfig.sponsorsByNumber[num as any]) appConfig.sponsorsByNumber[num as any] = { name: '', image: '' };
                appConfig.sponsorsByNumber[num as any].image = base64;
                previewImg.src = base64;
                renderMasterBoard();
                debouncedSave();
            }
        });
    }
}

function showSettingsModal() {
    DOMElements.settingsModal.innerHTML = getModalTemplates().settings;

    const tabs = ['appearance', 'sponsors', 'labels', 'shortcuts'];
    tabs.forEach(tabId => {
        document.getElementById(`tab-${tabId}`)!.addEventListener('click', () => {
            tabs.forEach(id => {
                const btn = document.getElementById(`tab-${id}`)!;
                btn.classList.remove('border-sky-500', 'text-sky-400');
                btn.classList.add('border-transparent', 'text-gray-400');
            });
            const activeBtn = document.getElementById(`tab-${tabId}`)!;
            activeBtn.classList.add('border-sky-500', 'text-sky-400');
            activeBtn.classList.remove('border-transparent', 'text-gray-400');
            tabs.forEach(id => {
                document.getElementById(`tab-content-${id}`)!.classList.add('hidden');
            });
            document.getElementById(`tab-content-${tabId}`)!.classList.remove('hidden');
        });
    });

    const customLogoPreview = document.getElementById('custom-logo-preview') as HTMLImageElement;
    if (appConfig.customLogoBase64) {
        customLogoPreview.src = appConfig.customLogoBase64;
    }
    document.getElementById('custom-logo-upload')!.addEventListener('change', async (e) => {
        const file = (e.target as HTMLInputElement).files![0];
        if (file) {
            appConfig.customLogoBase64 = await fileToBase64(file);
            customLogoPreview.src = appConfig.customLogoBase64;
            renderCustomLogo();
            debouncedSave();
        }
    });
    document.getElementById('remove-custom-logo-btn')!.addEventListener('click', () => {
        appConfig.customLogoBase64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ29sZEdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkQ3MDA7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQTUwMDtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxmaWx0ZXIgaWQ9Imdsb3ciPgogICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxMCIgcmVzdWx0PSJjb2xvcmVkQmx1ciIvPgogICAgICAgICAgICA8ZmVNZXJnZT4KICAgICAgICAgICAgICAgIDxmZU1lcmdlTm9kZSBpbj0iY29sb3JlZEJsdXIiLz4KICAgICAgICAgICAgICAgIDxmZU1lcmdlTm9kZSBpbj0iU291cmNlR3JhcGhpYyIvPgogICAgICAgICAgICA8L2ZlTWVyZ2U+CiAgICAgICAgPC9maWx0ZXI+CiAgICA8L2RlZnM+CiAgICA8cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0iIzExMTgyNyIgcng9IjUwIiAvPgogICAgPGcgZmlsdGVyPSJ1cmwoI2dsb3cpIj4KICAgICAgICA8dGV4dCB4PSI1MCUiIHk9IjQ1JSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IidJbnRlcicsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIwIiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSJ1cmwoI2dvbGRHcmFkaWVudCkiIGxldHRlci1zcGFjaW5nPSIyIj4KICAgICAgICAgICAgQklOR08KICAgICAgICA8L3RleHQ+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI2NSUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQתYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSInSW50ZXInLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2MCIgZm9udC1zZWlnaHQ9IjkwMCIgZmlsbD0id2hpdGUiIHN0cm9rZT0iI0ZGQTUwMCIgc3Ryb2tlLXdpZHRoPSI0IiBsZXR0ZXItc3BhY2luZz0iNSI+CiAgICAgICAgICAgIFNIT1cKICAgICAgICA8L3RleHQ+CiAgICA8L2c+Cjwvc3ZnPg==';
        customLogoPreview.src = appConfig.customLogoBase64;
        renderCustomLogo();
        debouncedSave();
    });

    const autocloseCheckbox = document.getElementById('enable-modal-autoclose') as HTMLInputElement;
    autocloseCheckbox.checked = appConfig.enableModalAutoclose;
    autocloseCheckbox.addEventListener('change', e => {
        appConfig.enableModalAutoclose = (e.target as HTMLInputElement).checked;
        debouncedSave();
    });

    const autocloseTimer = document.getElementById('modal-autoclose-timer') as HTMLInputElement;
    const autocloseValue = document.getElementById('modal-autoclose-value')!;
    autocloseTimer.value = appConfig.modalAutocloseSeconds.toString();
    if(autocloseValue) autocloseValue.textContent = appConfig.modalAutocloseSeconds.toString();
    autocloseTimer.addEventListener('input', e => {
        const seconds = parseInt((e.target as HTMLInputElement).value, 10);
        appConfig.modalAutocloseSeconds = seconds;
        if(autocloseValue) autocloseValue.textContent = seconds.toString();
        debouncedSave();
    });

    const bingoTitleSelect = document.getElementById('bingo-title-select') as HTMLSelectElement;
    bingoTitleSelect.value = appConfig.bingoTitle;
    bingoTitleSelect.addEventListener('change', e => {
        appConfig.bingoTitle = (e.target as HTMLSelectElement).value;
        DYNAMIC_LETTERS = appConfig.bingoTitle === 'AJUDE' ? DYNAMIC_LETTERS_AJUDE : ['B', 'I', 'N', 'G', 'O'];
        updateProgramTitle();
        renderAppName();
        renderUIFromState();
        debouncedSave();
    });
    
    const boardColorPicker = document.getElementById('board-color-picker') as HTMLInputElement;
    boardColorPicker.value = appConfig.boardColor === 'default' ? '#334155' : appConfig.boardColor;
    boardColorPicker.addEventListener('input', e => {
        appConfig.boardColor = (e.target as HTMLInputElement).value;
        renderUIFromState();
        debouncedSave();
    });
    document.getElementById('reset-board-color-btn')!.addEventListener('click', () => {
        appConfig.boardColor = 'default';
        boardColorPicker.value = '#334155';
        renderUIFromState();
        debouncedSave();
    });
    const textColorPicker = document.getElementById('drawn-text-color-picker') as HTMLInputElement;
    textColorPicker.value = appConfig.drawnTextColor;
    textColorPicker.addEventListener('input', e => {
        appConfig.drawnTextColor = (e.target as HTMLInputElement).value;
        loadRoundState(activeGameNumber); 
        debouncedSave();
    });
    const strokeColorPicker = document.getElementById('drawn-stroke-color-picker') as HTMLInputElement;
    strokeColorPicker.value = appConfig.drawnTextStrokeColor;
    strokeColorPicker.addEventListener('input', e => {
        appConfig.drawnTextStrokeColor = (e.target as HTMLInputElement).value;
        loadRoundState(activeGameNumber);
        debouncedSave();
    });
    const strokeWidthSlider = document.getElementById('drawn-stroke-width-slider') as HTMLInputElement;
    const strokeWidthValue = document.getElementById('drawn-stroke-width-value')!;
    strokeWidthSlider.value = appConfig.drawnTextStrokeWidth.toString();
    if(strokeWidthValue) strokeWidthValue.textContent = appConfig.drawnTextStrokeWidth.toString();
    strokeWidthSlider.addEventListener('input', e => {
        const width = parseInt((e.target as HTMLInputElement).value, 10);
        appConfig.drawnTextStrokeWidth = width;
        if(strokeWidthValue) strokeWidthValue.textContent = width.toString();
        loadRoundState(activeGameNumber);
        debouncedSave();
    });

    populateSettingsSponsorsTab();
    populateSettingsLabelsTab();
    populateSettingsShortcutsTab();
    
    document.getElementById('generate-test-data-btn')!.addEventListener('click', generateTestData);
    document.getElementById('close-settings-btn')!.addEventListener('click', () => {
        DOMElements.settingsModal.classList.add('hidden');
        applyLabels(); 
        renderUIFromState(); 
    });

    DOMElements.settingsModal.classList.remove('hidden');
}

        function showAlert(message: string) {
            DOMElements.customAlertModal.innerHTML = getModalTemplates().alert;
            (document.getElementById('custom-alert-message') as HTMLElement).textContent = message;
            DOMElements.customAlertModal.classList.remove('hidden');
            document.getElementById('custom-alert-close-btn')!.addEventListener('click', () => {
                DOMElements.customAlertModal.classList.add('hidden');
            });
        }

        function showCongratsModal(winnerName: string, prize: string, isPrizeDraw = false, cartela = '') {
            DOMElements.congratsModal.innerHTML = getModalTemplates().congrats;
            const winnerNameEl = document.getElementById('congrats-winner-name')!;
            const prizeValueEl = document.getElementById('congrats-prize-value')!;
            winnerNameEl.textContent = winnerName;
            
            if (isPrizeDraw) {
                const cartelaText = cartela ? ` | Cartela Nº ${cartela}` : '';
                prizeValueEl.innerHTML = `<strong>${appLabels.congratsModalPrizeLabel}</strong> ${prize}${cartelaText}`;
            } else {
                prizeValueEl.textContent = prize;
            }
            
            DOMElements.congratsModal.classList.remove('hidden');
            triggerConfetti();
            document.getElementById('close-congrats-modal-btn')!.addEventListener('click', () => {
                DOMElements.congratsModal.classList.add('hidden');
                winnerNameEl.setAttribute('contenteditable', 'false');
                prizeValueEl.setAttribute('contenteditable', 'false');
            });
        }
        
        function adjustSlider(sliderId: string, adjustment: number) {
            const slider = document.getElementById(sliderId) as HTMLInputElement;
            if (!slider) return;
            
            const currentValue = parseInt(slider.value, 10);
            const min = parseInt(slider.min, 10);
            const max = parseInt(slider.max, 10);
            
            let newValue = currentValue + adjustment;
            
            if (newValue < min) newValue = min;
            if (newValue > max) newValue = max;
            
            slider.value = newValue.toString();
            
            slider.dispatchEvent(new Event('input', { bubbles: true }));
            debouncedSave(); 
        }

        function buildShortcutString(e: KeyboardEvent): string {
            let shortcut = '';
            if (e.ctrlKey) shortcut += 'Control+';
            if (e.altKey) shortcut += 'Alt+';
            if (e.shiftKey) shortcut += 'Shift+';

            let key = e.key;
            if (key === ' ') key = 'Space';
            else if (key.length === 1) key = key.toUpperCase();
            else key = key.charAt(0).toUpperCase() + key.slice(1);
            
            if (!['Control', 'Alt', 'Shift', 'Meta'].includes(key)) {
                shortcut += key;
            }
            return shortcut;
        }

        function handleManualSubmit() {
            const letter = DOMElements.letterInput.value.toUpperCase();
            const numberStr = DOMElements.numberInput.value;

            if (!numberStr) {
                showError("Por favor, digite um número.");
                return;
            }
            const number = parseInt(numberStr, 10);
            if (isNaN(number) || number < 1 || number > 75) {
                showError(`Número inválido. Digite um valor entre 1 e 75.`);
                return;
            }
            const expectedLetter = getLetterForNumber(number);
            if (letter && letter !== expectedLetter) {
                showError(`O número ${number} pertence à coluna ${expectedLetter}, não ${letter}.`);
                return;
            }
            showFloatingNumber(number);
            DOMElements.numberInput.value = '';
            DOMElements.letterInput.value = '';
            DOMElements.letterInput.focus();
        }

        function handleKeydown(e: KeyboardEvent) {
            if (!DOMElements.verificationModal.classList.contains('hidden')) {
                e.preventDefault();
                switch (e.key) {
                    case '1': (document.getElementById('confirm-prize1-btn') as HTMLButtonElement)?.click(); break;
                    case '2': (document.getElementById('confirm-prize2-btn') as HTMLButtonElement)?.click(); break;
                    case '3': (document.getElementById('confirm-prize3-btn') as HTMLButtonElement)?.click(); break;
                    case 'Escape': (document.getElementById('reject-bingo-btn') as HTMLButtonElement)?.click(); break;
                    case '+': case '=': (document.getElementById('zoom-in-btn-verification') as HTMLButtonElement)?.click(); break;
                    case '-': (document.getElementById('zoom-out-btn-verification') as HTMLButtonElement)?.click(); break;
                }
                return;
            }
        
            if (!DOMElements.sponsorDisplayModal.classList.contains('hidden')) {
                e.preventDefault();
                switch (e.key) {
                    case '+': case '=': (document.getElementById('zoom-in-btn-sponsor') as HTMLButtonElement)?.click(); break;
                    case '-': (document.getElementById('zoom-out-btn-sponsor') as HTMLButtonElement)?.click(); break;
                    case 'Escape': (document.getElementById('close-sponsor-display-btn') as HTMLButtonElement)?.click(); break;
                }
                return;
            }
            
            if (!DOMElements.floatingNumberModal.classList.contains('hidden')) {
                e.preventDefault();
                switch (e.key) {
                    case '+': case '=': (document.getElementById('zoom-in-btn-floating') as HTMLButtonElement)?.click(); break;
                    case '-': (document.getElementById('zoom-out-btn-floating') as HTMLButtonElement)?.click(); break;
                    case 'Escape': (document.getElementById('close-floating-btn') as HTMLButtonElement)?.click(); break;
                }
                return;
            }

            const keyString = buildShortcutString(e);
            const activeEl = document.activeElement;
            const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.getAttribute('contenteditable') === 'true');

            if (isInputFocused) {
                if (e.key === 'Escape') {
                    (activeEl as HTMLElement).blur();
                }
                return;
            }
        
            switch (keyString) {
                case appConfig.shortcuts.autoDraw:
                    e.preventDefault();
                    handleAutoDraw();
                    break;
                case appConfig.shortcuts.verify:
                    e.preventDefault();
                    showVerificationPanel();
                    break;
                case appConfig.shortcuts.clearRound:
                    e.preventDefault();
                    (DOMElements.clearRoundBtnBottom as HTMLButtonElement).click();
                    break;
                case appConfig.shortcuts.drawPrize:
                    e.preventDefault();
                    (document.getElementById('prize-draw-random-btn') as HTMLButtonElement)?.click();
                    break;
                case appConfig.shortcuts.registerPrize:
                    e.preventDefault();
                    DOMElements.prizeDrawForm.requestSubmit();
                    break;
                case appConfig.shortcuts.sellAuction:
                    e.preventDefault();
                    DOMElements.auctionForm.requestSubmit();
                    break;
                case appConfig.shortcuts.showInterval:
                    e.preventDefault();
                    (DOMElements.intervalBtn as HTMLButtonElement).click();
                    break;
            }
        }
        
        function showEventBreakModal() {
            DOMElements.eventBreakModal.innerHTML = getModalTemplates().eventBreak;
            DOMElements.eventBreakModal.classList.remove('hidden');
        
            const leftContentEl = document.getElementById('break-left-content')!;
            const rightContentEl = document.getElementById('break-right-content')!;
            const clockEl = document.getElementById('break-clock')!;
            const leftTitleEl = document.getElementById('break-left-title')!;
            const rightTitleEl = document.getElementById('break-right-title')!;
        
            const sponsors = Object.values(appConfig.sponsorsByNumber).filter(s => s.name);
            const contentListRight = sponsors.length > 0 ? sponsors.map(s => s.name) : Object.values(gamesData).flatMap(g => (g as any).winners || []).filter(Boolean).map((w:any) => w.name);
            const titleRight = sponsors.length > 0 ? "Patrocinadores" : "Vencedores";
        
            const contentListLeft = menuItems;
            let currentIndexLeft = 0;
            let currentIndexRight = 0;
        
            const updateContent = (el: HTMLElement, list: string[], index: number) => {
                if (!list || list.length === 0) {
                    el.textContent = '...';
                    return;
                }
                el.classList.add('opacity-0');
                setTimeout(() => {
                    el.textContent = list[index % list.length];
                    el.classList.remove('opacity-0');
                }, 500);
            };
        
            leftTitleEl.textContent = "Cardápio";
            rightTitleEl.textContent = titleRight;
            
            updateContent(leftContentEl, contentListLeft, currentIndexLeft);
            updateContent(rightContentEl, contentListRight, currentIndexRight);
        
            intervalContentInterval = setInterval(() => {
                currentIndexLeft++;
                updateContent(leftContentEl, contentListLeft, currentIndexLeft);
                currentIndexRight++;
                updateContent(rightContentEl, contentListRight, currentIndexRight);
            }, 5000);
        
            const updateClock = () => {
                clockEl.textContent = new Date().toLocaleTimeString('pt-BR');
            };
            updateClock();
            intervalClockInterval = setInterval(updateClock, 1000);
            
            const startBreakConfetti = () => {
                const duration = 15 * 1000;
                const animationEnd = Date.now() + duration;
                const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1001 };
        
                function randomInRange(min: number, max: number) {
                    return Math.random() * (max - min) + min;
                }
        
                breakConfettiInterval = setInterval(function() {
                    if (typeof confetti !== 'function') {
                        clearInterval(breakConfettiInterval);
                        return;
                    }
                    const timeLeft = animationEnd - Date.now();
        
                    if (timeLeft <= 0) {
                        return clearInterval(breakConfettiInterval);
                    }
                    
                    const particleCount = 50 * (timeLeft / duration);
                    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
                }, 350);
            }
            startBreakConfetti();
        
            document.getElementById('close-break-modal-btn')!.addEventListener('click', () => {
                clearInterval(intervalContentInterval);
                clearInterval(intervalClockInterval);
                clearInterval(breakConfettiInterval);
                DOMElements.eventBreakModal.classList.add('hidden');
            });
        }
        
        // --- Sorteio de Brindes e Leilão ---
        function handlePrizeDraw() {
            const min = parseInt((document.getElementById('prize-draw-min') as HTMLInputElement).value, 10);
            const max = parseInt((document.getElementById('prize-draw-max') as HTMLInputElement).value, 10);
        
            if (isNaN(min) || isNaN(max) || min < 1 || max <= min) {
                showAlert("Por favor, insira um intervalo de números válido para o sorteio de brindes.");
                return;
            }
        
            const noRepeat = DOMElements.noRepeatPrizeDrawCheckbox.checked;
            let availableNumbers = [];
        
            for (let i = min; i <= max; i++) {
                if (!noRepeat || !drawnPrizeNumbers.includes(i)) {
                    availableNumbers.push(i);
                }
            }
        
            if (availableNumbers.length === 0) {
                showAlert("Todos os números neste intervalo já foram sorteados.");
                return;
            }
        
            const drawnNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
            
            const displayContainer = DOMElements.prizeDrawDisplayContainer as HTMLElement;
            displayContainer.innerHTML = '';
            displayContainer.classList.remove('hidden');
            DOMElements.mainDisplayLabel.textContent = 'Cartela Sorteada!';
            
            const roundColor = activeGameNumber ? gamesData[activeGameNumber]?.color : roundColors[0];
            
            const numberDisplay = document.createElement('div');
            numberDisplay.className = 'prize-draw-number-display text-9xl font-black text-white p-6 rounded-full w-80 h-80 flex items-center justify-center';
            numberDisplay.style.backgroundColor = roundColor;
            numberDisplay.style.textShadow = '0 0 20px rgba(0,0,0,0.5)';
            displayContainer.appendChild(numberDisplay);
        
            let start = 0;
            const end = drawnNumber;
            const duration = 1500;
            const frameDuration = 1000 / 60;
            const totalFrames = Math.round(duration / frameDuration);
            let frame = 0;
        
            const animateCount = () => {
                frame++;
                const progress = frame / totalFrames;
                const currentNum = Math.round(end * (1 - Math.pow(1 - progress, 3))); // Easing function
                numberDisplay.textContent = currentNum.toString();
        
                if (frame < totalFrames) {
                    requestAnimationFrame(animateCount);
                } else {
                    numberDisplay.textContent = end.toString();
                    numberDisplay.classList.add('pulse-glow-animation');
                    (document.getElementById('prize-draw-number-manual') as HTMLInputElement).value = end.toString();
                    if (noRepeat) {
                        drawnPrizeNumbers.push(end);
                        debouncedSave();
                    }
                }
            };
        
            requestAnimationFrame(animateCount);
        }

        function registerPrizeWinner() {
            const cartela = (document.getElementById('prize-draw-number-manual') as HTMLInputElement).value;
            const name = (document.getElementById('prize-draw-name') as HTMLInputElement).value;
            const prize = (document.getElementById('prize-draw-description') as HTMLInputElement).value;

            if (!cartela.trim()) {
                showAlert("O número da cartela é obrigatório para registrar um brinde.");
                return;
            }
            
            if (!gamesData['Brindes']) gamesData['Brindes'] = { winners: [] };
            const winnerData = {
                id: Date.now(),
                name: name || `Ganhador #${cartela}`,
                prize: prize || "Brinde",
                gameNumber: 'Brinde',
                bingoType: 'Sorteio',
                cartela: cartela,
            };
            gamesData['Brindes'].winners.push(winnerData);
            
            showCongratsModal(winnerData.name, winnerData.prize, true, winnerData.cartela);
            renderAllWinners();
            debouncedSave();

            (document.getElementById('prize-draw-number-manual') as HTMLInputElement).value = '';
            (document.getElementById('prize-draw-name') as HTMLInputElement).value = '';
            (document.getElementById('prize-draw-description') as HTMLInputElement).value = '';
            
            DOMElements.prizeDrawDisplayContainer.classList.add('hidden');
            (DOMElements.currentNumberEl as HTMLElement).style.visibility = activeGameNumber ? 'visible' : 'hidden';
            DOMElements.mainDisplayLabel.textContent = appLabels.announcedNumberLabel;
        }

        function showDrawnPrizesModal() {
            DOMElements.drawnPrizesModal.innerHTML = getModalTemplates().drawnPrizes;
            const listContainer = document.getElementById('drawn-prizes-list')!;
            const subtitleEl = document.getElementById('drawn-prizes-subtitle')!;
            listContainer.innerHTML = '';

            const allPrizeWinners = gamesData['Brindes']?.winners || [];
            subtitleEl.textContent = `Total de ${allPrizeWinners.length} brindes registrados.`;

            if (allPrizeWinners.length > 0) {
                allPrizeWinners.slice().reverse().forEach((winner: any, index: number) => {
                    const winnerEl = document.createElement('div');
                    winnerEl.className = `bg-gray-800 p-3 rounded-lg text-left w-full max-w-sm transition-all duration-300`;
                     if (index === 0) {
                        winnerEl.classList.add('animate-custom-flash', 'border-2', 'border-yellow-400');
                    }
                    winnerEl.innerHTML = `
                        <div class="flex justify-between items-start">
                             <div>
                                <p class="font-bold text-white text-lg">${winner.name}</p>
                                <p class="text-sm text-yellow-400">${winner.prize}</p>
                                <p class="text-xs text-slate-400">Cartela: ${winner.cartela}</p>
                             </div>
                             <button data-winner-id="${winner.id}" class="delete-prize-btn text-red-500 hover:text-red-400 text-xl font-bold p-1">✖</button>
                        </div>
                    `;
                    listContainer.appendChild(winnerEl);
                });
            } else {
                listContainer.textContent = 'Nenhum brinde foi registrado ainda.';
            }

            DOMElements.drawnPrizesModal.classList.remove('hidden');

            document.getElementById('close-drawn-prizes-btn')!.addEventListener('click', () => {
                DOMElements.drawnPrizesModal.classList.add('hidden');
            });
            
            document.querySelectorAll('.delete-prize-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const winnerId = parseInt((e.currentTarget as HTMLElement).dataset.winnerId!, 10);
                    gamesData['Brindes'].winners = gamesData['Brindes'].winners.filter((w:any) => w.id !== winnerId);
                    
                    // Também remove o número da cartela da lista de "já sorteados" para que possa ser sorteado novamente
                    const winnerToRemove = allPrizeWinners.find((w:any) => w.id === winnerId);
                    if (winnerToRemove && winnerToRemove.cartela) {
                        const cartelaNum = parseInt(winnerToRemove.cartela, 10);
                        if (!isNaN(cartelaNum)) {
                            drawnPrizeNumbers = drawnPrizeNumbers.filter(n => n !== cartelaNum);
                        }
                    }
                    
                    debouncedSave();
                    showDrawnPrizesModal(); // Recarrega o modal para refletir a exclusão
                });
            });
            
             const roundColor = activeGameNumber ? gamesData[activeGameNumber]?.color : roundColors[0];
            (document.getElementById('drawn-prizes-title') as HTMLElement).style.color = roundColor;
        }

        function handleAuctionSubmit() {
            const itemName = (document.getElementById('auction-item-name') as HTMLInputElement).value;
            const winnerName = (document.getElementById('auction-winner-name') as HTMLInputElement).value;
            const currentBid = (document.getElementById('auction-item-current-bid') as HTMLInputElement).value;
        
            if (!itemName.trim() || !winnerName.trim() || parseInt(currentBid, 10) <= 0) {
                showAlert("Preencha o nome do item, o nome do arrematador e tenha um lance maior que zero.");
                return;
            }
        
            if (!gamesData['Leilão']) gamesData['Leilão'] = { winners: [] };
            const auctionData = {
                id: Date.now(),
                name: winnerName,
                gameNumber: 'Leilão',
                bingoType: 'Leilão',
                itemName: itemName,
                bid: currentBid,
            };
            gamesData['Leilão'].winners.push(auctionData);
            
            const gavelIcon = document.getElementById('gavel-icon') as HTMLElement;
            gavelIcon.classList.remove('hidden');
            gavelIcon.classList.add('animate-gavel-strike');
            setTimeout(() => gavelIcon.classList.add('hidden'), 600);
        
            showCongratsModal(winnerName, `Arrematou ${itemName} por R$ ${currentBid},00!`);
            renderAllWinners();
            
            // Limpa o formulário, exceto o nome do item para lances rápidos
            (document.getElementById('auction-winner-name') as HTMLInputElement).value = '';
            (document.getElementById('auction-item-current-bid') as HTMLInputElement).value = '0';
            updateAuctionBidDisplay(0);
        
            debouncedSave();
        }
        
        // --- Inicialização e Event Listeners ---
        function initEventListeners() {
            DOMElements.manualInputForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handleManualSubmit();
            });

            DOMElements.addExtraGameBtn.addEventListener('click', addExtraGame);

            const clearRoundBtns = [DOMElements.clearRoundBtnTop, DOMElements.clearRoundBtnBottom];
            clearRoundBtns.forEach(btn => {
                btn?.addEventListener('click', () => {
                    if (!activeGameNumber) {
                        showAlert("Nenhuma rodada ativa para limpar.");
                        return;
                    }
                    DOMElements.clearRoundConfirmModal.innerHTML = getModalTemplates().clearRoundConfirm;
                    DOMElements.clearRoundConfirmModal.classList.remove('hidden');
                    document.getElementById('confirm-clear-round-btn')!.onclick = () => {
                        startNewRound();
                        DOMElements.clearRoundConfirmModal.classList.add('hidden');
                    };
                    document.getElementById('cancel-clear-round-btn')!.onclick = () => {
                        DOMElements.clearRoundConfirmModal.classList.add('hidden');
                    };
                });
            });
            
            DOMElements.prizeDrawForm.addEventListener('submit', (e) => {
                e.preventDefault();
                registerPrizeWinner();
            });

            DOMElements.checkDrawnPrizesBtn.addEventListener('click', showDrawnPrizesModal);

            document.getElementById('prize-draw-random-btn')!.addEventListener('click', handlePrizeDraw);
            
            document.getElementById('board-zoom-slider')?.addEventListener('input', (e) => {
                const scale = parseInt((e.target as HTMLInputElement).value, 10);
                appConfig.boardScale = scale;
                applyBoardZoom(scale);
            });
            document.getElementById('board-zoom-slider')?.addEventListener('change', () => debouncedSave());
            
            document.getElementById('display-zoom-slider')?.addEventListener('input', (e) => {
                const scale = parseInt((e.target as HTMLInputElement).value, 10);
                appConfig.displayScale = scale;
                applyDisplayZoom(scale);
            });
             document.getElementById('display-zoom-slider')?.addEventListener('change', () => debouncedSave());

            DOMElements.shareBtn.addEventListener('click', showProofOptions);
            DOMElements.endEventBtn.addEventListener('click', () => {
                appConfig.isEventClosed = true;
                debouncedSave();
                const allWinners = Object.values(gamesData).flatMap(g => (g as any).winners || []).filter(w => w.bingoType !== 'Sorteio').reverse();
                if (allWinners.length > 0) startFinalWinnerSlide(allWinners);
            });

            DOMElements.resetEventBtn.addEventListener('click', () => {
                DOMElements.resetConfirmModal.innerHTML = getModalTemplates().resetConfirm;
                DOMElements.resetConfirmModal.classList.remove('hidden');
                document.getElementById('confirm-reset-btn')!.onclick = () => {
                    localStorage.removeItem(LOCAL_STORAGE_KEY);
                    window.location.reload();
                };
                document.getElementById('cancel-reset-btn')!.onclick = () => {
                    DOMElements.resetConfirmModal.classList.add('hidden');
                };
            });
            
            DOMElements.intervalBtn.addEventListener('click', showEventBreakModal);
            DOMElements.editMenuBtn.addEventListener('click', showMenuEditModal);
            
            DOMElements.showDonationModalBtn.addEventListener('click', showDonationModal);
            DOMElements.showChangelogBtn.addEventListener('click', showChangelogModal);
            DOMElements.showSettingsBtn.addEventListener('click', showSettingsModal);

            DOMElements.auctionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handleAuctionSubmit();
            });
            
            document.getElementById('add-50-bid')?.addEventListener('click', () => incrementAuctionBid(50));
            document.getElementById('add-100-bid')?.addEventListener('click', () => incrementAuctionBid(100));
            
            document.getElementById('add-custom-bid-btn')?.addEventListener('click', () => {
                const customInput = document.getElementById('custom-bid-input') as HTMLInputElement;
                const value = parseInt(customInput.value, 10);
                if (!isNaN(value) && value > 0) {
                    incrementAuctionBid(value);
                    customInput.value = '';
                }
            });
            
            document.getElementById('reset-auction-btn')?.addEventListener('click', () => {
                (document.getElementById('auction-item-name') as HTMLInputElement).value = '';
                (document.getElementById('auction-winner-name') as HTMLInputElement).value = '';
                (document.getElementById('auction-item-current-bid') as HTMLInputElement).value = '0';
                (document.getElementById('custom-bid-input') as HTMLInputElement).value = '';
                updateAuctionBidDisplay(0);
            });
            
            document.getElementById('save-local-btn')?.addEventListener('click', saveStateToFile);
            document.getElementById('load-local-input')?.addEventListener('change', loadStateFromFile);

            const autoDrawBtns = [document.getElementById('auto-draw-btn-top'), document.getElementById('auto-draw-btn-bottom')];
            autoDrawBtns.forEach(btn => btn?.addEventListener('click', handleAutoDraw));

            const verifyBtns = [document.getElementById('verify-btn-top'), document.getElementById('verify-btn-bottom')];
            verifyBtns.forEach(btn => btn?.addEventListener('click', showVerificationPanel));

            window.addEventListener('keydown', handleKeydown);
            
            DOMElements.activeRoundPanel.addEventListener('click', () => {
                 if (!activeGameNumber) return;
                 const game = gamesData[activeGameNumber];
                 if (!game) return;

                 DOMElements.roundEditModal.innerHTML = getModalTemplates().roundEdit;
                 (document.getElementById('round-edit-title') as HTMLElement).textContent = `Editar Rodada ${activeGameNumber}`;
                 
                 const prizesContainer = document.getElementById('round-edit-prizes-container')!;
                 prizesContainer.innerHTML = '';
                 ['prize1', 'prize2', 'prize3'].forEach(prizeKey => {
                     const labelKey = (prizeKey + 'Label') as keyof typeof appLabels;
                     const labelText = appLabels[labelKey] || prizeKey;
                     const value = game.prizes[prizeKey] || '';
                     
                     const prizeEl = document.createElement('div');
                     prizeEl.innerHTML = `
                        <label for="round-edit-${prizeKey}" class="block text-sm font-medium text-slate-400 mb-1">${labelText}</label>
                        <input type="text" id="round-edit-${prizeKey}" value="${value}" class="w-full text-base font-bold p-2 border border-gray-600 bg-gray-900 text-white rounded-md focus:ring-sky-500 focus:border-sky-500">
                     `;
                     prizesContainer.appendChild(prizeEl);
                 });

                 (document.getElementById('round-edit-description') as HTMLTextAreaElement).value = game.description || '';
                 
                 DOMElements.roundEditModal.classList.remove('hidden');

                 document.getElementById('save-round-edit-btn')!.onclick = () => {
                     game.prizes.prize1 = (document.getElementById('round-edit-prize1') as HTMLInputElement).value;
                     game.prizes.prize2 = (document.getElementById('round-edit-prize2') as HTMLInputElement).value;
                     game.prizes.prize3 = (document.getElementById('round-edit-prize3') as HTMLInputElement).value;
                     game.description = (document.getElementById('round-edit-description') as HTMLTextAreaElement).value;
                     
                     DOMElements.roundEditModal.classList.add('hidden');
                     loadRoundState(activeGameNumber); // Recarrega o painel da rodada
                     debouncedSave();
                 };

                 document.getElementById('cancel-round-edit-btn')!.onclick = () => {
                     DOMElements.roundEditModal.classList.add('hidden');
                 };
            });
        }
        
        // --- Ponto de Entrada da Aplicação ---
        document.addEventListener('DOMContentLoaded', () => {
            loadInitialState();
            initEventListeners();
        });
        
    
