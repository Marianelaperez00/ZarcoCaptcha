export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CaptchaOptions {
  width: number;
  height: number;
  text?: string;
  length?: number;
  charset?: string;
  font?: string;
  fontSize?: number;
  textColor?: string;
  backgroundColor?: string;
  noiseColor?: string;
  noiseLevel?: number;
  distortionLevel?: number;
  output?: 'png' | 'jpeg' | 'svg' | 'webp';
  difficulty?: Difficulty;
}

export interface Captcha {
  text: string;
  image: Buffer;
}
