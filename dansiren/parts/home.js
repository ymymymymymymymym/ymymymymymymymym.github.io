main();

function main () {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    // IntersectionObserverのオプション
    const options = {
        root: null, // ビューポートをルートにする
        threshold: 0.8 // スライドの50%が表示されたら検知
    };

    // IntersectionObserverのコールバック
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentIndex = Array.from(slides).indexOf(entry.target);
                dots.forEach(dot => dot.classList.remove("dot-highlighted"));
                dots[currentIndex].classList.add("dot-highlighted");
            }
        });
    }, options);

    // 各スライドを監視対象に設定
    slides.forEach(slide => {
        observer.observe(slide);
    });

    const slider = document.getElementById("slide-container");
    slider.addEventListener("scrollend", function() {
        observer
    });
}