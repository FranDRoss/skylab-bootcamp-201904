const Landing = (() => {

    const literals = {
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

    return function ({ lang, onRegister, onLogin }) {

        const { register, or, login } = literals[lang]

        return <section onClick={e => { e.preventDefault() }}>
            <a href="" onClick={() => onRegister()}>{register}</a> <span>{or}</span> <a href="" onClick={() => onLogin()}>{login}</a>.
        </section>
    }
})()