// Função verificar se usuário esta logado, e inserir elemento correspondente com o tipo de usuário

// Ver se o usuario esta logado 
    // Verifica se há um usuário logado no sessionStorage
  let usuario = null;
  function checarUsuarioLogado() {
    const usuarioLogadoStr = sessionStorage.getItem('usuarioLogado');
    if (!usuarioLogadoStr) return false;
    usuario = JSON.parse(usuarioLogadoStr);
    return true;
  }

  // Desloga o usuário e recarrega página
  function sairUsuario(event) {
    event.preventDefault();
    sessionStorage.removeItem('usuarioLogado');
    location.reload(); 
  }

  window.onload = () => {
    const linksContainer = document.querySelector('#linksDoUsuario');
    let linksHTML = '';

    if (checarUsuarioLogado()) {
      
      if (usuario.tipo === 'administrador') {
        linksHTML = `
          <ul class="navbar-nav d-flex flex-row gap-4 align-items-center">
            <li class="nav-item">
              <a class="nav-link fs-5" href="../cadastro_de_itens/cadastroDeItens.html">Cadastro de Itens</a>
            </li>
            <li class="nav-item">
              <a class="nav-link fs-5" href="../perfil/perfil.html">Perfil</a>
            </li>
            <li class="nav-item">
              <a id="sairLink" class="nav-link fs-5" href="#">Sair</a>
            </li>
          </ul>
        `;
      } else {
        linksHTML = `
          <ul class="navbar-nav d-flex flex-row gap-4 align-items-center">
            <li class="nav-item">
              <a class="nav-link fs-5" href="../perfil/perfil.html">Perfil</a>
            </li>
            <li class="nav-item">
              <a id="sairLink" class="nav-link fs-5" href="#">Sair</a>
            </li>
          </ul>
        `;
      }
    } else {
      // Usuário deslogado: link de Entrar com redirectUrl
      linksHTML = `
        <ul class="navbar-nav d-flex flex-row gap-4 align-items-center">
          <li class="nav-item">
            <a class="nav-link fs-5" href="../cadastro_login/login.html">Entrar</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fs-5" href="../cadastro_login/cadastroUsuario.html">Cadastre-se</a>
          </li>
        </ul>
      `;
    }

    if (linksContainer) {
      linksContainer.innerHTML = linksHTML;
    }

    // Se estiver logado, liga o evento de saída
    if (checarUsuarioLogado()) {
      const sairLink = document.querySelector('#sairLink');
      if (sairLink) {
        sairLink.addEventListener('click', sairUsuario);
      }
    }
  };