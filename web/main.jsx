const React = require('react')
const ReactDOM = require('react-dom')

class Application extends React.Component {
  render() {
    return <div><h1>Hello World!</h1></div>
  }
}

ReactDOM.render(<Application />, document.getElementById('application'))
