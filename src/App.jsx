import React from 'react'
import "./App.css"
import Weather from "./Component/Weather"
const App = () => {

  

  return (
<>
<header>
<marquee width="100%" direction="left" height="50px" behavior="scroll" scrollamount="3">
        Welcome to Our Website! 🌟 Stay Updated with the Latest Weather updates. 📢 Check Back Often for More Updates!
    </marquee>
</header>
<br />
<br />
    <Weather/>
<footer>

  <h2>Sarthak </h2>
</footer>


  
</>
  )
}

export default App