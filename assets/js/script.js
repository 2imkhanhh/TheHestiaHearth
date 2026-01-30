document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById('reservationModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const reserveBtns = document.querySelectorAll('.btn-reserve, .btn-footer-reserve, .btn-order-now');

    function openModal(e) {
        if(e) e.preventDefault();
        if(modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if(modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    reserveBtns.forEach(btn => btn.addEventListener('click', openModal));
    if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if(modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
    }
    document.addEventListener('keydown', function (e) {
        if (e.key === "Escape" && modal && modal.classList.contains('active')) closeModal();
    });

    if (document.getElementById('bookingFormModal')) {

        if (typeof flatpickr !== 'undefined') {
            flatpickr("#datePickerModal", {
                dateFormat: "d M Y", defaultDate: "today", minDate: "today", disableMobile: "true",
                appendTo: document.querySelector('.modal-content-wrapper') 
            });
        }

        const timeSelect = document.getElementById('timePickerModal');
        const peopleSelect = document.getElementById('peoplePickerModal');

        if (timeSelect) {
            for (let h = 10; h <= 22; h++) {
                timeSelect.add(new Option(`${h}:00`, `${h}:00`));
                if (h < 22) timeSelect.add(new Option(`${h}:30`, `${h}:30`));
            }
        }
        if (peopleSelect) {
            for (let i = 1; i <= 20; i++) {
                peopleSelect.add(new Option(i === 1 ? `${i} Person` : `${i} Persons`, i));
            }
            peopleSelect.options[1].selected = true;
        }

        const btnCheck = document.getElementById('btnCheckModal');
        const availableTimes = document.getElementById('availableTimesModal');
        
        if (btnCheck) {
            btnCheck.addEventListener('click', function (e) {
                e.preventDefault();
                if (availableTimes) {
                    availableTimes.style.display = 'flex';
                }
            });
        }

        const timeButtons = document.querySelectorAll('.modal-time-btn'); 
        const step1 = document.getElementById('step1-containerModal');
        const step2 = document.getElementById('step2-containerModal');
        const ind1 = document.getElementById('step1-indicatorModal');
        const ind2 = document.getElementById('step2-indicatorModal');
        const summary = document.getElementById('summaryTextModal');

        timeButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                const selectedTime = this.innerText;
                const selectedDate = document.getElementById('datePickerModal').value;
                const selectedPeople = peopleSelect.options[peopleSelect.selectedIndex].text;

                if (summary) summary.innerText = `You are booking for ${selectedPeople} on ${selectedDate} at ${selectedTime}`;
                
                step1.style.display = 'none';
                step2.style.display = 'block';
                ind1.classList.remove('active');
                ind1.innerHTML = '<span class="step-circle"><i class="fa-solid fa-check"></i></span> <span class="step-text">Find a table</span>';
                ind2.classList.add('active');
            });
        });

        const btnBack = document.getElementById('btnBackModal');
        if(btnBack) {
            btnBack.addEventListener('click', function() {
                step2.style.display = 'none';
                step1.style.display = 'block';
                ind1.classList.add('active');
                ind1.innerHTML = '<span class="step-circle">1</span> <span class="step-text">Find a table</span>';
                ind2.classList.remove('active');
            });
        }

        const btnComplete = document.getElementById('btnCompleteModal');
        if(btnComplete) {
            btnComplete.addEventListener('click', function() {
                const fname = document.getElementById('inputFNameModal').value.trim();
                const phone = document.getElementById('inputPhoneModal').value.trim();
                
                if (!fname || !phone) {
                    alert("Please fill in your Name and Phone Number.");
                    return;
                }
                alert("Reservation Successful! We will contact you shortly.");
                closeModal(); 
            });
        }
    }
});