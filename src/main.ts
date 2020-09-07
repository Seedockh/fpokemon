import * as http from 'http'
import * as https from 'https'
import * as fs from 'fs'
// Frontend template engine
const vash = require('vash')

const host = 'localhost'
const port = 3000

http.createServer((req,res) => {
    const url = req.url
    res.writeHead(200, { 'Content-Type': 'text/html' })

    if (url === '/') {
        https.get("https://pokeapi.co/api/v2/pokemon", result => {
            let data = ''
            result.on('data', chunk => data += chunk)
            result.on('end', () => {
                const apiData = JSON.parse(data)
                const file = fs.readFileSync('./public/index.vash').toString()
                const view = vash.compile(file)

                res.end(view({ pokemons: apiData.results }))
            })
        })
    }
}).listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`)
})