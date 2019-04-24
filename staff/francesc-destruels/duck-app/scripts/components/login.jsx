
const Login = (() => {
    const literals = {
        en: {
            title: 'Sign In',
            email: 'E-mail',
            password: 'Password',
        },
        es: {
            title: 'Inicia Sesión',
            email: 'E-milio',
            password: 'Contraseña'

        },
        ca: {
            title: 'Inici de Sessió',
            email: 'E-mil·li',
            password: 'Contrasenya'
        },
        ga: {
            title: 'Inicio de sesion',
            email: 'E-miliño',
            password: 'Contrasinal'
        }
    }

    return function ({ lang, error, onLogin }) {
        console.log(error)
        const { title, email, password } = literals[lang]

        function handleSubmit(event) {
            event.preventDefault()

            const username = event.target.username.value
            const password = event.target.password.value

            onLogin(username, password)
        }

        return <>
            <h2>{title}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder={email} />
                <input type="password" name="password" placeholder={password} />
                <button>Login</button>
                <p>{error}</p>
            </form>
        </>
    }
})()