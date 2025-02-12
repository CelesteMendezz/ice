// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalado');
    event.waitUntil(
        caches.open('Icecream-Store-PWA')
            .then((cache) => {
                return cache.addAll([
                    './',
                    './index.html',
                    './css/style.css',  
                    './manifest.json',
                    './app.js',
                    './css/style.min.css',
                    './ws.js',
                    './about.html',
                    './contact.html',
                    './gallery.html',
                    './product.html',
                    './service.html',
                    './images/cap1.png',
                    './images/cap2.png',
                    './images/ico1.png',
                    './images/ico2.png',
                    './img/about.jpg',
                    './img/carousel-1.jpg',
                    './img/carousel-2.jpg',
                    './img/header.jpg',
                    './img/portfolio-1.jpg',
                    './img/portfolio-2.jpg',
                    './img/portfolio-3.jpg',
                    './img/portfolio-4.jpg',
                    './img/portfolio-5.jpg',
                    './img/portfolio-6.jpg',
                    './img/product-1.jpg',
                    './img/product-2.jpg',
                    './img/product-3.jpg',
                    './img/product-4.jpg',
                    './img/product-5.jpg',
                    './img/promotion.jpg',
                    './img/service-1.jpg',
                    './img/service-2.jpg',
                    './img/service-3.jpg',
                    './img/service-4.jpg',
                    './img/team-1.jpg',
                    './img/team-2.jpg',
                    './img/team-3.jpg',
                    './img/team-4.jpg',
                    './img/testimonial-1.jpg',
                    './img/testimonial-2.jpg',
                    './img/testimonial-3.jpg',
                    './js/main.js',
                    './lib/owlcarousel/assets/owl.carousel.min.css',
                    './lib/lightbox/css/lightbox.min.css',
                    './lib/easing/easing.min.js',
                    './lib/waypoints/waypoints.min.js',
                    './lib/owlcarousel/owl.carousel.min.js',
                    './lib/isotope/isotope.pkgd.min.js',
                    './lib/lightbox/js/lightbox.min.js',
                    './mail/jqBootstrapValidation.min.js',
                    './mail/contact.js'
                
                    
                ]);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['Icecream-Store-PWA'];
    console.log('Service Worker: Activado');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch
self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetch solicitado para', event.request.url);

    // Excluir peticiones con esquema 'chrome-extension://'
    if (event.request.url.startsWith('chrome-extension://')) {
        return;
    }

    // Manejar Google Fonts
    if (event.request.url.includes('fonts.googleapis.com') || event.request.url.includes('fonts.gstatic.com')) {
        event.respondWith(
            caches.open('google-fonts').then((cache) => {
                return fetch(event.request).then((response) => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    let responseToCache = response.clone();
                    cache.put(event.request, responseToCache);
                    return response;
                }).catch(() => caches.match(event.request));
            })
        );
        return;
    }

    // Manejar otras solicitudes
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request)
                    .then((fetchResponse) => {
                        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                            return fetchResponse;
                        }
                        let responseToCache = fetchResponse.clone();
                        caches.open('Icecream-Store-PWA')
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return fetchResponse;
                    });
            })
            .catch(() => {
                console.error('Error en la solicitud fetch', event.request.url);
                return new Response('Recurso no disponible en caché y la red no está accesible.', { 
                    status: 503, 
                    statusText: 'Servicio no disponible'
                });
            })
    );
});