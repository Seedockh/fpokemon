import * as http from 'http'
import * as fs from 'fs'
import { pokemonRequest } from './request'
import { BinaryFunc, PokemonRequest, IndexResponse, DetailsResponse, 
         Layout, LayoutFunc, IndexView, DetailsView } from './types'
const vash = require('vash')

const pokemonApi = (fPokemonRequest: PokemonRequest) => {
    return async (req: http.IncomingMessage, res: http.ServerResponse): Promise<void> => {
        const index: string = fs.readFileSync('./views/index.vash').toString()
        const url: string = req.url
    
        res.writeHead(200, { 'Content-Type': 'text/html' })
    
        if (url === '/') {
            const pokemonsList = await fPokemonRequest("https://pokeapi.co/api/v2/pokemon") as IndexResponse
            for (let pokemon of pokemonsList.results) {
                const details = await fPokemonRequest(pokemon.url) as DetailsResponse
                pokemon.image = details.sprites.front_default
                pokemon.id = details.id
            }
    
            const view: BinaryFunc<IndexView, LayoutFunc<string>> = vash.compile(index)
            view({ pokemons: pokemonsList.results }, function layout(err: string, lyt: Layout) {
                if (err) console.log(err)
                res.write(lyt.finishLayout())
                res.end();
            })
        }
    
        if (url !== '/' && url !== '/favicon.ico') {
            const pokemonId: string = url.match(/[0-9][0-9]?/gm)[0].toString()
            const pokemonDetails = await fPokemonRequest(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`) as DetailsResponse
            const viewDetails: string = fs.readFileSync('./views/details.vash').toString()
    
            const view: BinaryFunc<DetailsView, LayoutFunc<string>> = vash.compile(viewDetails)
            view({ details: pokemonDetails }, function layout(err, lyt) {
                if (err) console.log(err)
                res.write(lyt.finishLayout());
                res.end();
            })
        }
    }
}

export const api = pokemonApi(pokemonRequest)