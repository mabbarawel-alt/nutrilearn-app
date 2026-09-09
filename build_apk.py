import os
import zipfile

apk_path = os.path.join(os.path.dirname(__file__), 'NutriLearn.apk')
base_dir = os.path.dirname(__file__)

print("Building NutriLearn.apk package...")

with zipfile.ZipFile(apk_path, 'w', zipfile.ZIP_DEFLATED) as apk:
    # AndroidManifest.xml
    manifest_content = (
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<manifest xmlns:android="http://schemas.android.com/apk/res/android"\n'
        '    package="org.nutrilearn.app"\n'
        '    android:versionCode="1"\n'
        '    android:versionName="1.0.0">\n'
        '    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="34" />\n'
        '    <uses-permission android:name="android.permission.INTERNET" />\n'
        '    <application\n'
        '        android:label="NutriLearn"\n'
        '        android:icon="@drawable/icon"\n'
        '        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">\n'
        '        <activity android:name=".MainActivity" android:exported="true">\n'
        '            <intent-filter>\n'
        '                <action android:name="android.intent.action.MAIN" />\n'
        '                <category android:name="android.intent.category.LAUNCHER" />\n'
        '            </intent-filter>\n'
        '        </activity>\n'
        '    </application>\n'
        '</manifest>'
    )
    apk.writestr('AndroidManifest.xml', manifest_content.encode('utf-8'))

    # META-INF
    apk.writestr('META-INF/MANIFEST.MF', 'Manifest-Version: 1.0\nCreated-By: NutriLearn Packager 1.0\n\n'.encode('utf-8'))

    # Bundle all web application assets into assets/www/
    for root, dirs, files in os.walk(base_dir):
        # Ignore git, build script itself, and output APK
        if '.git' in root:
            continue
        for file in files:
            if file in ['NutriLearn.apk', 'build_apk.py', 'NutriLearn-Windows.bat']:
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, base_dir)
            arcname = f"assets/www/{rel_path.replace(os.sep, '/')}"
            apk.write(full_path, arcname=arcname)
            print(f"  Packaged: {arcname}")

print(f"Success: NutriLearn.apk generated ({os.path.getsize(apk_path)} bytes).")
