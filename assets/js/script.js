document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById('reservationModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const reserveBtns = document.querySelectorAll('.btn-reserve, .btn-footer-reserve');

    function openModal(e) {
        e.preventDefault(); 
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; 
    }

    reserveBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    closeModalBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === "Escape" && modal.classList.contains('active')) {
            closeModal();
        }
    });
});