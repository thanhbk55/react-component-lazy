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

function checkError(opts){
  let check = false
  const opt_check_arr = [
    {field: "height", type: "number"},
    {field: "loadding", type: "function"}
  ]
  opt_check_arr.forEach((item) => {
    if(opts[item.field] && typeof(opts[item.field]) !== item.type){
      console.log(`\nparam '${item.field}' invalid\n`)
      check = true
    }
  })
  return check
}

class ErrorComponent extends Component {
  render(){
    return null
  }
}

function LazyVisible(load, opts={}) {
  if(checkError(opts)){
    return ErrorComponent
  }
  let result = {
    Component: null
  }

  return class LazyVisibleComponent extends Component {

    constructor(props){
      super(props)
      this.state = {
        Component: result.Component,
        err: null,
        defaultHeight: opts.height || 500,
        loading: opts.loading
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
      if(!this.state.Component){
        load().then((Component) => {
          result.Component = Component
          this.setState({Component: Component})
        }).catch(err => {
          this.setState({err: true})
          throw err
        })
      }
    }

    removeTrackedLoader = () => {
      this.defaultLoading && io.unobserve(this.defaultLoading)
      loaders.get(this.defaultLoading) && loaders.delete(this.defaultLoading)
    }

    render(){
      const {
        Component,
        defaultHeight,
        err,
        loading
      } = this.state

      if (err) {
        return <ErrorComponent/>
      }

      if(Component){
        return Component ?
        Component.default ? <Component.default {...this.props}/> : <Component {...this.props}/>
        : <ErrorComponent/>
      }

      return (
        <div style={{height: defaultHeight+"px"}} ref={this.initRef}>
          {loading && loading()}
        </div>
      )
    }
  }
}

module.exports = LazyVisible
