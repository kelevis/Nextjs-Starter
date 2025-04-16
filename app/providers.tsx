// app/providers.tsx
'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from 'next-themes'
import { useEffect, useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {



        return null // 在客户端加载完成前，避免渲染
    }


    return (
        <NextUIProvider>
            <ThemeProvider attribute="class" themes={['light', 'dark', 'purple-dark']}>
                {children}
            </ThemeProvider>
        </NextUIProvider>
    )
}