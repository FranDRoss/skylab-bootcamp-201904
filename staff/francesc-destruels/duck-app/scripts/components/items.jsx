
const Items = (() => {
    return function ({items, onDetail}) {
        const {title, imageUrl: image, price, id} = items

        function handleClick(){
            onDetail(id)
        }

        return <div onClick={handleClick}>
            <h2 >{title}</h2>
            <img src={image} alt="Ducktail" />
            <span>{price}</span>
        </div>
    }
})()
