type GetReturnType<T> = T extends () => infer U ? ReturnType<T> : never
type GetTupleElementsType<T> = T extends readonly [...infer U] ? T[number] : never
type GetInstanceType<T> = T extends abstract new (...args: any) => infer U ? InstanceType<T> : never

export type ParsedTxTypes<T> = GetInstanceType<GetTupleElementsType<GetReturnType<T>>>

// TODO: Add `Transaction` type instead of `any`
// export type EventMap<T> = Record<string, (tx: IndexerTransaction) => ParsedTxTypes<T> | null>
export type EventMap<T> = Record<string, (tx: any) => ParsedTxTypes<T> | null>
