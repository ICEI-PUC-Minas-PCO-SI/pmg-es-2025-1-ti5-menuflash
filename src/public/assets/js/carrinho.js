
function getCarrinho() {
    return fetch(API_URL).then(res => res.json());
}

function updateCarrinho(carrinho) {
    fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carrinho)
    }).then(renderCarrinho);
}

function renderCarrinho() {
    getCarrinho().then(carrinho => {
        const el = document.getElementById('carrinho-container');
        if (!el) return;
        if (!carrinho.itens.length) {
            el.innerHTML = '<div class="card p-3">Seu carrinho está vazio</div>';
            return;
        }
        el.innerHTML = `
            <div class="card p-3">
                <h4>Seu Carrinho</h4>
                <ul class="list-group mb-3">
                    ${carrinho.itens.map(item => `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span>${item.nome} <small>R$ ${item.preco.toFixed(2)}</small></span>
                            <div>
                                <button onclick="alterarQtd(${item.id}, -1)" class="btn btn-sm btn-outline-secondary">-</button>
                                <span class="mx-2">${item.quantidade}</span>
                                <button onclick="alterarQtd(${item.id}, 1)" class="btn btn-sm btn-outline-secondary">+</button>
                                <button onclick="remover(${item.id})" class="btn btn-sm btn-danger ms-2">x</button>
                            </div>
                        </li>
                    `).join('')}
                </ul>
                <div>
                    <b>Total: R$ ${carrinho.itens.reduce((t, i) => t + i.preco * i.quantidade, 0).toFixed(2)}</b>
                    <button onclick="limpar()" class="btn btn-danger btn-sm float-end">Limpar Carrinho</button>
                </div>
            </div>
        `;
    });
}

function alterarQtd(id, delta) {
    getCarrinho().then(carrinho => {
        const item = carrinho.itens.find(i => i.id === id);
        if (!item) return;
        item.quantidade += delta;
        if (item.quantidade < 1) carrinho.itens = carrinho.itens.filter(i => i.id !== id);
        updateCarrinho(carrinho);
    });
}

function remover(id) {
    getCarrinho().then(carrinho => {
        carrinho.itens = carrinho.itens.filter(i => i.id !== id);
        updateCarrinho(carrinho);
    });
}

function limpar() {
    updateCarrinho({ id: 2, itens: [] });
}

document.addEventListener('DOMContentLoaded', renderCarrinho);
window.alterarQtd = alterarQtd;
window.remover = remover;
window.limpar = limpar; 