import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import os from 'os'
import ffmpegPath from 'ffmpeg-static'

export async function mergeAudioFiles(
  audioBuffers: Array<{ audio: Buffer; sfx?: string }>,
  outputPath: string
): Promise<void> {
  
  // 1. ROBUST FFMPEG PATH RESOLUTION
  let FFMPEG: string | null = null;

  // Try the library's default path first
  if (ffmpegPath && fs.existsSync(ffmpegPath)) {
    FFMPEG = ffmpegPath;
  } else {
    // If that fails, try searching manually in node_modules
    const manualPath = path.join(process.cwd(), 'node_modules', 'ffmpeg-static', 'ffmpeg');
    const standalonePath = path.join(process.cwd(), '..', 'node_modules', 'ffmpeg-static', 'ffmpeg');
    
    if (fs.existsSync(manualPath)) {
      FFMPEG = manualPath;
    } else if (fs.existsSync(standalonePath)) {
      FFMPEG = standalonePath;
    }
  }

  if (!FFMPEG) {
    console.error("FFMPEG SEARCH FAILED. Current Directory:", process.cwd());
    throw new Error(`FFmpeg binary not found. Please ensure 'ffmpeg-static' is in your dependencies.`);
  }

  // 2. ENSURE PERMISSIONS
  try {
    fs.chmodSync(FFMPEG, '755');
  } catch (err) {
    console.warn("Could not chmod FFmpeg, it might already be executable or read-only:", err);
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'roastcast-'))

  try {
    const segmentPaths: string[] = []

    // Use path.resolve to be extra safe with file paths on Linux
    const getPublicPath = (subPath: string) => path.join(process.cwd(), 'public', subPath);

    const introPath = getPublicPath('sfx/intro.mp3');
    if (fs.existsSync(introPath)) {
      const trimmedIntro = path.join(tmpDir, 'intro_trim.mp3')
      execSync(`"${FFMPEG}" -i "${introPath}" -t 4 -af "afade=out:st=3:d=1" "${trimmedIntro}" -y -loglevel quiet`)
      segmentPaths.push(trimmedIntro)
    }

    for (let i = 0; i < audioBuffers.length; i++) {
      const { audio, sfx } = audioBuffers[i]

      const silencePath = path.join(tmpDir, `silence_${i}.mp3`)
      execSync(
        `"${FFMPEG}" -f lavfi -i anullsrc=r=44100:cl=stereo -t 0.3 -q:a 9 -acodec libmp3lame "${silencePath}" -y -loglevel quiet`
      )
      segmentPaths.push(silencePath)

      const dialoguePath = path.join(tmpDir, `line_${i}.mp3`)
      fs.writeFileSync(dialoguePath, audio)
      segmentPaths.push(dialoguePath)

      if (sfx) {
        const sfxPath = getPublicPath(`sfx/${sfx}.mp3`);
        if (fs.existsSync(sfxPath)) {
          const sfxTrimmed = path.join(tmpDir, `sfx_${i}.mp3`)
          execSync(`"${FFMPEG}" -i "${sfxPath}" -t 2.5 -af "afade=out:st=2:d=0.5" "${sfxTrimmed}" -y -loglevel quiet`)
          segmentPaths.push(sfxTrimmed)
        }
      }
    }

    const outroPath = getPublicPath('sfx/outro.mp3');
    if (fs.existsSync(outroPath)) {
      const trimmedOutro = path.join(tmpDir, 'outro_trim.mp3')
      execSync(`"${FFMPEG}" -i "${outroPath}" -t 5 -af "afade=in:st=0:d=1,afade=out:st=4:d=1" "${trimmedOutro}" -y -loglevel quiet`)
      segmentPaths.push(trimmedOutro)
    }

    const listPath = path.join(tmpDir, 'list.txt')
    fs.writeFileSync(listPath, segmentPaths.map((p) => `file '${p}'`).join('\n'))

    execSync(
      `"${FFMPEG}" -f concat -safe 0 -i "${listPath}" -ar 44100 -ac 2 -b:a 192k "${outputPath}" -y -loglevel quiet`
    )
  } catch (error) {
    console.error("FFmpeg Execution Error:", error);
    throw error;
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
}