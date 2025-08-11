"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { providers, Contract } from "ethers"
// import WLDABI from "@/abis/WLD.json" // Descomenta y pon la ruta correcta a tu ABI

interface UserCounterContextType {
  userCount: number
  incrementUserCount: () => void
  decrementUserCount: () => void
}

const UserCounterContext = createContext<UserCounterContextType | undefined>(undefined)

interface UserCounterProviderProps {
  children: ReactNode
}

export function UserCounterProvider({ children }: UserCounterProviderProps) {
  const [userCount, setUserCount] = useState(0)
  const provider = new providers.JsonRpcProvider("https://worldchain-mainnet.g.alchemy.com/public")
  const WLD_TOKEN_ADDRESS = "0x2cFc85d8E48F8EAB294be644d9E25C3030863003"

  useEffect(() => {
    setUserCount(Math.floor(Math.random() * 150) + 50)

    const interval = setInterval(() => {
      setUserCount((prev) => {
        const change = Math.floor(Math.random() * 5) - 2
        const newCount = Math.max(10, prev + change)
        return newCount
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Ejemplo de función para leer datos de un contrato
  const readContractData = async (contractAddress: string, abi: any) => {
    try {
      const contract = new Contract(contractAddress, abi, provider)
      return contract
    } catch (error) {
      console.error(`Error reading contract:`, error)
      return null
    }
  }

  const incrementUserCount = () => setUserCount((prev) => prev + 1)
  const decrementUserCount = () => setUserCount((prev) => Math.max(0, prev - 1))

  return (
    <UserCounterContext.Provider value={{ userCount, incrementUserCount, decrementUserCount }}>
      {children}
    </UserCounterContext.Provider>
  )
}

export function useUserCounter() {
  const context = useContext(UserCounterContext)
  if (context === undefined) {
    throw new Error("useUserCounter debe usarse dentro de un UserCounterProvider")
  }
  return context
}
