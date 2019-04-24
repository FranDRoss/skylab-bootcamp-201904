
const Detail = (() => {

    const literals = {
        en: {
            buy: 'Buy It',
        },
        es: {
            buy: 'Comprar',
        },
        ca: {
            buy: 'Comprar',
        },
        ga: {
            buy: 'Compraló',
        }
    }

    return function (props) {
        const {title, imageUrl, price, description, id, lang} = props

        const { buy } = literals[lang]

        function handleFavourite(){
            console.log("To Do Favourite List")
        }

        function handleBuy(){
            console.log("To Do Buy")
        }

        return <div>
            <h2>{title}</h2>
            <img src={imageUrl} alt="Ducktail" />
            <span>{price}</span>
            <p>{description}</p>
            <button onClick={handleBuy}>{buy}</button>
            <button onClick={handleFavourite}>FAVOURITE</button>
        </div>
    }
})()