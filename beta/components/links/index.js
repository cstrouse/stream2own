const html = require('choo/html')
const Component = require('choo/component')
const morph = require('nanomorph')
const logger = require('nanologger')
const log = logger('links')
const normalizeUrl = require('normalize-url')
const link = require('@resonate/link-element')

const apiFactoryGenerator = require('@resonate/api-factory-generator')
const api = apiFactoryGenerator({
  labels: {
    getLinks: {
      path: '/labels/[:uid]/links',
      schema: {
        type: 'object',
        properties: {
          uid: {
            type: 'number'
          }
        }
      }
    }
  },
  artists: {
    getLinks: {
      path: '/artists/[:uid]/links',
      schema: {
        type: 'object',
        properties: {
          uid: {
            type: 'number'
          }
        }
      }
    }
  }
}, {
  scheme: 'https://',
  domain: process.env.API_DOMAIN || 'api.resonate.localhost',
  prefix: process.env.API_PREFIX || '/v1',
  version: 1
})

class Links extends Component {
  constructor (name, state, emit) {
    super(name)

    this.state = state
    this.emit = emit

    this.items = []
  }

  createElement (props) {
    this.type = props.type || 'artists'
    this.uid = props.uid

    return html`
      <div>
        ${this.renderLinks(this.items)}
      </div>
    `
  }

  renderLinks (items) {
    const links = items.map(linkItem)

    return html`
      <ul class="links flex flex-column list ma0 pa0">
        ${links}
      </ul>
    `

    function linkItem (props) {
      let platform = props.platform
      let value = props.url

      if (!value.includes(platform) && ['facebook', 'twitter'].includes(platform)) {
        value = value.replace(/^/, `https://${platform}.com/`)
      }
      if (value.includes('bandcamp')) {
        platform = 'bandcamp'
      }

      const href = normalizeUrl(value, { stripWWW: false })

      return html`
        <li class="flex mb3">
          ${link({
            prefix: 'link flex items-center ttc color-inherit',
            href: href,
            target: '_blank',
            text: platform
          })}
        </li>
      `
    }
  }

  async getLinks (uid) {
    try {
      const request = api[this.type]
      const response = await request.getLinks(uid)

      if (response.data) {
        this.items = response.data

        morph(this.element.querySelector('.links'), this.renderLinks(this.items))
      }
    } catch (err) {
      log.error(err)
    }
  }

  load () {
    this.getLinks(this.uid)
  }

  update (props) {
    if (props.uid !== this.uid) {
      return true
    }
    return false
  }
}

module.exports = Links
