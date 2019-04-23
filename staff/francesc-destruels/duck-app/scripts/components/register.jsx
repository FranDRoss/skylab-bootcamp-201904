
const Register = (() => {
    const i18nRegister = {
        en: {
            title: 'Sign up',
            name: 'Name',
            surname: 'Surname',
            email: 'E-mail',
            password: 'Password',
            confirmpassword: 'Confirm Password',
            confirmRegister: 'Confirm Register',
        },
        es: {
            title: 'Registro',
            name: 'Nombre',
            surname: 'Apellido',
            email: 'E-milio',
            password: 'Contraseña',
            confirmpassword: 'Confirmar Contraseña',
            confirmRegister: 'Confirma Registro',
        },
        ca: {
            title: 'Registre',
            name: 'Nom',
            surname: 'Cognom',
            email: 'E-mil·li',
            password: 'Contrasenya',
            confirmpassword: 'Confirma Contrasenya',
            confirmRegister: 'Confirm Registre',
        },
        ga: {
            title: 'Rexistro',
            name: 'Nome',
            surname: 'Apelido',
            email: 'E-miliño',
            password: 'Contrasinal',
            confirmpassword: 'Confirma Contrasinal',
            confirmRegister: 'Confirma Passwordo',
        }
    }

    return function (props) {
        const { lang } = props

        const literals = i18nRegister[lang]

        function handleSubmit(event) {
            event.preventDefault()

            const x = event.target
            const name = x.name.value
            const surname = x.surname.value
            const email = x.email.value
            const password = x.password.value

            props.onRegister(name, surname, email, password)
        }

        return <>
            <h2>{literals.title}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder={literals.name} />
                <input type="text" name="surname" placeholder={literals.surname} />
                <input type="text" name="email" placeholder={literals.email} />
                <input type="password" name="password" placeholder={literals.password} />
                <button>{literals.confirmRegister}</button>
                <p>{props.error}</p>
            </form>
        </>
    }
})()