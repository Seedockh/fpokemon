import * as https from 'https'
import { IndexResponse, DetailsResponse } from './types'

export const pokemonRequest = async (url: string): Promise<IndexResponse | DetailsResponse> => {
    return new Promise(resolve => {
        const request = https.get(url, pokeResult => {
            let pokeData = ''
            pokeResult.on('data', (chunk: string) => pokeData += chunk)
            pokeResult.on('end', () => resolve(JSON.parse(pokeData)))
        })
        request.end()
    })
}