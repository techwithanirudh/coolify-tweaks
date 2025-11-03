import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { baseOptions, linkItems } from '@/lib/layout.shared'

export default function Layout({ children }: LayoutProps<'/'>) {
  const base = baseOptions()

  return (
    <HomeLayout
      {...base}
      links={linkItems}
      style={
        {
          '--spacing-fd-container': '1300px',
        } as object
      }
    >
      {children}
    </HomeLayout>
  )
}