document.addEventListener("DOMContentLoaded", () => {
    // Recupera favoritos salvos do LocalStorage ou inicializa
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || {};

    // Seleciona todos os botões de favoritos já existentes na página
    const coracoes = document.querySelectorAll(".heart");

    coracoes.forEach(coracao => {
        const id = coracao.dataset.id;

        // Verifica se o favorito está marcado nos dados e aplica ao elemento
        const itemDados = dados.find(item => item.id == id);
        if (itemDados) {
            favoritos[id] = favoritos[id] ?? itemDados.favorito;
        }

        // Atualiza a interface com os favoritos salvos
        coracao.innerHTML = favoritos[id] ? "❤️" : "🤍";
        coracao.classList.toggle("favorito", favoritos[id]);
        coracao.classList.toggle("nao-favorito", !favoritos[id]);

        // Adiciona evento de clique para alternar favorito
        coracao.addEventListener("click", () => {
            favoritos[id] = !favoritos[id]; // Alterna estado
            localStorage.setItem("favoritos", JSON.stringify(favoritos)); // Salva no LocalStorage

            // Atualiza o ícone visual
            coracao.innerHTML = favoritos[id] ? "❤️" : "🤍";
            coracao.classList.toggle("favorito", favoritos[id]);
            coracao.classList.toggle("nao-favorito", !favoritos[id]);
        });
    });
});

// Adiciona evento de clique para o botão "Ver Favoritos"
document.getElementById("ver-favoritos").addEventListener("click", () => {
    // Filtra os itens favoritos
    const itensFavoritos = dados.filter(item => favoritos[item.id]);

    // Atualiza a interface com os itens favoritos
    const listaFavoritos = document.getElementById("lista-favoritos");
    listaFavoritos.innerHTML = ""; // Limpa a lista atual

    if (itensFavoritos.length > 0) {
        itensFavoritos.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.titulo} - ${item.valor}`;
            listaFavoritos.appendChild(li);
        });
    } else {
        listaFavoritos.innerHTML = "<li>Nenhum favorito encontrado.</li>";
    }
});
