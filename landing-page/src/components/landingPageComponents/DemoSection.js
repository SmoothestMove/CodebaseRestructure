import { ChevronDown } from 'lucide-react';

function DemoSection() {
    return (
        <section className='bg-white/80 py-20' id='demo'>
            <div className="w-[90%] sm:max-w-2xl lg:max-w-3xl mx-auto flex flex-col items-center text-gray-700">
                <h1 className='font-bold text-3xl text-center text-slate-900'>My name is, Jay. The developer and founder of Smooth Moves</h1>
                <img src="/users/john.png" alt="Smooth Moves founder" className="inline-block pointer-events-none h-24 w-24 rounded-full my-10 ring-2 ring-slate-200" />
                <p className='max-w-prose w-fit text-center font-semibold leading-relaxed text-slate-600'>
                    My family and I found ourselves in a situation that forced an inpromptu relocation. Unable to afford to hire a moving company and no time to plan a move, I searched
                    for applications that could help us with the move, but found none that met our needs. So, I decided to build one.
                </p>

                <div className='my-20 scroll-mt-28 w-full'>
                    <div className='w-full lg:w-4/5 lg:mx-auto h-72 lg:h-96 shadow-md bg-gray-200 rounded-xl flex items-center justify-center border border-slate-100'>
                        <h2 className="font-bold text-xl text-slate-700 text-center px-6">
                            Smooth Moves beta dashboard sneak peek
                        </h2>
                    </div>
                </div>

                <div className='flex items-center justify-center mb-4'>
                    <ChevronDown className='animate-bounce w-10 h-10 text-slate-500' />
                </div>

                <a href='#waitlist' className='font-medium text-center text-2xl text-slate-700 hover:text-slate-900 transition'>
                    Request your invite
                </a>
            </div>
        </section>
    )
}

export default DemoSection

