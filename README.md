<p align="center">
  <img src="./assets/logo.png" width="200px" alt="logo" />
  <h3 align="center">Flyrics - Lyrics On The Fly</h3>
  <p align="center">Did you ever want to sing along to a song but don't know the lyrics? 
  <br />
  Tired of going through the tedious process of searching for multiple sites to find the right lyrics?
  <br />
  <br />
  <strong>We have a solution!</strong>
  <br />
  <br />
  Flyrics uses Artifical Intelligence and Machine Learning to generate lyrics for a song in a matter of minutes. 
  <br />
  No need to search online databases just to find out the lyrics to a song.
  <br />
  Check out the project details below in order to learn how flyrics works, and get started right away!
  <br />
  <br />
  <a href="https://github.com/AhadKhan98/Flyrics/issues">Report Bug</a>
    ·
    <a href="https://github.com/AhadKhan98/Flyrics/issues">Submit Feature</a>
  </p>
</p>
<hr>

## How it Works

Flyrics uses an Artifical Intelligence and a Machine Language approach to generate lyrics on the fly. The project is divided into a backend (python & flask) and a frontend (react native). The user is able to either record a sample of a song, or upload an already existing file in the frontend. The frontend then communicates with the flask server in the backend which is responsible for all of the processing. This processing includes the usage of a python library spleeter which uses a trained model to separate the vocals from the song that was inputted. The vocals are then slowed down in order to increase speech recognition accuracy. The slowed file is passed on to Google's Speech-to-Text API which handles the conversion of the vocals into text. The result is a JSON object which is passed back to the frontend. Finally, the result is displayed in the frontend and the files that were created in the backend are deleted to save disk space.

## Getting Started

## Contributing

## Video Demo

## Contributors


