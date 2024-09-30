async function generateImage() {
    const inputText = document.getElementById('inputText').value;
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loaderBar');
    const loaderText = document.getElementById('loaderText');
    const generatedImage = document.getElementById('generatedImage');

    if (!inputText.trim()) {
        alert('Please enter a description.');
        return;
    }

    loader.style.display = 'block';
    let progress = 0;
    const interval = setInterval(() => {
        if (progress < 100) {
            progress += 10;
            loaderBar.style.width = `${progress}%`;
            loaderText.textContent = `${progress}%`;
        } else {
            clearInterval(interval);
        }
    }, 300);

    try {
        const response = await fetch('http://localhost:5000/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: inputText })
        });

        if (response.ok) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            generatedImage.src = imageUrl;
        } else {
            alert('Error generating image');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error generating image');
    } finally {
        clearInterval(interval);
        loader.style.display = 'none';
        loaderBar.style.width = '0';
        loaderText.textContent = '0%';
    }
}
function openFullscreen() {
    const fullscreenOverlay = document.getElementById('fullscreenOverlay');
    const fullscreenImage = document.getElementById('fullscreenImage');
    const generatedImage = document.getElementById('generatedImage');

    fullscreenImage.src = generatedImage.src;
    fullscreenOverlay.style.display = 'flex';
}

function closeFullscreen() {
    const fullscreenOverlay = document.getElementById('fullscreenOverlay');
    fullscreenOverlay.style.display = 'none';
}

function downloadImage() {
    const generatedImage = document.getElementById('generatedImage');
    const link = document.createElement('a');
    link.href = generatedImage.src;
    link.download = 'generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
