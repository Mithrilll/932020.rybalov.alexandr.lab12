
const firstValue = document.getElementById('first-value');
const secondValue = document.getElementById('second-value');

const operator = document.getElementById('operator');
const resNode = document.getElementById('result');

const form = document.getElementById('calc');

document.addEventListener('submit', (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    handleSubmit();
});

async function handleSubmit() {
    if (isNaN(firstValue.value) || isNaN(secondValue.value)) {
        return;
    }

    let result = await fetch('/calculate', {
        method: 'POST', body: JSON.stringify({
            firstValue: firstValue.value,
            secondValue: secondValue.value,
            operator: operator.value
        })
    });
    
    result = await result.text();
    
    const header = document.createElement('h1');
    header.textContent = 'Result';

    const paragraph = document.createElement('p');
    if (result.length == 0) {
        paragraph.textContent = 'Division by 0';
    } else {
        paragraph.textContent = firstValue.value + ' ' + operator.value + ' ' + secondValue.value + ' = ' + result;
    }

    resNode.appendChild(header);
    resNode.appendChild(paragraph);

    form.remove();
}