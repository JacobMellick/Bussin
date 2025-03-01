import { useState } from 'react'
import CombinedStatusForm from './components/CombinedStatusForm';
import './App.css'

function App() {
  return (
    <div className="app-container">
      <h1>BetterBus Service</h1>
      <div className="forms-container">
        <CombinedStatusForm />
      </div>
    </div>
  )
}

export default App
