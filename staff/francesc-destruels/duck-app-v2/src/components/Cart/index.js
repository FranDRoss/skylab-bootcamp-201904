import React from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
// import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'

function Cart({ items, onItem }) {
    if (items.length > 0) {
        return <ul>
            {
                items.map(({ id, title, imageUrl: image, price, howMany }) => {
                    console.log(items)

                    return <li key={id} onClick={() => onItem(id)}>
                        <h2>{title}</h2>
                        <img src={image} />
                        <span>{price}</span>
                        <span> In your Cart: {howMany}</span>
                    </li>
                })
            }
        </ul>
    } else {
        return <p>Your cart is empyt! What are you waiting for?</p>
    }
}

export default Cart