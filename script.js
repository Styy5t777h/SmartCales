document.addEventListener('DOMContentLoaded', () => {
    // --- عناصر الواجهة --- //
    const loader = document.getElementById('loader');
    const appContainer = document.getElementById('app-container');
    const mainDisplay = document.querySelector('.main-display');
    const historyDisplay = document.querySelector('.history-display');
    const keypad = document.querySelector('.keypad');
    const scientificKeypad = document.querySelector('.scientific-keypad');
    const menuBtn = document.getElementById('menu-btn');
    const popupMenu = document.getElementById('popup-menu');
    const copyIdBtn = document.getElementById('copy-id-btn');
     const userIdText = document.getElementById('user-id-text');

    // أزرار القائمة المنبثقة
    const settingsBtn = document.getElementById('settings-btn');
    const historyBtn = document.getElementById('history-btn');
    const sciCalcToggle = document.getElementById('sci-calc-toggle');
    
    // أزرار نافذة الإعدادات
    const addCoinsBtn = document.getElementById('add-coins-btn');
    const privacyPolicyBtn = document.getElementById('privacy-policy-btn');
    const supportUsBtn = document.getElementById('support-us-btn'); // عنصر جديد

    // النوافذ المنبثقة
    const allModals = document.querySelectorAll('.modal-container');
    
    // --- متغيرات الحالة --- //
    let currentInput = '0';
    let previousInput = '';
    let operator = null;
    let userSettings = {};
    let modalStack = []; // مكدس لتتبع النوافذ المفتوحة

    // --- البيانات --- //
    const THEMES = [
        { id: 'default', name: 'أساسي', free: true }, { id: 'dark', name: 'داكن', free: true },
        { id: 'deep-ocean', name: 'البحر العميق', price: 15 }, { id: 'space', name: 'الفضاء', price: 15 },
        { id: 'neon-dark', name: 'النيون الليلي', price: 10 }, { id: 'aurora', name: 'الشفق القطبي', price: 20 },
        { id: 'forest', name: 'الغابة', price: 15 }, { id: 'geometric', name: 'هندسي', price: 10 },
        { id: 'hamster', name: 'هامستر', price: 15 }, { id: 'sunset', name: 'الغروب', price: 15 },
        { id: 'purple-mist', name: 'ضباب بنفسجي', price: 15 }, { id: 'chocolate', name: 'شوكولاتة', price: 15 },
        { id: 'desert', name: 'الصحراء', price: 15 }, { id: 'wheat-field', name: 'حقل القمح', price: 15 },
        { id: 'rainy-mood', name: 'مطر هادئ', price: 50 }, { id: 'autumn-leaves', name: 'أوراق الخريف', price: 25 },
        { id: 'spring-blossom', name: 'زهور الربيع', price: 20 }, { id: 'night-sky', name: 'سماء الليل', price: 15 },
        { id: 'volcanic-rock', name: 'صخور بركانية', price: 15 }, { id: 'tropical-garden', name: 'حديقة استوائية', price: 15 },
        { id: 'floating-clouds', name: 'غيوم طافية', price: 15 }, { id: 'mood-flow', name: 'المزاج المتغير', price: 25 },
        { id: 'cartoon-sketch', name: 'رسم كرتوني', price: 50 }, { id: 'mystic-crystal', name: 'كريستال سحري', price: 50 },
        { id: 'retro-calculator', name: 'حاسبة كلاسيكية', price: 45 },
        { id: 'old-paper', name: 'ورق قديم', price: 50 }, { id: '8-bit', name: 'ألعاب كلاسيكية', price: 50 },
        { id: 'gold-black', name: 'ذهب وأسود', price: 15 },
        { id: 'marble-ink', name: 'رخام وحبر', price: 20 },
        { id: 'sakura', name: 'ساكورا', price: 20 },
        { id: 'wood-leather', name: 'خشب وجلد', price: 15 },
        { id: 'avocado', name: 'أفوكادو', price: 20 }, { id: 'panda', name: 'باندا', price: 20 },
        { id: 'youssef-bmw', name: 'يوسف BMW M5', price: 25 },
        { id: 'bio-organic', name: 'المادة الحيوية', price: 50 },
        { id: 'ancient-manuscript', name: 'مخطوطة قديمة', price: 25 },
        { id: 'hologram-ui', name: 'واجهة هولوغرام', price: 15 },
        { id: 'steampunk-clockwork', name: 'الساعة الميكانيكية', price: 15 },
        { id: 'living-nature', name: 'الطبيعة المتغيرة', price: 25 }
    ];

    // --- تحميل وحفظ وتطبيق الإعدادات --- //
    function loadUserSettings() {
        const savedSettings = JSON.parse(localStorage.getItem('smartCalcSettings_v3')) || {}; // استخدام مفتاح جديد
        const defaultSettings = {
            userId: 'user-' + Math.random().toString(36).substr(2, 9),
            theme: 'default',
            unlockedThemes: THEMES.filter(t => t.free).map(t => t.id),
            coins: 25,
            history: []
        };
        userSettings = { ...defaultSettings, ...savedSettings };
        applySettings();
    }
    
    function saveUserSettings() { localStorage.setItem('smartCalcSettings_v3', JSON.stringify(userSettings)); }

function applySettings() {
    document.body.className = ''; // إعادة تعيين الكلاسات أولاً

    if (userSettings.theme === 'living-nature') {
        setSeasonTheme(); // استدعاء دالة الفصول الخاصة
    } else if (userSettings.theme === 'mood-flow') { 
        setDynamicTheme(); 
    } else { 
        document.body.classList.add(`theme-${userSettings.theme}`); 
    }

     if (userIdText) {
        userIdText.textContent = `ID: ${userSettings.userId}`;
    }

    updateCoinDisplay();
}

// --- دالة خاصة بثيم الطبيعة المتغيرة حسب فصول السنة ---
function setSeasonTheme() {
    const month = new Date().getMonth(); // 0 = January, 11 = December
    let seasonClass = 'season-winter'; // الشتاء هو الافتراضي

    if (month >= 2 && month <= 4) { // March, April, May
        seasonClass = 'season-spring';
    } else if (month >= 5 && month <= 7) { // June, July, August
        seasonClass = 'season-summer';
    } else if (month >= 8 && month <= 10) { // September, October, November
        seasonClass = 'season-autumn';
    }

    // إزالة أي فصول قديمة وإضافة الفصل الحالي
    document.body.classList.remove('season-winter', 'season-spring', 'season-summer', 'season-autumn');
    document.body.classList.add(`theme-living-nature`, seasonClass);
}

    
    function updateCoinDisplay() {
        const coinBalanceEl = document.getElementById('coin-balance');
        if (coinBalanceEl) coinBalanceEl.innerHTML = `${userSettings.coins} <i class="fas fa-coins"></i>`;
    }

    // --- دالة خاصة بالثيم المتغير حسب الوقت ---
    function setDynamicTheme() {
        const hour = new Date().getHours();
        let moodClass = 'mood-night';
        if (hour >= 5 && hour < 12) { moodClass = 'mood-morning'; } 
        else if (hour >= 12 && hour < 18) { moodClass = 'mood-day'; } 
        else if (hour >= 18 && hour < 21) { moodClass = 'mood-evening'; }
        document.body.className = `theme-mood-flow ${moodClass}`;
    }
    setInterval(() => { if (userSettings && userSettings.theme === 'mood-flow') { setDynamicTheme(); } }, 60000);

    // --- شاشة التحميل --- //
    setTimeout(() => {
        loader.style.display = 'none';
        appContainer.classList.remove('hidden');
    }, 3000);

    // --- منطق الآلة الحاسبة --- //
    function updateDisplay() {
        mainDisplay.textContent = currentInput;
        historyDisplay.textContent = previousInput + (operator || '');
    }

    function handleInput(key) {
        if (/\d/.test(key)) { if (currentInput.length > 15) return; if (currentInput === '0' || currentInput === 'Error') currentInput = ''; currentInput += key;
        } else if (key === '.') { if (!currentInput.includes('.')) currentInput += '.';
        } else if (['+', '-', '*', '/', '^'].includes(key)) { if (currentInput === '' && previousInput !== '') { operator = key; } else { if (operator) calculate(); operator = key; previousInput = currentInput; currentInput = ''; }
        } else if (key === '=') { calculate();
        } else if (key === 'clear') { currentInput = '0'; previousInput = ''; operator = null;
        } else if (key === 'backspace') { currentInput = currentInput.slice(0, -1) || '0';
        } else if (key === '%') { if(currentInput !== '') currentInput = String(parseFloat(currentInput) / 100);
        } else { handleScientific(key); }
        updateDisplay();
    }

    function calculate() {
        if (!operator || previousInput === '' || currentInput === '') return;
        let result; const prev = parseFloat(previousInput); const current = parseFloat(currentInput); if (isNaN(prev) || isNaN(current)) return;
        try { const expression = `${previousInput} ${operator.replace('^', '**')} ${currentInput}`; result = eval(expression); if (!isFinite(result)) throw new Error("Invalid result");
            const historyEntry = { expression: `${previousInput} ${operator} ${currentInput} =`, result: String(result) }; userSettings.history.unshift(historyEntry); if (userSettings.history.length > 30) userSettings.history.pop();
            currentInput = String(result); operator = null; previousInput = ''; saveUserSettings();
        } catch (e) { currentInput = 'Error'; operator = null; previousInput = ''; }
    }

    function handleScientific(key) {
        const val = parseFloat(currentInput); if (isNaN(val) && !['pi', 'E', '(', ')'].includes(key)) return;
        try { switch (key) {
                case 'pi': currentInput = String(Math.PI); break; case 'E': currentInput = String(Math.E); break;
                case 'sq': currentInput = String(Math.pow(val, 2)); break; case 'sqrt': currentInput = String(Math.sqrt(val)); break;
                case 'sin': currentInput = String(Math.sin(val * Math.PI / 180)); break; case 'cos': currentInput = String(Math.cos(val * Math.PI / 180)); break;
                case 'tan': currentInput = String(Math.tan(val * Math.PI / 180)); break; case 'log': currentInput = String(Math.log10(val)); break;
                case 'ln': currentInput = String(Math.log(val)); break; case '(': if(currentInput === '0') currentInput = ''; currentInput += '('; break; case ')': currentInput += ')'; break;
            }
        } catch { currentInput = 'Error'; }
    }

    // --- منطق النوافذ المطور --- //
    function openModal(modal) {
        if (modalStack.length > 0) {
            const currentModalId = modalStack[modalStack.length - 1];
            document.getElementById(currentModalId).classList.add('hidden');
        }
        modal.classList.remove('hidden');
        modalStack.push(modal.id);
        document.body.classList.add('modal-open');
        popupMenu.classList.add('hidden');
    }

    function closeTopModal() {
        if (modalStack.length === 0) return;
        const currentModalId = modalStack.pop();
        document.getElementById(currentModalId).classList.add('hidden');
        if (modalStack.length > 0) {
            const previousModalId = modalStack[modalStack.length - 1];
            document.getElementById(previousModalId).classList.remove('hidden');
        } else {
            document.body.classList.remove('modal-open');
        }
    }

    allModals.forEach(modal => {
    const closeBtn = modal.querySelector('.close-modal-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // هذا السطر يحل المشكلة
            closeTopModal();
        });
    }
});

    // --- Event Listeners --- //
    keypad.addEventListener('click', (e) => { if (e.target.matches('button')) handleInput(e.target.dataset.key); });
    scientificKeypad.addEventListener('click', (e) => { if (e.target.matches('button')) handleInput(e.target.dataset.key); });
    
    menuBtn.addEventListener('click', (e) => { e.stopPropagation(); popupMenu.classList.toggle('hidden'); });
    document.addEventListener('click', () => { if (!popupMenu.classList.contains('hidden')) popupMenu.classList.add('hidden'); });
    
    sciCalcToggle.addEventListener('click', () => {
        const isHidden = scientificKeypad.classList.toggle('hidden');
        popupMenu.classList.add('hidden');
        if (!isHidden) showSciCalcArrow();
    });

    settingsBtn.addEventListener('click', () => {
        buildThemes();
        openModal(document.getElementById('settings-modal'));
    });

    function buildThemes() {
        const container = document.getElementById('themes-container'); container.innerHTML = '';
        THEMES.forEach(theme => {
            const isUnlocked = userSettings.unlockedThemes.includes(theme.id);
            const item = document.createElement('div'); item.className = 'choice-item';
            if (userSettings.theme === theme.id) item.classList.add('selected');
            if (!isUnlocked) item.classList.add('locked');
            item.innerHTML = `<span>${theme.name}</span>` + `${!isUnlocked ? `<div class="lock-icon"><i class="fas fa-lock"></i> ${theme.price} <i class="fas fa-coins"></i></div>` : ''}`;
            item.addEventListener('click', () => selectTheme(theme, isUnlocked)); container.appendChild(item);
        });
    }

    function selectTheme(theme, isUnlocked) {
        if (!isUnlocked) {
            if (userSettings.coins >= theme.price) {
                if (confirm(`شراء ثيم "${theme.name}" مقابل ${theme.price} عملة؟`)) {
                    userSettings.coins -= theme.price; userSettings.unlockedThemes.push(theme.id); userSettings.theme = theme.id;
                    saveUserSettings(); applySettings(); buildThemes();
                }
            } else { alert('ليس لديك عملات كافية!'); } return;
        }
        userSettings.theme = theme.id; saveUserSettings(); applySettings(); buildThemes();
    }
    
    historyBtn.addEventListener('click', () => {
        const modal = document.getElementById('history-modal');
        let content = `<div class="modal-content"><button class="close-modal-btn">&times;</button>
            <div class="hist-header"><h2>سجل العمليات</h2><button id="delete-hist-btn" title="حذف"><i class="fas fa-trash"></i></button></div>
            <ul id="history-list">`;
        if (userSettings.history && userSettings.history.length > 0) {
            userSettings.history.forEach((item, index) => {
                content += `<li class="hist-item" data-index="${index}"><div class="hist-details"><div class="hist-expr">${item.expression}</div><div class="hist-result">${item.result}</div></div></li>`;
            });
        } else { content += '<li>لا توجد عمليات محفوظة.</li>'; }
        content += '</ul></div>';
        modal.innerHTML = content;

        modal.querySelectorAll('.hist-item .hist-details').forEach(item => {
            item.addEventListener('click', (e) => {
                const modalContent = modal.querySelector('.modal-content');
                if (modalContent.classList.contains('delete-mode')) return;
                const index = e.currentTarget.parentElement.dataset.index;
                const histEntry = userSettings.history[index];
                currentInput = histEntry.result;
                previousInput = histEntry.expression.replace(/ =$/, '');
                operator = null; 
                updateDisplay();
                closeTopModal();
            });
        });
        modal.querySelector('#delete-hist-btn').addEventListener('click', () => toggleDeleteMode(modal));
        modal.querySelector('.close-modal-btn').addEventListener('click', () => closeTopModal());
        openModal(modal);
    });

    function toggleDeleteMode(modal) {
        const modalContent = modal.querySelector('.modal-content');
        const isDeleteMode = modalContent.classList.toggle('delete-mode');
        const header = modal.querySelector('.hist-header');
        if (isDeleteMode) {
            header.querySelector('#delete-hist-btn').innerHTML = '<i class="fas fa-times"></i>';
            const confirmBtn = document.createElement('button');
            confirmBtn.id = 'confirm-delete-btn';
            confirmBtn.innerHTML = '<i class="fas fa-check"></i>';
            header.appendChild(confirmBtn);
            modal.querySelectorAll('.hist-item').forEach(item => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                item.prepend(checkbox);
                item.querySelector('.hist-details').addEventListener('click', () => { if(modalContent.classList.contains('delete-mode')) checkbox.checked = !checkbox.checked; });
            });
            confirmBtn.addEventListener('click', () => {
                const indicesToDelete = [];
                modal.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                    indicesToDelete.push(parseInt(cb.parentElement.dataset.index));
                });
                userSettings.history = userSettings.history.filter((_, index) => !indicesToDelete.includes(index));
                saveUserSettings();
                closeTopModal();
                historyBtn.click();
            }, { once: true });
        } else {
            header.querySelector('#delete-hist-btn').innerHTML = '<i class="fas fa-trash"></i>';
            header.querySelector('#confirm-delete-btn')?.remove();
            modal.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.remove());
        }
    }

    function showSciCalcArrow() {
        const arrow = document.getElementById('sci-calc-arrow');
        arrow.classList.remove('hidden');
        setTimeout(() => arrow.classList.add('hidden'), 1500);
    }

    document.querySelectorAll('.price-package').forEach(pkg => {
        pkg.addEventListener('click', () => {
            const amount = pkg.dataset.amount;
            const price = pkg.dataset.price;
            const message = `أرغب في شراء باقة ${amount} عملة مقابل ${price} USDT. \nمعرف المستخدم الخاص بي هو: ${userSettings.userId}`;
            const telegramUrl = `https://t.me/AL_hashmee?text=${encodeURIComponent(message)}`;
            window.open(telegramUrl, '_blank');
        });
    });

    supportUsBtn.addEventListener('click', () => {
        const modal = document.getElementById('support-us-modal');
        const walletAddress = 'TAGn8VXw71E1Ds8aarUKFaJX5TKgiEdbaM';
        modal.innerHTML = `<div class="modal-content"><button class="close-modal-btn">&times;</button><h3><i class="fas fa-heart"></i> ادعمنا</h3><p>شكرًا لاهتمامك بدعمنا! دعمك يساعدنا على تطوير تطبيقات أفضل ومجانية للجميع.</p><p><strong>عنوان محفظة USDT (TRC20):</strong></p><div class="wallet-address-container"><input type="text" value="${walletAddress}" readonly><button id="copy-wallet-btn"><i class="fas fa-copy"></i></button></div><p class="small-note">الشبكة: TRON (TRC20) فقط. لا يلزم وجود TAG/MEMO.</p></div>`;
        modal.querySelector('#copy-wallet-btn').addEventListener('click', () => { navigator.clipboard.writeText(walletAddress).then(() => alert('تم نسخ عنوان المحفظة!')); });
        modal.querySelector('.close-modal-btn').addEventListener('click', () => closeTopModal());
        openModal(modal);
    });

