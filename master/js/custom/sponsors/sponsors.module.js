(function() {
    'use strict';

    angular
        .module('app.sponsors', ['datatables', 'datatables.tabletools'])
        .factory('DTLoadingTemplate', dtLoadingTemplate);

        function dtLoadingTemplate() {
	        return {
	            html:   '<div class ="loading-bar">' +
	                        '<h3 class="dt-loading">Loading...</h3>' + 
	                        '<div class="ball-scale-multiple">' +
	                            '<div></div>' +
	                            '<div></div>' +
	                            '<div></div>' +
	                        '</div>' +
	                    '</div>'
	        };
	    }
})();
