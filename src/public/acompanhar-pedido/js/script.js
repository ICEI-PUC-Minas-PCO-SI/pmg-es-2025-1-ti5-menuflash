document.addEventListener('DOMContentLoaded', () => {
    const statusContainer = document.getElementById('status-pedido');

    setTimeout(() => {
        statusContainer.innerHTML = `
            <i class="bi bi-check-circle-fill display-1 text-success"></i>
            <h1 class="h2 mt-3">Seu pedido esta pronto!</h1>
            <p class="lead text-muted">Pode vir buscar.</p>
        `;
    }, 10000); // 10 segundos
}); 