const API_URL = "https://698a17f2c04d974bc6a155f8.mockapi.io/api/v1/dispositivos_IoT";

const form = document.getElementById("deviceForm");
const table = document.getElementById("devicesTable");

const direccionMap = {
  1: "Adelante",
  2: "Detener",
  3: "Atrás",
  4: "Vuelta derecha adelante",
  5: "Vuelta izquierda adelante",
  6: "Vuelta derecha atrás",
  7: "Vuelta izquierda atrás",
  8: "Giro 90° derecha",
  9: "Giro 90° izquierda"
};

document.addEventListener("DOMContentLoaded", loadDevices);
form.addEventListener("submit", saveDevice);

// READ
async function loadDevices() {
  table.innerHTML = "";
  const res = await fetch(API_URL);
  const data = await res.json();

  data.forEach(device => {
    table.innerHTML += `
      <tr>
        <td>${device.deviceName}</td>
        <td>${device.direccionText}</td>
        <td>${new Date(device.dateTime).toLocaleString()}</td>
        <td>${device.idCliente}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editDevice('${device.id}')">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="deleteDevice('${device.id}')">🗑️</button>
        </td>
      </tr>
    `;
  });
}

// CREATE & UPDATE
async function saveDevice(e) {
  e.preventDefault();

  const id = document.getElementById("deviceId").value;
  const direccionCode = document.getElementById("direccionCode").value;

  const device = {
    deviceName: document.getElementById("deviceName").value,
    direccionCode: Number(direccionCode),
    direccionText: direccionMap[direccionCode],
    idCliente: document.getElementById("idCliente").value,
    dateTime: new Date().toISOString()
  };

  const options = {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(device)
  };

  const url = id ? `${API_URL}/${id}` : API_URL;
  await fetch(url, options);

  resetForm();
  loadDevices();
}

// EDIT
async function editDevice(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const device = await res.json();

  document.getElementById("deviceId").value = device.id;
  document.getElementById("deviceName").value = device.deviceName;
  document.getElementById("direccionCode").value = device.direccionCode;
  document.getElementById("idCliente").value = device.idCliente;
}

// DELETE
async function deleteDevice(id) {
  if (!confirm("¿Eliminar este dispositivo?")) return;

  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadDevices();
}

// RESET
function resetForm() {
  form.reset();
  document.getElementById("deviceId").value = "";
}