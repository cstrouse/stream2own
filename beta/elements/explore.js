const matchMedia = require('../lib/match-media')
const Explore = require('../components/explore')
const { isBrowser } = require('browser-or-node')

module.exports = (state, emit) => {
  if (isBrowser && matchMedia('lg')) {
    return state.cache(Explore, 'explore').render({
      user: state.user
    })
  }
}
