# O Recife sujo

Um ensaio fotográfico e poético em 47 fotografias autorais, com linguagem gráfica inspirada na xilogravura, cinco sextilhas e música instrumental de fundo.

## Editar a base

- A página está em `index.html`.
- Os dados das 47 fotos e as cinco sextilhas estão em `data.js`.
- As imagens estão em `assets/autorais/DSC05656.jpg` e nos demais arquivos da pasta `assets/autorais/`.
- O visual e o tratamento monocromático na exibição estão em `styles.css`.
- Os controles da galeria, a leitura automática e o áudio estão em `app.js`.

O ensaio reúne 47 fotografias autorais: 27 de Samico e 20 de frança. São 31 imagens de 5 de novembro e 16 de 11 de novembro de 2026. As datas foram confirmadas pela autoria e prevalecem sobre o relógio incorreto da câmera do primeiro conjunto. As localizações pesquisadas e seus registros de verificação estão em `data.js` e `assets/credits.json`. Cada imagem conserva sua autoria e sua data nos créditos.

Os primeiros capítulos recebem apresentação monocromática somente na exibição. O Recife Vivo reúne 27 originais coloridos, revelados pelo botão Devolver a cor, sem colorização artificial. Os dois registros originalmente em preto e branco que estavam no Vivo foram integrados aos capítulos anteriores. A galeria ampliada usa as versões web no tratamento fornecido; algumas imagens originais podem já ser monocromáticas. As fotografias não são xilogravuras artesanais.

## Música e leitura

A música em `assets/trilha-demo.wav` é uma composição digital original de demonstração, não uma gravação dos artistas pesquisados. A leitura utiliza a voz de português disponível no navegador, quando suportada. Substitua pelo registro sonoro final do grupo e atualize os créditos para a entrega acadêmica.

## Abrir e apresentar

Sirva a raiz deste projeto com um servidor HTTP. Não há instalação de pacotes nem etapa de compilação. O site funciona em telas de computador e celular e oferece uma galeria com as 47 fotos, navegação por teclado, controle de volume e pausa da música.

## Licenças

Os créditos e direitos das fotos estão em `assets/credits.json` e no próprio site. A fonte Alfa Slab One é distribuída sob SIL Open Font License 1.1, incluída em `assets/OFL-AlfaSlabOne.txt`.

## Recife vivo e identidade visual

O quinto movimento reúne 27 fotografias coloridas, organizadas em sete passagens: trabalho e comércio, histórias em circulação, criação, convivência, pontes, mangue e barcos. O percurso parte das frestas e do desgaste, atravessa permanência, memória e arte, e termina na água em atividade. A ordem constrói uma narrativa visual do Recife sujo ao Recife vivo. O texto e a sextilha aproximam a sobrevivência da cidade do direito de permanecer. O botão Devolver a cor revela os 27 originais coloridos do Recife Vivo; permite rever a apresentação em preto e branco. A preferência Cores originais mantém a cor sem depender dessa transição. A linha-matriz que atravessa um rio, forma uma ponte e se ramifica foi desenhada especialmente para esta base em `assets/linha-matriz.svg`. O cartaz do curta também é um desenho original em SVG, em `assets/curta-poster.svg`.

O refinamento visual e os controles de acesso estão em `enhancements.css` e `enhancements.js`. O painel oferece texto maior, contraste reforçado, retirada de texturas, redução de movimento, cores originais e fonte simples. As preferências são salvas somente no navegador. A leitura tem controles de pausa, retomada e parada.

## Espaço para o curta

O curta está identificado como em produção: não há um vídeo fictício. O roteiro e as propostas de produção própria estão em `assets/roteiro-a3.txt` e no site.

Para publicar o filme, preencha os campos `shortFilm` em `data.js`: `src` para o MP4, `captionsSrc` para as legendas WebVTT finais, `transcript` para a transcrição real e `audioDescriptionSrc` para uma versão do vídeo com audiodescrição. Os recursos só aparecem quando seus respectivos campos são preenchidos. Use caminhos de arquivos reais, colocados dentro de `assets/`.
## GitHub Pages

