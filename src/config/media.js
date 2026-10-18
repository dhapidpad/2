/**
 * Media Configuration (GEMINI_FULL_SPEC_ACID_V4 §4.1 & §18)
 * Controls the Intro Trailer playback mechanism:
 * - 'cinematic': Built-in SVG vector animation with Web Audio API sound synthesis (~14s). Default & safe.
 * - 'video': Plays custom MP4 video if placed at public/intro.mp4.
 */
export const MEDIA_CONFIG = {
  INTRO_MODE: 'cinematic', // 'cinematic' | 'video'
  VIDEO_SRC: '/intro.mp4',
  DEFAULT_VOLUME: 0.85,
  CINEMATIC_DURATION_SEC: 14,
};
