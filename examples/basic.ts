import { createCaptcha } from '../src';
import * as fs from 'fs';

(async () => {
  // 1. Create a captcha with default options
  const captcha1 = await createCaptcha({
    width: 200,
    height: 100,
  });
  fs.writeFileSync('captcha_default.png', captcha1.image);
  console.log('Default Captcha Text:', captcha1.text);

  // 2. Create a captcha with custom text
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

  // 3. Create an SVG captcha
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
