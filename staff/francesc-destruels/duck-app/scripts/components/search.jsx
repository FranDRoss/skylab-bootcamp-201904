
const Search = (() => {

    const literals = {
        en: {
            search: 'Search',
            confirmSearch: 'Search',
        },
        es: {
            search: 'Busqueda',
            confirmSearch: 'Buscar',
        },
        ca: {
            search: 'Cerca',
            confirmSearch: 'Cercar',
        },
        ga: {
            search: 'Buscaló',
            confirmSearch: 'Busca',
        }
    }

    return function (props) {
        const { lang, error } = props

        const { search, confirmSearch } = literals[lang]

        function handleSubmit(event) {
            event.preventDefault()

            const query = event.target.query.value

            props.onSearch(query)
        }

        return <>
            <form onSubmit={handleSubmit}>
                <input type="text" name="query" placeholder={search} />
                <button>{confirmSearch}</button>
                <p>{error}</p>
            </form>
        </>
    }
})()