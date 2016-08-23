import React from 'react';
import ReactDOM from 'react-dom';
import {List, toggleItemProperty, addItem} from './List';
import './index.css';
import Bacon from 'baconjs'
import $ from 'jquery'
import R from 'ramda'
import io from 'socket.io-client'

const apiRoot = 'http://backend_url:port'

const reloadTimer = Bacon.interval(60 * 1000)
const socket = io(apiRoot)

const dataChanged = Bacon.fromEvent(socket, '/Item').log('change')

const itemRequests = toggleItemProperty.map(item => ({
  url: `${apiRoot}/api/items/${item.id}/replace`,
  method: 'post',
  data: R.omit('id', item)}))
  .flatMap(params => Bacon.fromPromise($.ajax(params)))

const addItemResponse = addItem.map(name => ({
  url: `${apiRoot}/api/items/`,
  method: 'post',
  data: {name, 'in-list': true}}))
  .flatMap(params => Bacon.fromPromise($.ajax(params)))

Bacon.mergeAll(
  reloadTimer.startWith(),
  itemRequests,
  dataChanged,
  addItemResponse
).map({url: `${apiRoot}/api/items/`})
  .flatMap(data => Bacon.fromPromise($.ajax(data)))
  .onValue(items => ReactDOM.render(React.createElement(List, {items}), document.getElementById('list')))

