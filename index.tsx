

        // FIX: Added declaration for the 'confetti' library function to resolve "Cannot find name 'confetti'" errors.
        declare var confetti: any;
import QRCode from 'qrcode';
import jsQR from 'jsqr';


        // --- Refactoring: Central Application Store ---
        // All application state and data logic is encapsulated in this object.
        // This separates data management from UI rendering and event handling, making the code more robust and maintainable.
        const appStore = {
            state: {
                gamesData: {} as { [key: string]: any },
                cardsData: {} as { [uuid: string]: { series: number, numbers: number[][] } },
                activeGameNumber: null as string | null,
                currentBingoType: '',
                gameCount: 6,
                menuItems: [
                    "Refrigerante - R$ 5,00", "Cerveja - R$ 7,00", "Água - R$ 3,00", 
                    "Espetinho - R$ 8,00", "Pastel - R$ 6,00", "Porção de Fritas - R$ 15,00"
                ],
                drawnPrizeNumbers: [] as number[],
                versionHistory: `**v7.0.0 (Atual)**
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
- **CONTROLE DE MODAIS:** Adicionada uma nova seção nas configurações para desativar o fechamento automático dos modais de sorteio ou ajustar seu tempo de exibição (de 3 a 15 segundos).`,
                appConfig: {
                    isDarkMode: true,
                    pixKey: '1e8e4af0-4d23-440c-9f3d-b4e527f65911',
                    paypalLink: 'https://www.paypal.com/donate/?hosted_button_id=WJBLF3LV3RZRW',
                    tutorialVideoLink: 'https://youtu.be/8iOOW-CR-WQ?si=Jolrp2qR38xhY5EZ', 
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
                    customLogoBase64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj4NCiAgPGRlZnM+DQogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncmFkLWJnIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiPg0KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzE3MjU1NCIvPg0KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMWUzYThhIi8+DQogICAgPC9yYWRpYWxHcmFkaWVudD4NCiAgICA8ZmlsdGVyIGlkPSJzaGFkb3ciPg0KICAgICAgPGZlRHJvcFNoYWRvdyBkeD0iMyIgZHk9IjUiIHN0ZERldmlhdGlvbj0iMyIgZmxvb2QtY29sb3I9IiMwMDAiIGZsb29kLW9wYWNpdHk9IjAuNSIvPg0KICAgIDwvZmlsdGVyPg0KICA8L2RlZnM+DQogIDxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMjU2IiBmaWxsPSJ1cmwoI2dyYWQtYmcpIi8+DQogIDxnIGZpbHRlcj0idXJsKCNzaGFkb3cpIj4NCiAgICA8cGF0aCBkPSJNMTI4IDEyOCBMMzg0IDEyOCBMMzg0IDI1NiBMMjU2IDM4NCBMMTI4IDI1NiBaIiBmaWxsPSIjZmFjYzE1IiB0cmFuc2Zvcm09InJvdGF0ZSgtMTUgMjU2IDI1NikiLz4NCiAgICA8cGF0aCBkPSJNMTQ4IDE0OCBMMzY0IDE0OCBMMzY0IDI1NiBMMjU2IDM2NCBMMTQ4IDI1NiBaIiBmaWxsPSIjZmVmMDhhIiB0cmFuc2Zvcm09InJvdGF0ZSgtMTUgMjU2IDI1NikiLz4NCiAgICA8dGV4dCB4PSI1MCUiIHk9IjQyJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IidJbnRlcicsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTMwIiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjMWUzYThhIiBsZXR0ZXItc3BhY2luZz0iLTUiPkJJTkdPPC90ZXh0Pg0KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNjUlIiBkb21pbmFudC1mYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlyeT0iJ0ludGVyJywgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI5MCIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzE3MjU1NCIgbGV0dGVyLXNwYWNpbmc9IjgiPlNIT1c8L3RleHQ+DQogIDwvZz4NCiAgPGc+DQogICAgICA8Y2lyY2xlIGN4PSI5MCIgY3k9IjkwIiByPSIzMCIgZmlsbD0iIzM4YmRmOCIgb3BhY2l0eT0iMC44Ii8+DQogICAgICA8dGV4dCB4PSI5MCIgeT0iOTQiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSInSW50ZXInLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjMTcyNTU0Ij5CPC90ZXh0Pg0KICA8L2c+DQogIDxnPg0KICAgICAgPGNpcmNsZSBjeD0iNDIyIiBjeT0iNDIyIiByPSIzMCIgZmlsbD0iI2ZiYmYyNCIgb3BhY2l0eT0iMC44Ii8+DQogICAgICA8dGV4dCB4PSI0MjIiIHk9IjQyNiIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IidJbnRlcicsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSI5MDAiIGZpbGw9IiMxNzI1NTQiPjc1PC90ZXh0Pg0KICA8L2c+DQogICAgPGc+DQogICAgICA8Y2lyY2xlIGN4PSI0MDAiIGN5PSIxNTAiIHI9IjIwIiBmaWxsPSIjYTNlNjM1IiBvcGFjaXR5PSIwLjgiLz4NCiAgPC9nPg0KICAgIDxnPg0KICAgICAgPGNpcmNsZSBjeD0iMTEwIiBjeT0iMzkwIiByPSIyNSIgZmlsbD0iI2Y0NzJiNiIgb3BhY2l0eT0iMC44Ii8+DQogIDwvZz4NCjwvc3ZnPg==',
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
                },
                appLabels: {
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
                    announceButton: "Anunciar Número",
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
                    settingsLogoDescription: "Selecione uma imagem (PNG, JPG) para ser o logotipo do seu evento. A imagem será redimensionada para se ajustar ao cabeçalho.",
                    settingsLogoRemoveButton: "Remover Logo",
                    settingsGlobalSponsorTitle: "Patrocinador Global",
                    settingsGlobalSponsorDescription: "Defina um nome e imagem que aparecerão para qualquer número sorteado que não tenha um patrocinador específico.",
                    removeGlobalSponsorButton: "Remover Patrocinador Global",
                    settingsSponsorsByNumberTitle: "Patrocinadores por Número",
                    settingsSponsorsByNumberEnable: "Habilitar exibição de patrocinador ao sortear número",
                    settingsSponsorsByNumberDescription: "Cadastre um patrocinador para números específicos (de 1 a 75). O nome e a imagem aparecerão em destaque quando o número for sorteado.",
                    settingsSponsorNumberLabel: "Nº",
                    settingsSponsorNameLabel: "Nome do Patrocinador",
                    settingsSponsorImageLabel: "Imagem do Patrocinador",
                    settingsBingoTitleLabel: "Título do Grito de Vitória",
                    settingsBingoTitleDescription: "Personalize o 'grito de vitória'. Mudar para 'AJUDE!' também altera as letras do painel (A-J-U-D-E), ideal para bingos beneficentes.",
                    settingsBoardColorLabel: "Cor de Fundo da Cartela",
                    settingsBoardColorDescription: "Escolha a cor de fundo para os números que ainda não foram sorteados no painel principal.",
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
                },
            },

            saveTimeout: null as any,

            // --- State Mutation Methods (Actions) ---
            setActiveGame(gameNumber: string | null) {
                this.state.activeGameNumber = gameNumber;
                this.debouncedSave();
            },

            addExtraGame() {
                this.state.gameCount++;
                this.state.gamesData[this.state.gameCount] = {
                    name: `Rodada ${this.state.gameCount}`,
                    prizes: { prize1: '', prize2: '', prize3: '' },
                    description: '',
                    calledNumbers: [],
                    winners: [],
                    isComplete: false,
                    color: roundColors[(this.state.gameCount - 1) % roundColors.length]
                };
                this.debouncedSave();
                return this.state.gameCount;
            },
            
            addCalledNumber(number: number) {
                if (this.state.activeGameNumber) {
                    const game = this.state.gamesData[this.state.activeGameNumber];
                    if (game && !game.calledNumbers.includes(number)) {
                        game.calledNumbers.push(number);
                        this.debouncedSave();
                    }
                }
            },
            
            removeCalledNumber(number: number) {
                 if (this.state.activeGameNumber) {
                    const game = this.state.gamesData[this.state.activeGameNumber];
                    if (game) {
                        const index = game.calledNumbers.indexOf(number);
                        if (index > -1) {
                            game.calledNumbers.splice(index, 1);
                            this.debouncedSave();
                        }
                    }
                }
            },
            
            clearActiveRound() {
                if (this.state.activeGameNumber) {
                    const game = this.state.gamesData[this.state.activeGameNumber];
                    if (game) {
                        game.calledNumbers = [];
                        this.debouncedSave();
                    }
                }
            },

            addWinner(prizeType: string, winnerName: string) {
                if (this.state.activeGameNumber) {
                    const game = this.state.gamesData[this.state.activeGameNumber];
                    if (game) {
                        const winnerData = {
                            id: Date.now(),
                            name: winnerName || "Ganhador Anônimo",
                            prize: game.prizes[prizeType],
                            gameNumber: this.state.activeGameNumber,
                            bingoType: prizeType,
                            numbers: [...game.calledNumbers].sort((a,b) => a-b)
                        };
                        game.winners.push(winnerData);
                        this.debouncedSave();
                        return winnerData;
                    }
                }
                return null;
            },

            // --- Persistence Logic ---
            getAppStateForSaving() {
                const state = {
                    gamesData: this.state.gamesData,
                    cardsData: this.state.cardsData,
                    gameCount: this.state.gameCount,
                    activeGameNumber: this.state.activeGameNumber,
                    menuItems: this.state.menuItems,
                    drawnPrizeNumbers: this.state.drawnPrizeNumbers,
                    versionText: currentVersion,
                    versionHistory: this.state.versionHistory,
                    appConfig: this.state.appConfig,
                    appLabels: this.state.appLabels,
                };
                return state;
            },

            loadStateFromObject(state: any) {
                this.state.gamesData = state.gamesData || {};
                this.state.cardsData = state.cardsData || {};
                this.state.gameCount = state.gameCount || 6;
                this.state.activeGameNumber = state.activeGameNumber || null;
                this.state.menuItems = state.menuItems || [ "Refrigerante - R$ 5,00", "Cerveja - R$ 7,00", "Água - R$ 3,00", "Espetinho - R$ 8,00", "Pastel - R$ 6,00", "Porção de Fritas - R$ 15,00" ];
                this.state.drawnPrizeNumbers = state.drawnPrizeNumbers || [];
                this.state.versionHistory = state.versionHistory || this.state.versionHistory;
                const loadedConfig = state.appConfig || {};
                this.state.appConfig = { ...this.state.appConfig, ...loadedConfig };
                const loadedLabels = state.appLabels || {};
                this.state.appLabels = { ...this.state.appLabels, ...loadedLabels };
            },

            debouncedSave() {
                clearTimeout(this.saveTimeout);
                this.saveTimeout = setTimeout(() => {
                    this.saveStateToLocalStorage();
                }, 1000);
            },

            async saveStateToLocalStorage() {
                try {
                    const appState = this.getAppStateForSaving();
                    const stateToStore = JSON.parse(JSON.stringify(appState));
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
            },

            async loadStateFromLocalStorage(): Promise<boolean> {
                try {
                    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
                    if (savedState) {
                        const appState = JSON.parse(savedState);
                        this.loadStateFromObject(appState);
                        await loadSponsorImages();
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error("Falha ao carregar estado do localStorage:", error);
                    return false;
                }
            },
            
            async loadInitialState() {
                let stateLoaded = false;
                let forceSave = false;
                
                stateLoaded = await this.loadStateFromLocalStorage();
                
                if (!stateLoaded || Object.keys(this.state.gamesData).length === 0) {
                    console.log("Nenhum estado salvo encontrado. Inicializando com dados padrão.");
                    this.state.gameCount = 6;
                    this.state.gamesData = {};
                    for (let i = 1; i <= this.state.gameCount; i++) {
                        this.state.gamesData[i] = {
                            name: `Rodada ${i}`,
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
                
                this.state.appConfig.tutorialVideoLink = 'https://youtu.be/8iOOW-CR-WQ?si=Jolrp2qR38xhY5EZ';
                this.state.appConfig.paypalLink = 'https://www.paypal.com/donate/?hosted_button_id=WJBLF3LV3RZRW';
                this.state.appConfig.pixKey = '1e8e4af0-4d23-440c-9f3d-b4e527f65911';
                
                applyLabels();
                updateProgramTitle();
                renderUIFromState();
                
                if (forceSave) {
                    this.debouncedSave();
                }
            }
        };

        // --- Transient UI State (not persisted) ---
        let floatingNumberTimeout: ReturnType<typeof setTimeout> | null = null;
        let intervalContentInterval: any;
        let intervalClockInterval: any;
        let breakConfettiInterval: any;
        let finalConfettiInterval: any;
        let clockInterval: any;
        let confettiAnimationId: number;
        let spinTimeout: any;
        let cycloneInterval: any;
        let winnerDisplayTimeout: any; 

        // --- Constants ---
        const currentVersion = "7.1"; // Foco 100% Local
        const DYNAMIC_LETTERS = ['B', 'I', 'N', 'G', 'O'];
        const DYNAMIC_LETTERS_AJUDE = ['A', 'J', 'U', 'D', 'E'];
        const BINGO_CONFIG: { [key: string]: { min: number; max: number } } = { B: { min: 1, max: 15 }, I: { min: 16, max: 30 }, N: { min: 31, max: 45 }, G: { min: 46, max: 60 }, O: { min: 61, max: 75 },
                               A: { min: 1, max: 15 }, J: { min: 16, max: 30 }, U: { min: 31, max: 45 }, D: { min: 46, max: 60 }, E: { min: 61, max: 75 } };
        const LETTERS = Object.keys(BINGO_CONFIG);
        const roundColors = ['#16a34a', '#ca8a04', '#c2410c', '#0e7490', '#be185d', '#6d28d9', '#059669', '#b45309'];
        const predefinedPrizes = [ { prize1: 'R$ 100,00', prize2: '', prize3: '' }, { prize1: 'R$ 100,00', prize2: 'R$ 200,00', prize3: '' }, { prize1: 'R$ 200,00', prize2: '', prize3: '' }, { prize1: 'R$ 100,00', prize2: 'R$ 300,00', prize3: '' }, { prize1: 'R$ 300,00', prize2: '', prize3: 'R$ 300,00' }, { prize1: 'R$ 200,00', prize2: 'R$ 2.000,00', prize3: '' } ];
        const winnerDisplayDuration = 5000;
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
            nextRoundModal: document.getElementById('next-round-modal'),
            showCardGeneratorBtn: document.getElementById('show-card-generator-btn'),
            cardGeneratorModal: document.getElementById('card-generator-modal'),
            cardScannerModal: document.getElementById('card-scanner-modal'),
        };
        const confettiCtx = DOMElements.confettiCanvas.getContext('2d');

function renderCustomLogo() {
    const headerLogoContainer = document.getElementById('app-logo');
    if (!headerLogoContainer) return;

    if (appStore.state.appConfig.customLogoBase64) {
        headerLogoContainer.innerHTML = `<img id="header-logo" src="${appStore.state.appConfig.customLogoBase64}" alt="Logo do Evento" class="w-full h-full object-contain">`;
    } else {
        headerLogoContainer.innerHTML = ''; 
    }
    
    const settingsPreview = document.getElementById('custom-logo-preview') as HTMLImageElement;
    if (settingsPreview) {
        settingsPreview.src = appStore.state.appConfig.customLogoBase64 || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    }
}

function renderShortcutsLegend() {
    const container = document.getElementById('shortcuts-legend-list');
    if (!container) return;

    container.innerHTML = ''; 

    const shortcutMap: { [key in keyof typeof appStore.state.appConfig.shortcuts]: keyof typeof appStore.state.appLabels } = {
        autoDraw: 'shortcutLabelAutoDraw',
        verify: 'shortcutLabelVerify',
        clearRound: 'shortcutLabelClearRound',
        drawPrize: 'shortcutLabelDrawPrize',
        registerPrize: 'shortcutLabelRegisterPrize',
        sellAuction: 'shortcutLabelSellAuction',
        showInterval: 'shortcutLabelShowInterval',
    };

    for (const key in appStore.state.appConfig.shortcuts) {
        const shortcutKey = key as keyof typeof appStore.state.appConfig.shortcuts;
        const labelKey = shortcutMap[shortcutKey];
        if (labelKey && appStore.state.appLabels[labelKey]) {
            const legendItem = document.createElement('li');
            legendItem.className = 'flex justify-between items-center';
            
            const labelSpan = document.createElement('span');
            labelSpan.textContent = `${appStore.state.appLabels[labelKey]}:`;

            const keySpan = document.createElement('span');
            keySpan.className = 'font-mono bg-gray-700 text-sky-300 rounded px-2 py-1';
            keySpan.textContent = appStore.state.appConfig.shortcuts[shortcutKey];

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
        displayEl.classList.remove('animate-bid-flash');
        void displayEl.offsetWidth; 
        displayEl.classList.add('animate-bid-flash');
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

    const keysToExclude = ['prize1Label', 'prize2Label', 'prize3Label'];

    Object.keys(appStore.state.appLabels).forEach(key => {
        if (keysToExclude.includes(key)) return;

        const labelKey = key as keyof typeof appStore.state.appLabels;

        const wrapper = document.createElement('div');
        wrapper.className = 'flex flex-col';

        const label = document.createElement('label');
        label.htmlFor = `label-input-${labelKey}`;
        label.className = 'text-sm font-bold text-slate-400 mb-1';
        label.textContent = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `label-input-${labelKey}`;
        input.value = appStore.state.appLabels[labelKey];
        input.className = 'bg-gray-900 text-white p-2 rounded-lg text-sm focus:ring-sky-500 focus:border-sky-500';

        input.addEventListener('change', (e) => {
            appStore.state.appLabels[labelKey] = (e.target as HTMLInputElement).value;
            appStore.debouncedSave();
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

    const shortcutMap: { [key in keyof typeof appStore.state.appConfig.shortcuts]: keyof typeof appStore.state.appLabels } = {
        autoDraw: 'shortcutLabelAutoDraw',
        verify: 'shortcutLabelVerify',
        clearRound: 'shortcutLabelClearRound',
        drawPrize: 'shortcutLabelDrawPrize',
        registerPrize: 'shortcutLabelRegisterPrize',
        sellAuction: 'shortcutLabelSellAuction',
        showInterval: 'shortcutLabelShowInterval',
    };

    Object.keys(appStore.state.appConfig.shortcuts).forEach(key => {
        const shortcutKey = key as keyof typeof appStore.state.appConfig.shortcuts;
        const labelKey = shortcutMap[shortcutKey];

        const wrapper = document.createElement('div');
        wrapper.className = 'flex flex-col sm:flex-row sm:items-center sm:justify-between';

        const label = document.createElement('label');
        label.htmlFor = `shortcut-input-${shortcutKey}`;
        label.className = 'text-base font-medium text-slate-300 mb-1 sm:mb-0';
        label.textContent = appStore.state.appLabels[labelKey];

        const input = document.createElement('input');
        input.type = 'text';
        input.readOnly = true;
        input.id = `shortcut-input-${shortcutKey}`;
        input.value = appStore.state.appConfig.shortcuts[shortcutKey];
        input.className = 'bg-gray-900 text-center text-sky-300 font-mono p-2 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer w-full sm:w-auto';

        input.addEventListener('focus', () => {
            input.value = 'Pressione a nova tecla...';
        });
        input.addEventListener('blur', () => {
            input.value = appStore.state.appConfig.shortcuts[shortcutKey];
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
            appStore.state.appConfig.shortcuts[shortcutKey] = shortcutString;
            renderShortcutsLegend();
            appStore.debouncedSave();
            input.blur(); 
        });


        wrapper.appendChild(label);
        wrapper.appendChild(input);
        container.appendChild(wrapper);
    });
}
        // --- Funções de Template HTML ---
        function getModalTemplates() {
            const { appLabels } = appStore.state;
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
                                        <div class="flex items-center justify-center gap-4 mt-2">
                                           <button id="cancel-floating-btn" class="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-full text-base">${appLabels.modalBackButton}</button>
                                           <button id="confirm-floating-btn" class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-full text-base">${appLabels.announceButton}</button>
                                       </div>
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
                                        <div class="flex items-center justify-center gap-4 mt-2">
                                           <button id="cancel-sponsor-display-btn" class="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-full text-base">${appLabels.modalBackButton}</button>
                                           <button id="confirm-sponsor-display-btn" class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-full text-base">${appLabels.announceButton}</button>
                                       </div>
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
                drawnPrizes: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-2xl w-full text-center flex flex-col h-[70vh]">
                                <h2 id="drawn-prizes-title" class="text-3xl font-bold text-white flex-shrink-0">${appLabels.drawnPrizesModalTitle}</h2>
                                <p id="drawn-prizes-subtitle" class="text-xl font-bold text-amber-400 mb-4 flex-shrink-0"></p>
                                
                                <div class="mb-6 flex-shrink-0">
                                    <h3 class="text-lg font-semibold text-sky-400 mb-2">Última Cartela Sorteada</h3>
                                    <div id="last-drawn-prize-display" class="flex justify-center items-center">
                                        <!-- O último número sorteado será inserido aqui -->
                                    </div>
                                </div>

                                <div class="flex-grow flex flex-col min-h-0">
                                    <h3 class="text-lg font-semibold text-slate-300 mb-2 flex-shrink-0">Histórico de Sorteios</h3>
                                    <div id="drawn-prizes-history-list" class="bg-gray-900 rounded-lg p-4 flex-grow overflow-y-auto flex flex-wrap gap-3 justify-center content-start">
                                        <!-- O histórico de números será inserido aqui -->
                                    </div>
                                </div>
                                
                                <button id="close-drawn-prizes-btn" class="mt-6 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-full text-lg flex-shrink-0">${appLabels.modalCloseButton}</button>
                             </div>`,
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
                               <button id="remove-global-sponsor-btn" class="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg text-sm" data-label-key="removeGlobalSponsorButton">${appLabels.removeGlobalSponsorButton}</button>
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
                            <div class="border-b border-gray-700 pb-4 mb-4 space-y-4">
                                <h3 class="text-xl font-bold text-slate-300">Nomenclatura dos Prêmios</h3>
                                <div>
                                    <label for="label-prize1Label" class="text-base font-medium text-slate-300">Prêmio 1 (ex: Quina)</label>
                                    <input type="text" id="label-prize1Label" class="w-full bg-gray-900 text-white p-2 mt-1 rounded-lg text-sm focus:ring-sky-500 focus:border-sky-500">
                                    <p class="text-xs text-slate-400 mt-1">O nome do primeiro prêmio a ser ganho na rodada. Geralmente uma linha ou quina.</p>
                                </div>
                                <div>
                                    <label for="label-prize2Label" class="text-base font-medium text-slate-300">Prêmio 2 (ex: Cartela Cheia)</label>
                                    <input type="text" id="label-prize2Label" class="w-full bg-gray-900 text-white p-2 mt-1 rounded-lg text-sm focus:ring-sky-500 focus:border-sky-500">
                                    <p class="text-xs text-slate-400 mt-1">O nome do prêmio principal, que geralmente encerra a rodada.</p>
                                </div>
                                <div>
                                    <label for="label-prize3Label" class="text-base font-medium text-slate-300">Prêmio 3 (ex: Azarão)</label>
                                    <input type="text" id="label-prize3Label" class="w-full bg-gray-900 text-white p-2 mt-1 rounded-lg text-sm focus:ring-sky-500 focus:border-sky-500">
                                    <p class="text-xs text-slate-400 mt-1">Um prêmio opcional, como para quem fica por uma bola ou tem a cartela com mais números no final.</p>
                                </div>
                            </div>
                            <h3 class="text-xl font-bold text-slate-300 mt-6 mb-4">Todos os Textos</h3>
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
                        <div>
                            <label for="round-edit-name" class="block text-sm font-medium text-slate-400 mb-1">Nome da Rodada</label>
                            <input type="text" id="round-edit-name" class="w-full text-lg font-bold p-2 border border-gray-600 bg-gray-900 text-white rounded-md focus:ring-sky-500 focus:border-sky-500">
                        </div>
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
                </div>`,
                nextRound: `<div class="modal-content next-round-modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center overflow-hidden">
                    <h2 class="text-3xl font-bold text-sky-400 mb-4">Troca de Rodada!</h2>
                    <div class="flex items-center justify-center gap-4 text-xl my-6">
                        <div class="flex-1 text-right p-3 bg-red-900/50 rounded-lg">
                            <p class="text-sm text-red-300">Encerrada</p>
                            <p id="completed-round-name" class="font-bold text-white"></p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        <div class="flex-1 text-left p-3 bg-green-900/50 rounded-lg">
                            <p class="text-sm text-green-300">Próxima</p>
                            <p id="next-round-name" class="font-bold text-white"></p>
                        </div>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2.5 mt-6">
                      <div id="next-round-progress" class="bg-sky-500 h-2.5 rounded-full" style="width: 100%; transition: width 5s linear;"></div>
                    </div>
                 </div>`,
                cardGenerator: `<div class="modal-content bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-5xl w-full text-left flex flex-col h-[90vh]">
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
                                   <button id="close-card-generator-btn" class="mt-4 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-full text-lg flex-shrink-0 self-center">${appLabels.modalCloseButton}</button>
                               </div>`,
                cardScanner: `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-2xl w-full text-center">
                                <h2 class="text-3xl font-bold text-white mb-4">Verificar Cartela com Câmera</h2>
                                <div id="scanner-container" class="relative w-full aspect-square bg-gray-900 rounded-lg overflow-hidden">
                                    <video id="scanner-video" class="w-full h-full object-cover" playsinline></video>
                                    <canvas id="scanner-canvas" class="hidden"></canvas>
                                    <div class="absolute inset-0 border-8 border-red-500/50" style="clip-path: polygon(0% 0%, 0% 25%, 25% 25%, 25% 0%, 75% 0%, 75% 25%, 100% 25%, 100% 75%, 75% 75%, 75% 100%, 25% 100%, 25% 75%, 0% 75%);"></div>
                                </div>
                                <p id="scanner-message" class="text-slate-400 mt-4 h-6">Aponte o QR Code da cartela para a câmera.</p>
                                <button id="close-card-scanner-btn" class="mt-4 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-full text-lg">${appLabels.modalCancelButton}</button>
                            </div>`,
            };
        }
        
// FIX: Added definitions for missing UI functions to resolve multiple "Cannot find name" errors.
function confirmClearRound() {
    if (!appStore.state.activeGameNumber) {
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
}

function generateProof(selectedGameKeys: string[]) {
    const { gamesData, appLabels, appConfig } = appStore.state;
    let proofContent = `
        <html>
        <head>
            <title>Prova do Sorteio - ${appConfig.bingoTitle}</title>
            <style>
                body { font-family: sans-serif; margin: 2rem; }
                h1 { text-align: center; }
                h2 { border-bottom: 2px solid #ccc; padding-bottom: 5px; margin-top: 2rem; }
                table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .numbers { font-size: 0.8em; word-break: break-all; }
            </style>
        </head>
        <body>
            <h1>Prova do Sorteio - ${appConfig.bingoTitle}</h1>
            <p style="text-align: center;">Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
    `;

    selectedGameKeys.forEach(key => {
        const game = gamesData[key];
        if (game && game.winners && game.winners.length > 0) {
            proofContent += `<h2>${game.name || `Rodada ${key}`}</h2>`;
            proofContent += '<table><thead><tr><th>Ganhador</th><th>Prêmio</th>';
            if (key !== 'Brindes' && key !== 'Leilão') {
                proofContent += `<th>Números Sorteados (${game.calledNumbers.length})</th>`;
            } else if (key === 'Brindes') {
                proofContent += '<th>Nº da Cartela</th>';
            } else if (key === 'Leilão') {
                proofContent += '<th>Item</th><th>Lance</th>';
            }
            proofContent += '</tr></thead><tbody>';

            game.winners.forEach((winner: any) => {
                proofContent += '<tr>';
                proofContent += `<td>${winner.name}</td>`;
                if (key !== 'Leilão') {
                    proofContent += `<td>${winner.prize}</td>`;
                }

                if (key !== 'Brindes' && key !== 'Leilão') {
                    proofContent += `<td class="numbers">${winner.numbers.join(', ')}</td>`;
                } else if (key === 'Brindes') {
                     proofContent += `<td>${winner.cartela}</td>`;
                } else if (key === 'Leilão') {
                    proofContent += `<td>${winner.itemName}</td><td>R$ ${winner.bid},00</td>`;
                }
                proofContent += '</tr>';
            });
            proofContent += '</tbody></table>';
        }
    });

    proofContent += '</body></html>';
    
    const proofWindow = window.open('', '_blank');
    if (proofWindow) {
        proofWindow.document.write(proofContent);
        proofWindow.document.close();
        proofWindow.print();
    } else {
        showAlert("Não foi possível abrir a janela de impressão. Verifique se o seu navegador está bloqueando pop-ups.");
    }
}

function showProofOptionsModal(isFinal = false) {
    DOMElements.proofOptionsModal.innerHTML = getModalTemplates().proofOptions;
    const optionsList = document.getElementById('proof-options-list')!;
    optionsList.innerHTML = '';

    const createCheckbox = (id: string, label: string, checked = true) => `
        <div class="flex items-center">
            <input id="proof-option-${id}" type="checkbox" ${checked ? 'checked' : ''} class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
            <label for="proof-option-${id}" class="ml-3 text-sm text-slate-200">${label}</label>
        </div>
    `;

    Object.keys(appStore.state.gamesData).forEach(key => {
        const game = appStore.state.gamesData[key];
        if (game.winners && game.winners.length > 0) {
            optionsList.innerHTML += createCheckbox(key, game.name || `Rodada ${key}`);
        }
    });

    DOMElements.proofOptionsModal.classList.remove('hidden');

    document.getElementById('cancel-proof-btn')!.onclick = () => DOMElements.proofOptionsModal.classList.add('hidden');
    document.getElementById('generate-selected-proof-btn')!.onclick = () => {
        const selectedGameKeys = Array.from(optionsList.querySelectorAll<HTMLInputElement>('input:checked')).map(input => input.id.replace('proof-option-', ''));
        generateProof(selectedGameKeys);
        DOMElements.proofOptionsModal.classList.add('hidden');
        if(isFinal) DOMElements.finalWinnersModal.classList.add('hidden');
    };
}

function showWinnerEditModal(winnerId: number) {
    let winnerData: any = null;
    let gameKey: string | null = null;

    for (const key in appStore.state.gamesData) {
        const game = appStore.state.gamesData[key];
        if (game.winners) {
            const foundWinner = game.winners.find((w: any) => w.id === winnerId);
            if (foundWinner) {
                winnerData = foundWinner;
                gameKey = key;
                break;
            }
        }
    }

    if (!winnerData || !gameKey) {
        console.error(`Vencedor com ID ${winnerId} não encontrado.`);
        return;
    }

    DOMElements.winnerEditModal.innerHTML = getModalTemplates().winnerEdit;
    
    const nameInput = document.getElementById('edit-winner-name') as HTMLInputElement;
    const prizeInput = document.getElementById('edit-winner-prize') as HTMLInputElement;
    
    nameInput.value = winnerData.name;
    prizeInput.value = winnerData.prize;

    DOMElements.winnerEditModal.classList.remove('hidden');

    document.getElementById('save-winner-changes-btn')!.onclick = () => {
        winnerData.name = nameInput.value;
        winnerData.prize = prizeInput.value;
        renderAllWinners();
        appStore.debouncedSave();
        DOMElements.winnerEditModal.classList.add('hidden');
    };

    document.getElementById('cancel-winner-edit-btn')!.onclick = () => {
        DOMElements.winnerEditModal.classList.add('hidden');
    };
    
    document.getElementById('remove-winner-btn')!.onclick = () => {
        DOMElements.deleteConfirmModal.innerHTML = getModalTemplates().deleteConfirm;
        (document.getElementById('delete-confirm-message') as HTMLElement).textContent = `Tem certeza que deseja remover o vencedor "${winnerData.name}"?`;
        
        DOMElements.deleteConfirmModal.classList.remove('hidden');

        document.getElementById('confirm-delete-btn')!.onclick = () => {
            if (gameKey) {
                const game = appStore.state.gamesData[gameKey];
                game.winners = game.winners.filter((w: any) => w.id !== winnerId);
                renderAllWinners();
                appStore.debouncedSave();
            }
            DOMElements.deleteConfirmModal.classList.add('hidden');
            DOMElements.winnerEditModal.classList.add('hidden');
        };

        document.getElementById('cancel-delete-btn')!.onclick = () => {
            DOMElements.deleteConfirmModal.classList.add('hidden');
        };
    };
}

function showDrawnPrizesModal() {
    const { drawnPrizeNumbers, activeGameNumber, gamesData } = appStore.state;
    DOMElements.drawnPrizesModal.innerHTML = getModalTemplates().drawnPrizes;
    const historyList = document.getElementById('drawn-prizes-history-list')!;
    const lastDrawnDisplay = document.getElementById('last-drawn-prize-display')!;
    const subtitle = document.getElementById('drawn-prizes-subtitle')!;
    historyList.innerHTML = '';
    lastDrawnDisplay.innerHTML = '';

    const activeRoundColor = (activeGameNumber && gamesData[activeGameNumber]?.color) ? gamesData[activeGameNumber].color : '#a855f7';

    subtitle.textContent = `Total Sorteado: ${drawnPrizeNumbers.length}`;

    const renderLastDrawn = () => {
        lastDrawnDisplay.innerHTML = '';
        if (drawnPrizeNumbers.length > 0) {
            const lastNumber = drawnPrizeNumbers[drawnPrizeNumbers.length - 1];
            lastDrawnDisplay.innerHTML = `
                <div class="bg-amber-400 text-gray-900 font-black rounded-lg w-40 h-24 flex flex-col items-center justify-center text-5xl shadow-lg relative p-2 animate-bounce-in">
                    <span class="text-sm absolute top-1">Cartela</span>
                    <span class="text-4xl leading-none mt-2">${lastNumber}</span>
                </div>
            `;
        } else {
            lastDrawnDisplay.innerHTML = `<p class="text-slate-400">Nenhum brinde sorteado ainda.</p>`;
        }
    };

    const renderHistory = () => {
        historyList.innerHTML = '';
        [...drawnPrizeNumbers].reverse().forEach(num => {
            const prizeEl = document.createElement('div');
            prizeEl.className = 'relative bg-gray-700 text-white font-bold rounded-lg w-20 h-14 flex items-center justify-center text-2xl shadow-md cursor-pointer group';
            prizeEl.textContent = num.toString();

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full text-sm font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.title = `Excluir sorteio do número ${num}`;
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                const index = appStore.state.drawnPrizeNumbers.indexOf(num);
                if (index > -1) {
                    appStore.state.drawnPrizeNumbers.splice(index, 1);
                    appStore.debouncedSave();
                    // Re-render the modal content
                    renderLastDrawn();
                    renderHistory();
                    subtitle.textContent = `Total Sorteado: ${appStore.state.drawnPrizeNumbers.length}`;
                }
            };

            prizeEl.appendChild(deleteBtn);
            historyList.appendChild(prizeEl);
        });
    };
    
    renderLastDrawn();
    renderHistory();
    
    DOMElements.drawnPrizesModal.classList.remove('hidden');

    document.getElementById('close-drawn-prizes-btn')!.addEventListener('click', () => {
        DOMElements.drawnPrizesModal.classList.add('hidden');
    });
}

function showFinalWinnersModal() {
    if (finalConfettiInterval) clearInterval(finalConfettiInterval);
    DOMElements.finalWinnersModal.innerHTML = getModalTemplates().finalWinners;
    DOMElements.finalWinnersModal.classList.remove('hidden');

    const allWinners = Object.values(appStore.state.gamesData)
        .flatMap(g => g.winners || [])
        .filter(w => w && w.name); // Filter out any undefined/null winners

    const winnerDisplay = document.getElementById('current-winner-card')!;
    const sponsorsList = document.getElementById('final-sponsors-list')!;
    
    // Populate sponsors
    const allSponsors = Object.values(appStore.state.appConfig.sponsorsByNumber)
        .filter(s => s.image && s.name)
        .concat(appStore.state.appConfig.globalSponsor.image ? [appStore.state.appConfig.globalSponsor] : []);
    
    const uniqueSponsors = Array.from(new Map(allSponsors.map(s => [s.name, s])).values());

    if (uniqueSponsors.length > 0) {
        sponsorsList.innerHTML = uniqueSponsors.map(s => `
            <div class="flex flex-col items-center">
                <img src="${s.image}" alt="${s.name}" class="w-20 h-20 object-contain rounded-md bg-white p-1">
                <span class="text-xs text-slate-300 mt-1">${s.name}</span>
            </div>
        `).join('');
    } else {
        document.getElementById('final-sponsors-section')!.classList.add('hidden');
    }


    let winnerIndex = 0;
    const displayNextWinner = () => {
        if (allWinners.length === 0) {
            winnerDisplay.innerHTML = `<h3 class="text-3xl font-bold text-white">Nenhum vencedor registrado.</h3>`;
            winnerDisplay.classList.remove('scale-90', 'opacity-0');
            winnerDisplay.classList.add('scale-100', 'opacity-100');
            return;
        }

        winnerDisplay.classList.add('scale-90', 'opacity-0');
        winnerDisplay.classList.remove('scale-100', 'opacity-100');

        setTimeout(() => {
            const winner = allWinners[winnerIndex];
            const game = Object.values(appStore.state.gamesData).find(g => g.winners && g.winners.some((w:any) => w.id === winner.id));
            
            winnerDisplay.innerHTML = `
                <p class="text-2xl font-bold text-sky-400 mb-2">${game ? game.name : 'Prêmio Especial'}</p>
                <h3 class="text-5xl font-black text-amber-300">${winner.name}</h3>
                <p class="text-3xl font-bold text-white mt-2">${winner.prize}</p>
            `;
            
            winnerDisplay.classList.remove('scale-90', 'opacity-0');
            winnerDisplay.classList.add('scale-100', 'opacity-100');

            winnerIndex = (winnerIndex + 1) % allWinners.length;
        }, 500);
    };

    if (winnerDisplayTimeout) clearInterval(winnerDisplayTimeout);
    displayNextWinner();
    winnerDisplayTimeout = setInterval(displayNextWinner, winnerDisplayDuration);

    const startConfetti = () => {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 2, angle: 270, spread: 55, origin: { x: Math.random(), y: 0 },
                startVelocity: 15 + (Math.random() * 20), gravity: 0.7, ticks: 300, zIndex: 10000,
            });
        }
    };
    finalConfettiInterval = setInterval(startConfetti, 150);

    document.getElementById('close-final-modal-btn')!.onclick = () => {
        DOMElements.finalWinnersModal.classList.add('hidden');
        if (winnerDisplayTimeout) clearInterval(winnerDisplayTimeout);
        if (finalConfettiInterval) clearInterval(finalConfettiInterval);
    };

    document.getElementById('generate-proof-final-btn')!.onclick = () => showProofOptionsModal(true);
    document.getElementById('donation-final-btn')!.onclick = () => (DOMElements.showDonationModalBtn as HTMLElement).click();
}

function populateSettingsSponsorsTab() {
    const container = document.getElementById('sponsors-by-number-container');
    if (!container) return;

    container.innerHTML = '';
    
    // Global Sponsor
    const globalSponsorPreview = document.getElementById('global-sponsor-preview') as HTMLImageElement;
    const globalSponsorNameInput = document.getElementById('global-sponsor-name') as HTMLInputElement;
    const globalSponsorUpload = document.getElementById('global-sponsor-upload') as HTMLInputElement;
    
    if (appStore.state.appConfig.globalSponsor) {
        if (appStore.state.appConfig.globalSponsor.image) globalSponsorPreview.src = appStore.state.appConfig.globalSponsor.image;
        globalSponsorNameInput.value = appStore.state.appConfig.globalSponsor.name || '';
    }
    
    globalSponsorNameInput.addEventListener('change', (e) => {
        appStore.state.appConfig.globalSponsor.name = (e.target as HTMLInputElement).value;
        appStore.debouncedSave();
    });

    globalSponsorUpload.addEventListener('change', async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            const base64 = await fileToBase64(file);
            appStore.state.appConfig.globalSponsor.image = base64;
            globalSponsorPreview.src = base64;
            appStore.debouncedSave();
        }
    });

    document.getElementById('remove-global-sponsor-btn')!.addEventListener('click', () => {
        appStore.state.appConfig.globalSponsor = { name: '', image: '' };
        globalSponsorPreview.src = '';
        globalSponsorNameInput.value = '';
        deleteSponsorImage('global');
        appStore.debouncedSave();
    });

    // Sponsors by Number
    const enableCheckbox = document.getElementById('enable-sponsors-by-number-checkbox') as HTMLInputElement;
    enableCheckbox.checked = appStore.state.appConfig.enableSponsorsByNumber;
    enableCheckbox.addEventListener('change', (e) => {
        appStore.state.appConfig.enableSponsorsByNumber = (e.target as HTMLInputElement).checked;
        appStore.debouncedSave();
        renderMasterBoard();
    });

    const header = `
        <div class="grid grid-cols-[auto_1fr_1fr] gap-2 items-center text-sm font-bold text-slate-400 mb-2 px-2">
            <span>${appStore.state.appLabels.settingsSponsorNumberLabel}</span>
            <span>${appStore.state.appLabels.settingsSponsorNameLabel}</span>
            <span>${appStore.state.appLabels.settingsSponsorImageLabel}</span>
        </div>
    `;
    container.innerHTML = header;

    for (let i = 1; i <= 75; i++) {
        const sponsor = appStore.state.appConfig.sponsorsByNumber[i] || { name: '', image: '' };
        
        const row = document.createElement('div');
        row.className = 'grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center p-2 rounded-lg hover:bg-gray-700/50';

        const numberLabel = document.createElement('span');
        numberLabel.className = 'font-bold text-lg text-slate-300';
        numberLabel.textContent = i.toString();

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = sponsor.name;
        nameInput.placeholder = 'Nome do patrocinador...';
        nameInput.className = 'w-full bg-gray-900 text-white p-1 rounded-md text-sm';
        nameInput.addEventListener('change', (e) => {
            if (!appStore.state.appConfig.sponsorsByNumber[i]) appStore.state.appConfig.sponsorsByNumber[i] = { name: '', image: '' };
            appStore.state.appConfig.sponsorsByNumber[i].name = (e.target as HTMLInputElement).value;
            appStore.debouncedSave();
        });

        const imageInput = document.createElement('input');
        imageInput.type = 'file';
        imageInput.accept = 'image/*';
        imageInput.className = 'text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 w-full';
        imageInput.addEventListener('change', async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const base64 = await fileToBase64(file);
                if (!appStore.state.appConfig.sponsorsByNumber[i]) appStore.state.appConfig.sponsorsByNumber[i] = { name: '', image: '' };
                appStore.state.appConfig.sponsorsByNumber[i].image = base64;
                appStore.debouncedSave();
                renderMasterBoard();
            }
        });

        const removeImageBtn = document.createElement('button');
        removeImageBtn.innerHTML = '🗑️';
        removeImageBtn.title = 'Remover imagem do patrocinador';
        removeImageBtn.className = 'text-slate-400 hover:text-red-500 rounded p-1 text-sm transition-colors';
        removeImageBtn.addEventListener('click', () => {
            if (appStore.state.appConfig.sponsorsByNumber[i]) {
                appStore.state.appConfig.sponsorsByNumber[i].image = '';
                deleteSponsorImage(i.toString());
                imageInput.value = '';
                appStore.debouncedSave();
                renderMasterBoard();
            }
        });

        row.appendChild(numberLabel);
        row.appendChild(nameInput);
        row.appendChild(imageInput);
        row.appendChild(removeImageBtn);
        container.appendChild(row);
    }
}

function showSettingsModal() {
    const { appConfig, appLabels } = appStore.state;
    DOMElements.settingsModal.innerHTML = getModalTemplates().settings;
    DOMElements.settingsModal.classList.remove('hidden');

    const tabs = ['appearance', 'sponsors', 'labels', 'shortcuts'];
    
    const switchTab = (targetTabId: string) => {
        tabs.forEach(tabId => {
            document.getElementById(`tab-${tabId}`)!.classList.remove('border-sky-500', 'text-sky-400');
            document.getElementById(`tab-${tabId}`)!.classList.add('border-transparent', 'text-gray-400', 'hover:text-gray-200', 'hover:border-gray-500');
            document.getElementById(`tab-content-${tabId}`)!.classList.add('hidden');
        });
        document.getElementById(`tab-${targetTabId}`)!.classList.add('border-sky-500', 'text-sky-400');
        document.getElementById(`tab-${targetTabId}`)!.classList.remove('border-transparent', 'text-gray-400', 'hover:text-gray-200', 'hover:border-gray-500');
        document.getElementById(`tab-content-${targetTabId}`)!.classList.remove('hidden');
    };

    tabs.forEach(tabId => {
        document.getElementById(`tab-${tabId}`)!.addEventListener('click', () => switchTab(tabId));
    });

    // --- Appearance Tab ---
    const logoPreview = document.getElementById('custom-logo-preview') as HTMLImageElement;
    if(appConfig.customLogoBase64) logoPreview.src = appConfig.customLogoBase64;
    
    (document.getElementById('custom-logo-upload') as HTMLInputElement).addEventListener('change', async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            appStore.state.appConfig.customLogoBase64 = await fileToBase64(file);
            logoPreview.src = appStore.state.appConfig.customLogoBase64;
            renderCustomLogo();
            appStore.debouncedSave();
        }
    });

    document.getElementById('remove-custom-logo-btn')!.addEventListener('click', () => {
        appStore.state.appConfig.customLogoBase64 = '';
        logoPreview.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        renderCustomLogo();
        appStore.debouncedSave();
    });
    
    const bingoTitleSelect = document.getElementById('bingo-title-select') as HTMLSelectElement;
    bingoTitleSelect.value = appConfig.bingoTitle;
    bingoTitleSelect.addEventListener('change', (e) => {
        appStore.state.appConfig.bingoTitle = (e.target as HTMLSelectElement).value;
        renderMasterBoard();
        appStore.debouncedSave();
    });

    const boardColorPicker = document.getElementById('board-color-picker') as HTMLInputElement;
    boardColorPicker.value = appConfig.boardColor === 'default' ? '#334155' : appConfig.boardColor;
    boardColorPicker.addEventListener('input', (e) => {
        appStore.state.appConfig.boardColor = (e.target as HTMLInputElement).value;
        renderMasterBoard();
    });
    boardColorPicker.addEventListener('change', () => appStore.debouncedSave());
    
    document.getElementById('reset-board-color-btn')!.addEventListener('click', () => {
        appStore.state.appConfig.boardColor = 'default';
        boardColorPicker.value = '#334155';
        renderMasterBoard();
        appStore.debouncedSave();
    });
    
    const drawnTextColorPicker = document.getElementById('drawn-text-color-picker') as HTMLInputElement;
    drawnTextColorPicker.value = appConfig.drawnTextColor;
    drawnTextColorPicker.addEventListener('input', (e) => appStore.state.appConfig.drawnTextColor = (e.target as HTMLInputElement).value);
    drawnTextColorPicker.addEventListener('change', () => appStore.debouncedSave());

    const drawnStrokeColorPicker = document.getElementById('drawn-stroke-color-picker') as HTMLInputElement;
    drawnStrokeColorPicker.value = appConfig.drawnTextStrokeColor;
    drawnStrokeColorPicker.addEventListener('input', (e) => appStore.state.appConfig.drawnTextStrokeColor = (e.target as HTMLInputElement).value);
    drawnStrokeColorPicker.addEventListener('change', () => appStore.debouncedSave());
    
    const strokeWidthSlider = document.getElementById('drawn-stroke-width-slider') as HTMLInputElement;
    const strokeWidthValue = document.getElementById('drawn-stroke-width-value') as HTMLElement;
    strokeWidthSlider.value = appConfig.drawnTextStrokeWidth.toString();
    strokeWidthValue.textContent = appConfig.drawnTextStrokeWidth.toString();
    strokeWidthSlider.addEventListener('input', (e) => {
        const width = parseInt((e.target as HTMLInputElement).value);
        appStore.state.appConfig.drawnTextStrokeWidth = width;
        strokeWidthValue.textContent = width.toString();
    });
    strokeWidthSlider.addEventListener('change', () => appStore.debouncedSave());

    const autocloseCheckbox = document.getElementById('enable-modal-autoclose') as HTMLInputElement;
    const autocloseTimer = document.getElementById('modal-autoclose-timer') as HTMLInputElement;
    const autocloseValue = document.getElementById('modal-autoclose-value') as HTMLElement;
    autocloseCheckbox.checked = appConfig.enableModalAutoclose;
    autocloseTimer.value = appConfig.modalAutocloseSeconds.toString();
    autocloseValue.textContent = appConfig.modalAutocloseSeconds.toString();
    autocloseCheckbox.addEventListener('change', (e) => {
        appStore.state.appConfig.enableModalAutoclose = (e.target as HTMLInputElement).checked;
        appStore.debouncedSave();
    });
    autocloseTimer.addEventListener('input', (e) => {
        const seconds = parseInt((e.target as HTMLInputElement).value);
        appStore.state.appConfig.modalAutocloseSeconds = seconds;
        autocloseValue.textContent = seconds.toString();
    });
    autocloseTimer.addEventListener('change', () => appStore.debouncedSave());

    const themeToggle = document.getElementById('theme-toggle') as HTMLInputElement;
    if (themeToggle) {
        themeToggle.checked = appConfig.isDarkMode !== false; // default true
        themeToggle.addEventListener('change', (e) => {
            appStore.state.appConfig.isDarkMode = (e.target as HTMLInputElement).checked;
            applyTheme();
            appStore.debouncedSave();
        });
    }

    // --- Sponsors Tab ---
    populateSettingsSponsorsTab();

    // --- Labels Tab ---
    (document.getElementById('label-prize1Label') as HTMLInputElement).value = appLabels.prize1Label;
    (document.getElementById('label-prize2Label') as HTMLInputElement).value = appLabels.prize2Label;
    (document.getElementById('label-prize3Label') as HTMLInputElement).value = appLabels.prize3Label;
    
    (document.getElementById('label-prize1Label') as HTMLInputElement).addEventListener('change', e => { appLabels.prize1Label = (e.target as HTMLInputElement).value; appStore.debouncedSave(); });
    (document.getElementById('label-prize2Label') as HTMLInputElement).addEventListener('change', e => { appLabels.prize2Label = (e.target as HTMLInputElement).value; appStore.debouncedSave(); });
    (document.getElementById('label-prize3Label') as HTMLInputElement).addEventListener('change', e => { appLabels.prize3Label = (e.target as HTMLInputElement).value; appStore.debouncedSave(); });

    populateSettingsLabelsTab();

    // --- Shortcuts Tab ---
    populateSettingsShortcutsTab();
    
    // --- Bottom Buttons ---
    document.getElementById('generate-test-data-btn')!.addEventListener('click', generateTestData);
    document.getElementById('close-settings-btn')!.addEventListener('click', () => {
        DOMElements.settingsModal.classList.add('hidden');
        applyLabels();
        renderUIFromState(); // To update any visual changes
    });
}

        function generateTestData() {
            appStore.state.gameCount = 6;
            appStore.state.gamesData = {};
            appStore.state.drawnPrizeNumbers = [12, 45, 101, 300]; 
            appStore.state.activeGameNumber = '3';

            for (let i = 1; i <= appStore.state.gameCount; i++) {
                appStore.state.gamesData[i] = {
                    name: `Rodada de Teste ${i}`,
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
            
            appStore.state.gamesData[1].winners.push({ id: 101, name: "Maria " + appStore.state.appLabels.prize1Label, prize: appStore.state.gamesData[1].prizes.prize1, gameNumber: '1', bingoType: 'prize1', numbers: appStore.state.gamesData[1].calledNumbers });
            appStore.state.gamesData[2].winners.push({ id: 201, name: "João " + appStore.state.appLabels.prize2Label, prize: appStore.state.gamesData[2].prizes.prize2, gameNumber: '2', bingoType: 'prize2', numbers: appStore.state.gamesData[2].calledNumbers });
            appStore.state.gamesData[2].isComplete = true;
            appStore.state.gamesData[4].winners.push({ id: 401, name: "Pedro Teste", prize: appStore.state.gamesData[4].prizes.prize2, gameNumber: '4', bingoType: 'prize2', numbers: appStore.state.gamesData[4].calledNumbers });
            appStore.state.gamesData[4].isComplete = true;
            appStore.state.gamesData[5].winners.push({ id: 501, name: "Ana " + appStore.state.appLabels.prize3Label, prize: appStore.state.gamesData[5].prizes.prize3, gameNumber: '5', bingoType: 'prize3', numbers: appStore.state.gamesData[5].calledNumbers });
            appStore.state.gamesData[5].isComplete = true;
            appStore.state.gamesData[6].winners.push({ id: 601, name: "Final Evento", prize: appStore.state.gamesData[6].prizes.prize2, gameNumber: '6', bingoType: 'prize2', numbers: appStore.state.gamesData[6].calledNumbers });
            appStore.state.gamesData[6].isComplete = true;

            if (!appStore.state.gamesData['Brindes']) appStore.state.gamesData['Brindes'] = { winners: [] };
            appStore.state.gamesData['Brindes'].winners.push({ id: 901, name: "Carla", prize: "Ventilador", gameNumber: 'Brinde', bingoType: 'Sorteio', cartela: '12' });
            appStore.state.gamesData['Brindes'].winners.push({ id: 902, name: "Ronaldo", prize: "Rádio", gameNumber: 'Brinde', bingoType: 'Sorteio', cartela: '101' });

            if (!appStore.state.gamesData['Leilão']) appStore.state.gamesData['Leilão'] = { winners: [] };
            appStore.state.gamesData['Leilão'].winners.push({ id: 1001, name: "Marcos", prize: "Bolo (Leilão)", gameNumber: 'Leilão', bingoType: 'Leilão', itemName: "Bolo de Chocolate", bid: "150" });
            
            appStore.state.appConfig.isEventClosed = false;
            appStore.state.activeGameNumber = '3';
            appStore.state.gamesData[3].calledNumbers = appStore.state.gamesData[3].calledNumbers.slice(0, 10);

            const savePromise = appStore.saveStateToLocalStorage();
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

        const particleCount = 50; // Efeito contínuo com contagem fixa de partículas
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
    confettiAnimationId = interval as unknown as number;
}

function applyBoardZoom(scale: number) {
    const wrapper = DOMElements.bingoBoardWrapper;
    const zoomValueEl = document.getElementById('board-zoom-value');
    if (wrapper) {
        // Use CSS zoom (cleanest approach that updates layout properly in Chromium)
        wrapper.style.zoom = `${scale}%`;
    }
    if (zoomValueEl) {
        zoomValueEl.textContent = `${scale}%`;
    }
}

function applyDisplayZoom(scale: number) {
    const wrapper = DOMElements.currentNumberWrapper;
    const zoomValueEl = document.getElementById('display-zoom-value');
    if (wrapper) {
        wrapper.style.zoom = `${scale}%`;
    }
     if (zoomValueEl) {
        zoomValueEl.textContent = `${scale}%`;
    }
}

        const fileToBase64 = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.8): Promise<string> =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target?.result as string;
                    img.onload = () => {
                        let width = img.width;
                        let height = img.height;

                        if (width > maxWidth || height > maxHeight) {
                            const ratio = Math.min(maxWidth / width, maxHeight / height);
                            width *= ratio;
                            height *= ratio;
                        }

                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) {
                            resolve(reader.result as string); // fallback
                            return;
                        }
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        // Preserve transparency using WebP (or PNG for older browsers, though WebP is widely supported now)
                        let format = 'image/webp';
                        if (file.type === 'image/png') {
                             // Use PNG for pristine logos if they specifically uploaded a PNG and size is small enough, but webp is safer for compression.
                             // Actually, let's just use WebP for everything as it supports transparency and compression.
                        }
                        const dataUrl = canvas.toDataURL('image/webp', quality);
                        resolve(dataUrl);
                    };
                    img.onerror = (error) => reject(error);
                };
                reader.onerror = error => reject(error);
            });
            
        function applyLabels() {
            const { appLabels } = appStore.state;
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
            const sortedGameNumbers = Object.keys(appStore.state.gamesData).filter(key => !isNaN(parseInt(key))).map(Number).sort((a, b) => a - b);
            for (const num of sortedGameNumbers) { if (!appStore.state.gamesData[num].isComplete) return num.toString(); }
            return null;
        }

        function areAllGamesComplete() {
            const gameKeys = Object.keys(appStore.state.gamesData).filter(key => !isNaN(parseInt(key)));
            if (gameKeys.length === 0) return false;
            return gameKeys.every(key => appStore.state.gamesData[key].isComplete);
        }

        function updateProgramTitle() {
            document.title = "Bingo Show";
        }

        function applyTheme() {
            const isDark = appStore.state.appConfig.isDarkMode !== false;
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
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

        async function deleteSponsorImage(id: string) {
            const db = await openDb();
            return new Promise<void>((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.delete(id);
                request.onsuccess = () => resolve();
                request.onerror = () => reject("Failed to delete image from IndexedDB.");
            });
        }

        async function clearAllSponsorImages() {
            try {
                const db = await openDb();
                return new Promise<void>((resolve, reject) => {
                    const transaction = db.transaction(STORE_NAME, 'readwrite');
                    const store = transaction.objectStore(STORE_NAME);
                    const request = store.clear();
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject("Failed to clear images from IndexedDB.");
                });
            } catch (e) {
                console.error(e);
            }
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
                            if (item.id === 'global' && appStore.state.appConfig.globalSponsor) {
                                appStore.state.appConfig.globalSponsor.image = item.image;
                            }
                            else if (appStore.state.appConfig.sponsorsByNumber[item.id]) {
                                appStore.state.appConfig.sponsorsByNumber[item.id].image = item.image;
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

        async function saveStateToFile() {
            try {
                await appStore.saveStateToLocalStorage();
        
                const appState = appStore.getAppStateForSaving();
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
        
                    appStore.loadStateFromObject(loadedState);
                    renderUIFromState();
                    applyLabels();
                    appStore.debouncedSave();
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

        function renderUIFromState() {
            const { gamesData, activeGameNumber, appConfig, appLabels } = appStore.state;
            applyTheme();
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
            const { activeGameNumber, gamesData, appLabels, appConfig } = appStore.state;
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
            appStore.debouncedSave();
        }

        function showFloatingNumber(number: number) {
            const { activeGameNumber, gamesData, appConfig } = appStore.state;
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
            const { activeGameNumber, gamesData, appConfig } = appStore.state;
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
            const zoomOutBtn = document.getElementById('zoom-out-btn-floating')!;
            const zoomInBtn = document.getElementById('zoom-in-btn-floating')!;
            const confirmFloatingBtn = document.getElementById('confirm-floating-btn')!;
            const cancelFloatingBtn = document.getElementById('cancel-floating-btn')!;

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
                appStore.state.appConfig.floatingNumberZoom = scale;
            };

            const adjustZoom = (amount: number) => {
                 const newZoom = Math.max(50, Math.min(200, appStore.state.appConfig.floatingNumberZoom + amount));
                 applyZoom(newZoom);
                 appStore.debouncedSave();
            };

            const initialZoom = appStore.state.appConfig.floatingNumberZoom || 100;
            applyZoom(initialZoom);

            zoomInBtn.addEventListener('click', () => adjustZoom(5));
            zoomOutBtn.addEventListener('click', () => adjustZoom(-5));

            DOMElements.floatingNumberModal.classList.remove('hidden');

            const cleanup = () => {
                document.removeEventListener('keydown', handleKeydown);
                clearTimeout(floatingNumberTimeout as ReturnType<typeof setTimeout>);
            };

            const confirmAndClose = () => {
                cleanup();
                DOMElements.floatingNumberModal.classList.add('hidden');
                announceNumber(number);
            };

            const cancelAndClose = () => {
                cleanup();
                DOMElements.floatingNumberModal.classList.add('hidden');
            };

            const handleKeydown = (e: KeyboardEvent) => {
                switch (e.key) {
                    case '+': e.preventDefault(); adjustZoom(5); break;
                    case '-': e.preventDefault(); adjustZoom(-5); break;
                    case 'Enter': e.preventDefault(); confirmAndClose(); break;
                    case 'Escape': e.preventDefault(); cancelAndClose(); break;
                }
            };
            document.addEventListener('keydown', handleKeydown);

            confirmFloatingBtn.addEventListener('click', confirmAndClose);
            cancelFloatingBtn.addEventListener('click', cancelAndClose);

            clearTimeout(floatingNumberTimeout as ReturnType<typeof setTimeout>);

            if (appConfig.enableModalAutoclose) {
                floatingNumberTimeout = setTimeout(confirmAndClose, appConfig.modalAutocloseSeconds * 1000);
            }
        }

        function showSponsorDisplayModal(number: number, sponsor: any) {
            const { activeGameNumber, gamesData, appConfig } = appStore.state;
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
            const zoomValue = document.getElementById('sponsor-display-zoom-value')!;
            const displayWrapper = document.getElementById('sponsor-display-content-wrapper') as HTMLElement;
            const zoomOutBtn = document.getElementById('zoom-out-btn-sponsor')!;
            const zoomInBtn = document.getElementById('zoom-in-btn-sponsor')!;
            const confirmBtn = document.getElementById('confirm-sponsor-display-btn')!;
            const cancelBtn = document.getElementById('cancel-sponsor-display-btn')!;


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
                appStore.state.appConfig.sponsorDisplayZoom = scale;
            };

            const adjustZoom = (amount: number) => {
                 const newZoom = Math.max(50, Math.min(200, appStore.state.appConfig.sponsorDisplayZoom + amount));
                 applyZoom(newZoom);
                 appStore.debouncedSave();
            };

            const initialZoom = appStore.state.appConfig.sponsorDisplayZoom || 100;
            applyZoom(initialZoom);

            zoomInBtn.addEventListener('click', () => adjustZoom(5));
            zoomOutBtn.addEventListener('click', () => adjustZoom(-5));


            DOMElements.sponsorDisplayModal.classList.remove('hidden');

            const cleanup = () => {
                document.removeEventListener('keydown', handleKeydown);
                clearTimeout(floatingNumberTimeout as ReturnType<typeof setTimeout>);
            };

            const confirmAndAnnounce = () => {
                cleanup();
                DOMElements.sponsorDisplayModal.classList.add('hidden');
                announceNumber(number);
            };
        
            const cancelDraw = () => {
                cleanup();
                DOMElements.sponsorDisplayModal.classList.add('hidden');
            };

            const handleKeydown = (e: KeyboardEvent) => {
                switch (e.key) {
                    case '+': e.preventDefault(); adjustZoom(5); break;
                    case '-': e.preventDefault(); adjustZoom(-5); break;
                    case 'Enter': e.preventDefault(); confirmAndAnnounce(); break;
                    case 'Escape': e.preventDefault(); cancelDraw(); break;
                }
            };
            document.addEventListener('keydown', handleKeydown);

            confirmBtn.addEventListener('click', confirmAndAnnounce);
            cancelBtn.addEventListener('click', cancelDraw);

            clearTimeout(floatingNumberTimeout as ReturnType<typeof setTimeout>);

            if (appConfig.enableModalAutoclose) {
                const sponsorDuration = (appConfig.modalAutocloseSeconds + 3) * 1000; 
                floatingNumberTimeout = setTimeout(confirmAndAnnounce, sponsorDuration); 
            }
        }

        function handleAutoDraw() {
            const { activeGameNumber, gamesData } = appStore.state;
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
                const { appConfig } = appStore.state;
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

                let autoCloseTimeout: ReturnType<typeof setTimeout>;

                const closeModalAction = () => {
                    clearTimeout(autoCloseTimeout);
                    if (DOMElements.spinningWheelModal.classList.contains('hidden')) return;

                    DOMElements.spinningWheelModal.classList.add('hidden');
                    document.querySelectorAll('[data-label-key="autoDrawButton"]').forEach(btn => (btn as HTMLButtonElement).disabled = false);
                     showFloatingNumber(drawnNumber);
                };

                closeBtn.onclick = closeModalAction;
                autoCloseTimeout = setTimeout(closeModalAction, 3000);
            };
            
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            const drawnNumber = availableNumbers[randomIndex];

            spinTimeout = setTimeout(() => finishAnimation(drawnNumber), 4000);
            skipBtn.onclick = () => finishAnimation(drawnNumber);
        }
        
        function cancelAnnouncedNumber(number: number) {
            const { activeGameNumber, gamesData, appConfig } = appStore.state;
            if (!activeGameNumber) return;
            const game = gamesData[activeGameNumber];
            if (!game) return;
            
            appStore.removeCalledNumber(number);

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
        }

        function startNewRound() {
            appStore.clearActiveRound();
            loadRoundState(appStore.state.activeGameNumber);
        }

        function loadRoundState(gameNumber: string | null) {
            const { gamesData, appLabels } = appStore.state;
            clearInterval(clockInterval);
            if (gameNumber === null) {
                appStore.setActiveGame(null);
                DOMElements.activeRoundPanel.classList.add('hidden');
                DOMElements.noActiveRoundPanel.classList.remove('hidden');
                (DOMElements.currentNumberEl as HTMLElement).style.visibility = 'hidden';
                 DOMElements.prizeDrawDisplayContainer.classList.add('hidden');
                DOMElements.lastNumbersDisplay.innerHTML = '';
                clearMasterBoard(false);
                return;
            }
            
            appStore.setActiveGame(gameNumber);
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
            
            nameEl.textContent = game.name || `Rodada ${gameNumber}`;
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
                const { drawnTextColor, drawnTextStrokeColor, drawnTextStrokeWidth } = appStore.state.appConfig;
                (DOMElements.currentNumberEl as HTMLElement).style.color = drawnTextColor;
                (DOMElements.currentNumberEl as HTMLElement).style.webkitTextStroke = `${drawnTextStrokeWidth}px ${drawnTextStrokeColor}`;

                DOMElements.currentNumberEl.innerHTML = `<span>${letter}</span><span>${lastNumber}</span>`;
                (DOMElements.currentNumberEl as HTMLElement).style.visibility = 'visible';
            }
        }

        function updateActiveRoundStats() {
            const { activeGameNumber, gamesData } = appStore.state;
            if (!activeGameNumber) return;
            const game = gamesData[activeGameNumber];
            if (!game) return;
            const countEl = document.getElementById('active-round-called-count')!;
            countEl.textContent = `${game.calledNumbers.length} / 75`;
        }

        function renderMasterBoard() {
            const { appConfig } = appStore.state;
            DOMElements.bingoBoardEl.innerHTML = '';
            const currentLetters = appConfig.bingoTitle === 'AJUDE' ? DYNAMIC_LETTERS_AJUDE : DYNAMIC_LETTERS;
            
            const headerSizeClass = 'text-6xl'; 
            const cellSizeClass = 'w-20 h-20 text-5xl'; 

            currentLetters.forEach(letter => {
                const columnWrapper = document.createElement('div');
                columnWrapper.className = 'col-span-2 flex flex-col items-center';
                
                const headerEl = document.createElement('div');
                headerEl.className = `font-black text-sky-400 mb-4 ${headerSizeClass}`;
                headerEl.textContent = letter;
                columnWrapper.appendChild(headerEl);

                const numbersGrid = document.createElement('div');
                numbersGrid.className = 'grid grid-cols-2 gap-2';

                let baseLetter = DYNAMIC_LETTERS[currentLetters.indexOf(letter)];
                const { min, max } = BINGO_CONFIG[baseLetter as keyof typeof BINGO_CONFIG];

                for (let i = min; i <= max; i++) {
                    const cell = document.createElement('div');
                    cell.id = `master-cell-${i}`;
                    cell.textContent = i.toString();
                    
                    let cellClasses = `bingo-cell flex items-center justify-center font-black rounded-full transition-all duration-300 ${cellSizeClass}`;
                    if (appConfig.boardColor !== 'default') {
                        cell.style.backgroundColor = appConfig.boardColor;
                        cellClasses += isLightColor(appConfig.boardColor) ? ' text-gray-900' : ' text-white';
                    } else {
                        cellClasses += ' bg-gray-700 text-slate-300';
                    }
                    cell.className = cellClasses;
                    
                    if (appConfig.enableSponsorsByNumber && appConfig.sponsorsByNumber[i] && appConfig.sponsorsByNumber[i].image) {
                         cell.classList.add('has-sponsor');
                    }

                    cell.addEventListener('click', () => {
                        if (!appStore.state.activeGameNumber) {
                            showAlert("Por favor, selecione uma rodada clicando em 'Jogar' para iniciar.");
                            return;
                        }
                        const game = appStore.state.gamesData[appStore.state.activeGameNumber];
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
            const { activeGameNumber, gamesData, appConfig } = appStore.state;
            const activeRoundColor = (activeGameNumber && gamesData[activeGameNumber]?.color) ? gamesData[activeGameNumber].color : null;
            for (let i = 1; i <= 75; i++) {
                const cell = document.getElementById(`master-cell-${i}`) as HTMLElement;
                if (cell) {
                    cell.classList.remove('scale-125', 'text-gray-900', 'text-slate-200', 'text-white');
                    cell.style.backgroundColor = '';
                    cell.style.transform = '';
                    cell.className = 'bingo-cell flex items-center justify-center font-black rounded-full transition-all duration-300 w-20 h-20 text-5xl';

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
            const { activeGameNumber, gamesData } = appStore.state;
            const cell = document.getElementById(`master-cell-${number}`) as HTMLElement;
            if (cell) {
                cell.classList.remove('bg-gray-700', 'text-slate-300', 'text-gray-900', 'text-white', 'text-slate-200');
                cell.style.backgroundColor = ''; 
                const activeRoundColor = (activeGameNumber && gamesData[activeGameNumber]?.color) ? gamesData[activeGameNumber].color : '#16a34a'; 
                cell.style.backgroundColor = activeRoundColor;
                cell.classList.add(isLightColor(activeRoundColor) ? 'text-gray-900' : 'text-white', 'scale-125');
            }
        }
        
        function updateLastNumbers(letter: string, number: number, shouldAddToState: boolean) {
            if (shouldAddToState) {
                appStore.addCalledNumber(number);
            }

            const { activeGameNumber, gamesData } = appStore.state;
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
            const { gamesData, appLabels } = appStore.state;
            const gameItem = document.createElement('div');
            gameItem.className = 'game-item bg-gray-700 p-4 rounded-xl shadow-lg transition-all duration-300 ease-in-out border border-transparent';
            gameItem.dataset.gameNumber = gameNumber.toString();

            const header = document.createElement('div');
            header.className = 'flex justify-between items-center';
            const title = document.createElement('h3');
            title.className = 'text-lg font-bold text-white';
            title.textContent = gamesData[gameNumber]?.name || `Rodada ${gameNumber}`;

            const controlsWrapper = document.createElement('div');
            controlsWrapper.className = 'flex items-center gap-2';

            const editBtn = document.createElement('button');
            editBtn.innerHTML = '✏️';
            editBtn.title = `Editar Rodada ${gameNumber}`;
            editBtn.className = 'text-lg hover:text-sky-400 transition-colors';
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showRoundEditModal(gameNumber.toString());
            });

            const colorPicker = document.createElement('input');
            colorPicker.type = 'color';
            colorPicker.className = 'w-8 h-8 p-0 border-2 border-gray-600 rounded-full cursor-pointer';
            colorPicker.value = gamesData[gameNumber]?.color || '#FFFFFF'; 
            colorPicker.addEventListener('input', (e) => {
                const newColor = (e.target as HTMLInputElement).value;
                gamesData[gameNumber].color = newColor;
                if (appStore.state.activeGameNumber === gameNumber.toString()) {
                    loadRoundState(appStore.state.activeGameNumber);
                }
                appStore.debouncedSave();
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.title = `Excluir Rodada ${gameNumber}`;
            deleteBtn.className = 'text-lg hover:text-red-500 transition-colors';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                confirmDeleteRound(gameNumber.toString());
            });
            
            controlsWrapper.appendChild(editBtn);
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
                    appStore.debouncedSave();
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
            const newGameNumber = appStore.addExtraGame();
            const { gamesData } = appStore.state;
            const gameEl = createGameElement(newGameNumber, gamesData[newGameNumber].prizes);
            gameEl.classList.add('animate-fade-in-down'); 
            DOMElements.gamesListEl.prepend(gameEl); 
            updateGameItemUI(gameEl, false);
        }

        function confirmDeleteRound(gameNumber: string) {
            const { gamesData } = appStore.state;
            DOMElements.deleteConfirmModal.innerHTML = getModalTemplates().deleteConfirm;
            const roundName = gamesData[gameNumber]?.name || `Rodada ${gameNumber}`;
            (document.getElementById('delete-confirm-message') as HTMLElement).textContent = `Tem certeza que deseja excluir a rodada "${roundName}"? Esta ação não pode ser desfeita.`;
            (document.getElementById('confirm-delete-btn') as HTMLElement).textContent = "Excluir Rodada";
            DOMElements.deleteConfirmModal.classList.remove('hidden');
        
            document.getElementById('confirm-delete-btn')!.addEventListener('click', () => {
                delete gamesData[gameNumber];
                
                const gameEl = document.querySelector(`.game-item[data-game-number="${gameNumber}"]`);
                if (gameEl) {
                    gameEl.remove();
                }
        
                if (appStore.state.activeGameNumber === gameNumber) {
                    appStore.setActiveGame(null);
                    loadRoundState(null); 
                }
        
                DOMElements.deleteConfirmModal.classList.add('hidden');
                appStore.debouncedSave();
            });
            
            document.getElementById('cancel-delete-btn')!.addEventListener('click', () => {
                DOMElements.deleteConfirmModal.classList.add('hidden');
            });
        }
        
        function getLetterForNumber(number: number): string | null {
            const { appConfig } = appStore.state;
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
            const { activeGameNumber, gamesData, appConfig } = appStore.state;
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
            const prize1Btn = document.getElementById('confirm-prize1-btn') as HTMLButtonElement;
            const prize2Btn = document.getElementById('confirm-prize2-btn') as HTMLButtonElement;
            const prize3Btn = document.getElementById('confirm-prize3-btn') as HTMLButtonElement;
            const rejectBtn = document.getElementById('reject-bingo-btn')!;
        
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
                appStore.state.appConfig.verificationPanelZoom = scale;
            };
            
            const adjustZoom = (amount: number) => {
                const newZoom = Math.max(50, Math.min(200, appStore.state.appConfig.verificationPanelZoom + amount));
                applyZoom(newZoom);
                appStore.debouncedSave();
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
        
            const cleanup = () => {
                document.removeEventListener('keydown', handleKeydown);
            };
        
            const handleKeydown = (e: KeyboardEvent) => {
                e.preventDefault();
                switch(e.key) {
                    case '+': adjustZoom(5); break;
                    case '-': adjustZoom(-5); break;
                    case 'Escape': rejectBtn.click(); break;
                    case '1': if (!prize1Btn.disabled) prize1Btn.click(); break;
                    case '2': if (!prize2Btn.disabled) prize2Btn.click(); break;
                    case '3': if (!prize3Btn.disabled) prize3Btn.click(); break;
                }
            };
            document.addEventListener('keydown', handleKeydown);
        
            prize1Btn.addEventListener('click', () => {
                cleanup();
                handleBingoConfirmation('prize1');
            });
            prize2Btn.addEventListener('click', () => {
                cleanup();
                handleBingoConfirmation('prize2');
            });
            prize3Btn.addEventListener('click', () => {
                cleanup();
                handleBingoConfirmation('prize3');
            });
            rejectBtn.addEventListener('click', () => {
                cleanup();
                DOMElements.verificationModal.classList.add('hidden');
            });
        
            prize1Btn.disabled = !game.prizes.prize1;
            prize2Btn.disabled = !game.prizes.prize2;
            prize3Btn.disabled = !game.prizes.prize3;
        }
        
        function areAllPrizesWon(game: any) {
             const hasPrize1 = !!game.prizes.prize1;
             const hasPrize2 = !!game.prizes.prize2;
             const hasPrize3 = !!game.prizes.prize3;
             
             const wonPrize1 = game.winners.some((w: any) => w.bingoType === 'prize1');
             const wonPrize2 = game.winners.some((w: any) => w.bingoType === 'prize2');
             const wonPrize3 = game.winners.some((w: any) => w.bingoType === 'prize3');

             return (!hasPrize1 || wonPrize1) && (!hasPrize2 || wonPrize2) && (!hasPrize3 || wonPrize3);
        }

        function showNextRoundModal(completedRound: string, nextRound: string) {
            const modal = DOMElements.nextRoundModal;
            if (!modal) return;
        
            DOMElements.nextRoundModal.innerHTML = getModalTemplates().nextRound;
        
            (document.getElementById('completed-round-name') as HTMLElement).textContent = completedRound;
            (document.getElementById('next-round-name') as HTMLElement).textContent = nextRound;
            
            modal.classList.remove('hidden');
        
            const progressBar = document.getElementById('next-round-progress') as HTMLElement;
            
            progressBar.style.transition = 'none';
            progressBar.style.width = '100%';
            
            setTimeout(() => {
                progressBar.style.transition = 'width 5s linear';
                progressBar.style.width = '0%';
            }, 50); 
        
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 5000);
        }

        function handleBingoConfirmation(prizeType: string) {
            const { activeGameNumber, gamesData, appConfig, appLabels } = appStore.state;
            if (!activeGameNumber) return;
            const game = gamesData[activeGameNumber];
            if (!game) return;
            appStore.state.currentBingoType = prizeType;
            DOMElements.verificationModal.classList.add('hidden');
            
            DOMElements.winnerModal.innerHTML = getModalTemplates().winner;
            (document.getElementById('winner-title-display') as HTMLElement).textContent = appConfig.bingoTitle + '!';
            (document.getElementById('game-text-winner') as HTMLElement).textContent = game.name || `Rodada ${activeGameNumber}`;
            (document.getElementById('prize-text-winner') as HTMLElement).textContent = appLabels[`${prizeType}Label` as keyof typeof appLabels] + ': ' + game.prizes[prizeType];

            DOMElements.winnerModal.classList.remove('hidden');
            document.getElementById('winner-name-input')!.focus();

            triggerBingoWinConfetti();
            
            const winnerNameInput = document.getElementById('winner-name-input') as HTMLInputElement;
            const registerWinnerBtn = document.getElementById('register-winner-btn')!;
            let countdown = 20;
            const timerEl = document.getElementById('winner-countdown-timer')!;
            timerEl.textContent = countdown.toString();
            
            const cleanupWinnerModal = () => {
                clearInterval(countdownInterval);
                if (confettiAnimationId) clearInterval(confettiAnimationId);
                document.removeEventListener('keydown', handleKeydown);
            };

            const countdownInterval = setInterval(() => {
                countdown--;
                timerEl.textContent = countdown.toString();
                if (countdown <= 0) {
                    cleanupWinnerModal();
                    DOMElements.winnerModal.classList.add('hidden');
                }
            }, 1000);

            const registerAndClose = () => {
                cleanupWinnerModal();
                const winnerName = winnerNameInput.value.trim();
                const winnerData = appStore.addWinner(prizeType, winnerName);
                
                if (winnerData) {
                    renderWinner(winnerData);
                }
                
                DOMElements.winnerModal.classList.add('hidden');
                
                const gameItem = DOMElements.gamesListEl.querySelector(`.game-item[data-game-number="${activeGameNumber}"]`);
                if (gameItem && areAllPrizesWon(game)) {
                    game.isComplete = true;
                    updateGameItemUI(gameItem, true);
                    triggerConfetti({ particleCount: 200, spread: 360 });

                    const nextGameNumber = findNextGameNumber();
                    if (nextGameNumber) {
                        const completedRoundName = game.name || `Rodada ${activeGameNumber}`;
                        const nextRoundName = gamesData[nextGameNumber].name || `Rodada ${nextGameNumber}`;
                        showNextRoundModal(completedRoundName, nextRoundName);
                        
                        document.querySelectorAll('.game-item').forEach(el => el.classList.remove('active-round-highlight'));
                        const nextGameItem = DOMElements.gamesListEl.querySelector(`.game-item[data-game-number="${nextGameNumber}"]`);
                        if (nextGameItem) {
                            nextGameItem.classList.add('active-round-highlight');
                            const playBtn = nextGameItem.querySelector('.play-btn');
                            if (playBtn) {
                                playBtn.textContent = 'Jogando...';
                                playBtn.classList.add('playing-btn');
                            }
                        }
                        loadRoundState(nextGameNumber.toString());
                    } else if (areAllGamesComplete()) {
                        appStore.state.appConfig.isEventClosed = true;
                        showFinalWinnersModal();
                    }
                }
                
                DOMElements.shareBtn.classList.remove('hidden');
                DOMElements.endEventBtn.classList.remove('hidden');
                appStore.debouncedSave();
            };

            registerWinnerBtn.addEventListener('click', registerAndClose);
            
            const handleKeydown = (e: KeyboardEvent) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    registerAndClose();
                } else if (e.key === 'Escape') {
                    cleanupWinnerModal();
                    DOMElements.winnerModal.classList.add('hidden');
                }
            };
            document.addEventListener('keydown', handleKeydown);
        }
        
        function renderWinner(winnerData: any) {
            const { gamesData, appLabels } = appStore.state;
            const winnerCard = document.createElement('div');
            winnerCard.className = 'winner-card bg-gray-700 p-4 rounded-xl shadow-lg transition-transform transform hover:scale-105';
            winnerCard.dataset.winnerId = winnerData.id.toString();

            const prizeText = winnerData.bingoType === 'Sorteio' ? winnerData.prize : `${appLabels[winnerData.bingoType + 'Label' as keyof typeof appLabels]} (${winnerData.prize})`;
            winnerCard.innerHTML = `<h4 class="text-lg font-bold text-white">${winnerData.name}</h4>
                                     <p class="text-sm text-amber-300">${prizeText}</p>
                                     <p class="text-xs text-slate-400 mt-1">${winnerData.gameNumber === 'Brinde' || winnerData.gameNumber === 'Leilão' ? '' : gamesData[winnerData.gameNumber]?.name || `Rodada ${winnerData.gameNumber}`}</p>`;
            
            winnerCard.addEventListener('click', () => showWinnerEditModal(winnerData.id));
            
            DOMElements.winnersContainer.prepend(winnerCard);
        }
        
        function renderAllWinners() {
            DOMElements.winnersContainer.innerHTML = '';
            const allWinners: any[] = [];
            Object.values(appStore.state.gamesData).forEach(game => {
                if (game.winners && game.winners.length > 0) {
                    allWinners.push(...game.winners);
                }
            });
            allWinners.sort((a, b) => b.id - a.id);
            allWinners.forEach(winner => renderWinner(winner));
        }
        
        function showAlert(message: string) {
            DOMElements.customAlertModal.innerHTML = getModalTemplates().alert;
            document.getElementById('custom-alert-message')!.textContent = message;
            DOMElements.customAlertModal.classList.remove('hidden');
            document.getElementById('custom-alert-close-btn')!.addEventListener('click', () => {
                DOMElements.customAlertModal.classList.add('hidden');
            });
        }
        
        function showCongratsModal(winnerName: string, prize: string) {
            DOMElements.congratsModal.innerHTML = getModalTemplates().congrats;
            (document.getElementById('congrats-winner-name') as HTMLElement).textContent = winnerName;
            (document.getElementById('congrats-prize-value') as HTMLElement).textContent = `Ganhou: ${prize}`;
            DOMElements.congratsModal.classList.remove('hidden');
            document.getElementById('close-congrats-modal-btn')!.onclick = () => {
                DOMElements.congratsModal.classList.add('hidden');
                if (confettiAnimationId) clearInterval(confettiAnimationId);
            };
            triggerConfetti();
        }

        function showIntervalModal() {
            const { gamesData, appConfig, menuItems } = appStore.state;
            DOMElements.eventBreakModal.innerHTML = getModalTemplates().eventBreak;
            DOMElements.eventBreakModal.classList.remove('hidden');
            DOMElements.confettiCanvas.style.zIndex = '51'; 
            
            const leftContentEl = document.getElementById('break-left-content')!;
            const rightContentEl = document.getElementById('break-right-content')!;
            const rightTitleEl = document.getElementById('break-right-title')!;
            const clockEl = document.getElementById('break-clock')!;

            const allWinners = Object.values(gamesData).flatMap(g => g.winners || []);
            const allSponsors = Object.values(appConfig.sponsorsByNumber).filter(s => s.image && s.name);
            if (appConfig.globalSponsor.image && appConfig.globalSponsor.name) {
                allSponsors.push(appConfig.globalSponsor);
            }
            
            const rightColumnContent = allSponsors.length > 0 ? allSponsors : allWinners;
            rightTitleEl.textContent = allSponsors.length > 0 ? "Apoio" : "Vencedores";

            let leftIndex = 0;
            let rightIndex = 0;

            const updateContent = () => {
                leftContentEl.classList.add('opacity-0');
                setTimeout(() => {
                    leftContentEl.innerHTML = menuItems[leftIndex % menuItems.length];
                    leftContentEl.classList.remove('opacity-0');
                    leftIndex++;
                }, 500);

                if (rightColumnContent.length > 0) {
                    rightContentEl.classList.add('opacity-0');
                    setTimeout(() => {
                        const item = rightColumnContent[rightIndex % rightColumnContent.length];
                        if (item.image) { 
                            rightContentEl.innerHTML = `<img src="${item.image}" class="max-h-64 object-contain mb-4 rounded-lg shadow-lg"><p>${item.name}</p>`;
                        } else { 
                            rightContentEl.innerHTML = `<p>${item.name}</p><p class="text-amber-400 text-5xl mt-2">${item.prize}</p>`;
                        }
                        rightContentEl.classList.remove('opacity-0');
                        rightIndex++;
                    }, 500);
                } else {
                     rightContentEl.innerHTML = `<p class="text-3xl text-slate-400">Ainda não há vencedores ou patrocinadores cadastrados.</p>`;
                }
            };

            const updateClock = () => {
                clockEl.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            };

            updateContent();
            updateClock();
            
            if (intervalContentInterval) clearInterval(intervalContentInterval);
            if (intervalClockInterval) clearInterval(intervalClockInterval);
            if (breakConfettiInterval) clearInterval(breakConfettiInterval);
            
            intervalContentInterval = setInterval(updateContent, 6000);
            intervalClockInterval = setInterval(updateClock, 1000);
            
            const startConfetti = () => {
                if (typeof confetti === 'function') {
                    const particleCount = 2;
                    confetti({
                        particleCount, angle: 270, spread: 55, origin: { x: Math.random(), y: 0 },
                        startVelocity: 15 + (Math.random() * 20), gravity: 0.7, ticks: 300, zIndex: 51,
                    });
                }
            };
            breakConfettiInterval = setInterval(startConfetti, 150);

            document.getElementById('close-break-modal-btn')!.onclick = () => {
                DOMElements.eventBreakModal.classList.add('hidden');
                clearInterval(intervalContentInterval);
                clearInterval(intervalClockInterval);
                clearInterval(breakConfettiInterval);
                DOMElements.confettiCanvas.style.zIndex = '50';
            };
        }
        
        function updateGameItemUI(gameItem: Element, isComplete: boolean) {
            let buttonContainer = gameItem.querySelector('.mt-3');
            if (!buttonContainer) {
                 buttonContainer = document.createElement('div');
                 buttonContainer.className = 'mt-3';
                 gameItem.appendChild(buttonContainer);
            }

            if (isComplete) {
                gameItem.classList.add('game-completed-style');
                gameItem.classList.remove('cursor-pointer');
                buttonContainer.innerHTML = `<button class="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded-lg text-sm cursor-pointer reopen-btn">Reabrir Rodada</button>`;
                gameItem.classList.add('animate-flash-complete');
                setTimeout(() => gameItem.classList.remove('animate-flash-complete'), 1000);
            } else {
                gameItem.classList.remove('game-completed-style');
                gameItem.classList.add('cursor-pointer');
                const gameNumber = gameItem.getAttribute('data-game-number');
                const isActive = appStore.state.activeGameNumber === gameNumber;
                
                buttonContainer.innerHTML = `<button class="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all shadow-lg play-btn">${isActive ? 'Jogando...' : 'Jogar'}</button>`;
                 if (isActive) {
                    const playBtn = buttonContainer.querySelector('.play-btn');
                    if(playBtn) playBtn.classList.add('playing-btn');
                }
            }
        }
        
        function updateLastPrizesDisplay() {
            const { drawnPrizeNumbers, activeGameNumber, gamesData } = appStore.state;
            DOMElements.lastNumbersDisplay.innerHTML = '';
            if (drawnPrizeNumbers.length === 0) return;
        
            const activeRoundColor = (activeGameNumber && gamesData[activeGameNumber]?.color) ? gamesData[activeGameNumber].color : '#a855f7';
        
            const lastThree = drawnPrizeNumbers.slice(-3).reverse();
            lastThree.forEach((num: number) => {
                const prizeEl = document.createElement('div');
                prizeEl.className = 'text-white font-bold rounded-lg w-28 h-16 flex flex-col items-center justify-center text-3xl shadow-md p-1';
                prizeEl.style.backgroundColor = activeRoundColor;
                
                const labelSpan = document.createElement('span');
                labelSpan.className = 'text-xs';
                labelSpan.textContent = 'Cartela';
        
                const numberSpan = document.createElement('span');
                numberSpan.className = 'text-2xl leading-none';
                numberSpan.textContent = num.toString();
        
                prizeEl.appendChild(labelSpan);
                prizeEl.appendChild(numberSpan);
        
                DOMElements.lastNumbersDisplay.appendChild(prizeEl);
            });
        }

        function drawRandomPrize() {
            const minInput = document.getElementById('prize-draw-min') as HTMLInputElement;
            const maxInput = document.getElementById('prize-draw-max') as HTMLInputElement;
            const noRepeatCheckbox = DOMElements.noRepeatPrizeDrawCheckbox as HTMLInputElement;

            const min = parseInt(minInput.value);
            const max = parseInt(maxInput.value);

            if (isNaN(min) || isNaN(max) || min > max) {
                showAlert("Por favor, insira um intervalo de números válido.");
                return;
            }

            let finalNumber;
            if (noRepeatCheckbox.checked) {
                const availableNumbers = Array.from({ length: max - min + 1 }, (_, i) => i + min)
                    .filter(num => !appStore.state.drawnPrizeNumbers.includes(num));

                if (availableNumbers.length === 0) {
                    showAlert("Todos os números neste intervalo já foram sorteados!");
                    return;
                }
                finalNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
                appStore.state.drawnPrizeNumbers.push(finalNumber);
            } else {
                finalNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            }

            const displayContainer = DOMElements.prizeDrawDisplayContainer;
            const mainNumberDisplay = DOMElements.currentNumberEl;
            const mainDisplayLabel = DOMElements.mainDisplayLabel;

            mainNumberDisplay.style.visibility = 'hidden';
            displayContainer.classList.remove('hidden');
            displayContainer.innerHTML = '';

            const prizeDisplay = document.createElement('div');
            prizeDisplay.className = 'font-black flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80 rounded-full text-white shadow-2xl';
            prizeDisplay.style.fontSize = 'clamp(5rem, 15vw, 10rem)';
            prizeDisplay.style.lineHeight = '1';
            const { activeGameNumber, gamesData } = appStore.state;
            prizeDisplay.style.backgroundColor = (activeGameNumber && gamesData[activeGameNumber]?.color) ? gamesData[activeGameNumber].color : '#a855f7';

            displayContainer.appendChild(prizeDisplay);
            mainDisplayLabel.textContent = "SORTEANDO BRINDE...";

            let shuffleInterval: ReturnType<typeof setInterval>;
            
            const startShuffle = (speed: number) => {
                clearInterval(shuffleInterval);
                shuffleInterval = setInterval(() => {
                    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
                    prizeDisplay.textContent = randomNum.toString();
                }, speed);
            };

            startShuffle(50); 
            setTimeout(() => startShuffle(100), 2000); 
            setTimeout(() => startShuffle(200), 3000); 
            setTimeout(() => startShuffle(400), 4000); 

            setTimeout(() => {
                clearInterval(shuffleInterval);
                prizeDisplay.textContent = finalNumber.toString();
                prizeDisplay.classList.add('animate-custom-flash', 'pulse-glow-animation');
                mainDisplayLabel.textContent = "CARTELA SORTEADA!";
                updateLastPrizesDisplay();
                
                const numberInput = document.getElementById('prize-draw-number-manual') as HTMLInputElement;
                const nameInput = document.getElementById('prize-draw-name') as HTMLInputElement;
                if (numberInput) numberInput.value = finalNumber.toString();
                if (nameInput) nameInput.focus();

                setTimeout(() => prizeDisplay.classList.remove('pulse-glow-animation'), 4000);
            }, 5000);

            appStore.debouncedSave();
        }

function showRoundEditModal(gameNumber: string) {
    const { gamesData, appLabels } = appStore.state;
    const game = gamesData[gameNumber];
    if (!game) {
        console.error(`Attempted to edit non-existent round: ${gameNumber}`);
        return;
    }

    DOMElements.roundEditModal.innerHTML = getModalTemplates().roundEdit;

    const titleEl = document.getElementById('round-edit-title') as HTMLElement;
    const nameInput = document.getElementById('round-edit-name') as HTMLInputElement;
    const prizesContainer = document.getElementById('round-edit-prizes-container') as HTMLElement;
    const descriptionTextarea = document.getElementById('round-edit-description') as HTMLTextAreaElement;
    const saveBtn = document.getElementById('save-round-edit-btn') as HTMLButtonElement;
    const cancelBtn = document.getElementById('cancel-round-edit-btn') as HTMLButtonElement;

    titleEl.textContent = `Editar ${game.name || `Rodada ${gameNumber}`}`;
    nameInput.value = game.name;
    descriptionTextarea.value = game.description || '';
    prizesContainer.innerHTML = '';

    Object.keys(game.prizes).forEach((prizeKey, index) => {
        const prizeValue = game.prizes[prizeKey as keyof typeof game.prizes];
        const prizeLabelKey = `prize${index + 1}Label` as keyof typeof appLabels;
        const labelText = appLabels[prizeLabelKey] || `Prêmio ${index + 1}`;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <label for="round-edit-${prizeKey}" class="block text-sm font-medium text-slate-400 mb-1">${labelText}</label>
            <input type="text" id="round-edit-${prizeKey}" data-prize-key="${prizeKey}" value="${prizeValue}" class="w-full p-2 bg-gray-900 text-white rounded-lg text-sm focus:ring-sky-500 focus:border-sky-500">
        `;
        prizesContainer.appendChild(wrapper);
    });

    DOMElements.roundEditModal.classList.remove('hidden');

    saveBtn.onclick = () => {
        game.name = nameInput.value;
        game.description = descriptionTextarea.value;
        
        prizesContainer.querySelectorAll<HTMLInputElement>('input[data-prize-key]').forEach(input => {
            const key = input.dataset.prizeKey;
            if (key && (key === 'prize1' || key === 'prize2' || key === 'prize3')) {
                game.prizes[key] = input.value;
            }
        });

        renderUIFromState();
        
        DOMElements.roundEditModal.classList.add('hidden');
        appStore.debouncedSave();
    };

    cancelBtn.onclick = () => {
        DOMElements.roundEditModal.classList.add('hidden');
    };
}
        
        function setupGlobalKeydownListener() {
            window.addEventListener('keydown', (e) => {
                const activeEl = document.activeElement as HTMLElement;
                const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);
                
                if (DOMElements.winnerModal && !DOMElements.winnerModal.classList.contains('hidden')) {
                    return;
                }

                const isOtherModalOpen = !!document.querySelector('.fixed.inset-0.z-50:not(.hidden):not(#verification-modal):not(#floating-number-modal):not(#sponsor-display-modal)');
                if (isOtherModalOpen) {
                    return;
                }

                if (isInputFocused) {
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
                
                if (['Control', 'Alt', 'Shift', 'Meta'].includes(key)) {
                    return;
                }
                shortcutString += key;

                const action = Object.keys(appStore.state.appConfig.shortcuts).find(
                    (k) => appStore.state.appConfig.shortcuts[k as keyof typeof appStore.state.appConfig.shortcuts] === shortcutString
                );
                
                if (action) {
                    e.preventDefault();
                    
                    switch (action) {
                        case 'autoDraw': handleAutoDraw(); break;
                        case 'verify': showVerificationPanel(); break;
                        case 'clearRound': confirmClearRound(); break;
                        case 'drawPrize': drawRandomPrize(); break;
                        case 'registerPrize': (document.getElementById('prize-draw-form') as HTMLFormElement)?.requestSubmit(); break;
                        case 'sellAuction': (DOMElements.auctionForm as HTMLFormElement)?.requestSubmit(); break;
                        case 'showInterval': showIntervalModal(); break;
                    }
                }
            });
        }

        // --- Gerador e Verificador de Cartelas ---
        function generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        
        function generateSingleBingoCardNumbers(): number[][] {
            const card: number[][] = [];
            const ranges = {
                B: { min: 1, max: 15, count: 5 },
                I: { min: 16, max: 30, count: 5 },
                N: { min: 31, max: 45, count: 4 }, // Centro é livre
                G: { min: 46, max: 60, count: 5 },
                O: { min: 61, max: 75, count: 5 }
            };
        
            Object.values(ranges).forEach(config => {
                const column: number[] = [];
                const availableNumbers = Array.from({ length: config.max - config.min + 1 }, (_, i) => i + config.min);
                for (let i = 0; i < config.count; i++) {
                    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
                    column.push(availableNumbers.splice(randomIndex, 1)[0]);
                }
                card.push(column.sort((a, b) => a - b));
            });
        
            card[2].splice(2, 0, 0); // Usando 0 para o espaço livre
        
            return card;
        }

        let pendingPrintCardQuantity = 0;
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
            const logoData = appStore.state.appConfig.customLogoBase64 || '';

            for (const uuid of previewUUIDs) {
                const cardData = appStore.state.cardsData[uuid];
                if (!cardData) continue;
                
                let qrDataUrl = "";
                try {
                    qrDataUrl = await QRCode.toDataURL(uuid, { width: 80, margin: 1 });
                } catch (err) {}

                // In preview, we don't render the huge full layout, just a simplified card (but with bigger squares)
                finalHTML += `
                    <div class="bingo-card-print p-4 border border-gray-300 rounded-lg text-black bg-white flex flex-col items-center shadow-md pb-2" style="page-break-inside: avoid;">
                        <h3 class="text-lg font-bold text-center leading-tight mb-1">${title}</h3>
                        <p class="text-xs mb-2">Cartela N°: ${String(cardData.series).padStart(4, '0')}</p>
                        <div class="grid grid-cols-5 gap-0.5 w-full my-1">
                            ${['B', 'I', 'N', 'G', 'O'].map((letter, colIndex) => `
                                <div class="text-center">
                                    <div class="font-black text-xl text-red-600 mb-1">${letter}</div>
                                    ${cardData.numbers[colIndex].map(num => {
                                        if (num === 0) {
                                            if (pendingPrintUseLogo && logoData) {
                                                return `<div class="w-10 h-10 flex items-center justify-center border border-gray-400"><img src="${logoData}" class="max-w-full max-h-full object-contain p-0.5"></div>`;
                                            }
                                            return `<div class="w-10 h-10 flex items-center justify-center border border-gray-400 font-bold text-lg bg-gray-300">★</div>`;
                                        }
                                        return `<div class="w-10 h-10 flex items-center justify-center border border-gray-400 font-bold text-xl">${num}</div>`;
                                    }).join('')}
                                </div>
                            `).join('')}
                        </div>
                        <img src="${qrDataUrl}" alt="QR Code" class="mt-2 w-16 h-16">
                    </div>
                `;
            }

            if (quantity > 15) {
                finalHTML += `<div class="p-4 border border-transparent flex items-center justify-center text-gray-500 font-bold col-span-full">... e mais ${quantity - 15} cartelas prontas para impressão.</div>`;
            }
            
            previewContainer.innerHTML = finalHTML;
            printBtn.classList.remove('hidden');
        }

        function handleGenerateCards() {
            const titleInput = document.getElementById('card-batch-title') as HTMLInputElement;
            const quantityInput = document.getElementById('card-quantity') as HTMLInputElement;
            const previewContainer = document.getElementById('card-print-preview');
            
            if (!titleInput || !quantityInput || !previewContainer) return;

            const title = titleInput.value.trim() || "Bingo Show";
            const quantity = parseInt(quantityInput.value, 10);

            if (isNaN(quantity) || quantity <= 0 || quantity > 5000) {
                showAlert("Por favor, insira uma quantidade válida entre 1 e 5000.");
                return;
            }

            previewContainer.innerHTML = `<p class="text-slate-400 text-center">Gerando ${quantity} cartelas... Isso pode levar alguns segundos.</p>`;
            
            setTimeout(() => {
                const startSeries = Object.keys(appStore.state.cardsData).length + 1;
                for (let i = 0; i < quantity; i++) {
                    const uuid = generateUUID();
                    const numbers = generateSingleBingoCardNumbers();
                    appStore.state.cardsData[uuid] = {
                        series: startSeries + i,
                        numbers: numbers
                    };
                }
                
                appStore.debouncedSave();
                renderCardsForPreview(title, quantity);
            }, 100);
        }

        async function handlePrintCards() {
            const quantity = pendingPrintCardQuantity;
            const title = pendingPrintCardTitle;
            const perPage = pendingPrintCardPerPage;
            const prizesText = pendingPrintPrizes;
            const menuText = pendingPrintMenu;
            const useLogo = pendingPrintUseLogo;
            const logoData = appStore.state.appConfig.customLogoBase64 || '';

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
                    const prizesHtml = prizesText ? `
                    <div class="w-1/4 border-r border-black p-2 text-[10px] sm:text-xs text-center flex flex-col justify-center bg-gray-50 uppercase font-bold break-all">
                        <div class="mb-2 text-sm text-sky-800">Prêmios/Rodadas</div>
                        <pre class="whitespace-pre-wrap font-sans text-left leading-tight">${prizesText.replace(/</g,'&lt;')}</pre>
                    </div>` : '';

                    const menuHtml = menuText ? `
                    <div class="w-1/4 border-l border-black p-2 text-[10px] sm:text-xs text-center flex flex-col justify-center bg-gray-50 uppercase font-bold break-all relative">
                        <div class="mb-2 text-sm text-sky-800">Cardápio</div>
                        <pre class="whitespace-pre-wrap font-sans text-left leading-tight">${menuText.replace(/</g,'&lt;')}</pre>
                        <div class="absolute bottom-1 right-2 text-[8px] text-gray-500 font-normal">Identificação: ${String(cardData.series).padStart(4,'0')}</div>
                    </div>` : '';

                    const centerWidth = (prizesText && menuText) ? 'w-1/2' : (prizesText || menuText) ? 'w-3/4' : 'w-full';

                    return `
                        <div class="border-2 border-black flex flex-row items-stretch text-black bg-white shadow-sm break-inside-avoid print:break-inside-avoid" style="page-break-inside: avoid; margin-bottom: 2mm;">
                            ${prizesHtml}

                            <!-- CENTER: BINGO CARD -->
                            <div class="${centerWidth} p-2 flex flex-col items-center justify-between">
                                <div class="flex flex-col items-center mb-1">
                                    <h3 class="text-base sm:text-xl font-bold text-center uppercase tracking-tight leading-none">${title}</h3>
                                    <div class="text-[10px] sm:text-xs font-bold text-gray-600 mt-1">Cartela N° ${String(cardData.series).padStart(4, '0')}</div>
                                </div>
                                <div class="grid grid-cols-5 gap-0 w-full mb-1 border-2 border-black">
                                    ${['B', 'I', 'N', 'G', 'O'].map((letter, colIndex) => `
                                        <div class="text-center flex flex-col">
                                            <div class="font-black text-lg sm:text-2xl text-white bg-black border-b border-r border-black">${letter}</div>
                                            ${cardData.numbers[colIndex].map(num => {
                                                const borderClass = colIndex === 4 ? 'border-b border-black' : 'border-b border-r border-black';
                                                if (num === 0) {
                                                    if (useLogo && logoData) {
                                                        return `<div class="aspect-square flex items-center justify-center ${borderClass}"><img src="${logoData}" class="max-w-[80%] max-h-[80%] object-contain" /></div>`;
                                                    }
                                                    return `<div class="aspect-square flex items-center justify-center bg-gray-300 font-bold text-lg sm:text-xl ${borderClass}">★</div>`;
                                                }
                                                return `<div class="aspect-square flex items-center justify-center font-bold text-lg sm:text-2xl ${borderClass}">${num}</div>`;
                                            }).join('')}
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="flex flex-row justify-between w-full items-center px-2">
                                    <div class="text-[8px] text-gray-500 uppercase tracking-widest">${uuid.split('-')[0]}</div>
                                    <img src="${qrDataUrl}" alt="QR Code" class="w-12 h-12 object-contain">
                                </div>
                            </div>
                            
                            ${menuHtml}
                        </div>
                    `;
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

            printWindow.document.write(`
                <html>
                    <head>
                        <title>${title}</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                            /* Minimal margins for 6 per page */
                            @media print {
                                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
                                @page { size: A4 portrait; margin: ${perPage === 6 ? '5mm' : '10mm'}; }
                                .print\\:break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
                            }
                            body { font-family: 'Helvetica', 'Arial', sans-serif; background: white; margin: 0; padding: ${perPage===6?'5px':'20px'}; }
                        </style>
                    </head>
                    <body>
                        <div class="grid ${gridStyles}">
                            ${printHTML}
                        </div>
                        <script>
                            setTimeout(() => {
                                window.print();
                                window.close();
                            }, 500);
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
        
        function showCardGeneratorModal() {
             DOMElements.cardGeneratorModal.innerHTML = getModalTemplates().cardGenerator;
             DOMElements.cardGeneratorModal.classList.remove('hidden');
             
             // Populate prizes
             let prizesLines = [];
             const gameKeys = Object.keys(appStore.state.gamesData).filter(key => parseInt(key) > 0).sort((a,b) => parseInt(a) - parseInt(b));
             for (const key of gameKeys) {
                 const game = appStore.state.gamesData[key];
                 const p1 = game.prizes.prize1;
                 const p2 = game.prizes.prize2;
                 const p3 = game.prizes.prize3;
                 
                 let prizesList = [];
                 if (p1) prizesList.push(`${appStore.state.appLabels.prize1Label}: ${p1}`);
                 if (p2) prizesList.push(`${appStore.state.appLabels.prize2Label}: ${p2}`);
                 if (p3) prizesList.push(`${appStore.state.appLabels.prize3Label}: ${p3}`);
                 
                 if (prizesList.length > 0) {
                     prizesLines.push(game.name || `RODADA ${key}`);
                     prizesLines.push(prizesList.join("\n"));
                     prizesLines.push("");
                 }
             }
             const prizesTextEl = document.getElementById('card-prizes-text') as HTMLTextAreaElement;
             if (prizesTextEl && prizesLines.length > 0) {
                 prizesTextEl.value = prizesLines.join("\n").trim();
             }

             // Populate menu
             const menuTextEl = document.getElementById('card-menu-text') as HTMLTextAreaElement;
             if (menuTextEl && appStore.state.menuItems.length > 0) {
                 menuTextEl.value = appStore.state.menuItems.join("\n");
             }

             document.getElementById('generate-cards-btn')!.addEventListener('click', handleGenerateCards);
             document.getElementById('print-cards-btn')!.addEventListener('click', handlePrintCards);
             document.getElementById('close-card-generator-btn')!.addEventListener('click', () => {
                 DOMElements.cardGeneratorModal.classList.add('hidden');
             });
        }

        let scannerStream: MediaStream | null = null;
        let scannerAnimationId: number | null = null;

        async function showCardScannerModal() {
            DOMElements.cardScannerModal.innerHTML = getModalTemplates().cardScanner;
            DOMElements.cardScannerModal.classList.remove('hidden');
            
            const video = document.getElementById('scanner-video') as HTMLVideoElement;
            const canvas = document.getElementById('scanner-canvas') as HTMLCanvasElement;
            const message = document.getElementById('scanner-message') as HTMLElement;
            const closeBtn = document.getElementById('close-card-scanner-btn') as HTMLButtonElement;

            const cleanupScanner = () => {
                if (scannerAnimationId) cancelAnimationFrame(scannerAnimationId);
                if (scannerStream) {
                    scannerStream.getTracks().forEach(track => track.stop());
                }
                DOMElements.cardScannerModal.classList.add('hidden');
            };

            closeBtn.onclick = cleanupScanner;

            try {
                scannerStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                video.srcObject = scannerStream;
                video.setAttribute("playsinline", "true");
                await video.play();
                
                const tick = () => {
                    if (video.readyState === video.HAVE_ENOUGH_DATA && !DOMElements.cardScannerModal.classList.contains('hidden')) {
                        const ctx = canvas.getContext('2d', { willReadFrequently: true });
                        if (ctx) {
                            canvas.height = video.videoHeight;
                            canvas.width = video.videoWidth;
                            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                                inversionAttempts: "attemptBoth",
                            });
                            
                            if (code) {
                                message.textContent = "QR Code detectado!";
                                message.classList.add("text-green-400");
                                message.classList.remove("text-slate-400");
                                cleanupScanner();
                                verifyCardByQRCode(code.data);
                                return;
                            }
                        }
                    }
                    if (!DOMElements.cardScannerModal.classList.contains('hidden')) {
                        scannerAnimationId = requestAnimationFrame(tick);
                    }
                };
                scannerAnimationId = requestAnimationFrame(tick);
            } catch (error) {
                console.error("Erro ao acessar a câmera:", error);
                message.textContent = "Erro ao acessar a câmera. Verifique as permissões.";
                message.classList.add("text-red-400");
            }
        }

        function verifyCardByQRCode(uuid: string) {
            const cardData = appStore.state.cardsData[uuid];
            
            if (!cardData) {
                showAlert(`Cartela não encontrada na base de dados (${uuid}).`);
                return;
            }
            
            const activeGame = appStore.state.activeGameNumber ? appStore.state.gamesData[appStore.state.activeGameNumber] : null;
            if (!activeGame) {
                showAlert("Nenhuma rodada ativa no momento para verificar a cartela.");
                return;
            }

            const calledNumbers = activeGame.calledNumbers;
            let hits = 0;
            let totalNumbers = 24;
            let isWinner = true;
            let cardHTML = `<div class="grid grid-cols-5 gap-1 w-full my-4 bg-white p-2 rounded text-black max-w-sm mx-auto">`;
            
            for (let col = 0; col < 5; col++) {
                cardHTML += `<div class="text-center"><div class="font-black text-xl text-red-600">${['B', 'I', 'N', 'G', 'O'][col]}</div>`;
                for (let row = 0; row < 5; row++) {
                    const num = cardData.numbers[col][row];
                    if (num === 0) {
                        cardHTML += `<div class="w-8 h-8 flex items-center justify-center border border-gray-400 bg-green-300 font-bold text-xs mx-auto mb-1">★</div>`;
                    } else {
                        const isHit = calledNumbers.includes(num);
                        if (isHit) hits++;
                        if (!isHit) isWinner = false;
                        
                        cardHTML += `<div class="w-8 h-8 flex items-center justify-center border border-gray-400 font-bold text-xs mx-auto mb-1 ${isHit ? 'bg-green-300' : 'bg-red-200'}">${num}</div>`;
                    }
                }
                cardHTML += `</div>`;
            }
            cardHTML += `</div>`;
            
            const resultHtml = isWinner ? 
                `<h3 class="text-2xl font-bold text-green-400 mb-2">BINGO VÁLIDO!</h3><p class="text-slate-200">Todos os números da cartela foram cantados!</p>` :
                `<h3 class="text-2xl font-bold text-red-400 mb-2">BINGO INVÁLIDO</h3><p class="text-slate-200">Faltam ${(totalNumbers - hits)} número(s).</p>`;
                
            DOMElements.customAlertModal.innerHTML = `<div class="modal-content bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
                <h2 class="text-3xl font-bold text-white mb-2">Resultado da Verificação</h2>
                <h3 class="text-xl text-slate-300 mb-4">Cartela N° ${String(cardData.series).padStart(4, '0')}</h3>
                ${resultHtml}
                ${cardHTML}
                <button id="close-card-result-btn" class="mt-6 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-8 rounded-full text-lg">Fechar</button>
            </div>`;
            
            DOMElements.customAlertModal.classList.remove('hidden');
            document.getElementById('close-card-result-btn')!.onclick = () => {
                DOMElements.customAlertModal.classList.add('hidden');
            };
        }
        
        // --- Handlers de Eventos ---

        function setupEventListeners() {
            DOMElements.manualInputForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const number = parseInt(DOMElements.numberInput.value);
                if (!isNaN(number)) {
                    showFloatingNumber(number);
                } else {
                    showError("Por favor, insira um número válido.");
                }
            });

            DOMElements.addExtraGameBtn.addEventListener('click', addExtraGame);
            document.getElementById('auto-draw-btn-top')!.addEventListener('click', handleAutoDraw);
            document.getElementById('auto-draw-btn-bottom')!.addEventListener('click', handleAutoDraw);
            document.getElementById('verify-btn-top')!.addEventListener('click', showVerificationPanel);
            document.getElementById('verify-btn-bottom')!.addEventListener('click', showVerificationPanel);

            DOMElements.prizeDrawForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const numberInput = document.getElementById('prize-draw-number-manual') as HTMLInputElement;
                const nameInput = document.getElementById('prize-draw-name') as HTMLInputElement;
                const descriptionInput = document.getElementById('prize-draw-description') as HTMLInputElement;
                
                const number = numberInput.value;
                if (!number) {
                    showAlert("Por favor, insira o número da cartela do brinde.");
                    return;
                }
                
                if (!appStore.state.gamesData['Brindes']) appStore.state.gamesData['Brindes'] = { winners: [] };
                
                const winnerData = {
                    id: Date.now(),
                    name: nameInput.value || `Ganhador #${number}`,
                    prize: descriptionInput.value || "Brinde",
                    gameNumber: 'Brinde',
                    bingoType: 'Sorteio',
                    cartela: number
                };
                appStore.state.gamesData['Brindes'].winners.push(winnerData);
                renderWinner(winnerData);
                
                numberInput.value = '';
                nameInput.value = '';
                descriptionInput.value = '';
                
                showCongratsModal(winnerData.name, winnerData.prize);
                appStore.debouncedSave();
            });

            DOMElements.gamesListEl.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const gameItem = target.closest('.game-item');
                if (!gameItem) return;

                const gameNumber = gameItem.getAttribute('data-game-number');
                if (!gameNumber) return;

                if (target.classList.contains('reopen-btn')) {
                    const game = appStore.state.gamesData[gameNumber];
                    if (game) {
                        game.isComplete = false;
                        updateGameItemUI(gameItem, false);
                        appStore.debouncedSave();
                    }
                    return;
                }
                
                if (appStore.state.gamesData[gameNumber].isComplete) {
                     showAlert("Esta rodada já foi concluída. Você pode reabri-la se necessário.");
                     return;
                }

                document.querySelectorAll('.game-item').forEach(el => el.classList.remove('active-round-highlight'));
                document.querySelectorAll('.play-btn').forEach(btn => {
                    btn.textContent = 'Jogar';
                    btn.classList.remove('playing-btn');
                });
                
                gameItem.classList.add('active-round-highlight');
                const playBtn = gameItem.querySelector('.play-btn');
                if (playBtn) {
                    playBtn.textContent = 'Jogando...';
                    playBtn.classList.add('playing-btn');
                }
                
                loadRoundState(gameNumber);
            });
            
            document.getElementById('prize-draw-random-btn')!.addEventListener('click', drawRandomPrize);
            DOMElements.shareBtn.addEventListener('click', () => showProofOptionsModal());
            DOMElements.endEventBtn.addEventListener('click', showFinalWinnersModal);
            DOMElements.resetEventBtn.addEventListener('click', () => {
                DOMElements.resetConfirmModal.innerHTML = getModalTemplates().resetConfirm;
                DOMElements.resetConfirmModal.classList.remove('hidden');
                document.getElementById('confirm-reset-btn')!.onclick = async () => {
                    localStorage.removeItem(LOCAL_STORAGE_KEY);
                    await clearAllSponsorImages();
                    window.location.reload();
                };
                document.getElementById('cancel-reset-btn')!.onclick = () => DOMElements.resetConfirmModal.classList.add('hidden');
            });
            DOMElements.intervalBtn.addEventListener('click', showIntervalModal);
            DOMElements.editMenuBtn.addEventListener('click', () => {
                DOMElements.menuEditModal.innerHTML = getModalTemplates().menuEdit;
                DOMElements.menuEditModal.classList.remove('hidden');
                const textarea = document.getElementById('menu-textarea') as HTMLTextAreaElement;
                textarea.value = appStore.state.menuItems.join('\n');
                document.getElementById('save-menu-btn')!.onclick = () => {
                    appStore.state.menuItems = textarea.value.split('\n').filter(item => item.trim() !== '');
                    DOMElements.menuEditModal.classList.add('hidden');
                    appStore.debouncedSave();
                };
                document.getElementById('cancel-menu-edit-btn')!.onclick = () => DOMElements.menuEditModal.classList.add('hidden');
            });
            DOMElements.checkDrawnPrizesBtn.addEventListener('click', showDrawnPrizesModal);
            
            const boardZoomSlider = document.getElementById('board-zoom-slider') as HTMLInputElement;
            const displayZoomSlider = document.getElementById('display-zoom-slider') as HTMLInputElement;
            boardZoomSlider.addEventListener('input', (e) => {
                const scale = parseInt((e.target as HTMLInputElement).value);
                appStore.state.appConfig.boardScale = scale;
                applyBoardZoom(scale);
            });
            boardZoomSlider.addEventListener('change', () => appStore.debouncedSave());
            
            const fullScreenAuctionBtn = document.getElementById('fullscreen-auction-btn');
            if (fullScreenAuctionBtn) {
                fullScreenAuctionBtn.addEventListener('click', () => {
                    const section = document.getElementById('auction-section');
                    if (section) {
                        if (!document.fullscreenElement) {
                            section.requestFullscreen().catch(err => showAlert(`Erro: ${err.message}`));
                        } else {
                            document.exitFullscreen();
                        }
                    }
                });
            }

            const fullScreenPrizeBtn = document.getElementById('fullscreen-prize-btn');
            if (fullScreenPrizeBtn) {
                fullScreenPrizeBtn.addEventListener('click', () => {
                    const section = document.getElementById('draw-and-prize-section');
                    if (section) {
                        if (!document.fullscreenElement) {
                            section.requestFullscreen().catch(err => showAlert(`Erro: ${err.message}`));
                        } else {
                            document.exitFullscreen();
                        }
                    }
                });
            }

            const fullScreenBoardBtn = document.getElementById('fullscreen-board-btn');
            if (fullScreenBoardBtn) {
                fullScreenBoardBtn.addEventListener('click', () => {
                    const section = document.getElementById('board-section');
                    if (section) {
                        if (!document.fullscreenElement) {
                            section.requestFullscreen().catch(err => {
                                showAlert(`Erro ao entrar em tela cheia: ${err.message}`);
                            });
                        } else {
                            document.exitFullscreen();
                        }
                    }
                });
            }
            
            // Listen to fullscreen changes to style the section properly
            document.addEventListener('fullscreenchange', () => {
                const fsControls = document.getElementById('fullscreen-controls');
                const htmlElement = document.documentElement;
                const isDark = htmlElement.classList.contains('dark');
                
                ['board-section', 'auction-section', 'draw-and-prize-section'].forEach(id => {
                    const section = document.getElementById(id);
                    if (!section) return;

                    if (document.fullscreenElement === section) {
                        section.classList.remove('rounded-2xl', 'shadow-xl');
                        section.classList.add('overflow-y-auto');
                        if (id === 'draw-and-prize-section') {
                             section.classList.add('p-4');
                        }
                        
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
                        if (id === 'draw-and-prize-section') {
                             section.classList.remove('p-4');
                        }
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
            
            // FS controls events
            const fsZoomSlider = document.getElementById('fs-board-zoom-slider');
            if (fsZoomSlider) {
                fsZoomSlider.addEventListener('input', (e) => {
                    const scale = parseInt((e.target as HTMLInputElement).value);
                    appStore.state.appConfig.boardScale = scale;
                    applyBoardZoom(scale);
                    const fsBoardZoomValue = document.getElementById('fs-board-zoom-value');
                    if (fsBoardZoomValue) fsBoardZoomValue.textContent = `${scale}%`;
                    const boardZoomSlider = document.getElementById('board-zoom-slider') as HTMLInputElement;
                    if (boardZoomSlider) boardZoomSlider.value = scale.toString();
                    const boardZoomValue = document.getElementById('board-zoom-value');
                    if (boardZoomValue) boardZoomValue.textContent = `${scale}%`;
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


            
            displayZoomSlider.addEventListener('input', (e) => {
                const scale = parseInt((e.target as HTMLInputElement).value);
                appStore.state.appConfig.displayScale = scale;
                applyDisplayZoom(scale);
            });
             displayZoomSlider.addEventListener('change', () => appStore.debouncedSave());

            DOMElements.clearRoundBtnTop.addEventListener('click', confirmClearRound);
            DOMElements.clearRoundBtnBottom.addEventListener('click', confirmClearRound);

            DOMElements.showDonationModalBtn.addEventListener('click', () => {
                DOMElements.donationModal.innerHTML = getModalTemplates().donation;
                (document.getElementById('pix-key-display') as HTMLElement).textContent = appStore.state.appConfig.pixKey;
                document.getElementById('copy-pix-btn')!.addEventListener('click', () => {
                    navigator.clipboard.writeText(appStore.state.appConfig.pixKey);
                    (document.getElementById('copy-pix-btn') as HTMLElement).textContent = 'Copiado!';
                    setTimeout(() => (document.getElementById('copy-pix-btn') as HTMLElement).textContent = appStore.state.appLabels.donationModalCopyButton, 2000);
                });
                document.getElementById('close-donation-btn')!.addEventListener('click', () => DOMElements.donationModal.classList.add('hidden'));
                DOMElements.donationModal.classList.remove('hidden');
            });

             DOMElements.showChangelogBtn.addEventListener('click', () => {
                DOMElements.changelogModal.innerHTML = getModalTemplates().changelog;
                const contentEl = document.getElementById('version-history-content')!;
                const htmlContent = appStore.state.versionHistory
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/- \*\*(.*?)\*\*:/g, '<h3 class="text-sky-400 font-bold mt-3 mb-1">$1</h3><p class="pl-4 border-l-2 border-gray-700">')
                    .replace(/\n- /g, '</p><p class="pl-4 border-l-2 border-gray-700">')
                    .replace(/<p class="pl-4 border-l-2 border-gray-700">$/, ''); 

                contentEl.innerHTML = htmlContent;
                document.getElementById('close-changelog-btn')!.addEventListener('click', () => DOMElements.changelogModal.classList.add('hidden'));
                DOMElements.changelogModal.classList.remove('hidden');
            });

            DOMElements.showSettingsBtn.addEventListener('click', showSettingsModal);

            document.getElementById('add-50-bid')!.addEventListener('click', () => incrementAuctionBid(50));
            document.getElementById('add-100-bid')!.addEventListener('click', () => incrementAuctionBid(100));
            document.getElementById('add-custom-bid-btn')!.addEventListener('click', () => {
                const customInput = document.getElementById('custom-bid-input') as HTMLInputElement;
                const value = parseInt(customInput.value, 10);
                if (!isNaN(value)) {
                    incrementAuctionBid(value);
                    customInput.value = '';
                }
            });

            document.getElementById('reset-auction-btn')!.addEventListener('click', () => {
                (DOMElements.auctionForm as HTMLFormElement).reset();
                 updateAuctionBidDisplay(0);
                 (document.getElementById('auction-item-current-bid') as HTMLInputElement).value = '0';
            });

             DOMElements.auctionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const itemName = (document.getElementById('auction-item-name') as HTMLInputElement).value;
                const winnerName = (document.getElementById('auction-winner-name') as HTMLInputElement).value;
                const bid = (document.getElementById('auction-item-current-bid') as HTMLInputElement).value;

                if (!itemName || !winnerName || !bid || parseInt(bid) <= 0) {
                    showAlert("Preencha todos os campos do leilão (item, arrematador e lance).");
                    return;
                }
                 if (!appStore.state.gamesData['Leilão']) appStore.state.gamesData['Leilão'] = { winners: [] };
                
                const winnerData = {
                    id: Date.now(),
                    name: winnerName,
                    prize: `${itemName} (Leilão)`,
                    gameNumber: 'Leilão',
                    bingoType: 'Leilão',
                    itemName: itemName,
                    bid: bid
                };
                appStore.state.gamesData['Leilão'].winners.push(winnerData);
                renderWinner(winnerData);
                
                showCongratsModal(winnerName, `${itemName} por R$ ${bid},00`);
                (document.getElementById('auction-item-name') as HTMLInputElement).value = '';
                (document.getElementById('auction-winner-name') as HTMLInputElement).value = '';
                (document.getElementById('auction-item-current-bid') as HTMLInputElement).value = '0';
                updateAuctionBidDisplay(0);

                appStore.debouncedSave();
            });
            
            (document.getElementById('load-from-file-input') as HTMLInputElement).addEventListener('change', loadStateFromFile);
            document.getElementById('save-to-file-btn')!.addEventListener('click', saveStateToFile);
            document.getElementById('load-from-file-btn')!.addEventListener('click', () => (document.getElementById('load-from-file-input') as HTMLInputElement).click());

            if (DOMElements.showCardGeneratorBtn) {
                DOMElements.showCardGeneratorBtn.addEventListener('click', showCardGeneratorModal);
            }
            if (document.getElementById('show-card-scanner-btn')) {
                 document.getElementById('show-card-scanner-btn')!.addEventListener('click', showCardScannerModal);
            }
        }

        // --- Inicialização ---
        document.addEventListener('DOMContentLoaded', () => {
            appStore.loadInitialState().then(() => {
                console.log("Estado inicial carregado.");
                setupEventListeners();
                setupGlobalKeydownListener();
            });
        });

        // --- Service Worker ---
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
            });
        }