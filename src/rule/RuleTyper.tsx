import './RuleTyper.css'

import { ChangeEvent, FunctionComponent, KeyboardEvent, useEffect, useState } from "react"
import Chip from "./Chip"
import Autocomplete from './Autocomplete'

type RuleTyperProps = {
}

const watchedKeyDown: string[] = ['Enter', 'Backspace', 'ArrowDown', 'ArrowUp']

const step1: string = 'identifier';
const step2: string = 'subselect';
const step3: string = 'condition';
const step4: string = 'value';

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
    const [step, setStep] = useState<string>(step1)

    const [rules, setRules] = useState<Rules>([])
    const [rule, setRule] = useState<WipRule>({})


    useEffect(() => filterPossibleInputs(), [inputValue])
    useEffect(() => handleFocusedInput(), [possibleInputs, possibleInputFocused])
    useEffect(() => handleChangeStep(), [step])

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
        let currentPossibleInputs: PossiblesInputs = [];

        if (step === step1) {
            currentPossibleInputs = allPossibleInputs.filter(
                possibleInputs => possibleInputs.label.toUpperCase().startsWith(inputValue.toUpperCase())
            )
        }

        if (step === step2 && rule.input?.subselect) {
            currentPossibleInputs = rule.input.subselect.filter(
                possibleInputs => possibleInputs.label.toUpperCase().startsWith(inputValue.toUpperCase())
            )
        }
        

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
        if (step === step1 && !possibleInputs[input]) {
            alert('data non valide')
            return
        }

        if(step === step1) {
            console.log(possibleInputs[input]);
            
            setRule({input: possibleInputs[input]})
            setStep(step2)
        }

        if(step === step2) {
            setRule({
                ...rule,
                subselect: possibleInputs[input].identifier
            })

            setStep(step2)            
        }


        setSavedInput([
            ...savedInput,
            possibleInputs[input]
        ])

        setInputValue('')        
    }

    const clickOnComplete = (input: number) => {
        console.log(input);
        
        handleValue(input)
    }

    const handleChangeStep = () => {
        console.log(rule, step);
        
        if (step === step1) {
            return
        }

        if(step !== step1 && !rule.input) {
            setRule({});
            setStep(step1)
            setPossibleInputs(allPossibleInputs)
        }

        if(step === step2) {
            if(!rule.input?.subselect) setStep(step3);
            else setPossibleInputs(rule.input.subselect)

            return
        }
        
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
            <span>step: {step}</span>
        </div>
    </>
}

export default RuleTyper