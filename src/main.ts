import * as http from 'http'
import { api } from './api'

const server = (fApi: http.RequestListener) => {
    return (host: string, port: number) => {
        http.createServer(fApi)
        .listen(port, host, () => console.log(`Server running at http://${host}:${port}`))
    }
}

server(api)('localhost', 3000)