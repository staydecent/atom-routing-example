import atom from 'atom'
import h from 'virtual-dom/h'
import vdom from 'virtual-dom'
import main from 'main-loop'


// CONSTS //

let SET_URL = 'SET_URL'


// ACTIONS //

function pushState(url) {
  if (url !== window.location.pathname) {
    window.history.pushState({}, '', url)
  }
}

function setUrl(url) {
  pushState(url)
  return {
    type: SET_URL,
    data: url
  }
}


// STATE //

function reducer(state, action) {
  console.log('reducer', state, action)
  switch (action.type) {
  case SET_URL:
    state.url = action.data
    return state
  default:
    return state
  }
}

let initialState = {
  url: window.location.pathname
}

let store = atom(reducer, initialState)


// RENDER //

function render({url}) {
  let page
  if (url === '/') {
    page = (<h1>Home</h1>)
  } else if (url === '/about') {
    page = (<h1>About</h1>)
  } else {
    page = (<h1>404</h1>)
  } 

  return <div>
    <ul>
      <li><a onclick={click} href="/">Example.com</a></li>
      <li><a onclick={click} href="/about">about</a></li>
    </ul>
    {page}
  </div>

  function click(ev) {
    ev.preventDefault()
    store.dispatch(setUrl(ev.target.getAttribute('href')))
  }
}

let loop = main(store.getState(), render, vdom)

document.body.appendChild(loop.target)
store.subscribe(() => { 
  console.log('update', store.getState())
  loop.update(store.getState()) 
})


