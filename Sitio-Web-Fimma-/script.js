document.addEventListener('DOMContentLoaded', () => {
    // Animación de aparición al hacer scroll
    feather.replace(); // Inicializa los iconos de Feather

    const revealElements = document.querySelectorAll('section:not(.hero)');

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

    // --- Lógica combinada para el scroll ---
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        // Animación de aparición
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                el.classList.add('visible');
            }
        });

        // Barra de navegación pegajosa (Sticky Nav)
        if (window.pageYOffset > stickyPoint) {
            nav.classList.add('sticky');
        } else {
            nav.classList.remove('sticky');
        }
    };

    window.addEventListener('scroll', revealOnScroll);
    // Ejecutar una vez al cargar la página para los elementos ya visibles
    revealOnScroll();

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

    // --- Lógica para el menú desplegable "Más" en móvil ---
    const dropdown = document.querySelector('.nav-dropdown');
    const moreButton = document.querySelector('.nav-more-button');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (moreButton) {
        moreButton.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que el enlace '#' navegue
            e.stopPropagation(); // Detiene la propagación del clic
            dropdown.classList.toggle('open');
            dropdownMenu.classList.toggle('show');
        });
    }

    // Cierra el menú si se hace clic fuera de él
    window.addEventListener('click', (e) => {
        if (dropdown && dropdown.classList.contains('open')) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
                dropdownMenu.classList.remove('show');
            }
        }
    });
});