document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DO DOM ---
    const pixSectionEl = document.getElementById('pix-section');
    const cardSectionEl = document.getElementById('card-section');

    const btnFinalizeOrder = document.getElementById('btn-finalize-order');

    const radioPix = document.getElementById('payment-pix');
    const radioCard = document.getElementById('payment-card');

    const orderSummaryEl = document.getElementById('order-summary');

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

    const finalizarPedido = () => {
        if (!metodoPagamentoSelecionado) {
            alert('Por favor, selecione um método de pagamento.');
            return;
        }

        const usuarioStr = sessionStorage.getItem('usuarioLogado');
        if (!usuarioStr) {
            alert('Usuário não está logado.');
            return;
        }
        const usuarioLogado = JSON.parse(usuarioStr);

        // 1) Busca o usuário para pegar o histórico atual
        fetch(`${jsonServerUrl}/usuarios/${usuarioLogado.id}`)
            .then(res => {
                if (!res.ok) throw new Error('Falha ao buscar usuário');
                return res.json();
            })
            .then(usuario => {
                const historicoAtual = Array.isArray(usuario.historico_de_pedidos)
                    ? usuario.historico_de_pedidos
                    : [];

                // 2) Busca as lanchonetes pra descobrir o nome da que o cliente comprou
                return fetch(`${jsonServerUrl}/lanchonetes`)
                    .then(res2 => {
                        if (!res2.ok) throw new Error('Falha ao buscar lanchonetes');
                        return res2.json();
                    })
                    .then(lanchonetes => {
                        // encontra pelo ID
                        const lanche = lanchonetes.find(l => String(l.id) === String(pedidoPendente.lanchonete_id));
                        const nomeLanchonete = lanche ? lanche.nome : 'Desconhecida';

                        // monta data e hora
                        const agora = new Date();
                        const data = agora.toISOString().split('T')[0];
                        const hora = agora.toTimeString().slice(0, 5);

                        // total
                        const total = pedidoPendente.itens.reduce((acc, i) => {
                            const preco = parseFloat(i.valor.replace('R$', '').replace(',', '.'));
                            return acc + (preco * i.quantidade);
                        }, 0);

                        // corrige caminho das imagens e monta itens
                        const itensParaHistorico = pedidoPendente.itens.map(i => {
                            const src = i.imagem.startsWith('img/')
                                ? `../principal/${i.imagem}`
                                : i.imagem;
                            return {
                                nome: i.nome,
                                quantidade: i.quantidade,
                                imagem: src,
                                subtotal: parseFloat(i.valor.replace('R$', '').replace(',', '.')) * i.quantidade
                            };
                        });

                        // 3) Monta o novo registro **incluindo** o nome da lanchonete
                        const novoRegistro = {
                            pedido_id: Date.now(),
                            lanchonete_id: pedidoPendente.lanchonete_id,
                            lanchonete_nome: nomeLanchonete,     // <<< aqui!
                            data,
                            hora,
                            total,
                            itens: itensParaHistorico,
                            status: 'Concluído',
                            forma_pagamento: metodoPagamentoSelecionado
                        };

                        // 4) Retorna o PATCH para anexar ao histórico
                        return fetch(`${jsonServerUrl}/usuarios/${usuario.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                historico_de_pedidos: [...historicoAtual, novoRegistro]
                            })
                        });
                    });
            })
            .then(resPatch => {
                if (!resPatch.ok) throw new Error('Falha ao atualizar histórico');
                // 5) Limpa e redireciona
                localStorage.removeItem('carrinho');
                localStorage.removeItem('pedidoPendente');
                window.dispatchEvent(new Event('storageChanged'));
                window.location.href = '../acompanhar-pedido/acompanhar-pedido.html';
            })
            .catch(err => {
                console.error('Erro ao finalizar pedido:', err);
                alert('Ocorreu um erro ao finalizar o pedido. Tente novamente mais tarde.');
            });
    };

    // --- EVENT LISTENERS ---
    radioPix.addEventListener('change', () => {
        metodoPagamentoSelecionado = 'Pix';
        cardSectionEl.style.display = 'none';
        pixSectionEl.style.display = 'block';
        btnFinalizeOrder.disabled = false;
    });

    radioCard.addEventListener('change', () => {
        metodoPagamentoSelecionado = 'Cartão';
        pixSectionEl.style.display = 'none';
        cardSectionEl.style.display = 'block';
        btnFinalizeOrder.disabled = false;
    });

    btnFinalizeOrder.addEventListener('click', finalizarPedido);

    // --- INICIALIZAÇÃO ---
    carregarPedido();
    if (pedidoPendente) {
        renderizarResumo();
    }
}); 