import { useState } from 'react'
import './App.css'
import { FrappeProvider } from 'frappe-react-sdk'
import Login from './pages/auth/Login'
// src/index.tsx
import "./tailwind.css";  
import Register from './pages/auth/Register'
import Router from './Routes/Route'

function App() {
  const [count, setCount] = useState(0)

  return (
	<div className="App">
	  <FrappeProvider>
		<Router />
	  </FrappeProvider>
	</div>
  )
}

export default App
