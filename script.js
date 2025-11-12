document.addEventListener('DOMContentLoaded', () => {
    feather.replace(); // Inicializa los iconos de Feather

    // --- Lógica de animación de aparición con IntersectionObserver (más eficiente) ---
    const revealElements = document.querySelectorAll('section:not(.hero)');

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Se activa cuando el 15% del elemento es visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opcional: deja de observar el elemento una vez que es visible para ahorrar recursos
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Lógica para el seguimiento de scroll (Scroll-Spy) ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-center a');

    const observerOptions = {
        root: null, // El viewport
        rootMargin: '0px',
        threshold: 0.4 // Se activa cuando el 40% de la sección es visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- Lógica para la barra de navegación flotante (Sticky Nav) ---
    const nav = document.querySelector('.floating-nav');
    // Obtenemos la posición donde la barra debe volverse "pegajosa"
    // En este caso, es justo después de que el hero sale de la vista.
    const heroSection = document.getElementById('hero');
    const stickyPoint = heroSection.offsetHeight - 150; // Un poco antes de que termine el hero

    // Inicialización del carrusel de la galería
    const gallerySwiper = new Swiper('.gallery-carousel', {
        // Opciones
        loop: true, // Para que el carrusel sea infinito
        slidesPerView: 1, // Mostrar 1 imagen a la vez en móvil
        spaceBetween: 20, // Espacio entre imágenes
        
        // Autoplay
        autoplay: {
            delay: 3000,
            disableOnInteraction: false, // El autoplay no se detiene si el usuario interactúa
        },

        // Paginación (los puntos inferiores)
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        // Botones de navegación (flechas)
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // Puntos de quiebre para diseño responsivo
        breakpoints: {
            // Cuando el ancho de la ventana es >= 768px
            768: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            // Cuando el ancho de la ventana es >= 1024px
            1024: {
                slidesPerView: 3,
                spaceBetween: 40
            }
        }
    });

    // --- Lógica para el scroll (solo para la barra de navegación) ---
    const handleScroll = () => {
        // Barra de navegación pegajosa (Sticky Nav)
        if (window.pageYOffset > stickyPoint) {
            nav.classList.add('sticky');
        } else {
            nav.classList.remove('sticky');
        }
    };

    window.addEventListener('scroll', handleScroll);

    // --- Lógica para la carga diferida del video de YouTube ---
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
        videoContainer.addEventListener('click', () => {
            const videoId = videoContainer.dataset.videoId;
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            iframe.title = "Cómo utilizar el tobogán de emergencia FIMMA";
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;

            // Limpiar el contenedor y añadir el iframe
            videoContainer.innerHTML = '';
            videoContainer.appendChild(iframe);
        });
    }

    // --- Lógica para el menú de hamburguesa en móvil ---
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const closeBtn = document.querySelector('.close-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const openMobileMenu = () => {
        mobileNav.classList.add('open');
        mobileNavOverlay.classList.add('open');
    };

    const closeMobileMenu = () => {
        mobileNav.classList.remove('open');
        mobileNavOverlay.classList.remove('open');
    }

    hamburgerBtn.addEventListener('click', openMobileMenu);
    closeBtn.addEventListener('click', closeMobileMenu);
    mobileNavOverlay.addEventListener('click', closeMobileMenu);
    // Cierra el menú al hacer clic en un enlace
    mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

    // --- Lógica para pre-rellenar el formulario de contacto desde los productos ---
    const productContactButtons = document.querySelectorAll('.product-card .cta-button');
    const messageTextarea = document.getElementById('message');

    const generateMessageTemplate = (product) => `Hola, quisiera cotizar lo siguiente:

- Producto de interés: ${product}
- Nombre del establecimiento: 
- Ubicación (Comuna/Ciudad): 
- Teléfono: 

Gracias, quedo atento/a.`;

    productContactButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productName = e.currentTarget.dataset.product;
            if (productName && messageTextarea) {
                messageTextarea.value = generateMessageTemplate(productName);
            }
        });
    });
});