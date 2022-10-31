# figma tokens

style-dictionary build

## build tokens
- android
  - xml (color, font)
    - color.xml

    ```xml
      <color name="ref_black">#ff111111</color>
    ```
    - styles.xml (font)
    ```xml
      <style name="sys_heading_font_size_xxxl">
        <item name="android:fontFamily">Noto Sans CJK KR</item>
        <item name="android:textStyle">Bold</item>
        <item name="android:textSize">36dp</item>
      </style>
    ```

- ios
  - swift
    - tockens.swift
    ```swift
      // color
      public static let refBlack = UIColor(red: 0.067, green: 0.067, blue: 0.067, alpha: 1)

      // font
      public static let sysHeadingFontSizeXxxlfontFamily = "Noto Sans CJK KR"
      public static let sysHeadingFontSizeXxxlfontWeight = Bold
      public static let sysHeadingFontSizeXxxlfontSize = 36dp
    ```
- web
  - scss
    - tockens.scss
    ```scss
    // color
    $ref-black: #111111;

    // font
    %sys-heading-font-size-xxxl {
      font-family: Noto Sans CJK KR;
      font-weight: Bold;
      line-height: 140%;
      font-size: 3.6rem;
    }
    ```
### install

```bash
npm install
```

### build

```bash
npm run build
```