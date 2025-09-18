import MaxWidthWrapper from '../MaxWidthWrapper'
import { Check, Star } from 'lucide-react';
import WaitlistForm from '../WaitlistForm';

function HeroSection() {
    return (
        <section className='bg-slate-50' id='waitlist'>
            <MaxWidthWrapper className="pt-10 !px-2 lg:!px-10 lg:grid lg:grid-cols-2 lg:gap-x-0 lg:pt-24 lg:pb-20">
                <div className="col-span-1 px-2 lg:px-0">
                    <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
                        <h1 className="relative w-fit tracking-tighter text-balance font-bold !leading-tight text-gray-900 text-5xl md:text-6xl">
                            Plan, pack, and settle in before the trucks arrive.
                        </h1>

                        <p className="mt-6 text-balance text-lg max-w-prose text-center font-semibold lg:pr-10 md:text-wrap lg:text-left text-slate-700">
                            Smooth Moves brings your move plan, box inventory, budget, and MARVIN AI assistant together so every detail is handled ahead of move day. Join the beta waitlist to help shape launch.
                        </p>

                        <ul className="hidden mt-8 text-left font-medium md:flex flex-col items-center sm:items-start text-slate-700">
                            <div className="space-y-2">
                                <li className="flex gap-1.5 items-center text-left">
                                    <Check className="h-5 w-5 shrink-0 text-emerald-600" />
                                    Real-time QR box tracking and smart labels
                                </li>
                                <li className="flex gap-1.5 items-center text-left">
                                    <Check className="h-5 w-5 shrink-0 text-emerald-600" />
                                    Shared move planner for family and pros
                                </li>
                                <li className="flex gap-1.5 items-center text-left">
                                    <Check className="h-5 w-5 shrink-0 text-emerald-600" />
                                    Budget guardrails with instant receipt OCR
                                </li>
                                <li className="flex gap-1.5 items-center text-left">
                                    <Check className="h-5 w-5 shrink-0 text-emerald-600" />
                                    MARVIN AI assistant with optional voice commands
                                </li>
                            </div>
                        </ul>

                        <div className='mt-10 w-full'>
                            <WaitlistForm orientation='horizontal' />
                            <p className='mt-3 text-sm text-slate-600 text-center lg:text-left'>Join 1,200+ households preparing their next move with Smooth Moves.</p>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row sm:items-start items-center gap-5">
                            <div className="flex -space-x-3">
                                <img src="/users/user-1.png" alt="waitlist mover" className="select-none pointer-events-none inline-block h-10 w-10 rounded-full ring-2 ring-slate-200 bg-white" />
                                <img src="/users/user-2.png" alt="waitlist mover" className="select-none pointer-events-none inline-block h-10 w-10 rounded-full ring-2 ring-slate-200 bg-white" />
                                <img src="/users/user-3.png" alt="waitlist mover" className="select-none pointer-events-none inline-block h-10 w-10 rounded-full ring-2 ring-slate-200 bg-white" />
                                <img src="/users/user-4.png" alt="waitlist mover" className="select-none pointer-events-none inline-block h-10 w-10 rounded-full ring-2 ring-slate-200 bg-white" />
                                <img src="/users/user-5.png" alt="waitlist mover" className="select-none pointer-events-none inline-block h-10 w-10 rounded-full ring-2 ring-slate-200 bg-white" />
                            </div>

                            <div className="flex flex-col justify-between items-center sm:items-start">
                                <div className="flex gap-1">
                                    {Array(5).fill().map((_, i) => (
                                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    ))}
                                </div>

                                <p className='text-sm text-slate-600'><span className="font-semibold text-slate-900">Rated 4.9/5</span> by early beta movers</p>
                            </div>
                        </div>

                        <p className='mt-6 text-xs uppercase tracking-[0.2em] text-slate-500'>Secured by Firebase - Powered by Google Gemini - Receipt OCR by Mindee - Voice-ready with Picovoice</p>
                    </div>
                </div>

                <div className="col-span-full mt-14 md:mt-0 lg:col-span-1">
                    <div className="w-full h-60 lg:h-full rounded-3xl bg-gray-200/80 flex items-center justify-center">
                        <h2 className='text-center text-lg font-bold text-slate-700'>Smooth Moves dashboard preview</h2>
                    </div>
                </div>
            </MaxWidthWrapper>
        </section>
    )
}

export default HeroSection

