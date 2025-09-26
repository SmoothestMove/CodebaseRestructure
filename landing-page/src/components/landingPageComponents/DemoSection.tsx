import Image from "next/image";

function DemoSection() {
  return (
    <section className="bg-white/80 py-20 transition-colors dark:bg-slate-900/40" id="demo">
      <div className="mx-auto flex w-[90%] max-w-3xl flex-col items-center text-gray-700 dark:text-slate-200">
        <h1 className="text-center text-3xl font-bold text-slate-900 dark:text-white">My name is Jay, the developer and founder of Smooth Moves</h1>
        <div className="relative my-10 h-28 w-28 overflow-hidden rounded-full ring-2 ring-slate-200 dark:ring-slate-700">
          <Image src="/assets/DevCariImage.png" alt="Smooth Moves founder portrait" fill sizes="112px" priority={false} className="object-cover" />
        </div>
        <p className="w-fit max-w-prose text-center text-lg font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          My family and I found ourselves in a situation that forced an impromptu relocation. Unable to afford to hire a moving company and no time to plan a move, I searched for applications that could help us with the move, but found none that met our needs. So, I decided to build one.
        </p>
        <p className="mt-6 w-fit max-w-prose text-center text-lg font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          Smooth Moves focuses on the foundational tools you need to coordinate your relocation confidently. The more we learn from movers like you in the beta, the smarter the platform gets for military families, renters, homeowners, and the professionals supporting them.
        </p>
      </div>
    </section>
  );
}

export default DemoSection;
