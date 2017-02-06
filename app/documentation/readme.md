MyTLE
=====

Overview
--------


Structure
-----------

```
+-- app/
|   +-- css/
|   +-- documentation/
|   +-- img/
|   +-- js/
|   +-- i18n/
|   +-- pages/
|   +-- vendor/
|   +-- views/
+-- master/
|   +-- js/
|   |   +-- modules/
|   |   +-- custom/
|   +-- less/
|   |   +-- app/
|   |   +-- bootstrap/
|   |   +-- themes/
|   +-- sass/
|   +-- gulpfile.js
|   +-- package.json
|   +-- bower.json
+-- server/
|   +-- *.json
+-- vendor/
+-- index.html
```
---

### Lazy Load

This app requires only the necessary scripts according to the view that is loaded saving tons unnecessary request to the server.

The lazy load is handled by a custom core function based on the plugin [ocLazyLoad](https://github.com/ocombe/ocLazyLoad)
