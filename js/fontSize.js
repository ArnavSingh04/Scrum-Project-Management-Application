(function() {
    const setFontSize = (size) => {
        // Set font size in percentage
        document.body.style.fontSize = size + '%';
        localStorage.setItem('fontSize', size);  // Fixed missing comma
    };

    // Load saved font size if available
    const savedFontSize = localStorage.getItem('fontSize') || 100; // Default to 100%
    setFontSize(savedFontSize);

    // Font size buttons
    const fontStandardBtn = document.getElementById('fontStandard');
    const font25IncreaseBtn = document.getElementById('font25Increase');
    const font50IncreaseBtn = document.getElementById('font50Increase');

    // Check if buttons exist before adding event listeners
    if (fontStandardBtn) {
        fontStandardBtn.addEventListener('click', () => {
            setFontSize(100); // Standard size
        });
    }

    if (font25IncreaseBtn) {
        font25IncreaseBtn.addEventListener('click', () => {
            setFontSize(125); // 25% increase
        });
    }

    if (font50IncreaseBtn) {
        font50IncreaseBtn.addEventListener('click', () => {
            setFontSize(150); // 50% increase
        });
    }
})();
