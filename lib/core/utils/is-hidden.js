

/**
 * Determine whether an element is visible
 *
 * @param {HTMLElement} el The HTMLElement
 * @return {Boolean} The element's visibilty status
 */
function checkHidden(el, recursed) {
	'use strict';

	// 9 === Node.DOCUMENT
	if (el.nodeType === 9) {
		return false;
	}

	var style = window.getComputedStyle(el, null);

	if (!style || (!el.parentNode || (style.getPropertyValue('display') === 'none' ||

			(!recursed &&
				// visibility is only accurate on the first element
				(style.getPropertyValue('visibility') === 'hidden')) ||

			(el.getAttribute('aria-hidden') === 'true')))) {

		return true;
	}

	return axe.utils.isHidden(el.parentNode, true);

}

// version using builtin Map
// TODO: not enough browser support

// map of isRecursed -> dom-element -> isHidden
var isHiddenCache;
var isHiddenCount = 0;
axe.utils.isHidden = function isHidden(el, recursed) {
	'use strict';
	if (!isHiddenCache) {
		axe.utils.resetIsHiddenCache();
	}
	recursed = !!recursed;
	if (isHiddenCache.get(recursed).has(el)) {
		axe.log('cache  hit: ', ++isHiddenCount, recursed, axe.utils.getSelector(el));
		return isHiddenCache.get(recursed).get(el);
	}

	axe.log('cache miss: ', ++isHiddenCount, recursed, axe.utils.getSelector(el));
	var hidden = checkHidden(el, recursed);
	isHiddenCache.get(recursed).set(el, hidden);
	return hidden;
};

axe.utils.resetIsHiddenCache = function resetIsHiddenCache() {
	isHiddenCache = new Map().set(true, new Map()).set(false, new Map());
};

// TODO: I've got no idea how one imports packages in this system...
//
// import { Map as ImmMap } from 'immutable';
// var isHiddenCache;
// var isHiddenCount = 0;
// axe.utils.isHidden = function isHidden(el, recursed) {
// 	'use strict';
// 	if (!isHiddenCache) {
// 		axe.utils.resetIsHiddenCache();
// 	}
// 	recursed = !!recursed;
// 	if (isHiddenCache.hasIn([recursed, el])) {
// 		console.log('cache  hit: ', ++isHiddenCount, recursed, axe.utils.getSelector(el));
// 		return isHiddenCache.getIn([recursed, el]);
// 	}
//
// 	console.log('cache miss: ', ++isHiddenCount, recursed, axe.utils.getSelector(el));
// 	var hidden = checkHidden(el, recursed);
// 	isHiddenCache.setIn([recursed, el], hidden);
// 	return hidden;
// };
//
// axe.utils.resetIsHiddenCache = function resetIsHiddenCache() {
// 	isHiddenCache = new ImmMap([[true, new ImmMap()], [false, new ImmMap()]]);
// };
