/* ************************************************************************

   qooxdoo dialog library
   https://github.com/cboulanger/qx-contrib-Dialog

   Copyright:
     2007-2017 Christian Boulanger and others

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

************************************************************************ */
/*global qx dialog*/

/**
 * A dialog for authentication and login.
 *
 * The "callback" property containing a function is used as an (optional) final
 * callback after authentication has take place. This final callback will be
 * called with an truthy value as first argument (the error message/object) if
 * authentication has FAILED or with a falsy value (null/undefined) as first
 * argument, plus with a second optional argument (that can contain user
 * information) if it was SUCCESSFUL. The authenticating function must now be
 * stored in the checkCredentials property.
 */
qx.Class.define("dialog.Login", {
  extend: dialog.Dialog,
  properties: {

    /**
     * A html text that is displayed below the image (if present) and above the
     * login
     */
    text: {
      check: "String",
      nullable: true,
      apply: "_applyText"
    },

    /**
     * The name of the font in the theme that should be applied to
     * the text
     */
    textFont: {
      check: "String",
      nullable: true,
      init: "bold",
      apply: "_applyTextFont"
    },

    /**
     * An asyncronous function to check the given credentials.
     * The function signature is (username, password, callback). In case the
     * login fails, the callback must be called with a string that can be
     * alerted to the user or the error object if the problem is not due to
     * authentication itself. If the login succeeds, the argument must be
     * undefined or null. You can pass a second argument containing user
     * information.
     */
    checkCredentials: {
      check: "Function",
      nullable: false
    },

    /**
     * Whether to show a button with "Forgot Password?"
     */
    showForgotPassword: {
      check: "Boolean",
      nullable: false,
      init: false,
      event: "changeShowForgotPassword"
    },

    /**
     * The function that is called when the user clicks on the "Forgot Password?"
     * button
     */
    forgotPasswordHandler: {
      check: "Function"
    }
  },

  events: {
    /**
     * Event dispatched when login was successful
     */
    loginSuccess: "qx.event.type.Data",

    /**
     * Data event dispatched when login failed, event data
     * contains a reponse message
     */
    loginFailure: "qx.event.type.Data"
  },

  members: {
    _text: null,
    _username: null,
    _password: null,

    /**
     * Apply function used by proterty {@link #text}
     * @param value {String} New value
     * @param old {String} Old value
     */
    _applyText: function(value, old) {
      this._text.setValue(value);
      this._text.setVisibility(value ? "visible" : "excluded");
    },

    /**
     * Apply function used by proterty {@link #textFont}
     * @param value {String} New value
     */
    _applyTextFont: function(value) {
      this._text.setFont(value);
    },

    /**
     * Create the main content of the widget
     */
    _createWidgetContent: function() {
      var container = new qx.ui.container.Composite();
      var layout = new qx.ui.layout.VBox(10);
      layout.setAlignX("center");
      container.setLayout(layout);
      this.add(container);
      this._image = new qx.ui.basic.Image();
      this._image.setVisibility("excluded");
      container.add(this._image);
      this._text = new qx.ui.basic.Label();
      this._text.setAllowStretchX(true);
      this._text.setVisibility("excluded");
      this.setTextFont("bold");
      container.add(this._text);
      var gridContainer = new qx.ui.container.Composite();
      var gridLayout = new qx.ui.layout.Grid(9, 5);
      gridLayout.setColumnAlign(0, "right", "top");
      gridLayout.setColumnAlign(2, "right", "top");
      gridLayout.setColumnMinWidth(0, 50);
      gridLayout.setColumnFlex(1, 2);
      gridContainer.setLayout(gridLayout);
      gridContainer.setAlignX("center");
      gridContainer.setMinWidth(200);
      gridContainer.setMaxWidth(400);
      container.add(gridContainer);
      var labels = [this.tr("Name"), this.tr("Password")];
      for (var i = 0; i < labels.length; i++) {
        gridContainer.add(
          new qx.ui.basic.Label(labels[i]).set({
            allowShrinkX: false,
            paddingTop: 3
          }),
          {
            row: i,
            column: 0
          }
        );
      }
      this._username = new qx.ui.form.TextField();
      this._password = new qx.ui.form.PasswordField();
      this._password.addListener(
        "keypress",
        function(e) {
          if (e.getKeyIdentifier() == "Enter") {
            this._callCheckCredentials();
          }
        },
        this
      );
      gridContainer.add(
        this._username.set({
          allowShrinkX: false,
          paddingTop: 3
        }),
        {
          row: 0,
          column: 1
        }
      );
      gridContainer.add(
        this._password.set({
          allowShrinkX: false,
          paddingTop: 3
        }),
        {
          row: 1,
          column: 1
        }
      );
      this._message = new qx.ui.basic.Label();
      this._message.setRich(true);
      this._message.setAllowStretchX(true);
      this._message.setVisibility("excluded");
      container.add(this._message);
      var loginButton = (this._loginButton = new qx.ui.form.Button(
        this.tr("Login")
      ));
      loginButton.setAllowStretchX(false);
      loginButton.addListener("execute", this._callCheckCredentials, this);
      var cancelButton = this._createCancelButton();
      var forgotPasswordButton = new qx.ui.form.Button(
        this.tr("Forgot Password?")
      );
      forgotPasswordButton.addListener(
        "click",
        function() {
          this.getForgotPasswordHandler()();
        },
        this
      );
      this.bind("showForgotPassword", forgotPasswordButton, "visibility", {
        converter: function(v) {
          return v ? "visible" : "excluded";
        }
      });
      var buttonPane = new qx.ui.container.Composite();
      buttonPane.setLayout(new qx.ui.layout.HBox(5));
      buttonPane.add(loginButton);
      buttonPane.add(cancelButton);
      buttonPane.add(forgotPasswordButton);
      gridContainer.add(buttonPane, {
        row: 3,
        column: 1
      });
    },

    /**
     * Calls the checkCredentials callback function with username, password and
     * the final callback, bound to the context object.
     */
    _callCheckCredentials: function() {
      this.getCheckCredentials()(
        this._username.getValue(),
        this._password.getValue(),
        typeof Function.prototype.bind === "function" ?
          this._handleCheckCredentials.bind(this) :
          qx.lang.Function.bind(this._handleCheckCredentials, this)
      );
    },

    /**
     * Handle click on cancel button
     */
    _handleCancel: function() {
      this.hide();
    },

    /**
     * Handler function called from the function that checks the credentials
     * with the result of the authentication process.
     * @param err {String|Error|null} If null, the authentication was successful
     * and the "loginSuccess" event is dispatched. If String or Error, the
     * "loginFailure" event is dispatched with the error message/object.
     * Finally, the callback function in the callback property is called with
     * null (success) or the error value.
     * @param data {unknown|undefined} Optional second argument wich can contain
     * user information
     */
    _handleCheckCredentials: function(err, data) {
      this._password.setValue("");
      this.setMessage(null);
      if (err) {
        this.fireDataEvent("loginFailure", err);
        this._password.focus();
      } else {
        this.fireDataEvent("loginSuccess", data);
        this.hide();
      }
      if (this.getCallback()) {
        this.getCallback()(err, data);
      }
    },

    /**
     * @override
     */
    hide: function() {
      this._password.setValue("");
      this.setMessage(null);
      this.base(arguments);
    }
  }
});
