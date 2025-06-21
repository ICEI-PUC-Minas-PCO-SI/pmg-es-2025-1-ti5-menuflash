// ============================================================
// ------------------- Cadastro de usuários -------------------  
// ============================================================
const apiURL_usuarios = '/usuarios'

let cadastroForm = document.getElementById('cadastroForm')
const inputSenha = document.querySelector('#inputSenha') 
const passwordAlert = document.getElementById('passwordAlert'); 

cadastroForm.addEventListener('submit', event => {
    event.preventDefault()

    if (!cadastroForm.checkValidity()) {
        cadastroForm.reportValidity()
        return
    }

    const email = document.getElementById('inputEmail').value
    const senha = inputSenha.value // Pega o valor da senha

    // **A VERIFICAÇÃO DE BLOQUEIO VEM AQUI!**
    if (senha.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres para realizar o cadastro.');
        return; // **ESTE RETURN É ESSENCIAL PARA BLOQUEAR O ENVIO**
    }

    // O resto do código só executa se a senha for válida
    fetch(apiURL_usuarios)
        .then(res => res.json())
        .then(usuarios => {
            const usuarioExistente = usuarios.find(u => u.email === email)

            if (usuarioExistente) {
                alert('Este email já foi cadastrado!')
                return
            }

            let novoId = usuarios.length > 0 ? Number(usuarios[usuarios.length - 1].id) + 1 : 1;

            let cadastroUsuario = {
                id: novoId,
                nome: document.getElementById('inputNome').value,
                email: email,
                senha: senha,
                tipo: "padrao",
                historico: [],
            }

            fetch(apiURL_usuarios, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cadastroUsuario),
            })
            .then(() => {
                alert('Cadastro realizado com sucesso.')
                window.location.href = "login.html"
            })
            .catch(error => {
                console.log('Erro ao cadastrar usuário', error)
            })
        })
        .catch(error => {
            console.log('Erro ao obter usuários', error)
        })
})

// Para mostrar o aviso
inputSenha.addEventListener('blur', event => {

    let senha = inputSenha.value 
    
    if (senha.length > 0 && senha.length < 6) {
        passwordAlert.innerHTML = `
            <div class="alert alert-danger py-1" role="alert" style="font-size:15px"> 
                A senha deve ter no mínimo 6 caracteres.
            </div>
        `
    } else {
        passwordAlert.innerHTML = ''
    }
})