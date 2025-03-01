import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CrowdStatusForm from './components/CrowdStatusForm';
import ArrivalTimeForm from './components/ArrivalTimeForm';
import './App.css'

function App() {
  return (
    <div className="app-container">
      <h1>BetterBus Service</h1>
      <div className="forms-container">
        <CrowdStatusForm />
        <ArrivalTimeForm />
      </div>
    </div>
  )
}

export default App
