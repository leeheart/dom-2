window.$ = window.jQuery = function(selectorOrArrayOrHtml) {
  let elements;
  if (typeof selectorOrArrayOrHtml === "string") {
    if (selectorOrArrayOrHtml[0] === "<") {
      elements = [createElement(selectorOrArrayOrHtml)];
    } else {
      elements = document.querySelectorAll(selectorOrArrayOrHtml);
    }
  } else if (selectorOrArrayOrHtml instanceof Array) {
    elements = selectorOrArrayOrHtml;
  }

  function createElement(string) {
    const container = document.createElement("template");
    container.innerHTML = string;
    return container.content.firstChild;
  }

  const api = Object.create(jQuery.prototype); //共有属性（方法）
  Object.assign(api, {
    //私有属性（方法）
    elements: elements,
    oldApi: elements.oldApi
  });

  return api;
};

jQuery.fn = jQuery.prototype = {
  constructor: jQuery,
  jQuery: true,
  each(fn) {
    for (let i = 0; i < this.elements.length; i++) {
      fn.call(null, this.elements[i], i);
    }
    return this;
  },
  get(index) {
    return this.elements[index];
  },
  appendTo(parent) {
    if (parent instanceof Element) {
      this.each(item => parent.appendChild(item));
    } else if (parent.jQuery) {
      this.each(item => parent.get(0).appendChild(item));
    }
    return this;
  },
  append(children) {
    if (children instanceof Element) {
      this.get(0).appendChild(children);
    } else if (children instanceof HTMLCollection) {
      for (let i = 0; i < children.length; i++) {
        this.get(0).appendChild(children[i]);
      }
    } else if (children.jQuery) {
      children.each(item => {
        this.get(0).appendChild(item);
      });
    }
    return this;
  },
  find(selector) {
    let arr = [];
    this.each(item => {
      arr = arr.concat(Array.from(item.querySelectorAll(selector)));
    });
    arr.oldApi = this;
    return jQuery(arr);
  },
  parent() {
    let arr = [];
    this.each(item => {
      if (arr.indexOf(item.parentNode) === -1) {
        arr.push(item.parentNode);
      }
    });
    arr.oldApi = this;
    return jQuery(arr);
  },
  children() {
    let arr = [];
    this.each(item => {
      arr.push(...item.children);
    });
    arr.oldApi = this;
    return jQuery(arr);
  },
  print() {
    console.log(this.elements);
  },
  addClass(className) {
    this.each(item => {
      item.classList.add(className);
    });
    return this;
  },
  end() {
    return this.oldApi;
  }
};