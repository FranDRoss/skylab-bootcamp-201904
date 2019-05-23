import React, { Component } from 'react'
import literals from './literals'
import logic from '../../logic'
import Search from '../Search'
import Results from '../Results'
import Favs from '../Favs'
import Cart from '../Cart'
import Detail from '../Detail'
import './index.sass'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'

class Home extends Component {
    state = { query: null, error: null, ducks: null, duck: null, favs: null, onFavs: false, cart: null, onCart: false }

    componentWillReceiveProps(props) {
        if (props.location.search) {
            const { query } = queryString.parse(props.location.search)

            query && this.search(query)
        } else {
            const [, , id] = props.location.pathname.split('/')

            id && this.retrieve(id)
        }
    }

    search = query =>
        Promise.all([logic.searchDucks(query), logic.retrieveFavDucks()])
            .then(([ducks, favs]) =>
                this.setState({ query, duck: null, ducks: ducks.map(({ id, title, imageUrl: image, price }) => ({ id, title, image, price })), favs, onFavs: false, onCart: false })
            )
            .catch(error =>
                this.setState({ error: error.message })
            )

    handleSearch = query => this.props.history.push(`/home?query=${query}`)

    retrieve = id =>
        logic.retrieveDuck(id)
            .then(({ title, imageUrl: image, description, price }) =>
                this.setState({ duck: { title, image, description, price }, onFavs: false, onCart: false })
            )
            .catch(error =>
                this.setState({ error: error.message })
            )

    handleRetrieve = id => this.props.history.push(`/home/${id}`)

    handleFav = id =>
        logic.toggleFavDuck(id)
            .then(() => logic.retrieveFavDucks())
            .then(favs => this.setState({ favs }))

    handleFavouritesList = () =>
        logic.retrieveFavDucks()
            .then(favs => {
                this.setState({ favs, onFavs: true, onCart: false })
            })

    handleRetriveCart = () =>
        logic.retrieveCart()
            .then(cart => {
                this.setState({ cart, onCart: true, onFavs: false })
            })

    handleAddCart = (id, amount) => {
        return logic.addCart(id, amount)
            .then(() => logic.retrieveCart())
            .then(cart => {
                this.setState({ cart })})
    }

    render() {
        const {
            handleSearch,
            handleRetrieve,
            handleAddCart,
            handleRetriveCart,
            handleFav,
            handleFavouritesList,
            state: { query, ducks, duck, favs, onFavs, cart, onCart },
            props: { lang, name, onLogout }
        } = this

        const { hello, logout } = literals[lang]

        return <main className="home">
            <h1>{hello}, {name}!</h1>
            <button onClick={onLogout}>{logout}</button>
            <div>
                <button onClick={handleFavouritesList}>Favourites</button>
                <button onClick={handleRetriveCart}>Cart</button>
            </div>
            <Search lang={lang} query={query} onSearch={handleSearch} />
            {onCart && <Cart items={cart} onItem={handleRetrieve}  onCart={handleAddCart} />}
            {onFavs && <Favs items={favs}  onCart={handleAddCart} cart={cart}  onItem={handleRetrieve} onFav={handleFav} favs={favs} />}
            {!duck && ducks && !onFavs && !onCart && (ducks.length && <Results items={ducks} onItem={handleRetrieve} onCart={handleAddCart} cart={cart} onFav={handleFav} favs={favs} /> || <p>No results.</p>)}
            {duck && !onFavs && !onCart && <Detail item={duck} onFav={handleFav} onCart={handleAddCart} cart={cart} />}
        </main>
    }
}

export default withRouter(Home)