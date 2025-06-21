// Histórico de itens (sem mudanças no estilo de fetch)
fetch('http://localhost:3000/usuarios')
  .then(res => res.json())
  .then(usuarios => {
    const usuarioLogadoString = sessionStorage.getItem("usuarioLogado");
    if (!usuarioLogadoString) {
      document.getElementById('insereHistorico').innerHTML =
        `<p style="font-size: 20px;">Você não está logado.</p>`;
      return;
    }

    const usuarioLogado   = JSON.parse(usuarioLogadoString);
    const usuarioCompleto = usuarios.find(u => String(u.id) === String(usuarioLogado.id));
    const historico       = usuarioCompleto?.historico_de_pedidos || usuarioCompleto?.historico;

    if (!Array.isArray(historico) || historico.length === 0) {
      document.getElementById('insereHistorico').innerHTML =
        `<p style="font-size: 20px;">Seu histórico de pedidos está vazio.</p>`;
      return;
    }

    // Agora busca as lanchonetes
    fetch('http://localhost:3000/lanchonetes')
      .then(res2 => res2.json())
      .then(lanchonetes => {
        // Ordena do mais recente para o mais antigo
        const pedidos = historico.sort((a, b) =>
          new Date(`${b.data}T${b.hora}`) - new Date(`${a.data}T${a.hora}`)
        );

        let pedidosHTML = '';
        pedidos.forEach(pedido => {
          // Encontra a lanchonete por ID
          const lanche = lanchonetes.find(l => String(l.id) === String(pedido.lanchonete_id));
          const nomeLanchonete = lanche ? lanche.nome : 'Desconhecida';

          // Formata data
          const partes = pedido.data.split('-');
          const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0].slice(2)}`;

          // Gera HTML dos itens
          const itensHTML = pedido.itens.map(item => `
            <li class="list-group-item px-0 py-1 d-flex justify-content-between">
              <img src="${item.imagem}" style="width: 5rem; height: 5rem;" alt="">
              <span> ${item.quantidade}x ${item.nome}</span>
              <span>R$ ${item.subtotal.toFixed(2).replace('.', ',')}</span>
            </li>
          `).join('');

          pedidosHTML += `
            <div class="card mb-3" style="border: 4px solid rgba(44, 62, 80, 0.25); border-radius: 10px; padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
              <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                <div>
                  <h5 class="card-title fw-bold">Pedido #${pedido.pedido_id}</h5>
                  <p class="card-text mb-1"><strong>Lanchonete:</strong> ${nomeLanchonete}</p>
                  <p class="card-text mb-1"><strong>Data:</strong> ${dataFormatada} às ${pedido.hora}</p>
                  <p class="card-text mb-1"><strong>Total:</strong> R$ ${pedido.total.toFixed(2).replace('.', ',')}</p>
                  <p class="card-text mb-1"><strong>Status:</strong> ${pedido.status}</p>
                  <p class="card-text"><strong>Pagamento:</strong> ${pedido.forma_pagamento}</p>
                </div>
                <div class="ms-md-4 w-100" style="max-width: 350px;">
                  <h6 class="mb-2">Itens do Pedido:</h6>
                  <ul class="list-group list-group-flush">
                    ${itensHTML}
                  </ul>
                </div>
              </div>
            </div>
          `;
        });

        document.getElementById("insereHistorico").innerHTML = pedidosHTML;
      })
      .catch(err2 => {
        console.error("Erro ao buscar lanchonetes:", err2);
        document.getElementById('insereHistorico').innerHTML =
          `<p class="text-danger">Não foi possível carregar as lanchonetes. Tente novamente mais tarde.</p>`;
      });
  })
  .catch(error => {
    console.error("Erro ao buscar usuários:", error);
    document.getElementById('insereHistorico').innerHTML =
      `<p class="text-danger">Não foi possível carregar o histórico. Tente novamente mais tarde.</p>`;
  });
