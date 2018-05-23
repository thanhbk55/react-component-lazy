import React, {Component} from 'react'

let intersectionObserver
let trackedElements = new Map()
intersectionObserver = new window.IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const trackedElement = trackedElements.get(entry.target)

    if (trackedElement && entry.intersectionRatio > 0) {
      trackedElement.visibilityHandler()
    }
  })
})

export default class LazyComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: this.props.visible || false
    }
    this.initRef = this.initRef.bind(this)
    this.showElement = this.visibilityHandler.bind(this)
  }

  componentWillUnmount() {
    if (this.loadingRef) {
      intersectionObserver.unobserve(this.loadingRef)
      trackedElements.delete(this.loadingRef)
    }
  }

  initRef(element) {
    if (this.loadingRef && trackedElements.get(this.loadingRef)) {
      intersectionObserver.unobserve(this.loadingRef)
      trackedElements.delete(this.loadingRef)
    }

    this.loadingRef = element

    if (element) {
      trackedElements.set(element, this)
      intersectionObserver.observe(element)
    }
  }

  visibilityHandler() {
    if (this.loadingRef) {
      intersectionObserver.unobserve(this.loadingRef)
      trackedElements.delete(this.loadingRef)
    }

    this.setState({
      visible: true
    })
  }

  render(){
    if (!this.state.visible) {
      return <div
        style={{height: "500px"}}
        ref={this.initRef}
      />
    }
    return this.props.children
  }
}
