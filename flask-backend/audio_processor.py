import os
import wave
from pydub import AudioSegment
from pydub.utils import make_chunks

import google_api


def separate_audio(filename):
    filename_without_ext = str(filename.split('.')[0])
    try:
        os.system(
            'python3 -m spleeter separate -i uploads/{} -o converted/'.format(filename, filename_without_ext))
        return True
    except:
        return False


def slow_down_audio(filename):
    filename_without_ext = str(filename.split('.')[0])
    CHANNELS = 2
    swidth = 2
    Change_RATE = 0.8
    audio_file = wave.open(
        'converted/{}/vocals.wav'.format(filename_without_ext), 'rb')
    RATE = audio_file.getframerate()
    signal = audio_file.readframes(-1)

    slowed_audio_file = wave.open(
        'converted/{}/slowed_vocals.wav'.format(filename_without_ext), 'wb')

    slowed_audio_file.setnchannels(CHANNELS)
    slowed_audio_file.setsampwidth(swidth)
    slowed_audio_file.setframerate(RATE * Change_RATE)
    slowed_audio_file.writeframes(signal)
    audio_file.close()


def audio_to_chunks(filename):
    filename_without_ext = str(filename.split('.')[0])
    myaudio = AudioSegment.from_file(
        "converted/{}/slowed_vocals.wav".format(filename_without_ext), "wav")
    chunk_length_ms = 10000  # pydub calculates in millisec
    chunks = make_chunks(myaudio, chunk_length_ms)  # Make chunks of one sec

    for i, chunk in enumerate(chunks):
        chunk_name = "{0}_chunk.wav".format(i)
        print("exporting", chunk_name)
        chunk.export(
            "converted/{}/{}".format(filename_without_ext, chunk_name), format="wav")


def chunks_to_text(filename):
    filename_without_ext = str(filename.split('.')[0])
    chunks = []
    result_text = {}
    for file in os.listdir("converted/{}/".format(filename_without_ext)):
        if 'chunk' in file:
            chunks.append(file)
    chunks.sort(key=lambda chunk: int(chunk.split("_")[0]))

    for chunk in chunks:
        chunk_name_without_ext = chunk.split('.')[0]
        response = google_api.transcribe_file(
            "converted/{}/{}".format(filename_without_ext, chunk), chunk_name_without_ext)
        if response:
            result_text[chunk_name_without_ext] = {
                "text": response[0], "confidence": response[1]}
        else:
            result_text[chunk_name_without_ext] = False

    return result_text
