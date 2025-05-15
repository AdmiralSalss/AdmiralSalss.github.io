document.addEventListener('DOMContentLoaded', () => {
    const backgroundMusic = document.getElementById('background-music');
    const soundToggle = document.getElementById('sound-toggle');
    const backgroundVideo = document.getElementById('background-video');
    const particles = document.getElementById('particles');
    
    createParticles();
    
    // Пытаемся запустить музыку сразу при загрузке
    backgroundMusic.play().catch(error => {
        console.log('Автовоспроизведение заблокировано, ожидаем взаимодействия с пользователем');
        
        // Функция для запуска музыки после взаимодействия с пользователем
        const startMusic = () => {
            backgroundMusic.play().catch(error => {
                console.error('Ошибка аудио:', error);
            });
            document.removeEventListener('click', startMusic);
            document.removeEventListener('touchstart', startMusic);
            document.removeEventListener('keydown', startMusic);
        };
        
        // Слушаем различные события взаимодействия с пользователем
        document.addEventListener('click', startMusic);
        document.addEventListener('touchstart', startMusic);
        document.addEventListener('keydown', startMusic);
    });
    
    let isMuted = false;
    soundToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        backgroundMusic.muted = isMuted;
        soundToggle.textContent = isMuted ? '🔇' : '🔊';
        
        soundToggle.classList.add('pulse-animation');
        setTimeout(() => {
            soundToggle.classList.remove('pulse-animation');
        }, 500);
    });
    
    backgroundVideo.addEventListener('canplay', () => {
        backgroundVideo.play().catch(error => {
            console.error('Ошибка видео:', error);
        });
    });
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const header = document.querySelector('header');
        const infoCard = document.querySelector('.info-card');
        const logo = document.querySelector('.logo-container');
        const title = document.querySelector('.title');
        
        header.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        infoCard.style.transform = `translate(${x * -20}px, ${y * -20}px) perspective(800px) rotateY(${x * 5}deg) rotateX(${y * -5}deg)`;
        logo.style.transform = `scale(${1 + (x + y) * 0.05}) rotate(${(x - 0.5) * 10}deg)`;

        moveParticles(x, y);
    });
    
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.boxShadow = '0 0 20px rgba(0, 0, 255, 0.8)';
            animateGlow(btn);
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.boxShadow = '';
            stopGlowAnimation(btn);
        });
    });
    
    function animateGlow(element) {
        element._glowInterval = setInterval(() => {
            const hue = Math.floor(Math.random() * 60) + 200; // Синие оттенки
            element.style.boxShadow = `0 0 20px hsla(${hue}, 100%, 50%, 0.8)`;
        }, 200);
    }
    
    function stopGlowAnimation(element) {
        if (element._glowInterval) {
            clearInterval(element._glowInterval);
            element._glowInterval = null;
        }
    }
    
    function createParticles() {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 5 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            const hue = Math.floor(Math.random() * 60) + 200;
            particle.style.backgroundColor = `hsla(${hue}, 100%, 70%, ${Math.random() * 0.7 + 0.3})`;

            particle.style.animation = `float ${Math.random() * 15 + 10}s infinite linear`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            particles.appendChild(particle);
        }
    }
    
    function moveParticles(x, y) {
        const allParticles = document.querySelectorAll('.particle');
        
        allParticles.forEach((particle, index) => {
            const speed = index % 5 + 1;
            const moveX = (x - 0.5) * speed;
            const moveY = (y - 0.5) * speed;
            
            setTimeout(() => {
                particle.style.transform = `translate(${moveX * 20}px, ${moveY * 20}px)`;
            }, index * 5);
        });
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .particle {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            transition: transform 1s ease-out;
            box-shadow: 0 0 10px rgba(0, 0, 255, 0.5);
        }
        
        @keyframes float {
            0% {
                transform: translate(0, 0) rotate(0deg);
            }
            33% {
                transform: translate(30px, -50px) rotate(120deg);
            }
            66% {
                transform: translate(-20px, 20px) rotate(240deg);
            }
            100% {
                transform: translate(0, 0) rotate(360deg);
            }
        }
        
        .pulse-animation {
            animation: pulse-effect 0.5s ease;
        }
        
        @keyframes pulse-effect {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}); 