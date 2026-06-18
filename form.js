document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const modal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    const modalOkBtn = document.getElementById('modalOkBtn');
    const modalDetails = document.getElementById('modalDetails');
    
    // Обработка отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем данные формы
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const consent = document.getElementById('consent').checked;
        
        // Проверка согласия (хотя required уже проверяет, но дополнительная проверка)
        if (!consent) {
            alert('Пожалуйста, дайте согласие на обработку персональных данных');
            return;
        }
        
        // Отправляем данные на сервер
        sendToServer({ name, email, message, consent });
        
        // Показываем детали в модальном окне
        modalDetails.innerHTML = `
            <strong>Отправленные данные:</strong><br>
            Имя: ${name}<br>
            Email: ${email}<br>
            Сообщение: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}
        `;
        
        // Показываем модальное окно
        showModal();
        
        // Очищаем форму
        form.reset();
    });
    
    // Функция показа модального окна
    function showModal() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
    }
    
    // Функция скрытия модального окна
    function hideModal() {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Возвращаем прокрутку
    }
    
    // Закрытие модального окна
    closeModal.addEventListener('click', hideModal);
    modalOkBtn.addEventListener('click', hideModal);
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            hideModal();
        }
    });
    
    // Функция отправки данных на сервер
    async function sendToServer(data) {
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error('Ошибка отправки');
            }
            
            const result = await response.json();
            console.log('Успешно отправлено:', result);
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
        }
    }
});