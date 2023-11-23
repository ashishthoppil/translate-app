

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const status = document.getElementById("status");
const output = document.getElementById("from_lang");
const to_lang = document.getElementById("to_lang");
const fromSelect = document.getElementById("from_lang_select");

const languages = require('./constants/lang.js');

languages.forEach((language) => {
    var option = document.createElement("option");
    option.text = language.text;
    option.value = language.speechLang;
    fromSelect.appendChild(option);
});

startRecognition = () => {
    if (SpeechRecognition !== undefined) {
        let recognition = new SpeechRecognition();
        recognition.lang = "hi-IN"

        recognition.onstart = () => {
            // output.classList.add("hide");
        };

        recognition.onspeechend = () => {
            recognition.stop();
        };

        recognition.onresult = async (result) => {
            output.value = result.results[0][0].transcript;
            const res = await fetch("https://libretranslate.org/translate", {
            method: "POST",
            body: JSON.stringify({
                q: result.results[0][0].transcript,
                source: "hi",
                target: "en",
                format: "text",
                api_key: ""
            }),
            headers: { "Content-Type": "application/json" }
        });

        const response = await res.json();

        to_lang.value = response.translatedText;

        let utterance = new SpeechSynthesisUtterance();
        // Set the text and voice of the utterance
        utterance.text = to_lang.value ;
        utterance.voice = window.speechSynthesis.getVoices()[0];
        utterance.lang = "en-EN";
      
        // Speak the utterance
        window.speechSynthesis.speak(utterance);

        };

        recognition.start();
    } else {
        status.innerHTML = "sorry not supported!";
    }
};