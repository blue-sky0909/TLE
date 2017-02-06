/*!
 *
 * Angle - Bootstrap Admin App + AngularJS
 *
 * Version: 3.3.1
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 *
 */

// APP START
// -----------------------------------

(function() {
    'use strict';

    angular
        .module('angle', [
            'app.core',
            'app.routes',
            'app.sidebar',
            'app.navsearch',
            'app.preloader',
            'app.loadingbar',
            'app.translate',
            'app.settings',
            'app.dashboard',
            'app.icons',
            'app.flatdoc',
            'app.notify',
            'app.bootstrapui',
            'app.elements',
            'app.panels',
            'app.charts',
            'app.forms',
            'app.locale',
            'app.maps',
            'app.pages',
            'app.tables',
            'app.extras',
            'app.mailbox',
            'app.utils',
            'app.childrens',
            'app.sponsors',
            'app.teachers',
            'app.classrooms',
            'app.logs',
            'app.coupons',
            'app.activity',
            'app.token',
			'app.auth',
            'app.api',
            'app.idle',
            'oitozero.ngSweetAlert'
        ]);
})();
