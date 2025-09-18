import MaxWidthWrapper from '../MaxWidthWrapper'
import { Check, Star, X } from 'lucide-react';

function BeforeAfter() {
    return (
        <section className='bg-white/80' id='why'>
            <MaxWidthWrapper className='pb-10 pt-20'>
                <div className='max-w-3xl mx-auto tracking-tight flex flex-col items-center justify-center gap-5 text-slate-800'>
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

                <div className="flex flex-col gap-10 lg:flex-row lg:max-w-4xl lg:mx-auto items-center justify-center lg:gap-14 my-16 text-slate-700">
                    <div className='flex w-full sm:flex-1 flex-col items-center bg-primary-foreground rounded-2xl shadow-md py-12 px-10'>
                        <ul className="text-left font-medium flex flex-col items-center sm:items-start">
                            <div className="space-y-3 tracking-wide text-lg">
                                <h3 className='font-bold text-slate-900'>Before Smooth Moves</h3>

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

                    <div className='flex w-full sm:flex-1 flex-col items-center bg-emerald-50 rounded-2xl shadow-md py-12 px-10'>
                        <ul className="text-left font-medium flex flex-col items-center sm:items-start">
                            <div className="space-y-3 tracking-wide text-lg">
                                <h3 className='font-bold text-slate-900'>After Smooth Moves</h3>

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

                <div className="max-w-lg mx-auto my-20 flex flex-col items-center sm:items-start text-slate-800">
                    <div className="mx-auto flex items-center justify-center gap-1 mb-4">
                        {Array(5).fill().map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        ))}
                    </div>

                    <div className='text-center font-semibold text-balance text-gray-800'>
                        "Smooth Moves kept our cross-country relocation on rails. The AI nudges alone saved us hours each week."
                    </div>

                    <div className='flex mx-auto items-center justify-center gap-4 my-6'>
                        <img src="/users/john.png" alt="Jasmine beta mover" className="inline-block pointer-events-none object-cover h-12 w-12 rounded-full ring-2 ring-gray-300" />
                        <div className="flex flex-col">
                            <p className='font-semibold text-slate-900'>Jasmine P.</p>
                            <p className='text-sm text-slate-600'>Military family - Beta cohort two</p>
                        </div>
                    </div>
                </div>
            </MaxWidthWrapper>
        </section>
    )
}

export default BeforeAfter

