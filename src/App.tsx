import './App.css'
import RuleTyper from './rule/RuleTyper'

function App() {
  return (
    <>
      <form action="#" onSubmit={(e) => {
        e.preventDefault()
        alert('submit')
      }}>
        <RuleTyper/>
      </form>
    </>
  )
}

export default App
