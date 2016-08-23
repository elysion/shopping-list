import React, {Component} from 'react'
import Bacon from 'baconjs'
import classNames from 'classnames'
import './List.css'
import R from 'ramda'

const h = React.DOM
const toggleItem = new Bacon.Bus()
const toggleItemProperty = toggleItem.toProperty()

const addItemPressed = new Bacon.Bus()
const newItemName = new Bacon.Bus()

const addItem = newItemName.sampledBy(addItemPressed)

class List extends Component {
  getInitialState() {
    return {items: []}
  }

  render() {
    const renderItems = items =>
      h.ul({ key: 'item-list', className: 'no-style-list shopping-list' },
        R.sortBy(R.compose(R.toLower, R.prop('name')))(items || [])
          .map((item, index) =>
          h.li({
              key: 'item-' + index,
              className: classNames({
                'shopping-list-item': true,
                'in-shopping-list': item['in-list']
              }),
              onClick: () => toggleItem.push(Object.assign(item, { 'in-list': !item['in-list'] }))
            },
            item.name)))

    return h.div({},
      renderItems(this.props.items),
      h.input({className: 'shopping-list-item', onChange: event => newItemName.push(event.target.value)}),
      h.button({className: 'shopping-list-item', onClick: () => addItemPressed.push()}, '+')
    )
  }
}

export {
  List,
  toggleItemProperty,
  addItem
}
