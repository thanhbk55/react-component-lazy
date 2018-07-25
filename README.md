
# `react-component-lazy`
A lightweight libraries for lazyload your Components, Images or anything.
## Main function
  - Lazyload your Components using [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
  - Loading components with [dynamic imports](https://reactjs.org/docs/code-splitting.html)
  - **Lazyload your Components and loading components with dynamic imports once time**
  - Creating a great "Loading..." Component
  - Creating a Error Alert

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

//or 
import {LazyComponent} from 'react-component-lazy'
const Component = LazyComponent(require('./Component'))

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
return (
  <LazyComponent height="300">
    <Component />
  <LazyComponent>
)

//or 
const Component = LazyComponent(require('./Component'), {height: 300})
```

**visible**
Is component first time visible
```js
return (
  <LazyComponent visible={true}>
    <Component />
  <LazyComponent>
)
//or
const Component = LazyComponent(require('./Component'), {visible: true}
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

**retries**
Auto retry load component when error. (default: 3)
```js
const Component = LazyVisible(() => import('./Component'), {retries: 5})
```

**delay**
Delaytime for load component
```js
const Component = LazyVisible(() => import('./Component'), {delay: 500})
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
```

## Creating a Error Alert
You can customm Error Alert, that is rendered when component load failed

```js
error(retry, error){
  return (
    <div className="load-failed">
      <p className="error">
        <i className="material-icons">warning</i>
        読み込みに失敗しました。もう一度お試しください。
      </p>
      <button className="btn btn-danger" onClick={retry}>リトライ</button>
    </div>
  )
}
```
[![](https://qiita-image-store.s3.amazonaws.com/0/114590/16f41060-d334-12da-e756-e499a15b3a17.png)](https://qiita-image-store.s3.amazonaws.com/0/114590/16f41060-d334-12da-e756-e499a15b3a17.png)