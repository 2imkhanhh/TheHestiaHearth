document.addEventListener("DOMContentLoaded", function () {
    // =========================================================
    // CẤU HÌNH & TRẠNG THÁI: SINGLE BRANCH MODE
    // =========================================================
    // true = Chế độ 1 chi nhánh (Bỏ qua bước Location, bắt đầu từ Time)
    // false = Chế độ nhiều chi nhánh (Quy trình 3 bước chuẩn)
    let IS_SINGLE_BRANCH = false; 

    // Hàm khởi tạo lại quy trình đặt bàn dựa trên cấu hình
    function initReservationFlow() {
        const step1Ind = document.getElementById('step1-indicator');
        const step2Ind = document.getElementById('step2-indicator');
        const step3Ind = document.getElementById('step3-indicator');
        const step1Container = document.getElementById('step1-container');
        const step2Container = document.getElementById('step2-container');
        const step3Container = document.getElementById('step3-container');
        const backBtnStep2 = document.querySelector('#step2-container .back-link');

        // 1. Reset toàn bộ hiển thị về ẩn
        if(step1Container) step1Container.style.display = 'none';
        if(step2Container) step2Container.style.display = 'none';
        if(step3Container) step3Container.style.display = 'none';

        // 2. Reset trạng thái thanh tiến trình (về mặc định 1, 2, 3)
        [step1Ind, step2Ind, step3Ind].forEach(el => {
            if(el) {
                el.classList.remove('active');
                const circle = el.querySelector('.step-circle');
                // Reset icon về số gốc
                if(el.id === 'step1-indicator') circle.innerHTML = '1';
                if(el.id === 'step2-indicator') circle.innerHTML = '2';
                if(el.id === 'step3-indicator') circle.innerHTML = '3';
                // Reset text (nếu cần)
                if(el.id === 'step2-indicator') el.querySelector('.step-text').innerText = 'Time';
                if(el.id === 'step3-indicator') el.querySelector('.step-text').innerText = 'Info';
            }
        });

        if (IS_SINGLE_BRANCH) {
            // --- CHẾ ĐỘ 1 CHI NHÁNH (2 BƯỚC) ---
            
            // Ẩn chỉ báo Bước 1
            if(step1Ind) step1Ind.style.display = 'none';
            
            // Biến Bước 2 thành Bước 1
            if(step2Ind) {
                step2Ind.querySelector('.step-circle').innerHTML = '1';
                step2Ind.classList.add('active'); // Active ngay vì là bước đầu
            }

            // Biến Bước 3 thành Bước 2
            if(step3Ind) {
                step3Ind.querySelector('.step-circle').innerHTML = '2';
            }

            // Hiển thị ngay Container Bước 2 (Form chọn giờ)
            if(step2Container) step2Container.style.display = 'block';

            // Ẩn nút Back ở bước Time (vì không còn bước Location để quay lại)
            if(backBtnStep2) backBtnStep2.style.display = 'none';

        } else {
            // --- CHẾ ĐỘ NHIỀU CHI NHÁNH (3 BƯỚC) ---
            
            // Hiện chỉ báo Bước 1
            if(step1Ind) {
                step1Ind.style.display = 'flex'; // Hoặc block tùy css
                step1Ind.classList.add('active');
            }
            
            // Hiển thị Container Bước 1 (Chọn chi nhánh)
            if(step1Container) step1Container.style.display = 'block';

            // Hiện lại nút Back
            if(backBtnStep2) backBtnStep2.style.display = 'inline-block';
        }
    }

    // GỌI HÀM INIT LẦN ĐẦU KHI TẢI TRANG
    initReservationFlow();

    // SỰ KIỆN CHO NÚT TEST (Nếu có nút id="toggleBranchModeBtn" trong HTML)
    const toggleBtn = document.getElementById('toggleBranchModeBtn');
    if(toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            IS_SINGLE_BRANCH = !IS_SINGLE_BRANCH;
            initReservationFlow();
            // alert(`Switched to: ${IS_SINGLE_BRANCH ? 'Single Branch Mode (2 Steps)' : 'Multi Branch Mode (3 Steps)'}`);
        });
    }

    // =========================================================
    // PHẦN 2: LOGIC FORM (LỊCH, GIỜ, NGƯỜI, DỊP)
    // =========================================================

    // 1. Khởi tạo Flatpickr
    if (typeof flatpickr !== 'undefined') {
        flatpickr("#datePicker", {
            dateFormat: "d M Y", defaultDate: "today", minDate: "today", disableMobile: "true", clickOpens: false,
            // static: true, // <-- Đã xóa static theo yêu cầu cũ
            onReady: function (selectedDates, dateStr, instance) {
                instance.input.addEventListener("click", function () { instance.toggle(); });
            }
        });
    }

    // 2. Tạo Giờ
    const timeSelect = document.getElementById('timePicker');
    if (timeSelect) {
        for (let h = 10; h <= 22; h++) {
            timeSelect.add(new Option(`${h}:00`, `${h}:00`));
            if (h < 22) timeSelect.add(new Option(`${h}:30`, `${h}:30`));
        }
    }

    // 3. Tạo Số người
    const peopleSelect = document.getElementById('peoplePicker');
    if (peopleSelect) {
        for (let i = 1; i <= 20; i++) {
            peopleSelect.add(new Option(i === 1 ? `${i} Person` : `${i} Persons`, i));
        }
        peopleSelect.options[1].selected = true;
    }

    // 4. Xử lý nút CHECK AVAILABILITY
    const btnCheck = document.getElementById('btnCheck');
    const availableTimesContainer = document.getElementById('availableTimes');
    const summaryText = document.getElementById('summaryText');
    const locSelect = document.getElementById('locationPicker');
    const occasionSelect = document.getElementById('occasionPicker');

    if (btnCheck) {
        btnCheck.addEventListener('click', function (e) {
            e.preventDefault();
            const selectedVal = timeSelect.value;
            if (!selectedVal) return;
            const hour = parseInt(selectedVal.split(':')[0]);

            availableTimesContainer.innerHTML = '';
            
            const header = document.createElement('div');
            header.className = 'w-100 text-center mb-2';
            header.style.cssText = "font-family:'Bricolage Grotesque'; font-size:14px; color:#666;";
            header.innerText = 'Select a time slot:';
            availableTimesContainer.appendChild(header);

            const minutes = [0, 15, 30, 45, 60];
            minutes.forEach(min => {
                let displayHour = hour;
                let displayMin = min;
                if (min === 60) { displayHour = hour + 1; displayMin = 0; }
                const timeStr = `${displayHour}:${displayMin.toString().padStart(2, '0')}`;

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'time-slot-btn';
                btn.innerText = timeStr;
                btn.addEventListener('click', function () {
                    // Lấy dữ liệu
                    const selectedDate = document.getElementById('datePicker').value;
                    const selectedPeople = peopleSelect.options[peopleSelect.selectedIndex].text;
                    // Nếu single branch thì có thể hardcode tên chi nhánh hoặc lấy mặc định
                    const selectedLoc = IS_SINGLE_BRANCH ? 'Main Branch' : (locSelect ? locSelect.options[locSelect.selectedIndex].text : '');
                    const selectedOccasion = occasionSelect.value;
                    
                    let summary = `Booking at ${selectedLoc} for ${selectedPeople} on ${selectedDate} at ${timeStr}`;
                    if(selectedOccasion) summary += ` (${selectedOccasion})`;

                    if (summaryText) summaryText.innerText = summary;
                    
                    // Sang bước tiếp theo (Bước 3)
                    window.goToStep3();
                });
                availableTimesContainer.appendChild(btn);
            });

            availableTimesContainer.style.display = 'flex';
            // Scroll logic
            const modal = document.getElementById('reservationModal');
            if (!modal || !modal.classList.contains('active')) {
                availableTimesContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // 5. Xử lý nút COMPLETE
    const btnComplete = document.getElementById('btnComplete');
    if (btnComplete) {
        btnComplete.addEventListener('click', function () {
            const fname = document.getElementById('inputFName').value.trim();
            const phone = document.getElementById('inputPhone').value.trim();
            const termsCheckbox = document.getElementById('agreeTerms'); 

            if (!fname || !phone) {
                alert("Please fill in your Name and Phone Number.");
                return;
            }
            if (termsCheckbox && !termsCheckbox.checked) {
                alert("Please agree to the Terms of Use and Privacy Policy.");
                return;
            }

            alert("Reservation Successful!");
            closeModal(); 
        });
    }

    // =========================================================
    // PHẦN 3: LOGIC MODAL & TELEPORT (GIỮ NGUYÊN)
    // =========================================================
    const modal = document.getElementById('reservationModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const reserveBtns = document.querySelectorAll('.btn-reserve, .btn-footer-reserve, .btn-order-now');
    
    const staticContainer = document.getElementById('staticFormContainer');
    const modalContainer = document.getElementById('modalFormContainer');
    const formCard = document.querySelector('.reservation-card'); 

    function openModal(e) {
        if (e) e.preventDefault();
        if (modal) {
            if (staticContainer && modalContainer && formCard) { modalContainer.appendChild(formCard); }
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            if (staticContainer && modalContainer && formCard) {
                setTimeout(() => { staticContainer.appendChild(formCard); }, 300); 
            }
        }
    }

    reserveBtns.forEach(btn => btn.addEventListener('click', openModal));
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }
    document.addEventListener('keydown', (e) => { 
        if (e.key === "Escape" && modal && modal.classList.contains('active')) closeModal(); 
    });

    // =========================================================
    // PHẦN 4: ĐIỀU HƯỚNG CÓ KIỂM TRA CHẾ ĐỘ
    // =========================================================
    
    // Từ Bước 1 -> Bước 2 (Chỉ dùng cho Multi Branch)
    window.goToStep2 = function () {
        document.getElementById('step1-container').style.display = 'none';
        document.getElementById('step2-container').style.display = 'block';
        
        const i1 = document.getElementById('step1-indicator');
        const i2 = document.getElementById('step2-indicator');
        
        if(!IS_SINGLE_BRANCH && i1) { 
            i1.classList.remove('active'); 
            i1.querySelector('.step-circle').innerHTML = '<i class="fa-solid fa-check"></i>'; 
        }
        if(i2) i2.classList.add('active');
    }

    // Từ Bước 2 -> Bước 3
    window.goToStep3 = function () {
        document.getElementById('step2-container').style.display = 'none';
        document.getElementById('step3-container').style.display = 'block';

        const i2 = document.getElementById('step2-indicator');
        const i3 = document.getElementById('step3-indicator');
        
        if(i2) { 
            i2.classList.remove('active'); 
            // Nếu single branch: Bước Time là bước 1 -> check
            // Nếu multi branch: Bước Time là bước 2 -> check
            i2.querySelector('.step-circle').innerHTML = '<i class="fa-solid fa-check"></i>'; 
        }
        if(i3) i3.classList.add('active');
        
        // Scroll nhẹ
        const modal = document.getElementById('reservationModal');
        if (!modal || !modal.classList.contains('active')) {
            if(formCard) formCard.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Quay lại: Từ 2 -> 1
    window.goBackToStep1 = function () {
        if(IS_SINGLE_BRANCH) return; // Chặn nếu đang ở chế độ 1 chi nhánh

        document.getElementById('step2-container').style.display = 'none';
        document.getElementById('step1-container').style.display = 'block';

        const i1 = document.getElementById('step1-indicator');
        const i2 = document.getElementById('step2-indicator');
        if(i1) { i1.classList.add('active'); i1.querySelector('.step-circle').innerHTML = '1'; }
        if(i2) { i2.classList.remove('active'); i2.querySelector('.step-circle').innerHTML = '2'; }
    }

    // Quay lại: Từ 3 -> 2
    window.goBackToStep2 = function () {
        document.getElementById('step3-container').style.display = 'none';
        document.getElementById('step2-container').style.display = 'block';

        const i2 = document.getElementById('step2-indicator');
        const i3 = document.getElementById('step3-indicator');
        
        if(i2) { 
            i2.classList.add('active'); 
            // Nếu single branch thì quay về số 1, multi thì số 2
            i2.querySelector('.step-circle').innerHTML = IS_SINGLE_BRANCH ? '1' : '2'; 
        }
        if(i3) { i3.classList.remove('active'); i3.querySelector('.step-circle').innerHTML = IS_SINGLE_BRANCH ? '2' : '3'; }
    }
});