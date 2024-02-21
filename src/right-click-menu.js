// Style menu properties via CSS. Font size must be given in px.
//
// .menu {
//     font-size: 24px;
// }
// .menu-rect {
//     fill: color;
// }
// .menu-border {
//     fill: color;
// }
// .menu-text {
//     fill: color;
// }
// .menu-highlight {
//     fill: color;
// }

const namespace = "http://www.w3.org/2000/svg";

export default class {
  clickReleaseWindow;
  svg;
  group;
  menu;
  border;
  menuItems = [];
  buttonDownTime;
  isVisible = false;
  tileGroup = null;
  functions;
  itemTexts;
  borderSize = 1;
  scale = 1;
  fontSize = 20;
  // menuMargin creates an invisible, non-selectable buffer zone around the
  // menu so we can listen for the mouse leaving the menu and disable the
  // highlight without having to listen over the entire document.
  menuMargin = 2;
  menuPosOffset = { x: -4, y: -1 };
  menuWidth;
  menuHeight;
  initTime;
  // postInitDelay sets a delay on when menu items can be triggered after menu
  // init. This provides a safeguard against accidentally catching a click that
  // opened the menu.
  postInitDelay = 200;
  html;

  constructor(_itemTexts, _functions, _cssClasses) {
    this.html = document.querySelector("html");
    this.svg = document.createElementNS(namespace, "svg");
    this.svg.classList.add("menu");

    if (_cssClasses) {
      this.svg.classList.add(..._cssClasses);
    }

    this.svg.setAttribute("display", "none");
    this.clickReleaseWindow = 500;
    this.group = document.createElementNS(namespace, "g");
    this.menu = document.createElementNS(namespace, "rect");
    this.border = document.createElementNS(namespace, "rect");

    this.group.appendChild(this.border);
    this.group.appendChild(this.menu);
    this.group.setAttribute("id", `menuGroup`);

    this.border.classList.add("menu-border");
    this.menu.classList.add("menu-rect");

    this.functions = _functions;
    this.itemTexts = _itemTexts;

    this.svg.addEventListener("mousemove", (_e) => {
      this.updateHighlight(_e.clientX, _e.clientY);
    });

    window.addEventListener("scroll", () => {
      if (this.isVisible) {
        this.erase();
      }
    });

    document.addEventListener("mousedown", (_e) => {
      if (
        this.isVisible &&
        new Date().getTime() - this.initTime > this.postInitDelay
      ) {
        const menuSelection = this.getHighlighted();
        const menuMouseOver = document.elementsFromPoint(
          _e.clientX,
          _e.clientY
        );

        this.svg.remove();

        if (menuSelection && menuMouseOver.includes(menuSelection.rect)) {
          this.activateSelection();
        }

        this.erase();
      }
    });
  }

  init() {
    const computedFontSize = window
      .getComputedStyle(this.svg)
      .getPropertyValue("font-size");

    if (computedFontSize) {
      let num = "";

      for (const char of computedFontSize) {
        const code = char.charCodeAt(0);

        if (code >= 48 && code <= 57) {
          num += char;
        }
      }

      this.fontSize = Number(num);
    }

    this.svg.setAttribute("display", "block");
    this.svg.setAttribute("style", `position: absolute;`);

    for (let i = 0; i < this.itemTexts.length; i++) {
      this.addMenuItem(this.itemTexts[i], this.functions[i]);
    }

    let height = 0;
    let width = 0;
    for (const x of this.menuItems) {
      const newWidth = x.svgText.text.getBBox().width + x.svgText.xMargin * 2;

      if (newWidth > width) {
        width = newWidth;
      }
    }
    for (let i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i].rect.setAttribute("width", width);
      this.menuItems[i].group.setAttribute(
        "transform",
        `translate(0, ${height})`
      );
      height += Number(this.menuItems[i].rect.getAttribute("height"));
    }

    this.menu.setAttribute("width", `${width}`);
    this.menu.setAttribute("height", `${height}`);
    this.border.setAttribute("width", `${width + this.borderSize * 2}`);
    this.border.setAttribute("height", `${height + this.borderSize * 2}`);
    this.border.setAttribute("x", `${this.borderSize * -1}`);
    this.border.setAttribute("y", `${this.borderSize * -1}`);

    this.svg.setAttribute(
      "width",
      `${width * this.scale + this.borderSize * this.scale}`
    );
    this.svg.setAttribute(
      "height",
      `${height * this.scale + this.borderSize * this.scale}`
    );
    this.svg.setAttribute(
      "viewBox",
      `${this.borderSize * -1 - this.menuMargin} ${
        this.borderSize * -1 - this.menuMargin
      } ${
        width + this.borderSize * 2 + this.menuMargin * 2
      } ${height + this.borderSize * 2 + this.menuMargin * 2}`
    );

