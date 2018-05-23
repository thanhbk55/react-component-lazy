import React, {Component} from 'react'
import PropTypes from 'prop-types'

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

export default class LazyComponent extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    height: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: this.props.visible || false,
      defaultHeight: this.props.height || 500
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
    const {visible, defaultHeight} = this.state
    if(visible){
      return this.props.children
    }

    return <div style={{height: defaultHeight+"px"}} ref={this.initRef}/>
  }
}
