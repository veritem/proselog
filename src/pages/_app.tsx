import "../css/tailwind.css"
import { Provider as UrqlProvider } from "urql"
import { useUrqlClient } from "$src/lib/urql-client"
import { Toaster } from "react-hot-toast"

const App = ({ Component, pageProps }: any) => {
  const urqlClient = useUrqlClient()
  return (
    <UrqlProvider value={urqlClient}>
      <Component {...pageProps} />
      <Toaster />
    </UrqlProvider>
  )
}

export default App
