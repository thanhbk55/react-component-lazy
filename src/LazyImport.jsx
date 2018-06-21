import React, {Component} from 'react'

function retry(retryFn, retries=0) {
  console.log(`${retries} retries left!`)
  const promise = new Promise(retryFn)
  if(retries > 0) {
    return promise.catch(error => retry(retryFn, --retries))
  }

  return promise
}

class ErrorComponent extends Component {
  render(){
    return null
  }
}

function LazyImport(load, opts={}) {
  let result = {
    Component: null
  }

  return class LazyImportComponent extends Component {
    constructor(props){
      super(props)
      this.state = {
        Component: result.Component,
        err: false,
        retries: opts.retries || 30
      }
    }
    
    // componentDidUpdate(){
    //   if(!this.state.Component && this.state.err){
    //     this.loadComponent()
    //   }
    // }

    componentWillMount() {
      this.loadComponent()
    }
    
    loadComponent(){
      retry((resolve, reject) => {
        load().then((Component) => {
          resolve(Component)
        }).catch(err => {
          setTimeout(() => {
            reject(err)
          }, 1000);
        })
      }, this.state.retries).then(
        (Component) => {
          result.Component = Component
          this.setState({Component: Component, err: false})
        }
      )
      .catch(
        (error) => {
          !this.state.err && this.setState({err: true})
          throw err
        }
      )
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
