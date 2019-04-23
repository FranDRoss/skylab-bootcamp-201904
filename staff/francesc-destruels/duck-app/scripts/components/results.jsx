
const Results = (() => {
    return function (props) {
        const {title, imageUrl, price} = props
        return <div>
            <h2>{title}</h2>
            <img src={imageUrl} alt="Ducktail" />
            <span>{price}</span>
        </div>
    }
})()
