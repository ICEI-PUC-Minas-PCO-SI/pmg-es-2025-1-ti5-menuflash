document.addEventListener('DOMContentLoaded', () => {

    const itensContainer = document.getElementById('itens-carrinho-container');
    const carrinhoVazioEl = document.getElementById('carrinho-vazio');
    const subtotalEl = document.getElementById('subtotal-carrinho');
    const totalEl = document.getElementById('total-carrinho');
    const observacaoEl = document.getElementById('observacao');
    const btnFinalizar = document.getElementById('btn-finalizar-pedido');
    const btnLimpar = document.getElementById('btn-limpar-carrinho');
    const userId = "1"; // ID do usuário fixo

    const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const getCarrinho = async () => {
        try {
            const response = await fetch(`http://localhost:3000/carrinhos?userId=${userId}`);
            const carrinhos = await response.json();
            return carrinhos[0];
        } catch (error) {
            console.error("Erro ao buscar carrinho:", error);
            return null;
        }
    };
    
    const atualizarCarrinhoServidor = async (carrinho) => {
        if (!carrinho) return;
        try {
            await fetch(`http://localhost:3000/carrinhos/${carrinho.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carrinho)
            });
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error("Erro ao atualizar carrinho:", error);
        }
    };

    const renderizarItens = (carrinho) => {
        itensContainer.innerHTML = '';

        if (!carrinho || carrinho.itens.length === 0) {
            carrinhoVazioEl.style.display = 'block';
            subtotalEl.textContent = formatarMoeda(0);
            totalEl.textContent = formatarMoeda(0);
            return;
        }
        
        carrinhoVazioEl.style.display = 'none';

        carrinho.itens.forEach(item => {
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

    const renderizarResumo = (carrinho) => {
        if (!carrinho || carrinho.itens.length === 0) return;

        const subtotal = carrinho.itens.reduce((acc, item) => {
            const preco = typeof item.valor === 'string'
                ? parseFloat(item.valor.replace('R$', '').replace(',', '.'))
                : item.valor;
            return acc + (preco * item.quantidade);
        }, 0);

        subtotalEl.textContent = formatarMoeda(subtotal);
        totalEl.textContent = formatarMoeda(subtotal);
    };

    const atualizarItem = async (itemId, novaQuantidade) => {
        const carrinho = await getCarrinho();
        if (!carrinho) return;
        const item = carrinho.itens.find(i => i.id === itemId);
        if (item) {
            item.quantidade = novaQuantidade;
            await atualizarCarrinhoServidor(carrinho);
            init(); // Recarrega a tela
        }
    };

    const removerItem = async (itemId) => {
        const carrinho = await getCarrinho();
        if (!carrinho) return;
        carrinho.itens = carrinho.itens.filter(i => i.id !== itemId);
        await atualizarCarrinhoServidor(carrinho);
        init(); // Recarrega a tela
    };

    const limparCarrinho = async () => {
        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            const carrinho = await getCarrinho();
            if(carrinho) {
                carrinho.itens = [];
                await atualizarCarrinhoServidor(carrinho);
            }
            init(); // Recarrega a tela
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

    btnFinalizar.addEventListener('click', async () => {
        const carrinho = await getCarrinho();
        if (!carrinho || carrinho.itens.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        const pedidoPendente = {
            id: `pedido_${new Date().getTime()}`,
            itens: carrinho.itens,
            observacao: observacaoEl.value,
            data: new Date().toISOString(),
            status: 'pendente'
        };

        localStorage.setItem('pedidoPendente', JSON.stringify(pedidoPendente));
        window.location.href = '../forma-pagamento/index.html';
    });

    window.addEventListener('cartUpdated', () => {
        init();
    });

    // Função de inicialização
    const init = async () => {
        const carrinho = await getCarrinho();
        renderizarItens(carrinho);
        renderizarResumo(carrinho);
        observacaoEl.value = localStorage.getItem('observacao') || '';
        observacaoEl.addEventListener('keyup', () => {
            localStorage.setItem('observacao', observacaoEl.value);
        });
    };

    init();
}); 