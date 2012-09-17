#!/bin/bash

APP_NAME=runbookmarklet
PUSH_TO_DEVICE=1
ANDROID_APP_ID=org.mozilla.fennec

if [ -f "$APP_NAME.xpi" ]; then
	echo "Deleting $APP_NAME.xpi"
	rm "$APP_NAME.xpi"
fi

echo "Zipping $APP_NAME.xpi"

zip -r $APP_NAME.xpi install.rdf bootstrap.js chrome.manifest content defaults -x .*




if [ $PUSH_TO_DEVICE = 1 ]; then

  echo "Pushing $APP_NAME.xpi"


  adb push ./$APP_NAME.xpi /sdcard/$APP_NAME.xpi
  adb shell am start -a android.intent.action.VIEW \
                     -c android.intent.category.DEFAULT \
                     -d file:///mnt/sdcard/$APP_NAME.xpi \
                     -n $ANDROID_APP_ID/.App
  
  echo "Pushed $APP_NAME.xpi to $ANDROID_APP_ID"

fi
