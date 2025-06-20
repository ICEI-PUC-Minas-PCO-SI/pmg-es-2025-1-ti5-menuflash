// Estrutura inicial do carrinho
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function renderizarCarrinho() {
    const container = document.getElementById('carrinho-itens');
    if (!container) return;
    if (carrinho.length === 0) {
        container.innerHTML = '<p class="text-center">Seu carrinho está vazio.</p>';
        return;
    }
    container.innerHTML = carrinho.map((item, idx) => `
        <div class="d-flex align-items-center justify-content-between bg-light rounded mb-2 p-2">
            <div class="d-flex align-items-center">
                <img src="../assets/images/itens/${item.imagem}" alt="${item.nome}" style="width: 40px;">
                <span class="ms-2">${item.nome}</span>
            </div>
            <div class="d-flex align-items-center gap-2">
                <button class="btn btn-light border" onclick="alterarQuantidade(${idx}, -1)">-</button>
                <span>${item.quantidade}</span>
                <button class="btn btn-light border" onclick="alterarQuantidade(${idx}, 1)">+</button>
                <button class="btn btn-danger btn-sm ms-2" onclick="removerItem(${idx})">🗑️</button>
            </div>
        </div>
    `).join('');
}

function alterarQuantidade(idx, delta) {
    if (carrinho[idx]) {
        carrinho[idx].quantidade += delta;
        if (carrinho[idx].quantidade < 1) carrinho[idx].quantidade = 1;
        salvarCarrinho();
        renderizarCarrinho();
    }
}

function removerItem(idx) {
    carrinho.splice(idx, 1);
    salvarCarrinho();
    renderizarCarrinho();
}

function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

document.getElementById('excluir-carrinho').onclick = function() {
    carrinho = [];
    salvarCarrinho();
    renderizarCarrinho();
};

document.getElementById('adicionar-observacao').onclick = function() {
    const obs = prompt('Digite sua observação para o pedido:');
    if (obs) localStorage.setItem('observacao', obs);
};

document.getElementById('finalizar-pedido').onclick = async function() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    // Salvar pedido no JSON Server
    try {
        const response = await fetch('http://localhost:3000/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                itens: carrinho,
                observacao: localStorage.getItem('observacao') || '',
                data: new Date().toISOString()
            })
        });
        if (!response.ok) throw new Error('Erro ao salvar pedido');
        // Limpa carrinho local
        carrinho = [];
        salvarCarrinho();
        renderizarCarrinho();
        // Redireciona para forma de pagamento
        window.location.href = '../forma de pagamento/index.html';
    } catch (e) {
        alert('Erro ao finalizar pedido. Tente novamente.');
    }
};

renderizarCarrinho();

// Função para adicionar item ao carrinho (chamada de outras páginas)
function adicionarAoCarrinho(nome, imagem) {
    const idx = carrinho.findIndex(i => i.nome === nome);
    if (idx > -1) {
        carrinho[idx].quantidade++;
    } else {
        carrinho.push({ nome, imagem, quantidade: 1 });
    }
    salvarCarrinho();
    renderizarCarrinho();
}

// Exporta para uso externo
window.adicionarAoCarrinho = adicionarAoCarrinho; 