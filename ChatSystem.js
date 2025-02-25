// Add this in a <script> tag or separate .js file
document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.querySelector('.chat-container');
    const chatHeader = document.querySelector('.chat-header');
    const chatInput = document.querySelector('.chat-input');
    const chatSendBtn = document.querySelector('.chat-send-btn');
    const chatMessages = document.querySelector('.chat-messages');

    // Make chat window draggable
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    chatHeader.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    function startDragging(e) {
        initialX = e.clientX - currentX;
        initialY = e.clientY - currentY;
        isDragging = true;
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            chatContainer.style.left = currentX + 'px';
            chatContainer.style.top = currentY + 'px';
            chatContainer.style.right = 'auto';
            chatContainer.style.bottom = 'auto';
        }
    }

    function stopDragging() {
        isDragging = false;
    }

    // Initialize position
    currentX = window.innerWidth - chatContainer.offsetWidth - 10;
    currentY = window.innerHeight - chatContainer.offsetHeight - 10;
    chatContainer.style.left = currentX + 'px';
    chatContainer.style.top = currentY + 'px';

    // Chat functionality
    function addMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage('You: ' + message);
            chatInput.value = '';
            // Here you could add code to send the message to a server
        }
    }
});
