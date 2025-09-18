'use client'
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '@/components/ui/accordion';
import { ChevronRight } from 'lucide-react';

const faqs = [
    {
        question: 'When do waitlist invites go out?',
        answer: 'We approve a new cohort of movers every week so we can onboard personally and gather feedback. Join the list and we will email you as soon as your invite unlocks.'
    },
    {
        question: 'Is there a mobile experience?',
        answer: 'Yes! The beta works beautifully on mobile browsers today, and dedicated iOS/Android companions are planned for late 2025. You can snap box QR codes and receipts directly from your phone.'
    },
    {
        question: 'How is our move data protected?',
        answer: 'Smooth Moves is built on Firebase Auth, Firestore, and Storage. Everything is encrypted in transit and at rest, with access limited to invited collaborators on your move.'
    },
    {
        question: 'What does MARVIN actually do?',
        answer: 'MARVIN summarizes move status, reminds you about upcoming tasks, drafts checklists, and (if you enable Picovoice) responds to the wake word for hands-free updates.'
    },
    {
        question: 'Will Smooth Moves stay free?',
        answer: 'During the waitlist the entire workspace is free. Paid tiers launch with automation and enterprise features, but beta members keep extended access at no cost through launch.'
    },
    {
        question: 'Can I invite family or contractors?',
        answer: 'Absolutely. Share access with unlimited collaborators, assign roles like Owner, Crew, or Viewer, and control exactly what they can edit.'
    },
    {
        question: 'How do I share feedback?',
        answer: 'Every invite includes an onboarding call, a private Slack channel, and in-app feedback prompts so you can influence the roadmap.'
    },
];

function FaqSection() {
    return (
        <section className="bg-white/80 py-20" id='faq'>
            <div className="max-w-sm sm:max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-12 capitalize text-slate-900">Frequently asked questions</h1>

                <Accordion
                    className='space-y-4'
                    transition={{ type: 'spring', stiffness: 160, damping: 22 }}
                >
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={faq.question}
                            value={`faq-${index}`}
                            className='bg-slate-100/70 rounded-xl px-6'
                        >
                            <AccordionTrigger className='flex w-full items-center justify-between py-3 text-left text-slate-900'>
                                <div className='flex items-center'>
                                    <ChevronRight className='h-4 w-4 text-slate-600 transition-transform duration-200 group-data-[expanded]:rotate-90' />
                                    <span className='ml-3 text-lg font-semibold'>{faq.question}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className='pl-7 pb-4 text-slate-600 leading-relaxed'>
                                <p>{faq.answer}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
export default FaqSection

