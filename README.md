# `react-component-lazy`
A lightweight libraries using `IntersectionObserver` for lazyload your Components, Images or anything.
## Example using `react-component-lazy`

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

## Options
### height
Default height before Component loaded (default: 500)
```js
return (
  <LazyComponent height="300">
    <Component />
  <LazyComponent>
)
```

### visible
Is component first time visible
```js
return (
  <LazyComponent visible={true}>
    <Component />
  <LazyComponent>
)
```
