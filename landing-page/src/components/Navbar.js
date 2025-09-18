import Link from "next/link"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { Menu } from 'lucide-react'
import { buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'

function Navbar() {
    return (
        <nav className="sticky h-16 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm transition-all">
            <MaxWidthWrapper>
                <div className='flex h-16 items-center justify-between'>
                    <div className='flex items-center justify-center gap-10'>
                        <Link href='/' className='flex z-40 font-bold text-lg tracking-tight text-slate-900'>
                            Smooth Moves
                        </Link>

                        <div className="hidden md:flex items-center justify-center gap-6 lg:gap-10 text-sm font-semibold text-slate-700">
                            <Link href='#features' className='hover:text-slate-900 hover:underline hover:underline-offset-2'>
                                Features
                            </Link>
                            <Link href='#why' className='hover:text-slate-900 hover:underline hover:underline-offset-2'>
                                Why Smooth Moves
                            </Link>
                            <Link href='#demo' className='hover:text-slate-900 hover:underline hover:underline-offset-2'>
                                Preview
                            </Link>
                            <Link href='#faq' className='hover:text-slate-900 hover:underline hover:underline-offset-2'>
                                FAQ
                            </Link>
                        </div>
                    </div>

                    <div className='md:hidden'>
                        <Menu className='h-6 w-6 cursor-pointer text-slate-600' />
                    </div>

                    <div className='hidden md:flex items-center space-x-2 text-sm font-semibold'>
                        <Link href='https://app.smoothmoves.example' className='text-slate-600 hover:text-slate-900 transition'>
                            Log in
                        </Link>
                        <Link href='#waitlist' className={cn(buttonVariants({ size: "sm" }), "flex items-center justify-center px-4")}>Join waitlist</Link>
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default Navbar

