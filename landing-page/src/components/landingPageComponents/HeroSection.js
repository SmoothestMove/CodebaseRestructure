import Image from "next/image";
import MaxWidthWrapper from '../MaxWidthWrapper'
import { Check, Star } from 'lucide-react';
import WaitlistForm from '../WaitlistForm';

const heroAvatars = [
    { initials: 'AR', color: 'bg-emerald-500' },
    { initials: 'ML', color: 'bg-sky-500' },
    { initials: 'PS', color: 'bg-indigo-500' },
    { initials: 'LM', color: 'bg-orange-500' },
    { initials: 'SG', color: 'bg-rose-500' },
];

const heroPreviews = [
    {
        src: '/assets/Dashboard.png',
        alt: 'Smooth Moves dashboard overview with inventory timeline',
        className: 'relative z-20 w-full max-w-[500px] rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900',
        priority: true,
        sizes: '(min-width: 1024px) 520px, 92vw',
        offsetClass: 'self-end',
    },
    {
        src: '/assets/DashBudget.png',
        alt: 'Smooth Moves budgeting workspace',
        className: 'relative z-10 w-full max-w-[420px] rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900',
        priority: false,
        sizes: '(min-width: 1024px) 420px, 80vw',
        offsetClass: '-mt-20 self-start sm:self-end',
    },
];

function HeroSection() {
    return (
        <section className='bg-slate-50 transition-colors dark:bg-slate-950' id='waitlist'>
            <MaxWidthWrapper className="pt-10 !px-2 lg:!px-10 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:pt-24 lg:pb-20">
                <div className="col-span-1 px-2 lg:px-0">
                    <div className="relative mx-auto flex flex-col items-start text-left">
                        <h1 className="relative w-full max-w-2xl text-balance text-5xl font-bold tracking-tighter text-slate-900 !leading-tight md:text-6xl dark:text-white">
                            Plan, pack, and settle in before the trucks arrive.
                        </h1>

                        <p className="mt-6 max-w-prose text-lg font-semibold text-slate-700 md:text-xl dark:text-slate-200">
                            Smooth Moves brings your move plan, box inventory, budget, and MARVIN AI assistant together so every detail is handled ahead of move day. Join the beta waitlist to help shape launch.
                        </p>

                        <ul className="hidden mt-8 text-left font-medium text-slate-700 md:flex md:flex-col md:items-start">
                            <div className="space-y-2">
                                <li className="flex items-center gap-1.5">
                                    <Check className="h-5 w-5 shrink-0 text-emerald-600" />
                                    Real-time QR box tracking and smart labels
                                </li>
                                <li className="flex items-center gap-1.5">
                                    <Check className="h-5 w-5 shrink-0 text-emerald-600" />
                                    Shared move planner for family and pros
                                </li>
                                <li className="flex items-center gap-1.5">
                                    <Check className="h-5 w-5 shrink-0 text-emerald-600" />
                                    Budget guardrails with instant receipt OCR
                                </li>
                                <li className="flex items-center gap-1.5">
                                    <Check className="h-5 w-5 shrink-0 text-emerald-600" />
                                    MARVIN AI assistant with optional voice commands
                                </li>
                            </div>
                        </ul>

                        <div className='mt-10 w-full max-w-xl'>
                            <WaitlistForm orientation='horizontal' />
                            <p className='mt-3 text-sm text-slate-600 dark:text-slate-300'>Join 1,200+ households preparing their next move with Smooth Moves.</p>
                        </div>

                        <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                            <div className="flex -space-x-3">
                                {heroAvatars.map((avatar) => (
                                    <div
                                        key={avatar.initials}
                                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-slate-200 text-xs font-semibold text-white shadow-sm ${avatar.color}`}
                                        aria-hidden
                                    >
                                        {avatar.initials}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col items-start gap-1 sm:items-start">
                                <div className="flex gap-1">
                                    {Array(5).fill().map((_, i) => (
                                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>

                                <p className='text-sm text-slate-600 dark:text-slate-300'><span className="font-semibold text-slate-900 dark:text-white">Rated 4.9/5</span> by early beta movers</p>
                            </div>
                        </div>

                        <p className='mt-6 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400'>Secured by Firebase - Powered by Google Gemini - Receipt OCR by Mindee - Voice-ready with Picovoice</p>
                    </div>
                </div>

                <div className="col-span-full mt-14 flex items-center justify-center md:mt-16 lg:col-span-1 lg:mt-0">
                    <div className="relative flex w-full max-w-[520px] flex-col items-center justify-center sm:items-end">
                        <div className='absolute -inset-6 rounded-[40px] bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5' aria-hidden />
                        <div className='relative flex w-full flex-col items-center gap-6 lg:gap-8'>
                            {heroPreviews.map((preview) => (
                                <div
                                    key={preview.src}
                                    className={`${preview.className} ${preview.offsetClass ?? ''}`}
                                >
                                    <Image
                                        src={preview.src}
                                        alt={preview.alt}
                                        width={880}
                                        height={640}
                                        sizes={preview.sizes}
                                        className='w-full rounded-2xl'
                                        priority={preview.priority}
                                        quality={90}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </MaxWidthWrapper>
        </section>
    )
}

export default HeroSection


