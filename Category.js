class Category {
  static hydrate(data) {
    const category = new Category();
    category.id = Number(data.id);
    category.title = data.title;
    category.parentId = Number(data.parent_id);
    category.children = [];
    category.selected = false;
    category.matched = false;
    category.include = false;
    category.open = false;
    return category;
  }

  static buildTree(categories) {
    const map = categories.reduce((map, category) => {
      map[category.id] = category;
      return map;
    }, {});
    return categories
      .map(c => {
        if (c.parentId) {
          c.parent = map[c.parentId];
          if (c.parent) {
            c.parent.children.push(c);
          } else {
            console.log("No parent for", c);
          }
        }
        return c;
      })
      .filter(c => !c.parentId);
  }

  getSelectedCount() {
    return this.children.reduce(
      (acc, c) => ((acc += c.selected ? 1 : 0), acc),
      0
    );
  }

  includeToRoot(alsoOpen = false) {
    this.include = true;
    if (this.parent) {
      this.parent.includeToRoot(alsoOpen);
      if (!this.parent.open) {
        this.parent.open = alsoOpen;
      }
    }
  }

  getAncestors() {
    if (!this.parentId) {
      return [this];
    }
    return [this, ...this.parent.includeAncestors()];
  }
}

export default Category;
