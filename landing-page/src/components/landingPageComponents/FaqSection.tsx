"use client";

import { ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question: "Is this just another app I will forget about?",
    answer:
      "The beta is intentionally hands-on. Smooth Moves rolls up your checklists, boxes, receipts, and MARVIN nudges in one place. If something feels like busywork, tell us and we will strip it away.",
  },
  {
    question: "What do I need to join the waitlist?",
    answer:
      "All you need is an email address. Once invited, you will receive onboarding tips, a Moving Day Command Center guide, and a private feedback channel so you are never guessing what to do next.",
  },
  {
    question: "Does the beta work on phones and tablets?",
    answer:
      "Yes. The current build runs smoothly on modern mobile browsers, so you can scan QR codes or receipts from anywhere. Native iOS and Android apps are on the roadmap for late 2025.",
  },
  {
    question: "How is my move data protected?",
    answer:
      "Smooth Moves relies on Firebase Auth, Firestore, and Storage. Everything is encrypted in transit and at rest, and only the collaborators you invite can see your move workspace.",
  },
  {
    question: "Can my family, friends, or contractors collaborate?",
    answer:
      "Absolutely. Invite as many helpers as you need, assign them roles like Owner, Crew, or Viewer, and control what they can edit or just observe.",
  },
  {
    question: "How much does this cost?",
    answer:
      "During the waitlist, every feature is free. Paid tiers will launch once automation and pro workflows are production-ready, and beta participants keep extended access at no charge through launch.",
  },
];

function FaqSection() {
  return (
    <section className="bg-white/80 py-20" id="faq">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
          Need a hand?
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-center text-3xl font-bold text-slate-900 dark:text-white">
          Let us clear up the questions you are probably already asking.
        </p>

        <Accordion className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`faq-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 transition dark:border-slate-700 dark:bg-slate-900/50">
              <AccordionTrigger className="group flex w-full items-center justify-between gap-3 py-4 text-left text-slate-900 dark:text-slate-100">
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-slate-500 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  <span className="ml-3 text-lg font-semibold">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pl-7 pr-4 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default FaqSection;


