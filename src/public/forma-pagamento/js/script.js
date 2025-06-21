document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DO DOM ---
    const initialChoiceEl = document.getElementById('initial-choice');
    const pixSectionEl = document.getElementById('pix-section');
    const cardSectionEl = document.getElementById('card-section');
    const finalizeSectionEl = document.getElementById('finalize-section');
    
    const btnShowPix = document.getElementById('btn-show-pix');
    const btnShowCard = document.getElementById('btn-show-card');
    const btnFinalizeOrder = document.getElementById('btn-finalize-order');
    const cardForm = document.getElementById('card-form');

    const orderSummaryEl = document.getElementById('order-summary');
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));

    // --- CONFIGURAÇÃO E ESTADO ---
    const jsonServerUrl = 'http://localhost:3000';
    let pedidoPendente = null;
    let metodoPagamentoSelecionado = null;

    // --- FUNÇÕES ---
    const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const carregarPedido = () => {
        const pedidoStr = localStorage.getItem('pedidoPendente');
        if (!pedidoStr) {
            alert("Nenhum pedido encontrado. Você será redirecionado.");
            window.location.href = '../principal/index.html';
            return;
        }
        pedidoPendente = JSON.parse(pedidoStr);
    };

    const renderizarResumo = () => {
        const total = pedidoPendente.itens.reduce((acc, item) => {
            const preco = parseFloat(item.valor.replace('R$', '').replace(',', '.'));
            return acc + (preco * item.quantidade);
        }, 0);

        orderSummaryEl.innerHTML = `
            <h5 class="mb-3">Resumo do seu Pedido</h5>
            <ul class="list-group list-group-flush">
                ${pedidoPendente.itens.map(item => `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${item.nome}
                        <span class="badge bg-primary rounded-pill">${item.quantidade}x</span>
                    </li>
                `).join('')}
            </ul>
            <div class="d-flex justify-content-between align-items-center mt-3 fw-bold h5">
                <span>Total a Pagar:</span>
                <span>${formatarMoeda(total)}</span>
            </div>
        `;
    };

    const salvarCartao = async (event) => {
        event.preventDefault(); // Impede o recarregamento da página
        const newCard = {
            numero: document.getElementById('card-number').value,
            validade: document.getElementById('card-expiry').value,
            cvc: document.getElementById('card-cvc').value,
            nome: document.getElementById('card-name').value,
        };

        try {
            const response = await fetch(`${jsonServerUrl}/cartoes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCard),
            });
            if (!response.ok) throw new Error('Falha ao salvar o cartão.');
            
            alert('Cartão salvo com sucesso!');
            cardForm.reset();

        } catch (error) {
            console.error('Erro ao salvar cartão:', error);
            alert('Não foi possível salvar o cartão. Tente novamente.');
        }
    };

    const finalizarPedido = async () => {
        if (!metodoPagamentoSelecionado) {
            alert('Por favor, selecione um método de pagamento.');
            return;
        }

        const pedidoFinal = {
            ...pedidoPendente,
            metodoPagamento: metodoPagamentoSelecionado,
            status: 'concluido'
        };

        try {
            const response = await fetch(`${jsonServerUrl}/pedidos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedidoFinal),
            });
            if (!response.ok) throw new Error('Falha ao salvar o pedido.');

            localStorage.removeItem('carrinho');
            localStorage.removeItem('pedidoPendente');
            window.dispatchEvent(new Event('storageChanged'));

            confirmationModal.show();
            setTimeout(() => { window.location.href = '../principal/index.html'; }, 3000);

        } catch (error) {
            console.error('Erro ao finalizar o pedido:', error);
            alert('Não foi possível concluir seu pedido. Tente novamente.');
        }
    };

    // --- EVENT LISTENERS ---
    btnShowPix.addEventListener('click', () => {
        metodoPagamentoSelecionado = 'Pix';
        initialChoiceEl.style.display = 'none';
        cardSectionEl.style.display = 'none';
        pixSectionEl.style.display = 'block';
        finalizeSectionEl.style.display = 'block';
    });

    btnShowCard.addEventListener('click', () => {
        metodoPagamentoSelecionado = 'Cartão';
        initialChoiceEl.style.display = 'none';
        pixSectionEl.style.display = 'none';
        cardSectionEl.style.display = 'block';
        finalizeSectionEl.style.display = 'block';
    });

    cardForm.addEventListener('submit', salvarCartao);
    btnFinalizeOrder.addEventListener('click', finalizarPedido);

    // --- INICIALIZAÇÃO ---
    carregarPedido();
    if(pedidoPendente) {
        renderizarResumo();
    }
}); 