import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Builder from './pages/Builder'
import Gallery from './pages/Gallery'
import Arena from './pages/Arena'
import MultiChat from './pages/MultiChat'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/arena/:id" element={<Arena />} />
          <Route path="/multi-chat" element={<MultiChat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
