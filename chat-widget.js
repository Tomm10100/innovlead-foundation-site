/**
 * Innovalead Foundation AI Tutor — Chat Widget
 * Powered by Google Gemini via n8n webhook
 */

(function () {
    'use strict';

    // ===== CONFIG =====
    const WEBHOOK_URL = 'https://innovlead.app.n8n.cloud/webhook/foundation-tutor';

    const MODULES = {
        'ai-ethics': {
            name: 'AI Ethics',
            emoji: '🤖',
            welcome: "Hi! I'm your AI Ethics tutor. I'll guide you through responsible AI concepts — from understanding bias to using generative AI ethically. Ready to start? Ask me anything or say **\"Let's begin!\"**"
        },
        'pipeda': {
            name: 'PIPEDA Privacy',
            emoji: '🔒',
            welcome: "Welcome! I'm your Privacy tutor. I'll teach you about your rights under Canada's PIPEDA law — how your data is protected, consent rules, and how to file complaints. Say **\"Let's begin!\"** or ask a question."
        },
        'automation': {
            name: 'Automation',
            emoji: '⚡',
            welcome: "Hey! I'm your Automation tutor. I'll show you how nonprofits can use free tools to automate workflows, save time, and scale their impact. Say **\"Let's begin!\"** or ask me anything."
        }
    };

    let currentModule = null;
    let conversationHistory = [];
    let isWaiting = false;

    // ===== BUILD DOM =====
    function init() {
        createFAB();
        createChatWindow();
        bindEvents();
    }

    function createFAB() {
        const fab = document.createElement('button');
        fab.className = 'chat-fab';
        fab.id = 'chatFab';
        fab.setAttribute('aria-label', 'Open AI Tutor');
        fab.innerHTML = `
            <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/></svg>
        `;
        document.body.appendChild(fab);
    }

    function createChatWindow() {
        const win = document.createElement('div');
        win.className = 'chat-window';
        win.id = 'chatWindow';
        win.innerHTML = `
            <div class="chat-header">
                <div class="chat-header-info">
                    <div class="chat-header-avatar">🎓</div>
                    <div class="chat-header-text">
                        <h3>Foundation AI Tutor</h3>
                        <p>Powered by Gemini</p>
                    </div>
                </div>
                <button class="chat-close" id="chatClose" aria-label="Close chat">✕</button>
            </div>
            <div class="chat-module-selector" id="moduleSelector">
                <button class="module-btn" data-module="ai-ethics">🤖 AI Ethics</button>
                <button class="module-btn" data-module="pipeda">🔒 PIPEDA</button>
                <button class="module-btn" data-module="automation">⚡ Automation</button>
            </div>
            <div class="chat-messages" id="chatMessages"></div>
            <div class="chat-input-area">
                <input type="text" class="chat-input" id="chatInput"
                    placeholder="Ask your tutor a question..." autocomplete="off" />
                <button class="chat-send" id="chatSend" aria-label="Send message">
                    <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
            </div>
        `;
        document.body.appendChild(win);
    }

    // ===== EVENTS =====
    function bindEvents() {
        document.getElementById('chatFab').addEventListener('click', openChat);
        document.getElementById('chatClose').addEventListener('click', closeChat);
        document.getElementById('chatSend').addEventListener('click', sendMessage);
        document.getElementById('chatInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Module buttons
        document.querySelectorAll('.module-btn').forEach(btn => {
            btn.addEventListener('click', () => selectModule(btn.dataset.module));
        });

        // Global: open with specific module from Programs page buttons
        window.openTutor = function (moduleId) {
            openChat();
            selectModule(moduleId);
        };
    }

    function openChat() {
        document.getElementById('chatWindow').classList.add('open');
        document.getElementById('chatFab').classList.add('hidden');
        if (!currentModule) {
            addSystemMessage("Welcome to the Innovalead Foundation Learning Platform! Choose a module above to start learning with your AI tutor.");
        }
        document.getElementById('chatInput').focus();
    }

    function closeChat() {
        document.getElementById('chatWindow').classList.remove('open');
        document.getElementById('chatFab').classList.remove('hidden');
    }

    function selectModule(moduleId) {
        if (currentModule === moduleId) return;

        currentModule = moduleId;
        conversationHistory = [];

        // Update active button
        document.querySelectorAll('.module-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.module === moduleId);
        });

        // Clear messages and show welcome
        const messages = document.getElementById('chatMessages');
        messages.innerHTML = '';

        const mod = MODULES[moduleId];
        addTutorMessage(mod.welcome);

        // Save to session
        sessionStorage.setItem('tutor_module', moduleId);
    }

    // ===== MESSAGES =====
    function addTutorMessage(text) {
        const messages = document.getElementById('chatMessages');
        const msg = document.createElement('div');
        msg.className = 'chat-msg tutor';
        msg.innerHTML = `
            <div class="chat-msg-avatar">🎓</div>
            <div class="chat-msg-bubble">${formatMessage(text)}</div>
        `;
        messages.appendChild(msg);
        scrollToBottom();
    }

    function addUserMessage(text) {
        const messages = document.getElementById('chatMessages');
        const msg = document.createElement('div');
        msg.className = 'chat-msg user';
        msg.innerHTML = `
            <div class="chat-msg-avatar">You</div>
            <div class="chat-msg-bubble"><p>${escapeHtml(text)}</p></div>
        `;
        messages.appendChild(msg);
        scrollToBottom();
    }

    function addSystemMessage(text) {
        const messages = document.getElementById('chatMessages');
        const msg = document.createElement('div');
        msg.className = 'chat-msg tutor';
        msg.innerHTML = `
            <div class="chat-msg-avatar">🎓</div>
            <div class="chat-msg-bubble"><p>${text}</p></div>
        `;
        messages.appendChild(msg);
        scrollToBottom();
    }

    function showTyping() {
        const messages = document.getElementById('chatMessages');
        const indicator = document.createElement('div');
        indicator.className = 'chat-msg tutor';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = `
            <div class="chat-msg-avatar">🎓</div>
            <div class="chat-msg-bubble">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        messages.appendChild(indicator);
        scrollToBottom();
    }

    function hideTyping() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    // ===== SEND / RECEIVE =====
    async function sendMessage() {
        if (isWaiting) return;

        const input = document.getElementById('chatInput');
        const text = input.value.trim();
        if (!text) return;

        if (!currentModule) {
            addSystemMessage('Please select a module above to start learning!');
            return;
        }

        // Add user message
        addUserMessage(text);
        input.value = '';

        // Track conversation
        conversationHistory.push({ role: 'user', content: text });

        // Show typing
        isWaiting = true;
        document.getElementById('chatSend').disabled = true;
        showTyping();

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({
                    module: currentModule,
                    message: text,
                    history: conversationHistory.slice(-10) // Last 10 messages for context
                })
            });

            hideTyping();

            if (!response.ok) throw new Error('Network error');

            const data = await response.json();
            const reply = data.response || data.output || 'Sorry, I had trouble understanding. Could you rephrase?';

            conversationHistory.push({ role: 'assistant', content: reply });
            addTutorMessage(reply);
        } catch (err) {
            hideTyping();
            addTutorMessage("I'm having trouble connecting right now. Please try again in a moment. If the issue persists, contact info@innovlead.ca.");
            console.error('Tutor error:', err);
        }

        isWaiting = false;
        document.getElementById('chatSend').disabled = false;
        document.getElementById('chatInput').focus();
    }

    // ===== FORMATTING =====
    function formatMessage(text) {
        // Simple markdown-like formatting
        let html = escapeHtml(text);

        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Line breaks
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');

        // Bullet lists
        html = html.replace(/^[-•] (.+)/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // Numbered lists
        html = html.replace(/^\d+\. (.+)/gm, '<li>$1</li>');

        return `<p>${html}</p>`;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function scrollToBottom() {
        const messages = document.getElementById('chatMessages');
        setTimeout(() => {
            messages.scrollTop = messages.scrollHeight;
        }, 50);
    }

    // ===== RESTORE SESSION =====
    function restoreSession() {
        const savedModule = sessionStorage.getItem('tutor_module');
        if (savedModule && MODULES[savedModule]) {
            selectModule(savedModule);
        }
    }

    // ===== INIT =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { init(); restoreSession(); });
    } else {
        init();
        restoreSession();
    }

})();
