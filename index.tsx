
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
            customLogoBase64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj4NCiAgICA8ZGVmcz4NCiAgICAgICAgPHJhZGlhbEdyYWRpZW50IGlkPSJiZ0dyYWRpZW50IiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiIGZ4PSI1MCUiIGZ5PSI1MCUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzRhMDBlMDsiLz4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzhlMmRlMjsiLz4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD4NCiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPSJ0ZXh0R29sZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGRDcwMDsiLz4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQTUwMDsiLz4NCiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4NCiAgICAgICAgPGZpbHRlciBpZD0iZ2xvdyI+DQogICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI1IiByZXN1bHQ9ImNvbG9yZWRCbHVyIi8+DQogICAgICAgICAgICA8ZmVNZXJnZT4NCiAgICAgICAgICAgICAgICA8ZmVNZXJnZU5vZGUgaW49ImNvbG9yZWRCbHVyIi8+DQogICAgICAgICAgICAgICAgPGZlTWVyZ2VOb2RlIGluPSJTb3VyY2VHcmFwaGljIi8+DQogICAgICAgICAgICA8L2ZlTWVyZ2U+DQogICAgICAgIDwvZmlsdGVyPg0KICAgICAgICA8ZmlsdGVyIGlkPSJzaGFkb3ciPg0KICAgICAgICAgICAgPGZlRHJvcFNoYWRvdyBkeD0iMyIgZHk9IjMiIHN0ZERldmlhdGlvbj0iMyIgZmxvb2QtY29sb3I9IiMwMDAwMDAiIGZsb29kLW9wYWNpdHk9IjAuNSIvPg0KICAgICAgICA8L2ZpbHRlcj4NCiAgICA8L2RlZnM+DQogICAgDQogICAgPCEtLSBCYWNrZ3JvdW5kIC0tPg0KICAgIDxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMjU2IiBmaWxsPSJ1cmwoI2JnR3JhZGllbnQpIi8+DQogICAgDQogICAgPCEtLSBJbm5lciBjb25jZW50cmljIGNpcmNsZXMgZm9yIGRlcHRoIC0tPg0KICAgIDxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMjMwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4yKSIgc3Ryb2tlLXdpZHRoPSI1Ii8+DQogICAgPGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiByPSIyMTUiIGZpbGw9InJnYmEoMCwwLDAsMC4yKSIgZmlsdGVyPSJ1cmwoI3NoYWRvdykiLz4NCg0KICAgIDwhLS0gQ2VudHJhbCBCaW5nbyBCYWxsIGVsZW1lbnQgLS0+DQogICAgPGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiByPSIxNTAiIGZpbGw9IiNmZmZmZmYiLz4NCiAgICA8Y2lyY2xlIGN4PSIyNTYiIGN5PSIyNTYiIHI9IjE0MCIgZmlsbD0iI2UwZTBlMCIvPg0KICAgIDxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMTMwIiBzdHJva2U9IiNGRkQ3MDAiIHN0cm9rZS13aWR0aD0iOCIgZmlsbD0ibm9uZSIvPg0KICAgIA0KICAgIDwhLS0gR2xvc3N5IEhpZ2hsaWdodCBvbiBiYWxsIC0tPg0KICAgIDxwYXRoIGQ9Ik0gMTgwIDE2MCBBIDEyMCAxMjAgMCAwIDEgMzQwIDIwMCBBIDE1MCAxNTAgMCAwIDAgMTgwIDE2MCBaIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNykiLz4NCg0KICAgIDwhLS0gVGV4dCAiU0hPVyIgLS0+DQogICAgPHRleHQgeD0iNTAlIiB5PSI1NSUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSInSW50ZXInLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0MCIgZm9udC1zd2VpZ2h0PSI5MDAiIGZpbGw9InVybCgjdGV4dEdvbGQpIiBzdHJva2U9IiM2YTNlMDAiIHN0cm9rZS13aWR0aD0iNSIgbGV0dGVyLXNwYWNpbmc9IjgiIGZpbHRlcj0idXJsKCNzaGFkb3cpIj4NCiAgICAgICAgU0hPVw0KICAgIDwvdGV4dD4NCg0KICAgIDwhLS0gUGF0aCBmb3IgIkJJTkdPIiB0ZXh0IC0tPg0KICAgIDxwYXRoIGlkPSJjdXJ2ZSIgZD0iTSAxMDAsIDI1NiBBIDE1NiAxNTYgMCAwIDEgNDEyLCAyNTYiIGZpbGw9Im5vbmUiLz4NCiAgICANCiAgICA8IS0tIFRleHQgIkJJTkdPIiBvbiBhIGN1cnZlIC0tPg0KICAgIDx0ZXh0IHdpZHRoPSI1MTIiIGZvbnQtZmFtaWx5PSInSW50ZXInLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjgwIiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjZmZmZmZmIiBsZXR0ZXItc3BhY2luZz0iMTUiIGZpbHRlcj0idXJsKCNnbG9wKSI+DQogICAgICAgIDx0ZXh0UGF0aCBocmVmPSIjY3VydmUiIHN0YXJ0T2Zmc2V0PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPg0KICAgICAgICAgICAgQklOR08NCiAgICAgICAgPC90ZXh0UGF0aD4NCiAgICA8L3RleHQ+DQogICAgDQogICAgPCEtLSBEZWNvcmF0aXZlIFN0YXJzIC0tPg0KICAgIDxnIGZpbGw9IiNGRkQ3MDAiIGZpbHRlcj0idXJsKCNnbG9wKSI+DQogICAgICAgIDxwYXRoIGQ9Ik0gODAgMTAwIEwgOTAgMTI1IEwgMTE1IDEyNSBMIDk1IDE0MCBMIDEwNSAxNjUgTCA4MCAxNTAgTCA1NSAxNjUgTCA2NSAxNDAgTCA0MCAxMjUgTCA2NSAxMjUgWiIvPg0KICAgICAgICA8cGF0aCBkPSJNIDQzMiAxMDAgTCA0MjIgMTI1IEwgMzk3IDEyNSBMIDQxNyAxNDAgTCA0MDcgMTY1IEwgNDMyIDE1MCBMIDQ1NyAxNjUgTCA0NDcgMTQwIEwgNDcyIDEyNSBMIDQ0NyAxMjUgWiIgdHJhbnNmb3JtPSJzY2FsZSgwLjgpIHRyYW5zbGF0ZSgxMDAsIDIwKSIvPg0KICAgIDwvZz4NCjwvc3ZnPg==',
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
            nextRoundModal: document.getElementById('next-round-modal'),
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

    const keysToExclude = ['prize1Label', 'prize2Label', 'prize3Label'];

    Object.keys(appLabels).forEach(key => {
        if (keysToExclude.includes(key)) return;

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
        wrapper.style.transform = `scale(${scale / 100})`;
    }
    if (zoomValueEl) {
        zoomValueEl.textContent = `${scale}%`;
    }
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

        async function saveStateToFile() {
            try {
                // Garante que o estado mais recente seja salvo no navegador antes de exportar.
                await saveStateToLocalStorage();
        
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

                let autoCloseTimeout: ReturnType<typeof setTimeout>;

                const closeModalAction = () => {
                    clearTimeout(autoCloseTimeout); // Evita que o timer dispare se o botão for clicado
                    if (DOMElements.spinningWheelModal.classList.contains('hidden')) return; // Previne dupla execução

                    DOMElements.spinningWheelModal.classList.add('hidden');
                    document.querySelectorAll('[data-label-key="autoDrawButton"]').forEach(btn => (btn as HTMLButtonElement).disabled = false);
                     showFloatingNumber(drawnNumber);
                };

                closeBtn.onclick = closeModalAction;

                // Adiciona o timer para fechamento automático após 3 segundos
                autoCloseTimeout = setTimeout(closeModalAction, 3000);
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
            
            // Otimização: Tamanhos fixos, o zoom é controlado pelo 'transform: scale' no wrapper.
            // Isso previne o "double-scaling" e melhora a performance.
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
            title.textContent = gamesData[gameNumber]?.name || `Rodada ${gameNumber}`;

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
                name: `Rodada ${gameCount}`,
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
            
            // Forçar reflow para garantir que a transição funcione
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
            if (!activeGameNumber) return;
            const game = gamesData[activeGameNumber];
            if (!game) return;
            currentBingoType = prizeType;
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
            
            const countdownInterval = setInterval(() => {
                countdown--;
                timerEl.textContent = countdown.toString();
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    DOMElements.winnerModal.classList.add('hidden');
                    if (confettiAnimationId) clearInterval(confettiAnimationId);
                }
            }, 1000);

            const registerAndClose = () => {
                clearInterval(countdownInterval);
                const winnerName = winnerNameInput.value.trim();
                const winnerId = Date.now();
                
                const winnerData = {
                    id: winnerId,
                    name: winnerName || "Ganhador Anônimo",
                    prize: game.prizes[prizeType],
                    gameNumber: activeGameNumber,
                    bingoType: prizeType,
                    numbers: [...game.calledNumbers].sort((a,b) => a-b)
                };
                
                game.winners.push(winnerData);
                renderWinner(winnerData);
                
                DOMElements.winnerModal.classList.add('hidden');
                 if (confettiAnimationId) clearInterval(confettiAnimationId);
                
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
                        appConfig.isEventClosed = true;
                        showFinalWinnersModal();
                    }
                }
                
                DOMElements.shareBtn.classList.remove('hidden');
                DOMElements.endEventBtn.classList.remove('hidden');
                debouncedSave();
            };

            registerWinnerBtn.addEventListener('click', registerAndClose);
            
            const handleKeydown = (e: KeyboardEvent) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    registerAndClose();
                    document.removeEventListener('keydown', handleKeydown);
                } else if (e.key === 'Escape') {
                    DOMElements.winnerModal.classList.add('hidden');
                    if (confettiAnimationId) clearInterval(confettiAnimationId);
                    clearInterval(countdownInterval);
                    document.removeEventListener('keydown', handleKeydown);
                }
            };
            document.addEventListener('keydown', handleKeydown);
        }
        
        function renderWinner(winnerData: any) {
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
            Object.values(gamesData).forEach(game => {
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
            document.getElementById('close-congrats-modal-btn')!.addEventListener('click', () => DOMElements.congratsModal.classList.add('hidden'));
            triggerConfetti();
        }

        function showIntervalModal() {
            DOMElements.eventBreakModal.innerHTML = getModalTemplates().eventBreak;
            DOMElements.eventBreakModal.classList.remove('hidden');
            DOMElements.confettiCanvas.style.zIndex = '51'; // Trazer para a frente do modal de intervalo
            
            const leftContentEl = document.getElementById('break-left-content')!;
            const rightContentEl = document.getElementById('break-right-content')!;
            const rightTitleEl = document.getElementById('break-right-title')!;
            const clockEl = document.getElementById('break-clock')!;

            const allWinners = Object.values(gamesData).flatMap(g => g.winners || []);
            const allSponsors = Object.values(appConfig.sponsorsByNumber).filter(s => s.image && s.name);
            if (appConfig.globalSponsor.image && appConfig.globalSponsor.name) {
                allSponsors.push(appConfig.globalSponsor);
            }
            
            // Prioriza exibir patrocinadores. Se não houver, exibe vencedores.
            const rightColumnContent = allSponsors.length > 0 ? allSponsors : allWinners;
            rightTitleEl.textContent = allSponsors.length > 0 ? "Apoio" : "Vencedores";

            let leftIndex = 0;
            let rightIndex = 0;

            const updateContent = () => {
                // Coluna Esquerda: Cardápio
                leftContentEl.classList.add('opacity-0');
                setTimeout(() => {
                    leftContentEl.innerHTML = menuItems[leftIndex % menuItems.length];
                    leftContentEl.classList.remove('opacity-0');
                    leftIndex++;
                }, 500);

                // Coluna Direita: Patrocinadores ou Vencedores
                if (rightColumnContent.length > 0) {
                    rightContentEl.classList.add('opacity-0');
                    setTimeout(() => {
                        const item = rightColumnContent[rightIndex % rightColumnContent.length];
                        if (item.image) { // É um patrocinador
                            rightContentEl.innerHTML = `<img src="${item.image}" class="max-h-64 object-contain mb-4 rounded-lg shadow-lg"><p>${item.name}</p>`;
                        } else { // É um vencedor
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
            
            intervalContentInterval = setInterval(updateContent, 6000);
            intervalClockInterval = setInterval(updateClock, 1000);
            
            const startConfetti = () => {
                // Efeito de chuva
                const particleCount = 2;
                confetti({
                    particleCount,
                    angle: 270,
                    spread: 55,
                    origin: { x: Math.random(), y: 0 },
                    startVelocity: 15 + (Math.random() * 20),
                    gravity: 0.7,
                    ticks: 300,
                    zIndex: 51, // Garante que esteja na frente
                });
            };
            breakConfettiInterval = setInterval(startConfetti, 150);

            document.getElementById('close-break-modal-btn')!.addEventListener('click', () => {
                DOMElements.eventBreakModal.classList.add('hidden');
                clearInterval(intervalContentInterval);
                clearInterval(intervalClockInterval);
                clearInterval(breakConfettiInterval);
                DOMElements.confettiCanvas.style.zIndex = '50'; // Reseta o zIndex
            });
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
                const isActive = activeGameNumber === gameNumber;
                
                buttonContainer.innerHTML = `<button class="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all shadow-lg play-btn">${isActive ? 'Jogando...' : 'Jogar'}</button>`;
                 if (isActive) {
                    const playBtn = buttonContainer.querySelector('.play-btn');
                    if(playBtn) playBtn.classList.add('playing-btn');
                }
            }
        }
        
        function updateLastPrizesDisplay() {
            DOMElements.lastNumbersDisplay.innerHTML = ''; // Limpa números anteriores (bingo ou brinde)
            if (drawnPrizeNumbers.length === 0) return;
        
            const activeRoundColor = (activeGameNumber && gamesData[activeGameNumber]?.color) ? gamesData[activeGameNumber].color : '#a855f7'; // Roxo como fallback
        
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
                    .filter(num => !drawnPrizeNumbers.includes(num));

                if (availableNumbers.length === 0) {
                    showAlert("Todos os números neste intervalo já foram sorteados!");
                    return;
                }
                finalNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
                drawnPrizeNumbers.push(finalNumber);
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
            prizeDisplay.className = 'font-black flex items-center justify-center w-full h-full rounded-full text-white text-[10rem] sm:text-[15rem]';
            prizeDisplay.style.backgroundColor = (activeGameNumber && gamesData[activeGameNumber]?.color) ? gamesData[activeGameNumber].color : '#a855f7'; // Cor da rodada ou roxo

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
                
                // Preenche automaticamente o número sorteado e foca no próximo campo
                const numberInput = document.getElementById('prize-draw-number-manual') as HTMLInputElement;
                const nameInput = document.getElementById('prize-draw-name') as HTMLInputElement;
                if (numberInput) {
                    numberInput.value = finalNumber.toString();
                }
                if (nameInput) {
                    nameInput.focus();
                }

                setTimeout(() => {
                     prizeDisplay.classList.remove('pulse-glow-animation');
                }, 4000);

            }, 5000);

            debouncedSave();
        }
// FIX: Added the missing `showRoundEditModal` function definition.
function showRoundEditModal(gameNumber: string) {
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
        debouncedSave();
    };

    cancelBtn.onclick = () => {
        DOMElements.roundEditModal.classList.add('hidden');
    };
}
        
        function setupGlobalKeydownListener() {
    // Attach listener to the window object for broader and more reliable event capturing.
    window.addEventListener('keydown', (e) => {
        const activeEl = document.activeElement as HTMLElement;
        const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);
        
        // The winner modal has its own specific handler for Enter/Escape, so we block global shortcuts when it's open.
        if (DOMElements.winnerModal && !DOMElements.winnerModal.classList.contains('hidden')) {
            return;
        }

        // If any other modal is open, we also block global shortcuts to prevent actions from firing "behind" the modal.
        const isOtherModalOpen = !!document.querySelector('.fixed.inset-0.z-50:not(.hidden):not(#verification-modal):not(#floating-number-modal):not(#sponsor-display-modal)');
        if (isOtherModalOpen) {
            return;
        }

        // Block shortcuts when typing in any text field.
        if (isInputFocused) {
            return;
        }

        // Build the shortcut string representation from the key event.
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
            // Capitalize keys like 'Enter', 'Delete', etc., to match the config.
            key = key.charAt(0).toUpperCase() + key.slice(1);
        }
        
        // Avoid treating modifier keys themselves as part of the shortcut name.
        if (['Control', 'Alt', 'Shift', 'Meta'].includes(key)) {
            return; // Only a modifier key was pressed.
        }
        shortcutString += key;

        // Find the action corresponding to the pressed shortcut.
        const action = Object.keys(appConfig.shortcuts).find(
            (k) => appConfig.shortcuts[k as keyof typeof appConfig.shortcuts] === shortcutString
        );
        
        // If an action is found, prevent default browser behavior and execute the action.
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
                
                if (!gamesData['Brindes']) gamesData['Brindes'] = { winners: [] };
                
                const winnerData = {
                    id: Date.now(),
                    name: nameInput.value || `Ganhador #${number}`,
                    prize: descriptionInput.value || "Brinde",
                    gameNumber: 'Brinde',
                    bingoType: 'Sorteio',
                    cartela: number
                };
                gamesData['Brindes'].winners.push(winnerData);
                renderWinner(winnerData);
                
                numberInput.value = '';
                nameInput.value = '';
                descriptionInput.value = '';
                
                showCongratsModal(winnerData.name, winnerData.prize);
                debouncedSave();
            });

            DOMElements.gamesListEl.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const gameItem = target.closest('.game-item');
                if (!gameItem) return;

                const gameNumber = gameItem.getAttribute('data-game-number');
                if (!gameNumber) return;

                if (target.classList.contains('reopen-btn')) {
                    const game = gamesData[gameNumber];
                    if (game) {
                        game.isComplete = false;
                        updateGameItemUI(gameItem, false);
                        debouncedSave();
                    }
                    return;
                }
                
                if (gamesData[gameNumber].isComplete) {
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
            DOMElements.shareBtn.addEventListener('click', showProofOptionsModal);
            DOMElements.endEventBtn.addEventListener('click', showFinalWinnersModal);
            DOMElements.resetEventBtn.addEventListener('click', () => {
                DOMElements.resetConfirmModal.innerHTML = getModalTemplates().resetConfirm;
                DOMElements.resetConfirmModal.classList.remove('hidden');
                document.getElementById('confirm-reset-btn')!.onclick = () => {
                    localStorage.removeItem(LOCAL_STORAGE_KEY);
                    window.location.reload();
                };
                document.getElementById('cancel-reset-btn')!.onclick = () => DOMElements.resetConfirmModal.classList.add('hidden');
            });
            DOMElements.intervalBtn.addEventListener('click', showIntervalModal);
            DOMElements.editMenuBtn.addEventListener('click', () => {
                DOMElements.menuEditModal.innerHTML = getModalTemplates().menuEdit;
                DOMElements.menuEditModal.classList.remove('hidden');
                const textarea = document.getElementById('menu-textarea') as HTMLTextAreaElement;
                textarea.value = menuItems.join('\n');
                document.getElementById('save-menu-btn')!.onclick = () => {
                    menuItems = textarea.value.split('\n').filter(item => item.trim() !== '');
                    DOMElements.menuEditModal.classList.add('hidden');
                    debouncedSave();
                };
                document.getElementById('cancel-menu-edit-btn')!.onclick = () => DOMElements.menuEditModal.classList.add('hidden');
            });
            DOMElements.checkDrawnPrizesBtn.addEventListener('click', showDrawnPrizesModal);
            
            // Sliders de Zoom
            const boardZoomSlider = document.getElementById('board-zoom-slider') as HTMLInputElement;
            const displayZoomSlider = document.getElementById('display-zoom-slider') as HTMLInputElement;
            boardZoomSlider.addEventListener('input', (e) => {
                const scale = parseInt((e.target as HTMLInputElement).value);
                appConfig.boardScale = scale;
                applyBoardZoom(scale);
            });
            boardZoomSlider.addEventListener('change', debouncedSave);
            
            displayZoomSlider.addEventListener('input', (e) => {
                const scale = parseInt((e.target as HTMLInputElement).value);
                appConfig.displayScale = scale;
                applyDisplayZoom(scale);
            });
             displayZoomSlider.addEventListener('change', debouncedSave);

            DOMElements.clearRoundBtnTop.addEventListener('click', confirmClearRound);
            DOMElements.clearRoundBtnBottom.addEventListener('click', confirmClearRound);

            DOMElements.showDonationModalBtn.addEventListener('click', () => {
                DOMElements.donationModal.innerHTML = getModalTemplates().donation;
                (document.getElementById('pix-key-display') as HTMLElement).textContent = appConfig.pixKey;
                document.getElementById('copy-pix-btn')!.addEventListener('click', () => {
                    navigator.clipboard.writeText(appConfig.pixKey);
                    (document.getElementById('copy-pix-btn') as HTMLElement).textContent = 'Copiado!';
                    setTimeout(() => (document.getElementById('copy-pix-btn') as HTMLElement).textContent = appLabels.donationModalCopyButton, 2000);
                });
                document.getElementById('close-donation-btn')!.addEventListener('click', () => DOMElements.donationModal.classList.add('hidden'));
                DOMElements.donationModal.classList.remove('hidden');
            });

             DOMElements.showChangelogBtn.addEventListener('click', () => {
                DOMElements.changelogModal.innerHTML = getModalTemplates().changelog;
                const contentEl = document.getElementById('version-history-content')!;
                // Basic Markdown to HTML conversion
                const htmlContent = versionHistory
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/- \*\*(.*?)\*\*:/g, '<h3 class="text-sky-400 font-bold mt-3 mb-1">$1</h3><p class="pl-4 border-l-2 border-gray-700">')
                    .replace(/\n- /g, '</p><p class="pl-4 border-l-2 border-gray-700">')
                    .replace(/<p class="pl-4 border-l-2 border-gray-700">$/, ''); // Remove trailing empty p

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
                 if (!gamesData['Leilão']) gamesData['Leilão'] = { winners: [] };
                
                const winnerData = {
                    id: Date.now(),
                    name: winnerName,
                    prize: `${itemName} (Leilão)`,
                    gameNumber: 'Leilão',
                    bingoType: 'Leilão',
                    itemName: itemName,
                    bid: bid
                };
                gamesData['Leilão'].winners.push(winnerData);
                renderWinner(winnerData);
                
                showCongratsModal(winnerName, `${itemName} por R$ ${bid},00`);

                (DOMElements.auctionForm as HTMLFormElement).reset();
                updateAuctionBidDisplay(0);
                (document.getElementById('auction-item-current-bid') as HTMLInputElement).value = '0';
                
                const gavel = document.getElementById('gavel-icon')!;
                gavel.classList.remove('hidden', 'animate-gavel-strike');
                void gavel.offsetWidth;
                gavel.classList.add('animate-gavel-strike');

                debouncedSave();
            });

             document.getElementById('save-local-btn')!.addEventListener('click', saveStateToFile);
             document.getElementById('load-local-input')!.addEventListener('change', loadStateFromFile);

             DOMElements.activeRoundPanel.addEventListener('click', () => {
                if (activeGameNumber) {
                    showRoundEditModal(activeGameNumber);
                }
            });
        }
        
        function confirmClearRound() {
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
            document.getElementById('cancel-clear-round-btn')!.onclick = () => DOMElements.clearRoundConfirmModal.classList.add('hidden');
        }

        function showProofOptionsModal() {
            DOMElements.proofOptionsModal.innerHTML = getModalTemplates().proofOptions;
            const listContainer = document.getElementById('proof-options-list')!;
            listContainer.innerHTML = ''; 

            const createCheckbox = (id: string, label: string, checked = true) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'flex items-center gap-3 bg-gray-700 p-3 rounded-lg';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `proof-${id}`;
                checkbox.dataset.id = id;
                checkbox.checked = checked;
                checkbox.className = 'h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500';
                const labelEl = document.createElement('label');
                labelEl.htmlFor = `proof-${id}`;
                labelEl.textContent = label;
                labelEl.className = "text-slate-200 font-medium";
                wrapper.appendChild(checkbox);
                wrapper.appendChild(labelEl);
                return wrapper;
            };

            const sortedGameKeys = Object.keys(gamesData)
                .filter(key => !isNaN(parseInt(key)) && gamesData[key].winners?.length > 0)
                .sort((a, b) => parseInt(a) - parseInt(b));
            
            sortedGameKeys.forEach(key => {
                listContainer.appendChild(createCheckbox(`game-${key}`, gamesData[key].name || `Rodada ${key}`));
            });

            if (gamesData['Brindes']?.winners?.length > 0) {
                listContainer.appendChild(createCheckbox('brindes', 'Brindes Sorteados'));
            }
            if (gamesData['Leilão']?.winners?.length > 0) {
                listContainer.appendChild(createCheckbox('leilao', 'Itens do Leilão'));
            }

            DOMElements.proofOptionsModal.classList.remove('hidden');

            document.getElementById('generate-selected-proof-btn')!.onclick = () => {
                const selectedIds = Array.from(listContainer.querySelectorAll<HTMLInputElement>('input:checked')).map(cb => cb.dataset.id);
                generateProof(selectedIds);
                DOMElements.proofOptionsModal.classList.add('hidden');
            };
            document.getElementById('cancel-proof-btn')!.onclick = () => DOMElements.proofOptionsModal.classList.add('hidden');
        }

        function generateProof(selectedIds: (string | undefined)[]) {
            const date = new Date().toLocaleString('pt-BR');
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://bingoshow.netlify.app`;
            const logoSrc = appConfig.customLogoBase64;

            const styles = `
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Roboto+Slab:wght@700&display=swap');
                    :root {
                        --primary-color: #1e3a8a; /* Cor mais escura para impressão */
                        --secondary-color: #333333;
                        --text-color: #111111;
                        --light-gray: #f0f0f0;
                        --border-color: #cccccc;
                    }
                    body {
                        font-family: 'Roboto', sans-serif;
                        margin: 0;
                        padding: 2cm;
                        background-color: #ffffff;
                        color: var(--text-color);
                        line-height: 1.6;
                        font-size: 11pt;
                    }
                    .report-container { max-width: 18cm; margin: auto; }
                    .report-header { text-align: center; border-bottom: 2px solid var(--secondary-color); padding-bottom: 15px; margin-bottom: 25px; }
                    .report-header h1 { margin: 0; font-size: 26pt; color: var(--primary-color); font-family: 'Roboto Slab', serif; }
                    .report-header p { margin: 5px 0 0; font-size: 10pt; color: #555; }
                    .print-button-container { text-align: center; margin-bottom: 20px; }
                    .print-button { padding: 10px 20px; font-size: 12pt; cursor: pointer; background-color: var(--primary-color); color: white; border: none; border-radius: 5px; transition: background-color 0.2s; }
                    .print-button:hover { background-color: #1c3276; }
                    .section { margin-bottom: 30px; page-break-inside: avoid; }
                    .section h2 { font-size: 18pt; color: var(--primary-color); border-bottom: 1px solid var(--border-color); padding-bottom: 8px; margin-bottom: 15px; font-family: 'Roboto Slab', serif; }
                    .winner-block { margin-bottom: 20px; padding-left: 15px; border-left: 3px solid var(--light-gray); }
                    .winner-block p { margin: 4px 0; }
                    .winner-block strong { color: var(--secondary-color); font-weight: 700; }
                    .numbers-list-container h3 { font-size: 12pt; margin-top: 15px; margin-bottom: 10px; font-style: italic; font-weight: normal; color: #444; }
                    .numbers-list {
                        font-family: 'Courier New', Courier, monospace;
                        font-size: 10pt;
                        column-count: 6;
                        column-gap: 20px;
                        background-color: var(--light-gray);
                        border: 1px solid var(--border-color);
                        padding: 15px;
                        border-radius: 5px;
                    }
                    .numbers-list span { display: inline-block; width: 2.5em; text-align: right; }
                    .report-footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid var(--secondary-color);
                        page-break-before: auto;
                    }
                    .footer-content {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 20px;
                    }
                    .footer-logo img {
                        max-height: 60px;
                        object-fit: contain;
                    }
                    .footer-info {
                        font-size: 9pt;
                        color: #555;
                    }
                    .footer-info p {
                        margin: 0;
                    }
                    .footer-qr {
                        text-align: center;
                    }
                    .footer-qr img {
                        width: 80px;
                        height: 80px;
                        display: block;
                        margin: 0 auto 5px;
                    }
                    .footer-qr p {
                        font-size: 8pt;
                        color: #555;
                        margin: 0;
                    }
                    @media print {
                        body { padding: 0; }
                        .print-button-container { display: none; }
                        @page { margin: 2cm; }
                    }
                </style>
            `;
        
            let bodyContent = `<div class="report-container">`;
            bodyContent += `<header class="report-header"><h1>Comprovante do Evento Bingo Show</h1><p>Relatório gerado em: ${date}</p></header>`;
            bodyContent += `<div class="print-button-container"><button class="print-button" onclick="window.print()">🖨️ Imprimir Relatório</button></div>`;

            selectedIds.forEach(id => {
                if (!id) return;
        
                if (id.startsWith('game-')) {
                    const gameNumber = id.replace('game-', '');
                    const game = gamesData[gameNumber];
                    if (game && game.winners.length > 0) {
                        bodyContent += `<section class="section"><h2>${game.name || `Rodada ${gameNumber}`}</h2>`;
                        game.winners.forEach((winner: any) => {
                            bodyContent += `<div class="winner-block">
                                              <p><strong>Ganhador:</strong> ${winner.name}</p>
                                              <p><strong>Prêmio:</strong> ${winner.prize}</p>
                                          </div>`;
                            if (winner.numbers && winner.numbers.length > 0) {
                                bodyContent += `<div class="numbers-list-container">
                                                    <h3>Números Sorteados na Rodada (${winner.numbers.length}):</h3>
                                                    <div class="numbers-list">${winner.numbers.map((n: number) => `<span>${n}</span>`).join('')}</div>
                                                </div>`;
                            }
                        });
                        bodyContent += `</section>`;
                    }
                } else if (id === 'brindes' && gamesData['Brindes']?.winners.length > 0) {
                    bodyContent += `<section class="section"><h2>Brindes Sorteados</h2>`;
                    gamesData['Brindes'].winners.forEach((winner: any) => {
                        bodyContent += `<div class="winner-block">
                                          <p><strong>Ganhador:</strong> ${winner.name}</p>
                                          <p><strong>Prêmio:</strong> ${winner.prize}</p>
                                          <p><strong>Nº da Cartela:</strong> ${winner.cartela}</p>
                                      </div>`;
                    });
                    bodyContent += `</section>`;
                } else if (id === 'leilao' && gamesData['Leilão']?.winners.length > 0) {
                    bodyContent += `<section class="section"><h2>Leilão</h2>`;
                    gamesData['Leilão'].winners.forEach((winner: any) => {
                        bodyContent += `<div class="winner-block">
                                          <p><strong>Arrematador:</strong> ${winner.name}</p>
                                          <p><strong>Item:</strong> ${winner.itemName}</p>
                                          <p><strong>Lance:</strong> R$ ${winner.bid},00</p>
                                      </div>`;
                    });
                    bodyContent += `</section>`;
                }
            });
        
            bodyContent += `
                <footer class="report-footer">
                    <div class="footer-content">
                        <div class="footer-logo">
                            <img src="${logoSrc}" alt="Logo do Programa">
                        </div>
                        <div class="footer-info">
                            <p><strong>Bingo Show</strong></p>
                            <p>Versão ${currentVersion}</p>
                            <p>bingoshow.netlify.app</p>
                        </div>
                        <div class="footer-qr">
                            <img src="${qrCodeUrl}" alt="QR Code para o App">
                            <p>Acesse o App</p>
                        </div>
                    </div>
                </footer>
            `;
            bodyContent += `</div>`;
        
            const fullHtml = `
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <title>Comprovante do Bingo - ${date}</title>
                    ${styles}
                </head>
                <body>
                    ${bodyContent}
                    <script>
                        window.onload = function() {
                            window.print();
                        }
                    </script>
                </body>
                </html>
            `;
        
            const blob = new Blob([fullHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const proofWindow = window.open(url, '_blank');
            if (!proofWindow) {
                showAlert("O bloqueador de pop-ups impediu a abertura do comprovante. Por favor, habilite pop-ups para este site.");
            }
        }

        function showFinalWinnersModal() {
            appConfig.isEventClosed = true;
            debouncedSave();

            DOMElements.finalWinnersModal.innerHTML = getModalTemplates().finalWinners;
            DOMElements.finalWinnersModal.classList.remove('hidden');
            
            const winnerDisplay = document.getElementById('current-winner-card')!;
            const allWinners = Object.values(gamesData).flatMap(g => g.winners || []).sort((a,b) => a.id - b.id);
            let winnerIndex = 0;

            const updateWinnerDisplay = () => {
                if (allWinners.length === 0) {
                    winnerDisplay.innerHTML = `<h3 class="text-3xl font-bold text-white">Nenhum vencedor registrado.</h3>`;
                    winnerDisplay.classList.add('opacity-100', 'scale-100');
                    return;
                }
                const winner = allWinners[winnerIndex];
                const game = gamesData[winner.gameNumber];
                const prizeType = winner.bingoType === 'Sorteio' ? winner.prize : `${appLabels[winner.bingoType + 'Label' as keyof typeof appLabels]} (${winner.prize})`;
                
                winnerDisplay.classList.remove('opacity-100', 'scale-100');
                winnerDisplay.classList.add('opacity-0', 'scale-90');

                setTimeout(() => {
                    winnerDisplay.innerHTML = `<p class="text-xl font-bold text-sky-400 mb-2">${game?.name || winner.gameNumber}</p>
                                           <h3 class="text-5xl font-black text-white">${winner.name}</h3>
                                           <p class="text-3xl font-bold text-amber-300 mt-2">${prizeType}</p>`;
                    winnerDisplay.classList.remove('opacity-0', 'scale-90');
                    winnerDisplay.classList.add('opacity-100', 'scale-100');
                    winnerIndex = (winnerIndex + 1) % allWinners.length;
                }, 500);
            };

            updateWinnerDisplay();
            winnerDisplayTimeout = setInterval(updateWinnerDisplay, winnerDisplayDuration);
            
            // Lógica para exibir patrocinadores no final
            const sponsorsListEl = document.getElementById('final-sponsors-list')!;
            const sponsorMap = new Map<string, {name: string, image?: string}>();
            // Adiciona patrocinadores individuais, garantindo unicidade pelo nome
            Object.values(appConfig.sponsorsByNumber)
                .filter(s => s && s.name)
                .forEach(s => {
                    if (!sponsorMap.has(s.name)) {
                        sponsorMap.set(s.name, {name: s.name, image: s.image });
                    }
                });

            // Adiciona o patrocinador global se ele tiver nome e não estiver já na lista
            if (appConfig.globalSponsor && appConfig.globalSponsor.name && !sponsorMap.has(appConfig.globalSponsor.name)) {
                sponsorMap.set(appConfig.globalSponsor.name, appConfig.globalSponsor);
            }

            const allSponsors = Array.from(sponsorMap.values());

            if(allSponsors.length > 0) {
                sponsorsListEl.innerHTML = ''; // Limpa o container
                allSponsors.forEach(sponsor => {
                    const sponsorEl = document.createElement('div');
                    sponsorEl.className = 'flex flex-col items-center justify-center p-2 bg-gray-700 rounded-lg w-28 text-center';
                    let imageHtml = '';
                    if (sponsor.image) {
                        imageHtml = `<img src="${sponsor.image}" alt="${sponsor.name}" class="h-16 object-contain rounded mb-1">`;
                    }
                    sponsorEl.innerHTML = `${imageHtml}<p class="text-xs mt-1 text-slate-300 w-full truncate" title="${sponsor.name}">${sponsor.name}</p>`;
                    sponsorsListEl.appendChild(sponsorEl);
                });
            } else {
                sponsorsListEl.innerHTML = `<p class="text-slate-400">Nenhum patrocinador cadastrado.</p>`;
            }

            document.getElementById('generate-proof-final-btn')!.addEventListener('click', () => {
                 const allIds = Object.keys(gamesData).map(key => isNaN(parseInt(key)) ? key.toLowerCase() : `game-${key}`);
                 generateProof(allIds);
            });
            document.getElementById('donation-final-btn')!.addEventListener('click', () => {
                 DOMElements.showDonationModalBtn.click();
            });
            document.getElementById('close-final-modal-btn')!.addEventListener('click', () => {
                 DOMElements.finalWinnersModal.classList.add('hidden');
                 clearInterval(winnerDisplayTimeout);
                 if (finalConfettiInterval) clearInterval(finalConfettiInterval);
            });
            
             const startFinalConfetti = () => {
                if (typeof confetti !== 'function') return;
                const count = 200;
                const defaults = { origin: { y: 0.7 }, zIndex: 1000 };
                function fire(particleRatio: number, opts: any) {
                    confetti({
                        ...defaults,
                        ...opts,
                        particleCount: Math.floor(count * particleRatio)
                    });
                }
                fire(0.25, { spread: 26, startVelocity: 55 });
                fire(0.2, { spread: 60 });
                fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
                fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
                fire(0.1, { spread: 120, startVelocity: 45 });
            };
            startFinalConfetti();
            finalConfettiInterval = setInterval(startFinalConfetti, 3000);
        }

        function showWinnerEditModal(winnerId: number) {
            let gameKey: string | null = null;
            let winnerIndex = -1;

            for (const key in gamesData) {
                const index = gamesData[key].winners.findIndex((w: any) => w.id === winnerId);
                if (index !== -1) {
                    gameKey = key;
                    winnerIndex = index;
                    break;
                }
            }

            if (!gameKey) return;
            const winner = gamesData[gameKey].winners[winnerIndex];

            DOMElements.winnerEditModal.innerHTML = getModalTemplates().winnerEdit;
            const nameInput = document.getElementById('edit-winner-name') as HTMLInputElement;
            const prizeInput = document.getElementById('edit-winner-prize') as HTMLInputElement;
            nameInput.value = winner.name;
            prizeInput.value = winner.prize;
            
            DOMElements.winnerEditModal.classList.remove('hidden');

            document.getElementById('save-winner-changes-btn')!.onclick = () => {
                gamesData[gameKey].winners[winnerIndex].name = nameInput.value;
                gamesData[gameKey].winners[winnerIndex].prize = prizeInput.value;
                renderAllWinners();
                DOMElements.winnerEditModal.classList.add('hidden');
                debouncedSave();
            };
            
             document.getElementById('remove-winner-btn')!.onclick = () => {
                DOMElements.deleteConfirmModal.innerHTML = getModalTemplates().deleteConfirm;
                (document.getElementById('delete-confirm-message') as HTMLElement).textContent = `Tem certeza que deseja remover o vencedor "${winner.name}"?`;
                (document.getElementById('confirm-delete-btn') as HTMLElement).textContent = "Remover Vencedor";
                DOMElements.deleteConfirmModal.classList.remove('hidden');

                document.getElementById('confirm-delete-btn')!.onclick = () => {
                    gamesData[gameKey].winners.splice(winnerIndex, 1);
                    renderAllWinners();
                    DOMElements.deleteConfirmModal.classList.add('hidden');
                    DOMElements.winnerEditModal.classList.add('hidden');
                    debouncedSave();
                };
                 document.getElementById('cancel-delete-btn')!.onclick = () => DOMElements.deleteConfirmModal.classList.add('hidden');
            };

            document.getElementById('cancel-winner-edit-btn')!.onclick = () => DOMElements.winnerEditModal.classList.add('hidden');
        }

        function showDrawnPrizesModal() {
            DOMElements.drawnPrizesModal.innerHTML = getModalTemplates().drawnPrizes;
            const lastDrawnEl = document.getElementById('last-drawn-prize-display')!;
            const historyListEl = document.getElementById('drawn-prizes-history-list')!;
            const titleEl = document.getElementById('drawn-prizes-title')!;
            const subtitleEl = document.getElementById('drawn-prizes-subtitle')!;
            
            lastDrawnEl.innerHTML = '';
            historyListEl.innerHTML = '';
            
            const roundColor = (activeGameNumber && gamesData[activeGameNumber]?.color) || '#a855f7';
            titleEl.style.color = roundColor;
            subtitleEl.textContent = `Rodada Ativa: ${activeGameNumber ? (gamesData[activeGameNumber].name || `Rodada ${activeGameNumber}`) : 'Nenhuma'}`;

            if (drawnPrizeNumbers.length > 0) {
                const lastDrawn = drawnPrizeNumbers[drawnPrizeNumbers.length - 1];
                const historyNumbers = drawnPrizeNumbers.slice(0, -1).sort((a, b) => a - b);

                // Display Last Drawn Number
                const lastNumberEl = document.createElement('div');
                lastNumberEl.className = 'w-24 h-24 flex items-center justify-center text-5xl font-bold rounded-full text-white cursor-pointer hover:bg-red-600 transition-colors animate-pulse';
                lastNumberEl.textContent = lastDrawn.toString();
                lastNumberEl.title = 'Clique para remover este número';
                lastNumberEl.style.backgroundColor = roundColor;
                lastNumberEl.addEventListener('click', () => {
                    const index = drawnPrizeNumbers.indexOf(lastDrawn);
                    if (index > -1) {
                        drawnPrizeNumbers.splice(index, 1);
                        debouncedSave();
                        showDrawnPrizesModal(); // Re-render the modal
                    }
                });
                lastDrawnEl.appendChild(lastNumberEl);
                
                // Display History
                if(historyNumbers.length > 0) {
                    historyNumbers.forEach(num => {
                        const numberEl = document.createElement('div');
                        numberEl.className = 'w-16 h-16 flex items-center justify-center text-2xl font-bold rounded-full bg-gray-700 text-white cursor-pointer hover:bg-red-600 transition-colors';
                        numberEl.textContent = num.toString();
                        numberEl.title = 'Clique para remover este número';
                        numberEl.addEventListener('click', () => {
                            const index = drawnPrizeNumbers.indexOf(num);
                            if (index > -1) {
                                drawnPrizeNumbers.splice(index, 1);
                                numberEl.remove(); // Just remove the element, no need to re-render the whole modal
                                debouncedSave();
                            }
                        });
                        historyListEl.appendChild(numberEl);
                    });
                } else {
                     historyListEl.innerHTML = `<p class="text-slate-400">Nenhum outro número no histórico.</p>`;
                }

            } else {
                lastDrawnEl.innerHTML = `<p class="text-slate-400">Nenhum brinde sorteado ainda.</p>`;
                historyListEl.parentElement!.classList.add('hidden'); // Hide history section if no numbers
            }

            document.getElementById('close-drawn-prizes-btn')!.addEventListener('click', () => {
                DOMElements.drawnPrizesModal.classList.add('hidden');
            });
            DOMElements.drawnPrizesModal.classList.remove('hidden');
        }

        function showSettingsModal() {
            DOMElements.settingsModal.innerHTML = getModalTemplates().settings;
            DOMElements.settingsModal.classList.remove('hidden');
            
            // Lógica dos Tabs
            const tabs = ['appearance', 'sponsors', 'labels', 'shortcuts'];
            tabs.forEach(tabId => {
                document.getElementById(`tab-${tabId}`)!.addEventListener('click', () => {
                    tabs.forEach(id => {
                        document.getElementById(`tab-content-${id}`)!.classList.add('hidden');
                        const tabBtn = document.getElementById(`tab-${id}`)!;
                        tabBtn.classList.remove('border-sky-500', 'text-sky-400');
                        tabBtn.classList.add('border-transparent', 'text-gray-400');
                    });
                    document.getElementById(`tab-content-${tabId}`)!.classList.remove('hidden');
                    const activeTabBtn = document.getElementById(`tab-${tabId}`)!;
                    activeTabBtn.classList.add('border-sky-500', 'text-sky-400');
                    activeTabBtn.classList.remove('border-transparent', 'text-gray-400');
                });
            });

            // Tab Aparência
            const logoUpload = document.getElementById('custom-logo-upload') as HTMLInputElement;
            const logoPreview = document.getElementById('custom-logo-preview') as HTMLImageElement;
            const removeLogoBtn = document.getElementById('remove-custom-logo-btn')!;
            logoPreview.src = appConfig.customLogoBase64 || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

            logoUpload.addEventListener('change', async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                    const base64 = await fileToBase64(file);
                    appConfig.customLogoBase64 = base64;
                    logoPreview.src = base64;
                    renderCustomLogo();
                }
            });
            removeLogoBtn.addEventListener('click', () => {
                appConfig.customLogoBase64 = '';
                logoPreview.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                renderCustomLogo();
            });

            const bingoTitleSelect = document.getElementById('bingo-title-select') as HTMLSelectElement;
            bingoTitleSelect.value = appConfig.bingoTitle;
            bingoTitleSelect.addEventListener('change', (e) => {
                const newValue = (e.target as HTMLSelectElement).value;
                appConfig.bingoTitle = newValue;
                const newLetters = newValue === 'AJUDE' ? DYNAMIC_LETTERS_AJUDE : DYNAMIC_LETTERS;
                DYNAMIC_LETTERS.forEach((l, i) => BINGO_CONFIG[l] = BINGO_CONFIG[newLetters[i]]);
                renderMasterBoard();
                loadRoundState(activeGameNumber); 
            });

            const boardColorPicker = document.getElementById('board-color-picker') as HTMLInputElement;
            boardColorPicker.value = appConfig.boardColor === 'default' ? '#374151' : appConfig.boardColor;
            boardColorPicker.addEventListener('input', (e) => {
                appConfig.boardColor = (e.target as HTMLInputElement).value;
                renderMasterBoard();
                loadRoundState(activeGameNumber);
            });
            document.getElementById('reset-board-color-btn')!.addEventListener('click', () => {
                appConfig.boardColor = 'default';
                boardColorPicker.value = '#374151';
                renderMasterBoard();
                loadRoundState(activeGameNumber);
            });

             const textColorPicker = document.getElementById('drawn-text-color-picker') as HTMLInputElement;
            const strokeColorPicker = document.getElementById('drawn-stroke-color-picker') as HTMLInputElement;
            const strokeWidthSlider = document.getElementById('drawn-stroke-width-slider') as HTMLInputElement;
            const strokeWidthValue = document.getElementById('drawn-stroke-width-value') as HTMLElement;

            textColorPicker.value = appConfig.drawnTextColor;
            strokeColorPicker.value = appConfig.drawnTextStrokeColor;
            strokeWidthSlider.value = appConfig.drawnTextStrokeWidth.toString();
            strokeWidthValue.textContent = appConfig.drawnTextStrokeWidth.toString();

            textColorPicker.addEventListener('input', (e) => { appConfig.drawnTextColor = (e.target as HTMLInputElement).value; announceNumber(1); });
            strokeColorPicker.addEventListener('input', (e) => { appConfig.drawnTextStrokeColor = (e.target as HTMLInputElement).value; announceNumber(1); });
            strokeWidthSlider.addEventListener('input', (e) => {
                const width = parseInt((e.target as HTMLInputElement).value);
                appConfig.drawnTextStrokeWidth = width;
                strokeWidthValue.textContent = width.toString();
                announceNumber(1);
            });
            if(activeGameNumber) cancelAnnouncedNumber(1);
            else if(gamesData['1']) gamesData['1'].calledNumbers = [];


             const modalAutocloseCheckbox = document.getElementById('enable-modal-autoclose') as HTMLInputElement;
            const modalAutocloseTimer = document.getElementById('modal-autoclose-timer') as HTMLInputElement;
            const modalAutocloseValue = document.getElementById('modal-autoclose-value') as HTMLElement;

            modalAutocloseCheckbox.checked = appConfig.enableModalAutoclose;
            modalAutocloseTimer.value = appConfig.modalAutocloseSeconds.toString();
            modalAutocloseValue.textContent = appConfig.modalAutocloseSeconds.toString();

            modalAutocloseCheckbox.addEventListener('change', (e) => {
                appConfig.enableModalAutoclose = (e.target as HTMLInputElement).checked;
            });
            modalAutocloseTimer.addEventListener('input', (e) => {
                const seconds = parseInt((e.target as HTMLInputElement).value);
                appConfig.modalAutocloseSeconds = seconds;
                modalAutocloseValue.textContent = seconds.toString();
            });

            // Tab Patrocinadores
            const enableSponsorsCheckbox = document.getElementById('enable-sponsors-by-number-checkbox') as HTMLInputElement;
            enableSponsorsCheckbox.checked = appConfig.enableSponsorsByNumber;
            enableSponsorsCheckbox.addEventListener('change', (e) => {
                appConfig.enableSponsorsByNumber = (e.target as HTMLInputElement).checked;
                renderMasterBoard();
                loadRoundState(activeGameNumber);
            });
            
            const globalSponsorNameInput = document.getElementById('global-sponsor-name') as HTMLInputElement;
            const globalSponsorUpload = document.getElementById('global-sponsor-upload') as HTMLInputElement;
            const globalSponsorPreview = document.getElementById('global-sponsor-preview') as HTMLImageElement;
            const removeGlobalSponsorBtn = document.getElementById('remove-global-sponsor-btn') as HTMLButtonElement;

            if (appConfig.globalSponsor) {
                globalSponsorNameInput.value = appConfig.globalSponsor.name || '';
                globalSponsorPreview.src = appConfig.globalSponsor.image || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            }

            globalSponsorNameInput.addEventListener('change', (e) => {
                appConfig.globalSponsor.name = (e.target as HTMLInputElement).value;
            });

            globalSponsorUpload.addEventListener('change', async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                    const base64 = await fileToBase64(file);
                    appConfig.globalSponsor.image = base64;
                    globalSponsorPreview.src = base64;
                }
            });

            removeGlobalSponsorBtn.addEventListener('click', () => {
                appConfig.globalSponsor = { name: '', image: '' };
                globalSponsorNameInput.value = '';
                globalSponsorPreview.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                globalSponsorUpload.value = '';
                deleteSponsorImage('global');
            });
            
            const sponsorsContainer = document.getElementById('sponsors-by-number-container')!;
            sponsorsContainer.innerHTML = ''; 
            for (let i = 1; i <= 75; i++) {
                const currentNumber = i; // FIX: Capture the loop variable `i` to prevent closure issues.
                const sponsor = appConfig.sponsorsByNumber[currentNumber];
                const wrapper = document.createElement('div');
                wrapper.className = 'grid grid-cols-12 gap-2 items-center text-sm';
                
                const numberLabel = document.createElement('label');
                numberLabel.className = 'col-span-1 font-bold text-slate-300';
                numberLabel.textContent = `${currentNumber}:`;
                
                const nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.placeholder = 'Nome do Patrocinador';
                nameInput.className = 'col-span-5 bg-gray-900 text-white p-2 rounded-lg';
                nameInput.value = sponsor?.name || '';
                nameInput.addEventListener('change', (e) => {
                    if (!appConfig.sponsorsByNumber[currentNumber]) appConfig.sponsorsByNumber[currentNumber] = { name: '', image: '' };
                    appConfig.sponsorsByNumber[currentNumber].name = (e.target as HTMLInputElement).value;
                });

                const imageUpload = document.createElement('input');
                imageUpload.type = 'file';
                imageUpload.accept = 'image/*';
                imageUpload.className = 'col-span-5 text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100';
                imageUpload.addEventListener('change', async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                        const base64 = await fileToBase64(file);
                        if (!appConfig.sponsorsByNumber[currentNumber]) {
                            appConfig.sponsorsByNumber[currentNumber] = { name: '', image: '' };
                        }
                        appConfig.sponsorsByNumber[currentNumber].image = base64;
                        await saveSponsorImage(currentNumber.toString(), base64); // FIX: Persist the image to IndexedDB
                        renderMasterBoard();
                        loadRoundState(activeGameNumber);
                    }
                });

                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = '🗑️';
                removeBtn.title = `Remover patrocinador do número ${currentNumber}`;
                removeBtn.className = 'col-span-1 text-lg hover:text-red-500 transition-colors flex items-center justify-center';
                removeBtn.addEventListener('click', () => {
                    if (appConfig.sponsorsByNumber[currentNumber]) {
                        delete appConfig.sponsorsByNumber[currentNumber];
                        nameInput.value = '';
                        imageUpload.value = '';
                        deleteSponsorImage(currentNumber.toString());
                        renderMasterBoard();
                        loadRoundState(activeGameNumber);
                    }
                });
                
                wrapper.appendChild(numberLabel);
                wrapper.appendChild(nameInput);
                wrapper.appendChild(imageUpload);
                wrapper.appendChild(removeBtn);
                
                sponsorsContainer.appendChild(wrapper);
            }

            // Tab Rótulos
            populateSettingsLabelsTab();
            ['prize1Label', 'prize2Label', 'prize3Label'].forEach(key => {
                const input = document.getElementById(`label-${key}`) as HTMLInputElement;
                if (input) {
                    input.value = appLabels[key as keyof typeof appLabels];
                    input.addEventListener('change', e => {
                        appLabels[key as keyof typeof appLabels] = (e.target as HTMLInputElement).value;
                        renderUIFromState();
                        applyLabels();
                        debouncedSave();
                    });
                }
            });

            // Tab Atalhos
            populateSettingsShortcutsTab();

            // Botões de Ação do Modal
            document.getElementById('generate-test-data-btn')!.addEventListener('click', generateTestData);
            document.getElementById('close-settings-btn')!.addEventListener('click', () => {
                DOMElements.settingsModal.classList.add('hidden');
                debouncedSave(); 
            });
        }

        // --- Inicialização ---

        /**
         * Configura ouvintes de eventos para a funcionalidade de impressão.
         * Atualiza dinamicamente as informações do rodapé de impressão antes de imprimir.
         */
        function setupPrintListeners() {
            window.addEventListener('beforeprint', () => {
                const printVersionEl = document.getElementById('print-version');
                const printDateTimeEl = document.getElementById('print-datetime');
        
                if (printVersionEl) {
                    printVersionEl.textContent = currentVersion;
                }
                if (printDateTimeEl) {
                    printDateTimeEl.textContent = new Date().toLocaleString('pt-BR');
                }
            });
        }

        /**
         * Ponto de entrada principal do aplicativo.
         * Garante que o DOM esteja totalmente carregado antes de inicializar o estado e os eventos.
         */
        document.addEventListener('DOMContentLoaded', () => {
            loadInitialState();
            setupEventListeners();
            setupGlobalKeydownListener();
            setupPrintListeners();
        });