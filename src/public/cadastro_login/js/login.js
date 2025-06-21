// ============================================================
// ------------------- Verificação de Login -------------------  
// ============================================================

const apiURL_usuarios = '/usuarios'

let loginForm = document.getElementById('loginForm')

loginForm.addEventListener('submit', event => {
    event.preventDefault()

    let loginUsuario = {
        email: document.getElementById('inputEmail').value,
        senha: document.getElementById('inputSenha').value
    }
    // Verificar se existe o usuário
    fetch(apiURL_usuarios)
        .then(res => res.json())
        .then(usuarios => {

            const loginCorreto = usuarios.find(u => u.email === loginUsuario.email && u.senha === loginUsuario.senha)

            if (loginCorreto) {
                alert('Login feito com sucesso!')
                sessionStorage.setItem('usuarioLogado', JSON.stringify(loginCorreto))
                window.location.href = '../principal/index.html'
            } else {
                alert('Email ou senha incorreto.')
            }

        })
        .catch(error => {
            console.log('Erro ao verificar login', error);
            alert('Ocorreu um erro ao tentar fazer login.');
        })
})

