const html = require('choo/html')
const viewLayout = require('../../elements/view-layout')

// TBD

module.exports = FeedView

function FeedView () {
  return (state, emit) => {
    return viewLayout((state, emit) => html`<div></div>`)(state, emit)
  }
}
