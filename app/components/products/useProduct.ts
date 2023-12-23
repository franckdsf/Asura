import { atom, useAtom } from "jotai";


const productIdAtom = atom<string | null>(null);
const floatingATCAtom = atom<boolean>(false);
const hasVariantsAtom = atom<boolean>(false);

export const useProduct = () => {
  const [productId, setProductId] = useAtom(productIdAtom);
  const [floatingATC, setFloatingATC] = useAtom(floatingATCAtom);
  const [hasVariants, setHasVariants] = useAtom(hasVariantsAtom);

  return {
    hasVariants,
    productId,
    floatingATC,
    setProductId,
    setFloatingATC,
    setHasVariants
  }
}