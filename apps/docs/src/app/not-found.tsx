import Link from 'next/link'

export default function NotFound() {
  return (
    <main className='flex flex-1'>
      <div className='flex flex-auto flex-col items-center justify-center px-4 text-center sm:flex-row'>
        <h1 className='border-border font-extrabold text-2xl text-foreground tracking-tight sm:mr-6 sm:border-r sm:pr-6 sm:text-3xl'>
          404
        </h1>
        <h2 className='mt-2 text-muted-foreground sm:mt-0'>
          This page could not be found.{' '}
          <Link
            href='/'
            className='text-primary underline underline-offset-4 hover:text-primary/80'
          >
            Go back home
          </Link>
        </h2>
      </div>
    </main>
  )
}
