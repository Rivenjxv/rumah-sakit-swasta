import { Providers } from './providers'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}