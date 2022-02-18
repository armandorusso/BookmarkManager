import './App.css';
import Header from './components/Header'

function App() {
  // Can only return parent elements. But, you can have child
  // elements in the parent
  
  return (
    <div className="App">
     <Header title={1}/>
    </div>
  );
}

export default App;
