const stations = [
    { id: 1, name: 'Northern Avenue Hub', address: 'Northern Ave. 8, Yerevan', distance: '2.4 km', distanceKm: 2.4, eta: '8 min', available: 4, total: 8, power: 180, price: 120, status: 'available', x: 61, y: 34, rating: 4.9, reliability: 99.4, reservable: true, parking: true, open: '24/7', connector: 'CCS2', connectors: ['CCS2','Type 2'], currentTypes: ['DC','AC'], network: 'VoltDrive', facilities: ['Parking','Coffee','Wi-Fi','Card pay'], access: 'Enter from Northern Avenue and follow VoltDrive signs to the charging bays.', parkingRule: 'Charging bays only · 10 min grace after charging · idle fee applies after grace.' },
    { id: 2, name: 'Cascade Charge Point', address: 'Tamanyan St. 10', distance: '3.1 km', distanceKm: 3.1, eta: '11 min', available: 1, total: 6, power: 120, price: 110, status: 'busy', x: 28, y: 27, rating: 4.7, reliability: 98.7, reservable: true, parking: true, open: '06:00–00:00', connector: 'CCS2', connectors: ['CCS2'], currentTypes: ['DC'], network: 'VoltDrive', facilities: ['Parking','Coffee','Wi-Fi'], access: 'Use the Tamanyan Street vehicle entrance and follow the EV charging signs.', parkingRule: 'Parking is available while charging · local parking tariff may apply.' },
    { id: 3, name: 'Republic Square Station', address: 'Abovyan St. 1', distance: '4.6 km', distanceKm: 4.6, eta: '15 min', available: 2, total: 4, power: 240, price: 135, status: 'busy', x: 48, y: 62, rating: 4.8, reliability: 98.9, reservable: true, parking: false, open: '24/7', connector: 'CCS2', connectors: ['CCS2','CHAdeMO'], currentTypes: ['DC'], network: 'Roaming', facilities: ['Wi-Fi','Card pay'], access: 'Public access from Abovyan Street. Chargers are marked with roaming-network signage.', parkingRule: 'No dedicated parking reservation · local street-parking rules apply.' },
    { id: 4, name: 'Dalma Garden Garage', address: 'Tsitsernakaberd Hwy. 3', distance: '6.2 km', distanceKm: 6.2, eta: '18 min', available: 0, total: 10, power: 60, price: 95, status: 'offline', x: 78, y: 73, rating: 4.3, reliability: 92.1, reservable: false, parking: true, open: '10:00–22:00', connector: 'CCS2', connectors: ['CCS2','Type 2'], currentTypes: ['DC','AC'], network: 'VoltDrive', facilities: ['Parking','Coffee','Card pay'], access: 'Use the shopping-centre garage entrance and follow signs to the EV charging area.', parkingRule: 'Garage parking tariff applies separately · charging bays are reserved for connected EVs.' },
    { id: 5, name: 'Komitas Fast Lane', address: 'Komitas Ave. 49', distance: '5.4 km', distanceKm: 5.4, eta: '16 min', available: 3, total: 5, power: 150, price: 105, status: 'available', x: 18, y: 72, rating: 4.6, reliability: 99.1, reservable: true, parking: true, open: '24/7', connector: 'CCS2', connectors: ['CCS2'], currentTypes: ['DC'], network: 'VoltDrive', facilities: ['Parking','Wi-Fi'], access: 'Enter from Komitas Avenue and use the marked VoltDrive bays on the right.', parkingRule: 'Charging customers only · idle fee begins after the posted grace period.' },
];
const stationNavigationMeta = {
  1: { activeInstruction: 'Turn right onto Northern Avenue', activeDistance: '350 m', defaultBay: 'B-12', steps: [['Head toward Abovyan Street','Continue for 1.1 km'],['Turn right onto Northern Avenue','Station entrance is on the left']] },
  2: { activeInstruction: 'Continue toward Tamanyan Street', activeDistance: '420 m', defaultBay: 'C-04', steps: [['Continue toward Cascade','Follow signs for Tamanyan Street'],['Enter from Tamanyan Street','Use the marked EV charging entrance']] },
  3: { activeInstruction: 'Continue toward Republic Square', activeDistance: '500 m', defaultBay: 'Public bay', steps: [['Continue toward Republic Square','Stay on the central route'],['Turn onto Abovyan Street','Roaming chargers are near the public access area']] },
  4: { activeInstruction: 'Take the garage entrance', activeDistance: '600 m', defaultBay: 'G-08', steps: [['Continue on Tsitsernakaberd Highway','Follow signs for Dalma Garden Mall'],['Enter the shopping-centre garage','Follow EV charging signs inside the garage']] },
  5: { activeInstruction: 'Continue onto Komitas Avenue', activeDistance: '450 m', defaultBay: 'K-03', steps: [['Head toward Komitas Avenue','Continue on the main route'],['Enter the marked VoltDrive lane','Charging bays are on the right']] }
};
const stateMeta = {
    idle: { label: 'Ready to charge', battery: 68, range: 342, eyebrow: 'Vehicle ready' },
    reserved: { label: 'Reservation active', battery: 64, range: 319, eyebrow: 'Reservation starts in 18 min' },
    charging: { label: 'Charging now', battery: 76, range: 406, eyebrow: '48 min remaining' },
    completed: { label: 'Charge completed', battery: 90, range: 487, eyebrow: 'Ready to continue' },
};
let appState = 'idle';
let homeScenario = 'normal';
let homeVehicleMenuOpen = false;
let activeTab = 'home';
let screen = 'auth';
let selectedStation = stations[0];
let filter = 'Available';
let mapView = 'map';
let mapQuery = '';
let recentMapSearches = ['Northern Avenue', 'CCS2'];
let mapSort = 'distance';
const createDefaultMapFilters = () => ({ available: false, fast: false, reservable: false, parking: false, connector: 'all', currentType: 'all', minPower: 0, open24: false, voltDriveOnly: false, compatible: false, maxPrice: 150 });
let mapFilters = createDefaultMapFilters();
let favoriteStations = new Set([1]);
let showFavoritesOnly = false;
let waitingListJoined = false;
let reservationStep = 1;
let reservation = { type: 'Specific charger', vehicleId: 1, vehicle: 'Tesla Model Y', date: 'Today · Fri 21', time: '12:30', duration: 45, target: 90, charger: '04', bay: 'B-12' };
let reservationMode = 'create';
let activeReservation = null;
let reservationTermsAccepted = true;
let reservationMessage = '';
let cancellationReason = 'Plans changed';
let graceMinutes = 10;
let lastExpiredReservationId = '';
const reservationFee = 500;
const reservationCancellationPolicy = { freeBeforeMinutes: 15 };
let waitingPosition = 3;
let navigationState = { source: 'location', started: false, progress: 0, arrived: false, arrivalConfirmed: false, assignment: null };
let navigationMessage = '';
let charging = { battery: 64, target: 90, power: 142, energy: 18.6, cost: 2232, minutes: 17, remaining: 26, speed: 'Maximum', paused: false };
let chargeLimit = { type: 'battery', battery: 90, energy: 30, cost: 3500, time: 45 };
let chargeLimitReturnScreen = 'tariff-review';
let chargeLimitDraft = null;
let activeChargingSession = null;
let pendingChargingVehicleId = null;
let pendingChargingReservationId = null;
let chargingSimulationTimer = null;
let startCharge = { code: 'VD-04-CCS2', connector: '04', payment: 'Visa •••• 5050', preauth: 5000, accepted: true, error: '', stage: 'idle' };
let scannerFlashlight = false;
let chargeStartMessage = '';
let chargingSummary = { startBattery: 64, endBattery: 90, energy: 31.8, cost: 3816, duration: 43, status: 'Completed', reason: 'Target reached' };
let parkingSession = { active: false, stage: 'grace', graceMinutes: 10, graceSecondsRemaining: 600, idleMinutes: 0, idleSecondsElapsed: 0, idleCost: 0, extensionMinutes: 30, extensionSecondsRemaining: 0, extensionCost: 0, bay: 'B-12', message: '', paymentMessage: '' };
let parkingCountdownTimer = null;
let vehicles = [
  {id:1, name:'Tesla Model Y', plate:'35 GG 505', vin:'', connector:'CCS2', battery:68, batteryCapacity:75, limit:90, ownership:'Personal', oemStatus:'Not connected', homeCharging:'Not configured', plugAndCharge:false, active:true},
  {id:2, name:'BMW i4', plate:'40 AA 404', vin:'', connector:'CCS2', battery:41, batteryCapacity:84, limit:80, ownership:'Personal', oemStatus:'Not connected', homeCharging:'Not configured', plugAndCharge:false, active:false}
];
let paymentMethods = [{id:1, brand:'VISA', last4:'5050', expiry:'08/29', active:true}];
let walletTopUp = 5000;
let walletBalance = 14500;
let latestCompletedSessionId = 'VD-CS-10852';
let latestPaymentId = 'PAY-50821';
let latestReceiptId = 'RC-10852';
let qaCompleted = new Set();
let qaMessage = '';
let onboardingStep = 1;
let authMode = 'welcome';
let authMessage = '';
let onboardingData = { name: 'Alex Rowan', country: 'Armenia', language: 'English', email: 'alex.rowan@example.com', vehicleBrand: 'Hyundai', vehicleModel: 'IONIQ 5', plate: '77 EV 777', connector: 'CCS2', cardNumber: '4242 4242 4242 5050', cardExpiry: '08/29', cardholder: 'ALEX ROWAN', cardLast4: '5050', cardBrand: 'VISA' };
let onboardingComplete = false;
let onboardingAccountApplied = false;
let twoFactorEnabled = true;
let biometricEnabled = false;
let securityMessage = '';
let notificationSettingsMessage = '';
let accountMessage = '';
let profile = { name: 'Alex Rowan', email: 'alex.rowan@voltdrive.example', phone: '+374 99 505050', address: 'Yerevan, Armenia' };
let accountPreferences = { language: 'English', country: 'Armenia', currency: 'AMD', distance: 'Kilometres', energy: 'kWh', marketingData: false, analytics: true };
try { accountPreferences = { ...accountPreferences, ...JSON.parse(localStorage.getItem('voltdrive.preferences') || '{}') }; } catch (_) {}
let permissionState = { location: 'granted', camera: 'granted', notifications: 'granted' };
try { permissionState = { ...permissionState, ...JSON.parse(localStorage.getItem('voltdrive.permissions') || '{}') }; } catch (_) {}
let permissionRequest = { type: 'location', returnScreen: 'map', returnTab: 'map' };
let permissionMessage = '';
let billingProfile = { company: '', taxId: '', billingEmail: 'alex.rowan@voltdrive.example', plan: 'VoltDrive Free', autoRenew: false, promoCode: '' };
let membershipMessage = '';
let selectedPlan = 'VoltDrive Plus';
let selectedPackageId = 2;
let membershipCheckoutMode = 'plan';
let chargingCredits = { kwh: 18, expires: '31 Aug 2026' };
const membershipPlans = [
  {id:'VoltDrive Free',name:'Free',price:0,period:'No monthly fee',tag:'Pay as you go',features:['Standard public tariffs','Reservations with standard fees','Digital receipts and invoices']},
  {id:'VoltDrive Plus',name:'Plus',price:2900,period:'per month',tag:'Best for regular drivers',features:['Up to 10% lower charging tariffs','2 free reservations each month','Priority support','No activation fee']},
  {id:'VoltDrive Fleet Personal',name:'Fleet Personal',price:4900,period:'per month',tag:'For mixed personal and work use',features:['Personal and corporate balances','Home-charging reimbursement support','Monthly consolidated invoice','Priority reservations']}
];
const chargingPackages = [
  {id:1,name:'City 25',kwh:25,price:2750,validity:'30 days',saving:'Save 250 AMD'},
  {id:2,name:'Road 60',kwh:60,price:6300,validity:'60 days',saving:'Save 900 AMD'},
  {id:3,name:'Ultra 120',kwh:120,price:12000,validity:'90 days',saving:'Save 2,400 AMD'}
];
let rfidCards = [{ id: 1, name: 'Main RFID', number: 'VD-84 •••• 2050', vehicleId: 1, active: true }];
let accessMessage = '';
let plugCharge = { vehicleId: 1, supported: true, enabled: false, certificate: 'Not activated', provider: 'VoltDrive PKI' };
let editingRfidId = 0;
let autoTopUp = { enabled: true, threshold: 2000, amount: 5000 };
let editingVehicleId = null;
let vehicleEditorMessage = '';
let selectedPaymentId = 1;
let notificationPreferences = {
  push: true,
  email: true,
  sms: false,
  reservation: true,
  charging: true,
  payment: true,
  offers: false,
  quietHours: true,
  quietStart: '22:00',
  quietEnd: '07:00'
};
let connectedSessions = [
  {id:1, device:'Chrome on Windows', location:'Yerevan, Armenia', time:'Current session', current:true},
  {id:2, device:'VoltDrive on iPhone', location:'Yerevan, Armenia', time:'Yesterday, 21:18', current:false},
  {id:3, device:'Safari on MacBook', location:'Tbilisi, Georgia', time:'28 Jul, 10:42', current:false}
];
function defaultPaymentMethod(){
    return paymentMethods.find(p=>p.active) || paymentMethods[0] || null;
}
function paymentMethodLabel(method){
    if(!method) return 'No saved card';
    const brand=method.brand==='VISA'?'Visa':method.brand;
    return `${brand} •••• ${method.last4}`;
}
function autoTopUpFundingCard(){
    return paymentMethods.find(p=>p.active) || null;
}
function canAutoTopUpWallet(requiredAmount=0){
    const topUpAmount=Math.max(0,Number(autoTopUp.amount||0));
    return Boolean(autoTopUp.enabled && topUpAmount>0 && autoTopUpFundingCard() && walletBalance+topUpAmount>=Math.max(0,Number(requiredAmount||0)));
}
function performWalletAutoTopUp(reason='Wallet balance below threshold'){
    const card=autoTopUpFundingCard();
    const amount=Math.max(0,Number(autoTopUp.amount||0));
    if(!autoTopUp.enabled || !card || amount<=0) return {ok:false,amount:0,paymentId:'',method:''};
    walletBalance+=amount;
    const paymentId=nextRecordId('PAY',activityPayments);
    const method=paymentMethodLabel(card);
    activityPayments.unshift({id:paymentId,date:'Just now',title:'Wallet auto top-up',method,amount,status:'Paid',topUpReason:reason});
    addSystemNotification('Wallet topped up automatically',`${amount.toLocaleString()} AMD added from ${method}. New balance ${walletBalance.toLocaleString()} AMD.`,'payment','payment-detail','View top-up',paymentId);
    return {ok:true,amount,paymentId,method};
}
function ensureWalletCoverage(requiredAmount,reason='Wallet payment'){
    const amount=Math.max(0,Number(requiredAmount||0));
    if(walletBalance>=amount) return {ok:true,topUp:null};
    const topUp=performWalletAutoTopUp(`${reason} · insufficient balance`);
    return {ok:walletBalance>=amount,topUp};
}
function maintainWalletAutoTopUpThreshold(reason='Wallet payment completed'){
    if(!autoTopUp.enabled || walletBalance>=Number(autoTopUp.threshold||0)) return null;
    return performWalletAutoTopUp(`${reason} · balance below ${Number(autoTopUp.threshold||0).toLocaleString()} AMD threshold`);
}
function settlePaymentSource(method,amount,reason='Payment'){
    const total=Math.max(0,Number(amount||0));
    if(!method) return {ok:false,status:'Failed',method:'No payment method',amount:total,message:'No payment method is available.'};
    if(method!=='Wallet balance') return {ok:true,status:'Paid',method,amount:total,topUps:[]};
    const coverage=ensureWalletCoverage(total,reason);
    if(!coverage.ok) return {ok:false,status:'Failed',method,amount:total,topUps:coverage.topUp?.ok?[coverage.topUp]:[],message:`Wallet balance is below the ${total.toLocaleString()} AMD amount even after automatic top-up.`};
    walletBalance-=total;
    const thresholdTopUp=maintainWalletAutoTopUpThreshold(reason);
    return {ok:true,status:'Paid',method,amount:total,topUps:[coverage.topUp,thresholdTopUp].filter(Boolean)};
}
function reservationPaymentSource(){
    const card=defaultPaymentMethod();
    if(card) return paymentMethodLabel(card);
    if(walletBalance>=reservationFee) return 'Wallet balance';
    return '';
}
function chargeReservationFee(record){
    if(!record) return false;
    if(record.feePaymentId){
        record.feePaid=Number(record.feePaid ?? reservationFee);
        return true;
    }
    const method=reservationPaymentSource();
    if(!method) return false;
    if(method==='Wallet balance') walletBalance=Math.max(0,walletBalance-reservationFee);
    const paymentId=nextRecordId('PAY',activityPayments);
    activityPayments.unshift({id:paymentId,date:'Just now',title:'Reservation fee',method,amount:reservationFee,status:'Paid',reservationId:record.id});
    record.feePaid=reservationFee;
    record.feePaymentId=paymentId;
    record.feePaymentMethod=method;
    latestPaymentId=paymentId;
    return true;
}
function latestParkingSessionRecord(){
    return sessions.find(x=>x.id===latestCompletedSessionId) || null;
}
function parkingPaymentMethod(){
    const session=latestParkingSessionRecord();
    if(session?.paymentMethod) return session.paymentMethod;
    const card=defaultPaymentMethod();
    if(card) return paymentMethodLabel(card);
    return walletBalance>0?'Wallet balance':'';
}
function chargeParkingExtension(){
    const amount=Math.max(0,Number(parkingSession.extensionMinutes||0)*50);
    const method=parkingPaymentMethod();
    if(!method) return {ok:false,message:'Add a payment method before extending parking.'};
    const settlement=settlePaymentSource(method,amount,'Parking extension');
    if(!settlement.ok) return {ok:false,message:settlement.message||`Payment of ${amount.toLocaleString()} AMD could not be completed.`};
    const paymentId=nextRecordId('PAY',activityPayments);
    activityPayments.unshift({id:paymentId,date:'Just now',title:'Parking extension',method,amount,status:settlement.status,sessionId:latestCompletedSessionId,parkingMinutes:parkingSession.extensionMinutes});
    latestPaymentId=paymentId;
    parkingSession.extensionCost=(parkingSession.extensionCost||0)+amount;
    const session=latestParkingSessionRecord();
    if(session) session.parkingFee=(session.parkingFee||0)+amount;
    addSystemNotification('Parking extension paid',`${amount.toLocaleString()} AMD · ${parkingSession.extensionMinutes} min · Bay ${parkingSession.bay}`,'payment','payment-detail','View payment',paymentId);
    return {ok:true,amount,method,paymentId};
}
const icon = (name) => ({ bell: '◌', car: '▱', chevron: '›', qr: '▦', wallet: '▤', pin: '●', zap: 'ϟ', clock: '◷', sparkle: '✦', home: '⌂', map: '◇', history: '↺', account: '◉', nav: '➤', plug: '⌁', back: '‹', filter: '≡', search: '⌕', route: '↗', shield: '◆', star: '★', parking: 'P', coffee: '☕', wifi: '⌁', card: '▭' }[name] || '•');
function applyTheme() {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.style.colorScheme = 'dark';
}
function savePreferences() {
    try { localStorage.setItem('voltdrive.preferences', JSON.stringify(accountPreferences)); } catch (_) {}
    applyTheme();
}
function currencyForCountry(country){
    return ({Armenia:'AMD',Georgia:'GEL',Germany:'EUR','United Arab Emirates':'AED'})[country] || 'AMD';
}

const demoCurrencyRates = { AMD: 1, EUR: 0.0023, USD: 0.0026, GEL: 0.0071, AED: 0.0095 };
function convertedCurrencyValue(amountAMD, currency = accountPreferences.currency){
    const amount=Number(amountAMD||0);
    const rate=demoCurrencyRates[currency] || 1;
    return amount * rate;
}
function formatDisplayMoney(amountAMD, currency = accountPreferences.currency){
    const value=convertedCurrencyValue(amountAMD,currency);
    const decimals=currency==='AMD' ? 0 : (Math.abs(value)<10 ? 2 : 0);
    return `${value.toLocaleString(undefined,{minimumFractionDigits:decimals,maximumFractionDigits:decimals})} ${currency}`;
}
const DEMO_NOW = new Date(2026, 7, 21, 11, 50, 0);
function demoClock(minutesOffset=0){
    const value=new Date(DEMO_NOW.getTime()+Number(minutesOffset||0)*60000);
    return `${String(value.getHours()).padStart(2,'0')}:${String(value.getMinutes()).padStart(2,'0')}`;
}
function demoDayLabel(){ return 'Friday'; }
function demoDateTimeLabel(minutesOffset=0){ return `Today, ${demoClock(minutesOffset)}`; }
function formatDistanceKm(km, options={}){
    const value=Math.max(0,Number(km)||0);
    if(accountPreferences.distance==='Miles'){
        const miles=value*0.621371;
        const digits=options.range ? 0 : (miles<10?1:0);
        return `${miles.toLocaleString(undefined,{minimumFractionDigits:digits,maximumFractionDigits:digits})} mi`;
    }
    const digits=options.range ? 0 : (value<10?1:0);
    return `${value.toLocaleString(undefined,{minimumFractionDigits:digits,maximumFractionDigits:digits})} km`;
}
function formatRangeKm(km){ return formatDistanceKm(km,{range:true}); }
function formatRouteDistanceText(text){
    const raw=String(text||'');
    if((accountPreferences.distance||'Kilometres')!=='Miles') return raw;
    return raw.replace(/([0-9]+(?:\.[0-9]+)?)\s*km\b/gi,(_,n)=>`${(Number(n)*0.621371).toFixed(Number(n)<2?1:0)} mi`).replace(/([0-9]+(?:\.[0-9]+)?)\s*m\b/gi,(_,n)=>`${Math.round(Number(n)*3.28084).toLocaleString()} ft`);
}
function chargingVoltage(connector=chargingSessionContext().connector){
    if(connector?.type==='Type 2') return 400;
    if(connector?.type==='CHAdeMO') return 400;
    return Number(connector?.power||0)>=150 ? 760 : 400;
}
function convertRenderedCurrency(root){
    if(!root || accountPreferences.currency==='AMD') return;
    const currency=accountPreferences.currency;
    const rate=demoCurrencyRates[currency] || 1;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{
        if(node.parentElement?.closest('[data-original-currency]')) return;
        const text=node.nodeValue;
        if(!text || !/\bAMD\b/.test(text)) return;
        node.nodeValue=text.replace(/([−-]?\s*\d[\d,]*(?:\.\d+)?)\s*AMD(?=(?:\/kWh)?\b)/g,(match,raw)=>{
            const negative=/[−-]/.test(raw);
            const num=Number(raw.replace(/[−,\s]/g,''));
            if(!Number.isFinite(num)) return match;
            const value=num*rate;
            const decimals=Math.abs(value)<10?2:0;
            const formatted=value.toLocaleString(undefined,{minimumFractionDigits:decimals,maximumFractionDigits:decimals});
            return `${negative?'−':''}${formatted} ${currency}`;
        });
    });
}
const uiTranslations = {
  'Русский': {
    'Home':'Главная','Stations':'Станции','Scan':'Сканер','Sessions':'Сессии','Account':'Аккаунт',
    'Find a charger':'Найти зарядку','Live availability nearby':'Доступность рядом','Current location':'Моё местоположение','Map':'Карта','List':'Список','Filters':'Фильтры',
    'Available':'Доступно','Available now':'Доступно сейчас','Reserved by you':'Забронировано вами','Busy':'Занято','Offline':'Офлайн','Free':'Свободно',
    'Quick start':'Быстрый старт','Scan charger':'Сканировать зарядку','Scan charger QR':'Сканировать QR зарядки','Start charging':'Начать зарядку','Check charger':'Проверить зарядку','Check availability':'Проверить доступность',
    'Connect to a charger':'Подключиться к зарядке','Charger code':'Код зарядки','Check charger':'Проверить зарядку','Need help?':'Нужна помощь?','Charger problem':'Проблема с зарядкой',
    'Payments & wallet':'Платежи и кошелёк','Wallet balance':'Баланс кошелька','Optional wallet balance':'Баланс кошелька','Add funds':'Пополнить','Payment methods':'Способы оплаты','Saved methods':'Сохранённые способы','Add card':'Добавить карту',
    'Garage':'Гараж','Your vehicles':'Ваши автомобили','Manage':'Управлять','Notifications':'Уведомления','Security & privacy':'Безопасность и приватность','Charging access':'Доступ к зарядке','Language & region':'Язык и регион','Units':'Единицы','Privacy & data':'Приватность и данные','Billing & subscription':'Оплата и подписка','Help & support':'Помощь и поддержка',
    'Language & region saved.':'Язык и регион сохранены.','Application language':'Язык приложения','Country or region':'Страна или регион','Default currency':'Валюта по умолчанию','Save region settings':'Сохранить настройки региона','Regional changes affect tariffs and taxes':'Региональные настройки влияют на тарифы и налоги',
    'Privacy & data':'Приватность и данные','Permissions':'Разрешения','Location':'Геолокация','Camera':'Камера','Push notifications':'Push-уведомления','Allowed':'Разрешено','Not allowed':'Не разрешено','Ask when needed':'Запросить при необходимости','Manage permission':'Настроить',
    'Allow access':'Разрешить доступ','Not now':'Не сейчас','Permission required':'Требуется разрешение','Open settings':'Открыть настройки','Continue':'Продолжить','Back':'Назад',
    'Payment cards':'Банковские карты','Default card':'Карта по умолчанию','Payment card':'Банковская карта','Automatic top-up':'Автопополнение','Save auto top-up':'Сохранить автопополнение',
    'Upcoming':'Предстоящие','Active':'Активные','History':'История','Reservations':'Бронирования','Payments':'Платежи','Charging':'Зарядка','Completed':'Завершено','Failed':'Ошибка','Paid':'Оплачено','Refunded':'Возвращено',
    'Open station details':'Открыть станцию','View availability':'Посмотреть доступность','Nearest station':'Ближайшая станция','Recommended action':'Рекомендуемое действие','Ready to charge':'Готово к зарядке','Last reported':'Последние данные','Wallet':'Кошелёк',
    'Save preferences':'Сохранить настройки','Distance':'Расстояние','Kilometres':'Километры','Miles':'Мили','Energy':'Энергия','Edit profile':'Редактировать профиль','Save profile':'Сохранить профиль','Full name':'Имя и фамилия','Phone':'Телефон','Billing address':'Платёжный адрес'
  },
  'Հայերեն': {
    'Home':'Գլխավոր','Stations':'Կայաններ','Scan':'Սկաներ','Sessions':'Սեսիաներ','Account':'Հաշիվ',
    'Find a charger':'Գտնել լիցքավորման կայան','Live availability nearby':'Մոտակա հասանելիություն','Current location':'Իմ տեղադրությունը','Map':'Քարտեզ','List':'Ցանկ','Filters':'Ֆիլտրեր',
    'Available':'Հասանելի','Available now':'Հասանելի հիմա','Reserved by you':'Ամրագրված է ձեզ համար','Busy':'Զբաղված','Offline':'Անցանց','Free':'Ազատ',
    'Quick start':'Արագ մեկնարկ','Scan charger':'Սկանավորել լիցքավորիչը','Scan charger QR':'Սկանավորել լիցքավորիչի QR-ը','Start charging':'Սկսել լիցքավորումը','Check charger':'Ստուգել լիցքավորիչը','Check availability':'Ստուգել հասանելիությունը',
    'Connect to a charger':'Միանալ լիցքավորիչին','Charger code':'Լիցքավորիչի կոդ','Need help?':'Օգնությո՞ւն է պետք','Charger problem':'Լիցքավորիչի խնդիր',
    'Payments & wallet':'Վճարումներ և դրամապանակ','Wallet balance':'Դրամապանակի մնացորդ','Optional wallet balance':'Դրամապանակի մնացորդ','Add funds':'Լիցքավորել','Payment methods':'Վճարման եղանակներ','Saved methods':'Պահված եղանակներ','Add card':'Ավելացնել քարտ',
    'Garage':'Ավտոտնակ','Your vehicles':'Ձեր մեքենաները','Manage':'Կառավարել','Notifications':'Ծանուցումներ','Security & privacy':'Անվտանգություն և գաղտնիություն','Charging access':'Լիցքավորման հասանելիություն','Language & region':'Լեզու և տարածաշրջան','Units':'Չափման միավորներ','Privacy & data':'Գաղտնիություն և տվյալներ','Billing & subscription':'Հաշվարկ և բաժանորդագրություն','Help & support':'Օգնություն և աջակցություն',
    'Language & region saved.':'Լեզուն և տարածաշրջանը պահպանված են։','Application language':'Հավելվածի լեզու','Country or region':'Երկիր կամ տարածաշրջան','Default currency':'Հիմնական արժույթ','Save region settings':'Պահպանել տարածաշրջանի կարգավորումները','Regional changes affect tariffs and taxes':'Տարածաշրջանային փոփոխությունները ազդում են սակագների և հարկերի վրա',
    'Permissions':'Թույլտվություններ','Location':'Տեղադրություն','Camera':'Տեսախցիկ','Push notifications':'Push ծանուցումներ','Allowed':'Թույլատրված է','Not allowed':'Չի թույլատրված','Ask when needed':'Հարցնել անհրաժեշտության դեպքում','Manage permission':'Կառավարել',
    'Allow access':'Թույլատրել','Not now':'Ոչ հիմա','Permission required':'Թույլտվություն է անհրաժեշտ','Open settings':'Բացել կարգավորումները','Continue':'Շարունակել','Back':'Հետ',
    'Payment cards':'Վճարային քարտեր','Default card':'Հիմնական քարտ','Payment card':'Վճարային քարտ','Automatic top-up':'Ավտոմատ համալրում','Save auto top-up':'Պահպանել ավտոմատ համալրումը',
    'Upcoming':'Առաջիկա','Active':'Ակտիվ','History':'Պատմություն','Reservations':'Ամրագրումներ','Payments':'Վճարումներ','Charging':'Լիցքավորում','Completed':'Ավարտված','Failed':'Չհաջողվեց','Paid':'Վճարված','Refunded':'Վերադարձված',
    'Open station details':'Բացել կայանի տվյալները','View availability':'Դիտել հասանելիությունը','Nearest station':'Մոտակա կայան','Recommended action':'Առաջարկվող գործողություն','Ready to charge':'Պատրաստ է լիցքավորման','Last reported':'Վերջին տվյալներ','Wallet':'Դրամապանակ',
    'Save preferences':'Պահպանել կարգավորումները','Distance':'Հեռավորություն','Kilometres':'Կիլոմետրեր','Miles':'Մղոններ','Energy':'Էներգիա','Edit profile':'Խմբագրել պրոֆիլը','Save profile':'Պահպանել պրոֆիլը','Full name':'Անուն ազգանուն','Phone':'Հեռախոս','Billing address':'Վճարման հասցե'
  }
};
function translateRenderedUi(root){
    const language=accountPreferences.language;
    const dict=uiTranslations[language];
    document.documentElement.lang=language==='Русский'?'ru':language==='Հայերեն'?'hy':'en';
    if(!root || !dict) return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{
        if(node.parentElement?.closest('.prototype-notes') || node.parentElement?.closest('option')) return;
        let text=node.nodeValue;
        if(!text || !text.trim()) return;
        const leading=text.match(/^\s*/)?.[0]||'';
        const trailing=text.match(/\s*$/)?.[0]||'';
        let core=text.trim();
        if(dict[core]) core=dict[core];
        else {
            if(language==='Русский'){
                core=core.replace(/^Good morning,\s*/,'Доброе утро, ')
                    .replace(/\bavailable\b/gi,'доступно').replace(/\baway\b/gi,'от вас')
                    .replace(/\bCharging session\b/g,'Сессия зарядки').replace(/\bReservation\b/g,'Бронирование');
            } else if(language==='Հայերեն'){
                core=core.replace(/^Good morning,\s*/,'Բարի լույս, ')
                    .replace(/\bavailable\b/gi,'հասանելի').replace(/\baway\b/gi,'հեռավորության վրա')
                    .replace(/\bCharging session\b/g,'Լիցքավորման սեսիա').replace(/\bReservation\b/g,'Ամրագրում');
            }
        }
        node.nodeValue=leading+core+trailing;
    });
}
function savePermissionState(){ try { localStorage.setItem('voltdrive.permissions',JSON.stringify(permissionState)); } catch (_) {} }
function permissionStatusLabel(value){ return value==='granted'?'Allowed':value==='denied'?'Not allowed':'Ask when needed'; }
function permissionCopy(type){
    if(type==='camera') return {title:'Camera permission required',body:'VoltDrive uses the camera only to scan charger QR codes. Manual charger-code entry remains available without camera access.',icon:'▦'};
    if(type==='notifications') return {title:'Notification permission required',body:'Allow push notifications for reservation reminders, charging completion and payment problems. In-app notifications remain available either way.',icon:'◌'};
    return {title:'Location permission required',body:'Location access is used to sort nearby charging stations and support arrival-aware actions. You can still search stations manually without it.',icon:'●'};
}
function askForPermission(type, returnScreen=screen, returnTab=activeTab){
    if(permissionState[type]==='granted') return true;
    permissionRequest={type,returnScreen,returnTab}; permissionMessage=''; screen='permission-request'; return false;
}
function restoreAfterPermission(){
    activeTab=permissionRequest.returnTab||activeTab; screen=permissionRequest.returnScreen||'account';
}
function permissionRequestScreen(){
    const type=permissionRequest.type||'location'; const copy=permissionCopy(type);
    return simpleHeaderBack('Permission required',type==='camera'?'QR scanning':type==='notifications'?'Charging alerts':'Nearby stations', `<section class="permission-hero ui-surface--dark"><span class="summary-check">${copy.icon}</span><small>VoltDrive permission</small><h2>${copy.title}</h2><p>${copy.body}</p></section>${permissionMessage?`<div class="ui-feedback ui-feedback--error">${permissionMessage}</div>`:''}<section class="ui-card info-note"><strong>You stay in control</strong><p>This prototype stores only the permission state. A production mobile build will connect these actions to the operating system permission APIs.</p></section><button class="ui-button ui-button--primary ui-button--block" data-permission-allow="${type}">Allow access</button><button class="ui-button ui-button--secondary ui-button--block" data-permission-deny="${type}">Not now</button>`, 'permission-return');
}
function useCurrentLocation(){
    showFavoritesOnly=false;mapQuery='';mapSort='distance';mapView='map';const visible=filteredStations();if(visible.length) selectedStation=visible[0];
}
function cardBrandFromNumber(value=''){
    const digits=String(value).replace(/\D/g,'');
    if(digits.startsWith('4')) return 'VISA';
    if(/^5[1-5]/.test(digits) || /^2(2[2-9]|[3-6]\d|7[01]|720)/.test(digits)) return 'MC';
    return 'CARD';
}
function onboardingCardRecord(){
    const digits=String(onboardingData.cardNumber||'').replace(/\D/g,'');
    if(digits.length<4) return null;
    return {id:Date.now()+1,brand:cardBrandFromNumber(digits),last4:digits.slice(-4),expiry:onboardingData.cardExpiry||'—',holder:onboardingData.cardholder||onboardingData.name||'',active:true};
}
function captureOnboardingRegionForm(){
    onboardingData.country=document.querySelector('#onboard-country')?.value||onboardingData.country;
    onboardingData.language=document.querySelector('#onboard-language')?.value||onboardingData.language;
}
function captureOnboardingVehicleForm(){
    onboardingData.vehicleBrand=document.querySelector('#onboard-brand')?.value||onboardingData.vehicleBrand;
    onboardingData.vehicleModel=document.querySelector('#onboard-model')?.value?.trim()||onboardingData.vehicleModel;
    onboardingData.plate=document.querySelector('#onboard-plate')?.value?.trim()||onboardingData.plate;
    onboardingData.connector=document.querySelector('#onboard-connector')?.value||onboardingData.connector;
}
function captureOnboardingPaymentForm(){
    onboardingData.cardNumber=document.querySelector('#onboard-card')?.value?.trim()||'';
    onboardingData.cardExpiry=document.querySelector('#onboard-expiry')?.value?.trim()||'';
    onboardingData.cardholder=document.querySelector('#onboard-cardholder')?.value?.trim()||onboardingData.name||'';
    const digits=onboardingData.cardNumber.replace(/\D/g,'');
    onboardingData.cardLast4=digits.length>=4?digits.slice(-4):'';
    onboardingData.cardBrand=digits.length>=4?cardBrandFromNumber(digits):'';
}
function primaryAction(state, atStation = false) {
    if (state === 'idle')
        return { label: 'Find a station', icon: 'pin', action: 'map' };
    if (state === 'reserved' && atStation)
        return { label: 'Start charging', icon: 'plug', action: 'start-reserved-charge' };
    if (state === 'reserved')
        return { label: 'Navigate to station', icon: 'nav', action: 'navigate' };
    if (state === 'charging')
        return { label: 'View charging session', icon: 'plug', action: 'active-charge' };
    return { label: 'View session summary', icon: 'history', action: 'summary' };
}
function chargingStepEnergy() {
    return charging.speed === 'Maximum' ? 0.52 : charging.speed === 'Balanced' ? 0.38 : 0.24;
}
function chargingLimitLabel(limit = chargeLimit) {
    if (limit.type === 'battery') return `${limit.battery}%`;
    if (limit.type === 'energy') return `${limit.energy} kWh`;
    if (limit.type === 'cost') return `${limit.cost.toLocaleString()} AMD`;
    if (limit.type === 'time') return `${limit.time} min`;
    return 'No limit';
}
function chargingLimitReached() {
    if (chargeLimit.type === 'battery') return charging.battery >= chargeLimit.battery;
    if (chargeLimit.type === 'energy') return charging.energy >= chargeLimit.energy;
    if (chargeLimit.type === 'cost') return charging.cost >= chargeLimit.cost;
    if (chargeLimit.type === 'time') return charging.minutes >= chargeLimit.time;
    return false;
}
function chargingAllowedEnergyStep(baseStep, price){
    let allowed=Math.max(0,Number(baseStep)||0);
    if(chargeLimit.type==='energy') allowed=Math.min(allowed,Math.max(0,Number(chargeLimit.energy)-charging.energy));
    if(chargeLimit.type==='cost') allowed=Math.min(allowed,Math.max(0,(Number(chargeLimit.cost)-charging.cost)/Math.max(1,Number(price)||1)));
    return Math.max(0,allowed);
}
function minimumBatteryTarget(currentBattery = charging.battery) {
    const current = Math.max(0, Math.min(100, Number(currentBattery) || 0));
    if (current >= 100) return 100;
    return Math.min(100, Math.max(70, Math.ceil((current + 1) / 5) * 5));
}
function chargingStartLimitIssue(limit = chargeLimit) {
    const current = Math.max(0, Math.min(100, Number(charging.battery) || 0));
    if (current >= 100) return 'The selected vehicle battery is already at 100%. Charging cannot be started.';
    if (limit.type === 'battery' && Number(limit.battery) <= current) {
        return `Charging target must be above the current battery level (${current}%). Choose at least ${minimumBatteryTarget(current)}%.`;
    }
    return '';
}
function chargingPowerForSpeed(speed = charging.speed, connector = null) {
    const resolvedConnector = connector || (activeChargingSession
        ? { power: activeChargingSession.maxPower }
        : selectedStationConnector(startCharge.connector));
    const connectorMax = Number(resolvedConnector?.power || selectedStation?.power || 142);
    const safeMax = Math.max(1, connectorMax);
    const simulatedMaximum = Math.min(142, safeMax);
    const factor = speed === 'Balanced' ? 0.68 : speed === 'Eco' ? 0.38 : 1;
    return Math.max(1, Math.min(safeMax, Math.round(simulatedMaximum * factor)));
}
function syncChargingPowerToConnector(connector = null) {
    charging.power = chargingPowerForSpeed(charging.speed, connector);
    return charging.power;
}
function chargingLimitCompletionReason() {
    if (chargeLimit.type === 'battery') return 'Battery limit reached';
    if (chargeLimit.type === 'energy') return 'Energy limit reached';
    if (chargeLimit.type === 'cost') return 'Cost limit reached';
    if (chargeLimit.type === 'time') return 'Time limit reached';
    return 'Stopped by driver';
}
function activeVehicleRecord() {
    return vehicles.find(v => v.active) || vehicles[0] || null;
}
function requireActiveVehicleForFlow(returnScreen = screen, returnTab = activeTab, message = 'Add a vehicle before reserving or starting a charging session.') {
    const vehicle = activeVehicleRecord();
    if (vehicle) return vehicle;
    stopChargingSimulation();
    activeChargingSession = null;
    pendingChargingVehicleId = null;
    pendingChargingReservationId = null;
    vehicleEditorReturn = { screen: returnScreen, tab: returnTab };
    vehicleEditorMessage = message;
    editingVehicleId = null;
    screen = 'add-vehicle';
    return null;
}
function vehicleDeletionBlockReason(vehicleId) {
    const id = Number(vehicleId);
    if (vehicles.length <= 1) return 'At least one vehicle is required for reservations and charging.';
    if (activeChargingSession?.vehicleId === id) return 'This vehicle is used by the active charging session. Finish the session before deleting it.';
    if (pendingChargingVehicleId === id && !['idle','completed','interrupted'].includes(startCharge.stage)) return 'This vehicle is being used by the current charging flow. Finish or leave the charging flow before deleting it.';
    const reservedVehicle = reservationVehicleRecord(activeReservation);
    if (activeReservation && reservedVehicle?.id === id) return 'This vehicle is linked to an active reservation. Cancel or complete the reservation before deleting it.';
    return '';
}
function chargingFlowVehicleRecord() {
    return vehicles.find(v => v.id === pendingChargingVehicleId) || activeVehicleRecord();
}
function chargingFlowReservationRecord() {
    if (!pendingChargingReservationId || !activeReservation || activeReservation.id !== pendingChargingReservationId) return null;
    return activeReservation;
}
function reservationVehicleRecord(r = activeReservation || reservation) {
    if (!r) return null;
    if (r.vehicleId != null) {
        const byId = vehicles.find(v => v.id === Number(r.vehicleId));
        if (byId) return byId;
    }
    const name = String(r.vehicle || '').split(' · ')[0].trim();
    return vehicles.find(v => v.name === name) || null;
}
function setReservationVehicle(vehicle, updateTarget = false) {
    if (!vehicle) return;
    reservation.vehicleId = vehicle.id;
    reservation.vehicle = vehicle.name;
    if (updateTarget) reservation.target = Number(vehicle.limit || reservation.target || 90);
}
function stationParkingBays(station = selectedStation) {
    if (!station?.parking) return [];
    const bays = {
      1: ['B-12','B-13','B-14'],
      2: ['C-04','C-05','C-06'],
      4: ['G-08','G-09','G-10'],
      5: ['K-03','K-04','K-05']
    };
    return bays[station.id] || [stationNavigationMeta[station.id]?.defaultBay || 'Charging bay'];
}
function reservationConnectorOptions(station = selectedStation, vehicle = reservationVehicleRecord(reservation) || activeVehicleRecord()) {
    if (!vehicle?.connector) return [];
    return stationConnectorRows(station).filter(connector => connector.status !== 'offline' && connector.type === vehicle.connector);
}
function availableCompatibleConnectors(station = selectedStation, vehicle = reservationVehicleRecord(reservation) || activeVehicleRecord()) {
    if (!vehicle?.connector) return [];
    return stationConnectorRows(station).filter(connector => connector.status === 'available' && connector.type === vehicle.connector);
}
function reservationCompatibilityIssue(type = reservation.type, station = selectedStation, vehicle = reservationVehicleRecord(reservation) || activeVehicleRecord()) {
    if (!vehicle) return 'Choose a vehicle for this reservation.';
    const compatible = reservationConnectorOptions(station, vehicle);
    if (!compatible.length) return `${station.name} has no reservable ${vehicle.connector} connector for ${vehicle.name}. Choose another vehicle or station.`;
    if (type === 'Parking bay' && !station.parking) return 'Parking-bay reservations are not available at this station.';
    return '';
}
function compatibleAlternativeStations(vehicle = reservationVehicleRecord(activeReservation || reservation) || activeVehicleRecord(), excludeStationId = selectedStation?.id) {
    if (!vehicle?.connector) return [];
    return stations.filter(station => station.id !== excludeStationId && availableCompatibleConnectors(station, vehicle).length > 0);
}
function syncReservationHardware() {
    const vehicle = reservationVehicleRecord(reservation) || activeVehicleRecord();
    const connectors = reservationConnectorOptions(selectedStation, vehicle);
    const bays = stationParkingBays(selectedStation);
    if (reservation.type === 'Parking bay' && !selectedStation.parking) reservation.type = 'Specific charger';
    if (reservation.type === 'Any available charger') {
        reservation.charger = '';
        reservation.bay = '';
        return;
    }
    if (reservation.type === 'Parking bay') {
        reservation.charger = '';
        reservation.bay = bays.includes(reservation.bay) ? reservation.bay : (bays[0] || '');
        return;
    }
    const current = connectors.find(connector => connector.id === String(reservation.charger));
    const selected = current || connectors.find(connector => connector.status === 'available') || connectors[0] || null;
    reservation.charger = selected?.id || '';
    if (selectedStation.parking) {
        const allRows = stationConnectorRows(selectedStation);
        const index = Math.max(0, allRows.findIndex(connector => connector.id === reservation.charger));
        reservation.bay = bays[Math.min(index, Math.max(0, bays.length - 1))] || bays[0] || '';
    } else {
        reservation.bay = '';
    }
}
function reservationHardwareLabel(r = reservation) {
    const station = reservationStation(r);
    if (r?.type === 'Any available charger') return station?.parking ? 'Charger & bay assigned on arrival' : 'Charger assigned on arrival';
    if (r?.type === 'Parking bay') return `Bay ${r.bay || 'to be selected'} · Charger assigned on arrival`;
    const bay = station?.parking && r?.bay ? ` · Bay ${r.bay}` : '';
    return `Charger ${r?.charger || 'to be selected'}${bay}`;
}
function reservationHardwareSelectionValid() {
    const vehicle = reservationVehicleRecord(reservation) || activeVehicleRecord();
    if (reservationCompatibilityIssue(reservation.type, selectedStation, vehicle)) return false;
    const compatible = reservationConnectorOptions(selectedStation, vehicle);
    if (reservation.type === 'Specific charger') return compatible.some(connector => connector.id === String(reservation.charger));
    if (reservation.type === 'Parking bay') return Boolean(reservation.bay);
    return reservation.type === 'Any available charger';
}
function resetReservationVehicleToActive() {
    setReservationVehicle(activeVehicleRecord(), true);
    syncReservationHardware();
}
function reservationVehicleMismatch(r = activeReservation) {
    const reservedVehicle = reservationVehicleRecord(r);
    const activeVehicle = activeVehicleRecord();
    return Boolean(reservedVehicle && activeVehicle && reservedVehicle.id !== activeVehicle.id);
}
function activateReservationVehicle(r = activeReservation) {
    const reservedVehicle = reservationVehicleRecord(r);
    if (!reservedVehicle) return null;
    vehicles.forEach(v => { v.active = v.id === reservedVehicle.id; });
    homeVehicleMenuOpen = false;
    return reservedVehicle;
}
function prepareNewChargingSession(vehicleOverride = null, reservationContext = null) {
    if (appState === 'charging' && activeChargingSession) return activeChargingSession;
    stopChargingSimulation();
    const vehicle = vehicleOverride || activeVehicleRecord();
    if (!vehicle) return null;
    pendingChargingVehicleId = vehicle.id;
    pendingChargingReservationId = reservationContext?.id || null;
    if (appState === 'completed') appState = activeReservation ? 'reserved' : 'idle';
    const reservedVehicle = reservationVehicleRecord(reservationContext);
    const reservationTarget = reservationContext && (!reservedVehicle || reservedVehicle.id === vehicle?.id) ? Number(reservationContext.target ?? reservation.target) : NaN;
    const preferredTarget = Number.isFinite(reservationTarget) ? reservationTarget : Number(vehicle?.limit ?? 90);
    const batteryTarget = Math.max(10, Math.min(100, preferredTarget || 90));
    activeChargingSession = null;
    chargeLimit = { ...chargeLimit, type: 'battery', battery: batteryTarget };
    chargeLimitDraft = null;
    charging = {
        battery: Number(vehicle?.battery ?? 0),
        target: batteryTarget,
        power: 142,
        energy: 0,
        cost: 0,
        minutes: 0,
        remaining: 0,
        speed: 'Maximum',
        paused: false
    };
    syncChargingPowerToConnector(selectedStationConnector(startCharge.connector));
    startCharge.stage = 'ready';
    startCharge.error = '';
    startCharge.accepted = true;
    startCharge.payment = paymentMethodLabel(defaultPaymentMethod());
    recalculateChargingRemaining();
    return vehicle;
}
function recalculateChargingRemaining() {
    if (chargeLimit.type === 'none') {
        charging.remaining = null;
        return;
    }
    if (chargeLimit.type === 'battery') {
        const speedFactor = charging.speed === 'Maximum' ? 1 : charging.speed === 'Balanced' ? 1.45 : 2.25;
        charging.remaining = Math.max(0, Math.ceil((chargeLimit.battery - charging.battery) * speedFactor));
        return;
    }
    if (chargeLimit.type === 'energy') {
        charging.remaining = Math.max(0, Math.ceil((chargeLimit.energy - charging.energy) / chargingStepEnergy()));
        return;
    }
    if (chargeLimit.type === 'cost') {
        const context = chargingSessionContext();
        const price = context.connector?.price || context.station.price || 120;
        const costPerStep = Math.max(1, chargingStepEnergy() * price);
        charging.remaining = Math.max(0, Math.ceil((chargeLimit.cost - charging.cost) / costPerStep));
        return;
    }
    charging.remaining = Math.max(0, chargeLimit.time - charging.minutes);
}
function chargingRingProgress() {
    if (chargeLimit.type === 'battery') {
        return Math.max(0, Math.min(1, (charging.battery - 20) / Math.max(1, chargeLimit.battery - 20)));
    }
    return Math.max(0, Math.min(1, charging.battery / 100));
}
function chargingOperationalStatus() {
    const remainingDetail = charging.remaining === null ? 'no automatic limit' : `${charging.remaining} min remaining`;
    if (charging.paused)
        return { label: 'Charging paused', detail: 'Session paused · cable remains connected' };
    if (charging.speed !== 'Maximum')
        return { label: 'Power reduced', detail: `${charging.power} kW · ${remainingDetail}` };
    return { label: 'Charging now', detail: remainingDetail === 'no automatic limit' ? 'No automatic limit · stop manually' : remainingDetail };
}
function captureActiveChargingSession() {
    const vehicle = vehicles.find(v => v.id === pendingChargingVehicleId) || vehicles.find(v => v.active) || vehicles[0];
    const connector = selectedStationConnector(startCharge.connector);
    syncChargingPowerToConnector(connector);
    if (chargeLimit.type === 'battery') charging.target = chargeLimit.battery;
    else charging.target = 100;
    activeChargingSession = {
        stationId: selectedStation.id,
        charger: connector?.id || startCharge.connector || '04',
        connector: connector?.type || selectedStation.connector || 'CCS2',
        maxPower: connector?.power || selectedStation.power,
        price: connector?.price || selectedStation.price,
        vehicleId: vehicle?.id,
        reservationId: pendingChargingReservationId,
        startBattery: charging.battery,
        started: demoClock(),
        powerCurve: [{ minute:0, power:charging.power, battery:charging.battery, energy:charging.energy }],
        limit: { ...chargeLimit }
    };
    recalculateChargingRemaining();
    return activeChargingSession;
}
function chargingSessionContext() {
    const stored = activeChargingSession;
    const station = (stored?.stationId && stations.find(s => s.id === stored.stationId)) || selectedStation;
    const vehicle = (stored?.vehicleId && vehicles.find(v => v.id === stored.vehicleId)) || vehicles.find(v => v.active) || vehicles[0];
    const connector = stored ? { id: stored.charger, type: stored.connector, power: stored.maxPower, price: stored.price } : selectedStationConnector(startCharge.connector);
    return { station, vehicle, connector, started: stored?.started || demoClock() };
}
function chargingLimitEstimate(connector = selectedStationConnector()) {
    const price = connector?.price || selectedStation.price || 120;
    if (chargeLimit.type === 'battery') {
        const remainingPercent = Math.max(0, chargeLimit.battery - charging.battery);
        return Math.round((charging.energy + remainingPercent * chargingStepEnergy()) * price);
    }
    if (chargeLimit.type === 'energy') return Math.round(chargeLimit.energy * price);
    if (chargeLimit.type === 'cost') return chargeLimit.cost;
    if (chargeLimit.type === 'time') {
        const remainingMinutes = Math.max(0, chargeLimit.time - charging.minutes);
        const estimatedEnergy = charging.energy + remainingMinutes * chargingStepEnergy();
        return Math.round(estimatedEnergy * price);
    }
    return null;
}
function updateChargingSummaryFromLiveState(status = 'Completed', reason = 'Target reached'){
    chargingSummary = {
        startBattery: activeChargingSession?.startBattery ?? chargingSummary.startBattery,
        endBattery: charging.battery,
        energy: Number(charging.energy.toFixed(1)),
        cost: charging.cost,
        duration: charging.minutes,
        status,
        reason
    };
}
function refreshChargingLiveUI(){
    if(screen !== 'charging') return;
    const circumference=339.3;
    const dash=(circumference*chargingRingProgress()).toFixed(1);
    const status=chargingOperationalStatus();
    const ring=document.querySelector('.charging-ring .ring-value');
    if(ring) ring.style.strokeDasharray=`${dash} ${circumference}`;
    const svg=document.querySelector('.charging-ring svg');
    if(svg) svg.setAttribute('aria-label',`Battery ${charging.battery} percent`);
    const copy=document.querySelector('.charging-ring .ring-copy');
    if(copy){
        const small=copy.querySelector('small');
        const strong=copy.querySelector('strong');
        const target=copy.querySelector('p');
        if(small) small.textContent=status.label;
        if(strong) strong.innerHTML=`${charging.battery}<span>%</span>`;
        if(target) target.textContent=chargeLimit.type==='battery' ? `Target ${chargeLimit.battery}%` : `Limit ${chargingLimitLabel()}`;
    }
    const metrics=document.querySelectorAll('.charging-metrics > div strong');
    if(metrics[0]) metrics[0].innerHTML=`${charging.paused?'0':charging.power} <span>kW</span>`;
    if(metrics[1]) metrics[1].innerHTML=`${charging.energy.toFixed(1)} <span>kWh</span>`;
    if(metrics[2]) metrics[2].innerHTML=`${charging.cost.toLocaleString()} <span>AMD</span>`;
    if(metrics[3]) metrics[3].innerHTML=charging.remaining===null?'Manual':`${charging.remaining} <span>min</span>`;
    const subtitle=document.querySelector('.topbar .micro');
    if(subtitle) subtitle.textContent=status.detail;
    const curvePower=document.querySelector('.charge-curve .section-heading > strong');
    if(curvePower) curvePower.textContent=`${charging.paused?'0':charging.power} kW`;
}
function stopChargingSimulation(){
    if(chargingSimulationTimer){
        clearInterval(chargingSimulationTimer);
        chargingSimulationTimer=null;
    }
}
function completeChargingAtCurrentLevel(showSummary = screen === 'charging', reason = 'Target reached'){
    const previousScreen=screen;
    const previousTab=activeTab;
    stopChargingSimulation();
    updateChargingSummaryFromLiveState('Completed', reason);
    if(!finalizeChargingSession('Completed', reason)){
        vehicleEditorReturn={screen:'charge-start',tab:'charge'};
        vehicleEditorMessage='Add a vehicle before starting a new charging session.';
        editingVehicleId=null;
        activeTab='charge';
        screen='add-vehicle';
        render();
        return;
    }
    if(showSummary){
        screen='charging-summary';
        activeTab='charge';
    } else {
        screen=previousScreen;
        activeTab=previousTab;
    }
    render();
}
function interruptChargingSession(reason = 'Charger connection lost during charging'){
    if(appState!=='charging' || !activeChargingSession) return;
    stopChargingSimulation();
    updateChargingSummaryFromLiveState('Interrupted', reason);
    if(!finalizeChargingSession('Interrupted', reason)){
        vehicleEditorReturn={screen:'charge-start',tab:'charge'};
        vehicleEditorMessage='Add a vehicle before starting a new charging session.';
        editingVehicleId=null;
        activeTab='charge';
        screen='add-vehicle';
        render();
        return;
    }
    activeTab='charge';
    screen='charging-summary';
    render();
}
function advanceChargingSimulation(){
    if(appState!=='charging' || startCharge.stage!=='charging' || !activeChargingSession){
        stopChargingSimulation();
        return;
    }
    if(charging.paused) return;
    if(charging.battery>=100){
        completeChargingAtCurrentLevel(screen === 'charging', 'Battery full');
        return;
    }
    if(chargingLimitReached()){
        completeChargingAtCurrentLevel(screen === 'charging', chargingLimitCompletionReason());
        return;
    }
    const context=chargingSessionContext();
    const price=context.connector?.price || context.station.price || 120;
    const baseEnergyStep=chargingStepEnergy();
    const energyStep=chargingAllowedEnergyStep(baseEnergyStep,price);
    if(energyStep<=0){
        completeChargingAtCurrentLevel(screen === 'charging', chargingLimitCompletionReason());
        return;
    }
    const batteryCeiling=chargeLimit.type==='battery'?chargeLimit.battery:100;
    const batteryDelta=baseEnergyStep>0 ? energyStep/baseEnergyStep : 0;
    charging.battery=Math.min(batteryCeiling,100,Number((charging.battery+batteryDelta).toFixed(1)));
    charging.energy=Number((charging.energy+energyStep).toFixed(3));
    charging.cost=Math.min(chargeLimit.type==='cost'?chargeLimit.cost:Number.MAX_SAFE_INTEGER,Math.round(charging.energy*price));
    charging.minutes+=1;
    activeChargingSession.powerCurve=activeChargingSession.powerCurve||[];
    activeChargingSession.powerCurve.push({minute:charging.minutes,power:charging.power,battery:charging.battery,energy:Number(charging.energy.toFixed(3))});
    recalculateChargingRemaining();
    refreshChargingLiveUI();
    if(charging.battery>=100 && chargeLimit.type!=='battery') completeChargingAtCurrentLevel(screen === 'charging', 'Battery full');
    else if(chargingLimitReached()) completeChargingAtCurrentLevel(screen === 'charging', chargingLimitCompletionReason());
}
function ensureChargingSimulation(){
    const shouldRun=appState==='charging' && startCharge.stage==='charging' && Boolean(activeChargingSession) && screen!=='charge-limit';
    if(shouldRun && !chargingSimulationTimer) chargingSimulationTimer=setInterval(advanceChargingSimulation,1800);
    if(!shouldRun) stopChargingSimulation();
}
function layout(content, title = `Good morning, ${profile.name.split(' ')[0] || 'Driver'}`, subtitle = `${demoDayLabel()}, ${demoClock()}`) {
    return `<div class="stage"><div class="phone-shell"><div class="noise"></div><header class="topbar"><div><p class="micro">${subtitle}</p><h1>${title}</h1></div><button class="icon-button" data-notifications aria-label="Open notifications">${icon('bell')}${notifications.some(n=>n.unread)?'<i class="notification-dot"></i>':''}</button></header><main class="content">${content}</main>${bottomNav()}</div><aside class="prototype-notes"><div class="brand-mark"><span>${icon('shield')}</span><span>VoltDrive</span></div><h2>Driver app prototype</h2><p>Complete driver prototype with reservation and end-to-end charging start flow.</p><div class="note-card"><strong>Current tab</strong><span>${activeTab}</span></div><div class="note-card"><strong>Current screen</strong><span>${screen}</span></div><div class="note-card"><strong>Selected station</strong><span>${selectedStation.name}</span></div><div class="note-card"><strong>Design principle</strong><span>One dominant action per state</span></div><button class="ui-button ui-button--secondary ui-button--block" data-open-prototype-tools>Open prototype tools</button></aside></div>`;
}
function bottomNav() {
    const tabs = [['home', 'Home', 'home'], ['map', 'Stations', 'map'], ['charge', 'Scan', 'zap'], ['activity', 'Sessions', 'history'], ['account', 'Account', 'account']];
    return `<nav class="bottom-nav">${tabs.map(([id, label, ico]) => `<button data-tab="${id}" class="${activeTab === id ? 'active' : ''}"><span>${icon(ico)}</span><small>${label}</small></button>`).join('')}</nav>`;
}
function homeScreen() {
    const sessionContext = appState === 'charging' ? chargingSessionContext() : null;
    const activeVehicle = sessionContext?.vehicle || vehicles.find(v=>v.active) || vehicles[0];
    const reservedStation = activeReservation ? reservationStation(activeReservation) : null;
    const atStation = appState === 'reserved' && Boolean(reservedStation) && stationPresenceConfirmed(reservedStation);
    const stateBattery = appState === 'charging' ? charging.battery : (activeVehicle?.battery ?? stateMeta[appState].battery);
    const meta = {
        ...stateMeta[appState],
        battery: stateBattery,
        label: atStation ? 'Ready to start' : stateMeta[appState].label,
        eyebrow: atStation ? (() => { const assignment = navigationAssignment(); return assignment.connectorId ? `At station · Charger ${assignment.connectorId} ready` : 'At station · assignment pending'; })() : appState === 'charging' ? chargingOperationalStatus().detail : stateMeta[appState].eyebrow
    };
    const primary = primaryAction(appState, atStation);
    const scenario = homeScenario;
    const telemetrySource = appState === 'charging' ? 'Session estimate' : 'Last reported';
    const range = Math.round((meta.battery || 0) * 5.02);
    if (scenario === 'loading') return layout(`<section class="home-skeleton"><div class="skeleton skeleton-hero"></div><div class="skeleton skeleton-action"></div><div class="skeleton-grid"><div class="skeleton"></div><div class="skeleton"></div></div><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div></section>`);
    if (scenario === 'no-vehicle') return layout(`<section class="home-empty-state ui-card"><span class="home-empty-icon">${icon('car')}</span><small>Vehicle garage</small><h2>Add your first electric vehicle</h2><p>We use its connector, battery size and charging limit to show compatible chargers and better estimates.</p><button class="ui-button ui-button--primary ui-button--block" data-add-vehicle>Add vehicle</button></section><section class="home-helper-card"><span>${icon('shield')}</span><div><strong>Why this is required</strong><p>Your vehicle prevents incompatible connector reservations.</p></div></section>`);
    const lowBattery = scenario === 'low-battery';
    const offline = scenario === 'offline';
    const noPayment = scenario === 'no-payment';
    const stationUnavailable = scenario === 'station-unavailable';
    const displayBattery = lowBattery ? 12 : meta.battery;
    const displayRangeKm = lowBattery ? 58 : range;
    const displayRange = formatRangeKm(displayRangeKm);
    const warning = lowBattery ? `<section class="home-alert home-alert--warning"><span>!</span><div><strong>Low battery · ${displayBattery}%</strong><p>Your last reported range estimate is ${displayRange}. A fast charger is available ${formatDistanceKm(2.4)} away.</p></div><button data-primary="map">Find station</button></section>` : offline ? `<section class="home-alert"><span>↯</span><div><strong>You are offline</strong><p>Live charger availability may be outdated. Saved reservations and station details remain available.</p></div><button data-retry-home>Retry</button></section>` : noPayment ? `<section class="home-alert home-alert--warning"><span>${icon('card')}</span><div><strong>Add a payment method</strong><p>A card or wallet balance is required before starting a public charging session.</p></div><button data-manage-payments>Add card</button></section>` : stationUnavailable ? `<section class="home-alert home-alert--danger"><span>!</span><div><strong>Your nearest station became unavailable</strong><p>Northern Avenue Hub is temporarily offline. We found two nearby alternatives.</p></div><button data-show-alternatives>Alternatives</button></section>` : '';
    const homeStation = sessionContext?.station || stations[0];
    const homeConnector = sessionContext?.connector;
    const homeStationLive = stationLiveMeta(homeStation);
    const stationCard = stationUnavailable ? `<section class="home-alternatives"><div class="section-heading"><div><small>Recommended alternatives</small><h2>Available nearby</h2></div></div>${stations.filter(s=>s.available>0 && s.id!==1).slice(0,2).map(s=>`<button class="home-alternative" data-open-station-alt="${s.id}"><span class="map-result-status status-${s.status}">${s.available}</span><span><strong>${s.name}</strong><small>${formatDistanceKm(s.distanceKm)} · ${s.power} kW · ${s.price} AMD/kWh</small></span><span>${icon('chevron')}</span></button>`).join('')}</section>` : `<button class="info-card station-card card-button" data-open-station="${homeStation.id}"><div class="section-heading"><div><small>${appState==='charging'?'Active charging station':'Nearest station'}</small><h2>${homeStation.name}</h2></div><span class="distance-pill">${formatDistanceKm(homeStation.distanceKm)}</span></div><div class="station-visual"><span>${icon('pin')}</span><div class="station-lines"><span></span><span></span><span></span></div><span>${icon('zap')}</span></div><div class="station-stats"><span><i></i>${appState==='charging'?`Charger ${homeConnector?.id || startCharge.connector}`:offline?'Availability unknown':`${homeStationLive.available} available${homeStationLive.chargingHere?' · charging by you':homeStationLive.reservedHere?' · reserved by you':''}`}</span><span>Up to ${homeConnector?.power || homeStation.power} kW</span><span>${homeConnector?.price || homeStation.price} AMD/kWh</span></div></button>`;
    const quickGrid = appState === 'charging' ? `<div class="quick-grid"><div class="quick-card"><span class="quick-icon">${icon('zap')}</span><span><small>${charging.paused?'Session status':'Current power'}</small><strong>${charging.paused?'Paused':charging.power+' kW'}</strong></span></div><div class="quick-card"><span class="quick-icon">${icon('wallet')}</span><span><small>Session cost</small><strong>${charging.cost.toLocaleString()} AMD</strong></span></div></div>` : `<div class="quick-grid"><button class="quick-card" data-scan-charger><span class="quick-icon">${icon('qr')}</span><span><small>Quick start</small><strong>Scan charger</strong></span></button><button class="quick-card" data-add-funds><span class="quick-icon">${icon('wallet')}</span><span><small>Wallet</small><strong>${noPayment?'Add payment':walletBalance.toLocaleString()+' AMD'}</strong></span></button></div>`;
    const reservationInfo = activeReservation || reservation;
    const reservationStatusLine = appState === 'reserved' ? (atStation ? (() => { const assignment = navigationAssignment(); return assignment.connectorId ? `Arrived · Charger ${assignment.connectorId}${selectedStation.parking?` · Bay ${assignment.bay}`:''}` : 'Arrived · assignment pending'; })() : `Starts in ${activeReservation?.countdownMinutes ?? 18} min · ${reservationHardwareLabel(reservationInfo)}`) : 'Reserve a charger before arrival';
    const reservationCard = `<button class="info-card reservation-card card-button" data-home-reservation><div class="reservation-icon">${icon('clock')}</div><div><small>${appState === 'reserved' ? 'Active reservation' : 'Next availability'}</small><h3>${appState === 'reserved' ? `${reservationInfo.date}, ${reservationInfo.time}` : 'No reservation'}</h3><p>${reservationStatusLine}</p></div><span>${icon('chevron')}</span></button>`;
    return layout(`${warning}<section class="hero-card state-${appState} ${lowBattery?'is-low-battery':''}"><div class="hero-topline"><div><span class="status-dot"></span><span>${lowBattery?'Charge recommended':offline?'Last synced 9 min ago':meta.eyebrow}</span></div><button class="vehicle-switcher" data-toggle-home-vehicles>${activeVehicle?.name || 'Choose vehicle'} ${icon('chevron')}</button></div>${homeVehicleMenuOpen?`<div class="home-vehicle-menu">${vehicles.map(v=>`<button data-home-vehicle="${v.id}" class="${v.active?'is-selected':''}"><span class="mini-car">${icon('car')}</span><span><strong>${v.name}</strong><small>${v.plate} · ${v.battery}% · Last reported</small></span><b>${v.active?'✓':''}</b></button>`).join('')}<button data-add-vehicle><span>＋</span><span><strong>Add another vehicle</strong><small>Register a compatible EV</small></span></button></div>`:''}<div class="car-stage"><div class="energy-orbit"></div><div class="car-silhouette">${icon('car')}</div></div><div class="battery-row"><div><div class="battery-number">${displayBattery}<span>%</span></div><p>${lowBattery?'Low battery':meta.label}</p></div><div class="range-block"><strong>${displayRange}</strong><span>${telemetrySource} · estimated range</span></div></div><div class="charge-track"><span style="width:${displayBattery}%"></span></div><div class="vehicle-meta"><span>${activeVehicle?.plate||'—'}</span><span>Limit ${activeVehicle?.limit||90}%</span><span>${activeVehicle?.connector||'CCS2'}</span></div></section><button class="primary-action" data-primary="${lowBattery?'map':primary.action}"><span class="primary-icon">${icon(lowBattery?'zap':primary.icon)}</span><span><small>Recommended action</small><strong>${lowBattery?'Charge nearby':primary.label}</strong></span><span>${icon('chevron')}</span></button>${quickGrid}${stationCard}${reservationCard}<section class="insight-card"><span>${icon('sparkle')}</span><div><strong>Smart recommendation</strong><p>${lowBattery?'Northern Avenue Hub can add about ${formatRangeKm(250)} in 22 minutes.':'Charging after 22:00 can reduce your estimated cost by 18%.'}</p></div></section>`);
}

function activeReservationStationId() {
    if (!activeReservation || activeReservation.status && activeReservation.status !== 'Confirmed') return null;
    return Number(activeReservation.stationId || stations.find(s => s.name === activeReservation.stationName || s.name === activeReservation.place)?.id || 0) || null;
}
function activeReservationConnectorId(station) {
    if (!activeReservation || activeReservationStationId() !== station.id) return null;
    if (activeReservation.type === 'Specific charger' && activeReservation.charger) return String(activeReservation.charger);
    const assignment = navigationState.source === 'reservation' && navigationState.arrivalConfirmed ? navigationState.assignment : null;
    if (assignment?.stationId === station.id && assignment.connectorId) return String(assignment.connectorId);
    return null;
}
function activeChargingConnectorId(station) {
    if (appState !== 'charging' || !activeChargingSession || Number(activeChargingSession.stationId) !== station.id) return null;
    return String(activeChargingSession.charger || '');
}
function stationLiveConnectorRows(station) {
    const reservedId = activeReservationConnectorId(station);
    const chargingId = activeChargingConnectorId(station);
    return stationConnectorRows(station).map(row => {
        if (chargingId && String(row.id) === chargingId) return { ...row, status:'busy-own', state:'Charging by you', userState:'charging' };
        if (reservedId && String(row.id) === reservedId) return { ...row, status:'reserved-own', state:'Reserved by you', userState:'reserved' };
        return row;
    });
}
function stationLiveMeta(station) {
    const baseRows = stationConnectorRows(station);
    const reservedId = activeReservationConnectorId(station);
    const chargingId = activeChargingConnectorId(station);
    const userOccupied = new Set([reservedId, chargingId].filter(Boolean));
    let takenFromFree = 0;
    userOccupied.forEach(id => {
        const base = baseRows.find(row => String(row.id) === String(id));
        if (base?.status === 'available') takenFromFree += 1;
    });
    const reservedHere = activeReservationStationId() === station.id;
    if (reservedHere && !reservedId && activeReservation?.type === 'Any available charger' && Number(station.available || 0) > 0) takenFromFree += 1;
    const baseAvailable = baseRows.filter(row=>row.status==='available').length;
    const available = Math.max(0, baseAvailable - takenFromFree);
    const chargingHere = Boolean(chargingId);
    return {
        available,
        status: reservedHere || chargingHere ? 'reserved' : station.status,
        reservedHere,
        chargingHere
    };
}

function filteredStations() {
    const query = mapQuery.trim().toLowerCase();
    const activeVehicle = vehicles.find(v => v.active) || vehicles[0];
    let result = stations.filter(s => {
        const live = stationLiveMeta(s);
        return (!showFavoritesOnly || favoriteStations.has(s.id))
        && (!query || `${s.name} ${s.address} ${(s.connectors || [s.connector]).join(' ')} ${s.network || ''} ${(s.facilities || []).join(' ')}`.toLowerCase().includes(query))
        && (!mapFilters.available || live.available > 0 || live.reservedHere)
        && (!mapFilters.fast || s.power >= 120)
        && (!mapFilters.reservable || s.reservable)
        && (!mapFilters.parking || s.parking)
        && (mapFilters.connector === 'all' || (s.connectors || [s.connector]).includes(mapFilters.connector))
        && (mapFilters.currentType === 'all' || (s.currentTypes || []).includes(mapFilters.currentType))
        && (!mapFilters.minPower || s.power >= mapFilters.minPower)
        && (!mapFilters.open24 || s.open === '24/7')
        && (!mapFilters.voltDriveOnly || s.network === 'VoltDrive')
        && (!mapFilters.compatible || !activeVehicle?.connector || (s.connectors || [s.connector]).includes(activeVehicle.connector))
        && s.price <= mapFilters.maxPrice;
    });
    return [...result].sort((a,b) => mapSort === 'price' ? a.price-b.price
        : mapSort === 'power' ? b.power-a.power
        : mapSort === 'availability' ? (stationLiveMeta(b).available-stationLiveMeta(a).available || a.distanceKm-b.distanceKm)
        : mapSort === 'rating' ? (b.rating-a.rating || a.distanceKm-b.distanceKm)
        : a.distanceKm-b.distanceKm);
}

function stationListCard(s) {
    const favorite = favoriteStations.has(s.id);
    const live = stationLiveMeta(s);
    return `<article class="map-result-card ${selectedStation.id===s.id?'is-selected':''}">
      <button class="map-result-main" data-station="${s.id}">
        <span class="map-result-status status-${live.status}">${live.available}</span>
        <span><small>${formatDistanceKm(s.distanceKm)} · ${s.eta}</small><strong>${s.name}</strong><em>${live.chargingHere?'Charging by you · ':live.reservedHere?'Reserved by you · ':''}${s.address}</em></span>
        <span class="map-result-meta"><small>${s.price} AMD/kWh</small><strong>${s.power} kW</strong><em>${live.available}/${s.total} free</em></span>
      </button>
      <div class="map-result-actions"><button class="ui-text-button" data-favorite-station="${s.id}">${favorite?'★ Saved':'☆ Save'}</button><button class="ui-text-button" data-open-location="${s.id}">Details ›</button></div>
    </article>`;
}
function stationConnectorSeedRows(s) {
    const rows = {
      1: [
        { id:'04', type:'CCS2', power:180, price:120, status:'available', state:'Available now', speed:'Ultra-fast' },
        { id:'07', type:'CCS2', power:120, price:110, status:'available', state:'Available now', speed:'Fast' },
        { id:'02', type:'Type 2', power:22, price:95, status:'busy', state:'In use · 34 min left', speed:'AC' }
      ],
      2: [
        { id:'04', type:'CCS2', power:120, price:110, status:'available', state:'Available now', speed:'Fast' },
        { id:'07', type:'CCS2', power:90, price:105, status:'busy', state:'In use · 18 min left', speed:'Fast' },
        { id:'02', type:'CCS2', power:60, price:100, status:'busy', state:'Reserved', speed:'DC' }
      ],
      3: [
        { id:'04', type:'CCS2', power:240, price:135, status:'available', state:'Available now', speed:'Ultra-fast' },
        { id:'07', type:'CCS2', power:150, price:125, status:'available', state:'Available now', speed:'Ultra-fast' },
        { id:'02', type:'CHAdeMO', power:50, price:115, status:'busy', state:'In use · 22 min left', speed:'DC' }
      ],
      4: [
        { id:'04', type:'CCS2', power:60, price:95, status:'offline', state:'Offline', speed:'DC' },
        { id:'07', type:'Type 2', power:22, price:85, status:'offline', state:'Offline', speed:'AC' },
        { id:'02', type:'CCS2', power:60, price:95, status:'offline', state:'Offline', speed:'DC' }
      ],
      5: [
        { id:'04', type:'CCS2', power:150, price:105, status:'available', state:'Available now', speed:'Ultra-fast' },
        { id:'07', type:'CCS2', power:120, price:100, status:'available', state:'Available now', speed:'Fast' },
        { id:'02', type:'CCS2', power:60, price:95, status:'available', state:'Available now', speed:'DC' }
      ]
    };
    return rows[s.id] || [{ id:'04', type:s.connector || 'CCS2', power:s.power, price:s.price, status:s.available>0?'available':'offline', state:s.available>0?'Available now':'Offline', speed:s.power>=150?'Ultra-fast':s.power>=100?'Fast':'DC' }];
}
function stationConnectorRows(s) {
    const seed=stationConnectorSeedRows(s).map(row=>({...row}));
    const targetTotal=Math.max(seed.length,Number(s.total)||seed.length);
    const targetAvailable=s.status==='offline'?0:Math.max(0,Math.min(targetTotal,Number(s.available)||0));
    let availableNow=seed.filter(row=>row.status==='available').length;
    const types=(s.connectors&&s.connectors.length?s.connectors:[s.connector||'CCS2']);
    for(let i=seed.length;i<targetTotal;i++){
        const type=types[i%types.length]||'CCS2';
        const available=availableNow<targetAvailable;
        if(available) availableNow+=1;
        const power=type==='Type 2'?22:Math.min(Number(s.power)||60, i%3===0?60:Number(s.power)||60);
        seed.push({id:String(10+i).padStart(2,'0'),type,power,price:Number(s.price)||100,status:available?'available':(s.status==='offline'?'offline':'busy'),state:available?'Available now':(s.status==='offline'?'Offline':'In use'),speed:type==='Type 2'?'AC':power>=150?'Ultra-fast':power>=100?'Fast':'DC'});
    }
    return seed;
}
function selectedStationConnector(id = startCharge.connector) {
    return stationConnectorRows(selectedStation).find(c => c.id === id) || stationConnectorRows(selectedStation)[0];
}
function chargerCodeForConnector(connector, station = selectedStation) {
    const type = String(connector?.type || 'CCS2').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const connectorId = connector?.id || '04';
    // Northern Avenue keeps the original demo code; every other station receives
    // a station-qualified hardware code so scanning can resolve the station globally.
    const hardwareId = station?.id === 1 ? connectorId : `${station?.id || 0}${connectorId}`;
    return `VD-${hardwareId}-${type}`;
}
function resolveChargerCode(code) {
    const normalized = String(code || '').trim().toUpperCase().replace(/\s+/g, '');
    for (const station of stations) {
        const connector = stationConnectorRows(station).find(item => chargerCodeForConnector(item, station) === normalized);
        if (connector) return { station, connector };
    }
    return null;
}
function connectorFromChargerCode(code) {
    return resolveChargerCode(code)?.connector || null;
}
function compatibleStartConnectors() {
    const activeVehicle = chargingFlowVehicleRecord();
    return stationConnectorRows(selectedStation).filter(connector => connector.status === 'available' && (!activeVehicle?.connector || connector.type === activeVehicle.connector));
}
function latestRecentCharger() {
    const session = sessions.find(item => item.status === 'Completed' && stations.some(station => station.name === item.place));
    if (!session) return null;
    const station = stations.find(item => item.name === session.place);
    if (!station) return null;
    const rows = stationConnectorRows(station);
    const connector = rows.find(item => item.id === String(session.charger) && item.type === session.connector) || rows.find(item => item.id === String(session.charger)) || rows[0];
    if (!connector) return null;
    return { session, station, connector };
}
function plugChargeStartStatus(vehicle, connector) {
    if (!vehicle || !connector) return 'Unavailable';
    if (connector.type !== 'CCS2') return 'Unavailable on this connector';
    if (plugCharge.enabled && plugCharge.supported && plugCharge.vehicleId === vehicle.id) return 'Active · prototype certificate';
    if (plugCharge.enabled && plugCharge.vehicleId !== vehicle.id) return 'Active for another vehicle';
    return 'Inactive · QR/RFID/app';
}
function stationAmenity(item) {
    const key = item === 'Parking' ? 'parking' : item === 'Coffee' ? 'coffee' : item === 'Wi-Fi' ? 'wifi' : 'card';
    return `<div><span>${icon(key)}</span><small>${item}</small></div>`;
}
function rememberMapSearch(value) {
    const query = String(value || '').trim();
    if (query.length < 2) return;
    recentMapSearches = [query, ...recentMapSearches.filter(item => item.toLowerCase() !== query.toLowerCase())].slice(0, 4);
}
function mapScreen() {
    const results = filteredStations();
    if (results.length && !results.some(s => s.id === selectedStation.id)) selectedStation = results[0];
    const chips = [
      ['available','Available now'], ['fast','120+ kW'], ['reservable','Reservable'], ['parking','Parking']
    ];
    const recentSearches = recentMapSearches.length ? `<div class="map-recent-row"><small>Recent</small><div class="filter-row">${recentMapSearches.map(query => `<button data-recent-map-search="${query.replace(/"/g,'&quot;')}">${query}</button>`).join('')}</div><button class="ui-text-button" data-clear-recent-searches>Clear</button></div>` : '';
    const controls = `<section class="map-toolbar">
      <div class="search-box"><span>${icon('search')}</span><input data-map-search value="${mapQuery}" placeholder="Search station or address" aria-label="Search location"/><button data-open-map-filters aria-label="Open filters">${icon('filter')}</button></div>
      ${!mapQuery ? recentSearches : ''}
      <div class="map-view-row"><div class="ui-segment-grid map-view-switch"><button data-map-view="map" class="${mapView==='map'?'is-selected':''}">Map</button><button data-map-view="list" class="${mapView==='list'?'is-selected':''}">List</button></div><select data-map-sort aria-label="Sort stations"><option value="distance" ${mapSort==='distance'?'selected':''}>Nearest</option><option value="price" ${mapSort==='price'?'selected':''}>Lowest price</option><option value="power" ${mapSort==='power'?'selected':''}>Highest power</option><option value="availability" ${mapSort==='availability'?'selected':''}>Most available</option><option value="rating" ${mapSort==='rating'?'selected':''}>Best rated</option></select></div>
      <div class="filter-row"><button data-use-current-location>◉ Current location</button>${chips.map(([key,label]) => `<button data-quick-filter="${key}" class="${mapFilters[key]?'active':''}">${label}</button>`).join('')}</div>
    </section>`;
    const empty = `<section class="map-empty"><span>${icon('pin')}</span><h2>No matching chargers</h2><p>Try removing a filter or searching another district.</p><button class="ui-button ui-button--secondary" data-clear-map-filters>Clear filters</button></section>`;
    if (mapView === 'list') return layout(`${controls}<section class="map-results-summary"><div><small>Live network</small><h2>${results.length} stations found</h2></div><button class="ui-text-button ${showFavoritesOnly?'is-active':''}" data-open-favorites>${showFavoritesOnly?'Show all':`Saved ${favoriteStations.size}`}</button></section>${results.length?`<section class="map-results-list">${results.map(stationListCard).join('')}</section>`:empty}`, 'Find a charger', 'Search, compare and reserve');
    return layout(`${controls}${results.length?`<section class="map-canvas"><div class="map-grid"></div><div class="route-line"></div>${results.map(s => { const live=stationLiveMeta(s); return `<button class="map-pin status-${live.status} ${selectedStation.id === s.id ? 'selected' : ''}" data-station="${s.id}" style="left:${s.x}%;top:${s.y}%" aria-label="${s.name}: ${live.available} connectors available${live.chargingHere?', charging by you':live.reservedHere?', reserved by you':''}" title="${live.available} connectors available${live.chargingHere?' · Charging by you':live.reservedHere?' · Reserved by you':''}"><span>${live.available}</span></button>`; }).join('')}<div class="user-location">◉</div><div class="map-legend"><span><i class="available"></i>Free</span><span><i class="reserved"></i>Reserved by you</span><span><i class="busy"></i>Busy</span><span><i class="offline"></i>Offline</span></div></section><section class="station-sheet"><div class="sheet-handle"></div><div class="section-heading"><div><small>${selectedStation.eta} away</small><h2>${selectedStation.name}</h2><p>${selectedStation.address}</p></div><button class="favorite-round ${favoriteStations.has(selectedStation.id)?'is-favorite':''}" data-favorite-station="${selectedStation.id}">${favoriteStations.has(selectedStation.id)?'★':'☆'}</button></div><div class="station-score"><span>${icon('star')} ${selectedStation.rating}</span><span><i></i>${stationLiveMeta(selectedStation).available} of ${selectedStation.total} available${stationLiveMeta(selectedStation).chargingHere?' · charging by you':stationLiveMeta(selectedStation).reservedHere?' · reserved by you':''}</span></div><div class="spec-grid"><div><small>Power</small><strong>${selectedStation.power} kW</strong></div><div><small>Price</small><strong>${selectedStation.price} AMD</strong></div><div><small>Connector</small><strong>${selectedStation.connector}</strong></div></div><button class="primary-action compact" data-open-selected><span class="primary-icon">${icon('zap')}</span><span><small>View availability</small><strong>Open station details</strong></span><span>${icon('chevron')}</span></button></section>`:empty}`, 'Find a charger', 'Live availability nearby');
}
function mapFiltersScreen() {
    const activeVehicle = vehicles.find(v => v.active) || vehicles[0];
    return layout(`<button class="ui-back ui-back--inline" data-simple-back="map">${icon('back')}</button><section class="filter-panel"><div class="section-heading"><div><small>Discovery preferences</small><h2>Map filters</h2></div><button class="ui-text-button" data-clear-map-filters>Reset</button></div>
      <label class="ui-list-item security-toggle"><span class="ui-list-icon">✓</span><span><small>Availability</small><strong>Available now</strong><em>Hide stations without a free connector</em></span><input class="ui-switch" type="checkbox" data-map-filter-toggle="available" ${mapFilters.available?'checked':''}></label>
      <label class="ui-list-item security-toggle"><span class="ui-list-icon">ϟ</span><span><small>Charging speed</small><strong>Fast charging only</strong><em>120 kW and above</em></span><input class="ui-switch" type="checkbox" data-map-filter-toggle="fast" ${mapFilters.fast?'checked':''}></label>
      <label class="ui-form"><span>Connector type</span><select data-map-filter-select="connector"><option value="all" ${mapFilters.connector==='all'?'selected':''}>Any connector</option><option value="CCS2" ${mapFilters.connector==='CCS2'?'selected':''}>CCS2</option><option value="CHAdeMO" ${mapFilters.connector==='CHAdeMO'?'selected':''}>CHAdeMO</option><option value="Type 2" ${mapFilters.connector==='Type 2'?'selected':''}>Type 2</option></select></label>
      <label class="ui-form"><span>Charging type</span><select data-map-filter-select="currentType"><option value="all" ${mapFilters.currentType==='all'?'selected':''}>AC or DC</option><option value="DC" ${mapFilters.currentType==='DC'?'selected':''}>DC</option><option value="AC" ${mapFilters.currentType==='AC'?'selected':''}>AC</option></select></label>
      <label class="ui-form"><span>Minimum power</span><select data-map-filter-select="minPower"><option value="0" ${Number(mapFilters.minPower)===0?'selected':''}>Any power</option><option value="60" ${Number(mapFilters.minPower)===60?'selected':''}>60+ kW</option><option value="120" ${Number(mapFilters.minPower)===120?'selected':''}>120+ kW</option><option value="150" ${Number(mapFilters.minPower)===150?'selected':''}>150+ kW</option></select></label>
      <label class="ui-list-item security-toggle"><span class="ui-list-icon">◷</span><span><small>Booking</small><strong>Reservable stations</strong><em>Show stations that accept reservations</em></span><input class="ui-switch" type="checkbox" data-map-filter-toggle="reservable" ${mapFilters.reservable?'checked':''}></label>
      <label class="ui-list-item security-toggle"><span class="ui-list-icon">P</span><span><small>Facilities</small><strong>Parking available</strong><em>Charging bay with parking access</em></span><input class="ui-switch" type="checkbox" data-map-filter-toggle="parking" ${mapFilters.parking?'checked':''}></label>
      <label class="ui-list-item security-toggle"><span class="ui-list-icon">24</span><span><small>Access</small><strong>Open 24/7</strong><em>Only stations with round-the-clock access</em></span><input class="ui-switch" type="checkbox" data-map-filter-toggle="open24" ${mapFilters.open24?'checked':''}></label>
      <label class="ui-list-item security-toggle"><span class="ui-list-icon">V</span><span><small>Network</small><strong>VoltDrive only</strong><em>Hide roaming-partner locations</em></span><input class="ui-switch" type="checkbox" data-map-filter-toggle="voltDriveOnly" ${mapFilters.voltDriveOnly?'checked':''}></label>
      <label class="ui-list-item security-toggle"><span class="ui-list-icon">▱</span><span><small>Vehicle</small><strong>Compatible with ${activeVehicle?.name || 'selected vehicle'}</strong><em>${activeVehicle?.connector || 'Connector'} compatibility</em></span><input class="ui-switch" type="checkbox" data-map-filter-toggle="compatible" ${mapFilters.compatible?'checked':''}></label>
      <label class="ui-form"><span>Maximum price <strong id="map-price-value">${mapFilters.maxPrice} AMD/kWh</strong></span><input type="range" min="90" max="160" step="5" value="${mapFilters.maxPrice}" data-map-price></label>
      <button class="ui-button ui-button--primary ui-button--block" data-apply-map-filters>Show ${filteredStations().length} stations</button>
    </section>`, 'Filters', 'Refine charging locations');
}

function stationPresenceConfirmed(station = selectedStation) {
    const assignment = navigationState.assignment;
    return Boolean(
        navigationState.arrived &&
        navigationState.arrivalConfirmed &&
        assignment?.stationId === station?.id
    );
}

function locationScreen() {
    const s = selectedStation;
    const connectors = stationLiveConnectorRows(s);
    const locationVehicle = activeVehicleRecord();
    const atStation = stationPresenceConfirmed(s);
    const firstAvailable = connectors.find(c => c.status === 'available' && (!locationVehicle?.connector || c.type === locationVehicle.connector));
    const estimate = Math.round(39 * s.price);
    const connectorList = connectors.map((c, index) => {
        const available=c.status==='available';
        const compatible=!locationVehicle?.connector || c.type===locationVehicle.connector;
        const startable=available && compatible && atStation;
        const ownState=c.userState==='reserved'?'Reserved by you':c.userState==='charging'?'Charging by you':'';
        const stateLabel=available?(compatible?(atStation?'Ready to start':'Available'):`Not compatible`):c.status==='offline'?'Offline':ownState||'Busy';
        const ownClass=c.userState==='reserved'?'user-reserved ':c.userState==='charging'?'user-charging ':'';
        const unavailableClass=!startable && !c.userState?'disabled ':'';
        const firstStartableIndex=connectors.findIndex(x=>x.status==='available' && (!locationVehicle?.connector || x.type===locationVehicle.connector));
        return `<button class="charger-row ${startable && index===firstStartableIndex?'selected ':''}${ownClass}${unavailableClass}ui-on-dark" ${startable?`data-start-with-connector="${c.id}"`:''}><span class="charger-number">${c.id}</span><span><small>${c.type} · ${c.state}</small><strong>${c.power} kW ${c.speed}</strong></span><span><small>${c.price} AMD/kWh</small><strong>${stateLabel}</strong></span></button>`;
    }).join('');
    const amenities = (s.facilities || []).map(stationAmenity).join('');
    const compatibleAvailableCount = connectors.filter(c => c.status === 'available' && (!locationVehicle?.connector || c.type === locationVehicle.connector)).length;
    const reserveAction = s.reservable ? `<button class="primary-action reserve-action" data-reserve><span class="primary-icon">${icon('clock')}</span><span><small>${firstAvailable?`Charger ${firstAvailable.id}`:`Find ${locationVehicle?.connector || 'compatible'} slot`} · Today</small><strong>Reserve for 11:30</strong></span><span>${icon('chevron')}</span></button>` : '';
    const presenceNote = compatibleAvailableCount>0 && !atStation ? `<section class="ui-card station-presence-note"><span>${icon('pin')}</span><div><strong>Start charging at the station</strong><p>Navigate here and confirm arrival before starting from Station Details. If you are already beside the charger, use Scan to verify its QR or charger code.</p></div><button class="ui-text-button" data-start-navigation>Navigate</button></section>` : atStation ? `<section class="ui-feedback ui-feedback--success">Arrival confirmed at ${s.name}. Compatible available connectors can now be started from this screen.</section>` : '';
    return layout(`<button class="ui-back ui-back--overlay" data-simple-back="location-return">${icon('back')}</button><section class="location-hero"><div class="location-glow"></div><div class="charger-art"><span>${icon('zap')}</span><div></div><small>ULTRA FAST</small></div><div class="location-badge"><i></i>${compatibleAvailableCount>0?`${compatibleAvailableCount} compatible connector${compatibleAvailableCount===1?'':'s'} available`:`No compatible connector available now`}</div></section><section class="location-title"><div><small>${s.address}</small><h2>${s.name}</h2><div class="rating-line"><span>${icon('star')} ${s.rating}</span><span>${formatDistanceKm(s.distanceKm)}</span><span>${s.eta}</span></div></div><button class="round-action" data-start-navigation>${icon('route')}</button></section><section class="price-card"><div><small>Estimated session</small><strong>${estimate.toLocaleString()} AMD</strong><p>39 kWh · estimate before charging</p></div><span>${s.price} AMD/kWh<br/>Reservation 500 AMD · Idle 50 AMD/min</span></section><section class="info-card station-visit-card"><div class="section-heading"><div><small>${atStation?'You are here':'Before you arrive'}</small><h2>Access & parking</h2></div><span class="distance-pill">${s.reliability}% reliable</span></div><div class="station-visit-list"><div><small>Access instructions</small><strong>${s.access}</strong></div><div><small>Parking rules</small><strong>${s.parkingRule}</strong></div><div><small>Recent reliability</small><strong>${s.reliability}% successful charging starts · last 30 days</strong></div></div></section>${presenceNote}<section class="info-card"><div class="section-heading"><div><small>Availability · ${connectors.length} connectors</small><h2>Choose a connector</h2></div><span class="distance-pill">${s.open}</span></div><div class="charger-list">${connectorList}</div></section>${amenities?`<section class="amenities ui-on-dark">${amenities}</section>`:''}<section class="location-actions"><button class="ui-button ui-button--secondary" data-favorite-station="${s.id}">${favoriteStations.has(s.id)?'★ Saved':'☆ Save location'}</button><button class="ui-button ui-button--secondary" data-start-navigation>${icon('route')} Navigate</button></section>${reserveAction}${compatibleAvailableCount===0?`<button class="ui-button ui-button--secondary ui-button--block" data-join-waiting-list>${waitingListJoined?'✓ Joined waiting list':'Join waiting list for a compatible charger'}</button>`:''}`, 'Station details', atStation?'Arrival confirmed · start available':'Availability and pricing');
}

function reservationScreen() {
    const s = selectedStation;
    const reservationVehicle = reservationVehicleRecord(reservation) || activeVehicleRecord();
    const estimate = Math.round((39 * s.price) + reservationFee);
    const title = reservationMode === 'edit' ? 'Modify reservation' : 'Reserve charging';
    const dates = [
      {label:'Today', meta:'Fri 21', value:'Today · Fri 21'},
      {label:'Tomorrow', meta:'Sat 22', value:'Tomorrow · Sat 22'},
      {label:'Sunday', meta:'Sun 23', value:'Sunday · Sun 23'},
      {label:'Monday', meta:'Mon 24', value:'Monday · Mon 24'}
    ];
    const slotMap = {
      'Today · Fri 21': [{t:'12:00',status:'busy'},{t:'12:30',status:'recommended'},{t:'12:45',status:'available'},{t:'13:00',status:'available'},{t:'13:15',status:'busy'},{t:'13:30',status:'available'}],
      'Tomorrow · Sat 22': [{t:'09:00',status:'available'},{t:'09:30',status:'available'},{t:'10:00',status:'recommended'},{t:'10:30',status:'available'},{t:'11:00',status:'available'},{t:'11:30',status:'busy'}],
      'Sunday · Sun 23': [{t:'10:00',status:'available'},{t:'10:30',status:'available'},{t:'11:00',status:'available'},{t:'11:30',status:'recommended'},{t:'12:00',status:'available'},{t:'12:30',status:'available'}],
      'Monday · Mon 24': [{t:'12:00',status:'busy'},{t:'12:30',status:'available'},{t:'13:00',status:'recommended'},{t:'13:30',status:'available'},{t:'14:00',status:'available'},{t:'14:30',status:'available'}]
    };
    const slots = slotMap[reservation.date] || slotMap['Today · Fri 21'];
    const connectorChoices = reservationConnectorOptions(s, reservationVehicle);
    const parkingBays = stationParkingBays(s);
    const compatibilityIssue = reservationCompatibilityIssue(reservation.type, s, reservationVehicle);
    const compatibilityNote = compatibilityIssue ? `<div class="ui-feedback ui-feedback--error">${compatibilityIssue}</div>` : '';
    const hardwareSelector = reservation.type === 'Specific charger'
      ? `<section class="flow-card"><small>Specific charger</small><h2>Choose charger</h2><div class="choice-list">${connectorChoices.length?connectorChoices.map(connector=>`<button data-res-charger="${connector.id}" class="${reservation.charger===connector.id?'selected':''}"><span>${icon('plug')}</span><div><strong>Charger ${connector.id}</strong><small>${connector.type} · ${connector.power} kW · ${connector.state}</small></div><b>${reservation.charger===connector.id?'✓':'›'}</b></button>`).join(''):`<div class="ui-state ui-state--empty"><h2>No compatible charger</h2><p>Choose another vehicle or charging location.</p></div>`}</div></section>`
      : reservation.type === 'Parking bay'
        ? `<section class="flow-card"><small>Parking bay</small><h2>Choose parking bay</h2><div class="choice-list">${parkingBays.length?parkingBays.map(bay=>`<button data-res-bay="${bay}" class="${reservation.bay===bay?'selected':''}"><span>${icon('parking')}</span><div><strong>Bay ${bay}</strong><small>Reserved parking with compatible charger access</small></div><b>${reservation.bay===bay?'✓':'›'}</b></button>`).join(''):`<div class="ui-state ui-state--empty"><h2>Parking reservation unavailable</h2><p>This station does not offer reservable charging bays.</p></div>`}</div></section>`
        : '';
    const steps = `<div class="stepper"><span class="${reservationStep >= 1 ? 'active' : ''}">1</span><i></i><span class="${reservationStep >= 2 ? 'active' : ''}">2</span><i></i><span class="${reservationStep >= 3 ? 'active' : ''}">3</span></div>`;
    if (reservationStep === 1) {
        return layout(`<button class="ui-back ui-back--inline" data-back-reservation>${icon('back')}</button>${steps}${reservationMessage?`<div class="ui-feedback ui-feedback--error">${reservationMessage}</div>`:''}<section class="flow-card"><small>Reservation type</small><h2>What do you want to reserve?</h2><div class="choice-list"><button data-res-type="Any available charger" class="${reservation.type === 'Any available charger' ? 'selected' : ''}"><span>${icon('zap')}</span><div><strong>Any available charger</strong><small>Best compatible charger is assigned when you arrive</small></div><b>›</b></button><button data-res-type="Specific charger" class="${reservation.type === 'Specific charger' ? 'selected' : ''}"><span>${icon('plug')}</span><div><strong>Specific charger</strong><small>${reservation.charger?`Charger ${reservation.charger} selected`:'Choose a compatible charger'}</small></div><b>›</b></button><button data-res-type="Parking bay" ${s.parking?'':'disabled'} class="${reservation.type === 'Parking bay' ? 'selected' : ''}"><span>${icon('parking')}</span><div><strong>Parking bay</strong><small>${s.parking?(reservation.bay?`Bay ${reservation.bay} selected`:'Choose a reservable charging bay'):'Not available at this station'}</small></div><b>›</b></button></div></section><section class="flow-card"><small>Vehicle</small><h2>Charging for</h2><div class="reservation-vehicle-grid">${vehicles.map(v=>`<button class="vehicle-choice ${reservationVehicle?.id===v.id?'selected':''}" data-res-vehicle="${v.id}"><span class="mini-car">${icon('car')}</span><span><strong>${v.name}</strong><small>${v.plate} · ${v.connector} · ${v.battery}%</small></span><b>${reservationVehicle?.id===v.id?'✓':icon('chevron')}</b></button>`).join('')}</div></section>${compatibilityNote}${hardwareSelector}<button class="primary-action" data-next-step><span class="primary-icon">${icon('chevron')}</span><span><small>Step 1 of 3</small><strong>Continue to schedule</strong></span><span>${icon('chevron')}</span></button>`, title, s.name);
    }
    if (reservationStep === 2) {
        return layout(`<button class="ui-back ui-back--inline" data-prev-step>${icon('back')}</button>${steps}<section class="flow-card"><small>Arrival</small><h2>Choose your charging window</h2><div class="date-pills reservation-dates">${dates.map(d=>`<button data-res-date="${d.value}" class="${reservation.date===d.value?'active':''}">${d.label}<small>${d.meta}</small></button>`).join('')}</div><div class="slot-heading"><span>Available times</span><small>Grey slots are unavailable</small></div><div class="time-grid reservation-slots">${slots.map(x=>`<button data-time="${x.t}" ${x.status==='busy'?'disabled':''} class="${reservation.time===x.t?'active':''} ${x.status}">${x.t}${x.status==='recommended'?'<small>Best</small>':''}</button>`).join('')}</div><div class="range-block-card"><div><span>Expected duration</span><strong id="duration-value">${reservation.duration} min</strong></div><input data-duration type="range" min="15" max="120" step="15" value="${reservation.duration}"></div><div class="range-block-card"><div><span>Target battery</span><strong id="target-value">${reservation.target}%</strong></div><input data-target type="range" min="70" max="100" step="5" value="${reservation.target}"></div></section><section class="smart-note"><span>${icon('sparkle')}</span><div><strong>Smart scheduling</strong><p>${reservation.time} is compatible with your selected duration. Arrival grace period is ${graceMinutes} minutes.</p></div></section><button class="primary-action" data-next-step><span class="primary-icon">${icon('clock')}</span><span><small>Step 2 of 3</small><strong>Review reservation</strong></span><span>${icon('chevron')}</span></button>`, title, 'Select date, time and target');
    }
    return layout(`<button class="ui-back ui-back--inline" data-prev-step>${icon('back')}</button>${steps}<section class="confirmation-hero"><span>${icon('shield')}</span><small>${reservationMode==='edit'?'Review your changes':'Review before confirming'}</small><h2>${s.name}</h2><p>${s.address}</p></section><section class="summary-card"><div><span>Vehicle</span><strong>${reservationVehicle?.name || reservation.vehicle}</strong><small>${reservationVehicle?.plate || '—'}</small></div><div><span>Reservation</span><strong>${reservation.type}</strong><small>${reservationHardwareLabel(reservation)}</small></div><div><span>Arrival</span><strong>${reservation.date}, ${reservation.time}</strong><small>${reservation.duration} min · Target ${reservation.target}%</small></div></section><section class="cost-card"><div><span>Estimated charging</span><strong>${(estimate-reservationFee).toLocaleString()} AMD</strong></div><div><span>${reservationMode==='edit'?'Change fee':'Reservation fee'}</span><strong>${reservationMode==='edit'?'0':reservationFee.toLocaleString()} AMD</strong></div>${reservationMode==='edit'?'':`<div><span>Payment source</span><strong>${reservationPaymentSource() || 'Add payment method'}</strong></div>`}<div class="total"><span>Estimated total</span><strong>${(reservationMode==='edit'?estimate-reservationFee:estimate).toLocaleString()} AMD</strong></div><small>Free cancellation until ${reservationCancellationPolicy.freeBeforeMinutes} minutes before arrival. Grace period: ${graceMinutes} minutes.</small></section><label class="terms-row"><input type="checkbox" ${reservationTermsAccepted?'checked':''} data-terms><span>I accept cancellation rules, idle fees and station access terms.</span></label>${reservationMessage?`<div class="ui-feedback ui-feedback--error">${reservationMessage}</div>`:''}<button class="primary-action" data-confirm-reservation><span class="primary-icon">${icon('shield')}</span><span><small>Step 3 of 3</small><strong>${reservationMode==='edit'?'Save reservation changes':'Confirm reservation'}</strong></span><span>${icon('chevron')}</span></button>`, title, 'Transparent pricing and conditions');
}
function reservationSuccessScreen() {
    const s = selectedStation;
    const reservedVehicle = reservationVehicleRecord(activeReservation || reservation);
    return layout(`<section class="success-card"><div class="success-ring">✓</div><small>${reservationMode==='edit'?'Reservation updated':'Reservation confirmed'}</small><h2>${s.name}</h2><p>${reservation.date}, ${reservation.time} · ${reservationHardwareLabel(reservation)}</p><div class="qr-mock"><span></span><span></span><span></span><span></span><b>${activeReservation?.id||'Pending'}</b></div><div class="success-meta"><div><small>Assignment</small><strong>${reservationHardwareLabel(activeReservation || reservation)}</strong></div><div><small>Grace period</small><strong>${graceMinutes} min</strong></div><div><small>Vehicle</small><strong>${reservedVehicle?.plate || '—'}</strong></div></div></section><button class="primary-action" data-open-reservation-manage><span class="primary-icon">${icon('clock')}</span><span><small>Reservation ${activeReservation?.id||'Pending'}</small><strong>View reservation</strong></span><span>${icon('chevron')}</span></button><div class="quick-grid"><button class="quick-card" data-start-navigation><span class="quick-icon">${icon('route')}</span><span><small>Directions</small><strong>Navigate</strong></span></button><button class="quick-card" data-modify-reservation><span class="quick-icon">${icon('clock')}</span><span><small>Reservation</small><strong>Modify</strong></span></button></div>`, 'All set', 'Your charger is waiting');
}
function reservationManageScreen() {
    const r = activeReservation || {...reservation,id:'VD-RS-8452',status:'Confirmed',stationId:selectedStation.id,countdownMinutes:18};
    const station = reservationStation(r);
    const reservedVehicle = reservationVehicleRecord(r);
    const activeVehicle = activeVehicleRecord();
    const vehicleMismatch = Boolean(reservedVehicle && activeVehicle && reservedVehicle.id !== activeVehicle.id);
    const assigned = reservationHardwareLabel(r);
    const vehicleGuard = vehicleMismatch ? `<section class="ui-card compatibility-note"><span>!</span><div><strong>This reservation is for ${reservedVehicle.name}</strong><p>Your active vehicle is ${activeVehicle.name}. Switch back to the reserved vehicle before confirming arrival or starting charging.</p></div></section><button class="ui-button ui-button--secondary ui-button--block" data-switch-reservation-vehicle>Use ${reservedVehicle.name}</button>` : '';
    return simpleHeaderBack('Reservation details',`${r.id} · ${r.status}`, `${reservationMessage?`<div class="ui-feedback ui-feedback--success">${reservationMessage}</div>`:''}<section class="reservation-status-card ui-surface--dark"><div><small>Arrival window</small><h2>${r.date}, ${r.time}</h2><p>${station.name} · ${assigned}</p></div><span class="reservation-countdown"><small>Starts in</small><strong>${r.countdownMinutes ?? 18} min</strong></span></section><section class="grace-card"><div class="grace-ring"><strong>${graceMinutes}</strong><small>min</small></div><div><small>Arrival grace period</small><h2>Your reservation stays protected</h2><p>Confirm arrival before ${addMinutesToClock(r.time,graceMinutes)} or the reservation may become a no-show.</p></div></section><section class="ui-card reservation-detail-list"><div><span>Vehicle</span><strong>${r.vehicle}</strong></div><div><span>Reservation type</span><strong>${r.type}</strong></div><div><span>Expected duration</span><strong>${r.duration} min</strong></div><div><span>Target battery</span><strong>${r.target}%</strong></div><div><span>Reservation fee</span><strong>${Number(r.feePaid ?? reservationFee).toLocaleString()} AMD</strong></div><div><span>Fee payment</span><strong>${r.feePaymentMethod || 'Payment recorded with reservation'}</strong></div></section>${vehicleGuard}<button class="ui-button ui-button--primary ui-button--block" data-confirm-arrival ${vehicleMismatch?'disabled':''}>I'm at the station</button><div class="reservation-action-grid"><button class="ui-button ui-button--secondary" data-modify-reservation>Modify</button><button class="ui-button ui-button--danger" data-cancel-reservation>Cancel reservation</button></div><button class="ui-text-button reservation-demo-link" data-simulate-no-show>Prototype: simulate no-show</button>`, 'reservation-manage-return');
}
function reservationMinutesUntilStart(r = activeReservation || reservation) {
    const explicit = Number(r?.countdownMinutes);
    if (Number.isFinite(explicit)) return Math.max(0, explicit);
    if (String(r?.date || '').toLowerCase().includes('today')) return 18;
    return 24 * 60;
}
function reservationServiceUnavailable(r = activeReservation || reservation) {
    const station = reservationStation(r);
    if (!station || station.status === 'offline') return true;
    const vehicle = reservationVehicleRecord(r) || activeVehicleRecord();
    const rows = stationConnectorRows(station);
    const arrivedForThisReservation = Boolean(
        activeReservation?.id === r?.id &&
        navigationState.source === 'reservation' &&
        navigationState.arrived &&
        navigationState.assignment?.stationId === station.id
    );
    if (r?.type === 'Specific charger') {
        const connector = rows.find(item => item.id === String(r.charger));
        return !connector || connector.status === 'offline' || (vehicle?.connector && connector.type !== vehicle.connector) || (arrivedForThisReservation && connector.status !== 'available');
    }
    if (arrivedForThisReservation && vehicle?.connector) {
        return !rows.some(item => item.status === 'available' && item.type === vehicle.connector);
    }
    return false;
}
function reservationCancellationQuote(r = activeReservation || reservation) {
    const paidFee = Number(r?.feePaid ?? reservationFee);
    const minutesUntilStart = reservationMinutesUntilStart(r);
    const serviceUnavailable = reservationServiceUnavailable(r);
    const station = reservationStation(r);
    const arrived = Boolean(
        navigationState.arrived &&
        navigationState.assignment?.stationId === station?.id &&
        activeReservation?.id === r?.id
    );
    const freeByTime = !arrived && minutesUntilStart >= reservationCancellationPolicy.freeBeforeMinutes;
    const fullRefund = serviceUnavailable || freeByTime;
    const refund = fullRefund ? paidFee : 0;
    const cancellationFee = Math.max(0, paidFee - refund);
    const status = serviceUnavailable
        ? 'Service unavailable · full refund'
        : freeByTime
            ? `Free cancellation · ${minutesUntilStart} min before start`
            : arrived
                ? 'Arrival already recorded · reservation fee retained'
                : `Late cancellation · ${minutesUntilStart} min before start`;
    const explanation = serviceUnavailable
        ? 'VoltDrive detected that the reserved charging service is unavailable. The reservation fee is returned to the original payment source.'
        : freeByTime
            ? `This prototype allows free cancellation until ${reservationCancellationPolicy.freeBeforeMinutes} minutes before the reservation start.`
            : `The free-cancellation window closed ${reservationCancellationPolicy.freeBeforeMinutes} minutes before start. The reservation fee is retained.`;
    return { paidFee, minutesUntilStart, serviceUnavailable, arrived, freeByTime, refund, cancellationFee, status, explanation };
}

function cancelReservationScreen() {
    const r=activeReservation||reservation;
    const station=reservationStation(r);
    const feeMethod=r.feePaymentMethod || 'Original payment method';
    const quote=reservationCancellationQuote(r);
    return simpleHeaderBack('Cancel reservation','Review cancellation conditions', `<section class="ui-card cancel-summary"><small>Reservation ${activeReservation?.id||'Pending'}</small><h2>${station.name}</h2><p>${r.date}, ${r.time} · ${reservationHardwareLabel(r)}</p></section><section class="ui-card cancellation-policy-card"><div class="section-heading"><div><small>Cancellation policy</small><h2>${quote.status}</h2></div><span class="distance-pill">${quote.minutesUntilStart} min</span></div><p>${quote.explanation}</p></section><section class="ui-card ui-form"><label><span>Reason for cancellation</span><select id="cancel-reason"><option ${cancellationReason==='Plans changed'?'selected':''}>Plans changed</option><option ${cancellationReason==='Running late'?'selected':''}>Running late</option><option ${cancellationReason==='Found another charger'?'selected':''}>Found another charger</option><option ${cancellationReason==='Charger unavailable'?'selected':''}>Charger unavailable</option></select></label><small class="field-help">Your reason is recorded for support and analytics. Refund eligibility is calculated from the reservation timing and verified station availability.</small></section><section class="cost-card"><div><span>Reservation fee paid</span><strong>${quote.paidFee.toLocaleString()} AMD</strong></div><div><span>Paid with</span><strong>${feeMethod}</strong></div><div><span>Refund</span><strong>${quote.refund.toLocaleString()} AMD</strong></div><div class="total"><span>Cancellation fee</span><strong>${quote.cancellationFee.toLocaleString()} AMD</strong></div><small>Free cancellation cutoff: ${reservationCancellationPolicy.freeBeforeMinutes} minutes before start. Verified service unavailability is refunded regardless of the cutoff.</small></section><button class="ui-button ui-button--danger ui-button--block" data-confirm-cancel>Confirm cancellation</button>`, 'reservation-manage');
}

function waitingListScreen() {
    const waitingVehicle = reservationVehicleRecord(activeReservation || reservation) || activeVehicleRecord();
    const alternatives = compatibleAlternativeStations(waitingVehicle, selectedStation.id).slice(0,2);
    return simpleHeaderBack('Waiting list',selectedStation.name, `<section class="waiting-hero ui-surface--dark"><small>Your position</small><strong>#${waitingPosition}</strong><h2>We’ll alert you when a charger is ready</h2><p>Estimated wait: 18–26 minutes. You have 5 minutes to accept an offered charger.</p></section><section class="ui-card waiting-preferences"><div><span>Vehicle</span><strong>${reservation.vehicle}</strong></div><div><span>Minimum power</span><strong>120 kW</strong></div><div><span>Maximum distance</span><strong>${formatDistanceKm(8)}</strong></div></section><section class="account-section"><div class="section-heading"><div><small>Available now</small><h2>Alternative stations</h2></div></div><div class="map-results-list">${alternatives.map(a=>`<article class="map-result-card"><button class="map-result-main" data-use-alternative="${a.id}"><span class="map-result-status status-available">${a.available}</span><span><strong>${a.name}</strong><em>${a.address}</em></span><span class="map-result-meta"><strong>${formatDistanceKm(a.distanceKm)}</strong><em>${a.power} kW · ${a.price} AMD/kWh</em></span></button></article>`).join('')}</div></section><button class="ui-button ui-button--danger ui-button--block" data-leave-waiting-list>Leave waiting list</button>`, 'location');
}
function noShowScreen() {
    const vehicle = reservationVehicleRecord(reservation) || activeVehicleRecord();
    const alternative = compatibleAlternativeStations(vehicle, selectedStation.id)[0] || null;
    return simpleHeaderBack('Reservation expired','No-show recorded', `<section class="auth-result no-show-result"><div class="auth-result-icon">!</div><h2>Your arrival window ended</h2><p>Reservation ${lastExpiredReservationId||activeReservation?.id||'VD-RS-8452'} was released after the ${graceMinutes}-minute grace period. The ${reservationFee.toLocaleString()} AMD reservation fee was not refunded.</p></section><section class="ui-card"><div class="section-heading"><div><small>Next steps</small><h2>Continue charging today</h2></div></div><p class="section-copy">${alternative?`We found a compatible ${vehicle?.connector || ''} charger nearby. You can reserve it immediately or return to Stations.`:'No compatible charger is available nearby right now. Return to Stations to review other options.'}</p></section>${alternative?`<button class="ui-button ui-button--primary ui-button--block" data-use-alternative="${alternative.id}">Reserve ${alternative.name}</button>`:''}<button class="ui-button ui-button--secondary ui-button--block" data-back-map>Return to Stations</button>`, 'home');
}



function formatCountdown(seconds){
    const safe=Math.max(0,Math.floor(Number(seconds)||0));
    return `${String(Math.floor(safe/60)).padStart(2,'0')}:${String(safe%60).padStart(2,'0')}`;
}
function stopParkingCountdown(){
    if(parkingCountdownTimer){ clearInterval(parkingCountdownTimer); parkingCountdownTimer=null; }
}
function refreshParkingLiveUI(){
    if(screen!=='parking-monitor') return;
    const value=document.querySelector('[data-parking-live-value]');
    const label=document.querySelector('[data-parking-live-label]');
    if(parkingSession.stage==='grace'){
        if(value) value.textContent=formatCountdown(parkingSession.graceSecondsRemaining);
        if(label) label.textContent='Free grace period remaining';
    } else if(parkingSession.stage==='idle'){
        if(value) value.textContent=formatDisplayMoney(parkingSession.idleCost);
        if(label) label.textContent=`${parkingSession.idleMinutes} min · ${formatDisplayMoney(50)}/min`;
    } else if(parkingSession.stage==='extended'){
        if(value) value.textContent=formatCountdown(parkingSession.extensionSecondsRemaining);
        if(label) label.textContent='Paid parking extension remaining';
    }
}
function ensureParkingCountdown(){
    const shouldRun=parkingSession.active===true && ['grace','idle','extended'].includes(parkingSession.stage) && Boolean(latestCompletedSessionId);
    if(!shouldRun){ stopParkingCountdown(); return; }
    if(parkingCountdownTimer) return;
    parkingCountdownTimer=setInterval(()=>{
        if(parkingSession.stage==='grace'){
            parkingSession.graceSecondsRemaining=Math.max(0,Number(parkingSession.graceSecondsRemaining ?? parkingSession.graceMinutes*60)-1);
            if(parkingSession.graceSecondsRemaining<=0){
                parkingSession.stage='idle'; parkingSession.idleSecondsElapsed=0; parkingSession.idleMinutes=0; parkingSession.idleCost=0;
                parkingSession.message='Grace period ended. Idle fee is now active.';
                addSystemNotification('Idle fee started',`Bay ${parkingSession.bay} · ${formatDisplayMoney(50)}/min`,'warning','charging-summary','View charging result',latestCompletedSessionId);
                if(screen==='parking-monitor') render();
                return;
            }
        } else if(parkingSession.stage==='idle'){
            parkingSession.idleSecondsElapsed=Math.max(0,Number(parkingSession.idleSecondsElapsed||0)+1);
            const minutes=Math.floor(parkingSession.idleSecondsElapsed/60);
            if(minutes!==parkingSession.idleMinutes){ parkingSession.idleMinutes=minutes; parkingSession.idleCost=minutes*50; }
        } else if(parkingSession.stage==='extended'){
            parkingSession.extensionSecondsRemaining=Math.max(0,Number(parkingSession.extensionSecondsRemaining ?? parkingSession.extensionMinutes*60)-1);
            if(parkingSession.extensionSecondsRemaining<=0){
                parkingSession.stage='idle'; parkingSession.idleSecondsElapsed=0; parkingSession.idleMinutes=0; parkingSession.idleCost=0;
                parkingSession.message='Parking extension ended. Idle fee is now active.';
                if(screen==='parking-monitor') render();
                return;
            }
        }
        refreshParkingLiveUI();
    },1000);
}
function parkingMonitorScreen() {
    const latestSession = sessions.find(x=>x.id===latestCompletedSessionId);
    const sessionVehicle = vehicleForSession(latestSession) || activeVehicleRecord();
    const sessionStation = (latestSession?.stationId && stations.find(s=>s.id===latestSession.stationId)) || stations.find(s=>s.name===latestSession?.place) || selectedStation;
    const idle = parkingSession.stage === 'idle';
    const grace = parkingSession.stage === 'grace';
    const title = grace ? 'Move your vehicle soon' : idle ? 'Idle fee is active' : 'Parking extended';
    const value = grace ? formatCountdown(parkingSession.graceSecondsRemaining ?? parkingSession.graceMinutes*60) : idle ? formatDisplayMoney(parkingSession.idleCost) : formatCountdown(parkingSession.extensionSecondsRemaining ?? parkingSession.extensionMinutes*60);
    const label = grace ? 'Free grace period remaining' : idle ? `${parkingSession.idleMinutes} min · ${formatDisplayMoney(50)}/min` : 'Paid parking extension remaining';
    return layout(`<section class="parking-status-hero ${idle?'is-idle':''}"><span class="parking-status-icon">${icon('parking')}</span><small>${sessionStation.name} · Bay ${parkingSession.bay}</small><h2>${title}</h2><div class="parking-status-value"><strong data-parking-live-value>${value}</strong><span data-parking-live-label>${label}</span></div><p>${grace?'Charging is complete. Unplug and move your vehicle before the grace period ends.':idle?'Your vehicle is still occupying the charging bay. The fee increases every minute.':'Your bay remains reserved during the extension period.'}</p></section>${parkingSession.message?`<div class="ui-feedback ui-feedback--success">${parkingSession.message}</div>`:''}<section class="ui-card parking-session-details"><div><small>Charging session</small><strong>${latestCompletedSessionId}</strong></div><div><small>Vehicle</small><strong>${sessionVehicle?.name || 'Vehicle'} · ${sessionVehicle?.plate || '—'}</strong></div><div><small>Parking bay</small><strong>${parkingSession.bay}</strong></div><div><small>Idle tariff</small><strong>${formatDisplayMoney(50)}/min</strong></div></section><section class="parking-warning"><span>!</span><div><strong>Keep the bay available for other drivers</strong><p>Disconnect the cable, close the charging port and leave the marked bay.</p></div></section>${grace?`<button class="ui-button ui-button--primary ui-button--block" data-parking-complete>I moved my vehicle</button><button class="ui-button ui-button--secondary ui-button--block" data-extend-parking>Extend parking</button><button class="ui-text-button ui-button--block" data-simulate-idle>Prototype: grace period ends</button>`:idle?`<button class="ui-button ui-button--primary ui-button--block" data-parking-complete>Stop idle fee — vehicle moved</button><button class="ui-button ui-button--secondary ui-button--block" data-extend-parking>Request parking extension</button>`:`<button class="ui-button ui-button--primary ui-button--block" data-parking-complete>I moved my vehicle</button><button class="ui-text-button ui-button--block" data-simulate-idle>Prototype: extension ends</button>`}`, 'Parking session', grace?'Grace period active':idle?'Idle fee running':'Extension active');
}
function parkingExtendScreen() {
    const amount=parkingSession.extensionMinutes*50;
    const method=parkingPaymentMethod();
    const insufficient=method==='Wallet balance' && walletBalance<amount && !canAutoTopUpWallet(amount);
    const autoTopUpAvailable=method==='Wallet balance' && walletBalance<amount && canAutoTopUpWallet(amount);
    return simpleHeaderBack('Extend parking','Keep the charging bay reserved for a little longer', `${parkingSession.paymentMessage?`<div class="ui-feedback ui-feedback--error">${parkingSession.paymentMessage}</div>`:''}<section class="ui-card parking-extension-options"><button class="${parkingSession.extensionMinutes===15?'is-selected':''}" data-parking-extension="15"><span><small>Short extension</small><strong>15 minutes</strong></span><b>750 AMD</b></button><button class="${parkingSession.extensionMinutes===30?'is-selected':''}" data-parking-extension="30"><span><small>Recommended</small><strong>30 minutes</strong></span><b>1,500 AMD</b></button><button class="${parkingSession.extensionMinutes===60?'is-selected':''}" data-parking-extension="60"><span><small>Maximum extension</small><strong>60 minutes</strong></span><b>3,000 AMD</b></button></section><section class="cost-card"><div><span>Extension</span><strong>${parkingSession.extensionMinutes} min</strong></div><div><span>Parking rate</span><strong>${formatDisplayMoney(50)}/min</strong></div><div><span>Payment</span><strong>${method || 'No payment method'}</strong></div><div class="total"><span>Total</span><strong>${amount.toLocaleString()} AMD</strong></div><small>Extension depends on site availability and does not include additional energy.</small></section>${autoTopUpAvailable?`<div class="ui-feedback ui-feedback--success">Automatic top-up will fund the Wallet before this extension.</div>`:''}${insufficient?`<div class="ui-feedback ui-feedback--error">Wallet balance is below the ${amount.toLocaleString()} AMD extension charge and automatic top-up cannot cover it.</div>`:''}<button class="ui-button ui-button--primary ui-button--block" data-confirm-parking-extension ${!method||insufficient?'disabled':''}>Confirm extension</button>`, 'parking-monitor');
}
function parkingCompleteScreen() {
    const latestSession=sessions.find(x=>x.id===latestCompletedSessionId);
    const sessionStation=(latestSession?.stationId && stations.find(s=>s.id===latestSession.stationId)) || stations.find(s=>s.name===latestSession?.place) || selectedStation;
    const parkingTotal=(parkingSession.extensionCost||0)+(parkingSession.idleCost||0);
    const parkingPaymentFailed=parkingSession.paymentStatus==='Failed';
    return layout(`<section class="summary-success"><div class="summary-check">${parkingPaymentFailed?'!':'✓'}</div><small>Parking session completed</small><h2>${parkingPaymentFailed?'Vehicle moved · payment required':'Thank you for moving your vehicle'}</h2><p>${sessionStation.name} · Bay ${parkingSession.bay}</p><div class="summary-battery"><strong>${parkingTotal.toLocaleString()} AMD</strong><span>${parkingPaymentFailed?'Idle fee payment failed':parkingTotal?'Parking charges paid':'No parking charge'}</span></div></section><section class="ui-card"><div class="detail-lines"><div><span>Charging receipt</span><strong>${latestReceiptId||'Not issued'}</strong></div><div><span>Parking duration after charge</span><strong>${parkingSession.idleMinutes || 4} min</strong></div><div><span>Parking extension</span><strong>${(parkingSession.extensionCost||0).toLocaleString()} AMD</strong></div><div><span>Idle fee</span><strong>${parkingSession.idleCost.toLocaleString()} AMD</strong></div></div></section><button class="ui-button ui-button--primary ui-button--block" data-parking-home>Return to home</button><button class="ui-button ui-button--secondary ui-button--block" data-open-activity>View session in Sessions</button>`, 'Parking complete', 'Charging bay released');
}
function chargeStartScreen() {
    const reservationData = activeReservation || reservation;
    const reservedStation = activeReservation ? reservationStation(activeReservation) : selectedStation;
    const reservedVehicle = reservationVehicleRecord(reservationData);
    const reservationMismatch = appState === 'reserved' && activeReservation && reservationVehicleMismatch(activeReservation);
    const recent = latestRecentCharger();
    const recentCard = recent ? `<section class="ui-card reserved-start-card"><small>Recently used charger</small><h2>${recent.station.name} · Charger ${recent.connector.id}</h2><p>${recent.connector.type} · ${recent.connector.power} kW · ${recent.connector.state}</p><button class="ui-text-button" data-use-recent-charger data-station-id="${recent.station.id}" data-connector-id="${recent.connector.id}">Check availability</button></section>` : '';
    return layout(`<section class="charge-start-hero ui-surface--dark"><span class="charge-start-icon">${icon('qr')}</span><small>Quick start</small><h2>Connect to a charger</h2><p>Scan the QR code on the charger or enter its code manually.</p></section>${chargeStartMessage?`<div class="ui-feedback ui-feedback--error">${chargeStartMessage}</div>`:''}<button class="ui-button ui-button--primary ui-button--block" data-begin-scan>${icon('qr')} Scan charger QR</button><section class="ui-card ui-form"><label><span>Charger code</span><input id="charger-code" value="${startCharge.code}" placeholder="Example: VD-04-CCS2"></label><button class="ui-button ui-button--secondary ui-button--block" data-check-code>Check charger</button></section>${appState==='reserved'?`<section class="ui-card reserved-start-card"><small>Active reservation</small><h2>${reservationData.type==='Specific charger'?`Charger ${reservationData.charger} is reserved`:'Charger assigned when you arrive'}</h2><p>${reservedStation.name} · ${reservationHardwareLabel(reservationData)} · ${reservedVehicle?.name || reservationData.vehicle || 'Vehicle'}</p>${reservationMismatch?`<button class="ui-text-button" data-switch-reservation-vehicle>Switch to ${reservedVehicle?.name || 'reserved vehicle'}</button>`:reservationData.type==='Specific charger'?`<button class="ui-text-button" data-use-reserved-charger>Use reserved charger</button>`:`<button class="ui-text-button" data-open-reservation-manage>Open reservation</button>`}</section>`:''}${recentCard}<section class="start-help"><button data-open-support>Need help?</button><button data-report-problem>Charger problem</button></section>`, 'Start charging', 'Scan, verify and connect');
}
function chargeScanScreen() {
    return simpleHeaderBack('Scan charger','Point your camera at the QR code', `<section class="scanner-frame ui-surface--dark"><div class="scanner-corners"></div><div class="scanner-line"></div><span>${icon('qr')}</span><small>Camera preview prototype${scannerFlashlight?' · flashlight on':''}</small></section><section class="ui-card scanner-instructions"><div><span>1</span><p>Find the QR label near the connector.</p></div><div><span>2</span><p>Keep the code inside the frame.</p></div><div><span>3</span><p>We verify the charger before payment.</p></div></section><button class="ui-button ui-button--secondary ui-button--block" data-toggle-scanner-flash aria-pressed="${scannerFlashlight}">Prototype flashlight · ${scannerFlashlight?'On':'Off'}</button><button class="ui-button ui-button--primary ui-button--block" data-simulate-scan>Simulate QR detected</button><button class="ui-text-button ui-button--block" data-scan-manual>I cannot scan the code</button>`, 'charge-start');
}
function chargerCheckScreen() {
    const s=selectedStation;
    const connector=selectedStationConnector();
    const activeVehicle=chargingFlowVehicleRecord();
    if (!activeVehicle) {
        return simpleHeaderBack('Check charger', selectedStation.name, `<div class="ui-feedback ui-feedback--error">Add a vehicle before checking charger compatibility.</div><section class="ui-card"><div class="section-heading"><div><small>Vehicle required</small><h2>Choose your EV first</h2></div></div><p class="section-copy">Vehicle connector data is required to verify compatibility and start charging safely.</p></section><button class="ui-button ui-button--primary ui-button--block" data-add-vehicle>Add vehicle</button>`, 'charge-start');
    }
    const chargingReservation=chargingFlowReservationRecord();
    const compatible=!activeVehicle?.connector || connector.type===activeVehicle.connector;
    const available=connector.status==='available';
    const alternatives=compatibleStartConnectors().filter(item=>item.id!==connector.id);
    const statusLabel=available?'Available':connector.status==='offline'?'Offline':connector.state || 'Unavailable';
    const primaryAction=available && compatible
      ? `<button class="ui-button ui-button--primary ui-button--block" data-connector-ready>Continue</button>`
      : alternatives.length
        ? `<button class="ui-button ui-button--primary ui-button--block" data-connector-ready>Choose another connector</button>`
        : `<button class="ui-button ui-button--primary ui-button--block" data-back-map>Find another charger</button>`;
    return simpleHeaderBack(available && compatible?'Charger verified':'Charger unavailable','Status checked for this prototype session', `<section class="verified-charger ui-surface--dark"><div class="verified-mark">${available && compatible?'✓':'!'}</div><small>${s.name}</small><h2>Charger ${connector.id}</h2><p>${s.address}</p><div class="verified-grid"><div><small>Status</small><strong>${statusLabel}</strong></div><div><small>Connector</small><strong>${connector.type}</strong></div><div><small>Maximum power</small><strong>${connector.power} kW</strong></div><div><small>Price</small><strong>${connector.price} AMD/kWh</strong></div><div><small>Idle fee</small><strong>50 AMD/min</strong></div><div><small>Authorization hold</small><strong>${startCharge.preauth.toLocaleString()} AMD</strong></div></div></section><section class="ui-card start-session-summary"><div><small>Vehicle</small><strong>${activeVehicle?.name||'Vehicle'}</strong></div><div><small>Compatibility</small><strong>${compatible?'Compatible':`Requires ${activeVehicle?.connector||'compatible connector'}`}</strong></div><div><small>Plug & Charge</small><strong>${plugChargeStartStatus(activeVehicle, connector)}</strong></div><div><small>Payment</small><strong>${startCharge.payment}</strong></div></section>${available && compatible?`<section class="ui-card safety-check"><div class="section-heading"><div><small>Before continuing</small><h2>Prepare your vehicle</h2></div></div><div class="safety-row"><span>✓</span><p>${selectedStation.parking?`Park fully inside bay ${(chargingReservation?.stationId===selectedStation.id&&chargingReservation?.bay) || (navigationState.assignment?.stationId===selectedStation.id&&navigationState.assignment?.bay) || stationRouteMeta(selectedStation).defaultBay || 'the assigned bay'}.`:'Position your vehicle safely in the public charging access area.'}</p></div><div class="safety-row"><span>✓</span><p>Insert the ${connector.type} connector until it locks.</p></div><div class="safety-row"><span>✓</span><p>Charging starts only after payment authorization.</p></div></section>`:`<section class="ui-card compatibility-note"><span>!</span><div><strong>${available?'Connector not compatible':'Connector cannot be used now'}</strong><p>${available?`Your active vehicle uses ${activeVehicle?.connector||'another connector type'}.`:`${statusLabel}. No payment has been authorized.`}</p></div></section>`}${primaryAction}`, 'charge-start');
}
function connectorSelectScreen() {
    const activeVehicle=chargingFlowVehicleRecord();
    const compatible=compatibleStartConnectors();
    if(compatible.length && !compatible.some(c=>c.id===startCharge.connector)) {
        startCharge.connector=compatible[0].id;
        startCharge.code=chargerCodeForConnector(compatible[0]);
    }
    const options=compatible.map(c=>`<button class="connector-choice ${startCharge.connector===c.id?'is-selected':''}" data-select-start-connector="${c.id}"><span class="charger-number">${c.id}</span><span><small>${c.type} · Available</small><strong>${c.power} kW ${c.speed}</strong><em>${c.price} AMD/kWh</em></span><b>${startCharge.connector===c.id?'✓':'›'}</b></button>`).join('');
    return simpleHeaderBack('Choose connector','Only compatible connectors are shown', `${compatible.length?`<section class="ui-card"><div class="connector-choice-list">${options}</div></section>`:`<section class="ui-card compatibility-note"><span>!</span><div><strong>No compatible connector available</strong><p>Return to Stations and choose another charger for ${activeVehicle?.connector||'your vehicle'}.</p></div></section>`}<section class="ui-card compatibility-note"><span>${icon('car')}</span><div><small>Active vehicle</small><strong>${activeVehicle?.name||'Vehicle'}</strong><p>${activeVehicle?.connector||'CCS2'} compatible · Battery ${activeVehicle?.battery||'—'}% · Last reported</p></div></section>${compatible.length?`<button class="ui-button ui-button--primary ui-button--block" data-confirm-connector>Continue with connector ${startCharge.connector}</button>`:`<button class="ui-button ui-button--primary ui-button--block" data-back-map>Find another charger</button>`}`, 'charger-check');
}
function paymentAuthorizeScreen() {
    const walletShort=startCharge.payment==='Wallet' && walletBalance<startCharge.preauth;
    const walletAutoTopUpAvailable=walletShort && canAutoTopUpWallet(startCharge.preauth);
    const walletInsufficient=walletShort && !walletAutoTopUpAvailable;
    const selectedCard=paymentMethods.find(p=>paymentMethodLabel(p)===startCharge.payment);
    const noUsablePayment=!selectedCard && startCharge.payment!=='Wallet';
    const connectionOffline=typeof navigator!=='undefined' && !navigator.onLine;
    const cardButtons=paymentMethods.map(p=>{const label=paymentMethodLabel(p);return `<button class="payment-source ${startCharge.payment===label?'is-selected':''}" data-start-payment="${label}"><span class="ui-list-icon">${icon('card')}</span><span><small>${p.active?'Default card · ':''}Expires ${p.expiry}</small><strong>${label}</strong></span><b>${startCharge.payment===label?'✓':'›'}</b></button>`}).join('');
    return simpleHeaderBack('Authorize payment','No charge is made until the session starts', `<section class="payment-preauth ui-surface--dark"><small>Temporary authorization</small><strong>${startCharge.preauth.toLocaleString()} AMD</strong><p>The final amount is calculated from actual energy, time and applicable fees.</p></section>${connectionOffline?`<div class="ui-feedback ui-feedback--error">Reconnect to the internet before authorizing payment. No authorization has been attempted.</div>`:''}${walletAutoTopUpAvailable?`<div class="ui-feedback ui-feedback--success">Automatic top-up can add ${Number(autoTopUp.amount||0).toLocaleString()} AMD from ${paymentMethodLabel(autoTopUpFundingCard())} before authorization.</div>`:''}${walletInsufficient?`<div class="ui-feedback ui-feedback--error">Wallet balance is below the temporary authorization amount and automatic top-up cannot cover it. Choose your saved card or add funds.</div>`:''}${noUsablePayment?`<div class="ui-feedback ui-feedback--error">Choose an available payment source before continuing.</div>`:''}<section class="ui-card"><div class="section-heading"><div><small>Payment source</small><h2>Choose how to pay</h2></div></div>${cardButtons}<button class="payment-source ${startCharge.payment==='Wallet'?'is-selected':''}" data-start-payment="Wallet"><span class="ui-list-icon">${icon('wallet')}</span><span><small>Optional balance ${walletBalance.toLocaleString()} AMD</small><strong>VoltDrive Wallet</strong></span><b>${startCharge.payment==='Wallet'?'✓':'›'}</b></button></section><section class="ui-card payment-protection"><span>${icon('shield')}</span><div><strong>Protected authorization</strong><p>Payment data is tokenized and is not shared with the charger.</p></div></section><button class="ui-button ui-button--primary ui-button--block" data-authorize-payment ${walletInsufficient||noUsablePayment||connectionOffline?'disabled':''}>Authorize ${startCharge.preauth.toLocaleString()} AMD</button><button class="ui-text-button ui-button--block" data-start-error="payment">Prototype: payment declined</button>`, 'tariff-review');
}
function tariffReviewScreen() {
    const connector=selectedStationConnector();
    const activeVehicle=chargingFlowVehicleRecord();
    const chargingReservation=chargingFlowReservationRecord();
    const estimate=chargingLimitEstimate(connector);
    const estimateText=estimate===null?'Calculated at session end':`${estimate.toLocaleString()} AMD`;
    const limitIssue=chargingStartLimitIssue();
    return simpleHeaderBack('Review and start','Confirm pricing before payment authorization', `${chargeStartMessage?`<div class="ui-feedback ui-feedback--error">${chargeStartMessage}</div>`:''}${limitIssue?`<div class="ui-feedback ui-feedback--error">${limitIssue}</div>`:''}<section class="ui-card start-session-summary"><div><small>Station</small><strong>${selectedStation.name}</strong></div><div><small>Charger</small><strong>${connector.id} · ${connector.type}</strong></div><div><small>Maximum power</small><strong>${connector.power} kW</strong></div><div><small>Vehicle</small><strong>${activeVehicle?.name||'Vehicle'}</strong></div><div><small>Charging limit</small><strong>${chargingLimitLabel()}</strong></div><div><small>Payment</small><strong>${startCharge.payment}</strong></div></section><button class="ui-button ui-button--secondary ui-button--block" data-open-charge-limit data-limit-return="tariff-review">Change charging limit</button><section class="cost-card"><div><span>Energy tariff</span><strong>${connector.price} AMD/kWh</strong></div><div><span>Connection fee</span><strong>0 AMD</strong></div><div><span>Idle fee</span><strong>50 AMD/min</strong></div><div><span>Reservation fee</span><strong>${chargingReservation?`${Number(chargingReservation.feePaid ?? reservationFee).toLocaleString()} AMD · paid earlier`:'0 AMD'}</strong></div><div><span>Authorization hold</span><strong>${startCharge.preauth.toLocaleString()} AMD</strong></div><div class="total"><span>Estimated at selected limit</span><strong>${estimateText}</strong></div><small>Idle fees begin 10 minutes after charging completes. The authorization hold is temporary and is not the final session charge.</small></section><label class="form-check start-terms"><input class="form-check-input" type="checkbox" data-start-terms ${startCharge.accepted?'checked':''}><span class="form-check-label">I accept the displayed tariff and charging conditions.</span></label><button class="ui-button ui-button--primary ui-button--block" data-start-session ${limitIssue?'disabled':''}>Start charging</button>`, 'connector-select');
}
function chargeLimitScreen() {
    const limit=chargeLimitDraft || chargeLimit;
    const batteryValue=limit.battery;
    const energyValue=limit.energy;
    const costValue=limit.cost;
    const timeValue=limit.time;
    const options=[
      ['battery',icon('zap'),'Battery percentage',`Stop at ${batteryValue}% · session estimate`],
      ['energy','kW','Energy',`Stop after ${energyValue} kWh delivered`],
      ['cost',icon('card'),'Cost',`Stop near ${costValue.toLocaleString()} AMD`],
      ['time',icon('clock'),'Time',`Stop after ${timeValue} minutes`],
      ['none','∞','No limit','Continue until you stop or the battery is full']
    ];
    let valueControl='';
    let note='The selected limit can be changed again while charging.';
    if(limit.type==='battery'){
      const preStart=appState!=='charging';
      const batteryMin=preStart?minimumBatteryTarget(charging.battery):70;
      const batteryDisabled=preStart && charging.battery>=100;
      valueControl=`<div class="range-block-card"><div><span>Battery target</span><strong id="charge-limit-value">${batteryValue}%</strong></div><input data-charge-limit-value="battery" type="range" min="${batteryMin}" max="100" step="5" value="${Math.max(batteryMin,batteryValue)}" ${batteryDisabled?'disabled':''}></div>`;
      note=preStart
        ? `Current battery is ${charging.battery}% · choose a higher target. Battery percentage is a prototype estimate because no live OEM vehicle connection is active.`
        : 'Battery percentage is a prototype session estimate because no live OEM vehicle connection is active.';
    } else if(limit.type==='energy'){
      valueControl=`<div class="range-block-card"><div><span>Energy limit</span><strong id="charge-limit-value">${energyValue} kWh</strong></div><input data-charge-limit-value="energy" type="range" min="20" max="50" step="5" value="${energyValue}"></div>`;
    } else if(limit.type==='cost'){
      valueControl=`<div class="range-block-card"><div><span>Cost limit</span><strong id="charge-limit-value">${costValue.toLocaleString()} AMD</strong></div><input data-charge-limit-value="cost" type="range" min="2500" max="5000" step="250" value="${costValue}"></div>`;
      note='The prototype stops when the running energy charge reaches the selected amount. Final fees may still differ.';
    } else if(limit.type==='time'){
      valueControl=`<div class="range-block-card"><div><span>Session time limit</span><strong id="charge-limit-value">${timeValue} min</strong></div><input data-charge-limit-value="time" type="range" min="30" max="90" step="15" value="${timeValue}"></div>`;
    } else {
      note='No automatic charging limit is set. The prototype still stops when the battery reaches 100% or when you stop the session manually.';
    }
    const preStartLimitIssue=appState!=='charging'?chargingStartLimitIssue(limit):'';
    return simpleHeaderBack('Charging limit','Choose when charging should stop automatically', `${preStartLimitIssue?`<div class="ui-feedback ui-feedback--error">${preStartLimitIssue}</div>`:''}<section class="flow-card"><small>Stop condition</small><h2>Choose a charging limit</h2><div class="choice-list">${options.map(([type,ico,title,copy])=>`<button data-charge-limit-type="${type}" class="${limit.type===type?'selected':''}"><span>${ico}</span><div><strong>${title}</strong><small>${copy}</small></div><b>${limit.type===type?'✓':'›'}</b></button>`).join('')}</div>${valueControl}</section><section class="smart-note"><span>${icon('sparkle')}</span><div><strong>${chargingLimitLabel(limit)}</strong><p>${note}</p></div></section><button class="ui-button ui-button--primary ui-button--block" data-apply-charge-limit ${preStartLimitIssue?'disabled':''}>Apply ${chargingLimitLabel(limit)}</button>`, chargeLimitReturnScreen);
}
function chargeConnectingScreen() {
    const stage = ['connecting','waiting','starting'].includes(startCharge.stage) ? startCharge.stage : 'connecting';
    const copy = stage === 'waiting'
      ? { title:'Waiting for vehicle', body:'Keep the connector fully inserted while the charger waits for the vehicle handshake.', button:'Continue when vehicle is connected', subtitle:'Vehicle detection in progress' }
      : stage === 'starting'
        ? { title:'Starting energy flow', body:'The vehicle is detected. Final electrical safety checks run before energy delivery begins.', button:'Open active charging', subtitle:'Final safety check' }
        : { title:'Connecting to charger', body:'Establishing a secure charger connection before the vehicle handshake begins.', button:'Continue connection', subtitle:'Secure connection in progress' };
    const step2 = stage === 'connecting' ? 'active' : 'done';
    const step3 = stage === 'waiting' ? 'active' : stage === 'starting' ? 'done' : '';
    const step4 = stage === 'starting' ? 'active' : '';
    const testError = stage === 'waiting'
      ? '<button class="ui-text-button ui-button--block" data-start-error="vehicle">Prototype: vehicle not detected</button>'
      : stage === 'starting'
        ? '<button class="ui-text-button ui-button--block" data-start-error="start">Prototype: start command fails</button>'
        : '<button class="ui-text-button ui-button--block" data-start-error="offline">Prototype: charger goes offline</button>';
    return layout(`<section class="connecting-stage ui-surface--dark"><div class="connecting-orbit"><span>${icon('zap')}</span></div><small>Charger ${startCharge.connector}</small><h2>${copy.title}</h2><p>${copy.body}</p><div class="connecting-steps"><span class="done">✓ Payment authorized</span><span class="${step2}">${stage==='connecting'?'•':'✓'} Charger connection</span><span class="${step3}">${stage==='starting'?'✓':'•'} Vehicle detected</span><span class="${step4}">• Start energy delivery</span></div></section><button class="ui-button ui-button--primary ui-button--block" data-finish-connecting>${copy.button}</button>${testError}`, 'Connecting', copy.subtitle);
}
function chargeStartErrorScreen() {
    const errors={
      vehicle:{title:'Vehicle not detected',body:'The charger cannot detect a vehicle handshake. Reinsert the connector firmly and try detection again.',action:'Try vehicle detection again'},
      payment:{title:'Payment authorization failed',body:`The selected payment source could not authorize ${startCharge.preauth.toLocaleString()} AMD. Choose another method or add funds.`,action:'Change payment method'},
      offline:{title:'Charger went offline',body:'Charger '+startCharge.connector+' stopped responding before energy delivery began. No charging payment was taken.',action:'Check charger again'},
      start:{title:'Charging could not start',body:'The charger completed connection checks but energy delivery did not begin. The temporary payment authorization will not be treated as a completed charging payment.',action:'Try start again'}
    };
    const e=errors[startCharge.error]||errors.offline;
    const paymentStatus=startCharge.error==='payment'?'Authorization declined':'Temporary hold only';
    const backScreen=startCharge.error==='payment'?'payment-authorize':'charge-start';
    return simpleHeaderBack('Unable to start','Your vehicle has not been charged', `<section class="start-error-card"><div class="start-error-icon">!</div><h2>${e.title}</h2><p>${e.body}</p></section><section class="ui-card"><div class="detail-lines"><div><span>Station</span><strong>${selectedStation.name}</strong></div><div><span>Charger</span><strong>${startCharge.connector}</strong></div><div><span>Payment status</span><strong>${paymentStatus}</strong></div></div></section><button class="ui-button ui-button--primary ui-button--block" data-retry-start>${e.action}</button><button class="ui-button ui-button--secondary ui-button--block" data-back-map>Find another charger</button><button class="ui-text-button ui-button--block" data-open-support>Contact support</button>`, backScreen);
}

function chargingScreen() {
    const circumference = 339.3;
    const dash = (circumference * chargingRingProgress()).toFixed(1);
    const operationalStatus=chargingOperationalStatus();
    const context=chargingSessionContext();
    const station=context.station;
    const vehicle=context.vehicle;
    const connector=context.connector;
    const limitCopy=chargeLimit.type==='battery'?`Target ${chargeLimit.battery}%`:`Limit ${chargingLimitLabel()}`;
    const remainingMetric=charging.remaining===null?'Manual':`${charging.remaining} <span>min</span>`;
    return layout(`<section class="charging-stage ui-surface--dark"><div class="charging-pulse"></div><div class="charging-ring"><svg viewBox="0 0 120 120" aria-label="Battery ${charging.battery} percent"><circle class="ring-base" cx="60" cy="60" r="54"></circle><circle class="ring-value" cx="60" cy="60" r="54" style="stroke-dasharray:${dash} ${circumference}"></circle></svg><div class="ring-copy"><small>${operationalStatus.label}</small><strong>${charging.battery}<span>%</span></strong><p>${limitCopy}</p></div></div><div class="energy-link"><span>Charger ${connector?.id || startCharge.connector}</span><i></i><b>${icon('zap')}</b><i></i><span>${vehicle?.name || 'Vehicle'}</span></div></section><section class="charging-metrics ui-surface--dark"><div><small>Power</small><strong>${charging.paused ? '0' : charging.power} <span>kW</span></strong></div><div><small>Delivered</small><strong>${charging.energy.toFixed(1)} <span>kWh</span></strong></div><div><small>Current cost</small><strong>${charging.cost.toLocaleString()} <span>AMD</span></strong></div><div><small>Remaining</small><strong>${remainingMetric}</strong></div></section><section class="info-card charging-details"><div class="section-heading"><div><small>Session details</small><h2>${station.name}</h2></div><span class="distance-pill">${connector?.type || 'CCS2'}</span></div><div class="detail-lines"><div><span>Started</span><strong>${context.started}</strong></div><div><span>Charging limit</span><strong>${chargingLimitLabel()}</strong></div><div><span>Charging speed</span><strong>${charging.speed}</strong></div><div><span>Voltage</span><strong>${chargingVoltage(connector)} V</strong></div><div><span>Idle fee starts</span><strong>${addMinutesToClock(context.started,(charging.remaining||0)+graceMinutes)}</strong></div></div></section><section class="charge-curve"><div class="section-heading"><div><small>Live charging curve</small><h2>Power delivery</h2></div><strong>${charging.paused ? '0' : charging.power} kW</strong></div><div class="curve-bars">${[56,72,88,96,93,84,76,68,59,51,43,36].map((h,i)=>`<i style="height:${h}%" class="${i<6?'active':''}"></i>`).join('')}</div><div class="curve-axis"><span>Start</span><span>Now</span><span>${chargeLimit.type==='none'?'Manual stop':'Limit'}</span></div></section><section class="charge-controls"><button data-open-charge-limit data-limit-return="charging"><span>${icon('zap')}</span><small>Limit</small><strong>${chargingLimitLabel()}</strong></button><button data-charge-speed><span>≋</span><small>Speed</small><strong>${charging.speed}</strong></button><button data-toggle-pause><span>${charging.paused ? '▶' : 'Ⅱ'}</span><small>${charging.paused ? 'Resume' : 'Pause'}</small><strong>Session</strong></button></section><button class="danger-action" data-stop-charge><span>■</span><div><small>End current session</small><strong>Stop charging</strong></div></button><section class="support-row"><button data-open-support>Contact support</button><button data-report-problem>Report a problem</button></section><button class="ui-text-button ui-button--block" data-simulate-interruption>Prototype: simulate charging interruption</button>`, 'Active charging', operationalStatus.detail);
}

function chargingSummaryScreen() {
    const session=sessions.find(x=>x.id===latestCompletedSessionId);
    const vehicle=vehicleForSession(session) || activeVehicleRecord();
    const interrupted=chargingSummary.status==='Interrupted';
    const statusLabel=interrupted?'Charging interrupted':'Charging completed';
    const heading=interrupted?'Session ended early':'Your vehicle is ready';
    const sessionPaymentStatus=session?.paymentStatus || activityPayments.find(p=>p.id===session?.paymentId)?.status || (interrupted?'Pending':'Paid');
    const paymentFailed=sessionPaymentStatus==='Failed';
    const paymentLabel=interrupted?'Estimated charge':paymentFailed?'Amount due':'Total paid';
    const paymentStatus=interrupted?'Pending review':sessionPaymentStatus;
    const energyCharge=session?.energyCharge ?? chargingSummary.cost;
    const reservationCharge=session?.reservationFee ?? 0;
    const added=Math.max(0,chargingSummary.endBattery-chargingSummary.startBattery);
    const primaryQuick=interrupted || paymentFailed
      ? `<button class="quick-card" data-view-latest-session><span class="quick-icon">${icon('history')}</span><span><small>${paymentFailed?'Payment':'Session'}</small><strong>${paymentFailed?'Resolve payment':'View details'}</strong></span></button>`
      : `<button class="quick-card" data-view-latest-receipt><span class="quick-icon">${icon('card')}</span><span><small>Payment</small><strong>View receipt</strong></span></button>`;
    return layout(`<section class="summary-success"><div class="summary-check">${interrupted||paymentFailed?'!':'✓'}</div><small>${statusLabel}</small><h2>${heading}</h2><p>${vehicle.name} · ${vehicle.plate}</p><div class="summary-battery"><strong>${chargingSummary.endBattery}%</strong><span>Session estimate · ${formatRangeKm(Math.round(chargingSummary.endBattery*5.41))} range</span></div></section><section class="session-summary-grid"><div><small>Energy delivered</small><strong>${chargingSummary.energy} kWh</strong></div><div><small>Duration</small><strong>${chargingSummary.duration} min</strong></div><div><small>Battery added</small><strong>${added}%</strong></div><div><small>${paymentLabel}</small><strong>${chargingSummary.cost.toLocaleString()} AMD</strong></div></section><section class="info-card receipt-card"><div class="section-heading"><div><small>${interrupted||paymentFailed?'Session payment':'Session receipt'}</small><h2>${latestCompletedSessionId}</h2></div><span class="distance-pill">${paymentStatus}</span></div><div class="detail-lines"><div><span>Energy charge</span><strong>${energyCharge.toLocaleString()} AMD</strong></div><div><span>${reservationCharge?'Reservation fee (paid earlier)':'Reservation fee'}</span><strong>${reservationCharge.toLocaleString()} AMD</strong></div>${interrupted?`<div><span>Reason</span><strong>${chargingSummary.reason}</strong></div>`:''}<div class="receipt-total"><span>${interrupted?'Amount under review':paymentFailed?'Amount due':'Total charged'}</span><strong>${chargingSummary.cost.toLocaleString()} AMD</strong></div></div></section><section class="insight-card"><span>${icon('sparkle')}</span><div><strong>${interrupted||paymentFailed?'What happens next':'Charging insight'}</strong><p>${interrupted?'The partial session is saved in Sessions. Payment remains pending in this prototype until the charging record is reviewed.':paymentFailed?'Charging completed, but the payment was not collected. Open the session to resolve the outstanding payment.':`You added ${added}% battery. The completed session and receipt are available in Sessions.`}</p></div></section><button class="primary-action" data-summary-home><span class="primary-icon">${icon('home')}</span><span><small>Session saved to Sessions</small><strong>Return to home</strong></span><span>${icon('chevron')}</span></button><div class="quick-grid">${primaryQuick}<button class="quick-card" data-open-parking><span class="quick-icon">${icon('parking')}</span><span><small>Parking</small><strong>Move vehicle</strong></span></button></div>`, interrupted?'Session interrupted':'Charge complete', interrupted?'Partial session saved · payment pending review':paymentFailed?'Charging complete · payment failed':'Payment processed successfully');
}


let activitySection = 'sessions';
let activityQuery = '';
let activityRange = '30 days';
let activityVehicleFilter = 'all';
let activityStationFilter = 'all';
let activityStatusFilter = 'all';
let selectedActivityId = 'VD-CS-10852';
let activityMessage = '';
let refundReason = 'Unexpected charging interruption';
let disputeReason = 'Incorrect charging amount';

const sessions = [
    { id:'VD-CS-10852', place:'Northern Avenue Hub', address:'Northern Ave. 8, Yerevan', date:'Today, 11:45', started:'11:02', ended:'11:45', energy:31.8, cost:3816, status:'Completed', charger:'04', connector:'CCS2', vehicle:'Tesla Model Y · 35 GG 505', startBattery:64, endBattery:90, averagePower:'44.4 kW', peakPower:'142 kW', paymentId:'PAY-50821', receipt:'RC-10852', energyCharge:3816, reservationFee:0, reservationPaymentId:'', reservationPaymentMethod:'', parkingFee:0, idleFee:0, vat:636, paymentMethod:'Visa •••• 5050' },
    { id:'VD-CS-10794', place:'Cascade Charge Point', address:'Tamanyan St. 10, Yerevan', date:'2 Aug, 18:40', started:'18:09', ended:'18:40', energy:18.2, cost:2146, status:'Completed', charger:'07', connector:'CCS2', vehicle:'Tesla Model Y · 35 GG 505', startBattery:42, endBattery:61, averagePower:'35.2 kW', peakPower:'118 kW', paymentId:'PAY-50172', receipt:'RC-10794', energyCharge:2146, reservationFee:0, parkingFee:0, idleFee:0, vat:358, paymentMethod:'Wallet balance' },
    { id:'VD-CS-10688', place:'Republic Square Station', address:'Abovyan St. 1, Yerevan', date:'29 Jul, 09:15', started:'09:14', ended:'09:15', energy:0, cost:0, status:'Failed', charger:'02', connector:'CCS2', vehicle:'BMW i4 · 40 AA 404', startBattery:28, endBattery:28, averagePower:'0 kW', peakPower:'0 kW', paymentId:'PAY-49308', receipt:'', energyCharge:0, reservationFee:0, parkingFee:0, idleFee:0, vat:0, paymentMethod:'Visa •••• 5050' }
];
const activityReservations = [
    {id:'VD-RS-8452', place:'Northern Avenue Hub', date:'Today, 12:30', status:'Confirmed', bay:'B-12', charger:'04', fee:500, feePaid:500, feePaymentId:'PAY-50791', feePaymentMethod:'Visa •••• 5050', vehicle:'Tesla Model Y · 35 GG 505'},
    {id:'VD-RS-8328', place:'Dalma Garden Garage', date:'30 Jul, 14:00', status:'Cancelled', bay:'A-03', charger:'Any', fee:500, feePaid:500, feePaymentId:'PAY-48290', feePaymentMethod:'Visa •••• 5050', refund:500, vehicle:'Tesla Model Y · 35 GG 505'}
];
const activityPayments = [
    {id:'PAY-50821', date:'Today, 11:46', title:'Charging payment', method:'Visa •••• 5050', amount:3816, status:'Paid', sessionId:'VD-CS-10852'},
    {id:'PAY-50791', date:'Today, 11:30', title:'Reservation fee', method:'Visa •••• 5050', amount:500, status:'Paid', reservationId:'VD-RS-8452'},
    {id:'PAY-50172', date:'2 Aug, 18:41', title:'Charging payment', method:'Wallet balance', amount:2146, status:'Paid', sessionId:'VD-CS-10794'},
    {id:'RF-48310', date:'30 Jul, 14:05', title:'Reservation refund', method:'Visa •••• 5050', amount:500, status:'Refunded', reservationId:'VD-RS-8328'},
    {id:'PAY-48290', date:'30 Jul, 13:58', title:'Reservation fee', method:'Visa •••• 5050', amount:500, status:'Paid', reservationId:'VD-RS-8328'}
];

function nextRecordId(prefix, collection){
    const max=collection.reduce((m,item)=>{ const n=Number(String(item.id||'').replace(/\D/g,'')); return Number.isFinite(n)?Math.max(m,n):m; },0);
    return `${prefix}-${max+1}`;
}
function vehicleForSession(session){
    if(!session) return null;
    if(session.vehicleId){
        const byId=vehicles.find(v=>v.id===session.vehicleId);
        if(byId) return byId;
    }
    return vehicles.find(v=>session.vehicle?.includes(v.plate) || session.vehicle?.startsWith(v.name)) || null;
}
function csvCell(value) {
    let text = value == null ? '' : String(value);
    if (/^[=+\-@]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
}
function exportSessionCsv(session) {
    if (!session || typeof document === 'undefined' || typeof Blob === 'undefined' || typeof URL === 'undefined') return false;
    const rows = [
      ['Session ID', session.id], ['Status', session.status], ['Date', session.date], ['Station', session.place], ['Address', session.address],
      ['Vehicle', session.vehicle], ['Charger', session.charger], ['Connector', session.connector], ['Start', session.started], ['End', session.ended],
      ['Start battery %', session.startBattery], ['End battery %', session.endBattery], ['Energy kWh', session.energy], ['Average power', session.averagePower], ['Peak power', session.peakPower],
      ['Charging limit', session.chargingLimit || '—'], ['Energy charge AMD', session.energyCharge ?? session.cost], ['Reservation fee AMD', session.reservationFee ?? 0], ['Reservation payment reference', session.reservationPaymentId || '—'],
      ['Parking fee AMD', session.parkingFee ?? 0], ['Idle fee AMD', session.idleFee ?? 0], ['VAT AMD', session.vat ?? 0], ['Total AMD', session.cost],
      ['Payment method', session.paymentMethod || '—'], ['Payment reference', session.paymentId || '—'], ['Receipt', session.receipt || 'Not issued'], ['End reason', session.reason || '—']
    ];
    const csv = '\ufeff' + rows.map(row => row.map(csvCell).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${session.id}-session.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    return true;
}
function notificationCategoryFor(type='success', title='', target=''){
    const value=`${title} ${target}`.toLowerCase();
    if(type==='critical' || /emergency|security|charging interrupted|charger fault|charger offline/.test(value)) return 'critical';
    if(type==='payment') return 'payment';
    if(type==='reserved') return 'reservation';
    if(type==='offer' || type==='insight') return 'offers';
    return 'charging';
}
function notificationCategoryEnabled(category){
    return category==='critical' || notificationPreferences[category] !== false;
}
function notificationInQuietHours(){
    if(!notificationPreferences.quietHours) return false;
    const parse=value=>{ const [h,m]=String(value||'00:00').split(':').map(Number); return h*60+m; };
    const start=parse(notificationPreferences.quietStart);
    const end=parse(notificationPreferences.quietEnd);
    const now=new Date();
    const current=now.getHours()*60+now.getMinutes();
    return start<=end ? current>=start && current<end : current>=start || current<end;
}
function notificationDeliverySummary(category){
    const channels=['In-app'];
    if(notificationPreferences.push) channels.push('Push');
    if(notificationPreferences.email) channels.push('Email');
    if(notificationPreferences.sms) channels.push('SMS');
    if(category!=='critical' && notificationInQuietHours() && channels.length>1) return `In-app · external alerts queued until ${notificationPreferences.quietEnd}`;
    return channels.join(' · ');
}
function addSystemNotification(title,text,type='success',target='session-detail',actionLabel='Open details',targetId=null){
    const category=notificationCategoryFor(type,title,target);
    if(!notificationCategoryEnabled(category)) return null;
    const id=notifications.reduce((m,n)=>Math.max(m,Number(n.id)||0),0)+1;
    notifications.unshift({id,group:'Today',time:'Just now',title,text,type,category,delivery:notificationDeliverySummary(category),icon:type==='payment'?'▭':type==='reserved'?'R':category==='critical'?'!':'✓',unread:true,target,actionLabel,targetId});
    return id;
}
function addMinutesToClock(value, minutes){
    const [h,m]=String(value||'00:00').split(':').map(Number);
    if(!Number.isFinite(h)||!Number.isFinite(m)) return value;
    const total=(h*60+m+minutes)%(24*60);
    return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;
}
function reservationStation(r=activeReservation){
    if(r?.stationId) return stations.find(s=>s.id===r.stationId)||selectedStation;
    return selectedStation;
}
function restoreReservationStation(){
    const station=reservationStation();
    if(station) selectedStation=station;
}
function updateReservationRecord(r,status='Confirmed',refund){
    if(!r?.id) return;
    const station=reservationStation(r);
    const vehicle=reservationVehicleRecord(r);
    const payload={id:r.id,place:station?.name||selectedStation.name,date:`${r.date}, ${r.time}`,status,type:r.type,bay:r.type==='Any available charger'?'Assigned on arrival':(r.bay||'—'),charger:(r.type==='Any available charger'||r.type==='Parking bay')?'Assigned on arrival':(r.charger||'—'),fee:Number(r.feePaid ?? reservationFee),feePaid:Number(r.feePaid ?? reservationFee),feePaymentId:r.feePaymentId||'',feePaymentMethod:r.feePaymentMethod||'',vehicleId:vehicle?.id||r.vehicleId||null,vehicle:vehicle?`${vehicle.name} · ${vehicle.plate}`:r.vehicle};
    if(refund !== undefined) payload.refund=refund;
    if(r.cancellationReason) payload.cancellationReason=r.cancellationReason;
    if(Number.isFinite(Number(r.cancelledMinutesBeforeStart))) payload.cancelledMinutesBeforeStart=Number(r.cancelledMinutesBeforeStart);
    if(r.cancellationPolicy) payload.cancellationPolicy=r.cancellationPolicy;
    const existing=activityReservations.find(x=>x.id===r.id);
    if(existing) Object.assign(existing,payload);
    else activityReservations.unshift(payload);
}
function finalizeChargingSession(status = 'Completed', reason = 'Target reached'){
    const context=chargingSessionContext();
    const vehicle=context.vehicle;
    const station=context.station;
    const connector=context.connector;
    if(!vehicle){
      stopChargingSimulation();
      activeChargingSession=null; pendingChargingVehicleId=null; pendingChargingReservationId=null;
      appState=activeReservation?'reserved':'idle'; startCharge.stage='idle';
      chargeStartMessage='A vehicle is required to complete a charging session. Add a vehicle and start again.';
      return false;
    }
    const sessionId=nextRecordId('VD-CS',sessions);
    const completed=status==='Completed';
    const amount=chargingSummary.cost;
    const linkedReservation = activeReservation && activeChargingSession?.reservationId === activeReservation.id ? activeReservation : null;
    const hadReservation=Boolean(linkedReservation);
    const paymentMethod=startCharge.payment==='Wallet'?'Wallet balance':startCharge.payment;
    const settlement=completed?settlePaymentSource(paymentMethod,amount,'Charging payment'):{ok:false,status:'Pending',method:paymentMethod,amount};
    const paymentId=nextRecordId('PAY',activityPayments);
    const paymentStatus=completed?settlement.status:'Pending';
    const receiptId=completed && settlement.ok?nextRecordId('RC',sessions.map(x=>({id:x.receipt||''}))):'';
    vehicle.battery=chargingSummary.endBattery;
    const ended=addMinutesToClock(context.started,chargingSummary.duration);
    const now=`Today, ${ended}`;
    const paymentTime=addMinutesToClock(ended,1);
    const averagePower=chargingSummary.duration>0?`${(chargingSummary.energy/(chargingSummary.duration/60)).toFixed(1)} kW`:'0 kW';
    sessions.unshift({id:sessionId,stationId:station.id,vehicleId:vehicle.id,reservationId:linkedReservation?.id||null,place:station.name,address:station.address,date:now,started:context.started,ended,energy:chargingSummary.energy,cost:amount,status,reason,charger:connector?.id||startCharge.connector,connector:connector?.type||station.connector||'CCS2',voltage:chargingVoltage(connector),bay:linkedReservation?.bay || (navigationState.assignment?.stationId===station.id?navigationState.assignment.bay:stationRouteMeta(station).defaultBay) || 'Charging bay',vehicle:`${vehicle.name} · ${vehicle.plate}`,startBattery:chargingSummary.startBattery,endBattery:chargingSummary.endBattery,averagePower,peakPower:`${Math.max(charging.power,...(activeChargingSession?.powerCurve||[]).map(point=>Number(point.power)||0))} kW`,powerCurve:[...(activeChargingSession?.powerCurve||[])],chargingLimit:chargingLimitLabel(activeChargingSession?.limit || chargeLimit),paymentId,paymentStatus,receipt:receiptId,energyCharge:amount,reservationFee:hadReservation?Number(linkedReservation.feePaid ?? reservationFee):0,reservationPaymentId:hadReservation?(linkedReservation.feePaymentId||''):'',reservationPaymentMethod:hadReservation?(linkedReservation.feePaymentMethod||''):'',parkingFee:0,idleFee:0,vat:completed?Math.round(amount/6):0,paymentMethod});
    activityPayments.unshift({id:paymentId,date:`Today, ${paymentTime}`,title:completed?'Charging payment':'Charging payment review',method:paymentMethod,amount,status:paymentStatus,sessionId,failureReason:completed&&!settlement.ok?(settlement.message||'Payment could not be completed.'):''});
    latestCompletedSessionId=sessionId; latestPaymentId=paymentId; latestReceiptId=receiptId;
    if(linkedReservation) updateReservationRecord(linkedReservation,'Completed');
    if(linkedReservation) activeReservation=null;
    activeChargingSession=null; pendingChargingVehicleId=null; pendingChargingReservationId=null; startCharge.error='';
    if(completed){
      appState='completed'; startCharge.stage='completed';
      addSystemNotification('Charging completed',`${vehicle.name} reached ${chargingSummary.endBattery}%. ${settlement.ok?`${amount.toLocaleString()} AMD was paid.`:'Payment needs attention.'}`,'success','session-detail','View session',sessionId);
      if(settlement.ok) addSystemNotification('Payment successful',`${amount.toLocaleString()} AMD · ${paymentId}`,'payment','payment-detail','View payment',paymentId);
      else addSystemNotification('Payment failed',`${amount.toLocaleString()} AMD could not be collected from ${paymentMethod}.`,'warning','payment-detail','Resolve payment',paymentId);
    } else {
      appState=activeReservation?'reserved':'idle'; startCharge.stage='interrupted';
      addSystemNotification('Charging interrupted',`${vehicle.name} stopped at ${chargingSummary.endBattery}%. Open the session for details.`,'reserved','session-detail','View session',sessionId);
      addSystemNotification('Payment pending review',`${amount.toLocaleString()} AMD estimated · ${paymentId}`,'payment','payment-detail','View payment',paymentId);
    }
    return true;
}
function finalizeParkingSession(){
    parkingSession.active=false;
    stopParkingCountdown();
    parkingSession.paymentStatus='Not required';
    parkingSession.paymentId='';
    if(parkingSession.idleCost>0){
      const method=parkingPaymentMethod();
      const settlement=settlePaymentSource(method,parkingSession.idleCost,'Idle fee');
      const paymentId=nextRecordId('PAY',activityPayments);
      activityPayments.unshift({id:paymentId,date:'Just now',title:'Idle fee',method:settlement.method||method||'No payment method',amount:parkingSession.idleCost,status:settlement.status,sessionId:latestCompletedSessionId,failureReason:settlement.ok?'':(settlement.message||'Idle fee remains unpaid.')});
      const session=latestParkingSessionRecord();
      if(session){ session.idleFee=(session.idleFee||0)+parkingSession.idleCost; session.idlePaymentStatus=settlement.status; }
      latestPaymentId=paymentId;
      parkingSession.paymentStatus=settlement.status; parkingSession.paymentId=paymentId;
      if(settlement.ok) addSystemNotification('Idle fee paid',`${parkingSession.idleCost.toLocaleString()} AMD · Bay ${parkingSession.bay}`,'payment','payment-detail','View payment',paymentId);
      else addSystemNotification('Idle fee payment failed',`${parkingSession.idleCost.toLocaleString()} AMD remains unpaid for Bay ${parkingSession.bay}.`,'warning','payment-detail','Resolve payment',paymentId);
    }
}
function cancelActiveReservation(){
    const current=activeReservation ? {...activeReservation} : {...reservation,id:'VD-RS-8452',stationId:selectedStation.id};
    const quote=reservationCancellationQuote(current);
    const refund=quote.refund;
    const refundMethod=current.feePaymentMethod || 'Original payment method';
    let refundPaymentId='';
    if(refund>0){
      if(refundMethod==='Wallet balance') walletBalance+=refund;
      refundPaymentId=nextRecordId('RF',activityPayments);
      activityPayments.unshift({id:refundPaymentId,date:'Just now',title:'Reservation refund',method:refundMethod,amount:refund,status:'Refunded',reservationId:current.id,originalPaymentId:current.feePaymentId||'',reason:quote.serviceUnavailable?'Verified service unavailable':'Cancelled within free-cancellation window'});
      latestPaymentId=refundPaymentId;
    }
    current.cancellationReason=cancellationReason;
    current.cancelledMinutesBeforeStart=quote.minutesUntilStart;
    current.cancellationPolicy=quote.serviceUnavailable?'service-unavailable':quote.freeByTime?'free-window':'late';
    updateReservationRecord(current,'Cancelled',refund);
    addSystemNotification('Reservation cancelled',refund>0?`${refund.toLocaleString()} AMD refunded to ${refundMethod}. ${quote.status}.`:`Reservation cancelled. ${quote.status}.` ,refund>0?'payment':'reserved',refund>0?'payment-detail':'activity',refund>0?'View refund':'View reservations',refundPaymentId||current.id);
    activeReservation=null; appState='idle';
    return {amount:refund,method:refundMethod,policy:quote};
}


const PROTOTYPE_TODAY_UTC = Date.UTC(2026, 7, 21);
const ACTIVITY_MONTHS = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
function activityRecordTimestamp(record) {
    if (!record) return PROTOTYPE_TODAY_UTC;
    if (record.timestamp) {
        const parsed = Date.parse(record.timestamp);
        if (Number.isFinite(parsed)) return parsed;
    }
    const value = String(record.date || record.time || '');
    if (/Today|Just now/i.test(value)) return PROTOTYPE_TODAY_UTC;
    if (/Yesterday/i.test(value)) return PROTOTYPE_TODAY_UTC - 86400000;
    const match = value.match(/(\d{1,2})\s+([A-Z][a-z]{2})(?:\s+(\d{4}))?/);
    if (!match || !(match[2] in ACTIVITY_MONTHS)) return PROTOTYPE_TODAY_UTC;
    const month = ACTIVITY_MONTHS[match[2]];
    let year = Number(match[3] || 2026);
    if (!match[3] && month > 7) year -= 1;
    return Date.UTC(year, month, Number(match[1]));
}
function activityWithinRange(record) {
    if (activityRange === 'All time') return true;
    const days = activityRange === '90 days' ? 90 : 30;
    const age = PROTOTYPE_TODAY_UTC - activityRecordTimestamp(record);
    return age >= 0 && age <= days * 86400000;
}

function activityMatches(value){ return !activityQuery || value.toLowerCase().includes(activityQuery.toLowerCase()); }
function activityToolbar(){
    const sessionFilters=activitySection==='sessions'?`<div class="activity-filter-grid"><select data-activity-vehicle aria-label="Filter by vehicle"><option value="all">All vehicles</option>${vehicles.map(v=>`<option value="${v.id}" ${String(activityVehicleFilter)===String(v.id)?'selected':''}>${v.name}</option>`).join('')}</select><select data-activity-station aria-label="Filter by station"><option value="all">All stations</option>${stations.map(st=>`<option value="${st.id}" ${String(activityStationFilter)===String(st.id)?'selected':''}>${st.name}</option>`).join('')}</select><select data-activity-status aria-label="Filter by status"><option value="all">All statuses</option>${['Completed','Interrupted','Failed'].map(status=>`<option ${activityStatusFilter===status?'selected':''}>${status}</option>`).join('')}</select></div>`:'';
    return `<section class="activity-tools"><label class="activity-search"><span>${icon('search')}</span><input data-activity-search value="${activityQuery}" placeholder="Search location, ID or payment"></label><select data-activity-range aria-label="History period"><option ${activityRange==='30 days'?'selected':''}>30 days</option><option ${activityRange==='90 days'?'selected':''}>90 days</option><option ${activityRange==='All time'?'selected':''}>All time</option></select>${sessionFilters}</section>`;
}
function sessionMatchesStructuredFilters(session){
    if(!session) return false;
    if(activityVehicleFilter!=='all'){
        const vehicle=vehicleForSession(session);
        if(String(vehicle?.id||'')!==String(activityVehicleFilter)) return false;
    }
    if(activityStationFilter!=='all'){
        const stationId=session.stationId || stations.find(st=>st.name===session.place)?.id;
        if(String(stationId||'')!==String(activityStationFilter)) return false;
    }
    if(activityStatusFilter!=='all' && session.status!==activityStatusFilter) return false;
    return true;
}
function activityScreen(){
    const tabs=[['sessions','Sessions'],['reservations','Reservations'],['payments','Payments']];
    const periodSessions=sessions.filter(activityWithinRange);
    const completedSessions=periodSessions.filter(s=>s.status==='Completed');
    const periodReservations=activityReservations.filter(r=>r.status==='Confirmed' || activityWithinRange(r));
    const periodPayments=activityPayments.filter(activityWithinRange);
    const totalEnergy=completedSessions.reduce((sum,s)=>sum+s.energy,0);
    const totalChargingCost=completedSessions.reduce((sum,s)=>sum+s.cost,0);
    const averagePrice=totalEnergy?Math.round(totalChargingCost/totalEnergy):0;
    const co2Estimate=Math.round(totalEnergy*0.84);
    let body='';
    if(activitySection==='sessions'){
      const rows=periodSessions.filter(s=>sessionMatchesStructuredFilters(s) && activityMatches(`${s.place} ${s.id} ${s.status} ${s.vehicle} ${s.charger} ${s.connector}`));
      const context=appState==='charging' ? chargingSessionContext() : null;
      const activeFilterMatch=context && (activityVehicleFilter==='all'||String(context.vehicle.id)===String(activityVehicleFilter)) && (activityStationFilter==='all'||String(context.station.id)===String(activityStationFilter)) && (activityStatusFilter==='all'||activityStatusFilter==='Charging');
      const activeVisible=context && activeFilterMatch && activityMatches(`${context.station.name} ${context.vehicle.name} Charger ${context.connector?.id || startCharge.connector} ${context.connector?.type || 'CCS2'} Charging`);
      const activeRow=activeVisible ? `<button class="activity-item" data-return-charge><span class="activity-status completed">${icon('zap')}</span><span><small>Now · ${chargingOperationalStatus().label}</small><strong>${context.station.name}</strong><em>Charger ${context.connector?.id || startCharge.connector} · ${context.connector?.type || 'CCS2'} · ${context.vehicle.name}</em></span><span class="activity-value"><strong>${charging.cost.toLocaleString()} AMD</strong><small>${charging.energy.toFixed(1)} kWh</small></span></button>` : '';
      const historyRows=rows.map(s=>`<button class="activity-item" data-open-session="${s.id}"><span class="activity-status ${s.status==='Completed'?'completed':'failed'}">${s.status==='Completed'?'✓':'!'}</span><span><small>${s.date}</small><strong>${s.place}</strong><em>${s.id} · ${s.vehicle.split(' · ')[0]}</em></span><span class="activity-value"><strong>${s.cost.toLocaleString()} AMD</strong><small>${s.energy.toFixed(1)} kWh</small></span></button>`).join('');
      body=`<div class="activity-list">${activeRow}${historyRows || (!activeRow?`<div class="activity-empty"><span>${icon('search')}</span><h2>No sessions found</h2><p>Try another search or period.</p></div>`:'')}</div>`;
    }
    if(activitySection==='reservations'){
      const rows=periodReservations.filter(r=>activityMatches(`${r.place} ${r.id} ${r.status} ${r.vehicle} ${r.charger} ${r.bay}`)).sort((a,b)=>(a.status==='Confirmed'?0:1)-(b.status==='Confirmed'?0:1));
      body=`<div class="activity-list">${rows.map(r=>{const active=r.status==='Confirmed'&&activeReservation?.id===r.id;const symbol=r.status==='Confirmed'?'R':r.status==='Completed'?'✓':r.status==='No-show'?'!':'×';return `<button class="activity-item ${r.status!=='Confirmed'?'muted':''}" data-open-activity-reservation="${r.id}"><span class="activity-status ${r.status==='Confirmed'?'reserved':r.status==='Completed'?'completed':r.status==='No-show'?'failed':''}">${symbol}</span><span><small>${active?`Starts in ${activeReservation.countdownMinutes ?? 18} min · `:''}${r.date}</small><strong>${r.place}</strong><em>${r.id} · ${r.bay&&r.bay!=='Assigned on arrival'?`Bay ${r.bay}`:'Assigned on arrival'}</em></span><span class="activity-value"><strong>${r.status}</strong><small>${r.fee.toLocaleString()} AMD</small></span></button>`}).join('') || `<div class="activity-empty"><h2>No reservations found</h2></div>`}</div>`;
    }
    if(activitySection==='payments'){
      const rows=periodPayments.filter(x=>activityMatches(`${x.title} ${x.id} ${x.status} ${x.method} ${x.sessionId||''} ${x.reservationId||''}`));
      const paidTotal=periodPayments.filter(x=>x.status==='Paid'&&x.title!=='Wallet auto top-up').reduce((sum,x)=>sum+x.amount,0);
      const refundedTotal=periodPayments.filter(x=>x.status==='Refunded').reduce((sum,x)=>sum+x.amount,0);
      body=`<div class="payment-summary"><div><small>Selected period</small><strong>${paidTotal.toLocaleString()} AMD</strong></div><div><small>Energy</small><strong>${totalEnergy.toFixed(1)} kWh</strong></div><div><small>Refunds</small><strong>${refundedTotal.toLocaleString()} AMD</strong></div></div><div class="activity-list">${rows.map(x=>`<button class="activity-item" data-open-payment="${x.id}"><span class="activity-status ${['Pending','Failed'].includes(x.status)?'failed':'completed'}">${x.status==='Refunded'?'↺':['Pending','Failed'].includes(x.status)?'!':'✓'}</span><span><small>${x.date}</small><strong>${x.title}</strong><em>${x.id} · ${x.method}</em></span><span class="activity-value"><strong>${x.status==='Refunded'?'+':''}${x.amount.toLocaleString()} AMD</strong><small>${x.status}</small></span></button>`).join('') || `<div class="activity-empty"><h2>No payments found</h2></div>`}</div>`;
    }
    return layout(`<section class="activity-hero"><div><small>Charging records</small><h2>Sessions</h2><p>Sessions, reservations and payment records in one place.</p></div><div class="activity-score"><strong>${totalEnergy.toFixed(1)}</strong><span>kWh in selected period</span></div></section><section class="monthly-overview"><div><small>Sessions</small><strong>${completedSessions.length}</strong></div><div><small>Average price</small><strong>${averagePrice} AMD/kWh</strong></div><div><small>CO₂ avoided</small><strong>${co2Estimate} kg</strong></div></section><div class="activity-tabs">${tabs.map(([id,label])=>`<button data-activity-tab="${id}" class="${activitySection===id?'active':''}">${label}</button>`).join('')}</div>${activityToolbar()}${body}<section class="insight-card"><span>${icon('sparkle')}</span><div><strong>Period insight</strong><p>Your average charging cost is ${averagePrice} AMD/kWh across completed sessions in this period.</p></div></section>`, 'Sessions', `${activityRange} · ${activitySection}`);
}

function sessionDetailScreen(){
 const s=sessions.find(x=>x.id===selectedActivityId)||sessions[0];
 const fallbackCurve=[28,48,74,92,100,96,89,80,68,56,45,35];
 const rawCurve=(s.powerCurve||[]).map(point=>Number(point.power)||0).filter(Boolean);
 const maxCurve=Math.max(1,...rawCurve);
 const curve=rawCurve.length?rawCurve.slice(-12).map(power=>Math.max(8,Math.round(power/maxCurve*100))):fallbackCurve;
 const energyCharge=s.energyCharge ?? s.cost;
 const reservationCharge=s.reservationFee ?? 0;
 const parkingCharge=s.parkingFee ?? 0;
 const idleCharge=s.idleFee ?? 0;
 const vat=s.vat ?? Math.round(s.cost/6);
 const paymentMethod=s.paymentMethod || activityPayments.find(p=>p.id===s.paymentId)?.method || 'Payment method unavailable';
 const interrupted=s.status==='Interrupted';
 const sessionPaymentStatus=s.paymentStatus || activityPayments.find(p=>p.id===s.paymentId)?.status || (s.status==='Completed'?'Paid':'Pending');
 const paymentFailed=sessionPaymentStatus==='Failed';
 const totalLabel=s.status==='Completed'?'Charging total':'Estimated charge';
 return simpleHeaderBack('Session details',`${s.id} · ${s.status}`,`${activityMessage?`<div class="ui-feedback ui-feedback--success">${activityMessage}</div>`:''}<section class="session-detail-hero ui-surface--dark"><div><small>${s.date}</small><h2>${s.place}</h2><p>${s.address}</p></div><span class="viz-badge">${s.status}</span><div class="session-energy"><strong>${s.energy.toFixed(1)}</strong><span>kWh delivered</span></div></section><section class="session-detail-metrics"><div><small>Duration</small><strong>${s.started}–${s.ended}</strong></div><div><small>Average power</small><strong>${s.averagePower}</strong></div><div><small>Peak power</small><strong>${s.peakPower}</strong></div><div><small>${totalLabel}</small><strong>${s.cost.toLocaleString()} AMD</strong></div></section><section class="charge-curve activity-curve"><div class="section-heading"><div><small>Charging curve</small><h2>Power through the session</h2></div><strong>${s.averagePower} avg.</strong></div><div class="curve-bars">${curve.map((h,i)=>`<i style="height:${s.status==='Failed'?8:h}%" class="${i<7&&s.status!=='Failed'?'active':''}"></i>`).join('')}</div><div class="curve-axis"><span>${s.started}</span><span>Peak</span><span>${s.ended}</span></div></section><section class="ui-card reservation-detail-list"><div><span>Vehicle</span><strong>${s.vehicle}</strong></div><div><span>Battery</span><strong>${s.startBattery}% → ${s.endBattery}%</strong></div><div><span>Charger</span><strong>${s.charger} · ${s.connector}</strong></div><div><span>Voltage</span><strong>${s.voltage || (s.connector==='CCS2' && Number(String(s.peakPower).replace(/\D/g,''))>=150 ? 760 : 400)} V</strong></div><div><span>Charging limit</span><strong>${s.chargingLimit||`${s.endBattery}%`}</strong></div><div><span>Energy charge</span><strong>${energyCharge.toLocaleString()} AMD</strong></div><div><span>${reservationCharge?'Reservation fee (paid earlier)':'Reservation fee'}</span><strong>${reservationCharge.toLocaleString()} AMD</strong></div>${reservationCharge&&s.reservationPaymentId?`<div><span>Reservation payment</span><strong>${s.reservationPaymentId}</strong></div>`:''}<div><span>Parking fee</span><strong>${parkingCharge.toLocaleString()} AMD</strong></div><div><span>Idle fee</span><strong>${idleCharge.toLocaleString()} AMD</strong></div><div><span>VAT included</span><strong>${interrupted?'Pending review':vat.toLocaleString()+' AMD'}</strong></div>${interrupted?`<div><span>End reason</span><strong>${s.reason||'Charging interrupted'}</strong></div>`:''}<div><span>Payment method</span><strong>${paymentMethod}</strong></div><div><span>Payment status</span><strong>${sessionPaymentStatus}</strong></div><div><span>Payment reference</span><strong>${s.paymentId}</strong></div><div><span>Receipt</span><strong>${s.receipt||'Not issued'}</strong></div></section>${s.status==='Completed'&&!paymentFailed?`<div class="activity-action-grid"><button class="ui-button ui-button--primary" data-view-receipt="${s.id}">View receipt</button><button class="ui-button ui-button--secondary" data-email-receipt>Send to email</button></div><button class="ui-button ui-button--secondary ui-button--block" data-export-session-csv="${s.id}">Export session CSV</button><div class="activity-action-grid"><button class="ui-button ui-button--secondary" data-request-refund="${s.id}">Request refund</button><button class="ui-button ui-button--secondary" data-dispute-payment="${s.paymentId}">Report billing issue</button></div>`:s.status==='Completed'&&paymentFailed?`<button class="ui-button ui-button--primary ui-button--block" data-open-payment="${s.paymentId}">Open failed payment</button><button class="ui-button ui-button--secondary ui-button--block" data-export-session-csv="${s.id}">Export session CSV</button><button class="ui-button ui-button--secondary ui-button--block" data-dispute-payment="${s.paymentId}">Report billing issue</button>`:`<button class="ui-button ui-button--secondary ui-button--block" data-export-session-csv="${s.id}">Export session CSV</button><button class="ui-button ui-button--primary ui-button--block" data-report-problem>Get technical support</button>`}`, 'session-return');
}
function activityReservationDetailScreen(){
 const r=activityReservations.find(x=>x.id===selectedActivityId)||activityReservations[0];
 const isLive=r.status==='Confirmed' && activeReservation?.id===r.id;
 const action=isLive
   ? `<button class="ui-button ui-button--primary ui-button--block" data-open-reservation-manage>Manage reservation</button>`
   : `<button class="ui-button ui-button--secondary ui-button--block" data-back-map>Find another charger</button>`;
 return simpleHeaderBack('Reservation details',`${r.id} · ${r.status}`,`<section class="reservation-status-card ui-surface--dark"><div><small>${r.date}</small><h2>${r.place}</h2><p>${r.type==='Any available charger'?'Charger & bay assigned on arrival':r.type==='Parking bay'?`Bay ${r.bay} · Charger assigned on arrival`:`${r.bay&&r.bay!=='—'?`Bay ${r.bay} · `:''}Charger ${r.charger}`}</p></div><span class="viz-badge">${isLive?'Active':r.status}</span></section><section class="ui-card reservation-detail-list"><div><span>Vehicle</span><strong>${r.vehicle}</strong></div><div><span>Reservation fee</span><strong>${r.fee.toLocaleString()} AMD</strong></div><div><span>Fee payment</span><strong>${r.feePaymentMethod || '—'}${r.feePaymentId?` · ${r.feePaymentId}`:''}</strong></div><div><span>Refund</span><strong>${(r.refund||0).toLocaleString()} AMD</strong></div><div><span>Access code</span><strong>${isLive?r.id:'Not active'}</strong></div></section>${action}`, 'activity');
}

function paymentDetailScreen(){
 const p=activityPayments.find(x=>x.id===selectedActivityId)||activityPayments[0];
 const relatedSession=p.sessionId?sessions.find(s=>s.id===p.sessionId):null;
 let details='';
 if(p.status==='Refunded') details=`<div><span>Refund amount</span><strong>${p.amount.toLocaleString()} AMD</strong></div><div><span>Reservation</span><strong>${p.reservationId||'—'}</strong></div><div><span>Refund destination</span><strong>${p.method}</strong></div><div><span>Transaction ID</span><strong>${p.id}</strong></div>`;
 else if(p.title==='Reservation fee') details=`<div><span>Reservation fee</span><strong>${p.amount.toLocaleString()} AMD</strong></div><div><span>Reservation</span><strong>${p.reservationId||'—'}</strong></div><div><span>Payment method</span><strong>${p.method}</strong></div><div><span>Transaction ID</span><strong>${p.id}</strong></div>`;
 else if(p.title==='Parking extension') details=`<div><span>Parking extension</span><strong>${p.amount.toLocaleString()} AMD</strong></div><div><span>Additional time</span><strong>${p.parkingMinutes||0} min</strong></div><div><span>Related session</span><strong>${p.sessionId||'—'}</strong></div><div><span>Payment method</span><strong>${p.method}</strong></div><div><span>Transaction ID</span><strong>${p.id}</strong></div>`;
 else if(p.title==='Idle fee') details=`<div><span>Idle fee</span><strong>${p.amount.toLocaleString()} AMD</strong></div><div><span>Related session</span><strong>${p.sessionId||'—'}</strong></div><div><span>Payment method</span><strong>${p.method}</strong></div><div><span>Transaction ID</span><strong>${p.id}</strong></div>${p.failureReason?`<div><span>Payment issue</span><strong>${p.failureReason}</strong></div>`:''}`;
 else if(p.title==='Wallet auto top-up') details=`<div><span>Wallet top-up</span><strong>${p.amount.toLocaleString()} AMD</strong></div><div><span>Funding card</span><strong>${p.method}</strong></div><div><span>Reason</span><strong>${p.topUpReason||'Automatic balance rule'}</strong></div><div><span>Transaction ID</span><strong>${p.id}</strong></div>`;
 else details=`<div><span>Charging amount</span><strong>${p.amount.toLocaleString()} AMD</strong></div><div><span>VAT included</span><strong>${['Pending','Failed'].includes(p.status)?(p.status==='Pending'?'Pending review':'Payment failed'):(relatedSession?.vat ?? Math.round(p.amount/6)).toLocaleString()+' AMD'}</strong></div><div><span>Payment method</span><strong>${p.method}</strong></div><div><span>Transaction ID</span><strong>${p.id}</strong></div>${p.failureReason?`<div><span>Payment issue</span><strong>${p.failureReason}</strong></div>`:''}`;
 return simpleHeaderBack('Payment details',`${p.id} · ${p.status}`,`${activityMessage?`<div class="ui-feedback ui-feedback--success">${activityMessage}</div>`:''}<section class="payment-detail-hero ui-surface--dark"><small>${p.date}</small><strong>${p.status==='Refunded'?'+':''}${p.amount.toLocaleString()} AMD</strong><h2>${p.title}</h2><p>${p.method}</p></section><section class="ui-card reservation-detail-list">${details}</section>${p.sessionId?`<button class="ui-button ui-button--primary ui-button--block" data-open-session="${p.sessionId}">Open charging session</button><button class="ui-button ui-button--secondary ui-button--block" data-dispute-payment="${p.id}">Report payment problem</button>`:''}`, 'payment-return');
}
function printReceipt(session){
 if(!session || typeof window==='undefined' || typeof window.open!=='function') return false;
 const paymentMethod=session.paymentMethod || activityPayments.find(p=>p.id===session.paymentId)?.method || 'Payment method unavailable';
 const vat=session.vat ?? Math.round(session.cost/6);
 const popup=window.open('','_blank','width=760,height=900');
 if(!popup) return false;
 popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${session.receipt||session.id}</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#111}h1{margin:0 0 4px}.meta{color:#666;margin-bottom:28px}.row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #ddd}.total{font-size:20px;font-weight:700;margin-top:16px}.footer{margin-top:28px;color:#555}</style></head><body><h1>VoltDrive charging receipt</h1><div class="meta">${session.receipt||'Not issued'} · ${session.date}</div><div class="row"><span>Station</span><strong>${session.place}</strong></div><div class="row"><span>Vehicle</span><strong>${session.vehicle}</strong></div><div class="row"><span>Energy</span><strong>${session.energy.toFixed(1)} kWh</strong></div><div class="row"><span>VAT included</span><strong>${vat.toLocaleString()} AMD</strong></div><div class="row total"><span>Total paid</span><strong>${session.cost.toLocaleString()} AMD</strong></div><div class="footer">${paymentMethod} · ${session.paymentId||'—'}</div><script>window.onload=()=>setTimeout(()=>window.print(),100);<\/script></body></html>`);
 popup.document.close();
 return true;
}
function receiptScreen(){
 const s=sessions.find(x=>x.id===selectedActivityId)||sessions[0];
 const paymentMethod=s.paymentMethod || activityPayments.find(p=>p.id===s.paymentId)?.method || 'Payment method unavailable';
 const vat=s.vat ?? Math.round(s.cost/6);
 return simpleHeaderBack('Session receipt',s.receipt||s.id,`${activityMessage?`<div class="ui-feedback ui-feedback--success">${activityMessage}</div>`:''}<section class="receipt-document"><div class="receipt-brand"><span>${icon('shield')}</span><div><strong>VoltDrive</strong><small>Charging receipt</small></div></div><div class="receipt-document-title"><small>Receipt number</small><h2>${s.receipt||'Not issued'}</h2><p>${s.date} · ${s.paymentStatus || (s.status==='Completed'?'Paid':s.status)}</p></div><div class="receipt-lines"><div><span>Charging ${s.energy.toFixed(1)} kWh</span><strong>${s.cost.toLocaleString()} AMD</strong></div><div><span>VAT included</span><strong>${vat.toLocaleString()} AMD</strong></div><div class="total"><span>${s.paymentStatus==='Failed'?'Amount due':'Total paid'}</span><strong>${s.cost.toLocaleString()} AMD</strong></div></div><div class="receipt-footer"><span>${s.place}</span><span>${s.vehicle}</span><span>${paymentMethod}</span></div></section><button class="ui-button ui-button--primary ui-button--block" data-download-invoice>Print / Save PDF</button><button class="ui-button ui-button--secondary ui-button--block" data-email-receipt>Email receipt</button>`, 'receipt-return');
}
function refundRequestScreen(){
 const s=sessions.find(x=>x.id===selectedActivityId)||sessions[0];
 return simpleHeaderBack('Request refund',s.id,`${activityMessage?`<div class="ui-feedback ui-feedback--success">${activityMessage}</div>`:''}<section class="ui-card ui-form"><label><span>Reason</span><select id="refund-reason"><option ${refundReason==='Unexpected charging interruption'?'selected':''}>Unexpected charging interruption</option><option>Charger delivered less energy</option><option>Duplicate payment</option><option>Reservation problem</option><option>Other</option></select></label><label><span>Additional details</span><textarea id="refund-details" rows="4" placeholder="Explain what happened"></textarea></label></section><section class="cost-card"><div><span>Maximum eligible refund</span><strong>${s.cost.toLocaleString()} AMD</strong></div><div><span>Review time</span><strong>1–3 business days</strong></div><small>Submitting a request does not guarantee a refund. We will review charger and payment records.</small></section><button class="ui-button ui-button--primary ui-button--block" data-submit-refund>Submit refund request</button>`, 'session-detail');
}
function disputePaymentScreen(){
 const p=activityPayments.find(x=>x.id===selectedActivityId)||activityPayments[0];
 return simpleHeaderBack('Report billing issue',p.id,`${activityMessage?`<div class="ui-feedback ui-feedback--success">${activityMessage}</div>`:''}<section class="ui-card ui-form"><label><span>Issue type</span><select id="dispute-reason"><option ${disputeReason==='Incorrect charging amount'?'selected':''}>Incorrect charging amount</option><option>Payment charged twice</option><option>Unknown transaction</option><option>Refund not received</option></select></label><label><span>Description</span><textarea rows="4" placeholder="Tell us what looks incorrect"></textarea></label></section><section class="ui-card"><small>Payment under review</small><h2>${p.amount.toLocaleString()} AMD</h2><p class="section-copy">${p.title} · ${p.date} · ${p.method}</p></section><button class="ui-button ui-button--primary ui-button--block" data-submit-dispute>Send billing report</button>`, 'payment-dispute-return');
}

function accountScreen(){
    const activeVehicle=vehicles.find(v=>v.active) || vehicles[0];
    const defaultMethod=defaultPaymentMethod();
    return layout(`<section class="profile-card"><div class="profile-avatar">${profile.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><div><small>${billingProfile.company?'Business account · '+billingProfile.company:'Personal account'}</small><h2>${profile.name}</h2><p>${profile.email}</p></div><button class="ui-icon-button" data-edit-profile aria-label="Edit profile">${icon('chevron')}</button></section><section class="account-balance"><div><small>Wallet balance</small><strong>${walletBalance.toLocaleString()} AMD</strong><p>Optional balance · Automatic top-up ${autoTopUp.enabled?'enabled':'disabled'}</p></div><button class="ui-button ui-button--secondary ui-button--compact" data-add-funds>${icon('wallet')} Add funds</button></section><section class="account-section"><div class="section-heading"><div><small>Garage</small><h2>Your vehicles</h2></div><button class="ui-text-button" data-manage-vehicle>Manage</button></div>${vehicles.map(v=>`<button class="vehicle-account-row ${v.active?'is-active':'muted'}" data-edit-vehicle="${v.id}"><span class="mini-car">${icon('car')}</span><span><small>${v.active?'Active vehicle':'Vehicle'}</small><strong>${v.name}</strong><em>${v.plate} · ${v.connector} · Limit ${v.limit}%</em></span><span class="vehicle-battery">${v.battery}%</span></button>`).join('')}</section><section class="account-section"><div class="section-heading"><div><small>Payments</small><h2>Payment methods</h2></div><button class="ui-text-button" data-manage-payments>Manage</button></div>${defaultMethod?`<div class="payment-method"><span class="card-symbol">${defaultMethod.brand}</span><div><strong>•••• ${defaultMethod.last4}</strong><small>Default payment card</small></div><span>✓</span></div>`:`<div class="payment-method"><span class="card-symbol">+</span><div><strong>No saved card</strong><small>Add a card to charge directly</small></div><span>${icon('chevron')}</span></div>`}</section><section class="settings-list"><button data-notifications><span>${icon('bell')}</span><div><strong>Notifications</strong><small>Charging, reservations and payments</small></div><span>${icon('chevron')}</span></button><button data-open-security><span>${icon('shield')}</span><div><strong>Security & privacy</strong><small>Password, 2FA and connected devices</small></div><span>${icon('chevron')}</span></button><button data-open-access-methods><span>⌁</span><div><strong>Charging access</strong><small>RFID cards and Plug & Charge</small></div><span>${icon('chevron')}</span></button><button data-open-language-region><span>◎</span><div><strong>Language & region</strong><small>${accountPreferences.language} · ${accountPreferences.country} · ${accountPreferences.currency}</small></div><span>${icon('chevron')}</span></button><button data-open-preferences><span>◐</span><div><strong>Units</strong><small>${accountPreferences.distance} · ${accountPreferences.energy}</small></div><span>${icon('chevron')}</span></button><button data-open-privacy><span>◈</span><div><strong>Privacy & data</strong><small>Permissions, analytics and account deletion</small></div><span>${icon('chevron')}</span></button><button data-open-billing><span>▤</span><div><strong>Billing & subscription</strong><small>${billingProfile.plan} · invoices and tax details</small></div><span>${icon('chevron')}</span></button><button data-open-legal><span>§</span><div><strong>Legal</strong><small>Terms, privacy policy and licences</small></div><span>${icon('chevron')}</span></button><button data-open-prototype-tools><span>⚙</span><div><strong>Prototype tools</strong><small>Demo states and onboarding reset</small></div><span>${icon('chevron')}</span></button><button data-open-support><span>?</span><div><strong>Help & support</strong><small>FAQ, live chat and charger support</small></div><span>${icon('chevron')}</span></button></section>`, 'Account', `${activeVehicle.name} · ${activeVehicle.battery}% battery`);
}


function accessMethodsScreen(){
 const vehicle=vehicles.find(v=>v.id===plugCharge.vehicleId)||vehicles[0];
 return simpleHeaderBack('Charging access','RFID cards and Plug & Charge', `${accessMessage?`<div class="ui-feedback ui-feedback--success">${accessMessage}</div>`:''}<section class="access-hero"><div><small>Fast authentication</small><h2>Start charging without opening the app</h2><p>Use a registered RFID card or let a compatible vehicle identify itself automatically.</p></div><span>⌁</span></section><section class="account-section"><div class="section-heading"><div><small>Physical access</small><h2>RFID cards</h2></div><button class="ui-text-button" data-add-rfid>Add card</button></div>${rfidCards.length?`<div class="rfid-list">${rfidCards.map(c=>{const v=vehicles.find(x=>x.id===c.vehicleId);return `<button class="ui-list-item rfid-row" data-edit-rfid="${c.id}"><span class="rfid-chip">RFID</span><span><small>${c.active?'Active card':'Disabled'}</small><strong>${c.name}</strong><em>${c.number} · ${v?.name||'All vehicles'}</em></span><span>${icon('chevron')}</span></button>`}).join('')}</div>`:`<div class="ui-state ui-state--empty"><span>RFID</span><h2>No cards added</h2><p>Add a card to start charging without scanning a QR code.</p></div>`}</section><section class="ui-card plug-charge-card"><div class="section-heading"><div><small>Vehicle authentication</small><h2>Plug & Charge</h2></div><span class="viz-badge ${plugCharge.enabled?'is-current':''}">${plugCharge.enabled?'Active':'Inactive'}</span></div><div class="plug-vehicle"><span class="ui-list-icon">${icon('car')}</span><span><small>Selected vehicle</small><strong>${vehicle.name}</strong><em>${vehicle.plate} · ${vehicle.connector}</em></span></div><div class="detail-lines"><div><span>Compatibility</span><strong>${plugCharge.supported?'Supported':'Not supported'}</strong></div><div><span>Certificate</span><strong>${plugCharge.certificate}</strong></div><div><span>Provider</span><strong>${plugCharge.provider}</strong></div></div><button class="ui-button ${plugCharge.enabled?'ui-button--secondary':'ui-button--primary'} ui-button--block" data-configure-plug-charge>${plugCharge.enabled?'Manage Plug & Charge':'Set up Plug & Charge'}</button></section>`, 'account');
}
function rfidEditorScreen(){
 const card=rfidCards.find(c=>c.id===editingRfidId);
 return simpleHeaderBack(card?'Edit RFID card':'Add RFID card','Assign access to a vehicle', `${accessMessage?`<div class="ui-feedback ui-feedback--success">${accessMessage}</div>`:''}<section class="rfid-scan-card"><span>RFID</span><small>Card reader</small><h2>${card?'Card detected':'Hold your card near the reader'}</h2><p>${card?card.number:'Prototype mode can simulate a detected RFID identifier.'}</p>${card?'':`<button class="ui-button ui-button--secondary ui-button--block" data-simulate-rfid>Simulate card detected</button>`}</section><section class="ui-card ui-form"><label><span>Card name</span><input id="rfid-name" value="${card?.name||'Driver RFID'}"></label><label><span>RFID number</span><input id="rfid-number" value="${card?.number||''}" placeholder="Detect or enter card number"></label><label><span>Assigned vehicle</span><select id="rfid-vehicle">${vehicles.map(v=>`<option value="${v.id}" ${v.id===(card?.vehicleId||vehicles[0]?.id)?'selected':''}>${v.name} · ${v.plate}</option>`).join('')}</select></label><label class="ui-list-item security-toggle"><span class="ui-list-icon">✓</span><span><small>Card status</small><strong>Active RFID card</strong><em>Allow charging authorization with this card</em></span><input class="ui-switch" id="rfid-active" type="checkbox" ${card?.active!==false?'checked':''}></label></section><button class="ui-button ui-button--primary ui-button--block" data-save-rfid>${card?'Save changes':'Add RFID card'}</button>${card?`<button class="ui-button ui-button--danger ui-button--block" data-delete-rfid="${card.id}">Remove card</button>`:''}`, 'access-methods');
}
function plugChargeScreen(){
 const vehicle=vehicles.find(v=>v.id===plugCharge.vehicleId)||vehicles[0];
 return simpleHeaderBack('Plug & Charge','Vehicle certificate and compatibility', `${accessMessage?`<div class="ui-feedback ui-feedback--success">${accessMessage}</div>`:''}<section class="plug-charge-hero"><span>ϟ</span><small>Automatic authentication</small><h2>${plugCharge.enabled?'Plug & Charge is active':'Connect your vehicle identity'}</h2><p>Compatible chargers can identify the vehicle, authorize payment and start a session after the cable is connected.</p></section><section class="ui-card ui-form"><label><span>Vehicle</span><select id="plug-vehicle">${vehicles.map(v=>`<option value="${v.id}" ${v.id===plugCharge.vehicleId?'selected':''}>${v.name} · ${v.plate}</option>`).join('')}</select></label></section><section class="ui-card"><div class="compatibility-check"><span>${plugCharge.supported?'✓':'!'}</span><div><small>Compatibility check</small><strong>${vehicle.name} ${plugCharge.supported?'supports Plug & Charge':'is not compatible'}</strong><p>${plugCharge.supported?'CCS2 · ISO 15118 compatible vehicle profile detected.':'Use QR, RFID or the mobile app to start charging.'}</p></div></div><div class="detail-lines"><div><span>Certificate status</span><strong>${plugCharge.certificate}</strong></div><div><span>Payment source</span><strong>Visa •••• 5050</strong></div><div><span>Renewal</span><strong>${plugCharge.enabled?'Automatic':'Not scheduled'}</strong></div></div></section>${plugCharge.supported?`<button class="ui-button ${plugCharge.enabled?'ui-button--danger':'ui-button--primary'} ui-button--block" data-toggle-plug-charge>${plugCharge.enabled?'Disable Plug & Charge':'Activate certificate'}</button>`:''}`, 'access-methods');
}
function garageScreen(){
 return simpleHeaderBack('Vehicle garage','Choose and manage your EVs', `<section class="ui-card"><div class="section-heading"><div><small>Registered vehicles</small><h2>${vehicles.length} vehicles</h2></div><button class="ui-button ui-button--secondary ui-button--compact" data-add-vehicle>＋ Add</button></div><div class="ui-stack">${vehicles.map(v=>`<div class="ui-list-item garage-vehicle-row ${v.active?'is-selected':''}"><button class="ui-list-main" data-set-active-vehicle="${v.id}"><span class="ui-list-icon">${icon('car')}</span><span><small>${v.active?'Active vehicle':'Tap to activate'}</small><strong>${v.name}</strong><em>${v.plate} · ${v.connector}</em></span><span><strong>${v.battery}%</strong><small>Limit ${v.limit}%</small></span></button><button class="ui-icon-button" data-edit-vehicle="${v.id}" aria-label="Edit ${v.name}">${icon('chevron')}</button></div>`).join('')}</div></section>`, 'account');
}
function addVehicleScreen(){
 const current=vehicles.find(v=>v.id===editingVehicleId);
 const [brand,...modelParts]=(current?.name || 'Hyundai IONIQ 5').split(' ');
 const model=modelParts.join(' ');
 const batteryCapacity=current?.batteryCapacity ?? 75;
 const currentBattery=current?.battery ?? 52;
 const ownership=current?.ownership || 'Personal';
 const oemStatus=current?.oemStatus || 'Not connected';
 const homeCharging=current?.homeCharging || 'Not configured';
 const deleteBlockReason=current?vehicleDeletionBlockReason(current.id):'';
 return simpleHeaderBack(current?'Edit vehicle':'Add vehicle','Compatibility and charging preferences', `${vehicleEditorMessage?`<div class="ui-feedback ui-feedback--error">${vehicleEditorMessage}</div>`:''}<section class="ui-card ui-form"><label><span>Manufacturer</span><select id="vehicle-brand">${['Hyundai','Kia','Mercedes-Benz','Tesla','BMW'].map(x=>`<option ${x===brand?'selected':''}>${x}</option>`).join('')}</select></label><label><span>Model</span><input id="vehicle-model" value="${model}"></label><label><span>Registration number</span><input id="vehicle-plate" value="${current?.plate || '77 EV 777'}"></label><label><span>VIN</span><input id="vehicle-vin" value="${current?.vin || ''}" placeholder="Optional vehicle identification number"></label><label><span>Connector</span><select id="vehicle-connector">${['CCS2','Type 2','CHAdeMO'].map(x=>`<option ${x===(current?.connector||'CCS2')?'selected':''}>${x}</option>`).join('')}</select></label><label><span>Battery capacity</span><input id="vehicle-capacity" type="number" min="10" max="250" step="0.1" value="${batteryCapacity}"></label><label><span>Current battery</span><input id="vehicle-battery" type="number" min="0" max="100" step="1" value="${currentBattery}"></label><label><span>Ownership</span><select id="vehicle-ownership">${['Personal','Company'].map(x=>`<option ${x===ownership?'selected':''}>${x}</option>`).join('')}</select></label><label><span>Home charging</span><select id="vehicle-home-charging">${['Not configured','Configured manually'].map(x=>`<option ${x===homeCharging?'selected':''}>${x}</option>`).join('')}</select></label><label><span>Preferred charging limit</span><input id="vehicle-limit" data-vehicle-limit type="range" min="60" max="100" step="5" value="${current?.limit||85}"><strong id="vehicle-limit-value">${current?.limit||85}%</strong></label><label class="ui-check-row"><input type="checkbox" id="plug-charge" ${current?.plugAndCharge?'checked':''}><span><strong>Plug & Charge</strong><small>Automatically identify this vehicle at compatible chargers.</small></span></label></section><section class="ui-card"><div class="detail-lines"><div><span>OEM connection</span><strong>${oemStatus}</strong></div><div><span>Battery data</span><strong>${oemStatus==='Connected'?'Vehicle connected':'Manual / Last reported'}</strong></div><div><span>Manual update</span><strong>${currentBattery}% · used on Home and charging estimates</strong></div></div></section>${current?`<section class="ui-card"><div class="section-heading"><div><small>Charging history</small><h2>${sessions.filter(session=>vehicleForSession(session)?.id===current.id).length} sessions</h2></div><button class="ui-text-button" data-vehicle-history="${current.id}">View all</button></div><div class="detail-lines">${sessions.filter(session=>vehicleForSession(session)?.id===current.id).slice(0,2).map(session=>`<div><span>${session.date}</span><strong>${session.place} · ${session.energy.toFixed(1)} kWh</strong></div>`).join('')||'<div><span>History</span><strong>No charging sessions yet</strong></div>'}</div></section>`:''}<button class="ui-button ui-button--primary ui-button--block" data-save-vehicle>${current?'Save changes':'Save vehicle'}</button>${current?(deleteBlockReason?`<div class="ui-feedback ui-feedback--warning">${deleteBlockReason}</div><button class="ui-button ui-button--danger ui-button--block" disabled>Delete vehicle</button>`:`<button class="ui-button ui-button--danger ui-button--block" data-delete-vehicle="${current.id}">Delete vehicle</button>`):''}`, 'vehicle-editor-return');
}
function walletScreen(){
 const method=paymentMethods.find(p=>p.id===selectedPaymentId) || paymentMethods[0];
 const defaultMethod=defaultPaymentMethod();
 return simpleHeaderBack('Payments & wallet','Cards first, optional wallet balance', `${accountMessage?`<div class="ui-feedback ui-feedback--success">${accountMessage}</div>`:''}<section class="ui-card"><div class="section-heading"><div><small>Payment cards</small><h2>Saved methods</h2></div><button class="ui-text-button" data-add-payment>Add card</button></div><div class="ui-stack">${paymentMethods.map(p=>`<button class="ui-list-item ${p.id===selectedPaymentId?'is-selected':''}" data-select-payment="${p.id}"><span class="ui-list-icon">${p.brand}</span><span><small>${p.active?'Default card':'Payment card'}</small><strong>•••• ${p.last4}</strong><em>Expires ${p.expiry}</em></span><span>${p.active?'✓':icon('chevron')}</span></button>`).join('') || `<div class="ui-state ui-state--empty"><h2>No payment cards</h2><p>Add a card to pay directly after each charging session.</p></div>`}</div>${method && !method.active?`<button class="ui-button ui-button--secondary ui-button--block" data-set-default-payment="${method.id}">Set as default card</button>`:''}${method?`<button class="ui-button ui-button--danger ui-button--block" data-remove-payment="${method.id}">Remove selected card</button>`:''}</section><section class="wallet-hero"><small>Optional wallet balance</small><strong>${walletBalance.toLocaleString()} AMD</strong><p>${defaultMethod?`Direct charging uses ${paymentMethodLabel(defaultMethod)} by default.`:'Wallet can be used when no card is selected.'}</p></section><section class="ui-card"><div class="section-heading"><div><small>Quick top-up</small><h2>Select amount</h2></div></div><div class="ui-segment-grid">${[2000,5000,10000,20000].map(x=>`<button data-topup="${x}" class="${walletTopUp===x?'is-selected':''}">${x.toLocaleString()} AMD</button>`).join('')}</div><button class="ui-button ui-button--primary ui-button--block" data-confirm-topup>Add ${walletTopUp.toLocaleString()} AMD</button></section><section class="ui-card"><div class="section-heading"><div><small>Automatic balance</small><h2>Auto top-up</h2></div></div><label class="ui-list-item security-toggle"><span class="ui-list-icon">↻</span><span><small>Wallet automation</small><strong>Automatic top-up</strong><em>Add funds before your balance becomes too low</em></span><input class="ui-switch" type="checkbox" data-auto-topup-toggle ${autoTopUp.enabled?'checked':''}></label><div class="ui-form-grid ${autoTopUp.enabled?'':'is-disabled'}"><label><span>When balance is below</span><select id="auto-threshold" ${autoTopUp.enabled?'':'disabled'}>${[1000,2000,5000].map(x=>`<option value="${x}" ${autoTopUp.threshold===x?'selected':''}>${x.toLocaleString()} AMD</option>`).join('')}</select></label><label><span>Top up amount</span><select id="auto-amount" ${autoTopUp.enabled?'':'disabled'}>${[5000,10000,20000].map(x=>`<option value="${x}" ${autoTopUp.amount===x?'selected':''}>${x.toLocaleString()} AMD</option>`).join('')}</select></label></div><button class="ui-button ui-button--secondary ui-button--block" data-save-auto-topup>Save auto top-up</button></section>`, 'wallet-return');
}
function editProfileScreen(){
 return simpleHeaderBack('Edit profile','Personal and billing information', `${accountMessage?`<div class="ui-feedback ui-feedback--success">${accountMessage}</div>`:''}<section class="profile-editor"><div class="profile-avatar profile-avatar--large">${profile.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><button class="ui-text-button" data-change-photo>Change photo</button></section><section class="ui-card ui-form"><label><span>Full name</span><input id="profile-name" value="${profile.name}"></label><label><span>Email</span><input id="profile-email" type="email" value="${profile.email}"></label><label><span>Phone</span><input id="profile-phone" value="${profile.phone}"></label><label><span>Billing address</span><input id="profile-address" value="${profile.address}"></label></section><button class="ui-button ui-button--primary ui-button--block" data-save-profile>Save profile</button>`, 'account');
}
function languageRegionScreen(){
 return simpleHeaderBack('Language & region','Local charging and billing preferences', `${accountMessage?`<div class="ui-feedback ui-feedback--success">${accountMessage}</div>`:''}<section class="ui-card ui-form"><label><span>Application language</span><select id="pref-language">${['English','Русский','Հայերեն'].map(x=>`<option ${accountPreferences.language===x?'selected':''}>${x}</option>`).join('')}</select></label><label><span>Country or region</span><select id="pref-country">${['Armenia','Georgia','Germany','United Arab Emirates'].map(x=>`<option ${accountPreferences.country===x?'selected':''}>${x}</option>`).join('')}</select></label><label><span>Default currency</span><select id="pref-currency">${['AMD','EUR','USD','GEL','AED'].map(x=>`<option ${accountPreferences.currency===x?'selected':''}>${x}</option>`).join('')}</select></label></section><section class="ui-card info-note"><strong>Regional changes affect tariffs and taxes</strong><p>Amounts are converted for this prototype using fixed demo exchange rates. Existing receipt records keep their original transaction data.</p></section><button class="ui-button ui-button--primary ui-button--block" data-save-language-region>Save region settings</button>`, 'account');
}
function preferencesScreen(){
 return simpleHeaderBack('Units','Distance and energy display', `${accountMessage?`<div class="ui-feedback ui-feedback--success">${accountMessage}</div>`:''}<section class="ui-card ui-form"><label><span>Distance</span><select id="pref-distance"><option ${accountPreferences.distance==='Kilometres'?'selected':''}>Kilometres</option><option ${accountPreferences.distance==='Miles'?'selected':''}>Miles</option></select></label><label><span>Energy</span><select id="pref-energy"><option selected>kWh</option></select></label></section><button class="ui-button ui-button--primary ui-button--block" data-save-preferences>Save preferences</button>`, 'account');
}
function privacyScreen(){
 const permissionRows=[['location','●','Location','Nearby stations and arrival-aware actions'],['camera','▦','Camera','QR charger scanning'],['notifications','◌','Push notifications','Charging, reservation and payment alerts']];
 return simpleHeaderBack('Privacy & data','Control how your information is used', `${accountMessage?`<div class="ui-feedback ui-feedback--success">${accountMessage}</div>`:''}<section class="ui-card"><div class="section-heading"><div><small>Permissions</small><h2>App access</h2></div></div>${permissionRows.map(([key,ico,title,text])=>`<button class="ui-list-item" data-manage-permission="${key}"><span class="ui-list-icon">${ico}</span><span><small>${title}</small><strong>${permissionStatusLabel(permissionState[key])}</strong><em>${text}</em></span><span>${icon('chevron')}</span></button>`).join('')}</section><section class="ui-card"><label class="ui-list-item security-toggle"><span class="ui-list-icon">A</span><span><small>Product improvement</small><strong>Usage analytics</strong><em>Share anonymous interaction and performance data</em></span><input class="ui-switch" type="checkbox" data-privacy-toggle="analytics" ${accountPreferences.analytics?'checked':''}></label><label class="ui-list-item security-toggle"><span class="ui-list-icon">M</span><span><small>Personalisation</small><strong>Marketing data</strong><em>Use activity to personalise offers and recommendations</em></span><input class="ui-switch" type="checkbox" data-privacy-toggle="marketingData" ${accountPreferences.marketingData?'checked':''}></label></section><section class="ui-card"><div><small>Your data</small><h2>Download account data</h2><p>Prepare a copy of profile, vehicles, charging sessions and payments.</p></div><button class="ui-button ui-button--secondary ui-button--block" data-download-data>Request data export</button></section><section class="ui-card security-danger"><div><small>Permanent action</small><strong>Delete VoltDrive account</strong><p>Vehicles, wallet access and personal settings will be removed. Financial records may remain where legally required.</p></div><button class="ui-button ui-button--danger ui-button--block" data-open-delete-account>Delete account</button></section>`, 'account');
}
function deleteAccountScreen(){
 return simpleHeaderBack('Delete account','This action cannot be undone', `${accountMessage?`<div class="ui-feedback ui-feedback--error">${accountMessage}</div>`:''}<section class="delete-account-hero"><span>!</span><h2>Delete your VoltDrive account?</h2><p>You will lose access to vehicles, reservations, wallet preferences and charging history in the app.</p></section><section class="ui-card ui-form"><label><span>Reason</span><select id="delete-reason"><option>I no longer use VoltDrive</option><option>I have privacy concerns</option><option>I created another account</option><option>Other</option></select></label><label><span>Type DELETE to confirm</span><input id="delete-confirm" placeholder="DELETE"></label><label class="ui-check-row"><input id="delete-understood" type="checkbox"><span><strong>I understand this is permanent</strong><small>Legal invoices and transaction records may be retained.</small></span></label></section><button class="ui-button ui-button--danger ui-button--block" data-confirm-delete-account>Delete my account</button>`, 'privacy');
}


function authLayout(body){
    return `<div class="stage onboarding-stage"><div class="phone-shell onboarding-shell auth-shell"><div class="noise"></div><header class="onboarding-brand"><div class="brand-mark"><span>${icon('shield')}</span><span>VoltDrive</span></div></header><main class="content onboarding-content">${body}</main></div><aside class="prototype-notes"><div class="brand-mark"><span>${icon('shield')}</span><span>VoltDrive</span></div><h2>Authentication flow</h2><p>Existing drivers sign in immediately. New drivers create an account and continue through setup.</p><div class="note-card"><strong>Existing user</strong><span>Login → Home</span></div><div class="note-card"><strong>New user</strong><span>Register → Setup → Home</span></div></aside></div>`;
}
function authScreen() {
    if(authMode==='login') return authLayout(`<button class="ui-back ui-back--inline" data-auth-back>${icon('back')}</button><section class="auth-copy"><small>Welcome back</small><h1>Sign in to VoltDrive.</h1><p>Access your vehicles, reservations, wallet and charging history.</p></section>${authMessage?`<div class="ui-feedback ui-feedback--error">${authMessage}</div>`:''}<section class="ui-card ui-form"><label><span>Email or phone</span><input id="login-identity" type="text" value="alex.rowan@example.com" autocomplete="username"></label><label><span>Password</span><input id="login-password" type="password" value="voltdrive2026" autocomplete="current-password"></label><button class="ui-text-button auth-forgot" type="button" data-forgot-password>Forgot password?</button></section><button class="ui-button ui-button--primary ui-button--block" data-login-submit>Sign in</button><div class="auth-switch"><span>New to VoltDrive?</span><button class="ui-text-button" data-auth-register>Create account</button></div>`);
    if(authMode==='register') return authLayout(`<button class="ui-back ui-back--inline" data-auth-back>${icon('back')}</button><section class="auth-copy"><small>Create account</small><h1>Start charging with one secure profile.</h1><p>After verification we will configure your region, vehicle and payment method.</p></section>${authMessage?`<div class="ui-feedback ui-feedback--error">${authMessage}</div>`:''}<section class="ui-card ui-form"><label><span>Full name</span><input id="register-name" value="${onboardingData.name}" autocomplete="name"></label><label><span>Email</span><input id="register-email" type="email" value="${onboardingData.email}" autocomplete="email"></label><label><span>Password</span><input id="register-password" type="password" value="voltdrive2026" autocomplete="new-password"></label><label><span>Confirm password</span><input id="register-confirm" type="password" value="voltdrive2026" autocomplete="new-password"></label><label class="ui-check-row"><input id="register-terms" type="checkbox" checked><span>I accept the Terms of Service and Privacy Policy.</span></label></section><button class="ui-button ui-button--primary ui-button--block" data-register-submit>Create account</button><div class="auth-switch"><span>Already have an account?</span><button class="ui-text-button" data-auth-login>Sign in</button></div>`);
    if(authMode==='verify') return authLayout(`<button class="ui-back ui-back--inline" data-auth-register>${icon('back')}</button><section class="auth-copy"><small>Verify your email</small><h1>Enter the 6-digit code.</h1><p>We sent a confirmation code to <strong>${onboardingData.email}</strong>.</p></section>${authMessage?`<div class="ui-feedback ui-feedback--error">${authMessage}</div>`:''}<section class="ui-card"><div class="otp-grid" aria-label="Verification code"><input inputmode="numeric" maxlength="1" value="1"><input inputmode="numeric" maxlength="1" value="2"><input inputmode="numeric" maxlength="1" value="3"><input inputmode="numeric" maxlength="1" value="4"><input inputmode="numeric" maxlength="1" value="5"><input inputmode="numeric" maxlength="1" value="6"></div><div class="auth-helper-row"><span>Code expires in 04:58</span><button class="ui-text-button" type="button" data-resend-code>Resend code</button></div></section><button class="ui-button ui-button--primary ui-button--block" data-verify-submit>Verify and continue</button>`);
    if(authMode==='forgot') return authLayout(`<button class="ui-back ui-back--inline" data-auth-login>${icon('back')}</button><section class="auth-copy"><small>Reset password</small><h1>Recover your account.</h1><p>Enter the email or phone number connected to VoltDrive.</p></section>${authMessage?`<div class="ui-feedback ui-feedback--error">${authMessage}</div>`:''}<section class="ui-card ui-form"><label><span>Email or phone</span><input id="reset-identity" value="alex.rowan@example.com" autocomplete="username"></label></section><button class="ui-button ui-button--primary ui-button--block" data-reset-request>Send recovery code</button>`);
    if(authMode==='reset-code') return authLayout(`<button class="ui-back ui-back--inline" data-forgot-password>${icon('back')}</button><section class="auth-copy"><small>Security code</small><h1>Confirm it is you.</h1><p>Enter the 6-digit recovery code sent to your contact.</p></section>${authMessage?`<div class="ui-feedback ui-feedback--error">${authMessage}</div>`:''}<section class="ui-card"><div class="otp-grid"><input inputmode="numeric" maxlength="1" value="6"><input inputmode="numeric" maxlength="1" value="5"><input inputmode="numeric" maxlength="1" value="4"><input inputmode="numeric" maxlength="1" value="3"><input inputmode="numeric" maxlength="1" value="2"><input inputmode="numeric" maxlength="1" value="1"></div><div class="auth-helper-row"><span>Didn't receive it?</span><button class="ui-text-button" data-resend-code>Send again</button></div></section><button class="ui-button ui-button--primary ui-button--block" data-reset-code-submit>Continue</button>`);
    if(authMode==='reset-new') return authLayout(`<button class="ui-back ui-back--inline" data-forgot-password>${icon('back')}</button><section class="auth-copy"><small>New password</small><h1>Create a secure password.</h1><p>Use at least 8 characters with a number.</p></section>${authMessage?`<div class="ui-feedback ui-feedback--error">${authMessage}</div>`:''}<section class="ui-card ui-form"><label><span>New password</span><input id="reset-password" type="password" value="newpass2026" autocomplete="new-password"></label><label><span>Confirm password</span><input id="reset-confirm" type="password" value="newpass2026" autocomplete="new-password"></label></section><button class="ui-button ui-button--primary ui-button--block" data-reset-password-submit>Save new password</button>`);
    if(authMode==='reset-success') return authLayout(`<section class="auth-result"><span>✓</span><small>Password updated</small><h1>Your account is secure again.</h1><p>Use your new password to sign in.</p></section><button class="ui-button ui-button--primary ui-button--block" data-auth-login>Return to sign in</button>`);
    return authLayout(`<section class="auth-hero"><span class="onboarding-symbol">ϟ</span><small>EV charging, simplified</small><h1>Your vehicle.<br>Your energy.<br>One app.</h1><p>Find compatible chargers, reserve a bay, manage charging and pay securely.</p></section><div class="auth-entry-actions"><button class="ui-button ui-button--primary ui-button--block" data-auth-register>Create account</button><button class="ui-button ui-button--secondary ui-button--block" data-auth-login>Sign in</button></div><p class="auth-legal">By continuing, you agree to VoltDrive's Terms and Privacy Policy.</p>`);
}
function onboardingLayout(body, step=1){
    const steps=['Region','Vehicle','Payment'];
    return `<div class="stage onboarding-stage"><div class="phone-shell onboarding-shell"><div class="noise"></div><header class="onboarding-brand"><div class="brand-mark"><span>${icon('shield')}</span><span>VoltDrive</span></div><button class="ui-text-button" data-cancel-setup>Sign out</button></header><main class="content onboarding-content"><div class="onboarding-progress onboarding-progress--three" aria-label="Setup progress">${steps.map((x,i)=>`<div class="${i+1<=step?'is-active':''}"><i></i><span>${x}</span></div>`).join('')}</div>${body}</main></div><aside class="prototype-notes"><div class="brand-mark"><span>${icon('shield')}</span><span>VoltDrive</span></div><h2>New-driver setup</h2><p>Registration is complete. Only the information needed for charging remains.</p><div class="note-card"><strong>Current step</strong><span>${step} of 3</span></div><div class="note-card"><strong>Required outcome</strong><span>Region + vehicle + payment</span></div></aside></div>`;
}
function onboardingScreen(){
    if(onboardingStep===1) return onboardingLayout(`<section class="onboarding-hero"><span class="onboarding-symbol">◎</span><small>Welcome to VoltDrive</small><h1>Set your charging region.</h1><p>We use it for currency, local tariffs, taxes and available payment methods.</p></section><section class="ui-card ui-form"><label><span>Country or region</span><select id="onboard-country">${['Armenia','Georgia','United Arab Emirates','Germany'].map(x=>`<option ${onboardingData.country===x?'selected':''}>${x}</option>`).join('')}</select></label><label><span>App language</span><select id="onboard-language">${['English','Русский','Հայերեն'].map(x=>`<option ${onboardingData.language===x?'selected':''}>${x}</option>`).join('')}</select></label></section><button class="ui-button ui-button--primary ui-button--block" data-onboarding-next>Continue</button>`,1);
    if(onboardingStep===2) return onboardingLayout(`<section class="onboarding-copy"><small>Add your EV</small><h1>See only compatible chargers.</h1><p>Vehicle data helps estimate charging time, required energy and connector compatibility.</p></section><section class="ui-card ui-form"><div class="vehicle-preview"><span>${icon('car')}</span><div><small>Vehicle preview</small><strong>${onboardingData.vehicleBrand} ${onboardingData.vehicleModel}</strong></div></div><label><span>Manufacturer</span><select id="onboard-brand">${['Hyundai','Kia','Mercedes-Benz','Tesla'].map(x=>`<option ${onboardingData.vehicleBrand===x?'selected':''}>${x}</option>`).join('')}</select></label><label><span>Model</span><input id="onboard-model" value="${onboardingData.vehicleModel}"></label><label><span>Registration number</span><input id="onboard-plate" value="${onboardingData.plate}"></label><label><span>Connector</span><select id="onboard-connector">${['CCS2','Type 2','CHAdeMO'].map(x=>`<option ${onboardingData.connector===x?'selected':''}>${x}</option>`).join('')}</select></label></section><div class="onboarding-actions"><button class="ui-button ui-button--secondary" data-onboarding-prev>Back</button><button class="ui-button ui-button--primary" data-onboarding-next>Add vehicle</button></div>`,2);
    return onboardingLayout(`<section class="onboarding-copy"><small>Payment method</small><h1>Ready for one-tap charging.</h1><p>Add a payment card now or leave the card number empty to continue with wallet balance only.</p></section><section class="payment-visual"><div class="payment-card-art"><span>VOLTDRIVE</span><strong>•••• ${onboardingData.cardLast4||'—'}</strong><small>${onboardingData.cardExpiry||'—'}</small><b>${onboardingData.cardBrand||'CARD'}</b></div></section><section class="ui-card ui-form"><label><span>Card number</span><input id="onboard-card" inputmode="numeric" value="${onboardingData.cardNumber||''}" placeholder="Optional"></label><div class="ui-form-grid"><label><span>Expiry</span><input id="onboard-expiry" value="${onboardingData.cardExpiry||''}" placeholder="MM/YY"></label><label><span>CVV</span><input id="onboard-cvv" type="password" value="123"></label></div><label><span>Cardholder name</span><input id="onboard-cardholder" value="${onboardingData.cardholder||onboardingData.name||''}"></label></section><div class="onboarding-actions"><button class="ui-button ui-button--secondary" data-onboarding-prev>Back</button><button class="ui-button ui-button--primary" data-finish-onboarding>Finish setup</button></div>`,3);
}
function onboardingSuccessScreen(){
    return onboardingLayout(`<section class="onboarding-success"><span>✓</span><small>Setup complete</small><h1>You are ready to charge.</h1><p>Your account and ${onboardingData.vehicleBrand} ${onboardingData.vehicleModel} are connected${onboardingData.cardLast4?`, with ${onboardingData.cardBrand} •••• ${onboardingData.cardLast4} ready for payments`:'. Add funds or a payment card from Account before charging'}.</p><div class="setup-summary"><div><small>Region</small><strong>${onboardingData.country}</strong></div><div><small>Currency</small><strong>${currencyForCountry(onboardingData.country)}</strong></div><div><small>Vehicle</small><strong>${onboardingData.vehicleModel}</strong></div><div><small>Connector</small><strong>${onboardingData.connector}</strong></div></div></section><button class="ui-button ui-button--primary ui-button--block" data-enter-app>Open VoltDrive</button>`,3);
}


let notifications = [
    { id: 1, group: 'Today', type: 'success', icon: '✓', title: 'Charging completed', text: 'Your Model Y reached 90%. Total cost: 3,816 AMD.', time: '4 min ago', unread: true, target: 'session-detail', actionLabel: 'View session', targetId: 'VD-CS-10852' },
    { id: 2, group: 'Today', type: 'reserved', icon: 'R', title: 'Reservation starts soon', text: 'Northern Avenue Hub · Charger 04 · Arrival grace period is 10 minutes.', time: '18 min ago', unread: true, target: 'reservation-manage', actionLabel: 'Open reservation', targetId: 'VD-RS-8452' },
    { id: 3, group: 'Yesterday', type: 'warning', icon: '!', title: 'Idle fee reminder', text: 'Move your vehicle within 10 minutes after charging completes to avoid fees.', time: 'Yesterday · 18:42', unread: false, target: 'charging-summary', actionLabel: 'View charging result' },
    { id: 4, group: 'Earlier', type: 'payment', icon: '▭', title: 'Payment successful', text: 'Visa •••• 5050 was charged 2,146 AMD.', time: '2 Aug', unread: false, target: 'payment-detail', actionLabel: 'View payment', targetId: 'PAY-50172' },
    { id: 5, group: 'Earlier', type: 'reserved', icon: '↗', title: 'Alternative charger available', text: 'Republic Square Station has two compatible 120 kW chargers available now.', time: '1 Aug', unread: false, target: 'location', actionLabel: 'View alternative', targetId: 3 }
];
let notificationFilter = 'all';
let selectedNotificationId = 0;
let notificationReturn = { screen: 'home', tab: 'home' };
let supportTopic = 'Charger problem';
let supportReturn = { screen: 'account', tab: 'account' };
let reportReturn = { screen: 'charging', tab: 'charge' };
let locationReturn = { screen: 'map', tab: 'map' };
let reservationReturn = { screen: 'location', tab: 'map' };
let reservationManageReturn = { screen: 'home', tab: 'home' };
let walletReturn = { screen: 'account', tab: 'account' };
let vehicleEditorReturn = { screen: 'garage', tab: 'account' };
let sessionDetailReturn = { screen: 'activity', tab: 'activity' };
let paymentDetailReturn = { screen: 'activity', tab: 'activity' };
let receiptReturn = { screen: 'session-detail', tab: 'activity' };
let paymentDisputeReturn = { screen: 'payment-detail', tab: 'activity' };
let reportSubmitted = false;
let supportQuery = '';
let selectedSupportTicketId = 'VD-M-2048';
let lastCreatedSupportTicketId = 'VD-M-2048';
let supportTicketReturn = { screen: 'support', tab: 'account' };
let prototypeMessage = '';
let supportMessage = '';
let supportRating = 0;
let supportTickets = [
  {id:'VD-M-2048',title:'Charging stopped unexpectedly',category:'Charger problem',status:'In progress',priority:'High',updated:'2 min ago',station:'Northern Avenue Hub',charger:'Charger 04',messages:[
    {from:'You',time:'11:47',text:'Charging stopped after several minutes and did not resume.'},
    {from:'VoltDrive Support',time:'11:49',text:'We are checking Charger 04 remotely. Please keep the cable connected.'}
  ]},
  {id:'VD-B-1981',title:'Duplicate payment review',category:'Payment issue',status:'Waiting for review',priority:'Normal',updated:'Yesterday',station:'Republic Square Station',charger:'Charger 02',messages:[
    {from:'You',time:'Yesterday · 16:20',text:'I may have been charged twice for the same session.'},
    {from:'Billing Support',time:'Yesterday · 16:34',text:'We found both authorizations and started a payment review.'}
  ]},
  {id:'VD-R-1902',title:'Reservation arrival issue',category:'Reservation help',status:'Resolved',priority:'Normal',updated:'2 Aug',station:'Cascade Mobility Point',charger:'Any charger',messages:[
    {from:'You',time:'2 Aug · 09:05',text:'The reserved bay was occupied when I arrived.'},
    {from:'VoltDrive Support',time:'2 Aug · 09:08',text:'We reassigned your reservation and refunded the reservation fee.'}
  ]}

];
function supportContext(topic=supportTopic){
    const active=appState==='charging' && activeChargingSession ? chargingSessionContext() : null;
    const selectedPayment=activityPayments.find(item=>item.id===selectedActivityId) || activityPayments.find(item=>item.id===latestPaymentId) || null;
    const paymentSession=selectedPayment?.sessionId ? sessions.find(item=>item.id===selectedPayment.sessionId) : null;
    const selectedSession=sessions.find(item=>item.id===selectedActivityId) || paymentSession || sessions.find(item=>item.id===latestCompletedSessionId) || null;
    const vehicle=active?.vehicle || vehicleForSession(selectedSession) || activeVehicleRecord();
    if(topic==='Payment issue'){
        return {station:selectedSession?.place || selectedStation.name, charger:selectedSession?.charger?`Charger ${selectedSession.charger}`:'Payment record', reference:selectedPayment?.id || selectedSession?.paymentId || latestPaymentId, vehicle:vehicle?.name || 'Vehicle'};
    }
    if(topic==='Reservation help'){
        const record=activeReservation || activityReservations.find(item=>item.id===selectedActivityId) || null;
        const station=record ? (stations.find(item=>item.id===record.stationId)?.name || record.place) : selectedStation.name;
        const hardware=record?.charger && record.charger!=='Assigned on arrival' && record.charger!=='Any' ? `Charger ${record.charger}` : (record?.bay && record.bay!=='Assigned on arrival' ? `Bay ${record.bay}` : 'Reservation');
        return {station:station || selectedStation.name, charger:hardware, reference:record?.id || activeReservation?.id || 'Reservation', vehicle:vehicle?.name || 'Vehicle'};
    }
    if(topic==='Account & vehicle'){
        return {station:'Account', charger:vehicle?.name || 'Vehicle', reference:vehicle?.plate || 'Vehicle profile', vehicle:vehicle?.name || 'Vehicle'};
    }
    return {station:active?.station?.name || selectedSession?.place || selectedStation.name, charger:`Charger ${active?.connector?.id || selectedSession?.charger || startCharge.connector || '—'}`, reference:activeChargingSession?.id || selectedSession?.id || 'Charging session', vehicle:vehicle?.name || 'Vehicle'};
}
function nextSupportTicketId(topic){
    const prefix=topic==='Payment issue'?'VD-B':topic==='Reservation help'?'VD-R':topic==='Account & vehicle'?'VD-A':'VD-M';
    const max=supportTickets.reduce((value,ticket)=>{ const n=Number(String(ticket.id||'').replace(/\D/g,'')); return Number.isFinite(n)?Math.max(value,n):value; },2048);
    return `${prefix}-${max+1}`;
}
function supportTicketTitle(topic, context){
    if(topic==='Payment issue') return `Payment review · ${context.reference}`;
    if(topic==='Reservation help') return `Reservation assistance · ${context.reference}`;
    if(topic==='Account & vehicle') return `Vehicle & account assistance · ${context.vehicle}`;
    return `Charging assistance · ${context.station}`;
}
function createSupportTicket(topic=supportTopic, text='', forceNew=false){
    const context=supportContext(topic);
    let ticket=!forceNew ? supportTickets.find(item=>item.category===topic && item.status!=='Resolved' && item.station===context.station && item.charger===context.charger) : null;
    if(!ticket){
        ticket={id:nextSupportTicketId(topic),title:supportTicketTitle(topic,context),category:topic,status:'In progress',priority:topic==='Charger problem'?'High':'Normal',updated:'Now',station:context.station,charger:context.charger,messages:[]};
        supportTickets.unshift(ticket);
    }
    if(text) ticket.messages.push({from:'You',time:'Now',text});
    ticket.updated='Now';
    if(ticket.status==='Resolved') ticket.status='In progress';
    selectedSupportTicketId=ticket.id;
    lastCreatedSupportTicketId=ticket.id;
    return ticket;
}
function replaceDemoArray(target, items){
    target.splice(0,target.length,...JSON.parse(JSON.stringify(items)));
}
function applyOnboardingAccount(){
    if(onboardingAccountApplied) return;
    stopChargingSimulation();
    const vehicleId=Date.now();
    const vehicle={id:vehicleId,name:`${onboardingData.vehicleBrand} ${onboardingData.vehicleModel}`.trim(),plate:onboardingData.plate,vin:'',connector:onboardingData.connector,battery:72,batteryCapacity:75,limit:85,ownership:'Personal',oemStatus:'Not connected',homeCharging:'Not configured',plugAndCharge:false,active:true};
    const card=onboardingCardRecord();
    const currency=currencyForCountry(onboardingData.country);

    profile={name:onboardingData.name||'VoltDrive Driver',email:onboardingData.email||'',phone:'',address:onboardingData.country||''};
    accountPreferences={...accountPreferences,language:onboardingData.language||'English',country:onboardingData.country||'Armenia',currency,distance:'Kilometres',energy:'kWh',marketingData:false,analytics:true};
    savePreferences();
    billingProfile={company:'',taxId:'',billingEmail:onboardingData.email||'',plan:'VoltDrive Free',autoRenew:false,promoCode:''};

    vehicles=[vehicle];
    paymentMethods=card?[card]:[];
    selectedPaymentId=card?.id||0;
    walletBalance=0;
    autoTopUp={enabled:false,threshold:2000,amount:5000};
    chargingCredits={kwh:0,expires:'—'};
    startCharge={code:'',connector:'',payment:card?paymentMethodLabel(card):'Wallet balance',preauth:5000,accepted:true,error:'',stage:'idle'};

    appState='idle'; homeScenario='normal'; homeVehicleMenuOpen=false;
    selectedStation=stations[0]; filter='Available'; mapView='map'; mapQuery=''; recentMapSearches=[]; mapSort='distance'; mapFilters=createDefaultMapFilters(); favoriteStations=new Set(); showFavoritesOnly=false; waitingListJoined=false;
    reservationStep=1; reservation={type:'Specific charger',vehicleId,vehicle:vehicle.name,date:'Today · Fri 21',time:'12:30',duration:45,target:vehicle.limit,charger:'',bay:''}; reservationMode='create'; activeReservation=null; reservationTermsAccepted=true; reservationMessage=''; cancellationReason='Plans changed'; graceMinutes=10; lastExpiredReservationId=''; waitingPosition=3;
    navigationState={source:'location',started:false,progress:0,arrived:false,arrivalConfirmed:false,assignment:null}; navigationMessage='';
    charging={battery:vehicle.battery,target:vehicle.limit,power:0,energy:0,cost:0,minutes:0,remaining:null,speed:'Maximum',paused:false}; chargeLimit={type:'battery',battery:vehicle.limit,energy:30,cost:3500,time:45}; chargeLimitReturnScreen='tariff-review'; chargeLimitDraft=null; activeChargingSession=null; pendingChargingVehicleId=null; pendingChargingReservationId=null;
    chargeStartMessage=''; scannerFlashlight=false; chargingSummary={startBattery:vehicle.battery,endBattery:vehicle.battery,energy:0,cost:0,duration:0,status:'',reason:''}; parkingSession={active:false,stage:'grace',graceMinutes:10,graceSecondsRemaining:600,idleMinutes:0,idleSecondsElapsed:0,idleCost:0,extensionMinutes:30,extensionSecondsRemaining:0,extensionCost:0,bay:'',message:'',paymentMessage:'',paymentStatus:'',paymentId:''};

    replaceDemoArray(sessions,[]); replaceDemoArray(activityReservations,[]); replaceDemoArray(activityPayments,[]);
    latestCompletedSessionId=''; latestPaymentId=''; latestReceiptId=''; activitySection='sessions'; activityQuery=''; activityRange='30 days'; activityVehicleFilter='all'; activityStationFilter='all'; activityStatusFilter='all'; selectedActivityId=''; activityMessage='';
    notifications=[{id:1,group:'Today',type:'success',category:'critical',delivery:'In-app',icon:'✓',title:'Welcome to VoltDrive',text:`${vehicle.name} is set as your active vehicle. You are ready to find a compatible station.`,time:'Just now',unread:true,target:'account',actionLabel:'Open account'}];
    notificationFilter='all'; selectedNotificationId=0; notificationSettingsMessage='';
    permissionState={location:'prompt',camera:'prompt',notifications:'prompt'}; savePermissionState(); notificationPreferences={push:false,email:true,sms:false,reservation:true,charging:true,payment:true,offers:false,quietHours:true,quietStart:'22:00',quietEnd:'07:00'};
    rfidCards=[]; plugCharge={vehicleId,supported:vehicle.connector==='CCS2',enabled:false,certificate:'Not activated',provider:'VoltDrive PKI'}; editingRfidId=0; accessMessage=''; editingVehicleId=null; vehicleEditorMessage='';
    twoFactorEnabled=false; biometricEnabled=false; connectedSessions=[{id:1,device:'Current browser',location:onboardingData.country||'Current region',time:'Current session',current:true}]; securityMessage='';
    supportQuery=''; supportMessage=''; supportRating=0; selectedSupportTicketId=''; lastCreatedSupportTicketId=''; reportSubmitted=false; replaceDemoArray(supportTickets,[]);
    membershipMessage=''; selectedPlan='VoltDrive Plus'; selectedPackageId=2; membershipCheckoutMode='plan';
    onboardingAccountApplied=true;
}
function resetDemoData(){
    stopChargingSimulation();
    stopParkingCountdown();
    profile={name:'Alex Rowan',email:'alex.rowan@voltdrive.example',phone:'+374 99 505050',address:'Yerevan, Armenia'};
    accountPreferences={language:'English',country:'Armenia',currency:'AMD',distance:'Kilometres',energy:'kWh',marketingData:false,analytics:true}; savePreferences();
    onboardingData={name:'Alex Rowan',country:'Armenia',language:'English',email:'alex.rowan@example.com',vehicleBrand:'Hyundai',vehicleModel:'IONIQ 5',plate:'77 EV 777',connector:'CCS2',cardNumber:'4242 4242 4242 5050',cardExpiry:'08/29',cardholder:'ALEX ROWAN',cardLast4:'5050',cardBrand:'VISA'}; onboardingAccountApplied=false; onboardingStep=1; authMode='welcome'; authMessage='';
    twoFactorEnabled=true; biometricEnabled=false; connectedSessions=[{id:1,device:'Chrome on Windows',location:'Yerevan, Armenia',time:'Current session',current:true},{id:2,device:'VoltDrive on iPhone',location:'Yerevan, Armenia',time:'Yesterday, 21:18',current:false},{id:3,device:'Safari on MacBook',location:'Tbilisi, Georgia',time:'28 Jul, 10:42',current:false}];
    appState='idle'; homeScenario='normal'; homeVehicleMenuOpen=false; activeTab='account';
    selectedStation=stations[0]; filter='Available'; mapView='map'; mapQuery=''; recentMapSearches=['Northern Avenue','CCS2']; mapSort='distance'; mapFilters=createDefaultMapFilters(); favoriteStations=new Set([1]); showFavoritesOnly=false; waitingListJoined=false;
    reservationStep=1; reservation={type:'Specific charger',vehicleId:1,vehicle:'Tesla Model Y',date:'Today · Fri 21',time:'12:30',duration:45,target:90,charger:'04',bay:'B-12'}; reservationMode='create'; activeReservation=null; reservationTermsAccepted=true; reservationMessage=''; cancellationReason='Plans changed'; graceMinutes=10; lastExpiredReservationId=''; waitingPosition=3;
    navigationState={source:'location',started:false,progress:0,arrived:false,arrivalConfirmed:false,assignment:null}; navigationMessage='';
    charging={battery:68,target:90,power:142,energy:0,cost:0,minutes:0,remaining:26,speed:'Maximum',paused:false}; chargeLimit={type:'battery',battery:90,energy:30,cost:3500,time:45}; chargeLimitReturnScreen='tariff-review'; chargeLimitDraft=null; activeChargingSession=null; pendingChargingVehicleId=null; pendingChargingReservationId=null;
    startCharge={code:'VD-04-CCS2',connector:'04',payment:'Visa •••• 5050',preauth:5000,accepted:true,error:'',stage:'idle'}; scannerFlashlight=false; chargeStartMessage=''; chargingSummary={startBattery:64,endBattery:90,energy:31.8,cost:3816,duration:43,status:'Completed',reason:'Target reached'}; parkingSession={active:false,stage:'grace',graceMinutes:10,graceSecondsRemaining:600,idleMinutes:0,idleSecondsElapsed:0,idleCost:0,extensionMinutes:30,extensionSecondsRemaining:0,extensionCost:0,bay:'B-12',message:'',paymentMessage:'',paymentStatus:'',paymentId:''};
    vehicles=[{id:1,name:'Tesla Model Y',plate:'35 GG 505',vin:'',connector:'CCS2',battery:68,batteryCapacity:75,limit:90,ownership:'Personal',oemStatus:'Not connected',homeCharging:'Not configured',plugAndCharge:false,active:true},{id:2,name:'BMW i4',plate:'40 AA 404',vin:'',connector:'CCS2',battery:41,batteryCapacity:84,limit:80,ownership:'Personal',oemStatus:'Not connected',homeCharging:'Not configured',plugAndCharge:false,active:false}];
    paymentMethods=[{id:1,brand:'VISA',last4:'5050',expiry:'08/29',active:true}]; selectedPaymentId=1; walletTopUp=5000; walletBalance=14500; latestCompletedSessionId='VD-CS-10852'; latestPaymentId='PAY-50821'; latestReceiptId='RC-10852';
    replaceDemoArray(sessions,[{id:'VD-CS-10852',place:'Northern Avenue Hub',address:'Northern Ave. 8, Yerevan',date:'Today, 11:45',started:'11:02',ended:'11:45',energy:31.8,cost:3816,status:'Completed',charger:'04',connector:'CCS2',vehicle:'Tesla Model Y · 35 GG 505',startBattery:64,endBattery:90,averagePower:'44.4 kW',peakPower:'142 kW',paymentId:'PAY-50821',receipt:'RC-10852',energyCharge:3816,reservationFee:0,reservationPaymentId:'',reservationPaymentMethod:'',parkingFee:0,idleFee:0,vat:636,paymentMethod:'Visa •••• 5050'},{id:'VD-CS-10794',place:'Cascade Charge Point',address:'Tamanyan St. 10, Yerevan',date:'2 Aug, 18:40',started:'18:09',ended:'18:40',energy:18.2,cost:2146,status:'Completed',charger:'07',connector:'CCS2',vehicle:'Tesla Model Y · 35 GG 505',startBattery:42,endBattery:61,averagePower:'35.2 kW',peakPower:'118 kW',paymentId:'PAY-50172',receipt:'RC-10794',energyCharge:2146,reservationFee:0,parkingFee:0,idleFee:0,vat:358,paymentMethod:'Wallet balance'},{id:'VD-CS-10688',place:'Republic Square Station',address:'Abovyan St. 1, Yerevan',date:'29 Jul, 09:15',started:'09:14',ended:'09:15',energy:0,cost:0,status:'Failed',charger:'02',connector:'CCS2',vehicle:'BMW i4 · 40 AA 404',startBattery:28,endBattery:28,averagePower:'0 kW',peakPower:'0 kW',paymentId:'PAY-49308',receipt:'',energyCharge:0,reservationFee:0,parkingFee:0,idleFee:0,vat:0,paymentMethod:'Visa •••• 5050'}]);
    replaceDemoArray(activityReservations,[{id:'VD-RS-8452',place:'Northern Avenue Hub',date:'Today, 12:30',status:'Confirmed',bay:'B-12',charger:'04',fee:500,feePaid:500,feePaymentId:'PAY-50791',feePaymentMethod:'Visa •••• 5050',vehicle:'Tesla Model Y · 35 GG 505'},{id:'VD-RS-8328',place:'Dalma Garden Garage',date:'30 Jul, 14:00',status:'Cancelled',bay:'A-03',charger:'Any',fee:500,feePaid:500,feePaymentId:'PAY-48290',feePaymentMethod:'Visa •••• 5050',refund:500,vehicle:'Tesla Model Y · 35 GG 505'}]);
    replaceDemoArray(activityPayments,[{id:'PAY-50821',date:'Today, 11:46',title:'Charging payment',method:'Visa •••• 5050',amount:3816,status:'Paid',sessionId:'VD-CS-10852'},{id:'PAY-50791',date:'Today, 11:30',title:'Reservation fee',method:'Visa •••• 5050',amount:500,status:'Paid',reservationId:'VD-RS-8452'},{id:'PAY-50172',date:'2 Aug, 18:41',title:'Charging payment',method:'Wallet balance',amount:2146,status:'Paid',sessionId:'VD-CS-10794'},{id:'RF-48310',date:'30 Jul, 14:05',title:'Reservation refund',method:'Visa •••• 5050',amount:500,status:'Refunded',reservationId:'VD-RS-8328'},{id:'PAY-48290',date:'30 Jul, 13:58',title:'Reservation fee',method:'Visa •••• 5050',amount:500,status:'Paid',reservationId:'VD-RS-8328'}]);
    activitySection='sessions'; activityQuery=''; activityRange='30 days'; activityVehicleFilter='all'; activityStationFilter='all'; activityStatusFilter='all'; selectedActivityId='VD-CS-10852'; activityMessage='';
    notifications=[{id:1,group:'Today',type:'success',category:'charging',delivery:'In-app · Push · Email',icon:'✓',title:'Charging completed',text:'Your Model Y reached 90%. Total cost: 3,816 AMD.',time:'4 min ago',unread:true,target:'session-detail',actionLabel:'View session',targetId:'VD-CS-10852'},{id:2,group:'Today',type:'reserved',category:'reservation',delivery:'In-app · Push · Email',icon:'R',title:'Reservation starts soon',text:'Northern Avenue Hub · Charger 04 · Arrival grace period is 10 minutes.',time:'18 min ago',unread:true,target:'reservation-manage',actionLabel:'Open reservation',targetId:'VD-RS-8452'},{id:3,group:'Yesterday',type:'warning',category:'charging',delivery:'In-app · Push · Email',icon:'!',title:'Idle fee reminder',text:'Move your vehicle within 10 minutes after charging completes to avoid fees.',time:'Yesterday · 18:42',unread:false,target:'charging-summary',actionLabel:'View charging result'},{id:4,group:'Earlier',type:'payment',category:'payment',delivery:'In-app · Push · Email',icon:'▭',title:'Payment successful',text:'Visa •••• 5050 was charged 2,146 AMD.',time:'2 Aug',unread:false,target:'payment-detail',actionLabel:'View payment',targetId:'PAY-50172'},{id:5,group:'Earlier',type:'reserved',category:'reservation',delivery:'In-app · Push · Email',icon:'↗',title:'Alternative charger available',text:'Republic Square Station has two compatible 120 kW chargers available now.',time:'1 Aug',unread:false,target:'location',actionLabel:'View alternative',targetId:3}];
    notificationFilter='all'; selectedNotificationId=0; notificationPreferences={push:true,email:true,sms:false,reservation:true,charging:true,payment:true,offers:false,quietHours:true,quietStart:'22:00',quietEnd:'07:00'}; notificationSettingsMessage='';
    permissionState={location:'granted',camera:'granted',notifications:'granted'}; savePermissionState();
    rfidCards=[{id:1,name:'Main RFID',number:'VD-84 •••• 2050',vehicleId:1,active:true}]; plugCharge={vehicleId:1,supported:true,enabled:false,certificate:'Not activated',provider:'VoltDrive PKI'}; editingRfidId=0; accessMessage=''; autoTopUp={enabled:true,threshold:2000,amount:5000}; editingVehicleId=null;
    chargingCredits={kwh:18,expires:'31 Aug 2026'}; billingProfile={company:'',taxId:'',billingEmail:'alex.rowan@voltdrive.example',plan:'VoltDrive Free',autoRenew:false,promoCode:''}; membershipMessage=''; selectedPlan='VoltDrive Plus'; selectedPackageId=2; membershipCheckoutMode='plan';
    supportTopic='Charger problem'; supportQuery=''; supportMessage=''; supportRating=0; selectedSupportTicketId='VD-M-2048'; lastCreatedSupportTicketId='VD-M-2048'; reportSubmitted=false;
    supportTickets=[{id:'VD-M-2048',title:'Charging stopped unexpectedly',category:'Charger problem',status:'In progress',priority:'High',updated:'2 min ago',station:'Northern Avenue Hub',charger:'Charger 04',messages:[{from:'You',time:'11:47',text:'Charging stopped after several minutes and did not resume.'},{from:'VoltDrive Support',time:'11:49',text:'We are checking Charger 04 remotely. Please keep the cable connected.'}]},{id:'VD-B-1981',title:'Duplicate payment review',category:'Payment issue',status:'Waiting for review',priority:'Normal',updated:'Yesterday',station:'Republic Square Station',charger:'Charger 02',messages:[{from:'You',time:'Yesterday · 16:20',text:'I may have been charged twice for the same session.'},{from:'Billing Support',time:'Yesterday · 16:34',text:'We found both authorizations and started a payment review.'}]},{id:'VD-R-1902',title:'Reservation arrival issue',category:'Reservation help',status:'Resolved',priority:'Normal',updated:'2 Aug',station:'Cascade Mobility Point',charger:'Any charger',messages:[{from:'You',time:'2 Aug · 09:05',text:'The reserved bay was occupied when I arrived.'},{from:'VoltDrive Support',time:'2 Aug · 09:08',text:'We reassigned your reservation and refunded the reservation fee.'}]}];
    qaCompleted.clear(); qaMessage=''; onboardingComplete=true; prototypeMessage='Demo data restored to the baseline state.';
}
const supportFaqs = [
  {id:'faq-cable',topic:'Charger problem',title:'Cable will not release',text:'Stop the session, unlock the vehicle, wait 10 seconds, then try again. Support can send a remote release command if the connector remains locked.'},
  {id:'faq-slow',topic:'Charger problem',title:'Charging is slower than expected',text:'Charging speed depends on battery temperature, battery level, vehicle limits and shared site power. Compare the current power with your vehicle maximum.'},
  {id:'faq-payment',topic:'Payment issue',title:'Payment is pending or duplicated',text:'A pending amount can be a temporary preauthorization. Completed duplicate charges can be reported from Sessions → Payment details.'},
  {id:'faq-refund',topic:'Payment issue',title:'How refunds work',text:'Approved refunds are returned to the original payment method. Bank processing usually takes several business days.'},
  {id:'faq-reservation',topic:'Reservation help',title:'Modify or cancel a reservation',text:'Open the active reservation from Home or Sessions. Cancellation conditions and any applicable fee are shown before confirmation.'},
  {id:'faq-arrival',topic:'Reservation help',title:'I arrived but the charger is unavailable',text:'Confirm your arrival, then choose the recommended alternative charger or join the waiting list.'},
  {id:'faq-account',topic:'Account & vehicle',title:'Change vehicle or connector details',text:'Open Account → Your vehicles, choose the vehicle and update connector compatibility or preferred charging limit.'}
];

function simpleHeaderBack(title, subtitle, body, back='account') {
    return layout(`<button class="ui-back ui-back--inline" data-simple-back="${back}">${icon('back')}</button>${body}`, title, subtitle);
}
function restoreReturnContext(context){
    let target=context?.screen||'account';
    let tab=context?.tab||'account';
    if(target==='charging' && appState!=='charging'){
        target='charging-summary';
        tab='charge';
    }
    if(target==='reservation-manage' && !activeReservation){
        target='activity';
        tab='activity';
        activitySection='reservations';
    }
    screen=target;
    activeTab=tab;
}


function navigationVehicle(){
    if (navigationState.source === 'reservation') return reservationVehicleRecord(activeReservation || reservation) || activeVehicleRecord();
    return activeVehicleRecord();
}
function estimatedArrivalBattery(station = selectedStation){
    const vehicle = navigationVehicle();
    const current = Number(vehicle?.battery ?? 0);
    const distance = Number(station?.distanceKm ?? 0);
    const estimatedUse = Math.max(1, Math.ceil(distance * 0.7));
    return Math.max(5, current - estimatedUse);
}
function buildNavigationAssignment(){
    const station = selectedStation;
    const vehicle = navigationVehicle();
    const rows = stationConnectorRows(station);
    const reservationData = navigationState.source === 'reservation' ? activeReservation : null;
    let connector = null;
    if (reservationData && reservationData.type !== 'Any available charger') {
        connector = rows.find(item => item.id === String(reservationData.charger)) || null;
    }
    if (!connector || connector.status !== 'available' || !vehicle?.connector || connector.type !== vehicle.connector) {
        connector = vehicle?.connector
            ? rows.find(item => item.status === 'available' && item.type === vehicle.connector) || null
            : null;
    }
    const meta = stationNavigationMeta[station.id] || {};
    return {
        stationId: station.id,
        vehicleId: vehicle?.id || null,
        connectorId: connector?.id || null,
        connectorType: connector?.type || null,
        power: connector?.power || null,
        bay: reservationData?.bay || meta.defaultBay || 'Charging bay'
    };
}
function navigationAssignment(){
    const stored = navigationState.assignment;
    const vehicle = navigationVehicle();
    if (stored?.stationId === selectedStation.id && stored?.vehicleId === vehicle?.id) {
        const connector = stored.connectorId ? stationConnectorRows(selectedStation).find(item => item.id === stored.connectorId) : null;
        if (!connector || (connector.status === 'available' && connector.type === vehicle?.connector)) return stored;
    }
    return buildNavigationAssignment();
}
function stationRouteMeta(station = selectedStation){
    return stationNavigationMeta[station.id] || { activeInstruction: `Continue to ${station.name}`, activeDistance: '500 m', defaultBay: 'Charging bay', steps: [[`Continue toward ${station.name}`,'Follow the suggested route'],['Enter the charging area','Follow station signage']] };
}

function navigationPreviewScreen(){
    const s=selectedStation;
    const hasReservation=navigationState.source==='reservation' && !!activeReservation;
    const meta=stationRouteMeta(s);
    const assignment=navigationAssignment();
    const arrivalBattery=estimatedArrivalBattery(s);
    const routeSteps=[...meta.steps, [s.parking ? `Enter parking bay ${assignment.bay}` : 'Enter the charging area', s.parking ? 'Follow VoltDrive signs to the assigned bay' : 'Follow station signage to the charger']];
    return simpleHeaderBack('Route preview', `${formatDistanceKm(s.distanceKm)} · ${s.eta}`, `
      <section class="navigation-hero ui-surface--dark">
        <div class="navigation-map-art" aria-label="Route preview to ${s.name}">
          <span class="navigation-origin">You</span><i></i><i></i><i></i><span class="navigation-destination">${icon('zap')}</span>
        </div>
        <small>Fastest route</small><h2>${s.name}</h2><p>${s.address}</p>
        <div class="navigation-stats"><div><small>Arrival</small><strong>${s.eta}</strong></div><div><small>Distance</small><strong>${formatDistanceKm(s.distanceKm)}</strong></div><div><small>Est. battery on arrival</small><strong>${arrivalBattery}%</strong></div></div>
      </section>
      ${hasReservation?`<section class="navigation-reservation-note"><span>${icon('clock')}</span><div><strong>Reservation protected</strong><p>Arrival window ${activeReservation?.time || reservation.time}. Your ${graceMinutes}-minute grace period begins after the scheduled time.</p></div></section>`:''}
      <section class="ui-card navigation-route-list">${routeSteps.map((step,index)=>`<div><span>${index+1}</span><div><strong>${step[0]}</strong><small>${formatRouteDistanceText(step[1])}</small></div></div>`).join('')}</section>
      <button class="ui-button ui-button--primary ui-button--block" data-start-route>${icon('route')} Start navigation</button>
      <button class="ui-button ui-button--secondary ui-button--block" data-open-location-from-navigation>View station details</button>
    `, navigationState.source==='reservation'?'reservation-manage':'location');
}
function navigationActiveScreen(){
    const s=selectedStation;
    const progress=Math.max(8,navigationState.progress||38);
    const meta=stationRouteMeta(s);
    const arrivalBattery=estimatedArrivalBattery(s);
    const reservationData=activeReservation || reservation;
    const reservationConnector=reservationData.type==='Any available charger'?'Assigned on arrival':`Charger ${reservationData.charger}`;
    return layout(`<section class="navigation-active ui-surface--dark">
      <div class="navigation-turn"><span>↱</span><div><small>In ${formatRouteDistanceText(meta.activeDistance)}</small><h2>${meta.activeInstruction}</h2></div></div>
      <div class="navigation-live-map"><div class="navigation-route-line"></div><span class="navigation-car">${icon('nav')}</span><span class="navigation-pin">${icon('zap')}</span></div>
      <div class="navigation-progress"><span style="width:${progress}%"></span></div>
      <div class="navigation-stats"><div><small>ETA</small><strong>${s.eta}</strong></div><div><small>Remaining</small><strong>${formatDistanceKm(s.distanceKm)}</strong></div><div><small>Est. arrival battery</small><strong>${arrivalBattery}%</strong></div></div>
    </section>
    ${navigationState.source==='reservation'&&activeReservation?`<section class="navigation-reservation-note"><span>${icon('clock')}</span><div><strong>Reservation ${activeReservation.id}</strong><p>${reservationConnector} · Bay ${reservationData.bay} · Grace period ${graceMinutes} min</p></div></section>`:''}
    <button class="ui-button ui-button--primary ui-button--block" data-simulate-arrival>Prototype: Arrive at station</button>
    <button class="ui-button ui-button--secondary ui-button--block" data-stop-navigation>Stop navigation</button>`, 'Navigation', `${s.name} · Live route`);
}
function arrivalScreen(){
    const s=selectedStation;
    const assignment=navigationAssignment();
    const connector=assignment.connectorId ? stationConnectorRows(s).find(item=>item.id===assignment.connectorId) : null;
    const ready=!!connector && connector.status==='available';
    const reservedVehicle = navigationState.source === 'reservation' ? reservationVehicleRecord(activeReservation) : null;
    const activeVehicle = activeVehicleRecord();
    const vehicleMismatch = Boolean(reservedVehicle && activeVehicle && reservedVehicle.id !== activeVehicle.id);
    const bayLabel=s.parking?assignment.bay:'Public access';
    return simpleHeaderBack('You have arrived', s.name, `${navigationMessage?`<div class="ui-feedback ui-feedback--success">${navigationMessage}</div>`:''}
      <section class="arrival-hero ui-surface--dark"><div class="arrival-check">${navigationState.arrivalConfirmed?'✓':icon('pin')}</div><small>Location detected</small><h2>${s.name}</h2><p>${s.address}</p></section>
      <section class="ui-card arrival-assignment"><div class="section-heading"><div><small>Your assignment</small><h2>${navigationState.source==='reservation'?'Reserved charging':'Available charging'}</h2></div><span class="distance-pill">${ready?'Ready':'Unavailable'}</span></div><div class="arrival-assignment-grid"><div><small>Charger</small><strong>${connector?.id || '—'}</strong></div><div><small>${s.parking?'Parking bay':'Access'}</small><strong>${bayLabel}</strong></div><div><small>Connector</small><strong>${connector?.type || '—'}</strong></div><div><small>Power</small><strong>${connector?`${connector.power} kW`:'—'}</strong></div></div></section>
      <section class="arrival-instructions"><span>${icon('parking')}</span><div><strong>${s.parking?`Park in bay ${assignment.bay}`:'Use the public charging access area'}</strong><p>${ready?'Confirm arrival after your vehicle is positioned safely. Then connect the assigned cable to start charging.':'No compatible available connector is currently detected at this station.'}</p></div></section>
      ${vehicleMismatch?`<section class="ui-card compatibility-note"><span>!</span><div><strong>Reservation vehicle mismatch</strong><p>This booking is for ${reservedVehicle.name}, but ${activeVehicle.name} is currently selected.</p></div></section><button class="ui-button ui-button--secondary ui-button--block" data-switch-reservation-vehicle>Use ${reservedVehicle.name}</button>`:''}
      ${ready&&!vehicleMismatch?(navigationState.arrivalConfirmed?`<button class="ui-button ui-button--primary ui-button--block" data-arrival-start-charge>${icon('plug')} Connect and start charging</button>`:`<button class="ui-button ui-button--primary ui-button--block" data-arrival-confirm>Confirm arrival</button>`):''}
      ${!ready&&!vehicleMismatch?`<button class="ui-button ui-button--primary ui-button--block" data-find-compatible-station>Find compatible station</button>`:''}
      <button class="ui-button ui-button--secondary ui-button--block" data-arrival-station-help>Charger not available</button>
    `, 'navigation-active');
}

function notificationsScreen(){
    const visible = notificationFilter === 'unread' ? notifications.filter(n=>n.unread) : notifications;
    const groups = ['Today','Yesterday','Earlier'];
    const grouped = groups.map(group=>({group,items:visible.filter(n=>n.group===group)})).filter(x=>x.items.length);
    const list = grouped.length ? grouped.map(section=>`<section class="notification-group"><div class="notification-group-heading"><small>${section.group}</small><span>${section.items.length}</span></div><div class="notification-list">${section.items.map(n=>`<article class="notification-item ui-surface--dark ${n.unread?'unread':''}"><button class="notification-main" data-notification-id="${n.id}"><span class="notification-symbol ${n.type}">${n.icon}</span><span><small>${n.time}</small><strong>${n.title}</strong><p>${n.text}</p></span><i></i></button><div class="notification-actions"><button class="ui-text-button" data-notification-open="${n.id}">${n.actionLabel}</button><button class="notification-delete" data-notification-delete="${n.id}" aria-label="Delete notification">×</button></div></article>`).join('')}</div></section>`).join('') : `<section class="ui-state ui-state--empty"><span>✓</span><h2>No notifications here</h2><p>${notificationFilter==='unread'?'You have read every update.':'New charging, reservation and payment events will appear here.'}</p></section>`;
    return simpleHeaderBack('Notifications', `${notifications.filter(n=>n.unread).length} unread updates`, `<section class="notification-summary ui-surface--dark"><div><small>Stay informed</small><h2>Everything important, without noise</h2><p>Charging, reservation and payment events are prioritised automatically.</p></div><button data-mark-read ${notifications.some(n=>n.unread)?'':'disabled'}>Mark all read</button></section><div class="notification-tabs ui-surface--dark"><button data-notification-filter="all" class="${notificationFilter==='all'?'active':''}">All</button><button data-notification-filter="unread" class="${notificationFilter==='unread'?'active':''}">Unread</button></div>${list}<section class="notification-preferences ui-surface--dark"><div><small>Smart alerts</small><strong>Critical events always stay enabled</strong></div><button class="ui-text-button" data-open-notification-settings>Manage</button></section>`, 'notification-return');
}
function notificationDetailScreen(){
    const n=notifications.find(x=>x.id===selectedNotificationId) || notifications[0];
    return simpleHeaderBack(n.title, n.time, `<section class="notification-detail-hero ui-surface--dark"><span class="notification-symbol ${n.type}">${n.icon}</span><small>${n.group}</small><h2>${n.title}</h2><p>${n.text}</p></section><section class="ui-card notification-detail-card"><div><small>Notification category</small><strong>${n.category==='critical'?'Critical':n.category==='reservation'?'Reservation':n.category==='payment'?'Payment':n.category==='offers'?'Offers & insights':'Charging'}</strong></div><div><small>Delivery</small><strong>${n.delivery || 'In-app notification'}</strong></div><div><small>Status</small><strong>${n.unread?'Unread':'Read'}</strong></div></section><div class="activity-action-grid"><button class="ui-button ui-button--primary" data-notification-open="${n.id}">${n.actionLabel}</button><button class="ui-button ui-button--danger" data-notification-delete="${n.id}">Delete</button></div>`, 'notifications');
}

function notificationSettingsScreen(){
    const categoryRows = [
      ['reservation','R','Reservations','Confirmation, reminder, grace period and cancellation'],
      ['charging','ϟ','Charging','Start, interruption, completion and idle-fee alerts'],
      ['payment','▭','Payments','Successful payments, failures, refunds and invoices'],
      ['offers','✦','Offers & insights','Promotions, charging packages and smart recommendations']
    ];
    return simpleHeaderBack('Notification settings','Choose what reaches you and when', `
      ${notificationSettingsMessage?`<div class="ui-feedback ui-feedback--success">${notificationSettingsMessage}</div>`:''}
      <section class="ui-card notification-priority">
        <span>!</span><div><small>Always enabled</small><h2>Critical safety alerts</h2><p>Charging faults, emergency stops and account-security warnings cannot be disabled.</p></div>
      </section>
      <section class="account-section">
        <div class="section-heading"><div><small>Delivery channels</small><h2>How we contact you</h2></div></div>
        <div class="ui-stack">
          ${[['push','●','Push notifications','Recommended for live charging'],['email','@','Email','Receipts, summaries and account notices'],['sms','SMS','Text messages','Important reminders when mobile data is unavailable']].map(([key,ico,title,text])=>`<label class="ui-list-item security-toggle"><span class="ui-list-icon">${ico}</span><span><small>Channel</small><strong>${title}</strong><em>${text}</em></span><input class="ui-switch" type="checkbox" data-notification-toggle="${key}" ${notificationPreferences[key]?'checked':''}></label>`).join('')}
        </div>
      </section>
      <section class="account-section">
        <div class="section-heading"><div><small>Event categories</small><h2>What you receive</h2></div></div>
        <div class="ui-stack">
          ${categoryRows.map(([key,ico,title,text])=>`<label class="ui-list-item security-toggle"><span class="ui-list-icon">${ico}</span><span><small>Alert type</small><strong>${title}</strong><em>${text}</em></span><input class="ui-switch" type="checkbox" data-notification-toggle="${key}" ${notificationPreferences[key]?'checked':''}></label>`).join('')}
        </div>
      </section>
      <section class="ui-card quiet-hours-card">
        <label class="quiet-hours-header security-toggle"><span><small>Do not disturb</small><strong>Quiet hours</strong><em>Non-critical alerts will be delivered after this period.</em></span><input class="ui-switch" type="checkbox" data-notification-toggle="quietHours" ${notificationPreferences.quietHours?'checked':''}></label>
        <div class="quiet-hours-grid ${notificationPreferences.quietHours?'':'is-disabled'}">
          <label><span>From</span><div class="ui-time-wrap"><input type="time" id="quiet-start" value="${notificationPreferences.quietStart}" ${notificationPreferences.quietHours?'':'disabled'}></div></label>
          <label><span>Until</span><div class="ui-time-wrap"><input type="time" id="quiet-end" value="${notificationPreferences.quietEnd}" ${notificationPreferences.quietHours?'':'disabled'}></div></label>
        </div>
      </section>
      <button class="ui-button ui-button--primary ui-button--block" data-save-notification-settings>Save preferences</button>`, 'notifications');
}

function supportScreen(){
    const topics=['Charger problem','Payment issue','Reservation help','Account & vehicle'];
    const q=supportQuery.trim().toLowerCase();
    const faqs=supportFaqs.filter(f=>(!q || `${f.title} ${f.text} ${f.topic}`.toLowerCase().includes(q)) && (!supportTopic || f.topic===supportTopic));
    const tickets=supportTickets.slice().sort((a,b)=>a.status==='Resolved'?1:-1);
    return simpleHeaderBack('Help & support','FAQ, live help and service requests', `
      ${supportMessage?`<div class="ui-feedback ui-feedback--success">${supportMessage}</div>`:''}
      <section class="support-hero"><span>?</span><div><small>Average response</small><h2>Under 2 minutes</h2><p>Active charging faults receive the highest priority.</p></div></section>
      <section class="support-search ui-card"><label><span>Search help</span><input data-support-search value="${supportQuery}" placeholder="Search chargers, payments, reservations..."></label></section>
      <section class="account-section"><div class="section-heading"><div><small>Choose a topic</small><h2>How can we help?</h2></div></div><div class="support-topics">${topics.map(t=>`<button data-support-topic="${t}" class="${supportTopic===t?'active':''}"><span>${t==='Charger problem'?'ϟ':t==='Payment issue'?'▭':t==='Reservation help'?'R':'◉'}</span><strong>${t}</strong><small>${t==='Charger problem'?'Connector, cable or station fault':t==='Payment issue'?'Charge, refund or invoice':t==='Reservation help'?'Modify, cancel or arrival issue':'Profile, access or vehicle'}</small></button>`).join('')}</div></section>
      <section class="support-actions"><button data-live-chat><span>●</span><div><small>Recommended</small><strong>Start live chat</strong></div><b>${icon('chevron')}</b></button><button data-report-problem><span>!</span><div><small>Create a service request</small><strong>Report charger problem</strong></div><b>${icon('chevron')}</b></button><button data-emergency-support><span>☎</span><div><small>Emergency only</small><strong>Call support</strong></div><b>${icon('chevron')}</b></button></section>
      <section class="account-section"><div class="section-heading"><div><small>Your requests</small><h2>Support tickets</h2></div><button class="ui-text-button" data-open-ticket-list>View all</button></div><div class="support-ticket-list">${tickets.slice(0,2).map(t=>`<button class="ui-list-item support-ticket-row" data-open-support-ticket="${t.id}"><span class="ui-list-icon">${t.status==='Resolved'?'✓':'!'}</span><span><small>${t.id} · ${t.updated}</small><strong>${t.title}</strong><em>${t.status} · ${t.priority} priority</em></span><span>${icon('chevron')}</span></button>`).join('')}</div></section>
      <section class="account-section"><div class="section-heading"><div><small>Frequently asked</small><h2>${supportTopic}</h2></div></div><div class="faq-list">${faqs.length?faqs.map(f=>`<button class="ui-list-item" data-open-faq="${f.id}"><span class="ui-list-icon">?</span><span><strong>${f.title}</strong><small>${f.text}</small></span><span>${icon('chevron')}</span></button>`).join(''):`<div class="ui-state ui-state--empty"><span>?</span><h2>No matching answers</h2><p>Try another topic or start a live chat.</p></div>`}</div></section>`, 'support-return');
}
function supportTicketsScreen(){
  return simpleHeaderBack('Support tickets',`${supportTickets.length} requests`, `<section class="support-ticket-list">${supportTickets.map(t=>`<button class="ui-list-item support-ticket-row" data-open-support-ticket="${t.id}"><span class="ui-list-icon">${t.status==='Resolved'?'✓':'!'}</span><span><small>${t.id} · ${t.updated}</small><strong>${t.title}</strong><em>${t.status} · ${t.category}</em></span><span>${icon('chevron')}</span></button>`).join('')}</section>`, 'support');
}
function supportTicketDetailScreen(){
  const t=supportTickets.find(x=>x.id===selectedSupportTicketId)||supportTickets[0];
  return simpleHeaderBack(t.title,`${t.id} · ${t.status}`, `${supportMessage?`<div class="ui-feedback ui-feedback--success">${supportMessage}</div>`:''}<section class="support-ticket-hero ui-surface--dark"><div><small>${t.category}</small><h2>${t.status}</h2><p>${t.station} · ${t.charger}</p></div><span class="viz-badge">${t.priority}</span></section><section class="ui-card support-ticket-meta"><div><small>Ticket ID</small><strong>${t.id}</strong></div><div><small>Last update</small><strong>${t.updated}</strong></div><div><small>Priority</small><strong>${t.priority}</strong></div></section><section class="support-conversation"><div class="section-heading"><div><small>Conversation</small><h2>Messages</h2></div></div>${t.messages.map(m=>`<article class="support-message ${m.from==='You'?'is-user':'is-agent'}"><small>${m.from} · ${m.time}</small><p>${m.text}</p></article>`).join('')}</section>${t.status!=='Resolved'?`<section class="ui-card ui-form"><label><span>Reply</span><textarea id="support-reply" rows="3" placeholder="Write a message to support"></textarea></label><label class="photo-upload"><span>＋</span><strong>Add attachment</strong><small>Photo or document · prototype</small></label><button class="ui-button ui-button--primary ui-button--block" data-send-support-reply>Send message</button></section><button class="ui-button ui-button--secondary ui-button--block" data-close-support-ticket>Close request</button>`:`<section class="ui-card support-rating"><small>How was the support?</small><h2>Rate this resolution</h2><div class="support-stars">${[1,2,3,4,5].map(n=>`<button data-support-rating="${n}" class="${supportRating>=n?'active':''}">★</button>`).join('')}</div></section>`}`, 'support-ticket-return');
}
function faqDetailScreen(){
  const f=supportFaqs.find(x=>x.id===window.__faqId)||supportFaqs[0];
  return simpleHeaderBack(f.title,f.topic,`<section class="ui-card faq-detail"><span class="ui-list-icon">?</span><h2>${f.title}</h2><p>${f.text}</p><div class="faq-steps"><strong>Still need help?</strong><p>Start a live chat or create a service request and include the charger or session ID.</p></div></section><button class="ui-button ui-button--primary ui-button--block" data-live-chat>Start live chat</button><button class="ui-button ui-button--secondary ui-button--block" data-report-problem>Create service request</button>`, 'support');
}

function reportProblemScreen(){
    const activeContext=appState==='charging'&&activeChargingSession?chargingSessionContext():null;
    const savedSession=sessions.find(x=>x.id===selectedActivityId)||sessions.find(x=>x.id===latestCompletedSessionId)||sessions[0];
    const stationName=activeContext?.station?.name||savedSession?.place||selectedStation.name;
    const chargerId=activeContext?.connector?.id||savedSession?.charger||startCharge.connector||'04';
    const connectorType=activeContext?.connector?.type||savedSession?.connector||selectedStation.connector||'CCS2';
    const sessionLabel=activeContext?`Active session · Started ${activeContext.started}`:`${savedSession?.id||'Session'} · ${savedSession?.status||'Saved session'}`;
    if(reportSubmitted) return simpleHeaderBack('Problem reported','Service request created', `<section class="report-success"><span>✓</span><h2>We received your report</h2><p>Ticket ${lastCreatedSupportTicketId} was sent to the operations team. Charger ${chargerId} will be checked remotely first.</p><div class="report-ticket"><div><small>Priority</small><strong>High</strong></div><div><small>Expected update</small><strong>Within 5 min</strong></div></div></section><button class="primary-action compact" data-return-report><span class="primary-icon">${icon('history')}</span><span><small>Return to previous screen</small><strong>Back to session</strong></span><span>${icon('chevron')}</span></button>`, 'report-return');
    const issues=['Cable locked','Charging stopped','Power is too low','Screen or connector damaged','Other'];
    return simpleHeaderBack('Report a problem',`${stationName} · Charger ${chargerId}`, `<section class="report-context"><span>${icon('zap')}</span><div><small>Active equipment</small><h2>Charger ${chargerId} · ${connectorType}</h2><p>${sessionLabel}</p></div><span class="live-chip">${activeContext?'Online':'Session record'}</span></section><section class="account-section"><div class="section-heading"><div><small>Problem type</small><h2>What happened?</h2></div></div><div class="issue-options">${issues.map((x,i)=>`<label class="issue-option"><input type="radio" name="issue" value="${x}" ${i===1?'checked':''}><span><strong>${x}</strong><small>${i===0?'Cable cannot be removed from vehicle or charger':i===1?'Session interrupted unexpectedly':i===2?'Charging is much slower than expected':i===3?'Visible physical damage':'Describe another issue'}</small></span></label>`).join('')}</div><label class="report-note"><span>Additional details</span><textarea id="report-details" placeholder="Tell us what you see or what happened...">Charging stopped after several minutes and did not resume.</textarea></label><label class="photo-upload"><span>＋</span><strong>Add photo</strong><small>Optional for this prototype</small></label></section><button class="primary-action compact" data-submit-report><span class="primary-icon">!</span><span><small>Send diagnostics automatically</small><strong>Submit problem report</strong></span><span>${icon('chevron')}</span></button>`, 'report-return');
}


function billingScreen(){
 const currentPlan=membershipPlans.find(p=>p.id===billingProfile.plan)||membershipPlans[0];
 return simpleHeaderBack('Billing & subscription','Membership, energy credits and invoices', `${membershipMessage?`<div class="ui-feedback ui-feedback--success">${membershipMessage}</div>`:''}<section class="ui-card subscription-card"><div><small>Current membership</small><h2>${billingProfile.plan}</h2><p>${currentPlan.tag}. ${billingProfile.plan==='VoltDrive Free'?'Upgrade any time with no activation fee.':billingProfile.autoRenew?'Renews automatically each month.':'Automatic renewal is off.'}</p></div><span class="viz-badge is-current">Active</span></section><section class="credit-balance-card"><div><small>Charging package balance</small><strong>${chargingCredits.kwh} kWh</strong><p>Credits expire ${chargingCredits.expires}</p></div><button class="ui-button ui-button--secondary ui-button--compact" data-browse-packages>Buy kWh</button></section><section class="account-section"><div class="section-heading"><div><small>Memberships</small><h2>Choose your plan</h2></div><button class="ui-text-button" data-compare-plans>Compare</button></div><div class="membership-preview-list">${membershipPlans.map(p=>`<button class="membership-preview ${billingProfile.plan===p.id?'is-current':''}" data-open-plan="${p.id}"><span><small>${p.name}</small><strong>${p.price.toLocaleString()} AMD</strong><em>${p.period}</em></span><span>${billingProfile.plan===p.id?'Current':'View'} ›</span></button>`).join('')}</div></section><label class="ui-list-item security-toggle"><span class="ui-list-icon">↻</span><span><small>Subscription</small><strong>Automatic renewal</strong><em>Charge the default payment method before expiry</em></span><input class="ui-switch" type="checkbox" data-billing-renew ${billingProfile.autoRenew?'checked':''}></label><section class="ui-card promo-card"><div class="section-heading"><div><small>Promotion</small><h2>Promo code</h2></div></div><div class="promo-entry"><input id="billing-promo" value="${billingProfile.promoCode}" placeholder="Enter promo code"><button class="ui-button ui-button--secondary ui-button--compact" data-apply-promo>Apply</button></div><small>Codes may discount a membership or add charging credits.</small></section><section class="ui-card ui-form"><div class="section-heading"><div><small>Business billing</small><h2>Invoice details</h2></div></div><label><span>Company name</span><input id="billing-company" value="${billingProfile.company}" placeholder="Optional"></label><label><span>Tax ID</span><input id="billing-tax" value="${billingProfile.taxId}" placeholder="Optional"></label><label><span>Billing email</span><input id="billing-email" type="email" value="${billingProfile.billingEmail}"></label></section><section class="ui-card invoice-list"><div class="section-heading"><div><small>Documents</small><h2>Recent invoices</h2></div></div><button class="ui-list-item" data-open-invoice="VD-0726-184"><span class="ui-list-icon">PDF</span><span><small>July 2026</small><strong>Charging invoice #VD-0726-184</strong><em>18,420 AMD · Paid</em></span><span>${icon('chevron')}</span></button><button class="ui-list-item" data-open-invoice="VD-0626-129"><span class="ui-list-icon">PDF</span><span><small>June 2026</small><strong>Charging invoice #VD-0626-129</strong><em>12,860 AMD · Paid</em></span><span>${icon('chevron')}</span></button></section><button class="ui-button ui-button--primary ui-button--block" data-save-billing>Save billing details</button>`, 'account');
}
function membershipCompareScreen(){
 return simpleHeaderBack('Compare memberships','Choose a plan for your charging habits', `<section class="membership-compare">${membershipPlans.map(p=>`<article class="ui-card membership-plan-card ${billingProfile.plan===p.id?'is-current':''}"><div class="membership-plan-head"><div><small>${p.tag}</small><h2>${p.name}</h2></div>${billingProfile.plan===p.id?'<span class="viz-badge is-current">Current</span>':''}</div><div class="membership-price"><strong>${p.price.toLocaleString()}</strong><span>AMD · ${p.period}</span></div><ul>${p.features.map(f=>`<li><span>✓</span>${f}</li>`).join('')}</ul><button class="ui-button ${billingProfile.plan===p.id?'ui-button--secondary':'ui-button--primary'} ui-button--block" data-open-plan="${p.id}">${billingProfile.plan===p.id?'Manage current plan':'Choose '+p.name}</button></article>`).join('')}</section>`, 'billing');
}
function membershipPlanScreen(){
 const plan=membershipPlans.find(p=>p.id===selectedPlan)||membershipPlans[1]; const current=billingProfile.plan===plan.id;
 return simpleHeaderBack(plan.name+' membership',plan.tag, `<section class="membership-hero"><small>${plan.name} membership</small><h2>${plan.price.toLocaleString()} AMD</h2><p>${plan.period}</p></section><section class="ui-card membership-benefits"><small>Included benefits</small><h2>What you receive</h2><ul>${plan.features.map(f=>`<li><span>✓</span>${f}</li>`).join('')}</ul></section>${current?`<section class="ui-card current-plan-actions"><div><small>Membership status</small><strong>Active</strong><p>${billingProfile.autoRenew?'Next renewal: 5 Sep 2026':'Ends at the current billing period.'}</p></div><button class="ui-button ui-button--danger ui-button--block" data-cancel-membership>Cancel membership</button></section>`:`<section class="ui-card cost-card"><div><span>Membership</span><strong>${plan.price.toLocaleString()} AMD</strong></div><div><span>Activation fee</span><strong>0 AMD</strong></div><div class="total"><span>Due today</span><strong>${plan.price.toLocaleString()} AMD</strong></div><small>Renews monthly until cancelled. You can turn off renewal at any time.</small></section><button class="ui-button ui-button--primary ui-button--block" data-checkout-plan="${plan.id}">Continue with ${plan.name}</button>`}`, 'billing');
}
function packageListScreen(){
 return simpleHeaderBack('Charging packages','Prepay energy and use it across VoltDrive', `<section class="package-balance"><small>Available credits</small><strong>${chargingCredits.kwh} kWh</strong><p>Used automatically before your Wallet or card.</p></section><section class="package-grid">${chargingPackages.map(p=>`<button class="ui-card package-option ${selectedPackageId===p.id?'is-selected':''}" data-select-package="${p.id}"><div><small>${p.validity}</small><h2>${p.name}</h2><p>${p.kwh} kWh charging credit</p></div><div><strong>${p.price.toLocaleString()} AMD</strong><span>${p.saving}</span></div></button>`).join('')}</section><section class="ui-card package-rules"><small>Package rules</small><ul><li>Valid at VoltDrive-operated public chargers.</li><li>Unused credits expire at the end of the validity period.</li><li>Idle, reservation and parking fees are charged separately.</li></ul></section><button class="ui-button ui-button--primary ui-button--block" data-checkout-package>Buy selected package</button>`, 'billing');
}
function membershipCheckoutScreen(){
 const isPlan=membershipCheckoutMode==='plan'; const item=isPlan?(membershipPlans.find(p=>p.id===selectedPlan)||membershipPlans[1]):(chargingPackages.find(p=>p.id===selectedPackageId)||chargingPackages[1]); const price=item.price;
 return simpleHeaderBack('Review purchase',isPlan?'Membership activation':'Charging package purchase', `<section class="confirmation-hero"><span>◆</span><small>${isPlan?'Membership':'Energy credits'}</small><h2>${isPlan?item.name:item.name+' · '+item.kwh+' kWh'}</h2><p>${isPlan?item.period:item.validity}</p></section><section class="summary-card"><div><span>Payment method</span><strong>${paymentMethodLabel(defaultPaymentMethod())}</strong><small>Default card</small></div><div><span>${isPlan?'Renewal':'Credit validity'}</span><strong>${isPlan?'Monthly':'Until '+item.validity}</strong><small>${isPlan?'Cancel any time':'Fees are not included'}</small></div></section><section class="cost-card"><div><span>${isPlan?'Plan price':'Package price'}</span><strong>${price.toLocaleString()} AMD</strong></div>${billingProfile.promoCode?`<div><span>Promo discount</span><strong>−500 AMD</strong></div>`:''}<div class="total"><span>Pay now</span><strong>${Math.max(0,price-(billingProfile.promoCode?500:0)).toLocaleString()} AMD</strong></div></section><label class="ui-check-row"><input type="checkbox" id="membership-terms" checked><span>I accept the purchase and renewal conditions.</span></label><button class="ui-button ui-button--primary ui-button--block" data-confirm-membership-purchase>Confirm purchase</button>`, isPlan?'membership-plan':'packages');
}
function membershipSuccessScreen(){
 const isPlan=membershipCheckoutMode==='plan'; const item=isPlan?(membershipPlans.find(p=>p.id===selectedPlan)||membershipPlans[1]):(chargingPackages.find(p=>p.id===selectedPackageId)||chargingPackages[1]);
 return simpleHeaderBack('Purchase complete','Your account has been updated', `<section class="success-card"><div class="success-ring">✓</div><small>${isPlan?'Membership activated':'Package added'}</small><h2>${isPlan?item.name:item.kwh+' kWh credits'}</h2><p>${isPlan?'Your lower rates and membership benefits are active now.':'Credits will be used automatically during your next charging session.'}</p><div class="success-meta"><div><small>Status</small><strong>Active</strong></div><div><small>Receipt</small><strong>#MB-2084</strong></div><div><small>${isPlan?'Renewal':'Expires'}</small><strong>${isPlan?'5 Sep':'31 Oct'}</strong></div></div></section><button class="ui-button ui-button--primary ui-button--block" data-membership-done>Back to billing</button>`, 'billing');
}
function legalScreen(){
 return simpleHeaderBack('Legal','Policies and application information', `<section class="ui-card legal-summary"><small>VoltDrive Driver</small><h2>Transparent terms for charging</h2><p>The prototype shows where customers can review the rules governing reservations, charging, payments and personal data.</p></section><section class="settings-list legal-links"><button data-legal-doc="Terms of Service"><span>§</span><div><strong>Terms of Service</strong><small>Charging, reservations and account rules</small></div><span>${icon('chevron')}</span></button><button data-legal-doc="Privacy Policy"><span>◈</span><div><strong>Privacy Policy</strong><small>How personal and vehicle data is used</small></div><span>${icon('chevron')}</span></button><button data-legal-doc="Charging Terms"><span>ϟ</span><div><strong>Charging Terms</strong><small>Tariffs, idle fees and session responsibility</small></div><span>${icon('chevron')}</span></button><button data-legal-doc="Open-source licences"><span>{ }</span><div><strong>Open-source licences</strong><small>Software components and acknowledgements</small></div><span>${icon('chevron')}</span></button></section><section class="ui-card app-version"><div><small>Application</small><strong>VoltDrive Driver Prototype</strong><p>Version 21.0 · Driver experience</p></div><span class="viz-badge">Demo</span></section>`, 'account');
}
function legalDocumentScreen(){
 const title = window.__legalTitle || 'Terms of Service';
 return simpleHeaderBack(title,'Last updated 5 August 2026', `<section class="ui-card legal-document"><h2>${title}</h2><p>This prototype page demonstrates the final information architecture. Production legal text must be provided and approved by the company legal team for every supported country.</p><h3>1. Scope</h3><p>The policy applies to account access, charger discovery, reservations, charging sessions, payments and support interactions.</p><h3>2. Customer responsibilities</h3><p>Customers must use compatible vehicles and connectors, follow site instructions and move the vehicle before an idle-fee period begins.</p><h3>3. Charges and records</h3><p>Applicable energy, time, reservation, parking and idle fees are presented before confirmation and recorded in Sessions.</p></section>`, 'legal');
}
function finalQAScreen(){
    const scenarios = [
      ['auth','New user registration','Create account, verify email, finish onboarding and reach Home.'],
      ['login','Existing user sign-in','Sign in with credentials and open the saved driver account.'],
      ['reserve','Find and reserve','Search a station, choose a slot and confirm one reservation ID.'],
      ['navigate','Navigation and arrival','Start route guidance, arrive and confirm the assigned bay.'],
      ['charge','Start and complete charge','Authorize payment, start, stop and create a session record.'],
      ['records','Wallet, Sessions and receipt','Verify matching Session, Payment, Wallet and Receipt data.'],
      ['failure','Failure recovery','Trigger payment or charger failure and recover without losing context.'],
      ['support','Support ticket','Create a ticket, send a message, close it and rate support.']
    ];
    const done = qaCompleted.size;
    return simpleHeaderBack('Final driver QA','End-to-end prototype verification', `<section class="qa-progress ui-card"><div><small>Scenarios completed</small><strong>${done} / ${scenarios.length}</strong><p>${done===scenarios.length?'All driver journeys are verified.':'Complete every journey before handoff.'}</p></div><span>${Math.round(done/scenarios.length*100)}%</span></section>${qaMessage?`<div class="ui-feedback ui-feedback--success">${qaMessage}</div>`:''}<section class="qa-list">${scenarios.map(([id,title,desc],i)=>`<article class="ui-card qa-row ${qaCompleted.has(id)?'is-complete':''}"><button class="qa-check" data-qa-toggle="${id}" aria-label="Mark ${title} complete">${qaCompleted.has(id)?'✓':i+1}</button><div><strong>${title}</strong><small>${desc}</small></div><button class="ui-text-button" data-qa-run="${id}">Run</button></article>`).join('')}</section><button class="ui-button ui-button--secondary ui-button--block" data-qa-reset>Reset QA checklist</button>`, 'prototype-tools');
}
function runQAScenario(id){
    qaMessage='';
    if(id==='auth'){ authMode='register'; screen='auth'; return; }
    if(id==='login'){ authMode='login'; screen='auth'; return; }
    if(id==='reserve'){ activeTab='map'; selectedStation=stations[0]; reservationMode='create'; reservationStep=1; resetReservationVehicleToActive(); screen='reservation'; return; }
    if(id==='navigate'){ appState='reserved'; const qaVehicle=reservationVehicleRecord(reservation)||activeVehicleRecord(); activeReservation=activeReservation||{...reservation,vehicleId:qaVehicle?.id||null,vehicle:qaVehicle?.name||reservation.vehicle,id:'VD-RS-QA',status:'Confirmed'}; navigationState={source:'reservation',started:false,progress:0,arrived:false,arrivalConfirmed:false,assignment:null}; screen='navigation-preview'; return; }
    if(id==='charge'){ activeTab='charge'; prepareNewChargingSession(); startCharge.code='VD-04-CCS2'; startCharge.connector='04'; screen='charge-start'; return; }
    if(id==='records'){ activeTab='activity'; activitySection='sessions'; selectedActivityId=latestCompletedSessionId; screen='session-detail'; return; }
    if(id==='failure'){ activeTab='charge'; startCharge.error='payment'; screen='charge-start-error'; return; }
    if(id==='support'){ supportTopic='Charger problem'; supportReturn={screen:'final-qa',tab:'account'}; screen='support'; return; }
}

function prototypeToolsScreen(){
    const states=['idle','reserved','charging','completed'];
    return simpleHeaderBack('Prototype tools','Test-only controls · not visible in production', `${prototypeMessage?`<div class="ui-feedback ui-feedback--success">${prototypeMessage}</div>`:''}<section class="ui-card developer-warning"><span>⚙</span><div><strong>Developer environment</strong><p>These controls reset demo data and simulate application states. They are outside the customer experience.</p></div></section><section class="account-section"><div class="section-heading"><div><small>Application state</small><h2>Simulate driver status</h2></div></div><div class="ui-segment-grid ui-segment-grid--four">${states.map(x=>`<button data-state="${x}" class="${appState===x?'is-selected':''}">${x}</button>`).join('')}</div></section><section class="account-section"><div class="section-heading"><div><small>Home screen</small><h2>Simulate edge states</h2></div></div><div class="ui-segment-grid home-scenario-grid">${['normal','low-battery','offline','no-payment','no-vehicle','station-unavailable','loading'].map(x=>`<button data-home-scenario="${x}" class="${homeScenario===x?'is-selected':''}">${x}</button>`).join('')}</div></section><section class="account-section"><div class="section-heading"><div><small>First launch</small><h2>Onboarding controls</h2></div></div><button class="ui-list-item" data-preview-onboarding><span class="ui-list-item__icon">✦</span><span><strong>Restart onboarding</strong><small>Login/register, region, vehicle, payment and permissions</small></span><span>${icon('chevron')}</span></button><button class="ui-list-item" data-reset-demo><span class="ui-list-item__icon">↺</span><span><strong>Reset demo data</strong><small>Restore vehicles, wallet and session state</small></span><span>${icon('chevron')}</span></button><button class="ui-list-item" data-open-final-qa><span class="ui-list-item__icon">✓</span><span><strong>Final end-to-end QA</strong><small>Run and verify all driver journeys</small></span><span>${icon('chevron')}</span></button></section><section class="developer-note"><strong>Production rule</strong><p>This screen must be disabled in release builds.</p></section>`, 'account');
}


function securityScreen(){
    return simpleHeaderBack('Security & privacy','Protect your VoltDrive account', `
      ${securityMessage?`<div class="ui-feedback ui-feedback--success">${securityMessage}</div>`:''}
      <section class="security-score ui-card">
        <div class="security-score__ring"><strong>${twoFactorEnabled ? '92' : '74'}</strong><small>/100</small></div>
        <div><small>Security score</small><h2>${twoFactorEnabled ? 'Strong protection' : 'Protection can be improved'}</h2><p>${twoFactorEnabled ? 'Two-factor authentication is active on your account.' : 'Enable two-factor authentication for stronger protection.'}</p></div>
      </section>
      <section class="account-section">
        <div class="section-heading"><div><small>Account access</small><h2>Sign-in protection</h2></div></div>
        <div class="ui-stack">
          <button class="ui-list-item" data-change-password><span class="ui-list-icon">••</span><span><small>Password</small><strong>Change password</strong><em>Last changed 14 days ago</em></span><span>${icon('chevron')}</span></button>
          <label class="ui-list-item security-toggle"><span class="ui-list-icon">2F</span><span><small>Verification</small><strong>Two-factor authentication</strong><em>Use a code when signing in</em></span><input class="ui-switch" type="checkbox" data-toggle-2fa ${twoFactorEnabled?'checked':''}></label>
          <label class="ui-list-item security-toggle"><span class="ui-list-icon">ID</span><span><small>Quick access</small><strong>Biometric unlock</strong><em>Use Face ID or fingerprint</em></span><input class="ui-switch" type="checkbox" data-toggle-biometric ${biometricEnabled?'checked':''}></label>
        </div>
      </section>
      <section class="account-section">
        <div class="section-heading"><div><small>Connected devices</small><h2>Active sessions</h2></div><button class="ui-text-button" data-signout-others>Sign out others</button></div>
        <div class="ui-stack">${connectedSessions.map(session=>`<div class="ui-list-item"><span class="ui-list-icon">${session.current?'●':'◌'}</span><span><small>${session.location}</small><strong>${session.device}</strong><em>${session.time}</em></span><span class="viz-badge ${session.current?'is-current':''}">${session.current?'This device':'Active'}</span></div>`).join('')}</div>
      </section>
      <section class="ui-card security-danger">
        <div><small>Account session</small><strong>Sign out of VoltDrive</strong><p>You will need your password or verification code to sign in again.</p></div>
        <button class="ui-button ui-button--danger ui-button--block" data-sign-out>Sign out</button>
      </section>`, 'account');
}

function changePasswordScreen(){
    return simpleHeaderBack('Change password','Use a strong, unique password', `
      ${securityMessage?`<div class="ui-feedback ui-feedback--error">${securityMessage}</div>`:''}
      <section class="ui-card ui-form">
        <label><span>Current password</span><input id="security-current" type="password" value="voltdrive2026"></label>
        <label><span>New password</span><input id="security-new" type="password" placeholder="At least 8 characters"></label>
        <label><span>Confirm new password</span><input id="security-confirm" type="password" placeholder="Repeat new password"></label>
        <div class="password-rules"><span>✓ At least 8 characters</span><span>✓ One number recommended</span><span>✓ Do not reuse old passwords</span></div>
      </section>
      <button class="ui-button ui-button--primary ui-button--block" data-save-password>Update password</button>`, 'security');
}



let lastAnnouncedScreen = '';

function screenLabel() {
    const labels = {
        auth: 'Authentication', onboarding: 'Account setup', 'onboarding-success': 'Setup complete',
        home: 'Home', map: 'Charging map', 'map-filters': 'Map filters', location: 'Station details',
        reservation: 'Reservation', 'reservation-success': 'Reservation confirmed', 'reservation-manage': 'Manage reservation',
        'reservation-cancel': 'Cancel reservation', 'waiting-list': 'Waiting list', 'reservation-no-show': 'Missed reservation',
        'charge-start': 'Start charging', 'charge-scan': 'Scan charger', 'charger-check': 'Charger check',
        'connector-select': 'Select connector', 'payment-authorize': 'Payment authorization', 'tariff-review': 'Tariff review', 'charge-limit': 'Charging limit',
        'charge-connecting': 'Connecting to charger', 'charge-start-error': 'Charging error', charging: 'Active charging',
        'charging-summary': 'Charging complete', activity: 'Sessions', 'session-detail': 'Session details',
        'activity-reservation-detail': 'Reservation details', 'payment-detail': 'Payment details', receipt: 'Receipt',
        'refund-request': 'Refund request', 'payment-dispute': 'Payment dispute', 'navigation-preview': 'Route preview',
        'navigation-active': 'Navigation', arrival: 'Arrival confirmation', 'parking-monitor': 'Parking session',
        'parking-extend': 'Extend parking', 'parking-complete': 'Parking complete', notifications: 'Notifications',
        'notification-detail': 'Notification details', support: 'Help and support', 'support-tickets': 'Support tickets',
        'support-ticket-detail': 'Support ticket', 'faq-detail': 'Help article', 'report-problem': 'Report a problem',
        garage: 'Vehicle garage', 'add-vehicle': 'Add vehicle', wallet: 'Wallet', 'prototype-tools': 'Prototype tools',
        'final-qa': 'End-to-end QA', security: 'Security', 'change-password': 'Change password',
        'notification-settings': 'Notification settings', 'edit-profile': 'Edit profile', 'language-region': 'Language and region', 'permission-request': 'App permission', permissions: 'App permissions',
        preferences: 'Preferences', privacy: 'Privacy and data', 'delete-account': 'Delete account', billing: 'Billing and subscription',
        'membership-compare': 'Compare plans', 'membership-plan': 'Membership plan', packages: 'Charging packages',
        'membership-checkout': 'Purchase confirmation', 'membership-success': 'Purchase complete', legal: 'Legal',
        'legal-document': 'Legal document', 'access-methods': 'Charging access', 'rfid-editor': 'RFID card',
        'plug-charge': 'Plug and Charge', account: 'Account'
    };
    return labels[screen] || 'VoltDrive';
}

function enhanceRenderedUI(app) {
    document.body.dataset.screen = screen;
    app.setAttribute('aria-busy', 'false');

    app.querySelectorAll('button').forEach(button => {
        button.type = 'button';
        if (button.classList.contains('active') || button.classList.contains('is-selected') || button.classList.contains('selected')) {
            button.setAttribute('aria-pressed', 'true');
        }
    });

    app.querySelectorAll('[data-tab]').forEach(button => {
        if (button.dataset.tab === activeTab) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
    });

    app.querySelectorAll('svg').forEach(svg => {
        if (!svg.hasAttribute('aria-label')) svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
    });

    app.querySelectorAll('input, select, textarea').forEach(control => {
        if (!control.getAttribute('aria-label') && !control.id) {
            const text = control.getAttribute('placeholder') || control.getAttribute('name') || 'Form field';
            control.setAttribute('aria-label', text);
        }
    });

    const title = screenLabel();
    const live = document.querySelector('#app-live-region');
    if (live && lastAnnouncedScreen !== screen) {
        live.textContent = `${title} screen opened`;
        lastAnnouncedScreen = screen;
    }

    const heading = app.querySelector('h1, h2');
    if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.setAttribute('data-screen-heading', '');
    }

    if (!navigator.onLine) {
        const banner = document.createElement('div');
        banner.className = 'connection-banner';
        banner.setAttribute('role', 'status');
        banner.innerHTML = '<strong>Offline mode</strong><span>Live charger availability and payments may be unavailable.</span>';
        app.prepend(banner);
    }
}

function render() {
    const app = document.querySelector('#app');
    if (!app)
        throw new Error('App container not found');
    applyTheme();
    app.innerHTML = screen === 'auth' ? authScreen() : screen === 'onboarding' ? onboardingScreen() : screen === 'onboarding-success' ? onboardingSuccessScreen() : screen === 'home' ? homeScreen() : screen === 'map' ? mapScreen() : screen === 'map-filters' ? mapFiltersScreen() : screen === 'location' ? locationScreen() : screen === 'reservation' ? reservationScreen() : screen === 'reservation-success' ? reservationSuccessScreen() : screen === 'reservation-manage' ? reservationManageScreen() : screen === 'reservation-cancel' ? cancelReservationScreen() : screen === 'waiting-list' ? waitingListScreen() : screen === 'reservation-no-show' ? noShowScreen() : screen === 'charge-start' ? chargeStartScreen() : screen === 'charge-scan' ? chargeScanScreen() : screen === 'charger-check' ? chargerCheckScreen() : screen === 'connector-select' ? connectorSelectScreen() : screen === 'payment-authorize' ? paymentAuthorizeScreen() : screen === 'tariff-review' ? tariffReviewScreen() : screen === 'charge-limit' ? chargeLimitScreen() : screen === 'charge-connecting' ? chargeConnectingScreen() : screen === 'charge-start-error' ? chargeStartErrorScreen() : screen === 'charging' ? chargingScreen() : screen === 'charging-summary' ? chargingSummaryScreen() : screen === 'activity' ? activityScreen() : screen === 'session-detail' ? sessionDetailScreen() : screen === 'activity-reservation-detail' ? activityReservationDetailScreen() : screen === 'payment-detail' ? paymentDetailScreen() : screen === 'receipt' ? receiptScreen() : screen === 'refund-request' ? refundRequestScreen() : screen === 'payment-dispute' ? disputePaymentScreen() : screen === 'navigation-preview' ? navigationPreviewScreen() : screen === 'navigation-active' ? navigationActiveScreen() : screen === 'arrival' ? arrivalScreen() : screen === 'parking-monitor' ? parkingMonitorScreen() : screen === 'parking-extend' ? parkingExtendScreen() : screen === 'parking-complete' ? parkingCompleteScreen() : screen === 'notifications' ? notificationsScreen() : screen === 'notification-detail' ? notificationDetailScreen() : screen === 'support' ? supportScreen() : screen === 'support-tickets' ? supportTicketsScreen() : screen === 'support-ticket-detail' ? supportTicketDetailScreen() : screen === 'faq-detail' ? faqDetailScreen() : screen === 'report-problem' ? reportProblemScreen() : screen === 'garage' ? garageScreen() : screen === 'add-vehicle' ? addVehicleScreen() : screen === 'wallet' ? walletScreen() : screen === 'prototype-tools' ? prototypeToolsScreen() : screen === 'final-qa' ? finalQAScreen() : screen === 'security' ? securityScreen() : screen === 'change-password' ? changePasswordScreen() : screen === 'notification-settings' ? notificationSettingsScreen() : screen === 'edit-profile' ? editProfileScreen() : screen === 'language-region' ? languageRegionScreen() : screen === 'preferences' ? preferencesScreen() : screen === 'privacy' ? privacyScreen() : screen === 'delete-account' ? deleteAccountScreen() : screen === 'billing' ? billingScreen() : screen === 'membership-compare' ? membershipCompareScreen() : screen === 'membership-plan' ? membershipPlanScreen() : screen === 'packages' ? packageListScreen() : screen === 'membership-checkout' ? membershipCheckoutScreen() : screen === 'membership-success' ? membershipSuccessScreen() : screen === 'legal' ? legalScreen() : screen === 'legal-document' ? legalDocumentScreen() : screen === 'access-methods' ? accessMethodsScreen() : screen === 'rfid-editor' ? rfidEditorScreen() : screen === 'plug-charge' ? plugChargeScreen() : screen === 'permission-request' ? permissionRequestScreen() : accountScreen();
    convertRenderedCurrency(app.querySelector('.phone-shell') || app);
    translateRenderedUi(app.querySelector('.phone-shell') || app);
    app.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
        activeTab = b.dataset.tab;
        if(activeTab === 'charge'){
            if(appState === 'charging') screen='charging';
            else if(requireActiveVehicleForFlow('charge-start','charge')) { prepareNewChargingSession(); screen='charge-start'; }
        } else if(activeTab === 'map') screen='map';
        else if(activeTab === 'activity') screen='activity';
        else if(activeTab === 'account') screen='account';
        else {
            screen='home';
        }
        render();
    }));

    app.querySelector('[data-preview-onboarding]')?.addEventListener('click', () => { onboardingStep=1; authMode='welcome'; authMessage=''; screen='auth'; render(); });
    app.querySelector('[data-open-prototype-tools]')?.addEventListener('click', () => { prototypeMessage=''; screen='prototype-tools'; render(); });
    app.querySelector('[data-open-final-qa]')?.addEventListener('click',()=>{screen='final-qa';qaMessage='';render();});
    app.querySelectorAll('[data-qa-toggle]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.qaToggle;qaCompleted.has(id)?qaCompleted.delete(id):qaCompleted.add(id);qaMessage=qaCompleted.size===8?'All end-to-end scenarios passed. Driver App is ready for prototype handoff.':'';render();}));
    app.querySelectorAll('[data-qa-run]').forEach(b=>b.addEventListener('click',()=>{runQAScenario(b.dataset.qaRun);render();}));
    app.querySelector('[data-qa-reset]')?.addEventListener('click',()=>{qaCompleted.clear();qaMessage='QA checklist reset.';render();});
    app.querySelector('[data-reset-demo]')?.addEventListener('click', () => { resetDemoData(); screen='prototype-tools'; render(); });
    app.querySelectorAll('[data-auth-login]').forEach(b => b.addEventListener('click', () => { authMode='login'; authMessage=''; screen='auth'; render(); }));
    app.querySelectorAll('[data-auth-register]').forEach(b => b.addEventListener('click', () => { authMode='register'; authMessage=''; screen='auth'; render(); }));
    app.querySelector('[data-auth-back]')?.addEventListener('click', () => { authMode='welcome'; authMessage=''; render(); });
    app.querySelectorAll('[data-forgot-password]').forEach(b => b.addEventListener('click', () => { authMode='forgot'; authMessage=''; render(); }));
    app.querySelector('[data-login-submit]')?.addEventListener('click', () => { const identity=document.querySelector('#login-identity')?.value?.trim(); const password=document.querySelector('#login-password')?.value; if(!identity || !password){ authMessage='Enter your login and password.'; render(); return; } onboardingComplete=true; activeTab='home'; screen='home'; render(); });
    app.querySelector('[data-register-submit]')?.addEventListener('click', () => { const name=document.querySelector('#register-name')?.value?.trim(); const email=document.querySelector('#register-email')?.value?.trim(); const password=document.querySelector('#register-password')?.value; const confirm=document.querySelector('#register-confirm')?.value; const terms=document.querySelector('#register-terms')?.checked; if(!name || !email || !password){ authMessage='Enter your full name, email and password.'; render(); return; } if(password!==confirm){ authMessage='Passwords do not match.'; render(); return; } if(!terms){ authMessage='Accept the Terms and Privacy Policy to continue.'; render(); return; } onboardingData.name=name; onboardingData.email=email; onboardingData.cardholder=name.toUpperCase(); onboardingAccountApplied=false; authMode='verify'; authMessage=''; render(); });
    app.querySelector('[data-verify-submit]')?.addEventListener('click', () => { onboardingStep=1; authMessage=''; screen='onboarding'; render(); });
    app.querySelector('[data-reset-request]')?.addEventListener('click', () => { const identity=document.querySelector('#reset-identity')?.value?.trim(); if(!identity){ authMessage='Enter your email or phone number.'; render(); return; } authMode='reset-code'; authMessage=''; render(); });
    app.querySelector('[data-reset-code-submit]')?.addEventListener('click', () => { authMode='reset-new'; authMessage=''; render(); });
    app.querySelector('[data-reset-password-submit]')?.addEventListener('click', () => { const password=document.querySelector('#reset-password')?.value || ''; const confirm=document.querySelector('#reset-confirm')?.value || ''; if(password.length<8){ authMessage='Password must contain at least 8 characters.'; render(); return; } if(password!==confirm){ authMessage='Passwords do not match.'; render(); return; } authMode='reset-success'; authMessage=''; render(); });
    app.querySelectorAll('[data-resend-code]').forEach(b => b.addEventListener('click', () => { authMessage=''; b.textContent='Code sent'; setTimeout(()=>{ if(document.body.contains(b)) b.textContent='Resend code'; },1200); }));
    app.querySelector('[data-cancel-setup]')?.addEventListener('click', () => { authMode='welcome'; screen='auth'; render(); });
    app.querySelector('[data-onboarding-prev]')?.addEventListener('click', () => { if(onboardingStep===2)captureOnboardingVehicleForm(); if(onboardingStep===3)captureOnboardingPaymentForm(); onboardingStep=Math.max(1,onboardingStep-1); render(); });
    app.querySelector('[data-onboarding-next]')?.addEventListener('click', () => {
        if(onboardingStep===1)captureOnboardingRegionForm();
        if(onboardingStep===2)captureOnboardingVehicleForm();
        onboardingStep=Math.min(3,onboardingStep+1); render();
    });
    app.querySelector('[data-finish-onboarding]')?.addEventListener('click', () => {
        captureOnboardingPaymentForm();
        applyOnboardingAccount();
        onboardingComplete=true; screen='onboarding-success'; render();
    });
    app.querySelector('[data-enter-app]')?.addEventListener('click', () => {
        applyOnboardingAccount();
        activeTab='home'; screen='home'; render();
    });



    app.querySelector('[data-open-access-methods]')?.addEventListener('click',()=>{accessMessage='';screen='access-methods';render();});
    app.querySelector('[data-add-rfid]')?.addEventListener('click',()=>{editingRfidId=0;accessMessage='';screen='rfid-editor';render();});
    app.querySelectorAll('[data-edit-rfid]').forEach(b=>b.addEventListener('click',()=>{editingRfidId=Number(b.dataset.editRfid);accessMessage='';screen='rfid-editor';render();}));
    app.querySelector('[data-simulate-rfid]')?.addEventListener('click',()=>{const input=document.querySelector('#rfid-number');if(input) input.value='VD-91 •••• 8842';accessMessage='RFID identifier detected.';render();});
    app.querySelector('[data-save-rfid]')?.addEventListener('click',()=>{const name=document.querySelector('#rfid-name')?.value?.trim()||'Driver RFID';const number=document.querySelector('#rfid-number')?.value?.trim();const vehicleId=Number(document.querySelector('#rfid-vehicle')?.value||vehicles[0]?.id);const active=document.querySelector('#rfid-active')?.checked!==false;if(!number){accessMessage='Detect or enter an RFID number.';render();return;}if(editingRfidId){const c=rfidCards.find(x=>x.id===editingRfidId);if(c)Object.assign(c,{name,number,vehicleId,active});}else rfidCards.push({id:Date.now(),name,number,vehicleId,active});accessMessage='RFID card saved.';screen='access-methods';render();});
    app.querySelector('[data-delete-rfid]')?.addEventListener('click',e=>{rfidCards=rfidCards.filter(c=>c.id!==Number(e.target.dataset.deleteRfid));accessMessage='RFID card removed.';screen='access-methods';render();});
    app.querySelector('[data-configure-plug-charge]')?.addEventListener('click',()=>{accessMessage='';screen='plug-charge';render();});
    app.querySelector('#plug-vehicle')?.addEventListener('change',e=>{plugCharge.vehicleId=Number(e.target.value);plugCharge.supported=(vehicles.find(v=>v.id===plugCharge.vehicleId)?.connector==='CCS2');render();});
    app.querySelector('[data-toggle-plug-charge]')?.addEventListener('click',()=>{plugCharge.enabled=!plugCharge.enabled;plugCharge.certificate=plugCharge.enabled?'Active · VD-CERT-5050':'Not activated';accessMessage=plugCharge.enabled?'Plug & Charge certificate activated.':'Plug & Charge disabled.';render();});
    app.querySelectorAll('[data-open-security]').forEach(b => b.addEventListener('click', () => { securityMessage=''; screen='security'; render(); }));
    app.querySelector('[data-change-password]')?.addEventListener('click', () => { securityMessage=''; screen='change-password'; render(); });
    app.querySelector('[data-toggle-2fa]')?.addEventListener('change', e => { twoFactorEnabled=e.target.checked; securityMessage=twoFactorEnabled?'Two-factor authentication enabled.':'Two-factor authentication disabled.'; render(); });
    app.querySelector('[data-toggle-biometric]')?.addEventListener('change', e => { biometricEnabled=e.target.checked; securityMessage=biometricEnabled?'Biometric unlock enabled.':'Biometric unlock disabled.'; render(); });
    app.querySelector('[data-signout-others]')?.addEventListener('click', () => { connectedSessions=connectedSessions.filter(s=>s.current); securityMessage='Other devices were signed out.'; render(); });
    app.querySelector('[data-save-password]')?.addEventListener('click', () => { const next=document.querySelector('#security-new')?.value||''; const confirm=document.querySelector('#security-confirm')?.value||''; if(next.length<8){ securityMessage='Password must contain at least 8 characters.'; render(); return; } if(next!==confirm){ securityMessage='Passwords do not match.'; render(); return; } securityMessage='Password updated successfully.'; screen='security'; render(); });
    app.querySelector('[data-sign-out]')?.addEventListener('click', () => { authMode='login'; authMessage=''; activeTab='home'; screen='auth'; render(); });
    app.querySelectorAll('[data-manage-vehicle]').forEach(b => b.addEventListener('click', () => { screen='garage'; render(); }));
    app.querySelectorAll('[data-add-vehicle]').forEach(b => b.addEventListener('click', () => { vehicleEditorReturn={screen,tab:activeTab}; vehicleEditorMessage=''; editingVehicleId=null; screen='add-vehicle'; render(); }));
    app.querySelectorAll('[data-edit-vehicle]').forEach(b => b.addEventListener('click', () => { vehicleEditorReturn={screen,tab:activeTab}; vehicleEditorMessage=''; editingVehicleId=Number(b.dataset.editVehicle); screen='add-vehicle'; render(); }));
    app.querySelector('[data-add-funds]')?.addEventListener('click', () => { walletReturn={screen,tab:activeTab}; screen='wallet'; render(); });
    app.querySelector('[data-manage-payments]')?.addEventListener('click', () => { walletReturn={screen,tab:activeTab}; screen='wallet'; render(); });
app.querySelector('[data-edit-profile]')?.addEventListener('click', () => { accountMessage=''; screen='edit-profile'; render(); });
    app.querySelector('[data-change-photo]')?.addEventListener('click',()=>{accountMessage='Profile photo picker opened in prototype mode.';render();});
    app.querySelector('[data-save-profile]')?.addEventListener('click', () => { profile.name=document.querySelector('#profile-name')?.value?.trim()||profile.name; profile.email=document.querySelector('#profile-email')?.value?.trim()||profile.email; profile.phone=document.querySelector('#profile-phone')?.value?.trim()||profile.phone; profile.address=document.querySelector('#profile-address')?.value?.trim()||profile.address; accountMessage='Profile saved.'; render(); });
    app.querySelector('[data-open-language-region]')?.addEventListener('click', () => { accountMessage=''; screen='language-region'; render(); });
    app.querySelector('[data-save-language-region]')?.addEventListener('click', () => { accountPreferences.language=document.querySelector('#pref-language')?.value||accountPreferences.language; accountPreferences.country=document.querySelector('#pref-country')?.value||accountPreferences.country; accountPreferences.currency=document.querySelector('#pref-currency')?.value||accountPreferences.currency; savePreferences(); accountMessage='Language and region saved.'; render(); });
    app.querySelector('[data-open-preferences]')?.addEventListener('click', () => { accountMessage=''; screen='preferences'; render(); });
    app.querySelector('[data-save-preferences]')?.addEventListener('click', () => { accountPreferences.distance=document.querySelector('#pref-distance')?.value||accountPreferences.distance; accountPreferences.energy=document.querySelector('#pref-energy')?.value||accountPreferences.energy; accountMessage='Appearance and units saved.'; savePreferences(); render(); });
    app.querySelector('[data-open-privacy]')?.addEventListener('click', () => { accountMessage=''; screen='privacy'; render(); });
    app.querySelector('[data-open-billing]')?.addEventListener('click',()=>{accountMessage='';screen='billing';render();});
    app.querySelector('[data-compare-plans]')?.addEventListener('click',()=>{screen='membership-compare';render();});
    app.querySelectorAll('[data-open-plan]').forEach(b=>b.addEventListener('click',()=>{selectedPlan=b.dataset.openPlan||'VoltDrive Plus';screen='membership-plan';render();}));
    app.querySelector('[data-browse-packages]')?.addEventListener('click',()=>{screen='packages';render();});
    app.querySelectorAll('[data-select-package]').forEach(b=>b.addEventListener('click',()=>{selectedPackageId=Number(b.dataset.selectPackage);render();}));
    app.querySelector('[data-checkout-package]')?.addEventListener('click',()=>{membershipCheckoutMode='package';screen='membership-checkout';render();});
    app.querySelectorAll('[data-checkout-plan]').forEach(b=>b.addEventListener('click',()=>{selectedPlan=b.dataset.checkoutPlan||selectedPlan;membershipCheckoutMode='plan';screen='membership-checkout';render();}));
    app.querySelector('[data-apply-promo]')?.addEventListener('click',()=>{billingProfile.promoCode=document.querySelector('#billing-promo')?.value?.trim()||'';membershipMessage=billingProfile.promoCode?'Promo code applied: 500 AMD discount.':'Enter a promo code first.';render();});
    app.querySelector('[data-confirm-membership-purchase]')?.addEventListener('click',()=>{if(!document.querySelector('#membership-terms')?.checked){membershipMessage='Accept the purchase conditions to continue.';render();return;}if(membershipCheckoutMode==='plan'){billingProfile.plan=selectedPlan;billingProfile.autoRenew=true;}else{const pkg=chargingPackages.find(p=>p.id===selectedPackageId);chargingCredits.kwh+=(pkg?.kwh||0);chargingCredits.expires='31 Oct 2026';}screen='membership-success';render();});
    app.querySelector('[data-membership-done]')?.addEventListener('click',()=>{membershipMessage=membershipCheckoutMode==='plan'?'Membership activated successfully.':'Charging package added successfully.';screen='billing';render();});
    app.querySelector('[data-cancel-membership]')?.addEventListener('click',()=>{billingProfile.plan='VoltDrive Free';billingProfile.autoRenew=false;membershipMessage='Membership cancelled. Benefits remain until the end of the current period.';screen='billing';render();});
    app.querySelector('[data-open-legal]')?.addEventListener('click',()=>{screen='legal';render();});
    app.querySelectorAll('[data-legal-doc]').forEach(b=>b.addEventListener('click',()=>{window.__legalTitle=b.dataset.legalDoc;screen='legal-document';render();}));
    app.querySelectorAll('[data-plan]').forEach(b=>b.addEventListener('click',()=>{billingProfile.plan=b.dataset.plan;render();}));
    app.querySelector('[data-billing-renew]')?.addEventListener('change',e=>{billingProfile.autoRenew=e.target.checked;});
    app.querySelectorAll('[data-open-invoice]').forEach(b=>b.addEventListener('click',()=>{membershipMessage=`Invoice ${b.dataset.openInvoice} opened in prototype mode.`;render();}));
    app.querySelector('[data-save-billing]')?.addEventListener('click',()=>{billingProfile.company=document.querySelector('#billing-company')?.value||'';billingProfile.taxId=document.querySelector('#billing-tax')?.value||'';billingProfile.billingEmail=document.querySelector('#billing-email')?.value||billingProfile.billingEmail;membershipMessage='Billing details saved.';render();});
    app.querySelectorAll('[data-privacy-toggle]').forEach(x=>x.addEventListener('change',e=>{accountPreferences[e.target.dataset.privacyToggle]=e.target.checked;accountMessage='Privacy preference updated.';render();}));
    app.querySelectorAll('[data-manage-permission]').forEach(b=>b.addEventListener('click',()=>{permissionRequest={type:b.dataset.managePermission,returnScreen:'privacy',returnTab:'account'};permissionMessage='';screen='permission-request';render();}));
    app.querySelector('[data-permission-allow]')?.addEventListener('click',()=>{const type=app.querySelector('[data-permission-allow]')?.dataset.permissionAllow||permissionRequest.type;permissionState[type]='granted';savePermissionState();if(type==='notifications')notificationPreferences.push=true;const returnScreen=permissionRequest.returnScreen;restoreAfterPermission();if(type==='location'&&returnScreen==='map')useCurrentLocation();if(type==='camera'&&returnScreen==='charge-start'){if(appState!=='charging')prepareNewChargingSession();scannerFlashlight=false;screen='charge-scan';}permissionMessage='';render();});
    app.querySelector('[data-permission-deny]')?.addEventListener('click',()=>{const type=app.querySelector('[data-permission-deny]')?.dataset.permissionDeny||permissionRequest.type;permissionState[type]='denied';savePermissionState();if(type==='notifications')notificationPreferences.push=false;permissionMessage='';restoreAfterPermission();render();});
    app.querySelector('[data-download-data]')?.addEventListener('click',()=>{accountMessage='Data export requested. A download link will be sent by email.';render();});
    app.querySelector('[data-open-delete-account]')?.addEventListener('click',()=>{accountMessage='';screen='delete-account';render();});
    app.querySelector('[data-confirm-delete-account]')?.addEventListener('click',()=>{const text=document.querySelector('#delete-confirm')?.value||'';const ok=document.querySelector('#delete-understood')?.checked;if(text!=='DELETE'||!ok){accountMessage='Type DELETE and confirm that you understand the action.';render();return;}authMode='welcome';screen='auth';accountMessage='';render();});
    app.querySelectorAll('[data-set-active-vehicle]').forEach(b => b.addEventListener('click', () => { const id=Number(b.dataset.setActiveVehicle); vehicles.forEach(v=>v.active=v.id===id); if(appState==='completed')appState=activeReservation?'reserved':'idle'; render(); }));
    app.querySelectorAll('[data-vehicle-history]').forEach(b=>b.addEventListener('click',()=>{activitySection='sessions';activityVehicleFilter=b.dataset.vehicleHistory;activityStationFilter='all';activityStatusFilter='all';activityQuery='';activeTab='activity';screen='activity';render();}));
    app.querySelector('[data-vehicle-limit]')?.addEventListener('input', e => { const out=document.querySelector('#vehicle-limit-value'); if(out) out.textContent=e.target.value+'%'; });
    app.querySelector('[data-save-vehicle]')?.addEventListener('click', () => {
        const brand=document.querySelector('#vehicle-brand')?.value || 'EV';
        const model=document.querySelector('#vehicle-model')?.value || 'Vehicle';
        const plate=document.querySelector('#vehicle-plate')?.value || 'NEW EV';
        const vin=document.querySelector('#vehicle-vin')?.value?.trim() || '';
        const connector=document.querySelector('#vehicle-connector')?.value || 'CCS2';
        const capacity=Math.min(250,Math.max(10,Number(document.querySelector('#vehicle-capacity')?.value || 75)));
        const battery=Math.min(100,Math.max(0,Number(document.querySelector('#vehicle-battery')?.value ?? 52)));
        const ownership=document.querySelector('#vehicle-ownership')?.value || 'Personal';
        const homeCharging=document.querySelector('#vehicle-home-charging')?.value || 'Not configured';
        const plugAndCharge=Boolean(document.querySelector('#plug-charge')?.checked);
        const limit=Number(document.querySelector('#vehicle-limit')?.value || 85);
        if(editingVehicleId){
            const v=vehicles.find(x=>x.id===editingVehicleId);
            if(v){v.name=brand+' '+model;v.plate=plate;v.vin=vin;v.connector=connector;v.battery=battery;v.batteryCapacity=capacity;v.ownership=ownership;v.homeCharging=homeCharging;v.plugAndCharge=plugAndCharge;v.oemStatus=v.oemStatus||'Not connected';v.limit=limit;}
        } else {
            const firstVehicle=vehicles.length===0;
            vehicles.push({id:Date.now(),name:brand+' '+model,plate,vin,connector,battery,batteryCapacity:capacity,limit,ownership,oemStatus:'Not connected',homeCharging,plugAndCharge,active:firstVehicle});
        }
        vehicleEditorMessage='';
        editingVehicleId=null;
        restoreReturnContext(vehicleEditorReturn);
        render();
    });
    app.querySelector('[data-delete-vehicle]')?.addEventListener('click', e => {
        const id=Number(e.currentTarget.dataset.deleteVehicle);
        const blocked=vehicleDeletionBlockReason(id);
        if(blocked){vehicleEditorMessage=blocked;render();return;}
        const target=vehicles.find(v=>v.id===id);
        vehicles=vehicles.filter(v=>v.id!==id);
        if(target?.active && vehicles[0]) vehicles[0].active=true;
        vehicleEditorMessage='';
        editingVehicleId=null;
        restoreReturnContext(vehicleEditorReturn);
        render();
    });
    app.querySelectorAll('[data-topup]').forEach(b => b.addEventListener('click', () => { walletTopUp=Number(b.dataset.topup); render(); }));
    app.querySelector('[data-confirm-topup]')?.addEventListener('click',()=>{walletBalance+=walletTopUp;accountMessage=`${walletTopUp.toLocaleString()} AMD added to Wallet.`;addSystemNotification('Wallet topped up',`${walletTopUp.toLocaleString()} AMD added. New balance ${walletBalance.toLocaleString()} AMD.`,'payment','wallet','View Wallet');restoreReturnContext(walletReturn);render();});
app.querySelector('[data-auto-topup-toggle]')?.addEventListener('change', e=>{autoTopUp.enabled=e.target.checked;render();});
    app.querySelector('[data-save-auto-topup]')?.addEventListener('click',()=>{autoTopUp.threshold=Number(document.querySelector('#auto-threshold')?.value||autoTopUp.threshold);autoTopUp.amount=Number(document.querySelector('#auto-amount')?.value||autoTopUp.amount);const topUp=autoTopUp.enabled&&walletBalance<autoTopUp.threshold?performWalletAutoTopUp('Auto top-up rule saved while balance was below threshold'):null;accountMessage=topUp?.ok?`Automatic top-up saved · ${topUp.amount.toLocaleString()} AMD added.`:'Automatic top-up saved.';render();});
    app.querySelectorAll('[data-select-payment]').forEach(b=>b.addEventListener('click',()=>{selectedPaymentId=Number(b.dataset.selectPayment);render();}));
    app.querySelector('[data-set-default-payment]')?.addEventListener('click',e=>{const id=Number(e.currentTarget.dataset.setDefaultPayment);const method=paymentMethods.find(p=>p.id===id);if(!method)return;paymentMethods.forEach(p=>p.active=p.id===id);selectedPaymentId=id;startCharge.payment=paymentMethodLabel(method);accountMessage='Default payment card updated.';render();});
    app.querySelector('[data-add-payment]')?.addEventListener('click',()=>{const id=Date.now();paymentMethods.push({id,brand:'MC',last4:String(id).slice(-4),expiry:'12/30',active:false});selectedPaymentId=id;accountMessage='Demo card added.';render();});
    app.querySelector('[data-remove-payment]')?.addEventListener('click',e=>{const id=Number(e.target.dataset.removePayment);const target=paymentMethods.find(p=>p.id===id);if(target?.active){accountMessage='Choose another default card before removing this one.';render();return;}paymentMethods=paymentMethods.filter(p=>p.id!==id);selectedPaymentId=paymentMethods[0]?.id||0;accountMessage='Payment card removed.';render();});
    app.querySelectorAll('[data-notifications]').forEach(b => b.addEventListener('click', () => { if(screen!=='notifications'&&screen!=='notification-detail'&&screen!=='notification-settings') notificationReturn={screen,tab:activeTab}; screen = 'notifications'; render(); }));
    app.querySelector('[data-open-notification-settings]')?.addEventListener('click', () => { notificationSettingsMessage=''; screen='notification-settings'; render(); });
    app.querySelectorAll('[data-notification-toggle]').forEach(input => input.addEventListener('change', e => { const key=e.target.dataset.notificationToggle; if(key==='push' && e.target.checked && permissionState.notifications!=='granted'){ notificationPreferences.push=false; if(!askForPermission('notifications','notification-settings','account')){render();return;} } notificationPreferences[key]=e.target.checked; notificationSettingsMessage=''; render(); }));
    app.querySelector('[data-save-notification-settings]')?.addEventListener('click', () => { const start=document.querySelector('#quiet-start')?.value; const end=document.querySelector('#quiet-end')?.value; if(start) notificationPreferences.quietStart=start; if(end) notificationPreferences.quietEnd=end; notificationSettingsMessage='Notification preferences saved.'; render(); });
    app.querySelectorAll('[data-open-support]').forEach(b => b.addEventListener('click', () => { if(screen!=='support'&&screen!=='support-tickets'&&screen!=='support-ticket-detail'&&screen!=='faq-detail') supportReturn={screen,tab:activeTab}; screen = 'support'; render(); }));
    app.querySelectorAll('[data-report-problem]').forEach(b => b.addEventListener('click', () => { reportSubmitted=false; supportTopic='Charger problem'; reportReturn={screen,tab:activeTab}; screen='report-problem'; render(); }));
    app.querySelectorAll('[data-simple-back]').forEach(b => b.addEventListener('click', () => {
        const back=b.dataset.simpleBack;
        if(back==='notification-return'){ restoreReturnContext(notificationReturn); render(); return; }
        if(back==='support-return'){ restoreReturnContext(supportReturn); render(); return; }
        if(back==='support-ticket-return'){ restoreReturnContext(supportTicketReturn); render(); return; }
        if(back==='report-return'){ restoreReturnContext(reportReturn); render(); return; }
        if(back==='location-return'){ restoreReturnContext(locationReturn); render(); return; }
        if(back==='reservation-manage-return'){ restoreReturnContext(reservationManageReturn); render(); return; }
        if(back==='wallet-return'){ restoreReturnContext(walletReturn); render(); return; }
        if(back==='vehicle-editor-return'){ restoreReturnContext(vehicleEditorReturn); render(); return; }
        if(back==='session-return'){ restoreReturnContext(sessionDetailReturn); render(); return; }
        if(back==='payment-return'){ restoreReturnContext(paymentDetailReturn); render(); return; }
        if(back==='receipt-return'){ restoreReturnContext(receiptReturn); render(); return; }
        if(back==='payment-dispute-return'){ restoreReturnContext(paymentDisputeReturn); render(); return; }
        if(back==='permission-return'){ restoreAfterPermission(); render(); return; }
        const chargeScreens=['charge-start','charge-scan','charger-check','connector-select','tariff-review','charge-limit','payment-authorize','charge-connecting','charge-start-error','charging','charging-summary','parking-monitor','parking-extend','parking-complete'];
        const activityScreens=['activity','session-detail','activity-reservation-detail','payment-detail','receipt','refund-request','payment-dispute'];
        const accountScreens=['account','garage','add-vehicle','wallet','prototype-tools','final-qa','security','change-password','notification-settings','edit-profile','language-region','preferences','privacy','delete-account','billing','membership-compare','membership-plan','packages','membership-checkout','membership-success','legal','legal-document','access-methods','rfid-editor','plug-charge','permission-request'];
        screen=back || 'account';
        if(screen==='home') activeTab='home';
        else if(screen==='map'||screen==='location'||screen==='map-filters') activeTab='map';
        else if(chargeScreens.includes(screen)) activeTab='charge';
        else if(activityScreens.includes(screen)) activeTab='activity';
        else if(accountScreens.includes(screen)) activeTab='account';
        render();
    }));
    app.querySelectorAll('[data-notification-filter]').forEach(b => b.addEventListener('click', () => { notificationFilter=b.dataset.notificationFilter || 'all'; render(); }));
    app.querySelector('[data-mark-read]')?.addEventListener('click', () => { notifications.forEach(n=>n.unread=false); render(); });
    app.querySelectorAll('[data-notification-id]').forEach(b => b.addEventListener('click', () => { const n=notifications.find(x=>x.id===Number(b.dataset.notificationId)); if(n){n.unread=false;selectedNotificationId=n.id;screen='notification-detail';render();} }));
    app.querySelectorAll('[data-notification-delete]').forEach(b => b.addEventListener('click', () => { const id=Number(b.dataset.notificationDelete);notifications=notifications.filter(n=>n.id!==id);screen='notifications';render(); }));
    app.querySelectorAll('[data-notification-open]').forEach(b => b.addEventListener('click', () => {
        const n=notifications.find(x=>x.id===Number(b.dataset.notificationOpen));
        if(!n)return;
        n.unread=false;
        const origin={screen,tab:activeTab};
        if(n.target==='session-detail'){
            sessionDetailReturn=origin;selectedActivityId=n.targetId||latestCompletedSessionId;activeTab='activity';screen='session-detail';
        }else if(n.target==='payment-detail'){
            paymentDetailReturn=origin;selectedActivityId=n.targetId||latestPaymentId;activeTab='activity';screen='payment-detail';
        }else if(n.target==='reservation-manage'){
            const targetId=String(n.targetId||'');
            const live=activeReservation && (!targetId || String(activeReservation.id)===targetId) && (!activeReservation.status || activeReservation.status==='Confirmed');
            if(live){
                reservationManageReturn=origin;
                restoreReservationStation();
                appState='reserved';
                screen='reservation-manage';
            }else{
                const record=activityReservations.find(r=>String(r.id)===targetId);
                activeTab='activity';
                activitySection='reservations';
                if(record){
                    selectedActivityId=record.id;
                    screen='activity-reservation-detail';
                }else{
                    screen='activity';
                }
            }
        }else if(n.target==='activity'){
            activeTab='activity';activitySection='reservations';screen='activity';
        }else if(n.target==='charging-summary'){
            activeTab='charge';screen='charging-summary';
        }else if(n.target==='location'){
            locationReturn=origin;selectedStation=stations.find(s=>s.id===Number(n.targetId))||stations[1]||selectedStation;activeTab='map';screen='location';
        }else if(n.target==='wallet'){
            walletReturn=origin;activeTab='account';screen='wallet';
        }else if(n.target==='account'){
            activeTab='account';screen='account';
        }
        render();
    }));
    app.querySelectorAll('[data-support-topic]').forEach(b => b.addEventListener('click', () => { supportTopic=b.dataset.supportTopic || supportTopic; render(); }));
    app.querySelector('[data-support-search]')?.addEventListener('input', e => { supportQuery=e.target.value; });
    app.querySelector('[data-support-search]')?.addEventListener('keydown', e => { if(e.key==='Enter'){supportQuery=e.target.value;render();} });
    app.querySelector('[data-open-ticket-list]')?.addEventListener('click',()=>{screen='support-tickets';render();});
    app.querySelectorAll('[data-open-support-ticket]').forEach(b=>b.addEventListener('click',()=>{supportTicketReturn={screen,tab:activeTab};selectedSupportTicketId=b.dataset.openSupportTicket;supportMessage='';screen='support-ticket-detail';render();}));
    app.querySelectorAll('[data-open-faq]').forEach(b=>b.addEventListener('click',()=>{window.__faqId=b.dataset.openFaq;screen='faq-detail';render();}));
    app.querySelector('[data-send-support-reply]')?.addEventListener('click',()=>{const text=document.querySelector('#support-reply')?.value.trim();if(!text)return;const t=supportTickets.find(x=>x.id===selectedSupportTicketId);t?.messages.push({from:'You',time:'Now',text});if(t){t.updated='Now';t.status='In progress';}supportMessage='Message sent to support.';render();});
    app.querySelector('[data-close-support-ticket]')?.addEventListener('click',()=>{const t=supportTickets.find(x=>x.id===selectedSupportTicketId);if(t){t.status='Resolved';t.updated='Now';}supportMessage='Support request closed.';render();});
    app.querySelectorAll('[data-support-rating]').forEach(b=>b.addEventListener('click',()=>{supportRating=Number(b.dataset.supportRating);supportMessage='Thank you for rating support.';render();}));
    app.querySelector('[data-emergency-support]')?.addEventListener('click',()=>{supportMessage='Emergency call action simulated. In production this opens the phone dialer.';render();});
    app.querySelectorAll('[data-live-chat]').forEach(b=>b.addEventListener('click', () => { supportTicketReturn={screen,tab:activeTab}; const context=supportContext(supportTopic); const t=createSupportTicket(supportTopic,`Live chat started about ${context.reference}.`,false); supportMessage='Live chat opened. A support specialist is joining the conversation.'; selectedSupportTicketId=t.id; screen='support-ticket-detail'; render(); }));
    app.querySelector('[data-submit-report]')?.addEventListener('click', () => { const issue=document.querySelector('input[name="issue"]:checked')?.value || 'Charging stopped'; const details=document.querySelector('#report-details')?.value?.trim() || issue; supportTicketReturn={screen:'support',tab:activeTab}; const ticket=createSupportTicket('Charger problem',`${issue}: ${details}`,true); lastCreatedSupportTicketId=ticket.id; reportSubmitted=true; render(); });
    app.querySelector('[data-return-charge]')?.addEventListener('click', () => { activeTab='charge'; screen='charging'; render(); });
    app.querySelector('[data-return-report]')?.addEventListener('click', () => { restoreReturnContext(reportReturn); render(); });
    app.querySelectorAll('[data-state]').forEach(b => b.addEventListener('click', () => { appState = b.dataset.state; if(appState==='charging'&&!activeChargingSession) captureActiveChargingSession(); if(appState==='charging') recalculateChargingRemaining(); if(appState!=='charging'){activeChargingSession=null;pendingChargingVehicleId=null;pendingChargingReservationId=null;} render(); }));
    app.querySelectorAll('[data-activity-tab]').forEach(b => b.addEventListener('click', () => { activitySection = b.dataset.activityTab || 'sessions'; activityQuery=''; render(); }));
    app.querySelector('[data-activity-search]')?.addEventListener('input', e => { activityQuery = e.target.value; render(); });
    app.querySelector('[data-activity-range]')?.addEventListener('change', e => { activityRange = e.target.value; render(); });
    app.querySelector('[data-activity-vehicle]')?.addEventListener('change',e=>{activityVehicleFilter=e.target.value;render();});
    app.querySelector('[data-activity-station]')?.addEventListener('change',e=>{activityStationFilter=e.target.value;render();});
    app.querySelector('[data-activity-status]')?.addEventListener('change',e=>{activityStatusFilter=e.target.value;render();});
    app.querySelectorAll('[data-open-session]').forEach(b=>b.addEventListener('click',()=>{sessionDetailReturn={screen,tab:activeTab};selectedActivityId=b.dataset.openSession;activityMessage='';screen='session-detail';render();}));
    app.querySelectorAll('[data-open-activity-reservation]').forEach(b=>b.addEventListener('click',()=>{selectedActivityId=b.dataset.openActivityReservation;screen='activity-reservation-detail';render();}));
    app.querySelectorAll('[data-open-payment]').forEach(b=>b.addEventListener('click',()=>{paymentDetailReturn={screen,tab:activeTab};selectedActivityId=b.dataset.openPayment;activityMessage='';screen='payment-detail';render();}));
    app.querySelectorAll('[data-view-receipt]').forEach(b=>b.addEventListener('click',()=>{receiptReturn={screen,tab:activeTab};selectedActivityId=b.dataset.viewReceipt;screen='receipt';render();}));
    app.querySelectorAll('[data-email-receipt]').forEach(b=>b.addEventListener('click',()=>{activityMessage='Receipt sent to '+profile.email;render();}));
    app.querySelectorAll('[data-export-session-csv]').forEach(b=>b.addEventListener('click',()=>{const session=sessions.find(item=>item.id===b.dataset.exportSessionCsv);activityMessage=exportSessionCsv(session)?'CSV session export prepared.':'CSV export is unavailable in this environment.';render();}));
    app.querySelector('[data-download-invoice]')?.addEventListener('click',()=>{const session=sessions.find(x=>x.id===selectedActivityId)||sessions[0];activityMessage=printReceipt(session)?'Print dialog opened. Choose Save as PDF to export the receipt.':'Popup blocked. Allow popups to print or save the receipt as PDF.';render();});
    app.querySelectorAll('[data-request-refund]').forEach(b=>b.addEventListener('click',()=>{selectedActivityId=b.dataset.requestRefund;activityMessage='';screen='refund-request';render();}));
    app.querySelectorAll('[data-dispute-payment]').forEach(b=>b.addEventListener('click',()=>{paymentDisputeReturn={screen,tab:activeTab};selectedActivityId=b.dataset.disputePayment;activityMessage='';screen='payment-dispute';render();}));
    app.querySelector('#refund-reason')?.addEventListener('change',e=>{refundReason=e.target.value;});
    app.querySelector('[data-submit-refund]')?.addEventListener('click',()=>{activityMessage='Refund request RF-10903 submitted. We will notify you after review.';screen='session-detail';render();});
    app.querySelector('#dispute-reason')?.addEventListener('change',e=>{disputeReason=e.target.value;});
    app.querySelector('[data-submit-dispute]')?.addEventListener('click',()=>{activityMessage='Billing report BR-2041 submitted to support.';restoreReturnContext(paymentDisputeReturn);render();});

    app.querySelector('[data-open-parking]')?.addEventListener('click',()=>{const latestSession=sessions.find(x=>x.id===latestCompletedSessionId);parkingSession={active:true,stage:'grace',graceMinutes:10,graceSecondsRemaining:600,idleMinutes:0,idleSecondsElapsed:0,idleCost:0,extensionMinutes:30,extensionSecondsRemaining:0,extensionCost:0,bay:latestSession?.bay||reservation.bay||'B-12',message:'',paymentMessage:'',paymentStatus:'',paymentId:''};screen='parking-monitor';render();});
    app.querySelector('[data-simulate-idle]')?.addEventListener('click',()=>{parkingSession.stage='idle';parkingSession.graceSecondsRemaining=0;parkingSession.idleMinutes=Math.max(6,parkingSession.idleMinutes||0);parkingSession.idleSecondsElapsed=parkingSession.idleMinutes*60;parkingSession.idleCost=parkingSession.idleMinutes*50;parkingSession.message='Grace period ended. Idle fee is now active.';screen='parking-monitor';render();});
    app.querySelector('[data-extend-parking]')?.addEventListener('click',()=>{screen='parking-extend';render();});
    app.querySelectorAll('[data-parking-extension]').forEach(b=>b.addEventListener('click',()=>{parkingSession.extensionMinutes=Number(b.dataset.parkingExtension);parkingSession.paymentMessage='';render();}));
    app.querySelector('[data-confirm-parking-extension]')?.addEventListener('click',()=>{const result=chargeParkingExtension();if(!result.ok){parkingSession.paymentMessage=result.message;render();return;}parkingSession.stage='extended';parkingSession.extensionSecondsRemaining=parkingSession.extensionMinutes*60;parkingSession.paymentMessage='';parkingSession.message=`Parking extended by ${parkingSession.extensionMinutes} minutes · ${result.amount.toLocaleString()} AMD paid with ${result.method}.`;screen='parking-monitor';render();});
    app.querySelector('[data-parking-complete]')?.addEventListener('click',()=>{stopParkingCountdown();finalizeParkingSession();screen='parking-complete';render();});
    app.querySelector('[data-parking-home]')?.addEventListener('click',()=>{parkingSession.active=false;stopParkingCountdown();appState=activeReservation?'reserved':'idle';activeTab='home';screen='home';render();});
    app.querySelector('[data-open-activity]')?.addEventListener('click',()=>{activeTab='activity';activitySection='sessions';screen='activity';render();});
    app.querySelector('[data-primary]')?.addEventListener('click', e => {
        const action = e.currentTarget.dataset.primary;
        if (action === 'map') {
            activeTab = 'map';
            screen = 'map';
        }
        else if (action === 'navigate') { restoreReservationStation(); navigationState={source:'reservation',started:false,progress:0,arrived:false,arrivalConfirmed:false,assignment:null}; screen='navigation-preview'; }
        else if (action === 'start-reserved-charge') { if(!requireActiveVehicleForFlow('charge-start','charge')) { render(); return; } restoreReservationStation(); if(!activeReservation || !stationPresenceConfirmed(selectedStation)){reservationManageReturn={screen,tab:activeTab};reservationMessage='Confirm arrival at the reserved station before starting charging.';screen='reservation-manage';} else if(reservationVehicleMismatch(activeReservation)){reservationManageReturn={screen,tab:activeTab};reservationMessage='';screen='reservation-manage';} else {const assignment=navigationAssignment();const connectorId=activeReservation?.type==='Specific charger' ? activeReservation.charger : assignment.connectorId;if(!connectorId){reservationManageReturn={screen,tab:activeTab};reservationMessage='A charger has not been assigned yet. Confirm arrival first.';screen='reservation-manage';}else{prepareNewChargingSession(reservationVehicleRecord(activeReservation) || activeVehicleRecord(), activeReservation); startCharge.connector=connectorId; startCharge.code=chargerCodeForConnector(selectedStationConnector(),selectedStation); startCharge.stage='checking'; activeTab='charge'; screen='charger-check';}} }
        else if (action === 'active-charge') { activeTab = 'charge'; screen = 'charging'; }
        else if (action === 'summary') { activeTab = 'charge'; screen = 'charging-summary'; }
        else appState = action;
        render();
    });
    app.querySelector('[data-map-search]')?.addEventListener('input', e => { mapQuery=e.target.value; });
    app.querySelector('[data-map-search]')?.addEventListener('keydown', e => { if(e.key==='Enter'){ mapQuery=e.target.value; rememberMapSearch(mapQuery); render(); } });
    app.querySelectorAll('[data-recent-map-search]').forEach(b=>b.addEventListener('click',()=>{mapQuery=b.dataset.recentMapSearch||'';rememberMapSearch(mapQuery);render();}));
    app.querySelector('[data-clear-recent-searches]')?.addEventListener('click',()=>{recentMapSearches=[];render();});
    app.querySelector('[data-use-current-location]')?.addEventListener('click',()=>{if(!askForPermission('location','map','map')){render();return;}useCurrentLocation();render();});
    app.querySelector('[data-open-map-filters]')?.addEventListener('click', () => { screen='map-filters'; render(); });
    app.querySelectorAll('[data-map-view]').forEach(b=>b.addEventListener('click',()=>{mapView=b.dataset.mapView;render();}));
    app.querySelector('[data-open-favorites]')?.addEventListener('click',()=>{showFavoritesOnly=!showFavoritesOnly;mapView='list';render();});
    app.querySelector('[data-map-sort]')?.addEventListener('change',e=>{mapSort=e.target.value;render();});
    app.querySelectorAll('[data-quick-filter]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.quickFilter;mapFilters[key]=!mapFilters[key];render();}));
    app.querySelectorAll('[data-map-filter-toggle]').forEach(x=>x.addEventListener('change',e=>{mapFilters[e.target.dataset.mapFilterToggle]=e.target.checked;render();}));
    app.querySelectorAll('[data-map-filter-select]').forEach(x=>x.addEventListener('change',e=>{const key=e.target.dataset.mapFilterSelect;mapFilters[key]=key==='minPower'?Number(e.target.value):e.target.value;render();}));
    app.querySelector('[data-map-price]')?.addEventListener('input',e=>{mapFilters.maxPrice=Number(e.target.value);const out=document.querySelector('#map-price-value');if(out)out.textContent=formatDisplayMoney(mapFilters.maxPrice)+'/kWh';});
    app.querySelector('[data-apply-map-filters]')?.addEventListener('click',()=>{screen='map';render();});
    app.querySelectorAll('[data-clear-map-filters]').forEach(b=>b.addEventListener('click',()=>{mapQuery='';mapFilters=createDefaultMapFilters();screen='map';render();}));
    app.querySelectorAll('[data-favorite-station]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const id=Number(b.dataset.favoriteStation);favoriteStations.has(id)?favoriteStations.delete(id):favoriteStations.add(id);render();}));
    app.querySelectorAll('[data-open-location]').forEach(b=>b.addEventListener('click',()=>{locationReturn={screen,tab:activeTab};selectedStation=stations.find(s=>s.id===Number(b.dataset.openLocation))||stations[0];screen='location';render();}));
    app.querySelectorAll('[data-start-navigation]').forEach(b=>b.addEventListener('click',()=>{const fromReservation=screen==='reservation-success'||screen==='reservation-manage';if(fromReservation) restoreReservationStation();navigationState={source:fromReservation?'reservation':'location',started:false,progress:0,arrived:false,arrivalConfirmed:false,assignment:null};navigationMessage='';screen='navigation-preview';render();}));
    app.querySelector('[data-join-waiting-list]')?.addEventListener('click',()=>{if(!requireActiveVehicleForFlow('waiting-list',activeTab)) { render(); return; }resetReservationVehicleToActive();waitingListJoined=true;screen='waiting-list';render();});
    app.querySelector('[data-start-route]')?.addEventListener('click',()=>{navigationState.started=true;navigationState.progress=38;screen='navigation-active';render();});
    app.querySelector('[data-open-location-from-navigation]')?.addEventListener('click',()=>{locationReturn={screen,tab:activeTab};activeTab='map';screen='location';render();});
    app.querySelector('[data-simulate-arrival]')?.addEventListener('click',()=>{navigationState.progress=100;navigationState.arrived=true;navigationState.assignment=buildNavigationAssignment();screen='arrival';render();});
    app.querySelector('[data-stop-navigation]')?.addEventListener('click',()=>{navigationState.started=false;screen=navigationState.source==='reservation'?'reservation-manage':'location';render();});
    app.querySelector('[data-arrival-confirm]')?.addEventListener('click',()=>{if(navigationState.source==='reservation' && activeReservation && reservationVehicleMismatch(activeReservation)){const reservedVehicle=reservationVehicleRecord(activeReservation);navigationMessage='';render();return;}navigationState.arrivalConfirmed=true;const assignment=navigationAssignment();reservationMessage='Arrival confirmed · '+(assignment.connectorId?`Charger ${assignment.connectorId} is ready for you.`:'No compatible charger is currently available.');navigationMessage=reservationMessage;render();});
    app.querySelector('[data-arrival-start-charge]')?.addEventListener('click',()=>{if(!requireActiveVehicleForFlow('arrival',activeTab)) { render(); return; }const assignment=navigationAssignment();const station=stations.find(item=>item.id===assignment.stationId);if(station)selectedStation=station;if(!assignment.connectorId){supportReturn={screen,tab:activeTab};supportTopic='Reservation help';screen='support';render();return;}if(navigationState.source==='reservation' && activeReservation && reservationVehicleMismatch(activeReservation)){const reservedVehicle=reservationVehicleRecord(activeReservation);navigationMessage='';render();return;}prepareNewChargingSession(navigationState.source==='reservation' ? reservationVehicleRecord(activeReservation) : activeVehicleRecord(), navigationState.source==='reservation' ? activeReservation : null);startCharge.connector=assignment.connectorId;startCharge.code=chargerCodeForConnector(selectedStationConnector(),selectedStation);startCharge.stage='checking';activeTab='charge';screen='charger-check';render();});
    app.querySelector('[data-find-compatible-station]')?.addEventListener('click',()=>{mapFilters.compatible=true;mapFilters.available=true;showFavoritesOnly=false;mapQuery='';mapView='list';activeTab='map';screen='map';navigationState.assignment=null;render();});
    app.querySelector('[data-arrival-station-help]')?.addEventListener('click',()=>{supportReturn={screen,tab:activeTab};supportTopic='Reservation help';screen='support';render();});

    app.querySelectorAll('[data-station]').forEach(b => b.addEventListener('click', () => { selectedStation = stations.find(s => s.id === Number(b.dataset.station)) || stations[0]; render(); }));
    app.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => { filter = b.dataset.filter || 'Available'; render(); }));
    app.querySelector('[data-open-selected]')?.addEventListener('click', () => { locationReturn={screen,tab:activeTab}; screen = 'location'; render(); });
    app.querySelector('[data-open-station]')?.addEventListener('click', e => { locationReturn={screen,tab:activeTab}; selectedStation = stations.find(s=>s.id===Number(e.currentTarget.dataset.openStation)) || stations[0]; activeTab = 'map'; screen = 'location'; render(); });
    app.querySelector('[data-home-reservation]')?.addEventListener('click',()=>{ if(appState==='reserved'){reservationManageReturn={screen,tab:activeTab};restoreReservationStation();screen='reservation-manage';} else {reservationReturn={screen,tab:activeTab};reservationMode='create';reservationStep=1;if(!requireActiveVehicleForFlow('reservation',activeTab)) { render(); return; }resetReservationVehicleToActive();screen='reservation';} render();});
    app.querySelector('[data-toggle-home-vehicles]')?.addEventListener('click',()=>{homeVehicleMenuOpen=!homeVehicleMenuOpen;render();});
    app.querySelectorAll('[data-home-vehicle]').forEach(b=>b.addEventListener('click',()=>{vehicles.forEach(v=>v.active=v.id===Number(b.dataset.homeVehicle));if(appState==='completed')appState=activeReservation?'reserved':'idle';homeVehicleMenuOpen=false;render();}));
    app.querySelectorAll('[data-home-scenario]').forEach(b=>b.addEventListener('click',()=>{homeScenario=b.dataset.homeScenario;activeTab='home';screen='home';render();}));
    app.querySelector('[data-retry-home]')?.addEventListener('click',()=>{homeScenario='normal';render();});
    app.querySelector('[data-show-alternatives]')?.addEventListener('click',()=>{homeScenario='station-unavailable';render();});
    app.querySelectorAll('[data-open-station-alt]').forEach(b=>b.addEventListener('click',()=>{locationReturn={screen,tab:activeTab};selectedStation=stations.find(s=>s.id===Number(b.dataset.openStationAlt))||stations[0];activeTab='map';screen='location';render();}));
    app.querySelector('[data-back-map]')?.addEventListener('click', () => { activeTab='map'; screen='map'; render(); });
    app.querySelector('[data-reserve]')?.addEventListener('click', () => { reservationReturn={screen,tab:activeTab}; reservationMode='create'; reservationStep = 1; if(!requireActiveVehicleForFlow('reservation',activeTab)) { render(); return; } resetReservationVehicleToActive(); reservationMessage=''; screen = 'reservation'; render(); });
    app.querySelector('[data-back-location]')?.addEventListener('click', () => { activeTab='map'; screen='location'; render(); });
    app.querySelector('[data-back-reservation]')?.addEventListener('click', () => { if(reservationMode==='edit'){screen='reservation-manage';render();return;} restoreReturnContext(reservationReturn); render(); });
    app.querySelectorAll('[data-res-type]').forEach(b => b.addEventListener('click', () => { reservation.type = b.dataset.resType; syncReservationHardware(); reservationMessage=''; render(); }));
    app.querySelectorAll('[data-res-vehicle]').forEach(b => b.addEventListener('click', () => { const vehicle=vehicles.find(v=>v.id===Number(b.dataset.resVehicle)); if(vehicle){ setReservationVehicle(vehicle, true); syncReservationHardware(); reservationMessage=''; } render(); }));
    app.querySelectorAll('[data-res-charger]').forEach(b => b.addEventListener('click', () => { reservation.charger=b.dataset.resCharger || ''; syncReservationHardware(); reservationMessage=''; render(); }));
    app.querySelectorAll('[data-res-bay]').forEach(b => b.addEventListener('click', () => { reservation.bay=b.dataset.resBay || ''; reservationMessage=''; render(); }));
    app.querySelectorAll('[data-res-date]').forEach(b => b.addEventListener('click', () => { reservation.date = b.dataset.resDate; reservation.time = reservation.date.startsWith('Tomorrow')?'10:00':reservation.date.startsWith('Saturday')?'13:00':'11:30'; render(); }));
    app.querySelectorAll('[data-time]').forEach(b => b.addEventListener('click', () => { reservation.time = b.dataset.time; render(); }));
    app.querySelector('[data-duration]')?.addEventListener('input', e => { reservation.duration = Number(e.target.value); document.querySelector('#duration-value').textContent = reservation.duration + ' min'; });
    app.querySelector('[data-target]')?.addEventListener('input', e => { reservation.target = Number(e.target.value); document.querySelector('#target-value').textContent = reservation.target + '%'; });
    app.querySelector('[data-next-step]')?.addEventListener('click', () => { if(reservationStep===1 && !reservationHardwareSelectionValid()){const compatibilityIssue=reservationCompatibilityIssue();reservationMessage=compatibilityIssue || (reservation.type==='Parking bay'?'Choose a parking bay to continue.':'Choose a compatible charger to continue.');render();return;} reservationMessage=''; reservationStep = Math.min(3, reservationStep + 1); render(); });
    app.querySelector('[data-prev-step]')?.addEventListener('click', () => { reservationStep = Math.max(1, reservationStep - 1); render(); });
    app.querySelector('[data-terms]')?.addEventListener('change', e => { reservationTermsAccepted = e.target.checked; });
    app.querySelector('[data-confirm-reservation]')?.addEventListener('click', () => { if(!reservationTermsAccepted){reservationMessage='Accept the reservation conditions to continue.';render();return;} const selectedVehicle=reservationVehicleRecord(reservation); if(!selectedVehicle){reservationMessage='Choose a vehicle for this reservation.';reservationStep=1;render();return;} setReservationVehicle(selectedVehicle,false); if(!reservationHardwareSelectionValid()){reservationMessage=reservationCompatibilityIssue(reservation.type, selectedStation, selectedVehicle) || 'Review the charger or parking selection before confirming.';reservationStep=1;render();return;} const editing=reservationMode==='edit'&&activeReservation; const rid=editing?activeReservation.id:nextRecordId('VD-RS',activityReservations); const nextReservation={...(editing?activeReservation:{}),...reservation,vehicleId:selectedVehicle.id,vehicle:selectedVehicle.name,id:rid,status:'Confirmed',stationId:selectedStation.id,stationName:selectedStation.name,stationAddress:selectedStation.address,countdownMinutes:activeReservation?.countdownMinutes ?? 18}; if(!editing && !chargeReservationFee(nextReservation)){reservationMessage=`Add a saved card or at least ${reservationFee.toLocaleString()} AMD to Wallet before confirming.`;render();return;} activeReservation=nextReservation; updateReservationRecord(activeReservation,'Confirmed'); addSystemNotification(editing?'Reservation updated':'Reservation confirmed',`${selectedStation.name} · ${reservation.date}, ${reservation.time} · ${selectedVehicle.name}${editing?'':` · ${reservationFee.toLocaleString()} AMD fee paid`}`,'reserved','reservation-manage','Manage reservation',rid); appState='reserved'; reservationMessage=''; screen = 'reservation-success'; render(); });
    app.querySelector('[data-finish-reservation]')?.addEventListener('click', () => { appState = 'reserved'; activeTab = 'home'; screen = 'home'; render(); });
    app.querySelector('[data-open-reservation-manage]')?.addEventListener('click',()=>{reservationManageReturn={screen,tab:activeTab};restoreReservationStation();screen='reservation-manage';reservationMessage='';render();});
    app.querySelectorAll('[data-modify-reservation]').forEach(b=>b.addEventListener('click',()=>{reservationMode='edit';if(activeReservation){restoreReservationStation();reservation={...reservation,...activeReservation};syncReservationHardware();}reservationStep=1;reservationMessage='';screen='reservation';render();}));
    app.querySelector('[data-cancel-reservation]')?.addEventListener('click',()=>{screen='reservation-cancel';render();});
    app.querySelector('#cancel-reason')?.addEventListener('change',e=>{cancellationReason=e.target.value;render();});
    app.querySelector('[data-confirm-cancel]')?.addEventListener('click',()=>{const result=cancelActiveReservation();reservationMessage=result.amount?`Reservation cancelled. ${result.amount.toLocaleString()} AMD refunded to ${result.method}.`:'Reservation cancelled.';activeTab='home';screen='home';render();});
    app.querySelectorAll('[data-switch-reservation-vehicle]').forEach(b=>b.addEventListener('click',()=>{const vehicle=activateReservationVehicle(activeReservation || reservation);if(!vehicle)return;reservationMessage=`${vehicle.name} is now the active vehicle for this reservation.`;navigationMessage=reservationMessage;chargeStartMessage='';render();}));
    app.querySelector('[data-confirm-arrival]')?.addEventListener('click',()=>{if(activeReservation && reservationVehicleMismatch(activeReservation)){const reservedVehicle=reservationVehicleRecord(activeReservation);reservationMessage='';render();return;}navigationState={source:'reservation',started:false,progress:100,arrived:true,arrivalConfirmed:false,assignment:buildNavigationAssignment()};navigationMessage='';screen='arrival';render();});
    app.querySelector('[data-simulate-no-show]')?.addEventListener('click',()=>{if(activeReservation){lastExpiredReservationId=activeReservation.id;updateReservationRecord(activeReservation,'No-show',0);addSystemNotification('Reservation expired',`${reservationStation(activeReservation).name} · no-show recorded.`,'reserved','activity','View reservations',activeReservation.id);}activeReservation=null;appState='idle';screen='reservation-no-show';render();});
    app.querySelectorAll('[data-use-alternative]').forEach(b=>b.addEventListener('click',()=>{reservationReturn={screen,tab:activeTab};selectedStation=stations.find(x=>x.id===Number(b.dataset.useAlternative))||stations[0];waitingListJoined=false;reservationMode='create';reservationStep=1;resetReservationVehicleToActive();activeTab='map';screen='reservation';render();}));
    app.querySelector('[data-leave-waiting-list]')?.addEventListener('click',()=>{waitingListJoined=false;screen='location';render();});
    app.querySelectorAll('[data-scan-charger]').forEach(b=>b.addEventListener('click',()=>{if(!requireActiveVehicleForFlow('charge-start','charge')) { render(); return; }prepareNewChargingSession();activeTab='charge';scannerFlashlight=false;chargeStartMessage='';if(!askForPermission('camera','charge-start','charge')){render();return;}screen='charge-scan';render();}));
    app.querySelector('[data-begin-scan]')?.addEventListener('click',()=>{if(!requireActiveVehicleForFlow('charge-scan','charge')) { render(); return; }if(!askForPermission('camera','charge-start','charge')){render();return;}if(appState!=='charging')prepareNewChargingSession();scannerFlashlight=false;screen='charge-scan';render();});
    app.querySelector('[data-scan-manual]')?.addEventListener('click',()=>{scannerFlashlight=false;screen='charge-start';chargeStartMessage='';render();});
    app.querySelector('[data-toggle-scanner-flash]')?.addEventListener('click',()=>{scannerFlashlight=!scannerFlashlight;render();});
    app.querySelector('[data-check-code]')?.addEventListener('click',()=>{if(!requireActiveVehicleForFlow('charge-start','charge')) { render(); return; }if(appState!=='charging')prepareNewChargingSession();const code=document.querySelector('#charger-code')?.value?.trim();if(!code){chargeStartMessage='Enter the charger code.';render();return;}const resolved=resolveChargerCode(code);if(!resolved){chargeStartMessage='Charger code was not recognized. Check the label and try again.';render();return;}selectedStation=resolved.station;startCharge.code=chargerCodeForConnector(resolved.connector,resolved.station);startCharge.connector=resolved.connector.id;startCharge.stage='checking';screen='charger-check';chargeStartMessage='';render();});
    app.querySelector('[data-simulate-scan]')?.addEventListener('click',()=>{if(!requireActiveVehicleForFlow('charge-scan','charge')) { render(); return; }if(appState!=='charging')prepareNewChargingSession();const activeVehicle=chargingFlowVehicleRecord();const scannedStation=selectedStation;const scannedConnector=stationConnectorRows(scannedStation).find(c=>c.status==='available' && (!activeVehicle?.connector || c.type===activeVehicle.connector)) || stationConnectorRows(scannedStation)[0];const scannedCode=chargerCodeForConnector(scannedConnector,scannedStation);const resolved=resolveChargerCode(scannedCode);if(!resolved){chargeStartMessage='The scanned QR code could not be verified.';screen='charge-start';render();return;}scannerFlashlight=false;selectedStation=resolved.station;startCharge.code=scannedCode;startCharge.connector=resolved.connector.id;startCharge.stage='checking';screen='charger-check';chargeStartMessage='';render();});
    app.querySelector('[data-use-recent-charger]')?.addEventListener('click',e=>{if(!requireActiveVehicleForFlow('charge-start','charge')) { render(); return; }if(appState!=='charging')prepareNewChargingSession();const stationId=Number(e.currentTarget.dataset.stationId);const connectorId=e.currentTarget.dataset.connectorId;const station=stations.find(item=>item.id===stationId);if(!station)return;selectedStation=station;startCharge.connector=connectorId||stationConnectorRows(station)[0]?.id||'04';startCharge.code=chargerCodeForConnector(selectedStationConnector(),selectedStation);startCharge.stage='checking';chargeStartMessage='';screen='charger-check';render();});
    app.querySelector('[data-use-reserved-charger]')?.addEventListener('click',()=>{if(!requireActiveVehicleForFlow('charge-start','charge')) { render(); return; }restoreReservationStation();if(!activeReservation || !stationPresenceConfirmed(selectedStation)){reservationManageReturn={screen,tab:activeTab};reservationMessage='Navigate to the reserved station and confirm arrival before using the reserved charger shortcut.';screen='reservation-manage';render();return;}if(reservationVehicleMismatch(activeReservation)){const reservedVehicle=reservationVehicleRecord(activeReservation);chargeStartMessage=`This reservation is for ${reservedVehicle?.name||'another vehicle'}. Switch to the reserved vehicle first.`;render();return;}const connectorId=activeReservation?.type==='Specific charger' ? activeReservation.charger : null;if(!connectorId){reservationManageReturn={screen,tab:activeTab};reservationMessage='This reservation receives its charger at arrival. Navigate to the station to get an assignment.';screen='reservation-manage';render();return;}if(appState!=='charging')prepareNewChargingSession(reservationVehicleRecord(activeReservation) || activeVehicleRecord(), activeReservation);startCharge.connector=connectorId;startCharge.code=chargerCodeForConnector(selectedStationConnector(),selectedStation);startCharge.stage='checking';screen='charger-check';chargeStartMessage='';render();});
    app.querySelectorAll('[data-start-with-connector]').forEach(b=>b.addEventListener('click',()=>{if(!requireActiveVehicleForFlow('location',activeTab)) { render(); return; }if(!stationPresenceConfirmed(selectedStation)){navigationMessage='Confirm arrival before starting directly from Station Details. You can also use Scan while standing beside the charger.';navigationState={source:'location',started:false,progress:0,arrived:false,arrivalConfirmed:false,assignment:null};screen='navigation-preview';render();return;}if(appState!=='charging')prepareNewChargingSession();startCharge.connector=b.dataset.startWithConnector;startCharge.code=chargerCodeForConnector(selectedStationConnector());startCharge.stage='checking';activeTab='charge';screen='charger-check';chargeStartMessage='';render();}));
    app.querySelector('[data-connector-ready]')?.addEventListener('click',()=>{startCharge.stage='connector';screen='connector-select';render();});
    app.querySelectorAll('[data-select-start-connector]').forEach(b=>b.addEventListener('click',()=>{startCharge.connector=b.dataset.selectStartConnector;const connector=selectedStationConnector();startCharge.code=chargerCodeForConnector(connector);syncChargingPowerToConnector(connector);render();}));
    app.querySelector('[data-confirm-connector]')?.addEventListener('click',()=>{syncChargingPowerToConnector(selectedStationConnector());startCharge.stage='review';chargeStartMessage='';screen='tariff-review';render();});
    app.querySelectorAll('[data-start-payment]').forEach(b=>b.addEventListener('click',()=>{startCharge.payment=b.dataset.startPayment;render();}));
    app.querySelector('[data-authorize-payment]')?.addEventListener('click',()=>{if(typeof navigator!=='undefined' && !navigator.onLine){render();return;}if(startCharge.payment==='Wallet' && walletBalance<startCharge.preauth){const coverage=ensureWalletCoverage(startCharge.preauth,'Charging authorization');if(!coverage.ok){chargeStartMessage=coverage.topUp?.ok?'Automatic top-up was not enough for the authorization hold.':'Wallet authorization requires more funds or a saved default card for automatic top-up.';render();return;}}startCharge.stage='connecting';screen='charge-connecting';render();});
    app.querySelector('[data-start-terms]')?.addEventListener('change',e=>{startCharge.accepted=e.target.checked;});
    app.querySelector('[data-start-session]')?.addEventListener('click',()=>{if(!requireActiveVehicleForFlow('tariff-review','charge')) { render(); return; }const limitIssue=chargingStartLimitIssue();if(limitIssue){chargeStartMessage=limitIssue;render();return;}if(!startCharge.accepted){chargeStartMessage='Accept the tariff and charging conditions.';render();return;}syncChargingPowerToConnector(selectedStationConnector());startCharge.stage='authorizing';chargeStartMessage='';screen='payment-authorize';render();});
    app.querySelector('[data-finish-connecting]')?.addEventListener('click',()=>{if(!requireActiveVehicleForFlow('charge-start','charge')) { render(); return; }const limitIssue=chargingStartLimitIssue();if(limitIssue){chargeStartMessage=limitIssue;startCharge.stage='review';screen='tariff-review';render();return;}if(startCharge.stage==='connecting'){startCharge.stage='waiting';render();return;}if(startCharge.stage==='waiting'){startCharge.stage='starting';render();return;}syncChargingPowerToConnector(selectedStationConnector());captureActiveChargingSession();appState='charging';charging.paused=false;recalculateChargingRemaining();startCharge.stage='charging';activeTab='charge';screen='charging';render();});
    app.querySelectorAll('[data-start-error]').forEach(b=>b.addEventListener('click',()=>{startCharge.error=b.dataset.startError;startCharge.stage='failed';screen='charge-start-error';render();}));
    app.querySelector('[data-retry-start]')?.addEventListener('click',()=>{const error=startCharge.error;if(error==='payment'){startCharge.stage='authorizing';screen='payment-authorize';}else if(error==='vehicle'){startCharge.stage='waiting';screen='charge-connecting';}else if(error==='start'){startCharge.stage='starting';screen='charge-connecting';}else{startCharge.stage='checking';screen='charger-check';}startCharge.error='';render();});
    app.querySelectorAll('[data-open-charge-limit]').forEach(b=>b.addEventListener('click',()=>{chargeLimitReturnScreen=b.dataset.limitReturn==='charging'?'charging':'tariff-review';chargeLimitDraft={...chargeLimit};if(appState!=='charging' && chargeLimitDraft.type==='battery' && chargeLimitDraft.battery<=charging.battery) chargeLimitDraft.battery=minimumBatteryTarget(charging.battery);screen='charge-limit';activeTab='charge';render();}));
    app.querySelectorAll('[data-charge-limit-type]').forEach(b=>b.addEventListener('click',()=>{chargeLimitDraft=chargeLimitDraft||{...chargeLimit};chargeLimitDraft.type=b.dataset.chargeLimitType;if(appState!=='charging' && chargeLimitDraft.type==='battery' && chargeLimitDraft.battery<=charging.battery) chargeLimitDraft.battery=minimumBatteryTarget(charging.battery);render();}));
    app.querySelector('[data-charge-limit-value]')?.addEventListener('input',e=>{const key=e.target.dataset.chargeLimitValue;chargeLimitDraft=chargeLimitDraft||{...chargeLimit};chargeLimitDraft[key]=Number(e.target.value);const out=document.querySelector('#charge-limit-value');if(out)out.textContent=key==='battery'?`${chargeLimitDraft[key]}%`:key==='energy'?`${chargeLimitDraft[key]} kWh`:key==='cost'?formatDisplayMoney(chargeLimitDraft[key]):`${chargeLimitDraft[key]} min`;});
    app.querySelector('[data-apply-charge-limit]')?.addEventListener('click',()=>{const nextLimit=chargeLimitDraft?{...chargeLimitDraft}:{...chargeLimit};if(appState!=='charging'){const issue=chargingStartLimitIssue(nextLimit);if(issue){chargeStartMessage=issue;render();return;}}chargeLimit=nextLimit;chargeLimitDraft=null;charging.target=chargeLimit.type==='battery'?chargeLimit.battery:100;if(activeChargingSession) activeChargingSession.limit={...chargeLimit};recalculateChargingRemaining();if(appState==='charging'&&(charging.battery>=100||chargingLimitReached())){completeChargingAtCurrentLevel(chargeLimitReturnScreen==='charging',charging.battery>=100?'Battery full':chargingLimitCompletionReason());return;}screen=chargeLimitReturnScreen;activeTab='charge';render();});
    app.querySelector('[data-charge-speed]')?.addEventListener('click', () => { charging.speed = charging.speed === 'Maximum' ? 'Balanced' : charging.speed === 'Balanced' ? 'Eco' : 'Maximum'; syncChargingPowerToConnector(chargingSessionContext().connector); recalculateChargingRemaining(); render(); });
    app.querySelector('[data-toggle-pause]')?.addEventListener('click', () => { charging.paused = !charging.paused; render(); });
    app.querySelector('[data-stop-charge]')?.addEventListener('click', () => { completeChargingAtCurrentLevel(true, 'Stopped by driver'); });
    app.querySelector('[data-simulate-interruption]')?.addEventListener('click', () => { interruptChargingSession('Charger connection lost during charging'); });
    app.querySelector('[data-summary-home]')?.addEventListener('click', () => { activeTab='home'; screen='home'; render(); });
    app.querySelector('[data-view-latest-receipt]')?.addEventListener('click',()=>{receiptReturn={screen,tab:activeTab};selectedActivityId=latestCompletedSessionId;activeTab='activity';screen='receipt';render();});
    app.querySelector('[data-view-latest-session]')?.addEventListener('click',()=>{sessionDetailReturn={screen,tab:activeTab};selectedActivityId=latestCompletedSessionId;activeTab='activity';screen='session-detail';render();});
    ensureChargingSimulation();
    ensureParkingCountdown();
    enhanceRenderedUI(app);
}
window.addEventListener('online', render);
window.addEventListener('offline', render);
document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const back = document.querySelector('.ui-back, [data-simple-back], [data-back-map], [data-back-location], [data-back-reservation]');
    if (back instanceof HTMLElement) back.click();
});

applyTheme();
render();
