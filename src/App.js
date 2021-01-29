import React from 'react'
import {Route,Switch} from 'react-router-dom'
import Navbar from './Components/Navbar'

// Navbar Exports 
import Home from './Pages/Home'
import About from './Pages/About'
import Contact from './Pages/Contact'
import Gallery from './Pages/Gallery'
import Cart from './Pages/Cart'

class App extends React.Component {
  render(){
    return (
      <div>
        <Navbar/>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/cart" component={Cart}/>
        </Switch>
      </div>
    );
  }
}

export default App;
