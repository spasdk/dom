/**
 * HTML elements low-level handling.
 *
 * @license The MIT License (MIT)
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

/* eslint no-unused-vars: 0 */

/**
 * DOM manipulation module
 */
var dom = {};


/**
 * Create a new HTML element.
 *
 * @param {string} tagName - mandatory tag name
 * @param {Object|null} [attributes] - element attributes
 * @param {...*} [content] - element content (primitive value/values or other nodes)
 * @return {Element|null} HTML element or null on failure
 *
 * @example
 * dom.tag('table');
 * dom.tag('div', {}, 'some text');
 * dom.tag('div', {className: 'top'}, dom.tag('span'), dom.tag('br'));
 * dom.tag('link', {rel: 'stylesheet', type: 'text/css', href: 'http://some.url/'});
 */
dom.tag = function ( tagName, attributes, content ) {
    var $node, index, name, argument;

    console.assert(arguments.length > 0, 'wrong arguments number');
    console.assert(typeof tagName === 'string', 'wrong tagName type');
    console.assert(tagName.length > 0, 'empty tagName');

    // empty element
    $node = document.createElement(tagName);

    // optional attribute list is given
    if ( attributes && typeof attributes === 'object' ) {
        for ( name in attributes ) {
            console.assert(typeof name === 'string', 'wrong attribute name type');
            console.assert(name.length > 0, 'empty attribute name');

            // extend a new node with the given attributes
            $node[name] = attributes[name];
        }
    }

    // content (arguments except the first two)
    for ( index = 2; index < arguments.length; index++ ) {
        argument = arguments[index];

        // element/text node or plain data
        $node.appendChild(argument.nodeType ? argument : document.createTextNode(argument));
    }

    return $node;
};


/**
 * Create a new DocumentFragment filled with the given non-empty elements if any.
 *
 * @param {...*} [content] - fragment content (primitive value/values or other nodes)
 * @return {DocumentFragment} new placeholder
 *
 * @example
 * // gives an empty fragment element
 * dom.fragment();
 * // gives a fragment element with 3 div element inside
 * dom.fragment(dom.tag('div'), div2, div3);
 * // mixed case
 * dom.fragment('some text', 123, div3);
 */
dom.fragment = function ( content ) {
    // prepare placeholder
    var $fragment = document.createDocumentFragment(),
        index, argument;

    console.assert(arguments.length > 0, 'wrong arguments number');

    // walk through all the given elements
    for ( index = 0; index < arguments.length; index++ ) {
        argument = arguments[index];

        // element/text node or plain data
        $fragment.appendChild(argument.nodeType ? argument : document.createTextNode(argument));
    }

    return $fragment;
};


/**
 * Add the given non-empty data (HTML element/text or list) to the destination element.
 *
 * @param {Element} target - element to receive children
 * @param {...*} [content] - element content (primitive value/values or other nodes)
 * @return {Element|null} the destination element - owner of all added data
 *
 * @example
 * // simple text value
 * dom.add(some_div, 'Hello world');
 * // single DOM Element
 * dom.add(some_div, some_other_div);
 * // DOM Element list
 * dom.add(some_div, div1, div2, div3);
 * // mixed case
 * dom.add(some_div, div1, 'hello', 'world');
 */
dom.add = function ( target, content ) {
    var index, argument;

    console.assert(arguments.length > 1, 'wrong arguments number');
    console.assert(target instanceof Element, 'wrong target type');

    // append all except the first one
    for ( index = 1; index < arguments.length; index++ ) {
        argument = arguments[index];

        // regular HTML tag or plain data
        target.appendChild(argument.nodeType ? argument : document.createTextNode(argument));
    }

    return target;
};


/**
 * Remove the given nodes from the DOM.
 *
 * @param {...*} [content] - node to be removed
 * @return {boolean} operation status (true - all given nodes removed)
 *
 * @example
 * dom.remove(document.querySelector('div.test'));
 * dom.remove(div1, div2, div3);
 */
dom.remove = function ( content ) {
    // amount of successfully removed nodes
    var count = 0,
        index, argument;

    // walk through all the given elements
    for ( index = 0; index < arguments.length; index++ ) {
        argument = arguments[index];

        // valid non-empty tag
        if ( argument && argument.parentNode ) {
            if ( argument.parentNode.removeChild(argument) === argument ) {
                count++;
            }
        }
    }

    return arguments.length > 0 && count === arguments.length;
};


/**
 * Remove all element children.
 *
 * @param {Element} $node - element to be cleared
 */
dom.clear = function ( $node ) {
    while ( $node.lastChild ) {
        $node.removeChild($node.lastChild);
    }
};


// public
module.exports = dom;
