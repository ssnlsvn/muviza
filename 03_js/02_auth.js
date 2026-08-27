document.addEventListener("DOMContentLoaded", () => {
    // 1. Lógica para los selectores de tipo de estudiante y carreras de San Marcos
    const tipoEstudiante = document.getElementById("tipoEstudiante");
    const contenedorDinamico = document.getElementById("contenedorDinamico");
    const contenedorCarreraPre = document.getElementById("contenedorCarreraPre");
    const selectDinamico1 = document.getElementById("selectDinamico1");
    const selectCarreraPre = document.getElementById("selectCarreraPre");

    const carrerasSanMarcos = {
        A: ["Medicina Humana", "Obstetricia", "Enfermería", "Tecnología Médica", "Farmacia y Bioquímica", "Odontología", "Medicina Veterinaria", "Psicología"],
        B: ["Química", "Física", "Matemática", "Estadística", "Genética y Biotecnología", "Microbiología y Parasitología", "Biología"],
        C: ["Ingeniería Industrial", "Ingeniería de Sistemas", "Ingeniería de Software", "Ingeniería Civil", "Ingeniería Ambiental", "Ingeniería Electrónica", "Ingeniería Biomédica", "Ingeniería Mecánica de Fluidos"],
        D: ["Administración", "Administración de Negocios Internacionales", "Contabilidad", "Economía", "Negocios Internacionales"],
        E: ["Derecho", "Ciencia Política", "Literatura", "Filosofía", "Comunicación Social", "Arqueología", "Historia", "Sociología", "Educación"]
    };

    if (tipoEstudiante) {
        tipoEstudiante.addEventListener("change", (e) => {
            const valor = e.target.value;
            if (valor === "pre") {
                contenedorDinamico.style.display = "block";
                contenedorCarreraPre.style.display = "block";
                actualizarCarrerasPre("A");
            } else if (valor === "uni") {
                contenedorDinamico.style.display = "block";
                contenedorCarreraPre.style.display = "none";
                llenarCarrerasUniversitarias();
            } else {
                contenedorDinamico.style.display = "none";
                contenedorCarreraPre.style.display = "none";
            }
        });
    }

    if (selectDinamico1) {
        selectDinamico1.addEventListener("change", (e) => {
            if (tipoEstudiante && tipoEstudiante.value === "pre") {
                actualizarCarrerasPre(e.target.value);
            }
        });
    }

    function actualizarCarrerasPre(area) {
        if (!selectCarreraPre) return;
        selectCarreraPre.innerHTML = "";
        const lista = carrerasSanMarcos[area] || [];
        lista.forEach(carrera => {
            const opt = document.createElement("option");
            opt.value = carrera;
            opt.textContent = carrera;
            selectCarreraPre.appendChild(opt);
        });
    }

    function llenarCarrerasUniversitarias() {
        if (!selectDinamico1) return;
        selectDinamico1.innerHTML = "";
        Object.keys(carrerasSanMarcos).forEach(area => {
            carrerasSanMarcos[area].forEach(carrera => {
                const opt = document.createElement("option");
                opt.value = carrera;
                opt.textContent = `${carrera} (Área ${area})`;
                selectDinamico1.appendChild(opt);
            });
        });
    }

    // 2. Control de Temas y Modo Oscuro en el Registro
    let temaActual = "mint";
    let modoOscuroActivo = false;

    const circulosTemas = document.querySelectorAll(".circulo-tema");
    const btnModoOscuro = document.getElementById("btnModoOscuro");
    const iconoModo = document.getElementById("iconoModo");
    const textoModo = document.getElementById("textoModo");

    circulosTemas.forEach(circulo => {
        circulo.addEventListener("click", () => {
            circulosTemas.forEach(c => c.classList.remove("activo"));
            circulo.classList.add("activo");
            temaActual = circulo.getAttribute("data-tema");
            aplicarTemaVisual(temaActual, modoOscuroActivo);
        });
    });

    if (btnModoOscuro) {
        btnModoOscuro.addEventListener("click", () => {
            modoOscuroActivo = !modoOscuroActivo;
            if (modoOscuroActivo) {
                btnModoOscuro.classList.add("activo");
                if (iconoModo) iconoModo.textContent = "☀️";
                if (textoModo) textoModo.textContent = "Modo Oscuro: ON";
            } else {
                btnModoOscuro.classList.remove("activo");
                if (iconoModo) iconoModo.textContent = "🌙";
                if (textoModo) textoModo.textContent = "Modo Oscuro: OFF";
            }
            aplicarTemaVisual(temaActual, modoOscuroActivo);
        });
    }

    function aplicarTemaVisual(tema, esOscuro) {
        document.documentElement.removeAttribute("data-theme");
        document.documentElement.removeAttribute("data-mode");

        if (tema !== "mint") {
            document.documentElement.setAttribute("data-theme", tema);
        }
        if (esOscuro) {
            document.documentElement.setAttribute("data-mode", "dark");
        }
    }

    // 3. Validación en tiempo real del @ único en el Registro
    const inputHandle = document.getElementById("handle");
    if (inputHandle) {
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

    // 4. Envío del formulario de Registro
    const formRegistro = document.getElementById("formRegistro");
    if (formRegistro) {
        formRegistro.addEventListener("submit", (e) => {
            e.preventDefault();

            const listaUsuarios = JSON.parse(localStorage.getItem("listaUsuariosLumis")) || [];
            const handleIngresado = document.getElementById("handle").value.trim();
            const handleConArroba = handleIngresado.startsWith("@") ? handleIngresado : "@" + handleIngresado;

            if (listaUsuarios.some(u => u.handle.toLowerCase() === handleConArroba.toLowerCase())) {
                alert("❌ Ese nombre de usuario (@) ya está ocupado por otra persona. Elige otro.");
                return;
            }

            const idUnico = Math.floor(100000 + Math.random() * 900000);

            const usuarioData = {
                id: idUnico,
                nombre: document.getElementById("nombre").value,
                handle: handleConArroba,
                correo: document.getElementById("correo").value,
                password: document.getElementById("password").value,
                tipo: tipoEstudiante.value,
                area: tipoEstudiante.value === "pre" ? selectDinamico1.value : "",
                carrera: tipoEstudiante.value === "pre" ? selectCarreraPre.value : selectDinamico1.value,
                tema: temaActual,
                modoOscuro: modoOscuroActivo,
                ultimoCambioHandle: new Date().getTime()
            };

            listaUsuarios.push(usuarioData);
            localStorage.setItem("listaUsuariosLumis", JSON.stringify(listaUsuarios));
            localStorage.setItem("usuarioLumis", JSON.stringify(usuarioData));

            alert("✨ ¡Registro exitoso! Bienvenido a Lumis.");
            window.location.href = "../01_html/03_dashboard.html";
        });
    }
});