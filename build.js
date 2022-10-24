const StyleDictionaryPackage = require('style-dictionary');

// web
StyleDictionaryPackage.registerFormat({
  name: 'scss/variables',
  // name: 'css/variables',
  formatter (dictionary) {
    return dictionary.allProperties.map(prop => {
      if(prop.value instanceof Object) {
        const objectArray = [];
        const {entries} = Object;
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of entries(prop.value)) {
          // eslint-disable-next-line no-restricted-globals
          if (isNaN(value)) {
            objectArray.push(`\t${StyleDictionaryPackage.transform['name/cti/kebab'].transformer({path:[key]},{ prefix: '' })}: ${value};`);
          } else {
            objectArray.push(`\t${StyleDictionaryPackage.transform['name/cti/kebab'].transformer({path:[key]},{ prefix: '' })}: ${value}px;`);
          }
        }
        return `%${prop.name} {\n${objectArray.join('\n')}\n}`;
      }
        return `$${prop.name}: ${prop.value};`

    }).join('\n');
    // return `:root {\n${dictionary.allProperties.map(prop => `  --${prop.name}: ${prop.value};`).join('\n')}\n}`
  }
});

// android
StyleDictionaryPackage.registerFormat({
  name: 'android/resources',
  // name: 'css/variables',
  formatter (dictionary) {
    return dictionary.allProperties.map(prop => {
      if(prop.value instanceof Object) {
        const objectArray = [];
        const {entries} = Object;
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of entries(prop.value)) {
          // eslint-disable-next-line no-restricted-globals
          objectArray.push(`<string name="${prop.name}-${StyleDictionaryPackage.transform['name/cti/kebab'].transformer({path:[key]},{ prefix: '' })}">${value}</string>`);
        }
        return objectArray.map(p => {
          return p
        }).join('\n');
      } else {
        return `<string name="${prop.name}">${prop.value}</string>`
      }
    }).join('\n');
    // return `:root {\n${dictionary.allProperties.map(prop => `  --${prop.name}: ${prop.value};`).join('\n')}\n}`
  }
});

function getStyleDictionaryConfig(platform) {
  return {
    "source": [
      "tokens/*.json",
    ],
    "platforms": {
      "web": {
        "transformGroup": "web",
        "buildPath": `build/web/`,
        "files": [{
          "destination": "tokens.scss",
          "format": "scss/variables"
        }]
      },
      "android": {
        "transformGroup": "android",
        "buildPath": `build/android/`,
        "files": [{
          "destination": "tokens.xml",
          "format": "android/resources",
        }]
      },
      "ios-swift": {
        "transformGroup": "ios-swift",
        "buildPath": `build/ios-swift/`,
        "files": [{
          "destination": "StyleDictionary.swift",
          "format": "ios-swift/any.swift",
          "className": "StyleDictionaryClass"
        }]
      }
    }
  };
}

console.log('Build started...');

// PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS

['web', 'ios-swift', 'android'].map(function (platform) {

  console.log('\n==============================================');
  console.log(`\nProcessing: [${platform}]`);

  const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(platform));

  StyleDictionary.buildPlatform(platform);

  console.log('\nEnd processing');

})

console.log('\n==============================================');
console.log('\nBuild completed!');
