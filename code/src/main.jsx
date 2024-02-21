import React from 'react'
import ReactDOM from 'react-dom/client'
import Nav from './routes/navigation'
import store from './app/store'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Nav />
  </Provider>
)