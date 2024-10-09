

if (!localStorage.getItem('money')) {
    localStorage.setItem('money', 0);
}

if (!localStorage.getItem('savings')) {
    localStorage.setItem('savings', 0);
}
let money = parseInt(localStorage.getItem('money')) || 0;

const topicsContainer = document.getElementById('topics');
const addTopicButton = document.getElementById('add-topic');
const expenseTableBody = document.getElementById('expense-tbody');
let topicCount = 0;

function createTopic(name = '', amount = 0) {
    const topic = document.createElement('div');
    topic.className = 'topic';
    topic.innerHTML = `
                <div class="topic-header">
                    <input type="text" class="topic-name-input" value="${name || `Topic ${++topicCount}`}" placeholder="Enter topic name">
                    <button class="delete-btn">Delete</button>
                </div>
                <div class="amount-control">
                    <button class="amount-btn minus">-</button>
                    <input type="number" class="amount-input" value="${amount}" min="0" step="100">
                    <button class="amount-btn plus">+</button>
                </div>
            `;

    const nameInput = topic.querySelector('.topic-name-input');
    const deleteBtn = topic.querySelector('.delete-btn');
    const minusBtn = topic.querySelector('.minus');
    const plusBtn = topic.querySelector('.plus');
    const amountInput = topic.querySelector('.amount-input');

    nameInput.addEventListener('change', saveTopics);
    deleteBtn.addEventListener('click', () => {
        topic.remove();
        saveTopics();
        updateExpenseTable();
    });
    minusBtn.addEventListener('click', () => updateAmount(amountInput, -100));
    plusBtn.addEventListener('click', () => updateAmount(amountInput, 100));
    amountInput.addEventListener('change', saveTopics);

    topicsContainer.appendChild(topic);
    updateExpenseTable();
    saveTopics();
}

function updateAmount(input, change) {
    input.value = Math.max(0, parseInt(input.value) + change);
    saveTopics();
}

function saveTopics() {
    const topics = [];
    document.querySelectorAll('.topic').forEach((topic) => {
        const name = topic.querySelector('.topic-name-input').value;
        const amount = topic.querySelector('.amount-input').value;
        topics.push({ name, amount });
    });
    localStorage.setItem('topics', JSON.stringify(topics));
}

function loadTopics() {
    const savedTopics = JSON.parse(localStorage.getItem('topics')) || [];
    topicsContainer.innerHTML = '';
    topicCount = 0;
    savedTopics.forEach((topic) => {
        createTopic(topic.name, topic.amount);
    });
    updateExpenseTable();
}

function updateExpenseTable() {
    expenseTableBody.innerHTML = '';
    document.querySelectorAll('.topic').forEach((topic) => {
        const topicName = topic.querySelector('.topic-name-input').value;
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${topicName}</td>
                    <td><input type="number" class="expense-input" data-topic="${topicName}" value="0" min="0"></td>
                `;
        expenseTableBody.appendChild(row);
    });
    loadExpenses();
}
function calcMoney() {
    let expense = 0;
    const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || {};
    const sav = parseInt(localStorage.getItem('savings')) || 0;
    document.querySelectorAll('.expense-input').forEach(input => {
        const topicName = input.dataset.topic;
        if (savedExpenses[topicName]) {
            input.value = savedExpenses[topicName];
            expense = expense + Number(input.value);
        }
    });
    console.log(expense);
    console.log(money);
    document.getElementById("spent").innerHTML = `${expense}`;
    if (sav > (money - expense)) {
        document.getElementById("savings").innerHTML = `${money - expense} <br> (Not Good)`;
        document.getElementById("savings").style.color = "#eb5e5e";
    }
    else {
        document.getElementById("savings").innerHTML = `${money - expense} <br> (Min Savings: ${sav})`;
        document.getElementById("savings").style.color = "#4aeb61";
    }
    console.log("Calculated");
}

function saveExpenses() {
    const expenses = {};
    document.querySelectorAll('.expense-input').forEach(input => {
        expenses[input.dataset.topic] = input.value;
    });
    localStorage.setItem('expenses', JSON.stringify(expenses));
    calcMoney();

}

function loadExpenses() {
    const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || {};
    document.querySelectorAll('.expense-input').forEach(input => {
        const topicName = input.dataset.topic;
        if (savedExpenses[topicName]) {
            input.value = savedExpenses[topicName];
        }
    });
}


addTopicButton.addEventListener('click', () => createTopic());
expenseTableBody.addEventListener('change', saveExpenses);


const input = document.getElementById('allowanceInput');
const allowanceDisplay = document.getElementById('allowanceDisplay');
const container = document.querySelector('.container3');
const setbtn = document.getElementById('add-allow');

function updateAllowance() {
    const value = parseInt(input.value) || 0;
    const formattedValue = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);
    allowanceDisplay.innerHTML = `${formattedValue}`;

    const hue = Math.max(0, Math.min(((value - 1000) / 7500) * 360, 360));
    const saturation = Math.min(value / 100, 100);
    allowanceDisplay.style.color = `hsl(${hue}, ${saturation}%, 50%)`;

    const glowIntensity = Math.max(0, Math.min(((value - 1000) / 7500) * 30, 30));
    container.style.boxShadow = `0 4px 6px rgba(0, 0, 0, 0.1), 0 0 ${glowIntensity}px hsl(${hue}, ${saturation}%, 50%)`;

    localStorage.setItem('money', value);
    console.log("Allowance set.");
    console.log(localStorage.getItem('money'));
}

const input1 = document.getElementById('savingsInput');
const savDisplay = document.getElementById('savingsDisplay');
const container1 = document.querySelector('.container4');
const setbtn1 = document.getElementById('add-sav');

function updateSavings() {
    const value = parseInt(input1.value) || 0;
    const formattedValue = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);
    savingsDisplay.innerHTML = `${formattedValue}`;

    const hue = Math.max(0, Math.min(((value - 1000) / 7500) * 360, 360));
    const saturation = Math.min(value / 100, 100);
    savingsDisplay.style.color = `hsl(${hue}, ${saturation}%, 50%)`;

    const glowIntensity = Math.max(0, Math.min(((value - 1000) / 7500) * 30, 30));
    container1.style.boxShadow = `0 4px 6px rgba(0, 0, 0, 0.1), 0 0 ${glowIntensity}px hsl(${hue}, ${saturation}%, 50%)`;

    localStorage.setItem('savings', value);
    console.log("Savings set.");
    //console.log(localStorage.getItem('money'));
}

setbtn.addEventListener('click', () => updateAllowance());
setbtn1.addEventListener('click', () => updateSavings());
calcMoney();
loadTopics();
const myTimeout = setTimeout(calcMoney(), 500);



if (money >= localStorage.getItem('savings')) {
    document.getElementById("intromsg").innerHTML = `You currently have ₹${money} this month to spend. Please spend this money wisely and not mess this shit up, even though I know you're barely gonna save this month but yes.`;
}
else {
    document.getElementById("intromsg").innerHTML = `BRO WTF ARE YOU DOING? YOU ARE GOING BEYOND PREFERED EXPENDITURE! You currently have ₹${money} so you might wanna eat mess food and buy absolutely nothing if you wanna save.`;
}