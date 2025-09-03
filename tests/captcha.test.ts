import { createCaptcha } from '../src/captcha';
import { CaptchaOptions } from '../src/types';

describe('createCaptcha', () => {
  it('should create a captcha with the correct text and image buffer', async () => {
    const options: CaptchaOptions = { width: 200, height: 100, text: 'test' };
    const captcha = await createCaptcha(options);
    expect(captcha.text).toBe('test');
    expect(captcha.image).toBeInstanceOf(Buffer);
  });

  it('should generate random text with custom length and charset', async () => {
    const options: CaptchaOptions = {
      width: 200,
      height: 100,
      length: 4,
      charset: 'abc',
    };
    const captcha = await createCaptcha(options);
    expect(captcha.text).toHaveLength(4);
    expect(captcha.text).toMatch(/[abc]{4}/);
  });

  it('should truncate text longer than 6 characters', async () => {
    const options: CaptchaOptions = { width: 200, height: 100, text: '123456789' };
    const captcha = await createCaptcha(options);
    expect(captcha.text).toBe('123456');
  });

  it('should create a captcha with custom colors', async () => {
    const options: CaptchaOptions = {
      width: 200,
      height: 100,
      textColor: '#ff0000',
      backgroundColor: '#0000ff',
      noiseColor: '#00ff00',
    };
    // We can't inspect the image colors, but we can ensure it runs without error
    await expect(createCaptcha(options)).resolves.toBeDefined();
  });

  it('should create a captcha with hard difficulty', async () => {
    const options: CaptchaOptions = { width: 200, height: 100, difficulty: 'hard' };
    const captcha = await createCaptcha(options);
    expect(captcha.text).toHaveLength(6);
    expect(captcha.image).toBeInstanceOf(Buffer);
  });

  it('should create an svg captcha', async () => {
    const options: CaptchaOptions = { width: 200, height: 100, output: 'svg' };
    const captcha = await createCaptcha(options);
    expect(captcha.image).toBeInstanceOf(Buffer);
    expect(captcha.image.toString().includes('<svg')).toBe(true);
  });

  it('should create a jpeg captcha', async () => {
    const options: CaptchaOptions = { width: 200, height: 100, output: 'jpeg' };
    const captcha = await createCaptcha(options);
    expect(captcha.image).toBeInstanceOf(Buffer);
    // Check for JPEG magic numbers (SOI and EOI markers)
    const jpegSOI = captcha.image.subarray(0, 2).toString('hex');
    const jpegEOI = captcha.image.subarray(-2).toString('hex');
    expect(jpegSOI).toBe('ffd8');
    expect(jpegEOI).toBe('ffd9');
  });

  it('should create a webp captcha', async () => {
    const options: CaptchaOptions = { width: 200, height: 100, output: 'webp' };
    const captcha = await createCaptcha(options);
    expect(captcha.image).toBeInstanceOf(Buffer);
    // WebP magic numbers: RIFF (0-3), WEBP (8-11)
    expect(captcha.image.subarray(0, 4).toString()).toBe('RIFF');
    expect(captcha.image.subarray(8, 12).toString()).toBe('WEBP');
  });
});