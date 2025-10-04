// modweeb-chat.js

const HUGGING_FACE_TOKEN = "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";
const HUGGING_FACE_MODEL = "google/gemma-2-9b-it:nebius";
const USAGE_KEY = "modweebChatUsage_v1";
const HISTORY_KEY = "modweebChatHistory_v1";
const DEFAULT_DAILY_LIMIT = 25;
const DEV_FLAG_KEY = "modweebDevUnlimited_v1";

function escapeHtml(e) {
    return e ? e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;") : ""
}

function isSafeUrl(e) {
    try {
        let t = new URL(e, location.href);
        return "https:" === t.protocol || "http:" === t.protocol
    } catch (n) {
        return !1
    }
}

function renderRichText(e) {
    let t = escapeHtml(e);
    t = t.replace(/^#{1,6}\s+(.*)$/gm, (e, t) => `<b style="display:block; margin:15px 0 8px 0; color:var(--linkC, #2563eb);">${t.trim()}</b>`);
    let n = 0;
    return (t = (t = (t = (t = (t = (t = (t = (t = (t = (t = (t = (t = (t = t.replace(/^[*\-]\s+(.*)$/gm, (e, t) => {
        n++;
        let s = n <= 10 ? ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "١٠"][n - 1] : n + ".";
        return `${s} ${t.trim()}<br>`
    })).replace(/(?<!\w)[*#](?!\w)/g, "")).replace(/\*\*/g, "")).replace(/\*/g, "")).replace(/!\[([^\]]*?)\]\((.*?)\)/g, (e, t, n) => isSafeUrl(n.trim()) ? `<img src="${n.trim()}" alt="${escapeHtml(t)}" loading="lazy" style="max-width:100%; height:auto; border-radius:8px; margin:8px 0;">` : escapeHtml(e))).replace(/\[([^\]]+)\]\((.*?)\)/g, (e, t, n) => isSafeUrl(n.trim()) ? `<a href="${n.trim()}" target="_blank" rel="noopener noreferrer" style="color:var(--linkC, #2563eb); text-decoration:underline;">${escapeHtml(t)}</a>` : escapeHtml(e))).replace(/`([^`]+)`/g, (e, t) => `<code style="background:var(--contentBa, #f4f8ff); padding:2px 6px; border-radius:4px; border:1px solid var(--contentL, #e3e7ef);">${escapeHtml(t)}</code>`)).replace(/\*\*(.*?)\*\*/g, (e, t) => `<b style="font-weight:600;">${escapeHtml(t)}</b>`)).replace(/\*(.*?)\*/g, (e, t) => `<i style="font-style:italic;">${escapeHtml(t)}</i>`)).replace(/(^|\s)(https?:\/\/\S+\.(?:png|jpe?g|gif|webp|bmp))(?![^<]*>)/gi, (e, t, n) => isSafeUrl(n) ? `${t}<img src="${n}" loading="lazy" style="max-width:100%; height:auto; border-radius:8px; margin:8px 0;">` : e)).replace(/(^|\s)(https?:\/\/[^\s<]+)/g, (e, t, n) => isSafeUrl(n) ? `${t}<a href="${n}" target="_blank" rel="noopener noreferrer" style="color:var(--linkC, #2563eb); text-decoration:underline;">${escapeHtml(n)}</a>` : e)).replace(/\n\n+/g, "<br><br>")).replace(/\n/g, "<br>")).replace(/(<br>){3,}/g, "<br><br>")
}

function loadUsage() {
    try {
        let e = localStorage.getItem(USAGE_KEY);
        if (!e) return initUsage();
        let t = JSON.parse(e),
            n = new Date().toISOString().slice(0, 10);
        if (t.date !== n) return initUsage();
        return t
    } catch (s) {
        return initUsage()
    }
}

function initUsage() {
    let e = new Date().toISOString().slice(0, 10),
        t = {
            date: e,
            count: 0,
            limit: DEFAULT_DAILY_LIMIT
        }; // استخدم DEFAULT_DAILY_LIMIT هنا
    return localStorage.setItem(USAGE_KEY, JSON.stringify(t)), t
}

function saveUsage(e) {
    localStorage.setItem(USAGE_KEY, JSON.stringify(e))
}

function remainingMessages() {
    let e = "1" === localStorage.getItem(DEV_FLAG_KEY);
    if (e) return Infinity; // استخدام Infinity بدلاً من 1/0
    let t = loadUsage();
    return Math.max(0, t.limit - t.count)
}

function refreshUsageUI() {
    let e = remainingMessages();
    document.getElementById("modweeb-remaining").textContent = e === Infinity ? "غير محدود" : `الرسائل المتبقية: ${e}`
}
let messagesLoaded = !1;

function saveHistory() {
    try {
        let e = [...document.getElementById("modweeb-messages").children],
            t = e.map(e => ({
                role: e.classList.contains("modweeb-msg-user") ? "user" : "assistant",
                html: e.querySelector(".bubble") ? e.querySelector(".bubble").innerHTML : e.innerHTML
            }));
        localStorage.setItem(HISTORY_KEY, JSON.stringify(t))
    } catch (n) {}
}

function restoreHistory() {
    try {
        let e = localStorage.getItem(HISTORY_KEY);
        if (!e) return;
        let t = JSON.parse(e),
            n = document.getElementById("modweeb-messages");
        n.innerHTML = "", t.forEach(e => {
            let t = document.createElement("div");
            "user" === e.role ? t.className = "modweeb-msg-user" : t.className = "modweeb-msg-ai";
            let s = document.createElement("div");
            if (s.className = "bubble", s.innerHTML = e.html, t.appendChild(s), "assistant" === e.role) {
                let a = document.createElement("div");
                a.className = "meta", a.innerHTML = `<div class="msg-controls">          <button class="copy-reply" title="نسخ الرد">نسخ</button>        </div>`, t.appendChild(a)
            }
            n.appendChild(t)
        }), messagesLoaded = !0, setTimeout(() => {
            n.scrollTop = n.scrollHeight
        }, 100)
    } catch (s) {}
}

function showStatus(e, t = 1600) {
    let n = document.getElementById("modweeb-status");
    if (n) { // تأكد من وجود العنصر
        n.style.display = "block", n.textContent = e, t > 0 && setTimeout(() => {
            n.style.display = "none"
        }, t)
    }
}
const container = document.getElementById("modweeb-chat-container");

function createUserMessage(e) {
    let t = document.createElement("div");
    t.className = "modweeb-msg-user";
    let n = document.createElement("div");
    n.className = "bubble", n.innerHTML = renderRichText(e), t.appendChild(n);
    let s = document.createElement("div");
    return s.className = "meta", s.innerHTML = `<div class="msg-controls">    <button class="edit-user" title="تعديل">✎</button>  </div>`, t.appendChild(s), document.getElementById("modweeb-messages").appendChild(t), t
}

function createAiPlaceholder() {
    let e = document.createElement("div");
    e.className = "modweeb-msg-ai";
    let t = document.createElement("div");
    t.className = "bubble", t.innerHTML = `<div style="display:flex;align-items:center;gap:8px;"><div class="spinner" aria-hidden="true"></div> جاري الكتابة...</div>`, e.appendChild(t);
    let n = document.createElement("div");
    return n.className = "meta", n.innerHTML = `<div class="msg-controls">    <button class="copy-reply" title="نسخ الرد">نسخ</button>    <button class="resend-retry" title="إعادة المحاولة" style="display:none">إعادة</button>  </div>`, e.appendChild(n), document.getElementById("modweeb-messages").appendChild(e), document.getElementById("modweeb-messages").scrollTop = document.getElementById("modweeb-messages").scrollHeight, e
}

function buildConversationPayload(e) {
    let t = [...document.getElementById("modweeb-messages").children],
        n = [{
            role: "system",
            content: "أنت مساعد تقني لمدونة modweeb.com، أجِب بشكل مختصر وعملي واحترافي."
        }];
    return t.forEach(e => {
        let t = e.classList.contains("modweeb-msg-user"),
            s = e.querySelector(".bubble");
        if (!s) return;
        let a = s.innerText || s.textContent || "";
        n.push({
            role: t ? "user" : "assistant",
            content: a
        })
    }), e && n.push({
        role: "user",
        content: e
    }), n
}
async function sendMessage(e, t = null, n = !1) {
    let s = "1" === localStorage.getItem(DEV_FLAG_KEY);
    if (!s) {
        let a = loadUsage();
        if (a.count >= a.limit) return showStatus("تم تجاوز الحد اليومي للرسائل"), !1
    }
    let l = t || createAiPlaceholder();
    showStatus("جاري إرسال الرسالة..."), modweebTrackEvent("chat_message_sent");
    let r = buildConversationPayload(e);
    try {
        let o = await fetch("https://router.huggingface.co/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HUGGING_FACE_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: HUGGING_FACE_MODEL,
                messages: r,
                max_tokens: 1e3,
                temperature: .7,
                top_p: .9
            })
        });
        if (!o.ok) throw Error("network");
        let i = await o.json(),
            c = i?.choices?.[0]?.message?.content || "❌ حدث خطأ.",
            d = renderRichText(c),
            m = l.querySelector(".bubble");
        m && (m.innerHTML = d);
        let g = l.querySelector(".resend-retry");
        g && (g.style.display = "none");
        let u = loadUsage();
        return u.count = (u.count || 0) + 1, saveUsage(u), refreshUsageUI(), saveHistory(), showStatus("تم الرد بنجاح!"), modweebTrackEvent("chat_message_received", {
            tokens: i?.usage?.total_tokens || 0
        }), !0
    } catch (p) {
        let y = l.querySelector(".bubble");
        y && (y.innerHTML = `<div style="color:#ef4444;">❌ تعذر استجابة المساعد</div>`);
        let b = l.querySelector(".resend-retry");
        return b && (b.style.display = "inline-block", b.onclick = async function() {
            b.disabled = !0, b.textContent = "...", y.innerHTML = `<div style="display:flex;align-items:center;gap:8px;"><div class="spinner"></div> إعادة المحاولة...</div>`, await sendMessage(e, l, !0), b.disabled = !1, b.textContent = "إعادة"
        }), saveHistory(), showStatus("تعذر الاتصال بالخادم"), !1
    }
}

function lazyLoadMessages() {
    if (!messagesLoaded) {
        let e = document.createElement("div");
        e.className = "modweeb-msg-ai";
        let t = document.createElement("div");
        t.className = "bubble", t.innerHTML = `👋 مرحبًا بك في دردشة <b>modweeb.com</b>! كيف أساعدك؟`, e.appendChild(t);
        let n = document.createElement("div");
        n.className = "meta", n.innerHTML = `<div class="msg-controls"><button class="copy-reply" title="نسخ الرد">نسخ</button></div>`, e.appendChild(n), document.getElementById("modweeb-messages").appendChild(e), messagesLoaded = !0, modweebTrackEvent("chat_opened"), setTimeout(() => {
            document.getElementById("modweeb-messages").scrollTop = document.getElementById("modweeb-messages").scrollHeight
        }, 100)
    }
}

// modweeb-chat.js (الجزء العلوي كما هو)
// ... جميع تعريفات الثوابت والدوال المساعدة (escapeHtml, isSafeUrl, renderRichText, loadUsage, etc.) ...

// الدوال التي تعتمد على DOM
// ... createUserMessage, createAiPlaceholder, buildConversationPayload, sendMessage, lazyLoadMessages, showStatus ...

// ----------------------------------------------------------------------------------------------------
// الدالة الرئيسية لتهيئة الأداة والتي يجب أن تحتوي على جميع الـ Event Listeners
// ----------------------------------------------------------------------------------------------------
function initializeChatWidget() {
    const chatBtn = document.getElementById("modweeb-chat-btn");
    const chatContainer = document.getElementById("modweeb-chat-container");
    const chatCloseBtn = document.getElementById("modweeb-chat-close");
    const txt = document.getElementById("modweeb-input");
    const charsUI = document.getElementById("modweeb-chars");
    const sendBtn = document.getElementById("modweeb-send");
    const copyAllBtn = document.getElementById("modweeb-copy-all");
    const clearChatBtn = document.getElementById("modweeb-clear");
    const messagesDiv = document.getElementById("modweeb-messages");
    const head = document.getElementById("modweeb-head");

    // تحقق من وجود جميع العناصر الأساسية
    if (!chatBtn || !chatContainer || !chatCloseBtn || !txt || !charsUI || !sendBtn || !copyAllBtn || !clearChatBtn || !messagesDiv || !head) {
        console.error("Modweeb Chat Widget: One or more required DOM elements not found. Initialisation aborted.");
        return; // توقف عن التنفيذ إذا لم يتم العثور على العناصر
    }

    // Event Listeners
    chatBtn.onclick = function() {
        chatContainer.style.display = "flex";
        chatContainer.style.position = "fixed";
        chatContainer.style.left = "";
        chatContainer.style.top = "";
        chatContainer.style.right = "32px";
        chatContainer.style.bottom = "142px";
        lazyLoadMessages();
        setTimeout(function() {
            txt.focus()
        }, 100);
        window.modweebChatOpenedAt = Date.now();
        refreshUsageUI();
        restoreHistory();
    };

    chatCloseBtn.onclick = function() {
        chatContainer.style.display = "none";
        chatContainer.style.position = "fixed";
        chatContainer.style.left = "";
        chatContainer.style.top = "";
        chatContainer.style.right = "32px";
        chatContainer.style.bottom = "142px";
        if (window.modweebChatOpenedAt) {
            modweebTrackEvent("chat_duration", {
                value: Date.now() - window.modweebChatOpenedAt
            });
        }
    };

    txt.addEventListener("input", function(e) {
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 62) + "px";
        charsUI.textContent = `${e.target.value.length} أحرف`;
    });

    txt.addEventListener("keydown", function(e) {
        if ("Enter" === e.key && !e.shiftKey || (e.ctrlKey || e.metaKey) && "Enter" === e.key) {
            e.preventDefault();
            sendBtn.click();
            return;
        }
        if ("ArrowUp" === e.key && "" === txt.value.trim()) {
            let t = [...messagesDiv.children].reverse(),
                n = t.find(e => e.classList.contains("modweeb-msg-user"));
            if (n) {
                let s = n.querySelector(".bubble").innerText || "";
                txt.value = s;
                txt.dispatchEvent(new Event("input"));
            }
        }
    });

    document.addEventListener("keydown", function(e) {
        if ("Escape" === e.key) {
            chatContainer.style.display = "none";
        }
        if ((e.ctrlKey || e.metaKey) && "k" === e.key.toLowerCase()) {
            e.preventDefault();
            chatContainer.style.display = "flex";
            setTimeout(() => txt.focus(), 100);
        }
    });

    document.querySelectorAll(".modweeb-suggestion-btn").forEach(e => {
        e.onclick = () => {
            txt.value = e.textContent;
            txt.focus();
            txt.dispatchEvent(new Event("input"));
        };
    });

    copyAllBtn.onclick = function() {
        let e = [...messagesDiv.children].map(e => e.innerText).join("\n");
        navigator.clipboard.writeText(e).then(() => showStatus("تم نسخ المحادثة!"));
    };

    clearChatBtn.onclick = function() {
        localStorage.removeItem(HISTORY_KEY);
        messagesDiv.innerHTML = "";
        messagesLoaded = !1;
        lazyLoadMessages();
        showStatus("تم حذف المحادثة!");
    };

    messagesDiv.addEventListener("click", function(e) {
        let t = e.target;
        if (t.closest(".copy-reply")) {
            let n = t.closest(".modweeb-msg-ai");
            if (!n) return;
            let s = n.querySelector(".bubble").innerText || "";
            navigator.clipboard.writeText(s).then(() => showStatus("تم نسخ الرد!"));
        }
        if (t.closest(".edit-user")) {
            let a = t.closest(".modweeb-msg-user");
            if (!a) return;
            let l = a.querySelector(".bubble").innerText || "";
            txt.value = l;
            txt.focus();
            txt.dispatchEvent(new Event("input"));
        }
    });

    sendBtn.onclick = async function() {
        let e = txt.value.trim();
        if (!e) return;
        let t = "1" === localStorage.getItem(DEV_FLAG_KEY);
        if (!t) {
            let n = loadUsage();
            if (n.count >= n.limit) {
                showStatus("تم تجاوز الحد اليومي للرسائل");
                return;
            }
        }
        createUserMessage(e);
        txt.value = "";
        txt.style.height = "auto";
        charsUI.textContent = `0 أحرف`;
        let s = createAiPlaceholder();
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        saveHistory();
        await sendMessage(e, s);
    };

    restoreHistory();
    refreshUsageUI();

    let headerClickCount = 0,
        headerClickTimer = null;
    function modweebTrackEvent(e, t) {
        window.gtag && gtag("event", e, t || {})
    }

    function adjustForKeyboard() {
        let e = window.visualViewport.height,
            t = window.innerHeight;
        t - e > 150 ? (document.getElementById("modweeb-chat-container").style.bottom = "10px", document.getElementById("modweeb-chat-btn").style.bottom = "10px") : (document.getElementById("modweeb-chat-container").style.bottom = "142px", document.getElementById("modweeb-chat-btn").style.bottom = "88px")
    }

    head.addEventListener("click", function(e) {
        if (headerClickCount++, headerClickTimer && clearTimeout(headerClickTimer), headerClickTimer = setTimeout(() => {
                headerClickCount = 0
            }, 4e3), headerClickCount >= 5) {
            headerClickCount = 0;
            let t = "1" === localStorage.getItem(DEV_FLAG_KEY);
            t ? (localStorage.removeItem(DEV_FLAG_KEY), showStatus("وضع المطور معطل")) : (localStorage.setItem(DEV_FLAG_KEY, "1"), showStatus("وضع المطور مفعل: غير محدود"));
            refreshUsageUI();
        }
    });

    messagesDiv.style.minHeight = "60px";
    window.visualViewport.addEventListener("resize", adjustForKeyboard);
    window.visualViewport.addEventListener("scroll", adjustForKeyboard);
    document.addEventListener("click", function(e) {
        let t = document.getElementById("modweeb-chat-container"),
            n = document.getElementById("modweeb-chat-btn");
        "flex" !== t.style.display || t.contains(e.target) || n.contains(e.target) || (t.style.display = "none")
    });
} // <--- هذه هي نهاية دالة initializeChatWidget الصحيحة

// استدعاء دالة التهيئة عند تحميل DOM بالكامل
document.addEventListener("DOMContentLoaded", initializeChatWidget);
