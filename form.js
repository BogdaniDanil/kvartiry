// ===== НАСТРОЙКИ SUPABASE =====
const SUPABASE_URL = 'https://dxwgoyeqjldzsdnsgqhu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4d2dveWVxamxkenNkbnNncWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MDEwNTUsImV4cCI6MjA5NzM3NzA1NX0.387RYRaIRdktT-UVvYHqXFua_U5qJJq6gn63IZJ2nMw';

// Инициализация Supabase клиента
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Элементы формы
const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const consentCheckbox = document.getElementById('consent');
const submitBtn = form.querySelector('button[type="submit"]');

// Валидация email
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Показать ошибку
function showError(input, message) {
  // Создаем элемент ошибки
  let errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.style.color = '#dc3545';
  errorElement.style.fontSize = '0.85em';
  errorElement.style.marginTop = '5px';
  errorElement.textContent = message;
  
  // Вставляем ошибку после поля ввода
  input.parentNode.insertBefore(errorElement, input.nextSibling);
  
  // Добавляем красную границу (кроме чекбокса)
  if (input.type !== 'checkbox') {
    input.style.borderColor = '#dc3545';
  }
}

// Убрать ошибку
function clearError(input) {
  // Ищем следующий элемент с классом error-message
  const nextElement = input.nextElementSibling;
  if (nextElement && nextElement.classList.contains('error-message')) {
    nextElement.remove();
  }
  
  // Убираем красную границу
  if (input.type !== 'checkbox') {
    input.style.borderColor = '';
  }
}

// Валидация формы
function validateForm() {
  let isValid = true;

  // Очистка предыдущих ошибок
  [nameInput, emailInput, messageInput, consentCheckbox].forEach(clearError);

  // Валидация имени
  if (!nameInput.value.trim()) {
    showError(nameInput, 'Пожалуйста, введите ваше имя');
    isValid = false;
  }

  // Валидация email
  if (!emailInput.value.trim()) {
    showError(emailInput, 'Пожалуйста, введите ваш email');
    isValid = false;
  } else if (!isValidEmail(emailInput.value)) {
    showError(emailInput, 'Пожалуйста, введите корректный email');
    isValid = false;
  }

  // Валидация сообщения
  if (!messageInput.value.trim()) {
    showError(messageInput, 'Пожалуйста, введите сообщение');
    isValid = false;
  }

  // Валидация согласия
  if (!consentCheckbox.checked) {
    showError(consentCheckbox, 'Необходимо дать согласие на обработку персональных данных');
    isValid = false;
  }

  return isValid;
}

// Отправка данных в Supabase
async function sendToSupabase(data) {
  try {
    const { error } = await db
      .from('contact_requests')
      .insert([
        {
          name: data.name,
          email: data.email,
          message: data.message,
          consent: data.consent
        }
      ]);

    if (error) {
      throw error;
    }

    console.log('✅ Заявка успешно отправлена в Supabase');
  } catch (error) {
    console.error('❌ Ошибка отправки:', error);
    throw new Error('Не удалось отправить заявку. Попробуйте позже.');
  }
}

// Обработка отправки формы
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Валидация
  if (!validateForm()) {
    return;
  }

  // Блокировка кнопки
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Отправка...';

  // Сбор данных
  const formData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim(),
    consent: consentCheckbox.checked
  };

  try {
    // Отправка в Supabase
    await sendToSupabase(formData);

    // Успех
    alert('✅ Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.');
    
    // Очистка формы
    form.reset();
    
  } catch (error) {
    alert('❌ ' + error.message);
  } finally {
    // Разблокировка кнопки
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Отправить';
  }
});

// Очистка ошибок при вводе
[nameInput, emailInput, messageInput, consentCheckbox].forEach(input => {
  input.addEventListener('input', () => clearError(input));
  input.addEventListener('change', () => clearError(input));
});
