const locationInput = document.getElementById("location");
const updateBtn = document.getElementById("updateBtn");
const testBtn = document.getElementById("testBtn");
const currentContent = document.getElementById("current-content");
const forecastContent = document.getElementById("forecast-content");
const debugLog = document.getElementById("debug-log");

function logDebug(message) {
  const timestamp = new Date().toLocaleTimeString();
  debugLog.textContent += `[${timestamp}] ${message}\n`;
  debugLog.scrollTop = debugLog.scrollHeight;
}

function fetchWeather(city) {
  logDebug(`Hole Wetterdaten für ${city}...`);

  const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
  fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  })
    .then((response) => response.json())
    .then((data) => {
      logDebug("✓ Daten erfolgreich abgerufen");
      updateCurrentWeather(data);
      updateForecast(data);
    })
    .catch((error) => {
      logDebug(`✗ Fehler beim Abrufen der Daten: ${error}`);
    });
}

function updateCurrentWeather(data) {
  const current = data.current_condition[0];
  currentContent.innerHTML = `
    <p><strong>Temperatur:</strong> ${current.temp_C}°C</p>
    <p><strong>Gefühlt:</strong> ${current.FeelsLikeC}°C</p>
    <p><strong>Zustand:</strong> ${current.weatherDesc[0].value}</p>
    <p><strong>Luftfeuchtigkeit:</strong> ${current.humidity}%</p>
    <p><strong>Druck:</strong> ${current.pressure} hPa</p>
    <p><strong>Wind:</strong> ${(current.windspeedKmph / 3.6).toFixed(
      1
    )} m/s</p>
  `;
}

function updateForecast(data) {
  forecastContent.innerHTML = "";
  data.weather.slice(0, 2).forEach((day) => {
    day.hourly.forEach((hour) => {
      const time = hour.time.padStart(4, "0");
      const timeStr = `${time.slice(0, 2)}:${time.slice(2)}`;
      const block = document.createElement("div");
      block.className = "forecast-block";
      block.innerHTML = `
        <strong>${day.date} ${timeStr}</strong>: ${hour.tempC}°C, ${hour.weatherDesc[0].value}
      `;
      forecastContent.appendChild(block);
    });
  });
}

function testConnection() {
  logDebug("=== Verbindungstest gestartet ===");
  fetch("https://httpbin.org/get")
    .then((res) => logDebug(`✓ Internetverbindung OK (Status: ${res.status})`))
    .catch((err) => logDebug(`✗ Internetverbindung fehlgeschlagen: ${err}`));

  const city = locationInput.value;
  const url = `https://wttr.in/${encodeURIComponent(city)}?format=%t`;
  fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })
    .then((res) => res.text())
    .then((text) => logDebug(`✓ wttr.in Antwort: ${text}`))
    .catch((err) => logDebug(`✗ wttr.in Fehler: ${err}`));

  logDebug("=== Test abgeschlossen ===");
}

updateBtn.addEventListener("click", () => fetchWeather(locationInput.value));
testBtn.addEventListener("click", testConnection);

setTimeout(() => fetchWeather(locationInput.value), 2000);
