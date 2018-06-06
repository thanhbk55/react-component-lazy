
# `react-component-lazy`
A lightweight libraries for lazyload your Components, Images or anything.
## Main function
  - Lazyload your Components using [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
  - Loading components with [dynamic imports](https://reactjs.org/docs/code-splitting.html)
  - **Lazyload your Components and loading components with dynamic imports once time**
  - Creating a great "Loading..." Component

## Lazyload your Components using [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
 Load content that is visible on the screen.

```js
import LazyComponent from 'react-component-lazy'
import Component from './Component'


export default class App extends React.Component {
  render() {
    return (
      <LazyComponent>
        <Component />
      <LazyComponent>
    )
  }
}
```

#### Options
**height**
Default height before Component loaded (default: 500)
```js
return (
  <LazyComponent height="300">
    <Component />
  <LazyComponent>
)
```

**visible**
Is component first time visible
```js
return (
  <LazyComponent visible={true}>
    <Component />
  <LazyComponent>
)
```

## Loading components with [dynamic imports](https://reactjs.org/docs/code-splitting.html)

```js
import {LazyImport} from 'react-component-lazy'
const Component = LazyImport(() => import('./Component'))

export default class App extends React.Component {
  render() {
    return (
      <Component />
    )
  }
}
```

## Lazyload your Components and loading components with dynamic imports once time

```js
import {LazyVisible} from 'react-component-lazy'
const Component = LazyVisible(() => import('./Component'))

export default class App extends React.Component {
  render() {
    return (
      <Component />
    )
  }
}
```

#### Options
**height**
Default height before Component loaded (default: 500)
```js
import {LazyVisible} from 'react-component-lazy'
const Component = LazyVisible(() => import('./Component'), {height: 300})

export default class App extends React.Component {
  render() {
    return (
      <Component />
    )
  }
}
```

## Creating a great "Loading..." Component
You can customm default element, that is rendered before commponent loaded

```js
import {LazyVisible} from 'react-component-lazy'
const Component = LazyVisible(() => import('./Component'), {
  height: 300,
  loadding(){
    return <div>Loading...</div>
  }
})

export default class App extends React.Component {
  render() {
    return (
      <Component />
    )
  }
}
