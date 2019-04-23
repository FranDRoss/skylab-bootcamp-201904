
const LanguageSelector = (() => {
    return function ({ lang, onLanguageChange }) {

        return <select value={lang} onChange={event => onLanguageChange(event.target.value)}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="ca">Català</option>
            <option value="ga">Galego</option>
        </select>
    }
})()

