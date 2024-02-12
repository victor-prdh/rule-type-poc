import './RuleTyper.css'

import { ChangeEvent, FunctionComponent, KeyboardEvent, useEffect, useState } from "react"
import Chip from "./Chip"
import Autocomplete from './Autocomplete'

type RuleTyperProps = {
}

const watchedKeyDown: string[] = ['Enter', 'Backspace', 'ArrowDown', 'ArrowUp']

const steps: string[] = ['identifier', 'subselect', 'condition', 'value'];

const allPossibleInputs: PossiblesInputs = [
    {label: 'Attribut', identifier: 'attribute', subselect: [
        {label: 'Nom du produit', identifier: 'name'},
        {label: 'Description du produit', identifier: 'description'},
        {label: 'Photo du produit', identifier: 'picture'},
    ]},
    {label: 'Sku', identifier: 'sku'},
    {label: 'attention', identifier: 'att'},
    {label: 'test', identifier: 'test'},
]

const RuleTyper: FunctionComponent<RuleTyperProps> = () => {  
    const [inputValue, setInputValue] = useState<string>('')
    const [savedInput, setSavedInput] = useState<PossiblesInputs>([])
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false)
    const [possibleInputs, setPossibleInputs] = useState<PossiblesInputs>(allPossibleInputs)
    const [possibleInputFocused, setPossibleInputFocused] = useState<number>(0)
    const [step, setStep] = useState<number>(0)

    const [rules, setRules] = useState<Rules>([])
    const [rule, setRule] = useState<WipRule>({})


    useEffect(() => filterPossibleInputs(), [inputValue])
    useEffect(() => handleFocusedInput(), [possibleInputs, possibleInputFocused])

    const handleInputChange = (e: ChangeEvent) => {
        const target = e.target as HTMLInputElement
 
        setInputValue(target.value)
    }   

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!watchedKeyDown.includes(e.key)) {
            return
        }

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                e.stopPropagation();
                handleEnter();
                break;

            case 'Backspace':
                handleBackspace()
                break;

            case 'ArrowDown':
                e.preventDefault();
                handleArrowDown();
                break;
            
            case 'ArrowUp':
                e.preventDefault();
                handleArrowUp();
                break;
        
            default:
                break;
        }
    }

    const handleEnter = () => {
        handleValue(possibleInputFocused)
    }

    const handleBackspace = () => {
        if('' !== inputValue || savedInput.length === 0) {
            return
        }

        let currentSavedInput = savedInput;
        currentSavedInput.pop();

        setSavedInput([...currentSavedInput])
    }

    const handleArrowDown = () => {
        setPossibleInputFocused(possibleInputFocused+1)
    }

    const handleArrowUp = () => {
        setPossibleInputFocused(possibleInputFocused-1)
    }

    const filterPossibleInputs = () => {
        let currentPossibleInputs = allPossibleInputs.filter(
            possibleInputs => possibleInputs.label.toUpperCase().startsWith(inputValue.toUpperCase())
        )

        setPossibleInputs(currentPossibleInputs)
    }

    const handleFocusedInput = () => {        
        if (possibleInputFocused >= possibleInputs.length) {
            setPossibleInputFocused(0)
        }

        if (possibleInputFocused < 0) {
            setPossibleInputFocused(possibleInputs.length-1)
        }     
    }

    const handleValue = (input: any) => {
        if (steps[step] === 'identifier' && !possibleInputs[input]) {
            alert('data non valide')
            return
        }

        if(steps[step] === 'identifier') {
            setRule({input: possibleInputs[input]})
            setStep(1)
        }


        setSavedInput([
            ...savedInput,
            possibleInputs[possibleInputFocused]
        ])

        setInputValue('')
        setPossibleInputs(allPossibleInputs)
    }

    const clickOnComplete = (input: number) => {
        handleValue(input)
    }

    return <>
        <div>
            {savedInput?.map((possibleInput, index) => <Chip value={possibleInput.label} key={index} />)}
            <div className="autocomplete">
                <input 
                    value={inputValue}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => {setTimeout(() => {setIsInputFocused(false)}, 100)}}
                    onChange={(e) => handleInputChange(e)}
                    onKeyDownCapture={(e) => handleKeyDown(e)}
                    autoComplete="off"
                />
                <Autocomplete 
                    possibleInputs={possibleInputs}
                    isFocused={isInputFocused} 
                    possibleInputFocused={possibleInputFocused}
                    onClickCallback={clickOnComplete}
                />
            </div>
            <span>step: {steps[step]}</span>
        </div>
    </>
}

export default RuleTyper