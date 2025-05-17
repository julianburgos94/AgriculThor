document.addEventListener('DOMContentLoaded', function () {
  const API_KEY = "cd1332e744495370f1a89d543eb30088";
  const CIUDAD = "Tunja,CO";

  function obtenerClaseTemperatura(temp) {
    if (temp < 10) return "frio";
    if (temp >= 25) return "calor";
    return "templado";
  }

 
  

  function cargarClima() {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${CIUDAD}&appid=${API_KEY}&units=metric&lang=es`)
      .then(response => {
        if (!response.ok) throw new Error("No se pudo obtener la respuesta del servidor.");
        return response.json();
      })
      .then(data => {
        const primerBloque = data.list[0]; // primer resultado del forecast
        const ciudad = data.city.name;

        const temp = primerBloque.main.temp;
        const humedad = item.main.humidity;
        const precipitacion = item.pop !== undefined ? item.pop * 100:0;
        const icono = primerBloque.weather[0].icon;
        const descripcion = primerBloque.weather[0].description;
        const clase = obtenerClaseTemperatura(temp);

        document.getElementById("datosClima").innerHTML = `
            <div class="clima-tarjeta ${clase}">
              <h3>${ciudad}</h3>
              <img src="https://openweathermap.org/img/wn/${icono}@2x.png" alt="${descripcion}">
              <p class="temp-principal">${Math.round(temp)}°C</p>
              <p>Humedad: ${humedad}%</p>
              <p>Precipitación: ${Math.round(precipitacion)}%</p>
              <p>${descripcion}</p>
            </div>
          `;

        // Mostrar pronóstico por día (seleccionando una hora por día)
        const tabla = document.querySelector("#tablaPronostico");
        tabla.innerHTML = "";

        const diasMostrados = new Set();
        data.list.forEach(item => {
          const fecha = new Date(item.dt_txt);
          const hora = fecha.getHours();

          // solo si es mediodía (12:00) y día no repetido
          const diaClave = fecha.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });

          if (hora === 12 && !diasMostrados.has(diaClave)) {
            diasMostrados.add(diaClave);
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${diaClave}</td>
                <td>${Math.round(item.main.temp_max)}° / ${Math.round(item.main.temp_min)}°</td>
                <td>${humedad}</td>
                <td>${Math.round(precipitacion)}%</td>
                <td><img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}" /></td>
                <td>${item.weather[0].description}</td>
              `;
            tabla.appendChild(fila);
          }
        });
      })
      .catch(error => {
        console.error("Error al obtener el clima:", error);
        document.getElementById("datosClima").innerHTML = `<p>❌ No se pudo cargar el clima.</p>`;
      });
  }

  cargarClima();
});

