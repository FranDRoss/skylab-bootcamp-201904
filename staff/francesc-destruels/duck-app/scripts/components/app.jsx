const { Component } = React

class App extends Component {
    state = { lang: 'en', visible: logic.isUserLoggedIn ? 'home' : 'landing', loginError: null, name: null }

    handleLanguageChange = lang => this.setState({ lang })


    handleLoginNavigation = () => this.setState({ visible: 'login' })


    handleRegisterNavigation = () => this.setState({ visible: 'register' })


    handleLogin = (username, password) => {
        logic.login(username, password, error => {
            if (error) return this.setState({ loginError: error.message })

            logic.retrieveUser((error, user) => {
                if (error) return this.setState({ loginError: error.message })
            })

            this.setState({ visible: 'home', name: user.name })
        })

        this.setState(loggedIn ? { loggedIn, userName: logic.retrieveUser().name } : { loginError: 'wrong credentials' })
    }

    componentDidMount() {
        logic.isUserLoggedIn && logic.retrieveUser((error, user) => {
            if (error) return this.setState({loginError: error.message})

            this.setState({ name: user.name })
        })
    }

    render() {

        const  {
            state: {lang, visible, loginError, name },
            handleLanguageChange,
            handleRegisterNavigation,
            handleLoginNavigation,
            handleLogin,
        }


        return <>
        
        </>
    }
}
