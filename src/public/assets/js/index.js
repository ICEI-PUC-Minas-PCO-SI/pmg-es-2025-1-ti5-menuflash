function criaCards() {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || {};

    let divCard = document.getElementById("divCards");

    for (let i = 0; i < dados.length; i++) {
        let dado = dados[i];

        favoritos[dado.id] = favoritos[dado.id] ?? dado.favorito;

        let card = `
            <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
                <div class="card h-100 w-100 shadow-sm ${dado.disponivel ? '' : 'opacity-40'}">
                    <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${dado.id}">
                        <img src="${dado.imagem}" class="card-img-top" alt="${dado.titulo}">
                    </a>
                    <div class="card-body text-center d-flex flex-column">
                        <h5 class="card-title">${dado.titulo}</h5>
                        <span class="fw-bold valor-produto">${dado.valor}</span>

                        <!-- Mantém o botão e coração fixos na parte inferior do card -->
                        <div class="favorito-container mt-auto d-flex justify-content-between align-items-center">
                            <button type="button" class="btn btn-outline-secondary btn-sm" ${dado.disponivel ? '' : 'disabled'}>Adicionar ao carrinho</button>
                            <span class="heart ${favoritos[dado.id] ? 'favorito' : 'nao-favorito'}" data-id="${dado.id}">
                                ${favoritos[dado.id] ? "❤️" : "🤍"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        divCard.innerHTML += card;
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));

    const coracoes = document.querySelectorAll(".heart");
    coracoes.forEach(coracao => {
        const id = coracao.dataset.id;

        coracao.addEventListener("click", () => {
            favoritos[id] = !favoritos[id];
            localStorage.setItem("favoritos", JSON.stringify(favoritos));

            coracao.innerHTML = favoritos[id] ? "❤️" : "🤍";
            coracao.classList.toggle("favorito", favoritos[id]);
            coracao.classList.toggle("nao-favorito", !favoritos[id]);
        });
    });
}

document.addEventListener("DOMContentLoaded", criaCards);
