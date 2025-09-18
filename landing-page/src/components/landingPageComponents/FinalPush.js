import WaitlistForm from "../WaitlistForm";

function FinalPush() {
    return (
        <section className='pt-40 pb-32 px-5 bg-gradient-to-b from-white via-sky-50 to-white' id='waitlist-cta'>
            <div className='flex flex-col md:flex-row max-w-5xl mx-auto px-10 py-12 gap-10 bg-gradient-to-br from-sky-200 via-sky-300 to-sky-400 rounded-3xl shadow-lg text-slate-900'>
                <div className="space-y-6 md:w-1/2">
                    <h2 className='relative tracking-tight font-bold text-3xl md:text-4xl'>
                        Take control of move day before the boxes arrive.
                    </h2>

                    <p className='text-lg font-medium leading-relaxed text-slate-800'>
                        Join the Smooth Moves waitlist to receive the Moving Day Command Center preview, weekly progress notes, and first access to MARVIN voice commands. No spam. Unsubscribe anytime.
                    </p>

                    <div className='inline-flex items-center gap-2 rounded-full bg-white/50 px-4 py-2 text-sm font-semibold text-slate-700 backdrop-blur'>
                        <span className='h-2 w-2 rounded-full bg-emerald-500'></span>
                        <span>Invites sent every week</span>
                    </div>
                </div>

                <div className='md:w-1/2 bg-white/80 rounded-2xl p-6 shadow-sm'>
                    <h3 className='text-lg font-semibold text-slate-800 mb-4'>Instant perks when you join:</h3>
                    <ul className='space-y-2 text-sm font-medium text-slate-600 mb-6'>
                        <li>- Moving Day Command Center checklist PDF + Notion template</li>
                        <li>- Beta roadmap updates and feature votes</li>
                        <li>- Access to the private Smooth Moves Slack</li>
                    </ul>
                    <WaitlistForm orientation='vertical' />
                </div>
            </div>
        </section>
    )
}

export default FinalPush

