import './Autocomplete.css'

import { FunctionComponent } from "react"

type AutocompleteProps = {
    possibleInputs: PossiblesInputs,
    isFocused: boolean,
    possibleInputFocused: number,
    onClickCallback: CallableFunction
}

const Autocomplete: FunctionComponent<AutocompleteProps> = ({
    possibleInputs, 
    isFocused,
    possibleInputFocused,
    onClickCallback,
}) => {
    if (!isFocused) {
        return <></>
    }

    return ( 
        <div className='autocomplete-items'>
            {
                possibleInputs.map((possibleInput, index) => {
                    return <div key={index} 
                                className={possibleInputFocused === index ? 'focused' : ''}
                                onClick={() => onClickCallback(index)}
                            >
                            {possibleInput.label}
                        </div>
                })
            }
        </div>
    )
}

export default Autocomplete