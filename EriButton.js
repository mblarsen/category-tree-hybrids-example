import { define, html, property } from "hybrids";

const EriButton = {
  icon: "",
  iconAlt: "",
  disabled: property(Boolean),
  render: ({ disabled, icon, iconAlt }) => {
    return html`
        <button class="Button" disabled="${disabled}">
            ${icon &&
              html`<img class="Icon" src="/theme/admin/img/icons/${icon}.png" alt="${iconAlt}"/>&nbsp;`}
            <slot>Click me</slot>
        </button>
        <style>
        .Button {
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 1px;
          border: 1px solid #9E9E9E;
          background: linear-gradient(to bottom,#f6f6f6 0,#dedede 100%);
          padding: 3px 10px;
          cursor: pointer;
          transition: all .3s;
          user-select: none;
          margin: 0;
          font: inherit;
          font-family: inherit;
          box-sizing: border-box;
          min-height: 24px;
        }
        .Button:disabled {
          pointer-events: none;
          cursor: initial;
        }
        .Icon {
          width: 16px;
          height: 16px;
          margin-right: 0.25rem;
        }
        .Button:disabled .Icon {
          filter: grayscale(1);
        }
        </style>
  `;
  }
};

define("eri-button", EriButton);
