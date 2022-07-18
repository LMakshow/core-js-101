/* eslint-disable max-classes-per-file */
/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() { return this.width * this.height; },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CssSelector {
  constructor() {
    this.cssClasses = [];
    this.cssAttribute = [];
    this.cssPseudoClass = [];
  }

  element(value) {
    if (this.cssElement) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this.cssId || this.cssClasses.length || this.cssAttribute.length || this.cssPseudoClass.length || this.cssPseudoElement) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.cssElement = value;
    return this;
  }

  id(value) {
    if (this.cssId) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this.cssClasses.length || this.cssAttribute.length || this.cssPseudoClass.length || this.cssPseudoElement) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.cssId = value;
    return this;
  }

  class(value) {
    if (this.cssAttribute.length || this.cssPseudoClass.length || this.cssPseudoElement) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.cssClasses.push(value);
    return this;
  }

  attr(value) {
    if (this.cssPseudoClass.length || this.cssPseudoElement) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.cssAttribute.push(value);
    return this;
  }

  pseudoClass(value) {
    if (this.cssPseudoElement) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.cssPseudoClass.push(value);
    return this;
  }

  pseudoElement(value) {
    if (this.cssPseudoElement) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.cssPseudoElement = value;
    return this;
  }

  stringify() {
    let string = '';
    if (this.cssElement) string += `${this.cssElement}`;
    if (this.cssId) string += `#${this.cssId}`;
    if (this.cssClasses) {
      this.cssClasses.forEach((e) => {
        string += `.${e}`;
      });
    }
    if (this.cssAttribute) {
      this.cssAttribute.forEach((e) => {
        string += `[${e}]`;
      });
    }
    if (this.cssPseudoClass) {
      this.cssPseudoClass.forEach((e) => {
        string += `:${e}`;
      });
    }
    if (this.cssPseudoElement) string += `::${this.cssPseudoElement}`;
    return string;
  }
}

class CssCombine {
  constructor(string1, combinator, string2) {
    this.cssString = `${string1} ${combinator} ${string2}`;
  }

  stringify() {
    return this.cssString;
  }
}

const cssSelectorBuilder = {
  element(value) {
    const t = new CssSelector();
    return t.element(value);
  },

  id(value) {
    const t = new CssSelector();
    return t.id(value);
  },

  class(value) {
    const t = new CssSelector();
    return t.class(value);
  },

  attr(value) {
    const t = new CssSelector();
    return t.attr(value);
  },

  pseudoClass(value) {
    const t = new CssSelector();
    return t.pseudoClass(value);
  },

  pseudoElement(value) {
    const t = new CssSelector();
    return t.pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new CssCombine(selector1.stringify(), combinator, selector2.stringify());
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
