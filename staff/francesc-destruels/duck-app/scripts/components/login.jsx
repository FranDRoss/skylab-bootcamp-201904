

const i18nLogin = {
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
},

function Login(props) {
    const { lang } = props

    const literals = i18nLogin[lang]

    function handleSubmit(event) {
        event.preventDefault()

        const username = event.target.username.value
        const password = event.target.password.value

        props.onLogin(username, password)
    }

    return <>
    <h2>{literals.title}</h2>
    <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder={literals.email} />
        <input type="password" name="password" placeholder={literals.password} />
        <button>Login</button>
        <p>{props.error}</p>
    </form>
    </>
}