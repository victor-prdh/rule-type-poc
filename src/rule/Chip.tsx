import './Chip.css'

import { FunctionComponent } from "react"

type ChipProps = {
    value?: string
}

const Chip: FunctionComponent<ChipProps> = ({value}) => {
    return <>
        <span className='chip'>{value}</span>
    </>
}

export default Chip