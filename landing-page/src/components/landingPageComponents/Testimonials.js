import MaxWidthWrapper from '../MaxWidthWrapper';

const testimonials = [
    {
        quote: 'Smooth Moves gave us one place to see every box, receipt, and checklist. We landed in our new home already knowing where the coffee mugs were.',
        name: 'Amelia R.',
        role: 'Early beta family',
        tone: 'sky',
    },
    {
        quote: 'The shared timeline let us onboard eight volunteers without sending a single spreadsheet. MARVIN reminds me what needs attention each morning.',
        name: 'Marcus L.',
        role: 'Community organizer',
        tone: 'indigo',
    },
    {
        quote: 'My relocating clients finally have a branded workspace instead of a folder of PDFs. The QR labels are instant proof that nothing gets lost.',
        name: 'Priya S.',
        role: 'Relocation consultant',
        tone: 'emerald',
    },
    {
        quote: 'Budget alerts caught two duplicate charges in seconds. That alone paid for the time we spent testing the beta.',
        name: 'Logan M.',
        role: 'Small business mover',
        tone: 'amber',
    },
    {
        quote: 'We invited our property manager and the moving crew. Everyone sees the same plan, and feedback goes straight to the team.',
        name: 'Sofia G.',
        role: 'Property manager',
        tone: 'cyan',
    },
    {
        quote: 'I love that the founders are in the Slack channel listening. This roadmap feels like it was built with us, not for us.',
        name: 'Devon K.',
        role: 'Beta advisor',
        tone: 'violet',
    },
];

const toneClass = {
    sky: 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-200',
    indigo: 'border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200',
    amber: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200',
    cyan: 'border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-200',
    violet: 'border-purple-200 bg-purple-50 text-purple-900 dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-200',
};

function getInitials(name) {
    return name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

function Testimonials() {
    return (
        <MaxWidthWrapper>
            <div className='text-center space-y-4 my-16 text-slate-800 dark:text-slate-100' id='testimonials'>
                <h1 className='font-bold text-4xl text-slate-900 dark:text-white'>Voices from the waitlist</h1>
                <h2 className='font-semibold text-xl text-slate-600 dark:text-slate-300'>Families, organizers, and partners shaping Smooth Moves in beta.</h2>
            </div>

            <ul className='mx-auto md:columns-2 lg:columns-3 space-y-4 md:space-y-6 md:gap-6'>
                {testimonials.map((testimonial) => (
                    <li key={testimonial.name} className='break-inside-avoid'>
                        <figure className={`relative h-full w-full max-w-[500px] p-6 rounded-xl border transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-md ${toneClass[testimonial.tone]}`}> 
                            <blockquote className='border-b border-white/70 pb-4 font-semibold text-lg text-slate-800 dark:text-slate-100'>
                                {testimonial.quote}
                            </blockquote>
                            <figcaption>
                                <div className='flex items-center gap-4 mt-4'>
                                    <div className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm'>
                                        {getInitials(testimonial.name)}
                                    </div>
                                    <div className='flex flex-col'>
                                        <p className='font-semibold text-slate-900 dark:text-white'>{testimonial.name}</p>
                                        <p className='text-sm text-slate-600 dark:text-slate-300'>{testimonial.role}</p>
                                    </div>
                                </div>
                            </figcaption>
                        </figure>
                    </li>
                ))}
            </ul>
        </MaxWidthWrapper>
    );
}

export default Testimonials;
