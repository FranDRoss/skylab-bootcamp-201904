const { Component } = React

class App extends Component {
    state = { lang: i18n.language, visible: logic.isUserLoggedIn ? 'home' : 'landing', error: null, name: null, results: null, detail: null }

    handleLanguageChange = lang => this.setState({ lang: i18n.language = lang })

    handleLoginNavigation = () => this.setState({ visible: 'login' })

    handleRegisterNavigation = () => this.setState({ visible: 'register' })

    handleLogin = (username, password) => {
        try {
            logic.loginUser(username, password)
                .then(() =>
                    logic.retrieveUser()
                )
                .then(user => {
                    this.setState({ visible: 'home', name: user.name, error: null })
                })
                .catch(error =>
                    this.setState({ error: error.message })
                )
        } catch ({ message }) {
            this.setState({ error: message })
        }
    }

    componentDidMount() {
        logic.isUserLoggedIn &&
            logic.retrieveUser()
                .then(user =>
                    this.setState({ name: user.name })
                )
                .catch(error =>
                    this.setState({ error: error.message })
                )
    }

    handleRegister = (name, surname, username, password) => {
        try {
            logic.registerUser(name, surname, username, password)
                .then(() =>
                    this.setState({ visible: 'login', error: null })
                )
                .catch(error =>
                    this.setState({ error: error.message })
                )
        } catch ({ message }) {
            this.setState({ error: message })
        }
    }

    handleCheckOut = () => {
        logic.logoutUser()

        this.setState({ visible: 'landing', results: null, detail: null, error: null  })
    }

    handleSearch = query =>
        logic.searchDucks(query)
            .then(ducks =>
                this.setState({ error: null, detail: null, error: null, results: ducks })
            )
            .catch(error =>
                this.setState({ error: error.message })
            )

    handleDetail = id =>
        logic.retrieveDuck(id)
            .then(duck =>
                this.setState({ results: null, error: null, detail: duck, results: null })
            )
            .catch(error =>
                this.setState({ error: error.message })
            )

    render() {
        const {
            state: { lang, visible, error, name, results, detail },
            handleLanguageChange,
            handleRegisterNavigation,
            handleLoginNavigation,
            handleLogin,
            handleRegister,
            handleCheckOut,
            handleSearch,
            handleDetail,
        } = this

        return <>
            <LanguageSelector lang={lang} onLanguageChange={handleLanguageChange} />

            {visible === 'landing' && <Landing lang={lang} onRegister={handleRegisterNavigation} onLogin={handleLoginNavigation} />}

            {visible === 'login' && <Login lang={lang} onLogin={handleLogin} error={error} />}

            {visible === 'register' && <Register lang={lang} onRegister={handleRegister} error={error} />}

            {visible === 'home' && <><Home lang={lang} name={name} onCheckOut={handleCheckOut}></Home> <Search lang={lang} onSearch={handleSearch} error={error} /></>}

            {visible === 'home' && results && results.map(duck => <Items key={duck.id} onDetail={handleDetail} items={duck} />)}

            {visible === 'home' && detail && <Detail lang={lang} item={detail} />}
        </>

    }
}
