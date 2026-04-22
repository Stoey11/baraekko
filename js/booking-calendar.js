// ===== BOOKING CALENDAR =====
(function() {
  // State
  const state = {
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    selectedDate: null,
    selectedTime: null,
    partySize: 2
  };

  // DOM references
  const calendarGrid = document.getElementById('calendarGrid');
  const calendarTitle = document.getElementById('calendarTitle');
  const prevBtn = document.getElementById('calendarPrev');
  const nextBtn = document.getElementById('calendarNext');
  const timeSlotsContainer = document.getElementById('timeSlots');
  const timeSlotsGrid = document.getElementById('timeSlotsGrid');
  const partySizeContainer = document.getElementById('partySize');
  const partySizeCount = document.getElementById('partySizeCount');
  const partySizeMinus = document.getElementById('partySizeMinus');
  const partySizePlus = document.getElementById('partySizePlus');
  const bookingForm = document.getElementById('bookingForm');
  const submitBtn = document.getElementById('bookingSubmit');
  const bookingMain = document.getElementById('bookingMain');
  const confirmationPanel = document.getElementById('bookingConfirmation');
  const resetBtn = document.getElementById('bookingReset');

  // Sidebar values
  const sidebarDate = document.getElementById('sidebarDate');
  const sidebarTime = document.getElementById('sidebarTime');
  const sidebarGuests = document.getElementById('sidebarGuests');

  // Steps
  const steps = document.querySelectorAll('.booking-step');

  if (!calendarGrid) return;

  const MONTHS_DA = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni',
                     'Juli', 'August', 'September', 'Oktober', 'November', 'December'];
  const WEEKDAYS_DA = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

  // Opening hours
  function getClosingHour(dayOfWeek) {
    // 0=Sun, 5=Fri, 6=Sat
    return (dayOfWeek === 5 || dayOfWeek === 6) ? 24 : 22;
  }

  function generateTimeSlots(date) {
    const day = date.getDay();
    const close = getClosingHour(day);
    const lastSlot = close - 1.5;
    const slots = [];
    for (let h = 10; h <= Math.floor(lastSlot); h++) {
      slots.push(`${String(h).padStart(2, '0')}:00`);
      if (h + 0.5 <= lastSlot) {
        slots.push(`${String(h).padStart(2, '0')}:30`);
      }
    }
    return slots;
  }

  // Render calendar
  function renderCalendar() {
    const year = state.currentYear;
    const month = state.currentMonth;

    calendarTitle.textContent = `${MONTHS_DA[month]} ${year}`;

    // Disable prev if current month
    const now = new Date();
    prevBtn.disabled = (year === now.getFullYear() && month === now.getMonth());

    // First day of month (adjusted for Monday start)
    let firstDay = new Date(year, month, 1).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1; // Monday = 0

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    calendarGrid.innerHTML = '';

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'calendar__day calendar__day--empty';
      calendarGrid.appendChild(empty);
    }

    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      date.setHours(0, 0, 0, 0);
      const btn = document.createElement('button');
      btn.className = 'calendar__day';
      btn.textContent = d;

      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      const isSelected = state.selectedDate && date.getTime() === state.selectedDate.getTime();

      if (isPast) {
        btn.classList.add('calendar__day--past');
      } else {
        btn.addEventListener('click', () => selectDate(date));
      }

      if (isToday) btn.classList.add('calendar__day--today');
      if (isSelected) btn.classList.add('calendar__day--selected');

      calendarGrid.appendChild(btn);
    }
  }

  // Select date
  function selectDate(date) {
    state.selectedDate = date;
    state.selectedTime = null;

    renderCalendar();
    renderTimeSlots();
    updateSteps(1);
    updateSidebar();

    timeSlotsContainer.classList.add('visible');
    partySizeContainer.classList.add('visible');
  }

  // Render time slots
  function renderTimeSlots() {
    if (!state.selectedDate) return;

    const slots = generateTimeSlots(state.selectedDate);
    timeSlotsGrid.innerHTML = '';

    slots.forEach(time => {
      const btn = document.createElement('button');
      btn.className = 'time-slot';
      btn.textContent = time;

      if (state.selectedTime === time) {
        btn.classList.add('selected');
      }

      btn.addEventListener('click', () => selectTime(time));
      timeSlotsGrid.appendChild(btn);
    });
  }

  // Select time
  function selectTime(time) {
    state.selectedTime = time;
    renderTimeSlots();
    updateSteps(2);
    updateSidebar();

    bookingForm.classList.add('visible');
  }

  // Party size stepper
  if (partySizeMinus && partySizePlus) {
    partySizeMinus.addEventListener('click', () => {
      if (state.partySize > 1) {
        state.partySize--;
        partySizeCount.textContent = state.partySize;
        partySizeMinus.disabled = state.partySize <= 1;
        partySizePlus.disabled = false;
        updateSidebar();
      }
    });

    partySizePlus.addEventListener('click', () => {
      if (state.partySize < 12) {
        state.partySize++;
        partySizeCount.textContent = state.partySize;
        partySizePlus.disabled = state.partySize >= 12;
        partySizeMinus.disabled = false;
        updateSidebar();
      }
    });
  }

  // Update steps indicator
  function updateSteps(activeIndex) {
    steps.forEach((step, i) => {
      step.classList.remove('active', 'completed');
      if (i < activeIndex) step.classList.add('completed');
      if (i === activeIndex) step.classList.add('active');
    });
  }

  // Update sidebar
  function updateSidebar() {
    if (sidebarDate) {
      if (state.selectedDate) {
        const d = state.selectedDate;
        sidebarDate.textContent = `${d.getDate()}. ${MONTHS_DA[d.getMonth()]} ${d.getFullYear()}`;
        sidebarDate.classList.remove('booking-sidebar__value--empty');
      } else {
        sidebarDate.textContent = 'Vælg dato';
        sidebarDate.classList.add('booking-sidebar__value--empty');
      }
    }

    if (sidebarTime) {
      if (state.selectedTime) {
        sidebarTime.textContent = state.selectedTime;
        sidebarTime.classList.remove('booking-sidebar__value--empty');
      } else {
        sidebarTime.textContent = 'Vælg tid';
        sidebarTime.classList.add('booking-sidebar__value--empty');
      }
    }

    if (sidebarGuests) {
      sidebarGuests.textContent = `${state.partySize} ${state.partySize === 1 ? 'gæst' : 'gæster'}`;
    }
  }

  // Form validation & submission
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const name = document.getElementById('bookingName');
      const email = document.getElementById('bookingEmail');
      const phone = document.getElementById('bookingPhone');
      let valid = true;

      // Clear previous errors
      document.querySelectorAll('.form-input--error').forEach(el => el.classList.remove('form-input--error'));
      document.querySelectorAll('.form-error').forEach(el => el.remove());

      // Validate name
      if (!name.value.trim()) {
        showError(name, 'Indtast venligst dit navn');
        valid = false;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailRegex.test(email.value)) {
        showError(email, 'Indtast venligst en gyldig email');
        valid = false;
      }

      // Validate date & time selection
      if (!state.selectedDate || !state.selectedTime) {
        valid = false;
      }

      if (valid) {
        showConfirmation(name.value, email.value, phone.value);
      }
    });
  }

  function showError(input, message) {
    input.classList.add('form-input--error');
    const err = document.createElement('div');
    err.className = 'form-error';
    err.textContent = message;
    input.parentNode.appendChild(err);
  }

  function showConfirmation(name, email, phone) {
    // Populate confirmation
    document.getElementById('confirmDate').textContent =
      `${state.selectedDate.getDate()}. ${MONTHS_DA[state.selectedDate.getMonth()]} ${state.selectedDate.getFullYear()}`;
    document.getElementById('confirmTime').textContent = state.selectedTime;
    document.getElementById('confirmGuests').textContent = `${state.partySize} ${state.partySize === 1 ? 'gæst' : 'gæster'}`;
    document.getElementById('confirmName').textContent = name;
    document.getElementById('confirmEmail').textContent = email;

    // Show confirmation, hide form
    bookingMain.style.display = 'none';
    confirmationPanel.classList.add('visible');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Reset booking
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.selectedDate = null;
      state.selectedTime = null;
      state.partySize = 2;

      partySizeCount.textContent = 2;
      timeSlotsContainer.classList.remove('visible');
      partySizeContainer.classList.remove('visible');
      bookingForm.classList.remove('visible');
      confirmationPanel.classList.remove('visible');
      bookingMain.style.display = '';

      document.getElementById('bookingName').value = '';
      document.getElementById('bookingEmail').value = '';
      document.getElementById('bookingPhone').value = '';
      document.getElementById('bookingRequests').value = '';

      updateSteps(0);
      updateSidebar();
      renderCalendar();
    });
  }

  // Calendar navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      state.currentMonth--;
      if (state.currentMonth < 0) {
        state.currentMonth = 11;
        state.currentYear--;
      }
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      state.currentMonth++;
      if (state.currentMonth > 11) {
        state.currentMonth = 0;
        state.currentYear++;
      }
      renderCalendar();
    });
  }

  // Initialize
  updateSteps(0);
  updateSidebar();
  renderCalendar();
})();
