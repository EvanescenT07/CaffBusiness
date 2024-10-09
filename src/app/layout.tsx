import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { ModalProvider } from "@/providers/modal-provider";
import './globals.css'

const poppins = Poppins({ subsets: ["latin"], weight: ["100", '200', '300', '400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = {
  title: "Caff Business",
  description: "Manage my business with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${poppins.className}`}>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
