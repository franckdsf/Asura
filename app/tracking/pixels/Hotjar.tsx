import { useEffect } from "react"
import { hotjar } from "react-hotjar"

export const Hotjar = ({ hjid, hjsv }: { hjid: number, hjsv: number }) => {
  useEffect(() => {
    hotjar.initialize(hjid, hjsv)
  }, [hjid, hjsv])

  return null;
}