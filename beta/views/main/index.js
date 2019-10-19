const html = require('choo/html')
const viewLayout = require('../../elements/view-layout')

module.exports = MainView

/**
 * This view should remain empty until a redirect happens
 */

function MainView () {
  return (state, emit) => {
    return viewLayout((state, emit) => html`
      <section class="bg-near-white black bg-black--dark white--dark bg-near-white--light black--light flex flex-auto flex-column pb7">
      </section>
    `
    )(state, emit)
  }
}
