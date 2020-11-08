from google.cloud import speech
import io


def transcribe_file(speech_file, file_name):
    """Transcribe the given audio file."""

    client = speech.SpeechClient.from_service_account_json('key.json')

    with io.open(speech_file, "rb") as audio_file:
        content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        audio_channel_count=2,
        language_code="en-US",
    )

    response = client.recognize(config=config, audio=audio)

    # Each result is for a consecutive portion of the audio. Iterate through
    # them to get the transcripts for the entire audio file.
    if response:
        print("RES", response)
        text = ""
        confidence = 0
        for result in response.results:
            text += result.alternatives[0].transcript + " "
            confidence = result.alternatives[0].confidence
        return (text, confidence)
    else:
        return ("Could not create lyrics..", 0)
