import { useState } from "react";
import { Icon } from "../atoms"

export const Newsletter = () => {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <section className="overflow-hidden">
      <div className="text-center">
        <h3 className="max-sm:hidden text-2xl md:text-4xl xl:text-7xl uppercase font-accent -ml-[50vw]">devenez</h3>
        <h3 className="max-sm:hidden text-2xl md:text-4xl xl:text-7xl uppercase font-accent my-5">un membre asura</h3>
        <h3 className="max-sm:hidden text-2xl md:text-4xl xl:text-7xl uppercase font-accent ml-[30vw]">aujourd’hui!</h3>
        <h3 className="sm:hidden text-2xl md:text-4xl xl:text-7xl uppercase font-accent -ml-[40vw]">devenez</h3>
        <h3 className="sm:hidden text-2xl md:text-4xl xl:text-7xl uppercase font-accent my-5">membre</h3>
        <h3 className="sm:hidden text-2xl md:text-4xl xl:text-7xl uppercase font-accent ml-[30vw]">asura !</h3>
      </div>
      <p className="max-w-xs text-lg max-sm:left-4 sm:left-1/2 relative my-16 sm:my-24">
        Inscrivez vous à notre newsletter et retrouvez toutes nos offres promotionnelles et derniers produits.
      </p>
      <form className="max-sm:max-w-xs ml-4 w-full relative sm:inset-center flex-row-center sm:left-1/3 pb-4 sm:pb-6 border-b border-neutral-900"
        onSubmit={(e) => {
          e.preventDefault();

          if (email.length < 3) return;

          setEmail('');
          setSent(true);
        }}
      >
        <input className="m-0 w-full max-w-2xl border-none mr-8" placeholder="E-mail" value={email} onInput={(e: any) => setEmail(e.target.value)} />
        {!sent && <button type="submit" className="bg-black text-white rounded-full p-3"><Icon.ArrowRight className="icon-sm sm:icon-lg" /></button>}
        {sent && <button type="submit" disabled className="bg-neutral-600 text-white rounded-full p-3"><Icon.Check className="icon-sm sm:icon-lg" /></button>}
      </form>
    </section>
  )
}