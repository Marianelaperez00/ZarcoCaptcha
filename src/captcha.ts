import { createCanvas, CanvasRenderingContext2D } from 'canvas';
import { Captcha, CaptchaOptions, Difficulty } from './types';
import { encode as encodeWebp } from 'webp-wasm';
import path from 'path';

const DEFAULT_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateText(length: number, charset: string): string {
  let result = '';
  const charsetLength = charset.length;
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charsetLength));
  }
  return result;
}

function getDifficultySettings(difficulty: Difficulty) {
    switch (difficulty) {
        case 'medium':
            return { noiseLevel: 2, distortionLevel: 1 };
        case 'hard':
            return { noiseLevel: 3, distortionLevel: 1.5 }; // Reduced distortion
        case 'easy':
        default:
            return { noiseLevel: 1, distortionLevel: 0 }; // No distortion for easy
    }
}

function applyDistortion(ctx: CanvasRenderingContext2D, width: number, height: number, level: number) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const amp = level * 1; // Reduced amplitude
    const freq = 0.1;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const sx = x + Math.sin(y * freq) * amp;
            const sy = y;
            const i = (y * width + x) * 4;
            const si = (Math.floor(sy) * width + Math.floor(sx)) * 4;

            if (si >= 0 && si < data.length) {
                data[i] = data[si];
                data[i + 1] = data[si + 1];
                data[i + 2] = data[si + 2];
                data[i + 3] = data[si + 3];
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

export async function createCaptcha(options: CaptchaOptions): Promise<Captcha> {
  let { 
    width, 
    height, 
    text, 
    length = 6, 
    charset = DEFAULT_CHARSET, 
    font = 'Arial',
    fontSize = 40,
    textColor = '#000000',
    backgroundColor = '#ffffff',
    noiseColor = '#888888',
    output = 'png',
    difficulty = 'easy'
  } = options;

  // Enforce text length limit
  if (text && text.length > 6) {
    text = text.substring(0, 6);
  }

  const captchaText = text || generateText(length, charset);
  const isSvg = output === 'svg';

  const canvas = isSvg 
    ? createCanvas(width, height, 'svg') 
    : createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const { noiseLevel, distortionLevel } = getDifficultySettings(difficulty);

  // 1. Draw background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // 2. Draw noise
  if (noiseLevel > 0) {
    ctx.strokeStyle = noiseColor;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < noiseLevel * 2; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }
    ctx.fillStyle = noiseColor;
    for (let i = 0; i < noiseLevel * 10; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 3. Apply distortion (not for SVG)
  if (distortionLevel > 0 && !isSvg) {
    applyDistortion(ctx as CanvasRenderingContext2D, width, height, distortionLevel);
  }

  // 4. Draw text on top
  ctx.font = `${fontSize}px ${font}`;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const charWidth = width / captchaText.length;
  for (let i = 0; i < captchaText.length; i++) {
    ctx.save();
    const x = charWidth * i + charWidth / 2;
    const y = height / 2 + (Math.random() - 0.5) * 4;
    const angle = (Math.random() - 0.5) * 0.2;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillText(captchaText[i], 0, 0);
    ctx.restore();
  }

  let image: Buffer;
  switch (output) {
    case 'jpeg':
      image = await (canvas as import('canvas').Canvas).toBuffer('image/jpeg');
      break;
    case 'webp':
      const webpData = ctx.getImageData(0, 0, width, height);
      image = await encodeWebp({ data: new Uint8ClampedArray(webpData.data), width, height });
      break;
    case 'svg':
      image = canvas.toBuffer();
      break;
    case 'png':
    default:
      image = await (canvas as import('canvas').Canvas).toBuffer('image/png');
      break;
  }

  return { text: captchaText, image };
}

