const { Component } = React

class App extends Component {
    state = { lang: 'en', visible: logic.isUserLoggedIn ? 'home' : 'landing', loginError: null, registerError: null, name: null }

    handleLanguageChange = lang => this.setState({ lang })

    handleLoginNavigation = () => this.setState({ visible: 'login' })

    handleRegisterNavigation = () => this.setState({ visible: 'register' })

    handleLogin = (username, password) =>
        logic.loginUser(username, password, error => {
            if (error) return this.setState({ error: error.message })

            logic.retrieveUser((error, user) => {
                if (error) return this.setState({ error: error.message })

                this.setState({ visible: 'home', name: user.name })
            })
        })

    componentDidMount() {
        logic.isUserLoggedIn && logic.retrieveUser((error, user) => {
            if (error) return this.setState({ loginError: error.message })

            this.setState({ name: user.name.toUpperCase() })
        })
    }

    handleRegister= (name, surname, email, password) =>
    logic.registerUser(name, surname, email, password, error => {
        if (error) return this.setState({ registerError: error.message })

        this.setState({ visible: 'login'})
    })

    render() {
        const {
            state: { lang, visible, loginError, registerError, name },
            handleLanguageChange,
            handleRegisterNavigation,
            handleLoginNavigation,
            handleLogin,
            handleRegister
        } = this

        return <>
            <LanguageSelector onLanguageChange={handleLanguageChange} />

            {visible === 'landing' && <Landing lang={lang} onRegister={handleRegisterNavigation} onLogin={handleLoginNavigation} />}

            {visible === 'login' && <Login lang={lang} onLogin={handleLogin} error={loginError} />}

            {visible === 'register' && <Register lang={lang} onRegister={handleRegister} error={registerError} />}

            {visible === 'home' && <Home lang={lang} name={name} />}
        </>
    }
}

