import { atom, useAtom } from 'jotai'
import { useEffect } from 'react';

const shopIdAtom = atom<string | null>(null);

export const useShopId = (id?: string) => {
  const [value, setValue] = useAtom(shopIdAtom);

  useEffect(() => {
    if (id !== undefined) setValue(id);
  }, [id, setValue])

  return value;
}