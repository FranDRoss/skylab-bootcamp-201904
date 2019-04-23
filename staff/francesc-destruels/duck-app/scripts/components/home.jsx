
const literals = {
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

function Home({ lang, name, onCheckOut }) {

    const { logOut, title } = literals[lang]


    function handleClick() {
        onCheckOut()
    }

    return <main>
        <button onClick={handleClick}>{logOut}</button>
        <h1>{title}, {name}!</h1>
    </main>
}