    this.menuWidth = width + this.borderSize * 2 - this.menuMargin * 2;
    this.menuHeight = height + this.borderSize * 2 - this.menuMargin * 2;

    this.initTime = new Date().getTime();
  }

  buttonDown(_clientX, _clientY) {
    if (this.isVisible) this.erase();
    this.isVisible = true;
    this.svg.appendChild(this.group);
    this.init();

    const docWidth = this.html.clientWidth;
    const docHeight = this.html.clientHeight;

    // Adjustment values if the menu extends off the screen.
    let xOffset = 0;
    let yOffset = 0;

    if (_clientX + this.menuPosOffset.x + this.menuWidth + 1 > docWidth) {
      xOffset =
        docWidth - (_clientX + this.menuPosOffset.x + this.menuWidth + 1);
    }

    if (_clientY + this.menuPosOffset.y + this.menuHeight + 1 > docHeight) {
      yOffset =
        docHeight - (_clientY + this.menuPosOffset.y + this.menuHeight + 1);
    }

    this.svg.setAttribute(
      "transform",
      `translate(${
        _clientX -
        this.menuMargin +
        this.menuPosOffset.x +
        xOffset +
        window.scrollX
      }, ${
        _clientY -
        this.menuMargin +
        this.menuPosOffset.y +
        yOffset +
        window.scrollY
      })`
    );
    this.updateHighlight(_clientX, _clientY);
    this.buttonDownTime = performance.now();
  }

  buttonUp() {
    if (performance.now() - this.buttonDownTime > this.clickReleaseWindow)
      this.erase();
  }

  erase() {
    this.group.remove();

    for (const item of this.menuItems) {
      item.group.remove();
    }

    this.svg.setAttribute("display", "none");
    this.menuItems = [];
    this.isVisible = false;
  }

  addMenuItem(_text, _function, _idx) {
    if (_idx == null) _idx = this.menuItems.length;
    this.menuItems.splice(
      _idx,
      0,
      new MenuItem(_text, this.fontSize, this.group, _idx, _function)
    );
  }

  updateHighlight(_clientX, _clientY) {
    if (this.isVisible) {
      for (const x of this.menuItems) {
        x.unhighlight();
      }
      const menuMouseOver = document.elementsFromPoint(_clientX, _clientY);
      for (const x of this.menuItems) {
        if (menuMouseOver.includes(x.rect)) {
          x.highlight();
          break;
        }
      }
    }
  }

  getHighlighted() {
    if (this.isVisible) {
      for (const x of this.menuItems) {
        if (x.isHighlighted) return x;
      }
    }
    return;
  }

  getHighlightedText() {
    const highlighted = this.getHighlighted();
    return highlighted ? highlighted.svgText.text.textContent : undefined;
  }

  activateSelection(_selection = "highlighted") {
    if (_selection === "highlighted") _selection = this.getHighlightedText();

    const active = this.menuItems.find((_e) => _e.text == _selection);

    if (active) {
      return active.function();
    }

    return null;
  }
}

class MenuItem {
  rect;
  group;
  text;
  svgText;
  isHighlighted;
  functions;

  constructor(_text, _fontSize, _parent, _idx, _function) {
    this.text = _text;
    this.rect = document.createElementNS(namespace, "rect");
    this.group = document.createElementNS(namespace, "g");
    this.group.appendChild(this.rect);
    _parent.appendChild(this.group);
    this.svgText = new SVGText(_text, this.group, _idx, _fontSize);
    this.rect.setAttribute("fill", "rgba(0, 0, 0, 0)");
    this.rect.setAttribute("height", `${_fontSize * 1.2}`);
    this.rect.classList.add("menu-item");

    this.isHighlighted = false;
    this.function = _function;
  }

  highlight() {
    this.rect.classList.add("menu-highlight");
    this.isHighlighted = true;
  }

  unhighlight() {
    this.rect.classList.remove("menu-highlight");
    this.isHighlighted = false;
  }
}

function SVGText(_content, _parent, _id = -1, _fontSize = 10) {
  this.fontSize = _fontSize;
  this.xMargin = this.fontSize * 0.2;
  this.text = document.createElementNS(namespace, "text");
  this.text.textContent = _content;
  this.text.setAttribute("cursor", "default");
  this.text.classList.add(`menu-text-${_id}`);
  this.text.classList.add("menu-text");
  _parent.appendChild(this.text);
  this.text.setAttribute("x", `${this.xMargin}`);
  this.text.setAttribute("y", `${this.fontSize * 0.9}`);
  this.text.setAttribute("font-size", `${this.fontSize}px`);
}
