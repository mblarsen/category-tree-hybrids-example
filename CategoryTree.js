import { define, dispatch, html, property } from "hybrids";
import formStyles from "./formStyles.js";
import Category from "./Category.js";
import FolderImg from "./img/folder.png";
import PageImg from "./img/page_white_text.jpg";
import VlineImg from "./img/vline.gif";

function parseJSON(value = []) {
  return typeof value === "string" ? JSON.parse(value) : value;
}

function preventSubmit(host, event) {
  if (event.key === "Enter" || event.keyCode === 13) {
    event.preventDefault();
  }
}

/**
 * Currently a nested component due to hybrids bug dealing with content in TDs
 */
const TextButton = (action, children) => {
  return html`
    <span class="TextButton" onclick="${action}">${children}</span>
    <style>
        .TextButton {
          border-bottom: 1px dashed grey;
          cursor: pointer;
        }
    </style>
  `;
};

const splitIds = function(propValue = "") {
  if (Array.isArray(propValue)) {
    return propValue.map(Number);
  }
  return propValue
    .split(",")
    .reduce((ids, id) => (ids.push(Number(id)), ids), []);
};

const CategoryTree = {
  open: false,
  search: "",
  existing: property(splitIds),
  categories: property(parseJSON),
  openFolders: [],
  allCategories: {
    // Convert all objects to Category instances
    // and mark them seleceted
    // and mark them matching search
    get: ({ search, categories, existing }) => {
      return categories.map(c => Category.hydrate(c)).map(c => {
        c.selected = existing.includes(c.id);
        c.matched =
          Boolean(search) && c.title.toLowerCase().indexOf(search) > -1;
        return c;
      });
    }
  },
  // Build tree, ie. add parent and children
  tree: ({ open, allCategories }) => {
    if (!open) {
      return [];
    }
    return Category.buildTree(allCategories);
  },
  // Tag a nodes that should be included in view
  filteredCategories: ({ open, search, tree, allCategories }) => {
    if (!open) {
      return [];
    }
    return allCategories
      .map(c => {
        if (c.matched || c.selected) {
          c.includeToRoot(true); // also open
        } else if (!search) {
          c.includeToRoot(false);
        }
        return c;
      })
      .filter(c => c.include);
  },
  selectedCategories: ({ allCategories, existing }) => {
    return allCategories.filter(c => existing.includes(c.id));
  },
  render: host => (host.open ? FullView(host) : CompactView(host))
};

const open = (host, event) => {
  host.open = true;
};
const compact = (host, event) => {
  host.open = false;
};

const handleSearch = (host, event) => {
  host.search = event.target.value.toLowerCase();
};

const CompactView = ({ search, store, selectedCategories }) => {
  const categoryList = selectedCategories.map(b => b.title).join(", ");
  const textButtonText = selectedCategories.length
    ? categoryList
    : "Click to choose";

  return html`<div class="CompactView">
      <img class="Icon" src="${FolderImg}"/>
    ${TextButton(open, textButtonText)}</div>
    <style>
      .CompactView {
        margin: 0.75rem;
      }
    </style>
    `;
};

const selectCategory = (category, value) => (host, event) => {
  if (category.selected) {
    host.existing = host.existing.filter(id => id !== category.id);
  } else {
    host.existing = [...host.existing, category.id];
  }
  dispatch(host, "select", { detail: host.existing.join(",") });
};

const FullView = ({
  allCategories,
  filteredCategories,
  openFolders,
  search,
  store,
  tree
}) => {
  return html`
    <div class="FullView">
    <div class="SearchBar">
      <input
        class="Input Input--small SearchInput"
        type="text"
        value="${search}"
        onkeydown="${preventSubmit}"
        onkeyup="${handleSearch}"
        placeholder="Filtrer..."
        />
      <eri-button onclick="${compact}">Close</eri-button>
    </div>
    <div class="Categories">
      ${tree.map(root => {
        return root.include && TreeNode(openFolders, root, 0);
      })}
    </div>
  </div>
    ${formStyles}
    <style>
      .SearchBar {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      .SearchBar *:not(:first-child) {
        margin-left: 0.5rem;
      }
      .FullView * {
        box-sizing: border-box;
      }
      .Input.SearchInput {
        max-width: 50%;
      }
      .Categories {
        margin-bottom: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        max-height: 40vh;
        overflow: scroll;
        width: 50%;
        border-bottom: 1px dotted lightgrey;
      }
      .Category {
        cursor: pointer;
        margin-left: 21px;
      }
      .Category--root {
        margin-left: 0;
      }
      .Children {
        background-image: url("${VlineImg}");
        background-position: 3px 0;
        background-repeat: repeat-y;
      }
    </style>
    `;
};

const toggleOpenFolder = node => (host, event) => {
  if (node.children.length > 0) {
    node.open = !node.open;
    if (node.open) {
      host.openFolders = [...host.openFolders, node.id];
    } else {
      host.openFolders = host.openFolders.filter(id => id !== node.id);
    }
  }
};

const TreeNode = (openFolders, category, indent) => {
  const count = category.getSelectedCount();
  return html`
    <div class="${{ Category: true, "Category--root": indent === 0 }}">
      <input
        id="c-${category.id}"
        type="checkbox"
        onclick="${selectCategory(category)}"
        checked="${category.selected && "checked"}"/>
      <img
        class="Icon"
        onclick="${toggleOpenFolder(category)}"
        src="${category.children.length ? FolderImg : PageImg}"/>
      <label for="c-${category.id}">
        ${category.title}
      </label>
      ${count > 0 && html`<span>(${count})</span>`}
      <div class="Children">
      ${(openFolders.includes(category.id) || category.open) &&
        category.children.map(c => {
          return c.include && TreeNode(openFolders, c, indent + 1);
        })}
      </div>
    </div>`.key(`${category.id}:${category.open ? "1" : "0"}`);
};

define("category-tree", CategoryTree);
