const { Component } = React

class App extends Component {
    state = { lang: i18n.language, visible: logic.isUserLoggedIn ? 'home' : 'landing', error: null, name: null }

    handleLanguageChange = lang => this.setState({ lang: i18n.language = lang })

    handleLoginNavigation = () => this.setState({ visible: 'login' })

    handleRegisterNavigation = () => this.setState({ visible: 'register' })

    handleLogin = (username, password) =>
        logic.loginUser(username, password, error => {
            if (error) return this.setState({ error: error.message })

            logic.retrieveUser((error, user) => {
                if (error) return this.setState({ error: error.message })

                this.setState({ visible: 'home', name: user.name, error: null })
            })
        })

    componentDidMount() {
        logic.isUserLoggedIn && logic.retrieveUser((error, user) => {
            if (error) return this.setState({ error: error.message })

            this.setState({ name: user.name })
        })
    }

    handleRegister = (name, surname, email, password) => {

        logic.registerUser(name, surname, email, password, error => {
            if (error) return this.setState({ error: error.message })

            this.setState({ visible: 'login', error: null })
        })
    }

    handleCheckOut = () => {
        logic.logoutUser()

        this.setState({ visible: 'landing' })
    }

    render() {
        const {
            state: { lang, visible, error, name },
            handleLanguageChange,
            handleRegisterNavigation,
            handleLoginNavigation,
            handleLogin,
            handleRegister,
            handleCheckOut
        } = this

        return <>
            <LanguageSelector lang={lang} onLanguageChange={handleLanguageChange} />

            {visible === 'landing' && <Landing lang={lang} onRegister={handleRegisterNavigation} onLogin={handleLoginNavigation} />}

            {visible === 'login' && <Login lang={lang} onLogin={handleLogin} error={error} />}

            {visible === 'register' && <Register lang={lang} onRegister={handleRegister} error={error} />}

            {visible === 'home' && <Home lang={lang} name={name} onCheckOut={handleCheckOut} />}
        </>
    }
}

