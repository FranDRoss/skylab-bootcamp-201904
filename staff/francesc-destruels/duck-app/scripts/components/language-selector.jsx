
// class LanguageSelector extends Component {
//     constructor(select, callback) {
//         super(select)

//         this.onChange = callback
//     }

//     set onChange(callback) {
//         this.container.addEventListener('change', event => {
//             callback(event.target.value)
//         })
//     }
// }



function LanguageSelector(props) {


    return <select onChange={event => props.onLanguageChange(event.target.value)}>
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="ca">Català</option>
        <option value="ga">Galego</option>
    </select>
}

