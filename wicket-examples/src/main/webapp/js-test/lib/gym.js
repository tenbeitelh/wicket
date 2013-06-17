/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

;(function ($) {

	'use strict';

	var load = function(url) {
	    var deferred = $.Deferred();
	    _onPageLoad(function(iframe, $$) {
	        deferred.resolve(iframe, $$);
	    });
	    _getIframe().attr('src', url);

	    return deferred;
	}

	var click = function($btn) {
	    var deferred = $.Deferred();
	    _onPageLoad(function(iframe, $$) {
	        deferred.resolve(iframe, $$);
	    });

		$btn.click();

	    return deferred;
	}

	// private
	var _getIframe = function() {
		return $('#applicationFrame');
	}

	// private
	var _onPageLoad = function(toExecute) {

		_getIframe()
			.off('load')
			.on('load', function() {
				$(this).off('load');

				var newIframe, $$;

				newIframe = window.frames[0];
				$$ = newIframe.jQuery || _jQueryWithContext;

				//debug(newIframe);

				toExecute.call(newIframe, $$);
			});
	};

	/**
	 * Non-Ajax pages do not have jQuery so we use
	 * $ with context to simulate it
	 */
	// private
	var _jQueryWithContext = function(selector) {
		return $(selector, _getIframe().contents());
	};

	var ajaxClick = function($btn) {
		var deferred = $.Deferred();
		var iframeWindow = _getIframe()[0].contentWindow;

		_onAjaxComplete(iframeWindow, function($$) {
			deferred.resolve($$);
		});

		$btn.click();

		return deferred;
	}

	/**
	 * Registers a callback when Wicket Ajax call is completed
	 */
	// private
	var _onAjaxComplete = function(iframe, toExecute) {

		// unregister any leaked subscriber
		iframe.jQuery(iframe.document).off('/ajax/call/complete');

		// register the requested subscriber
		iframe.Wicket.Event.subscribe('/ajax/call/complete', function(jqEvent, attributes, jqXHR, textStatus) {
			// immediately unregister this subscriber
			iframe.jQuery(iframe.document).off('/ajax/call/complete');

			// call back
			var $$ = iframe.jQuery || _jQueryWithContext;
			toExecute($$);
		});
	};

	var debug = function(iframe) {
		"use strict";

		console.log('Current url: ', iframe.window.location.href);
	};

	window.gym = {
		load: load,
		click: click,
		ajaxClick: ajaxClick
	};
})($q);