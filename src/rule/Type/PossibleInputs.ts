type PossiblesInputs = PossibleInput[];

type PossibleInput =  {
    label: string,
    identifier: string,
    subselect?: PossibleInput[]
}