# Guide to the JSON-Based UI Language

## 1. Introduction

This document describes a JSON-based language used for defining user interface layouts and components. It allows for a declarative way to specify UI structure, appearance, and behavior. The language is designed to be parsable and interpretable by a rendering engine to construct the actual UI.

## 2. Basic Structure

The root of a UI definition is typically a JSON object containing a `template` key, which holds the main UI structure.

```json
{
  "template": {
    // UI Element Definition(s) go here
  },
  "diff": {} // Often present, may be used for differential updates (not covered here)
}
```

Each UI element is defined as a JSON object with the following primary keys:
- `layout` or `type`: Specifies the kind of UI element.
- `config`: An object containing properties to configure the element's appearance and behavior.
- `children`: An array of child elements, used for container-type elements like `linearLayout`.

## 3. Element Types

### 3.1. `linearLayout`

A container element used to arrange its children in a single direction, either horizontally or vertically.

- **`layout: "linearLayout"`**
- **`config` properties:**
    - `orientation: "horizontal" | "vertical"`: (Required) Specifies the direction in which children are arranged.
    - `gravity: string`: Controls the alignment of its children within the layout (e.g., `"center"`, `"left"`, `"right"`, `"top"`, `"bottom"`, `"center_vertical"`, `"center_horizontal"`). Can also combine (e.g., `"center_vertical|left"`).
    - `gap: string | number`: Defines the spacing between child elements. Can be a numerical value (as a string, e.g., `"10"`) or `"auto"`.
    - Standard `config` properties like `width`, `height`, `padding`, `margin`, `cornerRadii` also apply.
- **`children`: array**
    - An array of child UI element definitions or string placeholders.

Example:
```json
{
  "layout": "linearLayout",
  "config": {
    "orientation": "horizontal",
    "gravity": "center_vertical",
    "gap": "10",
    "padding": [5, 5, 5, 5]
  },
  "children": [
    // Child elements here
  ]
}
```

### 3.2. `image`

An element for displaying images.

- **`type: "image"`**
- **`config` properties:**
    - `url: string`: (Required) The URL or path to the image source.
    - `width`, `height`: Dimensions of the image.
    - Other standard `config` properties may apply.

Example:
```json
{
  "type": "image",
  "config": {
    "url": "https://example.com/image.png",
    "width": "100",
    "height": "100"
  }
}
```

### 3.3. `text`

An element for displaying text.

- **`type: "text"`**
- **`config` properties:**
    - `text: string`: (Required) The text content to display.
    - `font: object`: Defines font properties.
        - `type: "FontName"` (Observed example)
        - `value: string` (e.g., `"Cabin-Regular"`)
    - `size: number | string`: Font size.
    - `lineHeight: string | number`: Line height.
    - `letterSpacing: string`: Letter spacing (e.g., `"0.2px"`).
    - `multipleLine: "true" | "false"`: Whether the text can span multiple lines.
    - `gravity`: Alignment of text within its bounds (e.g., `"left"`).
    - `width`, `height`: Dimensions of the text area.
    - Other standard `config` properties may apply.

Example:
```json
{
  "type": "text",
  "config": {
    "text": "Hello, World!",
    "size": 16,
    "font": { "type": "FontName", "value": "Arial" }
  }
}
```

### 3.4. String Placeholders (Dynamic Components)

Within a `children` array, strings can be used as placeholders (e.g., `"SelectionComponent"`, `"PrimaryText"`, `"IconImage"`). These are not literal text to be displayed directly as children of a layout but are likely resolved by the rendering system to specific, pre-defined or dynamically provided UI components. This allows for templating and dynamic instantiation of UI parts.

Example:
```json
"children": [
  "SelectionComponent", // Resolved to a specific component
  { /* Spacer layout */ },
  "PrimaryText"         // Resolved to another component
]
```

## 4. Common `config` Properties

These properties are commonly found in the `config` object of various elements:

- **`width`, `height`: string**
    - `"match_parent"`: Element tries to be as big as its parent.
    - `"wrap_content"`: Element sizes itself to fit its content.
    - Numerical value (as string, e.g., `"100"`): Fixed size in units (e.g., dp or px).
- **`padding`: array | string**
    - Array: `[top, right, bottom, left]` (e.g., `[10, 10, 10, 10]`).
    - Individual sides might also be possible (e.g., `paddingLeft`).
- **`margin`: array | string**
    - Similar to `padding`: `[top, right, bottom, left]`.
- **`weight`: number | string** (For children of `linearLayout`)
    - Used to distribute extra space in a `linearLayout`. Typically, the corresponding dimension (`width` for horizontal, `height` for vertical) is set to `"0"`.
    - Example: `{"width": "0", "weight": 1}` makes the element expand.
- **`cornerRadii`: array**
    - Defines rounded corners. Format: `[radiusString, topLeftBool, topRightBool, bottomRightBool, bottomLeftBool]`.
    - Example: `["8", true, true, true, true]` applies a radius of 8 to all corners.
- **`backgroundColor`: string**
    - Defines the background color (e.g., `"#FFFFFF"`, `"transparent"`). (Assumed, not explicitly in all examples but standard).
- **`id`: string**
    - A unique identifier for the element, potentially used for targeting or event handling. (Assumed, standard practice).

## 5. Layout Principles

- **Nesting:** `linearLayout` elements can be nested to create complex UI structures.
- **Orientation:** `linearLayout` arranges children either horizontally or vertically.
- **Gravity:** Controls alignment of content within an element or children within a parent.
- **Spacing:**
    - `padding`: Space inside an element's borders.
    - `margin`: Space outside an element's borders.
    - `gap`: Space between children of a `linearLayout`.
- **Weighted Distribution:** Children of a `linearLayout` can use `weight` to proportionally share available space. This is key for creating flexible and responsive layouts (e.g., one element expanding while others remain fixed or wrap content).

## 6. Value Types and Conventions

- Most numerical values (dimensions, gaps, font sizes) are represented as **strings** (e.g., `"10"`, `"120"`), though direct numbers might also be supported by some parsers.
- Keywords like `"match_parent"`, `"wrap_content"`, `"horizontal"`, `"center"`, `"auto"` are strings.
- Booleans are used for flags (e.g., in `cornerRadii`).
- Arrays are used for multi-value properties like `padding`, `margin`, and `cornerRadii`.
- Colors are typically represented as hex strings (e.g., `"#FF0000"`) or named colors.

## 7. Examples of Layout Patterns

(Refer to `memory-bank/systemPatterns.md` for detailed examples of common layout patterns derived from this JSON language, such as "Image-Spacer-Text Horizontal Layout" and "Weighted Space-Between Layout".)

This guide provides a foundational understanding of the JSON UI language. Specific implementations might have additional features or variations.
