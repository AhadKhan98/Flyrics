import os


def separate_audio(filename):
    filename_without_ext = str(filename.split('.')[0])
    print("FILENAME WITHOUT EXT", filename_without_ext)
    try:
        os.system(
            'python3 -m spleeter separate -i uploads/{} -o converted/'.format(filename, filename_without_ext))
        return True
    except:
        return False
