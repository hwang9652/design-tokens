
var Color = require('tinycolor2')
const StyleDictionaryPackage = require('style-dictionary');

// web
StyleDictionaryPackage.registerFormat({
  name: 'scss/variables',
  // name: 'css/variables',
  formatter (dictionary) {
    return dictionary.allProperties.map(prop => {
      if (prop.type == "fontSizes") {
        return `$${prop.name}: ${prop.value/10}rem;`
      } else if(prop.value instanceof Object) {
        const objectArray = [];
        const {entries} = Object;
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of entries(prop.value)) {
          // eslint-disable-next-line no-restricted-globals
          if (isNaN(value)) {
            objectArray.push(`\t${StyleDictionaryPackage.transform['name/cti/kebab'].transformer({path:[key]},{ prefix: '' })}: ${value};`);
          } else {
            objectArray.push(`\t${StyleDictionaryPackage.transform['name/cti/kebab'].transformer({path:[key]},{ prefix: '' })}: ${value/10}rem;`);
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
    return `<?xml version="1.0" encoding="UTF-8"?>\n\n<resources>\n${dictionary.allProperties.map(prop => {
      if (prop.type == "fontSizes") {
        return `\t<string name="${prop.name}">${prop.value/10}</string>`
      } else if(prop.type === "color") {
        var str = Color(prop.value).toHex8();
        return `\t<string name="${prop.name}">#${str.slice(6)}${str.slice(0,6)}</string>`
      } else if(prop.value instanceof Object) {
        const objectArray = [];
        const {entries} = Object;
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of entries(prop.value)) {
          // eslint-disable-next-line no-restricted-globals
          if (key === "fontSize") {
            objectArray.push(`\t<string name="${prop.name}-${StyleDictionaryPackage.transform['name/cti/kebab'].transformer({path:[key]},{ prefix: '' })}">${value/10}</string>`);
          } else {
            objectArray.push(`\t<string name="${prop.name}-${StyleDictionaryPackage.transform['name/cti/kebab'].transformer({path:[key]},{ prefix: '' })}">${value}</string>`);
          }
        }
        return objectArray.map(p => {
          return p
        }).join('\n');
      } else {
        return `\t<string name="${prop.name}">${prop.value}</string>`
      }
    }).join('\n')}\n</resources>`;
  }
});

// android - color
StyleDictionaryPackage.registerFormat({
  name: 'android/color',
  // name: 'css/variables',
  formatter (dictionary) {
    return `<?xml version="1.0" encoding="UTF-8"?>\n\n<resources>\n${dictionary.allProperties.map(prop => {
      if(prop.type === "color") {
        var str = Color(prop.value).toHex8();
        return `\t<color name="${prop.name}">#${str.slice(6)}${str.slice(0,6)}</color>\n`
      }
    }).join('')}</resources>`;
  }
});

// android - size
StyleDictionaryPackage.registerFormat({
  name: 'android/size',
  // name: 'css/variables',
  formatter (dictionary) {
    return `<?xml version="1.0" encoding="UTF-8"?>\n\n<resources>\n${dictionary.allProperties.map(prop => {
      if (prop.type == "fontSizes") {
        return `\t<string name="${prop.name}">${prop.value}dp</string>\n`
      } else if(prop.value instanceof Object) {
        const objectArray = [];
        const {entries} = Object;
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of entries(prop.value)) {
          // eslint-disable-next-line no-restricted-globals
          if (key === "fontSize") {
            objectArray.push(`\t<string name="${prop.name}-${StyleDictionaryPackage.transform['name/cti/kebab'].transformer({path:[key]},{ prefix: '' })}">${value}</string>\n`);
          }
        }
        return objectArray.map(p => {
          return p
        }).join('\n');
      }
    }).join('')}</resources>`;
  }
});

// android - font
StyleDictionaryPackage.registerFormat({
  name: 'android/font',
  // name: 'css/variables',
  formatter (dictionary) {
    return `<?xml version="1.0" encoding="UTF-8"?>\n\n<resources>\n${dictionary.allProperties.map(prop => {
      if(prop.type == "typography") {
        const objectArray = [];
        const {entries} = Object;
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of entries(prop.value)) {
          // eslint-disable-next-line no-restricted-globals
          if (key === "fontSize") {
            objectArray.push(`\t\t<item name="android:textSize">${value}dp</item>`);
          } else if(key === "fontWeight") {
            objectArray.push(`\t\t<item name="android:textStyle">${value}</item>`);
          } else if(key === "fontFamily") {
            objectArray.push(`\t\t<item name="android:${key}">${value}</item>`);
          }
        }

        return `\t<style name="${prop.name}">\n${objectArray.join('\n')}\n\t</style>\n`;
      }
    }).join('')}</resources>`;
  }
});

// ios
StyleDictionaryPackage.registerFormat({
  name: 'ios-swift/any.swift',
  // name: 'css/variables',
  formatter (dictionary) {
    return `import UIKit\n\npublic class StyleDictionaryClass {\n${dictionary.allProperties.map(prop => {

    if (prop.type == "fontSizes") {
      return `\tpublic static let ${prop.name} = ${prop.value}dp\n`
    } else if(prop.type === "color") {
      const { r, g, b, a } = Color(prop.value).toRgb();
      const rFixed = (r / 255.0).toFixed(3);
      const gFixed = (g / 255.0).toFixed(3);
      const bFixed = (b / 255.0).toFixed(3);
      
      return `\tpublic static let ${prop.name} = UIColor(red: ${rFixed}, green: ${gFixed}, blue: ${bFixed}, alpha: ${a})\n`;
    } else if(prop.type === "lineHeights") {
        const val = parseFloat(prop.value);

        // return `\tpublic static let ${prop.name} = ${val/100}`;
    } else if(prop.type === "fontFamily" || prop.type === "fontFamilies") {
      return `\tpublic static let ${prop.name} = "${prop.value}"\n`;
    } else if(prop.value instanceof Object) {
        const objectArray = [];
        const {entries} = Object;
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of entries(prop.value)) {
          // eslint-disable-next-line no-restricted-globals
          if (key === "fontFamily") {
            objectArray.push(`\tpublic static let ${prop.name}${StyleDictionaryPackage.transform['name/cti/camel'].transformer({path:[key]},{ prefix: '' })} = "${value}"\n`);
          } else if (key === "lineHeight") {
            const val = parseFloat(value);
    
            // objectArray.push(`\tpublic static let ${prop.name}${StyleDictionaryPackage.transform['name/cti/camel'].transformer({path:[key]},{ prefix: '' })} = ${val/100}`);
          } else if (key === "fontSize") {
            objectArray.push(`\tpublic static let ${prop.name}${StyleDictionaryPackage.transform['name/cti/camel'].transformer({path:[key]},{ prefix: '' })} = ${value}dp\n`);
          } else {
            objectArray.push(`\tpublic static let ${prop.name}${StyleDictionaryPackage.transform['name/cti/camel'].transformer({path:[key]},{ prefix: '' })} = ${value}\n`);
          }
        }
      
        return objectArray.map(p => {
          return p
        }).join('');
      } else {
        return `\tpublic static let ${prop.name} = ${prop.value}\n`
      }
    }).join('')}}`;
  }
});

// ios - color
StyleDictionaryPackage.registerFormat({
  name: 'ios-swift/color.swift',
  // name: 'css/variables',
  formatter (dictionary) {
    return `import UIKit\n\npublic class StyleDictionaryClass {\n${dictionary.allProperties.map(prop => {
      if(prop.type === "color") {
        const { r, g, b, a } = Color(prop.value).toRgb();
        const rFixed = (r / 255.0).toFixed(3);
        const gFixed = (g / 255.0).toFixed(3);
        const bFixed = (b / 255.0).toFixed(3);
        
        return `\tpublic static let ${prop.name} = UIColor(red: ${rFixed}, green: ${gFixed}, blue: ${bFixed}, alpha: ${a})\n`;
      }
    }).join('')}}`;
  }
});

// ios - size
StyleDictionaryPackage.registerFormat({
  name: 'ios-swift/size.swift',
  // name: 'css/variables',
  formatter (dictionary) {
    return `import UIKit\n\npublic class StyleDictionaryClass {\n${dictionary.allProperties.map(prop => {

    if (prop.type == "fontSizes") {
      return `\tpublic static let ${prop.name} = ${prop.value}dp\n`;
    } else if(prop.type === "lineHeights") {
        const val = parseFloat(prop.value);

        return `\tpublic static let ${prop.name} = ${val/100}\n`;
    } else if(prop.value instanceof Object) {
        const objectArray = [];
        const {entries} = Object;
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of entries(prop.value)) {
          // eslint-disable-next-line no-restricted-globals
          if (key === "lineHeight") {
            const val = parseFloat(value);
    
            objectArray.push(`\tpublic static let ${prop.name}${StyleDictionaryPackage.transform['name/cti/camel'].transformer({path:[key]},{ prefix: '' })} = ${val/100}\n`);
          } else if (key === "fontSize") {
            objectArray.push(`\tpublic static let ${prop.name}${StyleDictionaryPackage.transform['name/cti/camel'].transformer({path:[key]},{ prefix: '' })} = ${value}dp\n`);
          }
        }
      
        return objectArray.map(p => {
          return p
        }).join('');
      }
    }).join('')}}`;
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
          "destination": "color.xml",
          "format": "android/color",
        },{
          "destination": "styles.xml",
          "format": "android/font",
        }
        /*,{
          "destination": "tokens.xml",
          "format": "android/resources",
        },{
          "destination": "tokens-size.xml",
          "format": "android/size",
        }*/]
      },
      "ios-swift": {
        "transformGroup": "ios-swift",
        "buildPath": `build/ios-swift/`,
        "files": [{
          "destination": "tokens.swift",
          "format": "ios-swift/any.swift"
        }
        /*,{
          "destination": "tokens-color.swift",
          "format": "ios-swift/color.swift",
        },{
          "destination": "tokens-size.swift",
          "format": "ios-swift/size.swift",
        }
      */]
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
