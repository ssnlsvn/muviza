document.addEventListener("DOMContentLoaded", () => {
    const circulosTemas = document.querySelectorAll(".circulo-tema");
    const btnModoOscuro = document.getElementById("btnModoOscuro");
    const iconoModo = document.getElementById("iconoModo");
    const textoModo = document.getElementById("textoModo");

    const formLogin = document.getElementById("formLogin");
    const linkRecuperar = document.getElementById("linkRecuperar");

    let temaActual = "mint";
    let modoOscuroActivo = false;

    // 1. Manejo de los 3 Temas estéticos
    circulosTemas.forEach(circulo => {
        circulo.addEventListener("click", () => {
            circulosTemas.forEach(c => c.classList.remove("activo"));
            circulo.classList.add("activo");
            temaActual = circulo.getAttribute("data-tema");
            
            document.documentElement.removeAttribute("data-theme");
            if (temaActual !== "mint") {
                document.documentElement.setAttribute("data-theme", temaActual);
            }
        });
    });

    // 2. Botón de Modo Oscuro Interactivo
    if (btnModoOscuro) {
        btnModoOscuro.addEventListener("click", () => {
            modoOscuroActivo = !modoOscuroActivo;
            
            if (modoOscuroActivo) {
                btnModoOscuro.classList.add("activo");
                iconoModo.textContent = "☀️";
                textoModo.textContent = "Modo Oscuro: ON";
                document.documentElement.setAttribute("data-mode", "dark");
            } else {
                btnModoOscuro.classList.remove("activo");
                iconoModo.textContent = "🌙";
                textoModo.textContent = "Modo Oscuro: OFF";
                document.documentElement.removeAttribute("data-mode");
            }
        });
    }

    // 3. Recuperación de contraseña con código de verificación (Buscando en la lista global)
    if (linkRecuperar) {
        linkRecuperar.addEventListener("click", (e) => {
            e.preventDefault();
            const correoIngresado = prompt("Ingresa tu correo electrónico registrado para recuperar tu contraseña:");
            
            if (correoIngresado) {
                let listaUsuarios = JSON.parse(localStorage.getItem("listaUsuariosLumis")) || [];
                let usuarioEncontrado = listaUsuarios.find(u => u.correo.toLowerCase() === correoIngresado.trim().toLowerCase());
                
                // Si no está en la lista, revisamos por compatibilidad el usuario único actual
                let usuarioUnico = JSON.parse(localStorage.getItem("usuarioLumis"));
                if (!usuarioEncontrado && usuarioUnico && usuarioUnico.correo.toLowerCase() === correoIngresado.trim().toLowerCase()) {
                    usuarioEncontrado = usuarioUnico;
                }

                if (usuarioEncontrado) {
                    const codigoVerificacion = Math.floor(1000 + Math.random() * 9000);
                    alert(`📧 [Simulación de Correo Lumis]\nHemos enviado un código de recuperación a: ${correoIngresado}\n\n🔑 Tu código secreto es: ${codigoVerificacion}`);
                    
                    const codigoIngresado = prompt("Ingresa el código de 4 dígitos que recibiste:");
                    
                    if (codigoIngresado === codigoVerificacion.toString()) {
                        const nuevaPassword = prompt("✅ ¡Código verificado con éxito!\nIngresa tu nueva contraseña:");
                        if (nuevaPassword) {
                            usuarioEncontrado.password = nuevaPassword;
                            
                            // Actualizamos en la lista global
                            listaUsuarios = listaUsuarios.map(u => u.correo.toLowerCase() === usuarioEncontrado.correo.toLowerCase() ? usuarioEncontrado : u);
                            localStorage.setItem("listaUsuariosLumis", JSON.stringify(listaUsuarios));
                            
                            // Actualizamos sesión actual
                            localStorage.setItem("usuarioLumis", JSON.stringify(usuarioEncontrado));

                            alert("🎉 ¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.");
                        }
                    } else {
                        alert("❌ Código incorrecto. Proceso de recuperación cancelado.");
                    }
                } else {
                    alert("❌ Este correo no se encuentra registrado en Lumis.");
                }
            }
        });
    }

    // 4. Validación del inicio de sesión manual (Buscando en la lista de registrados)
    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();
            const correoInput = document.getElementById("loginCorreo").value.trim().toLowerCase();
            const passwordInput = document.getElementById("loginPassword").value.trim();

            const listaUsuarios = JSON.parse(localStorage.getItem("listaUsuariosLumis")) || [];
            let usuarioEncontrado = listaUsuarios.find(u => u.correo.toLowerCase() === correoInput && u.password === passwordInput);

            // Respaldo con la sesión única anterior
            if (!usuarioEncontrado) {
                const usuarioUnico = JSON.parse(localStorage.getItem("usuarioLumis"));
                if (usuarioUnico && usuarioUnico.correo.toLowerCase() === correoInput && usuarioUnico.password === passwordInput) {
                    usuarioEncontrado = usuarioUnico;
                }
            }

            if (usuarioEncontrado) {
                localStorage.setItem("usuarioLumis", JSON.stringify(usuarioEncontrado));
                alert(`🌸 ¡Bienvenida de nuevo, ${usuarioEncontrado.nombre}!\nTu ID Único verificado es: #${usuarioEncontrado.id}`);
                window.location.href = "03_dashboard.html";
            } else {
                alert("❌ Correo o contraseña incorrectos. Verifica tus datos.");
            }
        });
    }
});