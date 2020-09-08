// Generic types
export type BinaryFunc<T, U> = (x: T, y: U) => U

// Frontend types
export type FinishLayoutFunc<> = () => unknown
export type Layout = { finishLayout: FinishLayoutFunc }
export type LayoutFunc<T> = (x: T, y: Layout) => void
export type IndexView = { pokemons: PokemonsResponse[] }
export type DetailsView = { details: DetailsResponse }

// Backend types
export type PokemonRequest = (url: string) => Promise<IndexResponse | DetailsResponse>
export type PokemonsResponse = { name: string, url: string, image?: string, id?: number }
export type IndexResponse = { count: number, next: string, previous?: string, results: PokemonsResponse[] }
export type DetailsResponse = { 
    height?: number,
    id?: number,
    name?: string,
    sprites?: { back_default?: string, front_default?: string }
    types?: unknown[],
    weight?: number
}