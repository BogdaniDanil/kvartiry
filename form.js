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
    
 // ===== НАСТРОЙКИ SUPABASE =====
const SUPABASE_URL = 'https://dxwgoyeqjldzsdnsgqhu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4d2dveWVxamxkenNkbnNncWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MDEwNTUsImV4cCI6MjA5NzM3NzA1NX0.387RYRaIRdktT-UVvYHqXFua_U5qJJq6gn63IZJ2nMw';

async function sendToServer(data) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contact_requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        message: data.message,
        consent: data.consent
      })
    });

    if (!response.ok) {
      throw new Error('Ошибка отправки');
    }

    console.log('Успешно отправлено в Supabase');
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
  }
}
});
