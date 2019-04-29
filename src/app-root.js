import { LitElement, html, css } from 'lit-element';
import { installRouter } from 'pwa-helpers/router.js';

class AppRoot extends LitElement {
  static get properties() {
    return {
      _page: { type: String },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }
      `
    ];
  }

  render() {
    // Anything that's related to rendering should be done in here.
    return html`
      <main role="main" class="main-content">
        <my-view1 class="page" ?active="${this._page === 'view1'}"></my-view1>
        <my-view2 class="page" ?active="${this._page === 'view2'}"></my-view2>
        <my-view404 class="page" ?active="${this._page === 'view404'}"></my-view404>
      </main>
    `;
  }

  constructor() {
    super();
  }

  firstUpdated() {
    installRouter((location) => this._locationChanged(location));
  }

  _locationChanged(location) {
    const path = window.decodeURIComponent(location.pathname);
    const page = path === '/' ? 'view1' : path.slice(1);
    this._loadPage(page);
    // Any other info you might want to extract from the path (like page type),
    // you can do here.
  }

  _loadPage(page) {
    switch(page) {
      case 'view1':
        import('./views/my-view1.js').then((module) => {
          // Put code in here that you want to run every time when
          // navigating to view1 after my-view1.js is loaded.
        });
        break;
      case 'view2':
        import('./views/my-view2.js');
        break;
      default:
        page = 'view404';
        import('./views/my-view404.js');
    }

    this._page = page;
  }
}

window.customElements.define('app-root', AppRoot);
