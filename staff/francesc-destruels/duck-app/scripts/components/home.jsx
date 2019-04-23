
    const i18nHome= {
        en: {
            title: 'Welcome to Hell',
            logOut: 'Log Out',
            search: 'Search',
        },
        es: {
            title: 'Bienvenido al Infierno',
            logOut: 'Salir',
            search: 'Busqueda'
        },
        ca: {
            title: 'Benvingut al infern',
            logOut: 'Sortir',
            search: 'Cercà',
        },
        ga: {
            title: 'Bienvenuto al inferno',
            logOut: 'Pa fuera',
            search: 'Andeandá',
        },
    }

function Home(props) {

    const { lang } = props

    const literals = i18nHome[lang]


    function handleClick(event) {
        event.preventDefault()

        props.onCheckOut()
    }

    return <main>
        <button onClick={handleClick}>{literals.logOut}</button>
        <h1>{literals.title}, {props.name}!</h1>
    </main>
}