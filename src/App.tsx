import { useWeb3Context } from "./hooks/useWeb3Context";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppBar from "./components/AppBar";
import Home from "./pages/Home";
import EIP712 from "./pages/EIP712";
import NotFound from "./pages/NotFound";
import Error from "./pages/Error";

function App() {
  const { account, isLoading, error } = useWeb3Context();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <Error error={error} />;
  if (!account) return <Error error={"No provider or signer found"} />;

  return (<BrowserRouter>
    <AppBar account={account}/>
    <Routes>
      <Route path="/ethereum-utils" element={<Home />} />
      <Route path="/ethereum-utils/eip712" element={<EIP712 />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>);
}

export default App
