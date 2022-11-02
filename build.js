
var Color = require('tinycolor2')
const StyleDictionaryPackage = require('style-dictionary');

// web - color
StyleDictionaryPackage.registerFormat({
  name: 'scss/color',
  formatter (dictionary) {
    return dictionary.allProperties.map(prop => {
      if(prop.type === "color") {
        if(prop.value.length > 8) {
          const { r, g, b, a } = Color(prop.value).toRgb();
          return `$${prop.name}: rgba(${r}, ${g}, ${b}, ${a});\n`
        } else {
          return `$${prop.name}: ${prop.value};\n`
        }
      }
    }).join('');
  }
});

// web - font
StyleDictionaryPackage.registerFormat({
  name: 'scss/font',
  formatter (dictionary) {
    return dictionary.allProperties.map(prop => {
      if(prop.type.includes('font')) {
        if (isNaN(prop.value)) {
          return `$${prop.name}: ${prop.value};\n`
        } else {
          return `$${prop.name}: ${prop.value}px;\n`
        }
      } else if(prop.type == "typography") {
        const objectArray = [];
        const {entries} = Object;
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of entries(prop.value)) {
          // eslint-disable-next-line no-restricted-globals
          if (!value == "") {
            if (isNaN(value)) {
              objectArray.push(`\t${StyleDictionaryPackage.transform['name/cti/kebab'].transformer({path:[key]},{ prefix: '' })}: ${value};\n`);
            } else {
              objectArray.push(`\t${StyleDictionaryPackage.transform['name/cti/kebab'].transformer({path:[key]},{ prefix: '' })}: ${value}px;\n`);
            }
          }
        }

        return `%${prop.name} {\n${objectArray.join('')}}\n`;
      }
    }).join('');
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
            if (value !== "Regular") {
              objectArray.push(`\t\t<item name="android:textStyle">${value.toLowerCase()}</item>`);
            }
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
  name: 'ios-swift/color',
  // name: 'css/variables',
  formatter (dictionary) {
    return `import UIKit\n\npublic enum TokensColor {\n${dictionary.allProperties.map(prop => {

	if(prop.type === "color") {
      const { r, g, b, a } = Color(prop.value).toRgb();
      const rFixed = (r / 255.0).toFixed(3);
      const gFixed = (g / 255.0).toFixed(3);
      const bFixed = (b / 255.0).toFixed(3);
      
      return `\tpublic static let ${prop.name} = #colorLiteral(red: ${rFixed}, green: ${gFixed}, blue: ${bFixed}, alpha: ${a})\n`;
      }
    }).join('')}}`;
  }
});

StyleDictionaryPackage.registerFormat({
  name: 'ios-swift/font',
  // name: 'css/variables',
  formatter (dictionary) {
    return `import UIKit\n\npublic enum TokensFont {\n${dictionary.allProperties.map(prop => {


	if(prop.type === "color" || prop.type === "fontFamilies" || prop.type === "fontWeights") {
        //skip
    } else if (prop.type == "fontSizes") {
      return `\tpublic static let ${prop.name} = UIFont.systemFont(ofSize: ${prop.value})\n`
    
    } else if(prop.type === "fontFamilies") {

    } else if(prop.type === "lineHeights") {
        const val = parseFloat(prop.value);

        // return `\tpublic static let ${prop.name} = ${val/100}`;
    } else if(prop.value instanceof Object) {
        const objectArray = [];
        const {entries} = Object;
        // eslint-disable-next-line no-restricted-syntax
        
        var name = prop.name.replace("Noto", "")
        
        if (name.includes("Roboto")) {
        	return ""
        }
        
        var fontWeight = "Regular"
        var fontSize = 0
        
        for (const [key, value] of entries(prop.value)) {
          if (!value == "") {
            // eslint-disable-next-line no-restricted-globals
            if (key === "fontFamily" || key === "lineHeight") {
            	//skip
            } else if (key === "fontWeight") {
            	fontWeight = value
            } else if (key === "fontSize") {
            	fontSize = value
            } else {
            	objectArray.push(`\tpublic static let ${prop.name}${StyleDictionaryPackage.transform['name/cti/camel'].transformer({path:[key]},{ prefix: '' })} = ${value}\n`);
            }
          }
        }
      
      if (fontWeight === "Regular") {
      	return `\tpublic static let ${name} = UIFont.systemFont(ofSize: ${fontSize})\n`
      } else if (fontWeight == "Bold") {
      	return `\tpublic static let ${name} = UIFont.boldSystemFont(ofSize: ${fontSize})\n`
      }
      
        return objectArray.map(p => {
          return p
        }).join('');
      } else {
        return `\tpublic static let ${prop.name} = UIFont.systemFont(ofSize: ${prop.value})\n`
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
          "destination": "color.scss",
          "format": "scss/color"
        },{
          "destination": "font.scss",
          "format": "scss/font"
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
        }]
      },
      "ios-swift": {
        "transformGroup": "ios-swift",
        "buildPath": `build/ios-swift/`,
        "files": [{
          "destination": "TokenColors.swift",
          "format": "ios-swift/color"
        },{
          "destination": "TokenFonts.swift",
          "format": "ios-swift/font"
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
