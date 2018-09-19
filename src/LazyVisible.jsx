import React, {Component, Fragment} from 'react'
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

function retry(retryFn, retries=0) {
  console.log(`${retries} retries left!`)
  const promise = new Promise(retryFn)
  if(retries > 0) {
    return promise.catch(() => retry(retryFn, --retries))
  }

  return promise
}

function checkError(opts){
  let check = false
  const opt_check_arr = [
    {field: "height", type: "number"},
    {field: "loadding", type: "function"},
    {field: "delay", type: "number"}
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
    const {err, show_error, retryFn} = this.props
    if(!show_error) return null
    return (
      <div>
        {show_error(retryFn, err)}
      </div>
    )
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
        loading: opts.loading,
        passDelay: opts.delay ? false : true,
        delay: opts.delay,
        retries: opts.retries || 3
      }
    }

    componentWillUnmount() {
      this.removeTrackedLoader()
      this.clearTimeOut()
    }

    createTimeout() {
      const {delay, passDelay} = this.state
      if(delay && !passDelay) {
        this.delay = setTimeout(() => {
          this.setState({passDelay: true});
        }, delay)
      }
    }

    clearTimeOut(){
      clearTimeout(this.delay)
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
      this.createTimeout()
      if(!this.state.Component){
        retry((resolve, reject) => {
          load().then((Component) => {
            resolve(Component)
          }).catch(err => {
            reject(err)
          })
        }, this.state.retries).then(
          (Component) => {
            result.Component = Component
            this.setState({Component: Component, err: false})
          }
        )
        .catch(
          (err) => {
            !this.state.err && this.setState({err: true})
            this.clearTimeOut()
            throw err
          }
        )
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
        loading,
        passDelay
      } = this.state

      if (err) {
        return <ErrorComponent err={err} show_error={opts.error} retryFn={this.showLoader}/>
      }

      if(Component && passDelay){
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
