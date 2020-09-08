import * as http from 'http'
import * as https from 'https'
import * as fs from 'fs'
// Frontend template engine
const vash = require('vash')

// Views
const index = fs.readFileSync('./views/index.vash').toString()
const details = fs.readFileSync('./views/details.vash').toString()

type ListPokemon = { name: string, url: string }

const host = 'localhost'
const port = 3000

const getDetails = async (url: string) => {
    return new Promise((resolve, reject) => {
        const request = https.get(url, pokeResult => {
            let pokeData = ''
            pokeResult.on('data', chunk => pokeData += chunk)
            pokeResult.on('end', () => resolve(JSON.parse(pokeData)))
        })
        request.end()
    })
}

http.createServer(async (req,res) => {
    const url = req.url
    res.writeHead(200, { 'Content-Type': 'text/html' })

    if (url === '/') {
        const allPokemons = https.get("https://pokeapi.co/api/v2/pokemon", result => {
            let data = ''
            result.on('data', chunk => data += chunk)
            result.on('end', async () => {
                let apiData = JSON.parse(data)
                for (let pokemon of apiData.results) {
                    const details: any = await getDetails(pokemon.url)
                    pokemon.image = details.sprites.front_default
                    pokemon.id = details.id
                }

                const view = vash.compile(index)
                view({ pokemons: apiData.results }, function layout(err, lyt) {
                    res.write(lyt.finishLayout());
                    res.end();
                })
            })
        })
    }

    if (url !== '/' && url !== '/favicon.ico') {
        const pokemonId = url.match(/[0-9][0-9]?/gm)[0].toString()
        const pokemonDetails: any = await getDetails(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)

        const view = vash.compile(details)
        view({ details: pokemonDetails }, function layout(err, lyt) {
            res.write(lyt.finishLayout());
            res.end();
        })
    }
}).listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`)
})