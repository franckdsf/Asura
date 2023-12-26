import { useState } from "react";
import { Icon } from "../atoms"
import { STORE } from "~/store.info";

export const Newsletter = () => {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <section className="overflow-hidden">
      <div className="text-center">
        <h3 className="max-sm:hidden text-2xl md:text-4xl xl:text-7xl uppercase font-accent -ml-[50vw]">devenez</h3>
        <h3 className="my-5 text-2xl uppercase max-sm:hidden md:text-4xl xl:text-7xl font-accent">un membre {STORE.name}</h3>
        <h3 className="max-sm:hidden text-2xl md:text-4xl xl:text-7xl uppercase font-accent ml-[30vw]">aujourd’hui!</h3>
        <h3 className="sm:hidden text-2xl md:text-4xl xl:text-7xl uppercase font-accent -ml-[40vw]">devenez</h3>
        <h3 className="my-5 text-2xl uppercase sm:hidden md:text-4xl xl:text-7xl font-accent">membre</h3>
        <h3 className="sm:hidden text-2xl md:text-4xl xl:text-7xl uppercase font-accent ml-[30vw]">{STORE.name} !</h3>
      </div>
      <p className="relative max-w-xs my-16 text-lg max-sm:left-4 sm:left-1/2 sm:my-24">
        Inscrivez vous à notre newsletter et retrouvez toutes nos offres promotionnelles et derniers produits.
      </p>
      <form className="relative w-full pb-4 ml-4 border-b max-sm:max-w-xs sm:inset-center flex-row-center sm:left-1/3 sm:pb-6 border-neutral-900"
        onSubmit={(e) => {
          e.preventDefault();

          if (email.length < 3) return;

          setEmail('');
          setSent(true);
        }}
      >
        <input className="w-full max-w-2xl m-0 mr-8 border-none" placeholder="E-mail" value={email} onInput={(e: any) => setEmail(e.target.value)} />
        {!sent && <button type="submit" className="p-3 text-white bg-black rounded-full" aria-label="sign up newsletter">
          <Icon.ArrowRight className="icon-sm sm:icon-lg" />
        </button>}
        {sent && <button type="submit" disabled className="p-3 text-white rounded-full bg-neutral-600" aria-label="sign up newsletter">
          <Icon.Check className="icon-sm sm:icon-lg" />
        </button>}
      </form>
    </section>
  )
}