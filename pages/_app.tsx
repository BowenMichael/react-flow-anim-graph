import '../styles/globals.css'
import type { AppProps } from 'next/app'

import 'reactflow/dist/base.css';

import '../tailwind.config';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
