

let money = 10000;

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
                    <input type="number" class="amount-input" value="${amount}" min="0" step="10">
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
    minusBtn.addEventListener('click', () => updateAmount(amountInput, -10));
    plusBtn.addEventListener('click', () => updateAmount(amountInput, 10));
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
    document.querySelectorAll('.expense-input').forEach(input => {
        const topicName = input.dataset.topic;
        if (savedExpenses[topicName]) {
            input.value = savedExpenses[topicName];
            expense = expense + Number(input.value);
        }
    });
    money = money - expense;
    document.getElementById("spent").innerHTML = `${expense}`;
    document.getElementById("savings").innerHTML = `${money}`;
    console.log("Calculated");
}

function saveExpenses() {
    const expenses = {};
    document.querySelectorAll('.expense-input').forEach(input => {
        expenses[input.dataset.topic] = input.value;
    });
    localStorage.setItem('expenses', JSON.stringify(expenses));
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

// Initial load
loadTopics();
calcMoney();


if (money >= 5000) {
    document.getElementById("intromsg").innerHTML = `You currently have ₹${money} left this month to spend. Please spend this money wisely and not fuck shit up.`;
}
else {
    document.getElementById("intromsg").innerHTML = `BRO WTF ARE YOU DOING? YOU ARE GOING BEYOND PREFERED EXPENDITURE! Currently have ₹${money} so you might wanna eat mess food and buy absolutely nothing if you wanna save.`;
}