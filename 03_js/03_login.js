document.addEventListener("DOMContentLoaded", () => {
    const circulosTemas = document.querySelectorAll(".circulo-tema");
    const btnModoOscuro = document.getElementById("btnModoOscuro");
    const iconoModo = document.getElementById("iconoModo");
    const textoModo = document.getElementById("textoModo");

    const formLogin = document.getElementById("formLogin");
    const btnGoogleLogin = document.getElementById("btnGoogleLogin");
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

    // 3. Inicio de sesión simulado con Google -> Redirige al Dashboard
    if (btnGoogleLogin) {
        btnGoogleLogin.addEventListener("click", () => {
            const usuarioGuardado = localStorage.getItem("usuarioLumis");
            if (usuarioGuardado) {
                alert("✨ ¡Inicio de sesión exitoso con Google! Bienvenida de vuelta.");
                window.location.href = "03_dashboard.html";
            } else {
                alert("⚠️ No hay ninguna cuenta registrada. Por favor regístrate primero en el Ítem 1.");
                window.location.href = "../index.html";
            }
        });
    }

    // 4. Recuperación de contraseña con código de verificación
    if (linkRecuperar) {
        linkRecuperar.addEventListener("click", (e) => {
            e.preventDefault();
            const correoIngresado = prompt("Ingresa tu correo electrónico registrado para recuperar tu contraseña:");
            
            if (correoIngresado) {
                const usuarioGuardado = JSON.parse(localStorage.getItem("usuarioLumis"));
                
                if (usuarioGuardado && usuarioGuardado.correo === correoIngresado) {
                    const codigoVerificacion = Math.floor(1000 + Math.random() * 9000);
                    alert(`📧 [Simulación de Correo]\nHemos enviado un código de verificación a: ${correoIngresado}\n\nTu código secreto es: ${codigoVerificacion}`);
                    
                    const codigoIngresado = prompt("Ingresa el código de 4 dígitos que recibiste:");
                    
                    if (codigoIngresado === codigoVerificacion.toString()) {
                        const nuevaPassword = prompt("✅ ¡Código verificado con éxito!\nIngresa tu nueva contraseña:");
                        if (nuevaPassword) {
                            usuarioGuardado.password = nuevaPassword;
                            localStorage.setItem("usuarioLumis", JSON.stringify(usuarioGuardado));
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

    // 5. Validación del inicio de sesión manual -> Redirige al Dashboard
    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();
            const correoInput = document.getElementById("loginCorreo").value.trim();
            const passwordInput = document.getElementById("loginPassword").value.trim();

            const usuarioGuardado = JSON.parse(localStorage.getItem("usuarioLumis"));

            if (usuarioGuardado && usuarioGuardado.correo === correoInput && usuarioGuardado.password === passwordInput) {
                alert(`🌸 ¡Bienvenida de nuevo, ${usuarioGuardado.nombre}!\nTu ID Único verificado es: #${usuarioGuardado.id}`);
                window.location.href = "03_dashboard.html";
            } else {
                alert("❌ Correo o contraseña incorrectos. Verifica tus datos.");
            }
        });
    }
});