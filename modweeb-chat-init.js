// modweeb-chat-init.js
document.addEventListener("DOMContentLoaded", function() {
    // تحميل ملف CSS
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "https://cdn.jsdelivr.net/gh/zerootem/chat-ai@main/modweeb-chat.css"; // تأكد من 'main' أو الفرع الافتراضي لمستودعك
    document.head.appendChild(cssLink);

    // تحميل ملف JavaScript الرئيسي
    const chatScript = document.createElement("script");
    chatScript.src = "https://cdn.jsdelivr.net/gh/zerootem/chat-ai@main/modweeb-chat.js"; // تأكد من 'main' أو الفرع الافتراضي لمستودعك
    chatScript.defer = true; // لضمان التنفيذ بعد تحليل HTML
    document.body.appendChild(chatScript);

    // إضافة عناصر HTML الأساسية للزر والدردشة ديناميكيًا
    // هذا الجزء كان موجوداً كـ HTML صريح، سننقله إلى هنا ليتم إنشاؤه بواسطة JS

    const chatButtonHtml = `
        <button id="modweeb-chat-btn" type="button" class="modweeb-chat-btn" aria-label="فتح الدردشة" title="ابدأ دردشة AI">
            <svg class="modweeb-svg-btn-n" viewBox="0 0 24 24">
                <path d="M21.49 12C21.81 10.98 22 9.88 22 8.69C22 5.6 19.51 3.09998 16.44 3.09998C14.62 3.09998 13.01 3.98003 12 5.34003C10.99 3.98003 9.37 3.09998 7.56 3.09998C4.49 3.09998 2 5.6 2 8.69C2 15.69 8.48 19.82 11.38 20.82C11.55 20.88 11.77 20.91 12 20.91"></path>
                <path d="M19.21 15.74L15.67 19.2801C15.53 19.4201 15.4 19.68 15.37 19.87L15.18 21.22C15.11 21.71 15.45 22.05 15.94 21.98L17.29 21.79C17.48 21.76 17.75 21.63 17.88 21.49L21.42 17.95C22.03 17.34 22.32 16.63 21.42 15.73C20.53 14.84 19.82 15.13 19.21 15.74Z" stroke-miterlimit="10"></path>
                <path d="M18.7001 16.25C19.0001 17.33 19.8401 18.17 20.9201 18.47" stroke-miterlimit="10"></path>
            </svg>
        </button>
    `;

    const chatWidgetHtml = `
        <div id="modweeb-widget-container">
            <div id="modweeb-chat-container" role="dialog" aria-label="دردشة الذكاء الاصطناعي">
                <div id="modweeb-status" aria-live="polite"></div>
                <div class="modweeb-head" id="modweeb-head">
                    <span>
                        <svg class="line" viewBox="0 0 24 24">
                            <path d="M10.75 2.44995C11.45 1.85995 12.58 1.85995 13.26 2.44995L14.84 3.79995C15.14 4.04995 15.71 4.25995 16.11 4.25995H17.81C18.87 4.25995 19.74 5.12995 19.74 6.18995V7.88995C19.74 8.28995 19.95 8.84995 20.2 9.14995L21.55 10.7299C22.14 11.4299 22.14 12.5599 21.55 13.2399L20.2 14.8199C19.95 15.1199 19.74 15.6799 19.74 16.0799V17.7799C19.74 18.8399 18.87 19.7099 17.81 19.7099H16.11C15.71 19.7099 15.15 19.9199 14.85 20.1699L13.27 21.5199C12.57 22.1099 11.44 22.1099 10.76 21.5199L9.18001 20.1699C8.88001 19.9199 8.31 19.7099 7.92 19.7099H6.17C5.11 19.7099 4.24 18.8399 4.24 17.7799V16.0699C4.24 15.6799 4.04 15.1099 3.79 14.8199L2.44 13.2299C1.86 12.5399 1.86 11.4199 2.44 10.7299L3.79 9.13995C4.04 8.83995 4.24 8.27995 4.24 7.88995V6.19995C4.24 5.13995 5.11 4.26995 6.17 4.26995H7.9C8.3 4.26995 8.86 4.05995 9.16 3.80995L10.75 2.44995Z"></path>
                            <path d="M8.5 15.9401L12 8.06006L15.5 15.9401"></path>
                            <path d="M13.75 13.3101H10.25"></path>
                        </svg>
                        Gemma AI Chat
                    </span>
                    <div style="display:flex;align-items:center;gap:6px">
                        <div class="modweeb-usage" id="modweeb-usage">
                            <span id="modweeb-remaining">الرسائل المتبقية: --</span>
                            <span id="modweeb-chars">0 أحرف</span>
                        </div>
                        <button id="modweeb-chat-close" title="غلق">
                            <svg class="line" viewBox="0 0 24 24">
                                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"></path>
                                <path d="M9.16998 14.83L14.83 9.17004"></path>
                                <path d="M14.83 14.83L9.16998 9.17004"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="modweeb-suggestions" aria-hidden="false">
                    <button class="modweeb-suggestion-btn">كيف أحسن سرعة مدونتي؟</button>
                    <button class="modweeb-suggestion-btn">ما أفضل إضافات SEO؟</button>
                    <button class="modweeb-suggestion-btn">كيف أحمي المدونة من الاختراق؟</button>
                </div>
                <div id="modweeb-messages" aria-live="polite"></div>
                <div class="modweeb-input-wrap">
                    <textarea id="modweeb-input" rows="1" maxlength="300" placeholder="اكتب رسالتك هنا..." aria-label="محتوى الرسالة"></textarea>
                    <button id="modweeb-send" title="إرسال (Enter)">
                        <svg class="line" viewBox="0 0 24 24">
                            <path d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z"></path>
                            <path d="M10.11 13.6501L13.69 10.0601"></path>
                        </svg>
                    </button>
                </div>
                <div class="modweeb-actions">
                    <button id="modweeb-copy-all" title="نسخ المحادثة">
                        <svg class="line" viewBox="0 0 24 24">
                            <path d="M12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22Z"></path>
                            <path d="M14.88 15C14.17 15.62 13.25 16 12.24 16C10.03 16 8.23999 14.21 8.23999 12C8.23999 9.79 10.03 8 12.24 8C13.25 8 14.17 8.38 14.88 9"></path>
                        </svg>
                    </button>
                    <button id="modweeb-clear" title="حذف المحادثة">
                        <svg class="line" viewBox="0 0 24 24">
                            <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"></path>
                            <path d="M9.16998 14.83L14.83 9.17004"></path>
                            <path d="M14.83 14.83L9.16998 9.17004"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    // إلحاق زر الدردشة ومحتوى الدردشة إلى جسم المستند
    document.body.insertAdjacentHTML('beforeend', chatButtonHtml);
    document.body.insertAdjacentHTML('beforeend', chatWidgetHtml);
});

// ملاحظة: دالة modweebChat غير موجودة حاليا في modweeb-chat.js
// ولكن تم تحديث initializeChatWidget لتكون الدالة الرئيسية لتشغيل الأداة
// لذا لا نحتاج إلى استدعاء modweebChat() بعد تحميل السكربت.
// بدلاً من ذلك، سيتم استدعاء initializeChatWidget() مباشرة.