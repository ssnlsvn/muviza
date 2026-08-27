const usuarioData = {
    id: idUnico,
    nombre: document.getElementById("nombre").value,
    handle: document.getElementById("handle").value,
    correo: document.getElementById("correo").value,
    password: document.getElementById("password").value, // <-- ¡Asegúrate de incluir esta línea!
    tipo: tipoEstudiante.value,
    area: document.getElementById("selectDinamico1") ? document.getElementById("selectDinamico1").value : "",
    carrera: document.getElementById("selectCarreraPre") && document.getElementById("selectCarreraPre").style.display !== "none" 
             ? document.getElementById("selectCarreraPre").value 
             : document.getElementById("selectDinamico1").value,
    tema: temaActual,
    modoOscuro: modoOscuroActivo
};
// Validación en tiempo real del @ único en el Registro
const inputHandle = document.getElementById("handle");
if (inputHandle) {
    // Crear elemento visual para el Check o la X
    const indicadorHandle = document.createElement("div");
    indicadorHandle.style.cssText = "font-size: 0.75rem; margin-top: 3px; font-weight: bold;";
    inputHandle.parentNode.appendChild(indicadorHandle);

    inputHandle.addEventListener("input", (e) => {
        let valor = e.target.value.trim();
        if (!valor.startsWith("@") && valor.length > 0) {
            valor = "@" + valor;
            inputHandle.value = valor;
        }

        if (valor.length <= 1) {
            indicadorHandle.textContent = "";
            return;
        }

        // Simular o leer la base de datos de usuarios registrados en localStorage
        const listaUsuarios = JSON.parse(localStorage.getItem("listaUsuariosLumis")) || [];
        const handleOcupado = listaUsuarios.some(u => u.handle.toLowerCase() === valor.toLowerCase());

        if (handleOcupado) {
            indicadorHandle.textContent = "❌ Este @ ya está en uso";
            indicadorHandle.style.color = "#ff5f56";
        } else {
            indicadorHandle.textContent = "✅ @ disponible";
            indicadorHandle.style.color = "#27c93f";
        }
    });
}
// Dentro del submit del registro:
const listaUsuarios = JSON.parse(localStorage.getItem("listaUsuariosLumis")) || [];
            
// Verificar una última vez que no esté repetido
const handleIngresado = document.getElementById("handle").value.trim();
if (listaUsuarios.some(u => u.handle.toLowerCase() === handleIngresado.toLowerCase())) {
    alert("❌ Ese nombre de usuario (@) ya está ocupado por otra persona. Elige otro.");
    return;
}

const usuarioData = {
    id: idUnico,
    nombre: document.getElementById("nombre").value,
    handle: handleIngresado,
    correo: document.getElementById("correo").value,
    password: document.getElementById("password").value,
    tipo: tipoEstudiante.value,
    area: document.getElementById("selectDinamico1") ? document.getElementById("selectDinamico1").value : "",
    carrera: document.getElementById("selectCarreraPre") && document.getElementById("selectCarreraPre").style.display !== "none" 
             ? document.getElementById("selectCarreraPre").value 
             : document.getElementById("selectDinamico1").value,
    tema: temaActual,
    modoOscuro: modoOscuroActivo,
    ultimoCambioHandle: new Date().getTime()
    
};

listaUsuarios.push(usuarioData);
localStorage.setItem("listaUsuariosLumis", JSON.stringify(listaUsuarios));
localStorage.setItem("usuarioLumis", JSON.stringify(usuarioData)); // Sesión actual