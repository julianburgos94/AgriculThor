// alertas.js - Lógica para cargar alertas climáticas con forecast

const API_KEY = "cd1332e744495370f1a89d543eb30088";
const LAT = 5.535;
const LON = -73.367;

async function cargarAlertasClima() {
  try {
    const resp = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=es`);
    if (!resp.ok) throw new Error("No se pudo obtener alertas climáticas.");
    const data = await resp.json();

    const alertas = [];

    // Temperatura baja en algún pronóstico (menos de 10°C)
    const tempBaja = data.list.some(item => item.main.temp < 10);
    if (tempBaja) alertas.push("❄️ Riesgo de heladas en los próximos días.");

    // Probabilidad alta de lluvia (más de 50%) en algún pronóstico
    const lluviaAlta = data.list.some(item => item.pop > 0.5);
    if (lluviaAlta) alertas.push("🌧️ Posibles lluvias intensas próximamente.");

    // Viento fuerte (más de 8 m/s)
    const vientoFuerte = data.list.some(item => item.wind.speed > 8);
    if (vientoFuerte) alertas.push("💨 Vientos fuertes previstos.");

    const divAlertas = document.getElementById("alertasClima");
    if (alertas.length > 0) {
      divAlertas.innerHTML = "<h2>Alertas climáticas</h2><ul>" + alertas.map(a => `<li>${a}</li>`).join("") + "</ul>";
    } else {
      divAlertas.innerHTML = "<h2>Alertas climáticas</h2><p>No hay alertas climáticas importantes.</p>";
    }

    document.getElementById("fechaActualizacion").textContent = "Última actualización: " + new Date().toLocaleString();

  } catch (error) {
    console.error(error);
    document.getElementById("alertasClima").innerHTML = "<p>No se pudieron cargar las alertas climáticas.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarAlertasClima();
});
