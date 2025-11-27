"use client"

import { createContext, useContext, useState } from "react"

const LoaderContext = createContext({
    loading: false,
    setLoading: (v: boolean) => { }
})

export function LoaderProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(false)

    return (
        <LoaderContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoaderContext.Provider>
    )
}

export const useLoader = () => useContext(LoaderContext)
