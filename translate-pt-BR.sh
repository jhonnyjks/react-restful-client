#!/bin/bash
mkdir -p node_modules/devexpress-richedit/localization-source
cp src/app/biddings/forms/RTFEditor/dx-rich.pt-BR.json node_modules/devexpress-richedit/localization-source
cd node_modules/devexpress-richedit
npm run localization