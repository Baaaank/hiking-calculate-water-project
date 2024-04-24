window.addEventListener('DOMContentLoaded', () => {
    const submit = document.querySelector('.submit');

    submit.addEventListener('click', (e) => {
        e.preventDefault();

        const userGender = document.querySelector('#gender');
        const genderError = document.querySelector('#gender-error');
        if (!userGender.value) {
            genderError.classList.add('form-invalid');
            genderError.textContent = '性別が選択されていません';
            userGender.classList.add('input-invalid');
            return;
        } else {
            genderError.textContent = '';
            userGender.classList.remove('input-invalid');
        }

        const userAge = document.querySelector('#age');
        const ageError = document.querySelector('#age-error');
        let max
        if (userAge.value === '') {
            ageError.classList.add('form-invalid');
            ageError.textContent = '年齢が入力されていません';
            userAge.classList.add('input-invalid');
            return;
        } else {
            ageError.textContent = '';
            userAge.classList.remove('input-invalid');
        }

        const userHeight = document.querySelector('#height');
        const heightError = document.querySelector('#height-error');
        if (!userHeight.value) {
            heightError.classList.add('form-invalid');
            heightError.textContent = '身長が入力されていません';
            userHeight.classList.add('input-invalid');
            return;
        } else {
            heightError.textContent = '';
            userHeight.classList.remove('input-invalid');
        }

        const userWeight = document.querySelector('#weight');
        const weightError = document.querySelector('#weight-error');
        if (!userWeight.value) {
            weightError.classList.add('form-invalid');
            weightError.textContent = '体重が入力されていません';
            userWeight.classList.add('input-invalid');
            return;
        } else {
            weightError.textContent = '';
            userWeight.classList.remove('input-invalid');
        }
    })
}, false);

window.addEventListener('DOMContentLoaded', () => {
    const submit = document.querySelector('.Form-Btn');
    const form = document.querySelector('form');

    submit.addEventListener('click', (e) => {
        e.preventDefault();

        let pattern = /^[a-zA-Z0-9_+-]+(\.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
        let userName = document.getElementById("userName").value;
        let userEmail = document.getElementById("userEmail").value;
        let userEmailAgain = document.getElementById("userEmailAgain").value;
        let userMessage = document.getElementById("userMessage").value
        let isRight = true;

        if(userName.length !== 0){
            document.getElementById("em1").innerHTML = "";
        } else {
            document.getElementById("em1").innerHTML = "氏名を入力してください。";
            isRight = false;
        }

        if(userEmail.match(pattern)){
            document.getElementById("em2").innerHTML = "";
        } else {
            document.getElementById("em2").innerHTML = "メールアドレスの形式で入力してください。";
            isRight = false;
        }

        if(userEmail === userEmailAgain){
            document.getElementById("em3").innerHTML = "";
        } else {
            document.getElementById("em3").innerHTML = "メールアドレスが正しくありません。";
            isRight = false;
        }

        if(userMessage !== ''){
            document.getElementById("em4").innerHTML = "";
        } else {
            document.getElementById("em4").innerHTML = "お問い合わせ内容を入力してください。";
            isRight = false;
        }

        if(isRight){
            form.submit();
        }
    });
});