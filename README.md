# ZarcoCaptcha

![ZarcoCaptcha](images/ZarcoCaptcha.png)

A powerful and fully customizable CAPTCHA generator for Node.js.

**Author:** ZarCodeX  
**Website:** [https://zarcodex.github.io](https://zarcodex.github.io)  
**GitHub:** [https://github.com/ZarCodeX/ZarcoCaptcha](https://github.com/ZarCodeX/ZarcoCaptcha)

---

## Features

- **Flexible output formats**: PNG, JPG/JPEG, SVG  
- **Custom text**: Use random characters or your own words  
- **Adjustable image size**: Set width and height freely  
- **Color customization**: Text, background, and noise colors  
- **Captcha length control**: Up to 6 characters for custom text  
- **Noise & distortion**: Lines, dots, and background warping  
- **Difficulty levels**: Easy, medium, hard  
- **Token & answer retrieval**: Get the image and correct answer for verification  

---

## Installation

```bash
npm install zarcocaptcha
````

---

## Usage

Here’s a simple example:

```typescript
import { createCaptcha } from 'zarcocaptcha';
import * as fs from 'fs';

(async () => {
  // Default captcha
  const captcha1 = await createCaptcha({ width: 200, height: 100 });
  fs.writeFileSync('captcha_default.png', captcha1.image);
  console.log('Default Captcha Text:', captcha1.text);

  // Custom captcha
  const captcha2 = await createCaptcha({
    width: 300,
    height: 120,
    text: 'Zarco',
    difficulty: 'hard',
    textColor: '#FFFFFF',
    backgroundColor: '#2c3e50',
    noiseColor: '#bdc3c7',
    output: 'png',
  });
  fs.writeFileSync('captcha_custom.png', captcha2.image);
  console.log('Custom Captcha Text:', captcha2.text);

  // SVG captcha
  const captcha3 = await createCaptcha({
    width: 300,
    height: 120,
    text: 'SVG',
    difficulty: 'medium',
    output: 'svg',
  });
  fs.writeFileSync('captcha_svg.svg', captcha3.image);
  console.log('SVG Captcha Text:', captcha3.text);
})();
```

---

## API

### `createCaptcha(options: CaptchaOptions): Promise<Captcha>`

Creates a captcha image asynchronously and returns a `Captcha` object.

#### CaptchaOptions

| Option            | Type                           | Default         | Description                                                        |
| ----------------- | ------------------------------ | --------------- | ------------------------------------------------------------------ |
| `width`           | `number`                       | **Required**    | Width of the captcha image in pixels.                              |
| `height`          | `number`                       | **Required**    | Height of the captcha image in pixels.                             |
| `text`            | `string`                       | `undefined`     | Text to display. Random string generated if omitted (max 6 chars). |
| `length`          | `number`                       | `6`             | Length of the random string.                                       |
| `charset`         | `string`                       | `A-Z, a-z, 0-9` | Characters used for random string generation.                      |
| `font`            | `string`                       | `Arial`         | Font used for text.                                                |
| `fontSize`        | `number`                       | `40`            | Font size in pixels.                                               |
| `textColor`       | `string`                       | `#000000`       | Text color.                                                        |
| `backgroundColor` | `string`                       | `#ffffff`       | Background color.                                                  |
| `noiseColor`      | `string`                       | `#888888`       | Noise color (lines, dots).                                         |
| `difficulty`      | `'easy' \| 'medium' \| 'hard'` | `'easy'`        | Adjusts noise and distortion levels.                               |
| `output`          | `'png' \| 'jpeg' \| 'svg'`     | `'png'`         | Output format.                                                     |

#### Captcha

| Property | Type     | Description                   |
| -------- | -------- | ----------------------------- |
| `text`   | `string` | Captcha text for verification |
| `image`  | `Buffer` | Captcha image data            |

---

## Contributing

Contributions are welcome! Open an issue or submit a pull request on [GitHub](https://github.com/ZarCodeX/ZarcoCaptcha).

---

## License

MIT License. See [LICENSE](LICENSE) for details.