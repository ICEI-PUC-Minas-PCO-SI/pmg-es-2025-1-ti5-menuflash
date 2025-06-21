let campusData = [];

window.onload = function () {
  fetch('db.json')
    .then(response => response.json())
    .then(data => {
      campusData = data.campus;

      const currentPage = window.location.pathname;
      const lanchonetesContainer = document.getElementById("lanchonetes-container");

      if (lanchonetesContainer) {
        const campusAtual = campusData.find(campus =>
          currentPage.toLowerCase().includes(campus.mapa.toLowerCase())
        );

        if (campusAtual) {
          campusAtual.lanchonetes.forEach(lanchonete => {
            const button = document.createElement("button");
            button.classList.add("btn", "btn-light", "rounded-pill", "fw-bold", "m-2", "w-100");
            button.innerText = lanchonete.nome;
            button.onclick = function () {
              window.location.href = `Lanchonetes.html?id=${lanchonete.id}`;
            };
            lanchonetesContainer.appendChild(button);
          });
        } else {
          lanchonetesContainer.innerHTML = "<p>Nenhum campus encontrado para esta página.</p>";
        }
      }
    })
    .catch(error => console.error("Erro ao carregar o JSON:", error));
};
