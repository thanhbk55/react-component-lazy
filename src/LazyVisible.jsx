import React, {Component} from 'react'
let io
let loaders = new Map()
io = new window.IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const loader = loaders.get(entry.target)

    if(loader && entry.intersectionRatio > 0) {
      loader.showLoader()
    }
  })
})

function LazyVisible(load, opts={}) {

  return class LazyVisibleComponent extends Component {
    constructor(props){
      super(props)
      this.state = {
        Component: null,
        err: null,
        defaultHeight: opts.height || 500
      }
    }

    componentWillUnmount() {
      this.removeTrackedLoader()
    }

    initRef = (element) => {
      this.removeTrackedLoader()
      this.defaultLoading = element

      if (element) {
        loaders.set(element, this)
        io.observe(element)
      }
    }

    showLoader = () => {
      this.removeTrackedLoader()
      load().then((Component) => {
        this.setState({Component: Component})
      }).catch(err => {
        this.setState({err: "import error"})
        throw err
      })
    }

    removeTrackedLoader = () => {
      this.defaultLoading && io.unobserve(this.defaultLoading)
      loaders.get(this.defaultLoading) && loaders.delete(this.defaultLoading)
    }

    render(){
      const {Component, defaultHeight, err} = this.state

      if (err) {
        return <div>{err}</div>
      }

      if(Component){
        return Component ?
        Component.default ? <Component.default {...this.props}/> : <Component {...this.props}/>
        : null
      }

      return <div style={{height: defaultHeight+"px"}} ref={this.initRef}/>
    }
  }
}

module.exports = LazyVisible
