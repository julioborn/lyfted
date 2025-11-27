"use client"

import { SessionProvider, useSession } from "next-auth/react"
import LoaderGlobal from "@/components/LoaderGlobal"

function SessionGate({ children }: { children: React.ReactNode }) {
    const { status } = useSession()

    if (status === "loading") {
        return <LoaderGlobal />
    }

    return <>{children}</>
}

export default function SessionProviderWrapper({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SessionProvider>
            <SessionGate>
                {children}
            </SessionGate>
        </SessionProvider>
    )
}
