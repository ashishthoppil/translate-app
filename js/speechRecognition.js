<script>

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const output = document.getElementById("from_lang_text");
const to_lang = document.getElementById("to_lang_text");

document.getElementById('speak').getElementsByTagName('a')[0].addEventListener('click', function () {
     if (SpeechRecognition !== undefined) {
        let recognition = new SpeechRecognition();
        recognition.lang = document.getElementById("from_lang_select").value

        recognition.onstart = () => {
            to_lang.value = '';
            document.getElementById('listening_div').classList.remove('hidden');
        };

        recognition.onspeechend = () => {
            recognition.stop();
            document.getElementById('listening_div').classList.add('hidden');
        };

        recognition.onresult = async (result) => {
            output.value = result.results[0][0].transcript;
            const res = await fetch("https://libretranslate.org/translate", {
            method: "POST",
            body: JSON.stringify({
                q: result.results[0][0].transcript,
                source: document.getElementById("from_lang_select").value.split('-')[0],
                target: document.getElementById("to_lang_select").value.split('-')[0],
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
      
        // Speak the utterance
        if (window.screen.width > 700) {    
            utterance.voice = window.speechSynthesis.getVoices()[0];
            utterance.lang = document.getElementById("to_lang_select").value;
            window.speechSynthesis.speak(utterance);
        } else {
            document.getElementById('translate_btn').getElementsByTagName('a')[0].click();
        }

        };

        recognition.start();
    } else {
        status.innerHTML = "sorry not supported!";
    }
});

document.getElementById('translate_btn').getElementsByTagName('a')[0].addEventListener('click', function (e) {
    e.preventDefault();
    let utterance = new SpeechSynthesisUtterance();
    // Set the text and voice of the utterance
    utterance.text = to_lang.value;
    utterance.voice = window.speechSynthesis.getVoices().filter(function (voice) { return voice.name === "Google 日本語"; })[0];
    utterance.lang = document.getElementById("to_lang_select").value;
    // Speak the utterance
    window.speechSynthesis.speak(utterance);
});

</script>
