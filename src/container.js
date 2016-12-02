import { event, select } from 'd3-selection';
import 'd3-selection-multi';

export default class Container {
  constructor() {
    this._children = new Set();

    this._root = select('body')
      .append('div')
      .classed('scola pop', true)
      .styles({
        'display': 'none',
        'bottom': '0px',
        'left': '0px',
        'position': 'fixed',
        'right': '0px',
        'top': '0px',
        'z-index': 1000
      });

    this._bind();
  }

  destroy() {
    this._unbind();
    this._children.forEach((child) => child.hide());
    this._children.clear();

    this._root.dispatch('destroy');
    this._root.remove();
    this._root = null;
  }

  root() {
    return this._root;
  }

  append(child, action) {
    if (action === true) {
      this._children.add(child);
      this._root.node().appendChild(child.root().node());
      this._show();
    } else if (action === false) {
      this._children.delete(child);
      child.root().node().remove();
      this._hide();
    }

    return this;
  }

  _bind() {
    select(window).on('keyup.scola-pop', () => this._handleKeyUp());
  }

  _unbind() {
    select(window).on('keyup.scola-pop', null);
  }

  _handleKeyUp() {
    if (event.keyCode === 27 && this._children.size > 0) {
      Array.from(this._children).pop().hide(true);
    }
  }

  _show() {
    if (this._children.size === 1) {
      this._root.style('display', 'block');
    }

    return this;
  }

  _hide() {
    if (this._children.size === 0) {
      this._root.style('display', 'none');
    }

    return this;
  }
}
