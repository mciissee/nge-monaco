mkdir dist/nge-monaco/assets
mkdir dist/nge-monaco/assets/monaco

cp -rf node_modules/monaco-editor/min dist/nge-monaco/assets/monaco/min
cp -rf node_modules/monaco-editor/min-maps dist/nge-monaco/assets/monaco

cp -rf ./projects/nge-monaco/src/lib/themes ./dist/nge-monaco/assets/themes
cp -rf ./README.md ./dist/nge-monaco
cp -rf ./LICENSE ./dist/nge-monaco
cp -rf ./CHANGELOG.md ./dist/nge-monaco