privacyPolicyBtn.addEventListener('click', () => {
    const modal = document.getElementById('privacy-policy-modal');
    modal.innerHTML = `<div class="modal-content">
            <button class="close-modal-btn">&times;</button>
            <h3>سياسة الخصوصية لتطبيق SmartCalc</h3>
            <p><strong>تاريخ السريان: 29 يوليو 2025</strong></p>
            <p>نحن في CodeNest نأخذ خصوصيتك على محمل الجد. توضح هذه السياسة كيفية تعامل تطبيق SmartCalc مع بياناتك.</p>

            <h4>1. البيانات التي لا نجمعها</h4>
            <p>تطبيق SmartCalc مصمم ليعمل بالكامل على جهازك. نحن <strong>لا نجمع أو نخزن أو نشارك أي معلومات تعريف شخصية</strong> عنك، مثل الاسم، البريد الإلكتروني، الموقع، أو أي بيانات حساسة أخرى.</p>

            <h4>2. البيانات المحفوظة محليًا على جهازك</h4>
            <p>لتحسين تجربتك، يقوم التطبيق بحفظ بعض البيانات محليًا على جهازك فقط باستخدام تقنية التخزين المحلي (LocalStorage). هذه البيانات تشمل:</p>
            <ul>
                <li><strong>معرف المستخدم (User ID):</strong> يتم إنشاء معرف عشوائي فريد لتخصيص العملات والثيمات لحسابك داخل التطبيق فقط. هذا المعرف غير مرتبط بهويتك الحقيقية.</li>
                <li><strong>إعدادات التطبيق:</strong> الثيم المفضل لديك ورصيد العملات الخاص بك.</li>
                <li><strong>سجل العمليات:</strong> يتم حفظ آخر عمليات حسابية قمت بها لتسهيل الرجوع إليها.</li>
            </ul>
            <p>هذه البيانات <strong>تبقى على جهازك ولا تصل إلى خوادمنا</strong> أو أي طرف ثالث. يمكنك مسح هذه البيانات في أي وقت عن طريق مسح بيانات التطبيق من إعدادات جهازك.</p>

            <h4>3. الأذونات</h4>
            <p>تطبيق SmartCalc لا يطلب أي أذونات خاصة من جهازك (مثل الوصول إلى الكاميرا، جهات الاتصال، أو الموقع).</p>

            <h4>4. تغييرات على سياسة الخصوصية</h4>
            <p>قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم نشر أي تغييرات هنا.</p>

            <p>باستخدامك للتطبيق، فإنك توافق على هذه السياسة.</p>
        </div>`;
    modal.querySelector('.close-modal-btn').addEventListener('click', () => closeTopModal());
    openModal(modal);
});
    
    addCoinsBtn.addEventListener('click', () => {
        const modal = document.getElementById('add-coins-modal');
        modal.innerHTML = `<div class="modal-content"><button class="close-modal-btn">&times;</button><h3>إضافة عملات</h3><input type="text" id="admin-user-id" placeholder="ID المستخدم" style="width: 95%; padding: 10px; margin-bottom: 10px; border-radius: 5px; border: 1px solid #ccc;"><input type="number" id="admin-coins-amount" placeholder="عدد العملات" style="width: 95%; padding: 10px; margin-bottom: 10px; border-radius: 5px; border: 1px solid #ccc;"><input type="password" id="admin-password" placeholder="كلمة المرور" style="width: 95%; padding: 10px; margin-bottom: 10px; border-radius: 5px; border: 1px solid #ccc;"><button id="admin-submit-btn" class="settings-btn-full">إرسال</button></div>`;
        modal.querySelector('#admin-submit-btn').addEventListener('click', () => {
            const targetId = modal.querySelector('#admin-user-id').value;
            const amount = parseInt(modal.querySelector('#admin-coins-amount').value);
            const password = modal.querySelector('#admin-password').value;
            const ADMIN_PASSWORD = 'Iwellnotforgiveyou666';
            if (password !== ADMIN_PASSWORD) { alert('كلمة المرور غير صحيحة!'); return; }
            if (targetId === userSettings.userId && amount > 0) {
                userSettings.coins += amount; saveUserSettings(); applySettings();
                alert(`تمت إضافة ${amount} عملة بنجاح!`); closeTopModal();
            } else { alert('ID المستخدم غير صحيح أو المبلغ غير صالح.'); }
        });
        modal.querySelector('.close-modal-btn').addEventListener('click', () => closeTopModal());
        openModal(modal);
    });
    
    copyIdBtn.addEventListener('click', () => { navigator.clipboard.writeText(userSettings.userId).then(() => alert('تم نسخ ID المستخدم!')); });
    
    loadUserSettings();
    updateDisplay();
});