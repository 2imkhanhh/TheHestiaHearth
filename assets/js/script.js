document.addEventListener("DOMContentLoaded", function () {
    const row = document.getElementById('signatureRow');
    const btnPrev = document.getElementById('btnSigPrev');
    const btnNext = document.getElementById('btnSigNext');
    let isAnimating = false;

    // Hàm tính toán % dịch chuyển: Desktop 33.33% (1/3), Mobile 100%
    function getMovePercentage() {
        return window.innerWidth >= 992 ? (100 / 3) : 100;
    }

    if (row && btnPrev && btnNext) {
        
        // --- Xử lý nút NEXT ---
        btnNext.addEventListener('click', function () {
            if (isAnimating) return;
            isAnimating = true;

            const movePercent = getMovePercentage();
            
            // 1. Dịch chuyển sang trái
            row.style.transition = "transform 0.4s ease-in-out";
            row.style.transform = `translateX(-${movePercent}%)`;

            // 2. Sau khi animation xong (0.4s)
            setTimeout(() => {
                row.style.transition = "none"; 
                // Đẩy phần tử đầu tiên xuống cuối hàng
                row.appendChild(row.firstElementChild);
                // Reset vị trí về 0
                row.style.transform = "translateX(0)";
                isAnimating = false;
            }, 400); 
        });

        // --- Xử lý nút PREV ---
        btnPrev.addEventListener('click', function () {
            if (isAnimating) return;
            isAnimating = true;

            const movePercent = getMovePercentage();

            // 1. Chuyển ngay phần tử cuối lên đầu
            row.style.transition = "none";
            row.prepend(row.lastElementChild);
            row.style.transform = `translateX(-${movePercent}%)`;

            // 2. Trượt về 0
            setTimeout(() => {
                row.style.transition = "transform 0.4s ease-in-out";
                row.style.transform = "translateX(0)";
                setTimeout(() => { isAnimating = false; }, 400);
            }, 20); 
        });
    }

    // Reset khi resize
    window.addEventListener('resize', function () {
        row.style.transition = "none";
        row.style.transform = "translateX(0)";
    });
});

document.querySelectorAll('.btn-slider').forEach(btn => {
    btn.addEventListener('touchend', () => {
        btn.blur();
    });

    btn.addEventListener('mouseup', () => {
        btn.blur();
    });
});

function openDatePicker() {
    const dateInput = document.getElementById('reservationDate');
    dateInput.focus();
    dateInput.showPicker && dateInput.showPicker(); 
}