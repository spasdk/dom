/**
 * HTML elements low-level handling for JSX.
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
 * @return {Object} HTML element with links
 */
dom.tag = function ( tagName, attributes, content ) {
    var links = {},
        $node, index, name, argument;

    console.assert(arguments.length > 0, 'wrong arguments number');
    console.assert(typeof tagName === 'string', 'wrong tagName type');
    console.assert(tagName.length > 0, 'empty tagName');

    // empty element
    $node = document.createElement(tagName);

    // optional attribute list is given
    if ( attributes && typeof attributes === 'object' ) {
        // apply link and clear attributes
        if ( attributes.link ) {
            links[attributes.link] = $node;
            attributes.link = null;
        }

        for ( name in attributes ) {
            console.assert(typeof name === 'string', 'wrong attribute name type');
            console.assert(name.length > 0, 'empty attribute name');

            if ( attributes[name] !== null ) {
                // extend a new node with the given attributes
                $node[name] = attributes[name];
            }
        }
    }

    // content (arguments except the first two)
    for ( index = 2; index < arguments.length; index++ ) {
        argument = arguments[index];

        if ( argument && argument.$node ) {
            $node.appendChild(argument.$node);

            for ( name in argument.links ) {
                links[name] = argument.links[name];
            }
        } else {
            $node.appendChild(document.createTextNode(argument));
        }
    }

    return {$node: $node, links: links};
};


// public
module.exports = dom;
