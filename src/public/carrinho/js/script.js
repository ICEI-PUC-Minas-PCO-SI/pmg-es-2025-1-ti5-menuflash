document.addEventListener('DOMContentLoaded', () => {

    const itensContainer = document.getElementById('itens-carrinho-container');
    const carrinhoVazioEl = document.getElementById('carrinho-vazio');
    const subtotalEl = document.getElementById('subtotal-carrinho');
    const totalEl = document.getElementById('total-carrinho');
    const observacaoEl = document.getElementById('observacao');
    const btnFinalizar = document.getElementById('btn-finalizar-pedido');
    const btnLimpar = document.getElementById('btn-limpar-carrinho');

    const getCarrinho = () => JSON.parse(localStorage.getItem('carrinho')) || [];
    const setCarrinho = (carrinho) => {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        // Dispara um evento customizado para notificar outras partes da aplicação (como o header)
        window.dispatchEvent(new Event('storageChanged'));
    };
    
    const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const renderizarItens = () => {
        const carrinho = getCarrinho();
        itensContainer.innerHTML = '';

        if (carrinho.length === 0) {
            carrinhoVazioEl.style.display = 'block';
            return;
        }
        
        carrinhoVazioEl.style.display = 'none';

        carrinho.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'item-carrinho d-flex justify-content-between align-items-center p-3 border-bottom';
            const itemPreco = typeof item.valor === 'string' 
                ? parseFloat(item.valor.replace('R$', '').replace(',', '.'))
                : item.valor;
            const caminhoImagem = item.imagem.startsWith('http') ? item.imagem : `../principal/${item.imagem}`;

            itemEl.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${caminhoImagem}" alt="${item.nome}" class="item-imagem">
                    <div class="ms-3">
                        <h5 class="mb-1">${item.nome}</h5>
                        <p class="text-muted small m-0">${item.nomeLanchonete}</p>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <input type="number" class="form-control quantidade-input" value="${item.quantidade}" min="1" data-id="${item.id}">
                    <span class="fw-bold mx-3" style="min-width: 70px; text-align: right;">${formatarMoeda(itemPreco * item.quantidade)}</span>
                    <button class="btn btn-remover border-0 bg-transparent" data-id="${item.id}" title="Remover item">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </div>
            `;
            itensContainer.appendChild(itemEl);
        });
    };

    const renderizarResumo = () => {
        const carrinho = getCarrinho();
        const subtotal = carrinho.reduce((acc, item) => {
            const preco = typeof item.valor === 'string'
                ? parseFloat(item.valor.replace('R$', '').replace(',', '.'))
                : item.valor;
            return acc + (preco * item.quantidade);
        }, 0);

        subtotalEl.textContent = formatarMoeda(subtotal);
        totalEl.textContent = formatarMoeda(subtotal);
    };

    const atualizarItem = (itemId, novaQuantidade) => {
        let carrinho = getCarrinho();
        const item = carrinho.find(i => i.id === itemId);
        if (item) {
            item.quantidade = novaQuantidade;
            setCarrinho(carrinho);
            renderizarItens();
            renderizarResumo();
        }
    };

    const removerItem = (itemId) => {
        let carrinho = getCarrinho().filter(i => i.id !== itemId);
        setCarrinho(carrinho);
        renderizarItens();
        renderizarResumo();
    };

    const limparCarrinho = () => {
        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            setCarrinho([]);
            renderizarItens();
            renderizarResumo();
        }
    };

    // --- Event Listeners ---

    itensContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantidade-input')) {
            const itemId = parseInt(e.target.dataset.id, 10);
            const novaQuantidade = parseInt(e.target.value, 10);
            if (novaQuantidade > 0) {
                atualizarItem(itemId, novaQuantidade);
            } else {
                removerItem(itemId);
            }
        }
    });

    itensContainer.addEventListener('click', (e) => {
        const target = e.target.closest('.btn-remover');
        if (target) {
            const itemId = parseInt(target.dataset.id, 10);
            removerItem(itemId);
        }
    });

    btnLimpar.addEventListener('click', limparCarrinho);

    btnFinalizar.addEventListener('click', () => {
        const carrinho = getCarrinho();
        if (carrinho.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        // 1. Cria um objeto de pedido pendente
        const pedidoPendente = {
            id: `pedido_${new Date().getTime()}`, // ID único para o pedido
            itens: carrinho,
            observacao: observacaoEl.value,
            data: new Date().toISOString(),
            status: 'pendente'
        };

        // 2. Salva o pedido pendente no localStorage para a pág. de pagamento pegar
        localStorage.setItem('pedidoPendente', JSON.stringify(pedidoPendente));

        // 3. Redireciona para a página de pagamento
        window.location.href = '../forma-pagamento/index.html';
    });

    // Ouve por mudanças no localStorage para manter a aba atualizada
    window.addEventListener('storage', () => {
        renderizarItens();
        renderizarResumo();
    });

    // Função de inicialização
    const init = () => {
        renderizarItens();
        renderizarResumo();
        observacaoEl.value = localStorage.getItem('observacao') || '';
        observacaoEl.addEventListener('keyup', () => {
            localStorage.setItem('observacao', observacaoEl.value);
        });
    };

    init();
}); 