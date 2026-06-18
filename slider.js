const slides = document.querySelectorAll('.slider__img');
const thumbs = document.querySelectorAll('.slider__thumb');

const prevBtn = document.querySelector('.slider__btn--prev');
const nextBtn = document.querySelector('.slider__btn--next');

let currentSlide = 0;

function showSlide(index) {

    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    thumbs.forEach(thumb => {
        thumb.classList.remove('active');
    });

    slides[index].classList.add('active');
    thumbs[index].classList.add('active');

    currentSlide = index;
}

nextBtn.addEventListener('click', () => {

    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    showSlide(currentSlide);

});

prevBtn.addEventListener('click', () => {

    currentSlide--;

    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);

});

thumbs.forEach((thumb, index) => {

    thumb.addEventListener('click', () => {

        showSlide(index);

    });

});