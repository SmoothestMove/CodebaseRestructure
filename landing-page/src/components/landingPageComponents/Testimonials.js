import MaxWidthWrapper from '../MaxWidthWrapper';

const testimonials = [
    {
        quote: 'Smooth Moves gave us one place to see every box, receipt, and checklist. We landed in our new home already knowing where the coffee mugs were.',
        name: 'Amelia R.',
        role: 'Early beta family',
        avatar: '/users/avatar_default_1.png',
        tone: 'sky',
    },
    {
        quote: 'The shared timeline let us onboard eight volunteers without sending a single spreadsheet. MARVIN reminds me what needs attention each morning.',
        name: 'Marcus L.',
        role: 'Community organizer',
        avatar: '/users/avatar_default_2.webp',
        tone: 'indigo',
    },
    {
        quote: 'My relocating clients finally have a branded workspace instead of a folder of PDFs. The QR labels are instant proof that nothing gets lost.',
        name: 'Priya S.',
        role: 'Relocation consultant',
        avatar: '/users/avatar_default_3.png',
        tone: 'emerald',
    },
    {
        quote: 'Budget alerts caught two duplicate charges in seconds. That alone paid for the time we spent testing the beta.',
        name: 'Logan M.',
        role: 'Small business mover',
        avatar: '/users/avatar_default_4.webp',
        tone: 'amber',
    },
    {
        quote: 'We invited our property manager and the moving crew. Everyone sees the same plan, and feedback goes straight to the team.',
        name: 'Sofia G.',
        role: 'Property manager',
        avatar: '/users/avatar_default_5.webp',
        tone: 'cyan',
    },
    {
        quote: 'I love that the founders are in the Slack channel listening. This roadmap feels like it was built with us, not for us.',
        name: 'Devon K.',
        role: 'Beta advisor',
        avatar: '/users/avatar_default_6.webp',
        tone: 'violet',
    },
];

const toneClass = {
    sky: 'border-sky-200 bg-sky-50',
    indigo: 'border-indigo-200 bg-indigo-50',
    emerald: 'border-emerald-200 bg-emerald-50',
    amber: 'border-amber-200 bg-amber-50',
    cyan: 'border-cyan-200 bg-cyan-50',
    violet: 'border-purple-200 bg-purple-50',
};

function Testimonials() {
    return (
        <MaxWidthWrapper>
            <div className='text-center space-y-4 my-16 text-slate-800' id='testimonials'>
                <h1 className='font-bold text-4xl text-slate-900'>Voices from the waitlist</h1>
                <h2 className='font-semibold text-xl text-slate-600'>Families, organizers, and partners shaping Smooth Moves in beta.</h2>
            </div>

            <ul className='mx-auto md:columns-2 lg:columns-3 space-y-4 md:space-y-6 md:gap-6'>
                {testimonials.map((testimonial) => (
                    <li key={testimonial.name} className='break-inside-avoid'>
                        <figure className={`relative h-full w-full max-w-[500px] p-6 rounded-xl border ${toneClass[testimonial.tone]} transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-md`}>
                            <blockquote className='border-b border-white/70 pb-4 font-semibold text-lg text-slate-800'>
                                {testimonial.quote}
                            </blockquote>
                            <figcaption>
                                <div className='flex items-center gap-4 mt-4'>
                                    <img src={testimonial.avatar} alt={testimonial.name} className="inline-block shrink-0 pointer-events-none h-12 w-12 rounded-full ring-2 ring-white/80" />
                                    <div className="flex flex-col">
                                        <p className='font-semibold text-slate-900'>{testimonial.name}</p>
                                        <p className='text-sm text-slate-600'>{testimonial.role}</p>
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

