import { useEffect, useState } from "react";

type StorageItem = { id: string, quantity: number, last_update: Date };
type Props = { className?: string; id: string }

export const ItemsLeft = ({ className, id }: Props) => {
  const [itemsLeft, setItemsLeft] = useState<number | null>(null);

  useEffect(() => {
    const STORAGE_KEY = "products-quantity";
    let storage: string | null | Array<StorageItem> = localStorage.getItem(STORAGE_KEY);

    const createRandomQuantity = () => {
      const randomAmount = Math.floor(Math.random() * 6) + 7;

      return {
        "id": id,
        "quantity": randomAmount,
        "last_update": new Date()
      }
    }

    if (!storage) {
      storage = [createRandomQuantity()];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
    } else {
      storage = JSON.parse(storage) as Array<StorageItem>;
    }

    const storedElement = storage.find((obj) => obj.id === id);
    const element = storedElement ? storedElement : createRandomQuantity();

    if (!storedElement) {
      storage = [...storage, element];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    }

    setTimeout(() => setItemsLeft(element.quantity), 300)

  }, [id])

  return (
    <div className={`${className}`}>
      <p className="mb-2 text-xs font-medium uppercase">
        {itemsLeft ?
          `${itemsLeft} articles en promotion restant${itemsLeft > 0 ? 's' : ''}` :
          'Recupération des articles en promotion'}
      </p>
      <div className="w-5/6 h-2 max-w-sm overflow-hidden bg-container-light rounded-xs">
        <div className="w-full h-full transition-all duration-1000 bg-primary-500"
          style={{ width: itemsLeft ? `${2 + itemsLeft}%` : undefined }}
        />
      </div>
    </div>
  )
}