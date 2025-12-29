// scanner.js - Updated with reliable image fallback

async function onScanSuccess(decodedText) {
    const resultDiv = document.getElementById("result");

    try {
        // Parse QR data
        let qrData;
        try {
            qrData = JSON.parse(decodedText);
        } catch (e) {
            // Fallback: if plain text (old format), treat as productId
            qrData = { productId: parseInt(decodedText) };
        }

        const productId = qrData.productId;

        if (!productId || isNaN(productId)) {
            throw new Error("Invalid Product ID in QR code");
        }

        resultDiv.innerHTML = `<p>⏳ Verifying product ${productId}...</p>`;

        // Fetch from backend
       const response = await fetch(`http://192.168.183.151:3000/api/products/${productId}`);
        const data = await response.json();

        if (!data.success || !data.product) {
            throw new Error(data.error || "Product not found");
        }

        const product = data.product;
        const analysis = data.analysis;

        // ---------- NEW FUNCTIONALITY: Product Journey ----------
        let journeyHTML = "";

        if (data.journey && Array.isArray(data.journey) && data.journey.length > 0) {
            journeyHTML = `
                <hr>
                <h3>📜 Product Journey</h3>
                <ul style="line-height:1.8">
            `;

            data.journey.forEach(step => {
                journeyHTML += `
                    <li>
                        <b>${step.role}</b> – ${step.location}<br>
                        🕒 ${new Date(step.timestamp).toLocaleString()}
                    </li>
                `;
            });

            journeyHTML += `</ul>`;
        }
        // ------------------------------------------------------

        // Map stage
        const stageMap = { 0: "🌾 Produced", 1: "🚚 Distributed", 2: "🏪 Retail" };
        const stageText = stageMap[product.state] || "Unknown";

        const statusColor =
            analysis.color === "green"
                ? "#4CAF50"
                : analysis.color === "orange"
                ? "#FF9800"
                : "#F44336";

        resultDiv.innerHTML = `
            <h3 style="color: ${statusColor};">${analysis.status}</h3>
            <h3>🛒 ${product.name}</h3>

            <img src="${product.image}" 
                 class="product" 
                 alt="${product.name}" 
                 onerror="this.src='https://source.unsplash.com/800x600/?food,fresh,market'; this.onerror=null;">

            <p><b>Origin:</b> ${product.origin}</p>
            <p><b>Batch ID:</b> ${product.batch}</p>
            <p><b>Harvest Date:</b> ${product.harvestDate}</p>
            <p><b>Current Stage:</b> ${stageText}</p>
            <p><b>Description:</b><br>${product.description}</p>

            <hr>

            <p style="color: ${statusColor}; font-weight: bold;">${analysis.message}</p>
            <p><small>Scanned: ${new Date().toLocaleString()}</small></p>
            <p class="ai-note">🤖 AI-powered verification</p>

            ${journeyHTML}
        `;

    } catch (error) {
        console.error("Scan failed:", error);
        resultDiv.innerHTML = `
            <h3 class="status-fake">❌ Product Not Found</h3>
            <p>This QR code is not registered in the supply chain system.</p>
            <p><small>Error: ${error.message}</small></p>
        `;
    }
}

// Keep the scanner init
function startScanner() {
    new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false)
        .render(onScanSuccess);
}

window.onload = startScanner;
