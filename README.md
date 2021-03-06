# Qooxdoo Dialog Widgets

see http://cboulanger.github.io/qx-contrib-Dialog/

A set of often used dialog widgets for the qooxdoo framework.

- Alert
- Confirm
- Form
- Login
- Prompt
- Select
- Wizard
- Progress

Demo: http://cboulanger.github.io/qx-contrib-Dialog/build/index.html

API Viewer: http://cboulanger.github.io/qx-contrib-Dialog/api/index.html#dialog

See [Demo app](demo/default/source/class/dialog/demo/Application.js) for
examples how to use the widgets.

## Installation:

### Using the new CLI/compiler (qx >= v6)
`qx contrib install cboulanger/qx-contrib-Dialog`

### Using the generator (qx <= v5)
- Download and extract ZIP to a folder in your project
- in your qooxdoo project's config.json "jobs"/"libraries"/"library" section, add
  ```
  {
    "manifest": "path/to/qx-contrib-Dialog/Manifest.json"
  }
  ```
  
### Install icon theme
From v1.3.0 on, the contrib allows you to 
use custom icons for the dialogs. However, this means that the icons will not work out of the box. You must use or extend [one of the shipped icon themes](source/class/dialog/theme/icon) in your application's meta theme (see [this example](source/class/dialog/theme/Theme.js)) or copy the alias definitions from one of them into your own icon theme. You can also use your own choice of icons by writing an icon theme which defines defining the aliases "dialog.icon.(ok|cancel|info|warning|error)" with the paths to the icons. Those paths also need to be put into a `@asset` compiler hint.
See, for example, [this theme class](source/class/dialog/theme/icon/IcoMoonFree.js).

## Changelog
v1.3.3
- integrate demo application into library code, now you can simply do `qx serve` to run the demo.

v1.3.1
- fix alias names

v1.3.0
- Compatible with qooxdoo 5.x and 6.x: added support for new JS compiler
- Merged changes from https://github.com/jbruwes/qooxdialog
  - replaced base widget qx.ui.GroupBox with modal qx.ui.window.Window
- Added new black and white SVG icons from https://icomoon.io/#preview-free, added support
  for live icon theme switching
- Added promise() method returning a Promise as an alternative to callbacks
- Promisified all shorthand methods (dialog.alert, ...), resulting in massively
  better readability [see Demo app](demo/default/source/class/dialog/demo/Application.js#L193)
- Added caption parameter to shorthand methods.
- Since a modal window has its own blocker, the  default coloured blocker has
  been removed. If you want the old behavior, call `dialog.Dialog.useBlocker(true)`.
- Prettified with the default settings of https://github.com/prettier/prettier
- Added 'cancelOnEscape' property (default: true) which triggers the 'cancel'
  button action if the user presses the Escape key and 'allowCancel' is true.
- Progress Widget enhancements:
  - added 'hideWhenCancelled' property (default: true) to allow "cleanup" or
    similar actions to be displayed after the cancel button has been pressed.  

v1.2
- fixed a bug that prevented submitting the login dialog by pressing enter
  (patch by @novij)
- added "Forgot Password?" button to login widget

v1.1
- compatible with qooxdoo v4.0
- Progress dialog widget added

v1.0
- compatible with qooxdoo v3.5

## TODO
- The form widget needs to use an array instead of a map for defining form fields (breaking change in v2.0)
- Tab and focus handling is still buggy: Users can tab into non-modal widgets.
- Rewrite using child controls, to make dialogs truly themeable.
