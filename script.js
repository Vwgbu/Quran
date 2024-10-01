// Populate the Surah dropdown
fetch('http://api.alquran.cloud/v1/surah')
    .then(response => response.json())
    .then(data => {
        const surahSelect = document.getElementById('surah');
        data.data.forEach(surah => {
            const option = document.createElement('option');
            // Show both Arabic and English names for each Surah
            option.value = surah.number;
            option.textContent = `${surah.number}: ${surah.englishName} (${surah.name})`;
            surahSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching Surah list:', error));

// Populate the Ayah dropdown based on the selected Surah
document.getElementById('surah').addEventListener('change', function () {
    const surahNumber = this.value;
    const ayahSelect = document.getElementById('ayah');
    
    // Clear previous Ayah options
    ayahSelect.innerHTML = '<option value="">Select an Ayah</option>';
    
    if (surahNumber) {
        // Fetch the number of Ayahs for the selected Surah
        fetch(`http://api.alquran.cloud/v1/surah/${surahNumber}`)
            .then(response => response.json())
            .then(data => {
                const numberOfAyahs = data.data.ayahs.length;
                for (let i = 1; i <= numberOfAyahs; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = `Ayah ${i}`;
                    ayahSelect.appendChild(option);
                }
            })
            .catch(error => console.error('Error fetching Ayah list:', error));
    }
});

// Fetch the selected Ayah and display its details
document.getElementById('fetch-button').addEventListener('click', () => {
    const surah = document.getElementById('surah').value;
    const ayah = document.getElementById('ayah').value;

    if (surah && ayah) {
        fetch(`http://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/quran-uthmani,en.transliteration,en.asad`)
            .then(response => response.json())
            .then(data => {
                if (data.data) {
                    // Extract Arabic Text
                    const arabicText = data.data[0].text;
                    document.getElementById('ayah-text').innerText = arabicText;

                    // Extract Transliteration
                    const transliteration = data.data[1].text;
                    document.getElementById('transliteration-text').innerText = "Transliteration: " + transliteration;

                    // Extract Translation
                    const translation = data.data[2].text;
                    document.getElementById('translation-text').innerText = "Translation: " + translation;
                } else {
                    document.getElementById('ayah-text').innerText = "Ayah not found.";
                    document.getElementById('transliteration-text').innerText = "";
                    document.getElementById('translation-text').innerText = "";
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                document.getElementById('ayah-text').innerText = "Error fetching data.";
                document.getElementById('transliteration-text').innerText = "";
                document.getElementById('translation-text').innerText = "";
            });
    } else {
        document.getElementById('ayah-text').innerText = "Please select both Surah and Ayah.";
        document.getElementById('transliteration-text').innerText = "";
        document.getElementById('translation-text').innerText = "";
    }
});
