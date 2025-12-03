document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnConfirmarEntrega");

    btn.addEventListener("click", (e) => {
        e.preventDefault(); 
        
        alert("Obrigado pela compra! Seu pedido está em preparo e será enviado em breve!");

        // Redirecionar para a página inicial
        window.location.href = "../index.html";
    });
});
