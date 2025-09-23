import MaxWidthWrapper from '../MaxWidthWrapper'
import { Check, Star, X } from 'lucide-react';

function BeforeAfter() {
    return (
        <section className='bg-white/80 transition-colors dark:bg-slate-950/50' id='why'>
            <MaxWidthWrapper className='pb-10 pt-20'>
                <div className='max-w-3xl mx-auto tracking-tight flex flex-col items-center justify-center gap-5 text-slate-800 dark:text-slate-100'>
                    <div className="flex items-center justify-center gap-1.5">
                        <X className='w-8 h-8 sm:w-6 sm:h-6 text-rose-600' />
                        <h2 className='font-bold text-xl md:text-3xl text-center'>
                            Still juggling spreadsheets, texts, and sticky notes?
                        </h2>
                    </div>

                    <div className="flex items-center justify-center gap-1.5">
                        <Check className='w-8 h-8 sm:w-6 sm:h-6 text-emerald-600' />
                        <h2 className='font-bold text-xl md:text-3xl text-center text-balance'>
                            Smooth Moves keeps every detail in one guided workspace.
                        </h2>
                    </div>
                </div>

                <div className="flex flex-col gap-10 lg:flex-row lg:max-w-4xl lg:mx-auto items-center justify-center lg:gap-14 my-16 text-slate-700 dark:text-slate-200">
                    <div className='flex w-full sm:flex-1 flex-col items-center bg-white/90 dark:bg-slate-900 rounded-2xl shadow-md py-12 px-10'>
                        <ul className="text-left font-medium flex flex-col items-center sm:items-start">
                            <div className="space-y-3 tracking-wide text-lg">
                                <h3 className='font-bold text-slate-900 dark:text-white'>Before Smooth Moves</h3>

                                <li className="flex gap-1.5 items-center text-left">
                                    <X className="h-4 w-4 shrink-0 text-rose-500" />
                                    Group chats and sticky notes everywhere
                                </li>
                                <li className="flex gap-1.5 items-center text-left">
                                    <X className="h-4 w-4 shrink-0 text-rose-500" />
                                    No idea which box holds day-one essentials
                                </li>
                                <li className="flex gap-1.5 items-center text-left">
                                    <X className="h-4 w-4 shrink-0 text-rose-500" />
                                    Receipts disappear before you can log them
                                </li>
                                <li className="flex gap-1.5 items-center text-left">
                                    <X className="h-4 w-4 shrink-0 text-rose-500" />
                                    Tasks slip until you're loading the truck
                                </li>
                            </div>
                        </ul>
                    </div>

                    <div className='flex w-full sm:flex-1 flex-col items-center bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl shadow-md py-12 px-10'>
                        <ul className="text-left font-medium flex flex-col items-center sm:items-start">
                            <div className="space-y-3 tracking-wide text-lg">
                                <h3 className='font-bold text-slate-900 dark:text-white'>After Smooth Moves</h3>

                                <li className="flex gap-1.5 items-center text-left">
                                    <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                                    Shared timeline keeps family and pros aligned
                                </li>
                                <li className="flex gap-1.5 items-center text-left">
                                    <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                                    QR labels tell you what's inside without opening
                                </li>
                                <li className="flex gap-1.5 items-center text-left">
                                    <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                                    Budget updates the second you scan a receipt
                                </li>
                                <li className="flex gap-1.5 items-center text-left">
                                    <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                                    MARVIN surfaces next steps before deadlines hit
                                </li>
                            </div>
                        </ul>
                    </div>
                </div>

                <div className="max-w-lg mx-auto my-20 flex flex-col items-center sm:items-start text-slate-800 dark:text-slate-100">
                    <div className="mx-auto flex items-center justify-center gap-1 mb-4">
                        {Array(5).fill().map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        ))}
                    </div>

                    <div className='text-center font-semibold text-balance text-gray-800 dark:text-slate-100'>
                        "Smooth Moves kept our cross-country relocation on rails. The AI nudges alone saved us hours each week."
                    </div>

                    <div className='flex mx-auto items-center justify-center gap-4 my-6'>
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/100 text-sm font-semibold text-white ring-2 ring-gray-300">JP</div>
                        <div className="flex flex-col">
                            <p className='font-semibold text-slate-900 dark:text-white'>Jasmine P.</p>
                            <p className='text-sm text-slate-600 dark:text-slate-300'>Military family - Beta cohort two</p>
                        </div>
                    </div>
                </div>
            </MaxWidthWrapper>
        </section>
    )
}

export default BeforeAfter

