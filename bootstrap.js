
const Cc = Components.classes;
const Ci = Components.interfaces;

Components.utils.import("resource://gre/modules/Services.jsm");

const prefName = "extensions.runbookmarklet.url";

var menuId;


 
function loadIntoWindow(window) {
	if (!window){
    	return;
	}
	
	menuId = window.NativeWindow.menu.add("Run Bookmarklet", null, function() {
		
		if(Services.prefs.prefHasUserValue(prefName)){

			var bookmarkUrl = Services.prefs.getCharPref(prefName);

			if(bookmarkUrl.indexOf('%s') !== false){
			
				var tabUrl = window.BrowserApp.selectedTab.window.document.location;
				
				bookmarkUrl = bookmarkUrl.replace('%s', encodeURIComponent(tabUrl));
				
			}

			window.BrowserApp.loadURI(bookmarkUrl);
		
		}

	});
}
 
function unloadFromWindow(window) {
	if(!window){
		return;
	}

	window.NativeWindow.menu.remove(menuId);

}






/**
 * bootstrap.js API
 */
var windowListener = {
  onOpenWindow: function(aWindow) {
    // Wait for the window to finish loading
    let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
    domWindow.addEventListener("load", function() {
      domWindow.removeEventListener("load", arguments.callee, false);
      loadIntoWindow(domWindow);
    }, false);
  },
  
  onCloseWindow: function(aWindow) {
  },
  
  onWindowTitleChange: function(aWindow, aTitle) {
  }
};

function startup(aData, aReason) {
  // Load into any existing windows
  let windows = Services.wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    loadIntoWindow(domWindow);
  }

  // Load into any new windows
  Services.wm.addListener(windowListener);
}

function shutdown(aData, aReason) {
  // When the application is shutting down we normally don't have to clean
  // up any UI changes made
  if (aReason == APP_SHUTDOWN)
    return;

  // Stop listening for new windows
  Services.wm.removeListener(windowListener);

  // Unload from any existing windows
  let windows = Services.wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    unloadFromWindow(domWindow);
  }
}

function install(aData, aReason) {
}

function uninstall(aData, aReason) {
}
