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
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }
    document.addEventListener('keydown', (e) => { if (e.key === "Escape" && modal && modal.classList.contains('active')) closeModal(); });
    
    if (document.getElementById('bookingFormModal')) {

        if (typeof flatpickr !== 'undefined') {
            flatpickr("#datePickerModal", {
                dateFormat: "d M Y", defaultDate: "today", minDate: "today", disableMobile: "true",
                appendTo: document.querySelector('.modal-content-wrapper'),
                clickOpens: false,
                onReady: function(selectedDates, dateStr, instance) {
                    instance.input.addEventListener("click", function() { instance.toggle(); });
                }
            });
        }

        const timeSelect = document.getElementById('timePickerModal');
        const peopleSelect = document.getElementById('peoplePickerModal');
        const locSelect = document.getElementById('locationPickerModal');

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
        const availableTimesContainer = document.getElementById('availableTimesModal');
        const summaryText = document.getElementById('summaryTextModal');
        
        if (btnCheck) {
            btnCheck.addEventListener('click', function (e) {
                e.preventDefault();
                
                const selectedVal = timeSelect.value;
                if(!selectedVal) return;
                const hour = parseInt(selectedVal.split(':')[0]);

                availableTimesContainer.innerHTML = '';

                const header = document.createElement('div');
                header.className = 'w-100 text-center mb-2';
                header.style.cssText = "font-family:'Bricolage Grotesque'; font-size:14px; color:#666;";
                header.innerText = 'Select a time to proceed:';
                availableTimesContainer.appendChild(header);

                const minutes = [0, 15, 30, 45, 60];
                minutes.forEach(min => {
                    let displayHour = hour;
                    let displayMin = min;
                    if (min === 60) {
                        displayHour = hour + 1;
                        displayMin = 0;
                    }
                    const timeStr = `${displayHour}:${displayMin.toString().padStart(2, '0')}`;

                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'time-slot-btn modal-time-btn'; 
                    btn.innerText = timeStr;

                    btn.addEventListener('click', function () {
                        const selectedDate = document.getElementById('datePickerModal').value;
                        const selectedPeople = peopleSelect.options[peopleSelect.selectedIndex].text;
                        const selectedLoc = locSelect ? locSelect.options[locSelect.selectedIndex].text : '';

                        if (summaryText) {
                            summaryText.innerText = `Booking at ${selectedLoc} for ${selectedPeople} on ${selectedDate} at ${timeStr}`;
                        }
                        
                        const step1 = document.getElementById('step1-containerModal');
                        const step2 = document.getElementById('step2-containerModal');
                        const ind1 = document.getElementById('step1-indicatorModal');
                        const ind2 = document.getElementById('step2-indicatorModal');

                        if(step1 && step2) {
                            step1.style.display = 'none';
                            step2.style.display = 'block';
                            ind1.classList.remove('active');
                            ind1.innerHTML = '<span class="step-circle"><i class="fa-solid fa-check"></i></span> <span class="step-text">Find a table</span>';
                            ind2.classList.add('active');
                        }
                    });

                    availableTimesContainer.appendChild(btn);
                });

                availableTimesContainer.style.display = 'flex';
            });
        }

        const btnBack = document.getElementById('btnBackModal');
        if(btnBack) {
            btnBack.addEventListener('click', function() {
                const step1 = document.getElementById('step1-containerModal');
                const step2 = document.getElementById('step2-containerModal');
                const ind1 = document.getElementById('step1-indicatorModal');
                const ind2 = document.getElementById('step2-indicatorModal');

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