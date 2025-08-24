import { createContext, useContext, useState, useEffect } from 'react'
import React from 'react'

// TODO: Revisit


export class WsClient {

    WS_API_URL = "wss://ws.agentmail.to/v0?auth_token=fe14c6b65b37a6174abc483730488cbec7edb9a2c1499ed8aecfe42e2e8d96e4" // Better: keep this in backend/env, not frontend
    ws?: WebSocket
    onJSON: (data: any) => void = () => {}

    constructor() {
        if (typeof WebSocket === 'undefined') return

        this.ws = new WebSocket(this.WS_API_URL)

        this.ws.onmessage = (event: MessageEvent) => this.onJSON(JSON.parse(event.data))
    }

    sendJSON(data: any) {
        if (!this.ws) return
        this.ws.send(JSON.stringify(data))
    }

    sendIfOpen(data: any) {
        if (!this.ws) return
        if (this.ws.readyState === WebSocket.OPEN) this.sendJSON(data)
        else this.ws.onopen = () => this.sendJSON(data)
    }

    close() {
        if (!this.ws) return
        this.ws.close()
    }
}

const context = createContext<WsClient | undefined>(undefined)

export const useWsClient = () => useContext(context)

export function WsClientProvider({ children }: { children: React.ReactNode }) {
    const [wsClient, setWsClient] = useState<WsClient>()

    useEffect(() => {
        const conn = new WsClient()
        setWsClient(conn)

        return () => conn.close()
    }, [])

    return <context.Provider value={wsClient}>{children}</context.Provider>
}