Esta cópia contém o site diretamente na raiz do repositório e usa caminhos relativos, compatíveis com uma publicação de projeto em GitHub Pages.

Em Settings > Pages, selecione Deploy from a branch, a branch main e a pasta / (root). O arquivo .nojekyll mantém a publicação estática, sem etapa de compilação.

Endereço público: https://estelalindadms.github.io/trabalho-da-faculdade/

Repositório: https://github.com/estelalindadms/trabalho-da-faculdade

Depois de ativar Pages, cada alteração enviada à branch main é publicada automaticamente.

Para testar localmente com Python, execute python -m http.server 8000 na raiz do projeto e abra http://localhost:8000. A publicação online não depende desse servidor nem dos arquivos permanecerem no computador.

## Abertura em cordel

A página inicial apresenta um folheto que abre por clique ou toque na capa e pelo botão Abrir o cordel. Entrar sem animação e Escape entram diretamente no ensaio. A preferência de redução de movimento também torna a abertura imediata. Links para seções chegam ao destino indicado.

As quatro fotos de capa são definidas em coverPhotos, em data.js: DSC05656, DSC05877, DSC05682 e DSC05765. O grupo abre a leitura pelas frestas e fachadas do Recife sujo, preservando a chegada ao rio para o fim do percurso. cordel.js escolhe a imagem uma vez por carregamento e usa localStorage para excluir a última capa exibida. A imagem permanece fixa durante a leitura. As versões de capa preservam o enquadramento integral. O mesmo registro aparece na imagem principal da página.

## Leitura fotográfica da gentrificação

Três imagens do primeiro percurso, de 5 de novembro de 2026, acompanham os estudos existentes. urbanReadings, em data.js, define as legendas e as referências internas. A ampliação usa os mesmos controles da galeria e conserva a autoria, a data e a localização pesquisada.

A feira DSC05655, a travessia DSC05746, as raízes DSC05776 e o píer DSC05779 compõem o Recife Vivo. O movimento sobre permanência reúne seis fotografias: DSC05689, DSC05813, DSC05808 e DSC05662, do primeiro conjunto, e DSC05867 e DSC05917, do percurso de 11 de novembro. Os sebos DSC05670, DSC05691 e DSC05752 aparecem no Recife Vivo. A fachada monocromática DSC05748 abre o capítulo A arte circula, junto à comparação histórica.

## A sessão continua na calçada

O bloco cinemaMemory em data.js é renderizado por app.js no capítulo A arte circula, antes do Recife Vivo. Duas fotografias atuais, DSC05748 e DSC05752, aproximam a fachada e os filmes nas bancas. A fotografia histórica de 1961 compõe a comparação ao lado da fachada atual. A identificação do Trianon é provável por comparação visual. As legendas públicas apresentam o entorno em vez de um endereço não comprovado.

A comparação distingue o Cine Trianon do vizinho Art-Palácio. As datas e as transformações do Art-Palácio vêm da pesquisa de Silva e Pinho (Docomomo, 2024); o sebo histórico na calçada do Trianon é documentado por Kleber Mendonça Filho (Continente, 2013). O projeto do IFPE é apresentado como anúncio de 2024, sem declaração de reabertura concluída. A memória audiovisual recebe um link ao filme do próprio realizador. A comparação visual acrescenta a fotografia de 28/8/1961, de Mário de Carvalho, acervo do Museu da Cidade do Recife, extraída do catálogo oficial Arte Subdesenvolvida (CCBB), pp. 78–79, PDF página 40. A imagem fica ao lado da DSC05748, com data, autoria e fonte. A reprodução de acervo permanece separada das 47 fotografias autorais. O catálogo consultado não explicita licença aberta para essa fotografia; o crédito documenta a procedência, sem declarar uma licença presumida.

A fotografia de arquivo está em `assets/acervo/trianon-1961-mario-de-carvalho.jpg`, em sua resolução publicada de 547 × 370 px, sem recorte ou tratamento adicional. Seus dados estão em `cinemaMemory.comparison.historical` e em `externalImages` de `assets/credits.json`. A imagem de Samico mantém sua ampliação pela galeria; o registro de 1961 abre o JPEG em nova aba.

