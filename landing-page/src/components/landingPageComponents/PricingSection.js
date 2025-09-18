'use client'
import { Building2, CircleCheck } from "lucide-react"
import MaxWidthWrapper from "../MaxWidthWrapper"
import Link from "next/link"

function PricingSection() {
    return (
        <section className="bg-[#F8F9FA]" id="pricing">
            <MaxWidthWrapper className='py-20'>
                <div className="flex flex-col items-center justify-center text-center text-slate-700">
                    <div className="bg-slate-200 rounded-full px-4 py-2">
                        <p className='text-slate-700 text-xs font-semibold tracking-[0.3em]'>WAITLIST</p>
                    </div>

                    <div className="max-w-2xl mt-4 space-y-3">
                        <h2 className='text-3xl md:text-4xl font-bold text-slate-900'>Early access is free while we finish the beta.</h2>
                        <p className="text-[#4F5D6D] text-lg font-medium">
                            Claim your spot now and lock in extended access to Smooth Moves. Paid plans roll out once the core move workflows are production ready.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-7 my-4 md:my-12 text-[#293A51]">
                    <div className="bg-white p-8 rounded-xl shadow-sm mt-10 border border-slate-100 flex flex-col h-full">
                        <h3 className='text-2xl font-bold mb-4 text-center text-slate-900'>Beta Pass</h3>

                        <p className='font-bold mb-6 text-center text-slate-700'>
                            <span className='text-6xl'>$0 </span><span className='text-xs text-[#6B7989]'>/ during waitlist</span>
                        </p>

                        <p className="text-center font-semibold text-[#4F5D6D]">
                            Everything you need to orchestrate a personal move while we're in beta.
                        </p>

                        <div className="bg-[#F1F4F8] w-full py-2 rounded-full flex items-center justify-center font-medium my-4 text-xs uppercase tracking-wide text-[#4F5D6D]">
                            Instant invite once selected
                        </div>

                        <div className="px-6">
                            <Link href='#waitlist'
                                className='flex items-center justify-center cursor-pointer border-2 border-slate-900 px-5 py-[0.45rem] rounded-full font-semibold text-slate-900 transition-colors duration-200 ease-out hover:bg-slate-900 hover:text-white'
                            >
                                Join the waitlist
                            </Link>
                        </div>

                        <p className="font-medium mt-6 mb-4 text-slate-700">
                            Included in beta
                        </p>

                        <ul className="text-left text-[#4F5D6D] font-medium space-y-3">
                            <li className="flex gap-1.5 items-center text-left">
                                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white" />
                                Unlimited planner timelines
                            </li>
                            <li className="flex gap-1.5 items-center text-left">
                                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white" />
                                QR box tracking & printable labels
                            </li>
                            <li className="flex gap-1.5 items-center text-left">
                                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white" />
                                Budget dashboard + receipt OCR
                            </li>
                            <li className="flex gap-1.5 items-center text-left">
                                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white" />
                                MARVIN AI assistant & voice preview
                            </li>
                        </ul>
                    </div>

                    <div className="relative bg-white p-4 md:p-8 rounded-xl shadow-md border-2 md:border-4 border-slate-900 flex flex-col h-full">
                        <div className="absolute top-[-1rem] left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Coming soon
                        </div>
                        <h3 className='text-2xl font-bold mb-4 text-center text-slate-900'>Pro</h3>

                        <p className='font-bold mb-6 text-center text-slate-700'>
                            <span className='text-4xl'>Pricing TBD</span><span className='text-xs text-[#6B7989]'> / post-launch</span>
                        </p>

                        <p className="text-center font-semibold text-slate-700">
                            Advanced automations for frequent movers, contractors, and relocation pros.
                        </p>

                        <div className="bg-[#F1F4F8] w-full py-2 rounded-full flex items-center justify-center font-medium my-4 text-xs uppercase tracking-wide text-[#4F5D6D]">
                            Priority invite when plans launch
                        </div>

                        <div className="px-6 mb-6">
                            <Link
                                href='#waitlist'
                                className='flex items-center justify-center cursor-pointer border-2 border-slate-900 px-5 py-[0.45rem] rounded-full font-semibold text-slate-900 transition-colors duration-200 ease-out hover:bg-slate-900 hover:text-white'
                            >
                                Reserve my spot
                            </Link>
                        </div>

                        <p className="font-medium mb-4 text-slate-700">
                            Planned upgrades
                        </p>

                        <ul className="text-left text-[#4F5D6D] font-medium space-y-3">
                            <li className="flex gap-1.5 items-center text-left">
                                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white" />
                                Automation rules & templates by move type
                            </li>
                            <li className="flex gap-1.5 items-center text-left">
                                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white" />
                                Unlimited collaborators and roles
                            </li>
                            <li className="flex gap-1.5 items-center text-left">
                                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white" />
                                Integrations with storage & moving partners
                            </li>
                            <li className="flex gap-1.5 items-center text-left">
                                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white" />
                                Deeper analytics & export tools
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-sm mt-10 border border-slate-100 flex flex-col h-full">
                        <h3 className='text-2xl font-bold text-center text-slate-900'>Team</h3>
                        <div className="bg-[#F1F4F8] rounded-full w-20 h-20 flex items-center justify-center mx-auto my-7">
                            <Building2 className="h-8 w-8 text-[#6B7989]" />
                        </div>

                        <p className="text-center font-semibold text-[#4F5D6D]">
                            Tailor Smooth Moves to large crews, multiple properties, and enterprise security needs.
                        </p>

                        <div className="bg-[#F1F4F8] w-full py-2 px-6 rounded-full flex items-center justify-center font-medium my-4 text-xs uppercase tracking-wide text-[#4F5D6D] text-center">
                            Accepting design partners for 2026 rollout
                        </div>

                        <div className="px-6">
                            <Link
                                href='mailto:hello@smoothmoves.app'
                                className='flex items-center justify-center cursor-pointer border-2 border-slate-900 px-5 py-[0.45rem] rounded-full font-semibold text-slate-900 transition-colors duration-200 ease-out hover:bg-slate-900 hover:text-white'
                            >
                                Talk to us
                            </Link>
                        </div>

                        <p className="font-medium mt-6 mb-4 text-slate-700">
                            Exploring with partners
                        </p>

                        <ul className="text-left text-[#4F5D6D] font-medium space-y-3">
                            <li className="flex gap-1.5 items-center text-left">
                                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white" />
                                SSO + granular permissioning
                            </li>
                            <li className="flex gap-1.5 items-center text-left">
                                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white" />
                                Multi-location dashboards
                            </li>
                            <li className="flex gap-1.5 items-center text-left">
                                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white" />
                                Dedicated success manager
                            </li>
                            <li className="flex gap-1.5 items-center text-left">
                                <CircleCheck className="h-5 w-5 shrink-0 fill-[#39BAF6] text-white" />
                                API access & custom workflows
                            </li>
                        </ul>
                    </div>
                </div>
            </MaxWidthWrapper>
        </section>
    )
}

export default PricingSection

