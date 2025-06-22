document.addEventListener("DOMContentLoaded", () => {
    console.log("criaCards.js carregado"); // Confirma carregamento do script
    console.log("Parâmetros da URL:", window.location.search);

    // --- SETUP INICIAL ---
    const params = new URLSearchParams(window.location.search);
    const idLanchonete = params.get("id");
    const campusSelecionado = params.get('campus');

    // Salva a lanchonete e o campus na sessão para referência futura
    if (idLanchonete) {
        fetch("http://localhost:3000/lanchonetes")
            .then(res => res.json())
            .then(lanchonetes => {
                const lanchonete = lanchonetes.find(l => l.id == idLanchonete);
                if (lanchonete) {
                    sessionStorage.setItem("campusAnterior", lanchonete.campus);
                    sessionStorage.setItem("lanchoneteAnterior", lanchonete.id);
                }
            });
    }

    // --- ELEMENTOS DO DOM ---
    const cardsContainer = document.getElementById('divCards');
    const campoBusca = document.getElementById('campoBusca');
    const btnBusca = document.getElementById('btnBusca');

    // --- ESTADO ---
    let todosOsItens = [];
    const userId = "1"; // ID do usuário fixo para fins de demonstração

    // --- LÓGICA DO CARRINHO ---
    const getCarrinhoUsuario = async () => {
        try {
            const response = await fetch(`http://localhost:3000/carrinhos?userId=${userId}`);
            const carrinhos = await response.json();
            return carrinhos[0]; // Retorna o primeiro carrinho encontrado para o usuário
        } catch (error) {
            console.error("Erro ao buscar carrinho:", error);
            return null;
        }
    };

    const criarCarrinhoUsuario = async (carrinho) => {
        try {
            await fetch(`http://localhost:3000/carrinhos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carrinho)
            });
        } catch (error) {
            console.error("Erro ao criar carrinho:", error);
        }
    };

    const atualizarCarrinhoUsuario = async (carrinho) => {
        try {
            await fetch(`http://localhost:3000/carrinhos/${carrinho.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carrinho)
            });
        } catch (error) {
            console.error("Erro ao atualizar carrinho:", error);
        }
    };

    const adicionarAoCarrinho = async (item) => {
        let carrinho = await getCarrinhoUsuario();
        const itemParaCarrinho = {
            id: item.id,
            nome: item.titulo,
            imagem: item.imagem,
            valor: String(item.valor),
            nomeLanchonete: item.nomeLanchonete,
            quantidade: 1
        };

        if (carrinho) {
            const itemExistente = carrinho.itens.find(i => i.id === item.id);
            if (itemExistente) {
                itemExistente.quantidade++;
            } else {
                carrinho.itens.push(itemParaCarrinho);
            }
            await atualizarCarrinhoUsuario(carrinho);
        } else {
            carrinho = { userId, itens: [itemParaCarrinho] };
            await criarCarrinhoUsuario(carrinho);
        }
        mostrarFeedbackAdicionado(item.titulo);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const removerUnidadeDoCarrinho = async (item) => {
        let carrinho = await getCarrinhoUsuario();
        if (!carrinho) return;

        const itemIndex = carrinho.itens.findIndex(i => i.id === item.id);
    
        if (itemIndex > -1) {
            const itemExistente = carrinho.itens[itemIndex];
            itemExistente.quantidade--;
    
            if (itemExistente.quantidade <= 0) {
                carrinho.itens.splice(itemIndex, 1);
            }
    
            await atualizarCarrinhoUsuario(carrinho);
            window.dispatchEvent(new Event('cartUpdated'));
        }
    };

    const mostrarFeedbackAdicionado = (nomeItem) => {
        document.querySelectorAll('.feedback-toast').forEach(t => t.remove());

        const toast = document.createElement('div');
        toast.className = 'feedback-toast';
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; background-color: #198754; color: white;
            padding: 1rem 1.5rem; border-radius: 0.5rem; z-index: 1050;
            box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,0.1);
            animation: slideIn 0.3s ease-out;
        `;
        toast.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> <strong>${nomeItem}</strong> foi adicionado ao carrinho!`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    };

    // --- RENDERIZAÇÃO DOS CARDS ---
    function renderizarCards(itens) {
        console.log("Renderizando cards:", itens); // Ajuda na depuração

        const headerLanchonete = cardsContainer.querySelector('.text-center');
        let containerParaRenderizar;

        if (headerLanchonete) {
            const itensAnteriores = cardsContainer.querySelector('.row');
            if (itensAnteriores) itensAnteriores.remove();

            containerParaRenderizar = document.createElement('div');
            containerParaRenderizar.className = "row justify-content-center w-100";
            cardsContainer.appendChild(containerParaRenderizar);
        } else {
            cardsContainer.innerHTML = '';
            containerParaRenderizar = document.createElement('div');
            containerParaRenderizar.className = "row justify-content-center w-100";
            cardsContainer.appendChild(containerParaRenderizar);
        }


        if (itens.length === 0 && campoBusca.value) {
            containerParaRenderizar.innerHTML = `<p class="text-white">Nenhum item encontrado para "${campoBusca.value}".</p>`;
            return;
        }

        getCarrinhoUsuario().then(carrinho => {
            const itensCarrinho = carrinho ? carrinho.itens : [];

            itens.forEach(item => {
                const estiloIndisponivel = !item.disponivel ? 'style="filter: opacity(50%);"' : '';
                const botaoDesabilitado = !item.disponivel ? 'disabled' : '';

                const itemNoCarrinho = itensCarrinho.find(i => i.id === item.id);
                const quantidadeNoCarrinho = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;

                const cardWrapper = document.createElement('div');
                cardWrapper.className = "m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex";
                cardWrapper.innerHTML = `
                    <div class="card shadow rounded-4 border-0 overflow-hidden mx-auto" ${estiloIndisponivel} style="width: 320px; transition: transform 0.3s;">
                    <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${item.id}">
                        <img src="${item.imagem}" class="card-img-top" alt="${item.titulo}" style="height: 160px; object-fit: cover;">
                    </a>

                    <div class="card-body text-center d-flex flex-column px-3 py-3">
                        <h5 class="card-title fw-semibold text-truncate mb-2" title="${item.titulo}">${item.titulo}</h5>

                        <div class="avaliacao-estrelas mb-2" data-tipo="item" data-id="${item.id}">
                            ${[...Array(5)].map((_, i) => `<i class="fa-regular fa-star estrela" data-index="${i+1}"></i>`).join('')}
                        </div>

                        <div class="mt-auto pt-2 d-flex justify-content-between align-items-center">
                            <p class="fw-bold h5 mb-0 mx-2">R$ ${typeof item.valor === 'number' ? item.valor.toFixed(2).replace('.', ',') : 'N/A'}</p>
                            
                            <div class="input-group ms-2" style="max-width: 130px;" ${estiloIndisponivel}>
                                <button ${botaoDesabilitado} class="btn btn-outline-danger btn-diminuir-qnt" type="button" data-item-id="${item.id}">−</button>
                                <input type="text" class="form-control text-center quantity-input" value="${quantidadeNoCarrinho}" readonly data-item-id="${item.id}" style="max-width: 50px; user-select: none; background-color: #fff;">
                                <button ${botaoDesabilitado} class="btn btn-outline-success btn-aumentar-qnt" type="button" data-item-id="${item.id}">+</button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                containerParaRenderizar.appendChild(cardWrapper);
            });

            const atualizarDisplayQuantidade = async (itemId) => {
                const input = containerParaRenderizar.querySelector(`.quantity-input[data-item-id='${itemId}']`);
                if (input) {
                    const carrinhoAtualizado = await getCarrinhoUsuario();
                    const itemNoCarrinho = carrinhoAtualizado ? carrinhoAtualizado.itens.find(i => i.id === itemId) : null;
                    input.value = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;
                }
            };

            containerParaRenderizar.querySelectorAll(".btn-aumentar-qnt").forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const itemId = parseInt(e.currentTarget.dataset.itemId, 10);
                    const item = todosOsItens.find(i => i.id === itemId);
                    if (item) {
                        adicionarAoCarrinho(item).then(() => {
                            atualizarDisplayQuantidade(itemId);
                        });
                    }
                });
            });

            containerParaRenderizar.querySelectorAll(".btn-diminuir-qnt").forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const itemId = parseInt(e.currentTarget.dataset.itemId, 10);
                    const item = todosOsItens.find(i => i.id === itemId);
                    if (item) {
                        removerUnidadeDoCarrinho(item).then(() => {
                            atualizarDisplayQuantidade(itemId);
                        });
                    }
                });
            });

            containerParaRenderizar.querySelectorAll(".avaliacao-estrelas[data-tipo='item']").forEach(container => {
                const itemId = container.dataset.id;
                inicializarEstrelasGenerico(container, `avaliacaoItem_${itemId}`);
            });
        });
    }

    // --- LÓGICA DE BUSCA ---
    function executarBusca() {
        const termo = campoBusca.value.trim();
        cardsContainer.innerHTML = '';

        if (termo === "") {
            renderizarCards(todosOsItens);
            return;
        }

        const fuse = new Fuse(todosOsItens, {
            keys: ['titulo'],
            threshold: 0.4,
            ignoreLocation: true
        });

        const resultado = fuse.search(termo);
        const filtrados = resultado.map(res => res.item);

        if (filtrados.length === 0) {
            cardsContainer.innerHTML = `<p class="text-white">Nenhum item encontrado para "${termo}".</p>`;
        } else {
            renderizarCards(filtrados);
        }
    }

    // --- FETCH DE DADOS E INICIALIZAÇÃO ---
    fetch('http://localhost:3000/lanchonetes')
        .then(response => response.json())
        .then(data => {
            console.log("Lanchonetes carregadas:", data); // Para verificar retorno da API

            if (!Array.isArray(data)) throw new Error("Formato de dados inválido.");

            cardsContainer.innerHTML = '';
            let itensParaRenderizar = [];

            if (idLanchonete == 0 && campusSelecionado) {
                const lanchonetesDoCampus = data.filter(l => l.campus === campusSelecionado);
                lanchonetesDoCampus.forEach(lanchonete => {
                    lanchonete.itens.forEach(item => {
                        itensParaRenderizar.push({ ...item, nomeLanchonete: lanchonete.nome });
                    });
                });
            } else {
                const lanchonete = data.find(l => l.id == idLanchonete);
                if (!lanchonete) return;

                const lanchoneteHeader = document.createElement("div");
                lanchoneteHeader.className = " mt-4 w-100 text-center";
                lanchoneteHeader.innerHTML = `
                    <h3>${lanchonete.nome}</h3>
                    <div class="avaliacao-estrelas mb-2" data-id="${lanchonete.id}" data-tipo="lanchonete">
                        ${[1, 2, 3, 4, 5].map(i => `<i class="fa-regular fa-star estrela" data-index="${i}"></i>`).join('')}
                    </div>
                `;
                cardsContainer.appendChild(lanchoneteHeader);
                inicializarEstrelasGenerico(lanchoneteHeader.querySelector('.avaliacao-estrelas'), `avaliacaoLanchonete_${lanchonete.id}`);

                lanchonete.itens.forEach(item => {
                    itensParaRenderizar.push({ ...item, nomeLanchonete: lanchonete.nome });
                });
            }

            todosOsItens = [...itensParaRenderizar];
            renderizarCards(todosOsItens);
        })
        .catch(error => {
            console.error('Erro ao buscar ou processar os dados:', error);
            cardsContainer.innerHTML = `<p class="text-white">Erro ao carregar dados.</p>`;
        });

    // --- EVENT LISTENERS GERAIS ---
    if (btnBusca) btnBusca.addEventListener('click', executarBusca);
    if (campoBusca) campoBusca.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') executarBusca();
    });

    function inicializarEstrelasGenerico(container, chaveLocal) {
        const estrelas = container.querySelectorAll(".estrela");
        const notaSalva = localStorage.getItem(chaveLocal);
        if (notaSalva) destacarEstrelas(estrelas, parseInt(notaSalva));

        estrelas.forEach((estrela, index) => {
            estrela.addEventListener("mouseenter", () => destacarEstrelas(estrelas, index + 1));
            estrela.addEventListener("mouseleave", () => destacarEstrelas(estrelas, parseInt(localStorage.getItem(chaveLocal)) || 0));
            estrela.addEventListener("click", () => {
                localStorage.setItem(chaveLocal, index + 1);
                destacarEstrelas(estrelas, index + 1);
            });
        });
    }

    const destacarEstrelas = (estrelas, nota) => {
        estrelas.forEach((estrela, i) => {
            estrela.classList.toggle("fa-solid", i < nota);
            estrela.classList.toggle("fa-regular", i >= nota);
        });
    };
});

// Adiciona CSS para animação do toast de feedback
const style = document.createElement('style');
style.textContent = `@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
document.head.appendChild(style);