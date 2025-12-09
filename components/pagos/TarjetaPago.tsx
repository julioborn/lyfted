"use client"

import { useState } from "react"
import Cards from "react-credit-cards-3"
import "react-credit-cards-3/dist/es/styles-compiled.css"

export default function TarjetaPago({ onSelect }: { onSelect?: () => void }) {
    const [numero, setNumero] = useState("")
    const [nombre, setNombre] = useState("")
    const [vencimiento, setVencimiento] = useState("")
    const [cvc, setCvc] = useState("")
    const [focus, setFocus] = useState<"name" | "number" | "expiry" | "cvc" | undefined>(undefined)

    return (
        <div className="flex flex-col items-center gap-6 mt-6">

            {/* TARJETA ANIMADA */}
            <div className="cursor-pointer" onClick={onSelect}>
                <Cards
                    number={numero}
                    name={nombre}
                    expiry={vencimiento}
                    cvc={cvc}
                    focused={focus}
                />
            </div>

            {/* INPUTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">

                <input
                    type="text"
                    placeholder="Número de tarjeta"
                    className="p-2 border rounded"
                    maxLength={16}
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    onFocus={() => setFocus("number")}
                />

                <input
                    type="text"
                    placeholder="Nombre del titular"
                    className="p-2 border rounded"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    onFocus={() => setFocus("name")}
                />

                <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    className="p-2 border rounded"
                    value={vencimiento}
                    onChange={(e) => setVencimiento(e.target.value)}
                    onFocus={() => setFocus("expiry")}
                />

                <input
                    type="text"
                    placeholder="CVC"
                    maxLength={4}
                    className="p-2 border rounded"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    onFocus={() => setFocus("cvc")}
                />
            </div>
        </div>
    )
}
