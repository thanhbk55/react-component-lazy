import React, {Component} from 'react'

class ErrorComponent extends Component {
  render(){
    return null
  }
}

function LazyImport(load, opts) {
  let result = {
    Component: null
  }

  return class LazyImportComponent extends Component {
    constructor(props){
      super(props)
      this.state = {
        Component: result.Component,
        err: false
      }
    }

    componentWillMount() {
      load().then((Component) => {
        result.Component = Component
        this.setState({Component: Component})
      }).catch(err => {
        this.setState({err: true})
        throw err
      })
    }

    render(){
      const {Component, err} = this.state
      if (err) {
        return <ErrorComponent/>
      }
      return Component ?
        Component.default ? <Component.default {...this.props}/> : <Component {...this.props}/>
        : <ErrorComponent/>
    }
  }
}

module.exports = LazyImport
