import { html } from "hybrids";

export default html`
    <style>
      .Form {
        display: grid;
        grid-template-columns: 1fr 5fr;
        grid-gap: 1rem;
        padding: 0 1.5rem;
        align-items: flex-start;
      }
      .Form * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      .Field {
        width: 100%;
      }
      .Input {
        width: 100%;
        height: 32px;
        border: 1px solid #efefef;
        border-radius: 4px;
        padding: .5rem
      }
      .Input--small {
        height: 25px;
      }
      textarea.Input {
        min-height: 96px;
        resize: none;
      }
      .Results {
        max-height: 50vh;
        overflow: scroll;
      }
      .Form .SearchInput {
        margin-bottom: 0.5rem;
      }
      .Form .SelectedGroups {
        margin-bottom: 0.5rem;
      }
    </style>
`;
