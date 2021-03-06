// Init SpeechSynth API
const synth = window.speechSynthesis;

const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

// Init voices array
let voices = [];

const getVoices = () => {
   voices = synth.getVoices();
   // Loop through voices and create an option for each one
   voices.forEach(voice => {
      voiceSelect.appendChild(createVoiceOption(voice));
   });
};

const createVoiceOption = (voice) => {
   const option = document.createElement('option');
   // Fill option with voice and language
   option.textContent = voice.name + '('+ voice.lang +')';
   // Set needed option attributes
   option.setAttribute('data-lang', voice.lang);
   option.setAttribute('data-name', voice.name);
   return option;
};

getVoices();

if (synth.onvoiceschanged !== undefined) {
   synth.onvoiceschanged = getVoices;
}

// Speak
const speak = () => {
   // Check if speaking
   if (alreadySpeaking(synth)) {
      return 0;
   }

   if (textInput.value !== '') {
      // Add background animation
      addBackgroundAnimation();
      // Get speak text
      const speakText = new SpeechSynthesisUtterance(textInput.value);
      endSpeak(speakText);
      speakOnErr(speakText);
      // Selected void
      const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
      // Loop through voices
      voices.forEach(voice => {
         if(voice.name === selectedVoice) {
            speakText.voice = voice;
         }
      });
      // Speak
      synth.speak(setPitchAndRate(speakText, rate.value, pitch.value));
   }
};

setPitchAndRate = (speakText, rate, pitch ) => {
   speakText.rate = rate;
   speakText.pitch = pitch;
   return speakText;
};

endSpeak = (speakText) => {
   speakText.onend = () => {
      console.log('Done speaking...');
      body.style.background = '#141414';
   };
};

speakOnErr = (speakText) => {
   speakText.onerror = () => {
      console.error('Something went wrong');
   };
};

alreadySpeaking = (synth) => {
   if (synth.speaking) {
      console.error('Already speaking...');
      return true;
   }
   return false;
};

const addBackgroundAnimation = () => {
   body.style.background = '#141414 url(wave.gif)';
   body.style.backgroundRepeat = 'repeat-x';
   body.style.backgroundSize = '100% 100%';
};

// Text form submit
textForm.addEventListener('submit', e => {
   e.preventDefault();
   speak();
   textInput.blur();
});

// Rate value change
rate.addEventListener('change', () => rateValue.textContent = rate.value);
pitch.addEventListener('change', () => pitchValue.textContent = pitch.value);
// Voice select change
voiceSelect.addEventListener('change', () => speak());