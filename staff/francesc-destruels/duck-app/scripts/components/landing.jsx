
const i18nLanding = {
    en: {
        register: 'Register',
        or: 'or',
        login: 'LogIn',
    },
    es: {
        register: 'Regístrate',
        or: 'o',
        login: 'Conectate',
    },
    ca: {
        register: "Regitra't",
        or: 'o',
        login: "Conecta't",
    },
    ga: {
        register: 'Rexistrese',
        or: 'o',
        login: 'LogIn',
    },
}

function Landing(props){

    const { lang } = props

    const literals = i18nLanding[lang]

    return     <section onClick={e => {e.preventDefault()}}>
    <a href="" onClick={e => props.onRegister()}>{literals.register}</a> <span>{literals.or}</span> <a href="" onClick={e => props.onLogin()}>{literals.login}</a>.
</section>
}