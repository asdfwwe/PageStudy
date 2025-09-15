document.addEventListener('DOMContentLoaded', () => {
    const mainDial = document.getElementById('main-dial');
    const dialNumber = document.getElementById('dial-number');
    const dialInput = document.getElementById('dial-input');
    const otherDials = [
        document.getElementById('other-dial-1'),
        document.getElementById('other-dial-2'),
        document.getElementById('other-dial-3')
    ];
    const mainBaseLabel = document.getElementById('main-base-label');
    const otherBaseLabels = [
        document.getElementById('other-base-label-1'),
        document.getElementById('other-base-label-2'),
        document.getElementById('other-base-label-3')
    ];
    const navButtons = document.querySelectorAll('.banner button');

    let currentBase = 10;
    let currentValue = 0;
    const MAX_VALUE = 65535; // FFFF (16진수 4자리)에 해당하는 10진수 값

    const convert = (value, targetBase) => {
        if (targetBase === 16) {
            // 16진수 불필요한 0 제거
            return value.toString(16).toUpperCase();
        } else if (targetBase === 2) {
            // 2진수 불필요한 0 제거 및 4자리마다 공백 추가
            const binaryString = value.toString(2);
            let result = '';
            for (let i = 0; i < binaryString.length; i++) {
                result += binaryString[i];
                if ((binaryString.length - i - 1) % 4 === 0 && i !== binaryString.length - 1) {
                    result += ' ';
                }
            }
            return result;
        }
        return value.toString(targetBase);
    };

    const updateDials = (value) => {
        const bases = [2, 8, 10, 16];
        const otherBases = bases.filter(base => base !== currentBase);
        dialNumber.textContent = convert(value, currentBase);
        otherDials.forEach((dial, index) => {
            const targetBase = otherBases[index];
            dial.textContent = convert(value, targetBase);
        });
    };

    mainDial.addEventListener('wheel', (e) => {
        e.preventDefault();
        currentValue += Math.sign(e.deltaY) * 1;
        if (currentValue < 0) {
            currentValue = MAX_VALUE;
        } else if (currentValue > MAX_VALUE) {
            currentValue = 0;
        }
        updateDials(currentValue);
    });

    dialNumber.addEventListener('click', () => {
        dialNumber.style.opacity = '0';
        dialInput.style.display = 'block';
        let inputValue = dialNumber.textContent;
        if (currentBase === 2) {
            inputValue = inputValue.replace(/ /g, '');
        }
        dialInput.value = inputValue;
        dialInput.focus();
    });

    dialInput.addEventListener('input', (e) => {
        const inputValue = e.target.value.trim();
        const decimalValue = parseInt(inputValue, currentBase);
        if (!isNaN(decimalValue) && inputValue !== '' && decimalValue >= 0 && decimalValue <= MAX_VALUE) {
            currentValue = decimalValue;
            updateDials(currentValue);
        } else if (inputValue === '') {
            currentValue = 0;
            updateDials(currentValue);
        }
    });

    dialInput.addEventListener('blur', () => {
        dialNumber.style.opacity = '1';
        dialInput.style.display = 'none';
        updateDials(currentValue);
    });

    dialInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            dialInput.blur();
        }
    });

    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            navButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            const selectedBaseText = e.target.textContent;
            if (selectedBaseText === '10진수') {
                currentBase = 10;
            } else if (selectedBaseText === '2진수') {
                currentBase = 2;
            } else if (selectedBaseText === '8진수') {
                currentBase = 8;
            } else if (selectedBaseText === '16진수') {
                currentBase = 16;
            }
            const bases = [
                { name: '10진수', value: 10 },
                { name: '2진수', value: 2 },
                { name: '8진수', value: 8 },
                { name: '16진수', value: 16 }
            ];
            const otherBases = bases.filter(base => base.value !== currentBase);
            mainBaseLabel.textContent = bases.find(base => base.value === currentBase).name;
            otherBaseLabels.forEach((label, index) => {
                label.textContent = otherBases[index].name;
            });
            updateDials(currentValue);
            dialInput.value = convert(currentValue, currentBase);
        });
    });

    updateDials(currentValue);
    dialInput.value = convert(currentValue, currentBase);
});