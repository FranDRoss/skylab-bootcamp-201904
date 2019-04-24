
const Items = (() => {
    return function (props) {
        const {title, imageUrl, price, id} = props

        function handleClick(){
            props.onDetail(id)
        }

        return <div onClick={handleClick}>
            <h2 >{title}</h2>
            <img src={imageUrl} alt="Ducktail" />
            <span>{price}</span>
        </div>
    }
})()
