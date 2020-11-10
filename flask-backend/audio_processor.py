import os
import wave
from pydub import AudioSegment
from pydub.utils import make_chunks

import google_api


def separate_audio(filename):
    """
    Seperates vocals for instrumentals in the given audio file using spleeter
    """
    filename_without_ext = str(filename.split('.')[0])
    try:
        os.system(
            'python3 -m spleeter separate -i uploads/{} -o converted/'.format(filename, filename_without_ext))
        return True
    except:
        return False


def slow_down_audio(filename):
    """
    Slows down the vocals file for better accruacy when generating vocals
    """
    filename_without_ext = str(filename.split('.')[0])
    CHANNELS = 2
    swidth = 2
    Change_RATE = 0.98  # Rate of the track (lower = slower)

    audio_file = wave.open(
        'converted/{}/vocals.wav'.format(filename_without_ext), 'rb')  # Opens the vocals file to slow down
    RATE = audio_file.getframerate()
    signal = audio_file.readframes(-1)

    slowed_audio_file = wave.open(
        'converted/{}/slowed_vocals.wav'.format(filename_without_ext), 'wb')  # Creates a slowed down version of the file

    slowed_audio_file.setnchannels(CHANNELS)
    slowed_audio_file.setsampwidth(swidth)
    slowed_audio_file.setframerate(RATE * Change_RATE)
    slowed_audio_file.writeframes(signal)
    audio_file.close()  # Closes file handling process


def audio_to_chunks(filename):
    """
    Converts slowed down audio into chunks of audio every 10 seconds
    """
    filename_without_ext = str(filename.split('.')[0])
    myaudio = AudioSegment.from_file(
        "converted/{}/slowed_vocals.wav".format(filename_without_ext), "wav")
    chunk_length_ms = 10000  # breaking point at 10 seconds
    chunks = make_chunks(myaudio, chunk_length_ms)  # Make chunks of ten sec

    # Save each chunk into a separate file
    for i, chunk in enumerate(chunks):
        chunk_name = "{0}_chunk.wav".format(i)
        print("exporting", chunk_name)
        chunk.export(
            "converted/{}/{}".format(filename_without_ext, chunk_name), format="wav")


def chunks_to_text(filename):
    """
    Goes through all the chunks and uses google's speech to text api to detect the words in the file
    """
    filename_without_ext = str(filename.split('.')[0])
    chunks = []
    result_text = {}  # Stores each chunk and its corresponsing lyrics
    for file in os.listdir("converted/{}/".format(filename_without_ext)):
        if 'chunk' in file:
            chunks.append(file)
    # Sorts the chunks in order of creation
    chunks.sort(key=lambda chunk: int(chunk.split("_")[0]))

    for chunk in chunks:
        chunk_name_without_ext = chunk.split('.')[0]
        # Google speech-to-text api to transcribe each chunk
        response = google_api.transcribe_file(
            "converted/{}/{}".format(filename_without_ext, chunk), chunk_name_without_ext)
        if response:  # Checks whether google was able to detect words
            result_text[chunk_name_without_ext] = {
                "text": response[0], "confidence": response[1]}  # If yes, adds them to the global dictionary
        else:
            # If no, adds false to the global dictionary
            result_text[chunk_name_without_ext] = False

    return result_text
