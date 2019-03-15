import React, {Component, Fragment} from 'react'

(function(window, document) {
  'use strict';

  if(!window.IntersectionObserver){
    function LazyComponentHOC(load, opts={}) {

      return class DefaultComponent extends Component {
        render(){
          return load ?
          load.default ? <load.default {...this.props}/> : <load {...this.props}/>
          : null
        }
      }
    }

    module.exports = LazyComponentHOC

    return
  }

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

function LazyComponentHOC(load, opts={}) {

  return class LazyComponentHOCComponent extends Component {

    constructor(props){
      super(props)
      this.state = {
        Component: load,
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
      this.setState({
        visible: true
      })
    }

    removeTrackedLoader = () => {
      this.defaultLoading && io.unobserve(this.defaultLoading)
      loaders.get(this.defaultLoading) && loaders.delete(this.defaultLoading)
    }

    render(){
      const {
        Component,
        defaultHeight,
        visible
      } = this.state
      if(visible){
        return Component ?
        Component.default ? <Component.default {...this.props}/> : <Component {...this.props}/>
        : null
      }

      return <div style={{height: defaultHeight+"px"}} ref={this.initRef}/>
    }
  }
}

module.exports = LazyComponentHOC

}(window, document))
