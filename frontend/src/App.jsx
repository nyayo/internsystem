import { Routes, Route} from 'react-router';
import LoginPage from './pages/login/LoginPage';


function App() {
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage/>} />


      </Routes>
 
    </div>
  )
}

export default App
