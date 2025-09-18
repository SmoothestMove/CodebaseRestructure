import MaxWidthWrapper from '../MaxWidthWrapper'
import Link from 'next/link'

function Footer() {
    return (
        <footer className='border-t border-gray-200 bg-white'>
            <MaxWidthWrapper className='py-14 pb-20 flex flex-col items-center justify-center md:items-start md:justify-between md:flex-row text-slate-700'>
                <div className='max-w-[18rem] flex flex-col space-y-4 items-center justify-center md:items-start md:justify-normal text-center md:text-left'>
                    <Link href='/' className='flex items-center z-40 font-bold text-lg text-slate-900'>
                        Smooth Moves
                    </Link>

                    <p className='md:text-[0.95rem] font-medium'>
                        The collaborative move command center for households, organizers, and relocation teams.
                    </p>

                    <small className='mb-2 block text-slate-500 select-none'>
                        Smooth Moves &copy; {new Date().getFullYear()} - All rights reserved
                    </small>
                </div>

                <div className='flex flex-col md:flex-row gap-10 md:gap-20 mt-10 md:mt-0 text-sm font-semibold'>
                    <div className='flex flex-col items-center md:items-start px-4 text-slate-600'>
                        <h3 className='font-semibold text-slate-400 mb-2 uppercase tracking-wide text-xs'>Explore</h3>
                        <ul className='space-y-2 text-center md:text-left'>
                            <li className='hover:underline hover:underline-offset-2'>
                                <Link href='#features'>Features</Link>
                            </li>
                            <li className='hover:underline hover:underline-offset-2'>
                                <Link href='#pricing'>Pricing</Link>
                            </li>
                            <li className='hover:underline hover:underline-offset-2'>
                                <Link href='#faq'>FAQ</Link>
                            </li>
                        </ul>
                    </div>

                    <div className='flex flex-col items-center md:items-start px-4 text-slate-600'>
                        <h3 className='font-semibold text-slate-400 mb-2 uppercase tracking-wide text-xs'>Company</h3>
                        <ul className='space-y-2 text-center md:text-left'>
                            <li className='hover:underline hover:underline-offset-2'>
                                <Link href='#demo'>About</Link>
                            </li>
                            <li className='hover:underline hover:underline-offset-2'>
                                <a href='mailto:hello@smoothmoves.app'>Contact</a>
                            </li>
                            <li className='hover:underline hover:underline-offset-2'>
                                <Link href='https://www.linkedin.com/company/smoothmoves' target='_blank' rel='noopener noreferrer'>LinkedIn</Link>
                            </li>
                        </ul>
                    </div>

                    <div className='flex flex-col items-center md:items-start px-4 text-slate-600'>
                        <h3 className='font-semibold text-slate-400 mb-2 uppercase tracking-wide text-xs'>Legal</h3>
                        <ul className='space-y-2 text-center md:text-left'>
                            <li className='hover:underline hover:underline-offset-2'>
                                <Link href='/'>Privacy Policy</Link>
                            </li>
                            <li className='hover:underline hover:underline-offset-2'>
                                <Link href='/'>Terms of Service</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </MaxWidthWrapper>
        </footer>
    )
}

export default Footer

