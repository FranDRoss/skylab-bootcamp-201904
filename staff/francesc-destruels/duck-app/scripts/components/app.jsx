const { Component } = React

class App extends Component {
    state = { lang: i18n.language, visible: logic.isUserLoggedIn ? 'home' : 'landing', error: null, name: null, results: null, detail: null }

    handleLanguageChange = lang => this.setState({ lang: i18n.language = lang })

    handleLoginNavigation = () => this.setState({ visible: 'login' })

    handleRegisterNavigation = () => this.setState({ visible: 'register' })

    handleLogin = (username, password) => {
        try {
            logic.loginUser(username, password)
            .then(() =>{
                logic.retrieveUser()
            })
            .then(() => {
                logic.retrieveUser(user) => {
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
            logic.registerUser(name, surname, username, password)
                .then(() => {
                    this.setState({error: null, visible: 'login'})
                })

                .catch(this.setState({ error: error.message }))
        } catch ({ message }) {
            this.setState({ error: message })
        }
    }

    handleCheckOut = () => {
        logic.logoutUser()

        this.setState({ visible: 'landing', results: null })
    }

    handleSearch = (query) => {
        logic.searchDucks(query, (error, ducks) => {
            if (error) return this.setState({ error: ducks.error, results: null })

            this.setState({ error: null, detail: null, error: null, results: ducks })
        })
    }

    handleDetail = (id) => {
        logic.retrieveDuck(id, (error, duck) => {
            if (error) return this.setState({ error: error.message })

            this.setState({ results: null, error: null, detail: duck })
        })
    }

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
