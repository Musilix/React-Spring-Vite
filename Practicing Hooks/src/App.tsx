import { useState } from 'react'
import './App.css'
import reactLogo from './assets/react.svg'
import TestingUseEffect from './Components/TestingUseEffect/TestingUseEffect'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <TestingUseEffect details = {{user: "Testy", favoriteCandy: "jolly ranchers"}}></TestingUseEffect>
    </div>
  )
}

export default App
