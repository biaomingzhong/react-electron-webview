import React from 'react';
import { findDOMNode } from 'react-dom';
import camelCase from 'camelcase';
import PropTypes from 'prop-types'

const EVENTS = [
  'load-commit',
  'did-navigate',
  'did-navigate-in-page',
  'will-navigate',
  'did-finish-load',
  'did-fail-load',
  'did-frame-finish-load',
  'did-start-loading',
  'did-stop-loading',
  'did-get-response-details',
  'did-get-redirect-request',
  'dom-ready',
  'page-title-set',
  'page-favicon-updated',
  'enter-html-full-screen',
  'leave-html-full-screen',
  'console-message',
  'new-window',
  'close',
  'ipc-message',
  'crashed',
  'gpu-crashed',
  'plugin-crashed',
  'destroyed'
];

const HANDLERS = EVENTS.map(event => camelCase(`on-${event}`));

const EVENTS_HANDLERS = EVENTS.map((event, i) => ({ event, handler: HANDLERS[i] }));

function filterKeys(object, filterFunc) {
  return Object.keys(object)
    .filter(filterFunc)
    .reduce((filtered, key) => {
      filtered[key] = object[key];
      return filtered;
    }, {});
}

export default class WebView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loaded: false, webview: null};
  }

  componentDidMount() {
    // Set up listeners.
    const node = findDOMNode(this);

    this._bindEvents(node);
    this._assignMethods(node);
    this.setState({loaded: true, webview: node});
  }

  render() {
    const tagProps = filterKeys(this.props, propName => !(propName in eventPropTypes))
    return (<webview {...tagProps}></webview>);
  }

  // Private methods
  _bindEvents(node) {
    for (const { event, handler } of EVENTS_HANDLERS) {
      node.addEventListener(event, this.props[handler]);
    }
  }

  _assignMethods(node) {
    node.addEventListener('dom-ready', () => {
      Object.getOwnPropertyNames(node)
            .filter(prop => typeof prop === 'function')
            .forEach(method => this[method] = node[method]);
    });
  }
}``

const tagPropTypes = {
  autosize: PropTypes.bool,
  disablewebsecurity: PropTypes.bool,
  httpreferrer: PropTypes.string,
  nodeintegration: PropTypes.bool,
  plugins: PropTypes.bool,
  preload: PropTypes.string,
  src: PropTypes.string,
  useragent: PropTypes.string,
  partition: PropTypes.string,
  allowpopups: PropTypes.bool,
  webpreferences: PropTypes.string,
  blinkfeatures: PropTypes.string,
  disableblinkfeatures: PropTypes.string,
  guestinstance: PropTypes.string,
};

const eventPropTypes = EVENTS_HANDLERS.reduce((propTypes, { event, handler }) => {
  propTypes[handler] = PropTypes.func;
  return propTypes;
}, {});

WebView.propTypes = Object.assign({}, tagPropTypes, eventPropTypes);
