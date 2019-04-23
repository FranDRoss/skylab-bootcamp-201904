const { Component } = React

class App extends Component {
    state = { lang: i18n.language, visible: logic.isUserLoggedIn ? 'home' : 'landing', error: null, name: null, results: null }

    handleLanguageChange = lang => this.setState({ lang: i18n.language = lang })

    handleLoginNavigation = () => this.setState({ visible: 'login' })

    handleRegisterNavigation = () => this.setState({ visible: 'register' })

    handleLogin = (username, password) => {
        try {
            logic.loginUser(username, password, error => {
                if (error) return this.setState({ error: error.message })

                logic.retrieveUser((error, user) => {
                    if (error) return this.setState({ error: error.message })

                    this.setState({ visible: 'home', name: user.name, error: null })
                })
            })
        } catch ({ message }) {
            this.setState({ error: message })
        }
    }

    componentDidMount() {
        logic.isUserLoggedIn && logic.retrieveUser((error, user) => {
            if (error) return this.setState({ error: error.message })

            this.setState({ name: user.name })
        })
    }

    handleRegister = (name, surname, username, password) => {
        try {
            logic.registerUser(name, surname, username, password, error => {
                if (error) return this.setState({ error: error.message })

                this.setState({ visible: 'register-ok', error: null })
            })
        } catch ({ message }) {
            this.setState({ error: message })
        }
    }

    handleCheckOut = () => {
        logic.logoutUser()

        this.setState({ visible: 'landing', results: null })
    }

    handleSearch = (query) => {
        logic.searchDucks(query, (ducks) => {
            if (ducks) return this.setState({ results: ducks })
        })
    }

    render() {
        const {
            state: { lang, visible, error, name, results },
            handleLanguageChange,
            handleRegisterNavigation,
            handleLoginNavigation,
            handleLogin,
            handleRegister,
            handleCheckOut,
            handleSearch
        } = this

        return <>
            <LanguageSelector lang={lang} onLanguageChange={handleLanguageChange} />

            {visible === 'landing' && <Landing lang={lang} onRegister={handleRegisterNavigation} onLogin={handleLoginNavigation} />}

            {visible === 'login' && <Login lang={lang} onLogin={handleLogin} error={error} />}

            {visible === 'register' && <Register lang={lang} onRegister={handleRegister} error={error} />}

            {visible === 'home' && <><Home lang={lang} name={name} onCheckOut={handleCheckOut}></Home> <Search lang={lang} onSearch={handleSearch}/></>}

            {visible === 'home' && results && results.map(duck => <Results imageUrl={duck.imageUrl} title={duck.title} price={duck.price}/>)}
        </>

    }
}
