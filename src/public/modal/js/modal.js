document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (event) {
        if (event.target.closest("a[data-id]")) {
            const id = event.target.closest("a[data-id]").getAttribute("data-id");
            mostraDetalhes(id);
        }
    });
});

function mostraDetalhes(id) {
  fetch('http://localhost:3000/lanchonetes')
    .then(r => r.json())
    .then(lanchonetes => {
      let item, lan;
      for (const l of lanchonetes) {
        item = l.itens.find(i => i.id == id);
        if (item) { lan = l; break; }
      }
      if (!item) return;

      // 2. Calcula quantidade já no carrinho
      const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
      const inCart = carrinho.find(i => i.id === item.id);
      const qtd = inCart ? inCart.quantidade : 0;

      // 3. Monta badges
      const badges = [];
      if (item.semLactose) badges.push(`<span class="badge bg-success">Sem Lactose</span>`);
      if (item.semGluten)  badges.push(`<span class="badge bg-success">Sem Glúten</span>`);

      // 4. Monta o modal de forma única
      const modalContent = `
        <div class="modal-header">
          <h5 class="modal-title">Lanchonete ${lan.nome} — ${item.titulo}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body text-center">
          <img src="${item.imagem}" class="img-fluid mb-3" style="max-height:200px;object-fit:contain;">
          <p>${item.descricao}</p>
          <p>${item.conteudo}</p>
          ${badges.join(' ')}
        </div>
        <div class="modal-footer d-flex justify-content-between align-items-center">
          <h5><strong>R$ ${typeof item.valor === 'number' ? item.valor.toFixed(2).replace('.', ',') : 'N/A'}</strong><h5>
          <div class="d-flex align-items-center">
          </div>
        </div>
      `;
      const container = document.getElementById("modalContent");
      container.innerHTML = modalContent;


      function atualizaQtd() {
        const c = JSON.parse(localStorage.getItem('carrinho')) || [];
        const found = c.find(i => i.id == item.id);
        labelQ.textContent = found ? found.quantidade : 0;
      }

      btnMais.addEventListener('click', () => {
        adicionarAoCarrinho(item);
        atualizaQtd();
      });
      btnMenos.addEventListener('click', () => {
        removerUnidadeDoCarrinho(item);
        atualizaQtd();
      });
    })
    .catch(console.error);
}
