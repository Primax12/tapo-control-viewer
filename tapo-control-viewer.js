var TapoControlViewerVersion = "0.1";

import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

import "https://unpkg.com/dayjs@1.11.7/dayjs.min.js?module";
import "https://unpkg.com/dayjs@1.11.7/plugin/customParseFormat.js?module";
import "https://unpkg.com/dayjs@1.11.7/plugin/duration.js?module";

class TapoControlViewer extends LitElement {

  resources = null;

  static get properties() {
    return {
      _hass: {},
      config: {},
      resources: {},
      selectedResource: {}
    };
  }
  /*
  ***************
  * DATA MODEL: *
  ***************
  
  config: {
    tapo_control_storage_location: string
  }

  resource: {
    filename: string
    startRec: string
    endRec: string
    caption: string
    authThumbUrl: string
    authVidUrl: string
  }

  selectedResource: resource

  resources: resource[]

  */
  render() {
    return html`
      <ha-card .header="" class="menu-responsive">
        <div class="resource-viewer">
          <figure style="margin:5px;">
            <video class="lzy_video" controls autoplay playsinline src=""></video>
          </figure>
        </div>

        <div class="resource-menu">
          ${this.resources.map((resource, index) => this.getMenuHtml(resource, index))}
        </div>
      </ha-card>`;
  }

  getMenuHtml(resource, index) {
    return html`
      <figure style="margin:5px;" id="resource${index}" data-imageIndex="${index}" @click="${ev => this.selectResource(index)}" class="${(resource.filename == this.selectedResource ? this.selectedResource.filename : "") ? 'selected' : ''}">
        <img class="lzy_img" data-src="${resource.authThumbUrl}"/>
        <figcaption>${resource.caption} <span class="duration">(${resource.duration})</span></figcaption>
      </figure>`
  }

  updated(changedProperties) {
    const arr = this.shadowRoot.querySelectorAll('img.lzy_img')
    arr.forEach((v) => {
      this.imageObserver.observe(v);
    })
    const varr = this.shadowRoot.querySelectorAll('video.lzy_video')
    varr.forEach((v) => {
      this.imageObserver.observe(v);
    })
  }

  async setConfig(config) {
    dayjs.extend(dayjs_plugin_customParseFormat);
    dayjs.extend(dayjs_plugin_duration);

    this.imageObserver = new IntersectionObserver((entries, imgObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target
          lazyImage.src = lazyImage.dataset.src
        }
      })
    });

    this.config = config;
    if (this._hass !== undefined) await this.loadResources();

  }

  async loadResources() {
    this.resources = [];
    const filenames = await this.getFilenames(this._hass);

    this.resources = filenames.reverse().map((filename, i) => {
      const splitted = filename.split("-")
      const startRec = splitted[0];
      const endRec = splitted[1];
      const caption = dayjs.unix(startRec).format("D/M HH:mm");
      const duration = dayjs.duration((endRec - startRec), "seconds").format("m[m]s[s]")
      return {
        filename,
        startRec,
        endRec,
        caption,
        duration
      }
    });

    for (const res of this.resources) {
      res.authThumbUrl = await this.getAuthThumbUrl(res.filename);
    }

    if (this.resources.length > 0)
      this.selectResource(0);

  }

  async getFilenames() {
    const rep = await this._hass.callWS({
      type: "media_source/browse_media",
      media_content_id: this.config.tapo_control_storage_location + "thumbs"
    })
    return rep.children.map((obj, i) => obj.title.split(".")[0]);
  }

  async getAuthThumbUrl(filename) {
    const rep = await this._hass.callWS({
      type: "media_source/resolve_media",
      media_content_id: this.config.tapo_control_storage_location + "thumbs/" + filename + ".jpg",
      expires: (60 * 60 * 3)  //3 hours
    })
    return rep.url
  }

  async getAuthVidUrl(filename) {
    const rep = await this._hass.callWS({
      type: "media_source/resolve_media",
      media_content_id: this.config.tapo_control_storage_location + "videos/" + filename + ".mp4",
      expires: (60 * 60 * 3)  //3 hours
    })
    return rep.url
  }

  async selectResource(index) {
    if (!this.resources[index].authVidUrl)
      this.resources[index].authVidUrl = await this.getAuthVidUrl(this.resources[index].filename);
    this.selectedResource = this.resources[index];
    const el = this.shadowRoot.querySelector(".resource-viewer figure video");
    el.src = this.selectedResource.authVidUrl;
  }

  set hass(hass) {
    this._hass = hass;
    if (this.resources == null) this.loadResources(this._hass);
  }

  getCardSize() {
    return 1;
  }

  static get styles() {
    return css`
      ha-card {
        height: 100%;
        overflow: hidden;
      }

      figcaption {
        text-align:center;
        white-space: nowrap;
      }
      img, video {
        width: 100%;
        object-fit: contain;
      }
      figure.selected {
        opacity: 0.5;
      }
      .duration {
        font-style:italic;
      }

      @media all and (max-width: 599px) {
        .menu-responsive .resource-viewer {
          width: 100%;
        }
        .menu-responsive .resource-viewer .btn {
          top: 33%;
        }
        .menu-responsive .resource-menu {
          width:100%;
          height: 65vh;
          overflow-y: scroll;
          // overflow-x: scroll;
          // display: flex;
        }
        .menu-responsive .resource-menu figure {
          margin: 0px;
          padding: 12px;
        }
      }
      @media all and (min-width: 600px) {
        .menu-responsive .resource-viewer {
          float: left;
          width: 75%;
          position: relative;
        }
        .menu-responsive .resource-viewer .btn {
          top: 40%;
        }   
        .menu-responsive .resource-menu {
          width:25%; 
          height: calc(100vh - 120px);
          overflow-y: scroll; 
          float: right;
        }
      }
    `;
  }
}

customElements.define("tapo-control-viewer", TapoControlViewer);

console.groupCollapsed(`%cTAPO-CONTROL-VIEWER ${TapoControlViewerVersion} IS INSTALLED`, "color: green; font-weight: bold");
console.log("Readme:", "TODO");
console.groupEnd();

window.customCards = window.customCards || [];
window.customCards.push({
  type: "tapo-control-viewer",
  name: "tapo-control-viewer",
  preview: false, // Optional - defaults to false
  description: "TODO" // Optional
});
