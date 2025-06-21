mapboxgl.accessToken = 'pk.eyJ1IjoiY3Jpc3Mtc2FubnRvcyIsImEiOiJjbWMyN3ZjZHcwNWxwMmtwdnJqa2d6ZDB2In0.XIwfVgH6cLFQBO8UIaoZxA';

const mapa = new mapboxgl.Map({
  container: 'mapa-contagem',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-44.076517039951, -19.93900457075985], // Centro do campus Coração Eucarístico
  zoom: 17
});

const lanchonetesContagem = [
  {
    nome: 'Lanchonete Praçaki',
    coords: [-44.07620599367716, -19.939352989756927]
  },
  {
    nome: 'Lanchonete Praçala',
    coords: [-44.07643901192358, -19.941048287246733]
  }
];

lanchonetesContagem.forEach(loc => {
  const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<div class="popup-personalizado"><strong>${loc.nome}</strong></div>`);

  new mapboxgl.Marker()
    .setLngLat(loc.coords)
    .setPopup(popup)
    .addTo(mapa);
});

// Mostra localização do usuário (opcional)
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    const userCoords = [pos.coords.longitude, pos.coords.latitude];
    new mapboxgl.Marker({ color: 'yellow' })
      .setLngLat(userCoords)
      .setPopup(new mapboxgl.Popup().setText("Você está aqui"))
      .addTo(mapa);
  });
}

fetch("http://localhost:3000/campus")
  .then(res => res.json())
  .then(campi => {
    const coreu = campi.find(c => c.nome.includes("Contagem"));

    if (coreu) {
      const container = document.getElementById('lanchonetes-container');

      // coreu.lanchonetes.forEach(l => {
      //   const botao = document.createElement('a');
      //   botao.textContent = l.nome;
      //   botao.className = 'btn btn-outline-light mx-2 px-4 py-2 fw-bold';
      //   botao.href = `${l.id}.html`;
      //   container.appendChild(botao);
      // });
    }
  })
  .catch(error => console.error("Erro ao carregar dados do campus:", error));
