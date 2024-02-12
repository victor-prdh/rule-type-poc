type Rules = Rule[];

type Rule =  {
    identifier: string,
    subselect?: string,
    condition: string,
    value?: string
}

type WipRule = {
    input?: PossibleInput,
    subselect?: string,
    condition?: string,
    value?: string
}