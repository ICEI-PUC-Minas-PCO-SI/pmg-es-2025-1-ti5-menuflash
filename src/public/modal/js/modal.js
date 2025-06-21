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
        .then(res => res.json())
        .then(lanchonetes => {
            for (let i = 0; i < lanchonetes.length; i++) {
                let lanchonete = lanchonetes[i];
                for (let j = 0; j < lanchonete.itens.length; j++) {
                    let item = lanchonete.itens[j];
                    if (item.id == id) {
                        if (item.disponivel) {
                            if (item.semGluten && item.semLactose) {
                               let modalContent = `
                                <div class="modal-header">
                                    <div class="modal-title">Lanchonete - ${lanchonete.nome}
                                        <h5 class="modal-title fs-2">${item.titulo}</h5>
                                    </div>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <img src="${item.imagem}"class="img-fluid mb-2 w-75 h-25 d-block mx-auto" style="max-width: 20rem; max-height: 20rem; object-fit: contain;">
                                    <p>${item.descricao}</p>
                                        <div id="divQuantidade"> 
                                        </div>
                                        <p class="d-block p-3 mb-3">${item.conteudo}</p>
                                    <div class="mb-2">
                                        <span class="badge bg-success">Sem Lactose</span>
                                        <span class="badge bg-success">Sem Glúten</span>
                                    </div>
                                <div class="modal-footer d-flex justify-content-between">
                                <span class="fw-bold fs-5 text-dark">${item.valor}</span>
                                    <div class="d-flex align-items-center gap-2"> 
                                        <button type="button" class="btn btn-outline-secondary btn-sm">-</button>
                                        <label>0</label>
                                        <button type="button" class="btn btn-outline-secondary btn-sm">+</button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` 
                        document.getElementById("modalContent").innerHTML = modalContent
                        return;
                            } else if (item.semLactose) {
                                let modalContent = `
                                <div class="modal-header">
                                    <div class="modal-title">Lanchonete - ${lanchonete.nome}
                                        <h5 class="modal-title fs-2">${item.titulo}</h5>
                                    </div>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <img src="${item.imagem}"class="img-fluid mb-2 w-75 h-25 d-block mx-auto" style="max-width: 20rem; max-height: 20rem; object-fit: contain;">
                                    <p>${item.descricao}</p>
                                        <div id="divQuantidade"> 
                                        <div class="mb-2">
                                        <p class="d-block p-3 mb-3">${item.conteudo}</p>
                                            <span class="badge bg-success">Sem Lactose</span>
                                        </div>
                                <div class="modal-footer d-flex justify-content-between">
                                <span class="fw-bold fs-5 text-dark">${item.valor}</span>
                                    <div class="d-flex align-items-center gap-2"> 
                                        <button type="button" class="btn btn-outline-secondary btn-sm">-</button>
                                        <label>0</label>
                                        <button type="button" class="btn btn-outline-secondary btn-sm">+</button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` 
                        document.getElementById("modalContent").innerHTML = modalContent
                        return;
                            } else if (item.semGluten) {
                                let modalContent = `
                                <div class="modal-header">
                                    <div class="modal-title">Lanchonete - ${lanchonete.nome}
                                        <h5 class="modal-title fs-2">${item.titulo}</h5>
                                    </div>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <img src="${item.imagem}"class="img-fluid mb-2 w-75 h-25 d-block mx-auto" style="max-width: 20rem; max-height: 20rem; object-fit: contain;">
                                    <p>${item.descricao}</p>
                                        <div id="divQuantidade"> 
                                        </div>
                                        <p class="d-block p-3 mb-3">${item.conteudo}</p>
                                    <div class="mb-2">
                                        <span class="badge bg-success">Sem Glúten</span>
                                    </div>
                                <div class="modal-footer d-flex justify-content-between">
                                <span class="fw-bold fs-5 text-dark">${item.valor}</span>
                                    <div class="d-flex align-items-center gap-2"> 
                                        <button type="button" class="btn btn-outline-secondary btn-sm">-</button>
                                        <label>0</label>
                                        <button type="button" class="btn btn-outline-secondary btn-sm">+</button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` 
                        document.getElementById("modalContent").innerHTML = modalContent
                        return;
                            } else {
                                let modalContent = `
                                <div class="modal-header">
                                    <div class="modal-title">Lanchonete - ${lanchonete.nome}
                                        <h5 class="modal-title fs-2">${item.titulo}</h5>
                                    </div>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <img src="${item.imagem}"class="img-fluid mb-2 w-75 h-25 d-block mx-auto" style="max-width: 20rem; max-height: 20rem; object-fit: contain;">
                                    <p>${item.descricao}</p>
                                        <div id="divQuantidade"> 
                                        </div>
                                        <p class="d-block p-3 mb-3">${item.conteudo}</p>
                                <div class="modal-footer d-flex justify-content-between">
                                <span class="fw-bold fs-5 text-dark">${item.valor}</span>
                                    <div class="d-flex align-items-center gap-2"> 
                                        <button type="button" class="btn btn-outline-secondary btn-sm">-</button>
                                        <label>0</label>
                                        <button type="button" class="btn btn-outline-secondary btn-sm">+</button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` 
                        document.getElementById("modalContent").innerHTML = modalContent
                        return;
                            }
                        } else {
                            let modalContent = `
                                <div class="modal-header">
                                    <div class="modal-title">Lanchonete - ${lanchonete.nome}
                                        <h5 class="modal-title fs-2">${item.titulo}</h5>
                                    </div>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <img src="${item.imagem}"class="img-fluid mb-2 w-75 h-25 d-block mx-auto" style="max-width: 20rem; max-height: 20rem; object-fit: contain;">
                                    <p>${item.descricao}</p>
                                        <div id="divQuantidade"> 
                                        </div>
                                        <p class="d-block p-3 mb-3">${item.conteudo}</p>
                                    <div class="mb-2">
                                        <span class="badge bg-success">Sem Glúten</span>
                                    </div>
                                <div class="modal-footer d-flex justify-content-between">
                                <span class="fw-bold fs-5 text-dark">${item.valor}</span>
                                    <p>Item Indisponível</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` 
                        document.getElementById("modalContent").innerHTML = modalContent
                        return;
                        }
                    }
                }
            }
        })
        .catch(error => {
            console.error("Erro ao carregar os dados:", error);
        });
}