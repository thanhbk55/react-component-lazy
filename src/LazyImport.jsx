import React, {Component} from 'react'

function LazyImport(load, opts) {

  return class LazyImportComponent extends Component {
    constructor(props){
      super(props)
      this.state = {
        Component: null,
        err: null
      }
    }

    componentWillMount() {
      load().then((Component) => {
        this.setState({Component: Component})
      }).catch(err => {
        this.setState({err: "import error"})
        throw err;
      })
    }

    render(){
      const {Component, err} = this.state
      if (err) {
        return <div>{err}</div>
      }
      return Component ?
        Component.default ? <Component.default /> : <Component />
        : null
    }
  }
}

module.exports = LazyImport;