## Seleção e percurso visual

A seleção reúne 47 fotografias entre 102 arquivos do projeto. Os cinco movimentos têm 9, 6, 2, 3 e 27 imagens. A luz pela fresta, DSC05656, abre o ensaio; a canoa lateral, DSC05942, encerra o Recife Vivo.

As fotografias semelhantes foram comparadas pelo enquadramento, pelo gesto e pela função na narrativa. A galeria preserva DSC05914 para a passagem sob a marquise, DSC05867 para a frente do rio, DSC05879 para a banca de frutas e DSC05923 para a convivência entre edifícios. DSC05915, DSC05872, DSC05880, DSC05883, DSC05926 e DSC05754 ficam em reserva.

Na loja de discos, DSC05896 mantém o plano amplo do trabalho e do acervo, com crédito corrigido para frança conforme a informação mais recente da autoria. DSC05906 acrescenta o retrato de encontro. DSC05898 e DSC05908 ficam em reserva.

No rio, DSC05934 reúne a ponte, a pessoa com a rede e os remadores. DSC05942 complementa a cena com o barco lateral e fecha o percurso. DSC05935, DSC05936, DSC05937, DSC05937-2, DSC05938 e DSC05944 ficam em reserva por repetição de função ou por desviar o olhar do encerramento escolhido. A seleção de reserva conserva os registros para outras montagens do projeto.

A identificação dos locais distingue evidências visuais, referências pesquisadas e hipóteses ainda a confirmar. A pessoa sentada na calçada acompanha uma pergunta sobre acolhimento e acesso à cidade, sem lhe atribuir uma condição de moradia.

## Revisão de autoria, leitura e cor

O crédito Samir foi atualizado para Samico por orientação do projeto. Samico é a assinatura fotográfica informada, sem associação presumida ao gravador Gilvan Samico. Os 20 créditos de frança e o crédito histórico de Mário de Carvalho permanecem.

Seu João foi identificado pela autoria nas fotografias DSC05896 e DSC05906. As duas imagens recebem apresentação ampliada em toda a largura da galeria. A identificação não se estende a outras pessoas fotografadas.

As cinco sextilhas foram revistas para dialogar com a memória cotidiana de Manuel Bandeira, o Capibaribe e o trabalho em João Cabral de Melo Neto e o encontro de linguagens de Antônio Nóbrega. São versos originais do projeto, sem reprodução ou atribuição de poemas desses artistas. As fontes institucionais estão na seção Referências.

Os textos de apresentação, os cinco movimentos e as 47 legendas foram desenvolvidos. As legendas de localização exibem o recorte geográfico sustentado; os dados de confiança permanecem no arquivo para pesquisa, sem rótulos de identificação pendente na experiência de leitura.

## Acesso ao conteúdo visual e sonoro

Cada fotografia tem uma descrição visual em texto, separada da interpretação poética. Na ampliação, a leitura automática opcional reúne descrição, interpretação e crédito, com pausa e parada dentro da janela; interrompe ao trocar ou fechar e pausa a música. O poema continua integralmente em texto, e é possível retirar a trilha da leitura por voz. A voz depende do suporte do navegador e não substitui um leitor de tela.

leitura.html oferece uma página estática, linear e sem imagens, com os 47 registros descritos, poema, memória do cinema e seção de gentrificação. Funciona sem JavaScript. assets/percurso-em-texto.txt oferece o mesmo percurso em texto simples para download. O site explica a função da trilha instrumental, sem informação exclusiva no áudio.

A galeria anuncia número e título ao trocar de foto, direciona o foco ao título ao abrir e devolve o foco ao botão de origem ao fechar. O botão de cor usa estado pressionado, explicação e mensagem textual. Estes recursos passaram por verificações de estrutura e comportamento programático; não constituem uma certificação nem substituem teste com pessoas usuárias de leitores de tela.

O curta ainda está em produção. Os campos de legendas, transcrição, audiodescrição e signLanguageSrc só exibem recursos quando existem arquivos reais correspondentes. A versão em Libras deve ser uma interpretação gravada da montagem final.
