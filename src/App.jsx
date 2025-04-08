import Dashboard from '../pages/Dashboard';
import Landing from '../pages/Landing';
import { Route, Routes } from 'react-router-dom';
function App() {

  return (
   <>
   <Routes>
   <Route path="/" element={<Landing />} />
   <Route path="/dashboard" element={<Dashboard />} />
   </Routes>

   </>
  )
}

export default App
