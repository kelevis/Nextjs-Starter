import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "@/app/globals.css";
import {Providers} from "@/app/providers"
import HomeHeader from '@/app/components/HomeHeader'
import {MetamaskProvider} from "@/app/hooks/useMetamask"
import { VerificationProvider } from '@/app/context/VerificationContext';
import RequireVerification from '@/app/components/RequireVerification';
// import {NextUIProvider} from "@nextui-org/react";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Metamask Invoke",
    description: "Generated by create next app",
};

export default function Layout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body>
        <Providers>
        {/*<NextUIProvider>*/}
        {/*    <main className="purple-dark text-foreground bg-background">*/}
                <MetamaskProvider>
                    <HomeHeader></HomeHeader>
                    <VerificationProvider>
                        <RequireVerification>
                        {children}
                        </RequireVerification>
                    </VerificationProvider>

                </MetamaskProvider>
        {/*    </main>*/}
        {/*</NextUIProvider>*/}

        </Providers>


        </body>
        </html>
    );
}
