import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function Results({ items, onItem }) {
    return <ul>
        {items.map(({ id, title, image, price }) =>
            <li key={id} onClick={() => onItem(id)}>
                <h2>{title}</h2>
                <FontAwesomeIcon icon="heart" />
                <img src={image} />
                <span>{price}</span>
            </li>)}
    </ul>
}

export default Results