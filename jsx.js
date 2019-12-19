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
 * @param {string|function} tag - mandatory tag name or function to create tag
 * @param {Object|null} [attributes] - element attributes
 * @param {...*} [content] - element content (primitive value/values or other nodes)
 * @return {Object} HTML element with links
 */
dom.tag = function ( tag, attributes, content ) {
    var links = {},
        $node, index, name, argument;

    if ( typeof tag === 'function' ) {
        // fragment
        $node = tag();
    } else {
        // empty element
        $node = document.createElement(tag);
    }


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
        } else if ( Array.isArray(argument) ) {
            argument.forEach(element => {
                if ( element.$node ) {
                    $node.appendChild(element.$node);
                } else {
                    $node.appendChild(document.createTextNode(element));
                }
            });
        } else {
            $node.appendChild(document.createTextNode(argument));
        }
    }

    return {$node: $node, links: links};
};


/**
 * Create DocumentFragment element
 *
 * @return {DocumentFragment}
 */
dom.fragment = function () {
    return document.createDocumentFragment();
};


// public
module.exports = dom;
