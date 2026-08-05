// @ts-nocheck
const stations = [
    { id: 1, name: 'Northern Avenue Hub', address: 'Northern Ave. 8, Yerevan', distance: '2.4 km', distanceKm: 2.4, eta: '8 min', available: 4, total: 8, power: 180, price: 120, status: 'available', x: 61, y: 34, rating: 4.9, reservable: true, parking: true, open: '24/7', connector: 'CCS2', facilities: ['Parking','Coffee','Wi-Fi','Card pay'] },
    { id: 2, name: 'Cascade Charge Point', address: 'Tamanyan St. 10', distance: '3.1 km', distanceKm: 3.1, eta: '11 min', available: 1, total: 6, power: 120, price: 110, status: 'busy', x: 28, y: 27, rating: 4.7, reservable: true, parking: true, open: '06:00–00:00', connector: 'CCS2', facilities: ['Parking','Coffee','Wi-Fi'] },
    { id: 3, name: 'Republic Square Station', address: 'Abovyan St. 1', distance: '4.6 km', distanceKm: 4.6, eta: '15 min', available: 2, total: 4, power: 240, price: 135, status: 'reserved', x: 48, y: 62, rating: 4.8, reservable: true, parking: false, open: '24/7', connector: 'CCS2', facilities: ['Wi-Fi','Card pay'] },
    { id: 4, name: 'Dalma Garden Garage', address: 'Tsitsernakaberd Hwy. 3', distance: '6.2 km', distanceKm: 6.2, eta: '18 min', available: 0, total: 10, power: 60, price: 95, status: 'offline', x: 78, y: 73, rating: 4.3, reservable: false, parking: true, open: '10:00–22:00', connector: 'CCS2', facilities: ['Parking','Coffee','Card pay'] },
    { id: 5, name: 'Komitas Fast Lane', address: 'Komitas Ave. 49', distance: '5.4 km', distanceKm: 5.4, eta: '16 min', available: 3, total: 5, power: 150, price: 105, status: 'available', x: 18, y: 72, rating: 4.6, reservable: true, parking: true, open: '24/7', connector: 'CCS2', facilities: ['Parking','Wi-Fi'] },
];
const stateMeta = {
    idle: { label: 'Ready to drive', battery: 68, range: 342, eyebrow: 'Vehicle ready' },
    reserved: { label: 'Reservation active', battery: 64, range: 319, eyebrow: 'Arrival in 18 min' },
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
let mapSort = 'distance';
let mapFilters = { available: false, fast: false, reservable: false, parking: false, maxPrice: 150 };
let favoriteStations = new Set([1]);
let showFavoritesOnly = false;
let waitingListJoined = false;
let reservationStep = 1;
let reservation = { type: 'Specific charger', vehicle: 'Tesla Model Y', date: 'Today · Wed 5', time: '11:30', duration: 45, target: 90, charger: '04', bay: 'B-12' };
let reservationMode = 'create';
let activeReservation = null;
let reservationTermsAccepted = true;
let reservationMessage = '';
let cancellationReason = 'Plans changed';
let graceMinutes = 10;
let waitingPosition = 3;
let navigationState = { source: 'location', started: false, progress: 0, arrived: false, arrivalConfirmed: false };
let navigationMessage = '';
let charging = { battery: 64, target: 90, power: 142, energy: 18.6, cost: 2232, minutes: 17, remaining: 26, speed: 'Maximum', paused: false };
let startCharge = { code: 'VD-04-CCS2', connector: '04', payment: 'Wallet', preauth: 5000, accepted: true, error: '', stage: 'ready' };
let chargeStartMessage = '';
let chargingSummary = { startBattery: 64, endBattery: 90, energy: 31.8, cost: 3816, duration: 43 };
let parkingSession = { stage: 'grace', graceMinutes: 10, idleMinutes: 0, idleCost: 0, extensionMinutes: 30, bay: 'B-12', message: '' };
let vehicles = [
  {id:1, name:'Tesla Model Y', plate:'35 GG 505', connector:'CCS2', battery:68, limit:90, active:true},
  {id:2, name:'BMW i4', plate:'40 AA 404', connector:'CCS2', battery:41, limit:80, active:false}
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
let onboardingData = { country: 'Armenia', language: 'English', email: 'gevor@example.com', vehicleBrand: 'Hyundai', vehicleModel: 'IONIQ 5', plate: '77 EV 777', connector: 'CCS2', card: '•••• 5050' };
let onboardingComplete = false;
let twoFactorEnabled = true;
let biometricEnabled = false;
let securityMessage = '';
let notificationSettingsMessage = '';
let accountMessage = '';
let profile = { name: 'Gevor Vardanyan', email: 'gevor@voltdrive.am', phone: '+374 99 505050', address: 'Yerevan, Armenia' };
let accountPreferences = { language: 'English', country: 'Armenia', currency: 'AMD', distance: 'Kilometres', energy: 'kWh', marketingData: false, analytics: true };
try { accountPreferences = { ...accountPreferences, ...JSON.parse(localStorage.getItem('voltdrive.preferences') || '{}') }; } catch (_) {}
let billingProfile = { company: '', taxId: '', billingEmail: 'gevor@voltdrive.am', plan: 'VoltDrive Free', autoRenew: false, promoCode: '' };
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
const icon = (name) => ({ bell: '◌', car: '▱', chevron: '›', qr: '▦', wallet: '▤', pin: '●', zap: 'ϟ', clock: '◷', sparkle: '✦', home: '⌂', map: '◇', history: '↺', account: '◉', nav: '➤', plug: '⌁', back: '‹', filter: '≡', search: '⌕', route: '↗', shield: '◆', star: '★', parking: 'P', coffee: '☕', wifi: '⌁', card: '▭' }[name] || '•');
function applyTheme() {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.style.colorScheme = 'dark';
}
function savePreferences() {
    try { localStorage.setItem('voltdrive.preferences', JSON.stringify(accountPreferences)); } catch (_) {}
    applyTheme();
}
function primaryAction(state) {
    if (state === 'idle')
        return { label: 'Find a charger', icon: 'pin', action: 'map' };
    if (state === 'reserved')
        return { label: 'Navigate to station', icon: 'nav', action: 'navigate' };
    if (state === 'charging')
        return { label: 'View active charging', icon: 'plug', action: 'active-charge' };
    return { label: 'View charging summary', icon: 'history', action: 'summary' };
}
function layout(content, title = 'Good morning, Gevor', subtitle = 'Wednesday, 11:00') {
    return `<div class="stage"><div class="phone-shell"><div class="noise"></div><header class="topbar"><div><p class="micro">${subtitle}</p><h1>${title}</h1></div><button class="icon-button" data-notifications aria-label="Open notifications">${icon('bell')}<i class="notification-dot"></i></button></header><main class="content">${content}</main>${bottomNav()}</div><aside class="prototype-notes"><div class="brand-mark"><span>${icon('shield')}</span><span>VoltDrive</span></div><h2>Driver app prototype</h2><p>Complete driver prototype with reservation and end-to-end charging start flow.</p><div class="note-card"><strong>Current tab</strong><span>${activeTab}</span></div><div class="note-card"><strong>Current screen</strong><span>${screen}</span></div><div class="note-card"><strong>Selected station</strong><span>${selectedStation.name}</span></div><div class="note-card"><strong>Design principle</strong><span>One dominant action per state</span></div><button class="ui-button ui-button--secondary ui-button--block" data-open-prototype-tools>Open prototype tools</button></aside></div>`;
}
function bottomNav() {
    const tabs = [['home', 'Home', 'home'], ['map', 'Map', 'map'], ['charge', 'Charge', 'zap'], ['activity', 'Activity', 'history'], ['account', 'Account', 'account']];
    return `<nav class="bottom-nav">${tabs.map(([id, label, ico]) => `<button data-tab="${id}" class="${activeTab === id ? 'active' : ''}"><span>${icon(ico)}</span><small>${label}</small></button>`).join('')}</nav>`;
}
function homeScreen() {
    const activeVehicle = vehicles.find(v=>v.active) || vehicles[0];
    const meta = {...stateMeta[appState], battery: activeVehicle?.battery ?? stateMeta[appState].battery};
    const primary = primaryAction(appState);
    const scenario = homeScenario;
    const range = Math.round((meta.battery || 0) * 5.02);
    if (scenario === 'loading') return layout(`<section class="home-skeleton"><div class="skeleton skeleton-hero"></div><div class="skeleton skeleton-action"></div><div class="skeleton-grid"><div class="skeleton"></div><div class="skeleton"></div></div><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div></section>`);
    if (scenario === 'no-vehicle') return layout(`<section class="home-empty-state ui-card"><span class="home-empty-icon">${icon('car')}</span><small>Vehicle garage</small><h2>Add your first electric vehicle</h2><p>We use its connector, battery size and charging limit to show compatible chargers and better estimates.</p><button class="ui-button ui-button--primary ui-button--block" data-add-vehicle>Add vehicle</button></section><section class="home-helper-card"><span>${icon('shield')}</span><div><strong>Why this is required</strong><p>Your vehicle prevents incompatible connector reservations.</p></div></section>`);
    const lowBattery = scenario === 'low-battery';
    const offline = scenario === 'offline';
    const noPayment = scenario === 'no-payment';
    const stationUnavailable = scenario === 'station-unavailable';
    const displayBattery = lowBattery ? 12 : meta.battery;
    const displayRange = lowBattery ? 58 : range;
    const warning = lowBattery ? `<section class="home-alert home-alert--warning"><span>!</span><div><strong>Low battery · ${displayBattery}%</strong><p>Your estimated range is ${displayRange} km. A fast charger is available 2.4 km away.</p></div><button data-primary="map">Find charger</button></section>` : offline ? `<section class="home-alert"><span>↯</span><div><strong>You are offline</strong><p>Live charger availability may be outdated. Saved reservations and station details remain available.</p></div><button data-retry-home>Retry</button></section>` : noPayment ? `<section class="home-alert home-alert--warning"><span>${icon('card')}</span><div><strong>Add a payment method</strong><p>A card or wallet balance is required before starting a public charging session.</p></div><button data-manage-payments>Add card</button></section>` : stationUnavailable ? `<section class="home-alert home-alert--danger"><span>!</span><div><strong>Your nearest station became unavailable</strong><p>Northern Avenue Hub is temporarily offline. We found two nearby alternatives.</p></div><button data-show-alternatives>Alternatives</button></section>` : '';
    const stationCard = stationUnavailable ? `<section class="home-alternatives"><div class="section-heading"><div><small>Recommended alternatives</small><h2>Available nearby</h2></div></div>${stations.filter(s=>s.available>0 && s.id!==1).slice(0,2).map(s=>`<button class="home-alternative" data-open-station-alt="${s.id}"><span class="map-result-status status-${s.status}">${s.available}</span><span><strong>${s.name}</strong><small>${s.distance} · ${s.power} kW · ${s.price} AMD/kWh</small></span><span>${icon('chevron')}</span></button>`).join('')}</section>` : `<button class="info-card station-card card-button" data-open-station="1"><div class="section-heading"><div><small>Nearest station</small><h2>Northern Avenue Hub</h2></div><span class="distance-pill">2.4 km</span></div><div class="station-visual"><span>${icon('pin')}</span><div class="station-lines"><span></span><span></span><span></span></div><span>${icon('zap')}</span></div><div class="station-stats"><span><i></i>${offline?'Availability unknown':'4 available'}</span><span>Up to 180 kW</span><span>120 AMD/kWh</span></div></button>`;
    return layout(`${warning}<section class="hero-card state-${appState} ${lowBattery?'is-low-battery':''}"><div class="hero-topline"><div><span class="status-dot"></span><span>${lowBattery?'Charge recommended':offline?'Last synced 9 min ago':meta.eyebrow}</span></div><button class="vehicle-switcher" data-toggle-home-vehicles>${activeVehicle?.name || 'Choose vehicle'} ${icon('chevron')}</button></div>${homeVehicleMenuOpen?`<div class="home-vehicle-menu">${vehicles.map(v=>`<button data-home-vehicle="${v.id}" class="${v.active?'is-selected':''}"><span class="mini-car">${icon('car')}</span><span><strong>${v.name}</strong><small>${v.plate} · ${v.battery}%</small></span><b>${v.active?'✓':''}</b></button>`).join('')}<button data-add-vehicle><span>＋</span><span><strong>Add another vehicle</strong><small>Register a compatible EV</small></span></button></div>`:''}<div class="car-stage"><div class="energy-orbit"></div><div class="car-silhouette">${icon('car')}</div></div><div class="battery-row"><div><div class="battery-number">${displayBattery}<span>%</span></div><p>${lowBattery?'Low battery':meta.label}</p></div><div class="range-block"><strong>${displayRange}</strong><span>${accountPreferences.distance==='Miles'?'mi':'km'} range</span></div></div><div class="charge-track"><span style="width:${displayBattery}%"></span></div><div class="vehicle-meta"><span>${activeVehicle?.plate||'—'}</span><span>Limit ${activeVehicle?.limit||90}%</span><span>${activeVehicle?.connector||'CCS2'}</span></div></section><button class="primary-action" data-primary="${lowBattery?'map':primary.action}"><span class="primary-icon">${icon(lowBattery?'zap':primary.icon)}</span><span><small>Recommended action</small><strong>${lowBattery?'Charge nearby':primary.label}</strong></span><span>${icon('chevron')}</span></button><div class="quick-grid"><button class="quick-card" data-scan-charger><span class="quick-icon">${icon('qr')}</span><span><small>Quick start</small><strong>Scan charger</strong></span></button><button class="quick-card" data-add-funds><span class="quick-icon">${icon('wallet')}</span><span><small>Wallet</small><strong>${noPayment?'Add payment':walletBalance.toLocaleString()+' AMD'}</strong></span></button></div>${stationCard}<button class="info-card reservation-card card-button" data-home-reservation><div class="reservation-icon">${icon('clock')}</div><div><small>${appState === 'reserved' ? 'Active reservation' : 'Next availability'}</small><h3>${appState === 'reserved' ? 'Today, 11:20' : 'No reservation'}</h3><p>${appState === 'reserved' ? 'Bay B-12 · Charger 04' : 'Reserve a charger before arrival'}</p></div><span>${icon('chevron')}</span></button><section class="insight-card"><span>${icon('sparkle')}</span><div><strong>Smart recommendation</strong><p>${lowBattery?'Northern Avenue Hub can add about 250 km in 22 minutes.':'Charging after 22:00 can reduce your estimated cost by 18%.'}</p></div></section>`);
}
function filteredStations() {
    const query = mapQuery.trim().toLowerCase();
    let result = stations.filter(s => (!showFavoritesOnly || favoriteStations.has(s.id))
        && (!query || `${s.name} ${s.address}`.toLowerCase().includes(query))
        && (!mapFilters.available || s.available > 0)
        && (!mapFilters.fast || s.power >= 120)
        && (!mapFilters.reservable || s.reservable)
        && (!mapFilters.parking || s.parking)
        && s.price <= mapFilters.maxPrice);
    return [...result].sort((a,b) => mapSort === 'price' ? a.price-b.price : mapSort === 'power' ? b.power-a.power : a.distanceKm-b.distanceKm);
}
function stationListCard(s) {
    const favorite = favoriteStations.has(s.id);
    return `<article class="map-result-card ${selectedStation.id===s.id?'is-selected':''}">
      <button class="map-result-main" data-station="${s.id}">
        <span class="map-result-status status-${s.status}">${s.available}</span>
        <span><small>${s.distance} · ${s.eta}</small><strong>${s.name}</strong><em>${s.address}</em></span>
        <span class="map-result-meta"><small>${s.price} AMD/kWh</small><strong>${s.power} kW</strong><em>${s.available}/${s.total} free</em></span>
      </button>
      <div class="map-result-actions"><button class="ui-text-button" data-favorite-station="${s.id}">${favorite?'★ Saved':'☆ Save'}</button><button class="ui-text-button" data-open-location="${s.id}">Details ›</button></div>
    </article>`;
}
function mapScreen() {
    const results = filteredStations();
    const chips = [
      ['available','Available now'], ['fast','120+ kW'], ['reservable','Reservable'], ['parking','Parking']
    ];
    const controls = `<section class="map-toolbar">
      <div class="search-box"><span>${icon('search')}</span><input data-map-search value="${mapQuery}" placeholder="Search station or address" aria-label="Search location"/><button data-open-map-filters aria-label="Open filters">${icon('filter')}</button></div>
      <div class="map-view-row"><div class="ui-segment-grid map-view-switch"><button data-map-view="map" class="${mapView==='map'?'is-selected':''}">Map</button><button data-map-view="list" class="${mapView==='list'?'is-selected':''}">List</button></div><select data-map-sort aria-label="Sort stations"><option value="distance" ${mapSort==='distance'?'selected':''}>Nearest</option><option value="price" ${mapSort==='price'?'selected':''}>Lowest price</option><option value="power" ${mapSort==='power'?'selected':''}>Highest power</option></select></div>
      <div class="filter-row">${chips.map(([key,label]) => `<button data-quick-filter="${key}" class="${mapFilters[key]?'active':''}">${label}</button>`).join('')}</div>
    </section>`;
    const empty = `<section class="map-empty"><span>${icon('pin')}</span><h2>No matching chargers</h2><p>Try removing a filter or searching another district.</p><button class="ui-button ui-button--secondary" data-clear-map-filters>Clear filters</button></section>`;
    if (mapView === 'list') return layout(`${controls}<section class="map-results-summary"><div><small>Live network</small><h2>${results.length} stations found</h2></div><button class="ui-text-button ${showFavoritesOnly?'is-active':''}" data-open-favorites>${showFavoritesOnly?'Show all':`Saved ${favoriteStations.size}`}</button></section>${results.length?`<section class="map-results-list">${results.map(stationListCard).join('')}</section>`:empty}`, 'Find a charger', 'Search, compare and reserve');
    return layout(`${controls}${results.length?`<section class="map-canvas"><div class="map-grid"></div><div class="route-line"></div>${results.map(s => `<button class="map-pin status-${s.status} ${selectedStation.id === s.id ? 'selected' : ''}" data-station="${s.id}" style="left:${s.x}%;top:${s.y}%"><span>${s.available}</span></button>`).join('')}<div class="user-location">◉</div><div class="map-legend"><span><i class="available"></i>Available</span><span><i class="busy"></i>Busy</span><span><i class="offline"></i>Offline</span></div></section><section class="station-sheet"><div class="sheet-handle"></div><div class="section-heading"><div><small>${selectedStation.eta} away</small><h2>${selectedStation.name}</h2><p>${selectedStation.address}</p></div><button class="favorite-round ${favoriteStations.has(selectedStation.id)?'is-favorite':''}" data-favorite-station="${selectedStation.id}">${favoriteStations.has(selectedStation.id)?'★':'☆'}</button></div><div class="station-score"><span>${icon('star')} ${selectedStation.rating}</span><span><i></i>${selectedStation.available} of ${selectedStation.total} available</span></div><div class="spec-grid"><div><small>Power</small><strong>${selectedStation.power} kW</strong></div><div><small>Price</small><strong>${selectedStation.price} AMD</strong></div><div><small>Connector</small><strong>${selectedStation.connector}</strong></div></div><button class="primary-action compact" data-open-selected><span class="primary-icon">${icon('zap')}</span><span><small>View availability</small><strong>Open station details</strong></span><span>${icon('chevron')}</span></button></section>`:empty}`, 'Find a charger', 'Live availability nearby');
}
function mapFiltersScreen() {
    return layout(`<button class="ui-back ui-back--inline" data-simple-back="map">${icon('back')}</button><section class="filter-panel"><div class="section-heading"><div><small>Discovery preferences</small><h2>Map filters</h2></div><button class="ui-text-button" data-clear-map-filters>Reset</button></div>
      <label class="ui-list-item security-toggle"><span class="ui-list-icon">✓</span><span><small>Availability</small><strong>Available now</strong><em>Hide occupied and offline chargers</em></span><input class="ui-switch" type="checkbox" data-map-filter-toggle="available" ${mapFilters.available?'checked':''}></label>
      <label class="ui-list-item security-toggle"><span class="ui-list-icon">ϟ</span><span><small>Charging speed</small><strong>Fast charging only</strong><em>120 kW and above</em></span><input class="ui-switch" type="checkbox" data-map-filter-toggle="fast" ${mapFilters.fast?'checked':''}></label>
      <label class="ui-list-item security-toggle"><span class="ui-list-icon">◷</span><span><small>Booking</small><strong>Reservable stations</strong><em>Show stations that accept reservations</em></span><input class="ui-switch" type="checkbox" data-map-filter-toggle="reservable" ${mapFilters.reservable?'checked':''}></label>
      <label class="ui-list-item security-toggle"><span class="ui-list-icon">P</span><span><small>Facilities</small><strong>Parking available</strong><em>Charging bay with parking access</em></span><input class="ui-switch" type="checkbox" data-map-filter-toggle="parking" ${mapFilters.parking?'checked':''}></label>
      <label class="ui-form"><span>Maximum price <strong id="map-price-value">${mapFilters.maxPrice} AMD/kWh</strong></span><input type="range" min="90" max="160" step="5" value="${mapFilters.maxPrice}" data-map-price></label>
      <button class="ui-button ui-button--primary ui-button--block" data-apply-map-filters>Show ${filteredStations().length} stations</button>
    </section>`, 'Filters', 'Refine charging locations');
}

function locationScreen() {
    const s = selectedStation;
    return layout(`<button class="ui-back ui-back--overlay" data-back-map>${icon('back')}</button><section class="location-hero"><div class="location-glow"></div><div class="charger-art"><span>${icon('zap')}</span><div></div><small>ULTRA FAST</small></div><div class="location-badge"><i></i>${s.available} chargers available</div></section><section class="location-title"><div><small>${s.address}</small><h2>${s.name}</h2><div class="rating-line"><span>${icon('star')} ${s.rating}</span><span>${s.distance}</span><span>${s.eta}</span></div></div><button class="round-action" data-start-navigation>${icon('route')}</button></section><section class="info-card"><div class="section-heading"><div><small>Live availability</small><h2>Choose a charger</h2></div><span class="distance-pill">Open 24/7</span></div><div class="charger-list"><button class="charger-row selected ui-on-dark" data-start-with-connector="04"><span class="charger-number">04</span><span><small>CCS2 · Available now</small><strong>180 kW Ultra-fast</strong></span><span><small>${s.price} AMD/kWh</small><strong>Ready</strong></span></button><button class="charger-row ui-on-dark" data-start-with-connector="07"><span class="charger-number">07</span><span><small>CCS2 · Available now</small><strong>120 kW Fast</strong></span><span><small>110 AMD/kWh</small><strong>Ready</strong></span></button><button class="charger-row disabled ui-on-dark"><span class="charger-number">02</span><span><small>CCS2 · In use</small><strong>60 kW</strong></span><span><small>34 min left</small><strong>Busy</strong></span></button></div></section><section class="amenities ui-on-dark"><div><span>${icon('parking')}</span><small>Parking</small></div><div><span>${icon('coffee')}</span><small>Coffee</small></div><div><span>${icon('wifi')}</span><small>Wi‑Fi</small></div><div><span>${icon('card')}</span><small>Card pay</small></div></section><section class="location-actions"><button class="ui-button ui-button--secondary" data-favorite-station="${s.id}">${favoriteStations.has(s.id)?'★ Saved':'☆ Save location'}</button><button class="ui-button ui-button--secondary" data-start-navigation>${icon('route')} Navigate</button></section><section class="price-card"><div><small>Estimated session</small><strong>4,680 AMD</strong><p>39 kWh · approximately 31 minutes</p></div><span>Transparent pricing<br/>No connection fee</span></section><button class="primary-action reserve-action" data-reserve><span class="primary-icon">${icon('clock')}</span><span><small>Charger 04 · Today</small><strong>Reserve for 11:30</strong></span><span>${icon('chevron')}</span></button>${s.available===0?`<button class="ui-button ui-button--secondary ui-button--block" data-join-waiting-list>${waitingListJoined?'✓ Joined waiting list':'Join waiting list'}</button>`:''}`, 'Station details', 'Verified live information');
}

function reservationScreen() {
    const s = selectedStation;
    const estimate = Math.round((39 * s.price) + 500);
    const title = reservationMode === 'edit' ? 'Modify reservation' : 'Reserve charging';
    const dates = [
      {label:'Today', meta:'Wed 5', value:'Today · Wed 5'},
      {label:'Tomorrow', meta:'Thu 6', value:'Tomorrow · Thu 6'},
      {label:'Friday', meta:'Fri 7', value:'Friday · Fri 7'},
      {label:'Saturday', meta:'Sat 8', value:'Saturday · Sat 8'}
    ];
    const slotMap = {
      'Today · Wed 5': [{t:'11:15',status:'busy'},{t:'11:30',status:'recommended'},{t:'11:45',status:'available'},{t:'12:00',status:'available'},{t:'12:15',status:'busy'},{t:'12:30',status:'available'}],
      'Tomorrow · Thu 6': [{t:'09:00',status:'available'},{t:'09:30',status:'available'},{t:'10:00',status:'recommended'},{t:'10:30',status:'available'},{t:'11:00',status:'available'},{t:'11:30',status:'busy'}],
      'Friday · Fri 7': [{t:'10:00',status:'available'},{t:'10:30',status:'available'},{t:'11:00',status:'available'},{t:'11:30',status:'recommended'},{t:'12:00',status:'available'},{t:'12:30',status:'available'}],
      'Saturday · Sat 8': [{t:'12:00',status:'busy'},{t:'12:30',status:'available'},{t:'13:00',status:'recommended'},{t:'13:30',status:'available'},{t:'14:00',status:'available'},{t:'14:30',status:'available'}]
    };
    const slots = slotMap[reservation.date] || slotMap['Today · Wed 5'];
    const steps = `<div class="stepper"><span class="${reservationStep >= 1 ? 'active' : ''}">1</span><i></i><span class="${reservationStep >= 2 ? 'active' : ''}">2</span><i></i><span class="${reservationStep >= 3 ? 'active' : ''}">3</span></div>`;
    if (reservationStep === 1) {
        return layout(`<button class="ui-back ui-back--inline" data-back-reservation>${icon('back')}</button>${steps}${reservationMessage?`<div class="ui-feedback ui-feedback--error">${reservationMessage}</div>`:''}<section class="flow-card"><small>Reservation type</small><h2>What do you want to reserve?</h2><div class="choice-list"><button data-res-type="Any available charger" class="${reservation.type === 'Any available charger' ? 'selected' : ''}"><span>${icon('zap')}</span><div><strong>Any available charger</strong><small>Best compatible charger is assigned when you arrive</small></div><b>›</b></button><button data-res-type="Specific charger" class="${reservation.type === 'Specific charger' ? 'selected' : ''}"><span>${icon('plug')}</span><div><strong>Specific charger</strong><small>Keep charger ${reservation.charger} reserved for your vehicle</small></div><b>›</b></button><button data-res-type="Parking bay" class="${reservation.type === 'Parking bay' ? 'selected' : ''}"><span>${icon('parking')}</span><div><strong>Parking bay</strong><small>Reserve bay ${reservation.bay} with charger access</small></div><b>›</b></button></div></section><section class="flow-card"><small>Vehicle</small><h2>Charging for</h2><div class="reservation-vehicle-grid">${vehicles.map(v=>`<button class="vehicle-choice ${reservation.vehicle===v.name?'selected':''}" data-res-vehicle="${v.name}"><span class="mini-car">${icon('car')}</span><span><strong>${v.name}</strong><small>${v.plate} · ${v.connector} · ${v.battery}%</small></span><b>${reservation.vehicle===v.name?'✓':icon('chevron')}</b></button>`).join('')}</div></section><button class="primary-action" data-next-step><span class="primary-icon">${icon('chevron')}</span><span><small>Step 1 of 3</small><strong>Continue to schedule</strong></span><span>${icon('chevron')}</span></button>`, title, s.name);
    }
    if (reservationStep === 2) {
        return layout(`<button class="ui-back ui-back--inline" data-prev-step>${icon('back')}</button>${steps}<section class="flow-card"><small>Arrival</small><h2>Choose your charging window</h2><div class="date-pills reservation-dates">${dates.map(d=>`<button data-res-date="${d.value}" class="${reservation.date===d.value?'active':''}">${d.label}<small>${d.meta}</small></button>`).join('')}</div><div class="slot-heading"><span>Available times</span><small>Grey slots are unavailable</small></div><div class="time-grid reservation-slots">${slots.map(x=>`<button data-time="${x.t}" ${x.status==='busy'?'disabled':''} class="${reservation.time===x.t?'active':''} ${x.status}">${x.t}${x.status==='recommended'?'<small>Best</small>':''}</button>`).join('')}</div><div class="range-block-card"><div><span>Expected duration</span><strong id="duration-value">${reservation.duration} min</strong></div><input data-duration type="range" min="20" max="120" step="5" value="${reservation.duration}"></div><div class="range-block-card"><div><span>Target battery</span><strong id="target-value">${reservation.target}%</strong></div><input data-target type="range" min="70" max="100" step="5" value="${reservation.target}"></div></section><section class="smart-note"><span>${icon('sparkle')}</span><div><strong>Smart scheduling</strong><p>${reservation.time} is compatible with your selected duration. Arrival grace period is ${graceMinutes} minutes.</p></div></section><button class="primary-action" data-next-step><span class="primary-icon">${icon('clock')}</span><span><small>Step 2 of 3</small><strong>Review reservation</strong></span><span>${icon('chevron')}</span></button>`, title, 'Select date, time and target');
    }
    return layout(`<button class="ui-back ui-back--inline" data-prev-step>${icon('back')}</button>${steps}<section class="confirmation-hero"><span>${icon('shield')}</span><small>${reservationMode==='edit'?'Review your changes':'Review before confirming'}</small><h2>${s.name}</h2><p>${s.address}</p></section><section class="summary-card"><div><span>Vehicle</span><strong>${reservation.vehicle}</strong><small>${vehicles.find(v=>v.name===reservation.vehicle)?.plate||'35 GG 505'}</small></div><div><span>Reservation</span><strong>${reservation.type}</strong><small>${reservation.type==='Any available charger'?'Assigned on arrival':`Charger ${reservation.charger} · Bay ${reservation.bay}`}</small></div><div><span>Arrival</span><strong>${reservation.date}, ${reservation.time}</strong><small>${reservation.duration} min · Target ${reservation.target}%</small></div></section><section class="cost-card"><div><span>Estimated charging</span><strong>${(estimate-500).toLocaleString()} AMD</strong></div><div><span>${reservationMode==='edit'?'Change fee':'Reservation fee'}</span><strong>${reservationMode==='edit'?'0':'500'} AMD</strong></div><div class="total"><span>Estimated total</span><strong>${(reservationMode==='edit'?estimate-500:estimate).toLocaleString()} AMD</strong></div><small>Free cancellation until 30 minutes before arrival. Grace period: ${graceMinutes} minutes.</small></section><label class="terms-row"><input type="checkbox" ${reservationTermsAccepted?'checked':''} data-terms><span>I accept cancellation rules, idle fees and station access terms.</span></label>${reservationMessage?`<div class="ui-feedback ui-feedback--error">${reservationMessage}</div>`:''}<button class="primary-action" data-confirm-reservation><span class="primary-icon">${icon('shield')}</span><span><small>Step 3 of 3</small><strong>${reservationMode==='edit'?'Save reservation changes':'Confirm reservation'}</strong></span><span>${icon('chevron')}</span></button>`, title, 'Transparent pricing and conditions');
}
function reservationSuccessScreen() {
    const s = selectedStation;
    return layout(`<section class="success-card"><div class="success-ring">✓</div><small>${reservationMode==='edit'?'Reservation updated':'Reservation confirmed'}</small><h2>${s.name}</h2><p>${reservation.date}, ${reservation.time} · ${reservation.type==='Any available charger'?'Charger assigned on arrival':`Charger ${reservation.charger}`}</p><div class="qr-mock"><span></span><span></span><span></span><span></span><b>${activeReservation?.id||'Pending'}</b></div><div class="success-meta"><div><small>Parking bay</small><strong>${reservation.bay}</strong></div><div><small>Grace period</small><strong>${graceMinutes} min</strong></div><div><small>Vehicle</small><strong>${vehicles.find(v=>v.name===reservation.vehicle)?.plate||'35 GG 505'}</strong></div></div></section><button class="primary-action" data-open-reservation-manage><span class="primary-icon">${icon('clock')}</span><span><small>Reservation ${activeReservation?.id||'Pending'}</small><strong>View reservation</strong></span><span>${icon('chevron')}</span></button><div class="quick-grid"><button class="quick-card" data-start-navigation><span class="quick-icon">${icon('route')}</span><span><small>Directions</small><strong>Navigate</strong></span></button><button class="quick-card" data-modify-reservation><span class="quick-icon">${icon('clock')}</span><span><small>Reservation</small><strong>Modify</strong></span></button></div>`, 'All set', 'Your charger is waiting');
}
function reservationManageScreen() {
    const r = activeReservation || {...reservation,id:'VD-RS-8452',status:'Confirmed'};
    return simpleHeaderBack('Reservation details',`${r.id} · ${r.status}`, `${reservationMessage?`<div class="ui-feedback ui-feedback--success">${reservationMessage}</div>`:''}<section class="reservation-status-card ui-surface--dark"><div><small>Arrival window</small><h2>${r.date}, ${r.time}</h2><p>${selectedStation.name} · Charger ${r.charger} · Bay ${r.bay}</p></div><span class="reservation-countdown"><small>Starts in</small><strong>18 min</strong></span></section><section class="grace-card"><div class="grace-ring"><strong>${graceMinutes}</strong><small>min</small></div><div><small>Arrival grace period</small><h2>Your charger stays protected</h2><p>Confirm arrival before ${r.time.replace(/(\d+):(\d+)/,(m,h,mi)=>`${h}:${String(Number(mi)+graceMinutes).padStart(2,'0')}`)} or the reservation may become a no-show.</p></div></section><section class="ui-card reservation-detail-list"><div><span>Vehicle</span><strong>${r.vehicle}</strong></div><div><span>Reservation type</span><strong>${r.type}</strong></div><div><span>Expected duration</span><strong>${r.duration} min</strong></div><div><span>Target battery</span><strong>${r.target}%</strong></div><div><span>Reservation fee</span><strong>500 AMD</strong></div></section><button class="ui-button ui-button--primary ui-button--block" data-confirm-arrival>I'm at the station</button><div class="reservation-action-grid"><button class="ui-button ui-button--secondary" data-modify-reservation>Modify</button><button class="ui-button ui-button--danger" data-cancel-reservation>Cancel reservation</button></div><button class="ui-text-button reservation-demo-link" data-simulate-no-show>Prototype: simulate no-show</button>`, 'home');
}
function cancelReservationScreen() {
    const fee = cancellationReason === 'Charger unavailable' ? 0 : 500;
    return simpleHeaderBack('Cancel reservation','Review cancellation conditions', `<section class="ui-card cancel-summary"><small>Reservation ${activeReservation?.id||'Pending'}</small><h2>${selectedStation.name}</h2><p>${reservation.date}, ${reservation.time} · Charger ${reservation.charger}</p></section><section class="ui-card ui-form"><label><span>Reason for cancellation</span><select id="cancel-reason"><option ${cancellationReason==='Plans changed'?'selected':''}>Plans changed</option><option ${cancellationReason==='Running late'?'selected':''}>Running late</option><option ${cancellationReason==='Found another charger'?'selected':''}>Found another charger</option><option ${cancellationReason==='Charger unavailable'?'selected':''}>Charger unavailable</option></select></label></section><section class="cost-card"><div><span>Reservation fee paid</span><strong>500 AMD</strong></div><div><span>Refund</span><strong>${fee===0?'500':'0'} AMD</strong></div><div class="total"><span>Cancellation fee</span><strong>${fee} AMD</strong></div><small>Free cancellation is available until 30 minutes before the scheduled arrival.</small></section><button class="ui-button ui-button--danger ui-button--block" data-confirm-cancel>Confirm cancellation</button>`, 'reservation-manage');
}
function waitingListScreen() {
    const alternatives = stations.filter(s=>s.id!==selectedStation.id && s.available>0).slice(0,2);
    return simpleHeaderBack('Waiting list',selectedStation.name, `<section class="waiting-hero ui-surface--dark"><small>Your position</small><strong>#${waitingPosition}</strong><h2>We’ll alert you when a charger is ready</h2><p>Estimated wait: 18–26 minutes. You have 5 minutes to accept an offered charger.</p></section><section class="ui-card waiting-preferences"><div><span>Vehicle</span><strong>${reservation.vehicle}</strong></div><div><span>Minimum power</span><strong>120 kW</strong></div><div><span>Maximum distance</span><strong>8 km</strong></div></section><section class="account-section"><div class="section-heading"><div><small>Available now</small><h2>Alternative stations</h2></div></div><div class="map-results-list">${alternatives.map(a=>`<article class="map-result-card"><button class="map-result-main" data-use-alternative="${a.id}"><span class="map-result-status status-available">${a.available}</span><span><strong>${a.name}</strong><em>${a.address}</em></span><span class="map-result-meta"><strong>${a.distance}</strong><em>${a.power} kW · ${a.price} AMD/kWh</em></span></button></article>`).join('')}</div></section><button class="ui-button ui-button--danger ui-button--block" data-leave-waiting-list>Leave waiting list</button>`, 'location');
}
function noShowScreen() {
    return simpleHeaderBack('Reservation expired','No-show recorded', `<section class="auth-result no-show-result"><div class="auth-result-icon">!</div><h2>Your arrival window ended</h2><p>Reservation ${activeReservation?.id||'VD-RS-8452'} was released after the ${graceMinutes}-minute grace period.</p></section><section class="ui-card"><div class="section-heading"><div><small>Next steps</small><h2>Continue charging today</h2></div></div><p class="section-copy">We found another compatible charger nearby. You can reserve it immediately or return to the map.</p></section><button class="ui-button ui-button--primary ui-button--block" data-use-alternative="5">Reserve Komitas Fast Lane</button><button class="ui-button ui-button--secondary ui-button--block" data-back-map>Return to map</button>`, 'home');
}



function parkingMonitorScreen() {
    const idle = parkingSession.stage === 'idle';
    const grace = parkingSession.stage === 'grace';
    const title = grace ? 'Move your vehicle soon' : idle ? 'Idle fee is active' : 'Parking extended';
    const value = grace ? `${parkingSession.graceMinutes}:00` : idle ? `${parkingSession.idleCost.toLocaleString()} AMD` : `${parkingSession.extensionMinutes} min`;
    const label = grace ? 'Free grace period remaining' : idle ? `${parkingSession.idleMinutes} min · 50 AMD/min` : 'Additional parking time';
    return layout(`<section class="parking-status-hero ${idle?'is-idle':''}"><span class="parking-status-icon">${icon('parking')}</span><small>${selectedStation.name} · Bay ${parkingSession.bay}</small><h2>${title}</h2><div class="parking-status-value"><strong>${value}</strong><span>${label}</span></div><p>${grace?'Charging is complete. Unplug and move your vehicle before the grace period ends.':idle?'Your vehicle is still occupying the charging bay. The fee increases every minute.':'Your bay remains reserved during the extension period.'}</p></section>${parkingSession.message?`<div class="ui-feedback ui-feedback--success">${parkingSession.message}</div>`:''}<section class="ui-card parking-session-details"><div><small>Charging session</small><strong>${latestCompletedSessionId}</strong></div><div><small>Vehicle</small><strong>${(vehicles.find(v=>v.active)||vehicles[0]).name} · ${(vehicles.find(v=>v.active)||vehicles[0]).plate}</strong></div><div><small>Parking bay</small><strong>${parkingSession.bay}</strong></div><div><small>Idle tariff</small><strong>50 AMD/min</strong></div></section><section class="parking-warning"><span>!</span><div><strong>Keep the bay available for other drivers</strong><p>Disconnect the cable, close the charging port and leave the marked bay.</p></div></section>${grace?`<button class="ui-button ui-button--primary ui-button--block" data-parking-complete>I moved my vehicle</button><button class="ui-button ui-button--secondary ui-button--block" data-extend-parking>Extend parking</button><button class="ui-text-button ui-button--block" data-simulate-idle>Prototype: grace period ends</button>`:idle?`<button class="ui-button ui-button--primary ui-button--block" data-parking-complete>Stop idle fee — vehicle moved</button><button class="ui-button ui-button--secondary ui-button--block" data-extend-parking>Request parking extension</button>`:`<button class="ui-button ui-button--primary ui-button--block" data-parking-complete>I moved my vehicle</button><button class="ui-text-button ui-button--block" data-simulate-idle>Prototype: extension ends</button>`}`, 'Parking session', grace?'Grace period active':idle?'Idle fee running':'Extension active');
}
function parkingExtendScreen() {
    return simpleHeaderBack('Extend parking','Keep the charging bay reserved for a little longer', `<section class="ui-card parking-extension-options"><button class="${parkingSession.extensionMinutes===15?'is-selected':''}" data-parking-extension="15"><span><small>Short extension</small><strong>15 minutes</strong></span><b>750 AMD</b></button><button class="${parkingSession.extensionMinutes===30?'is-selected':''}" data-parking-extension="30"><span><small>Recommended</small><strong>30 minutes</strong></span><b>1,500 AMD</b></button><button class="${parkingSession.extensionMinutes===60?'is-selected':''}" data-parking-extension="60"><span><small>Maximum extension</small><strong>60 minutes</strong></span><b>3,000 AMD</b></button></section><section class="cost-card"><div><span>Extension</span><strong>${parkingSession.extensionMinutes} min</strong></div><div><span>Parking rate</span><strong>50 AMD/min</strong></div><div class="total"><span>Total</span><strong>${(parkingSession.extensionMinutes*50).toLocaleString()} AMD</strong></div><small>Extension depends on site availability and does not include additional energy.</small></section><button class="ui-button ui-button--primary ui-button--block" data-confirm-parking-extension>Confirm extension</button>`, 'parking-monitor');
}
function parkingCompleteScreen() {
    return layout(`<section class="summary-success"><div class="summary-check">✓</div><small>Parking session completed</small><h2>Thank you for moving your vehicle</h2><p>${selectedStation.name} · Bay ${parkingSession.bay}</p><div class="summary-battery"><strong>${parkingSession.idleCost.toLocaleString()} AMD</strong><span>${parkingSession.idleCost?'Idle fee charged':'No idle fee charged'}</span></div></section><section class="ui-card"><div class="detail-lines"><div><span>Charging receipt</span><strong>${latestReceiptId}</strong></div><div><span>Parking duration after charge</span><strong>${parkingSession.idleMinutes || 4} min</strong></div><div><span>Idle fee</span><strong>${parkingSession.idleCost.toLocaleString()} AMD</strong></div></div></section><button class="ui-button ui-button--primary ui-button--block" data-parking-home>Return to home</button><button class="ui-button ui-button--secondary ui-button--block" data-open-activity>View session in Activity</button>`, 'Parking complete', 'Charging bay released');
}
function chargeStartScreen() {
    return layout(`<section class="charge-start-hero ui-surface--dark"><span class="charge-start-icon">${icon('qr')}</span><small>Quick start</small><h2>Connect to a charger</h2><p>Scan the QR code on the charger or enter its code manually.</p></section>${chargeStartMessage?`<div class="ui-feedback ui-feedback--error">${chargeStartMessage}</div>`:''}<button class="ui-button ui-button--primary ui-button--block" data-begin-scan>${icon('qr')} Scan charger QR</button><section class="ui-card ui-form"><label><span>Charger code</span><input id="charger-code" value="${startCharge.code}" placeholder="Example: VD-04-CCS2"></label><button class="ui-button ui-button--secondary ui-button--block" data-check-code>Check charger</button></section>${appState==='reserved'?`<section class="ui-card reserved-start-card"><small>Active reservation</small><h2>Charger 04 is waiting</h2><p>${selectedStation.name} · Bay ${reservation.bay}</p><button class="ui-text-button" data-use-reserved-charger>Use reserved charger</button></section>`:''}<section class="start-help"><button data-open-support>Need help?</button><button data-report-problem>Charger problem</button></section>`, 'Start charging', 'Scan, verify and connect');
}
function chargeScanScreen() {
    return simpleHeaderBack('Scan charger','Point your camera at the QR code', `<section class="scanner-frame ui-surface--dark"><div class="scanner-corners"></div><div class="scanner-line"></div><span>${icon('qr')}</span><small>Camera preview prototype</small></section><section class="ui-card scanner-instructions"><div><span>1</span><p>Find the QR label near the connector.</p></div><div><span>2</span><p>Keep the code inside the frame.</p></div><div><span>3</span><p>We verify the charger before payment.</p></div></section><button class="ui-button ui-button--primary ui-button--block" data-simulate-scan>Simulate QR detected</button>`, 'charge-start');
}
function chargerCheckScreen() {
    const s=selectedStation;
    return simpleHeaderBack('Charger verified','Live status checked moments ago', `<section class="verified-charger ui-surface--dark"><div class="verified-mark">✓</div><small>${s.name}</small><h2>Charger ${startCharge.connector}</h2><p>${s.address}</p><div class="verified-grid"><div><small>Status</small><strong>Available</strong></div><div><small>Connector</small><strong>CCS2</strong></div><div><small>Maximum power</small><strong>${startCharge.connector==='04'?'180':'120'} kW</strong></div><div><small>Price</small><strong>${startCharge.connector==='04'?s.price:110} AMD/kWh</strong></div></div></section><section class="ui-card safety-check"><div class="section-heading"><div><small>Before continuing</small><h2>Connect your vehicle</h2></div></div><div class="safety-row"><span>✓</span><p>Park fully inside bay ${reservation.bay || 'B-12'}.</p></div><div class="safety-row"><span>✓</span><p>Insert the CCS2 connector until it locks.</p></div><div class="safety-row"><span>✓</span><p>Charging starts only after payment authorization.</p></div></section><button class="ui-button ui-button--primary ui-button--block" data-connector-ready>Vehicle connected</button><button class="ui-text-button ui-button--block" data-start-error="vehicle">Prototype: vehicle not connected</button>`, 'charge-start');
}
function connectorSelectScreen() {
    return simpleHeaderBack('Choose connector','Only compatible connectors are shown', `<section class="ui-card"><div class="connector-choice-list"><button class="connector-choice ${startCharge.connector==='04'?'is-selected':''}" data-select-start-connector="04"><span class="charger-number">04</span><span><small>CCS2 · Available</small><strong>180 kW Ultra-fast</strong><em>120 AMD/kWh</em></span><b>${startCharge.connector==='04'?'✓':'›'}</b></button><button class="connector-choice ${startCharge.connector==='07'?'is-selected':''}" data-select-start-connector="07"><span class="charger-number">07</span><span><small>CCS2 · Available</small><strong>120 kW Fast</strong><em>110 AMD/kWh</em></span><b>${startCharge.connector==='07'?'✓':'›'}</b></button></div></section><section class="ui-card compatibility-note"><span>${icon('car')}</span><div><small>Active vehicle</small><strong>Tesla Model Y</strong><p>CCS2 compatible · Battery 64%</p></div></section><button class="ui-button ui-button--primary ui-button--block" data-confirm-connector>Continue with connector ${startCharge.connector}</button>`, 'charger-check');
}
function paymentAuthorizeScreen() {
    return simpleHeaderBack('Authorize payment','No charge is made until the session starts', `<section class="payment-preauth ui-surface--dark"><small>Temporary authorization</small><strong>${startCharge.preauth.toLocaleString()} AMD</strong><p>The final amount is calculated from actual energy, time and applicable fees.</p></section><section class="ui-card"><div class="section-heading"><div><small>Payment source</small><h2>Choose how to pay</h2></div></div><button class="payment-source ${startCharge.payment==='Wallet'?'is-selected':''}" data-start-payment="Wallet"><span class="ui-list-icon">${icon('wallet')}</span><span><small>Balance ${walletBalance.toLocaleString()} AMD</small><strong>VoltDrive Wallet</strong></span><b>${startCharge.payment==='Wallet'?'✓':'›'}</b></button><button class="payment-source ${startCharge.payment==='Visa •••• 5050'?'is-selected':''}" data-start-payment="Visa •••• 5050"><span class="ui-list-icon">${icon('card')}</span><span><small>Expires 08/29</small><strong>Visa •••• 5050</strong></span><b>${startCharge.payment==='Visa •••• 5050'?'✓':'›'}</b></button></section><section class="ui-card payment-protection"><span>${icon('shield')}</span><div><strong>Protected authorization</strong><p>Payment data is tokenized and is not shared with the charger.</p></div></section><button class="ui-button ui-button--primary ui-button--block" data-authorize-payment>Authorize ${startCharge.preauth.toLocaleString()} AMD</button><button class="ui-text-button ui-button--block" data-start-error="payment">Prototype: payment declined</button>`, 'connector-select');
}
function tariffReviewScreen() {
    const price=startCharge.connector==='04'?selectedStation.price:110;
    return simpleHeaderBack('Review and start','Confirm pricing before energy begins', `<section class="ui-card start-session-summary"><div><small>Station</small><strong>${selectedStation.name}</strong></div><div><small>Charger</small><strong>${startCharge.connector} · CCS2</strong></div><div><small>Vehicle</small><strong>Tesla Model Y</strong></div><div><small>Payment</small><strong>${startCharge.payment}</strong></div></section><section class="cost-card"><div><span>Energy tariff</span><strong>${price} AMD/kWh</strong></div><div><span>Connection fee</span><strong>0 AMD</strong></div><div><span>Idle fee</span><strong>50 AMD/min</strong></div><div><span>Reservation fee</span><strong>${appState==='reserved'?'Paid':'0 AMD'}</strong></div><div class="total"><span>Estimated to 90%</span><strong>3,816 AMD</strong></div><small>Idle fees begin 10 minutes after charging completes.</small></section><label class="form-check start-terms"><input class="form-check-input" type="checkbox" data-start-terms ${startCharge.accepted?'checked':''}><span class="form-check-label">I accept the displayed tariff and charging conditions.</span></label><button class="ui-button ui-button--primary ui-button--block" data-start-session>Start charging</button>`, 'payment-authorize');
}
function chargeConnectingScreen() {
    return layout(`<section class="connecting-stage ui-surface--dark"><div class="connecting-orbit"><span>${icon('zap')}</span></div><small>Charger ${startCharge.connector}</small><h2>${startCharge.stage==='starting'?'Starting energy flow':'Preparing charger'}</h2><p>Authorizing vehicle, locking the cable and checking electrical safety.</p><div class="connecting-steps"><span class="done">✓ Payment authorized</span><span class="done">✓ Cable detected</span><span class="${startCharge.stage==='starting'?'done':'active'}">${startCharge.stage==='starting'?'✓':'•'} Safety handshake</span><span class="${startCharge.stage==='starting'?'active':''}">• Start energy delivery</span></div></section><button class="ui-button ui-button--primary ui-button--block" data-finish-connecting>${startCharge.stage==='starting'?'Open active charging':'Continue connection'}</button><button class="ui-text-button ui-button--block" data-start-error="offline">Prototype: charger goes offline</button>`, 'Connecting', 'Keep the cable connected');
}
function chargeStartErrorScreen() {
    const errors={vehicle:{title:'Vehicle not connected',body:'The charger cannot detect a locked connector. Reinsert the cable firmly and try again.',action:'Try connection again'},payment:{title:'Payment authorization failed',body:'The selected payment source could not authorize 5,000 AMD. Choose another method or add funds.',action:'Change payment method'},offline:{title:'Charger went offline',body:'Charger '+startCharge.connector+' stopped responding before energy delivery began. No charging payment was taken.',action:'Choose another charger'}};
    const e=errors[startCharge.error]||errors.offline;
    return simpleHeaderBack('Unable to start','Your vehicle has not been charged', `<section class="start-error-card"><div class="start-error-icon">!</div><h2>${e.title}</h2><p>${e.body}</p></section><section class="ui-card"><div class="detail-lines"><div><span>Station</span><strong>${selectedStation.name}</strong></div><div><span>Charger</span><strong>${startCharge.connector}</strong></div><div><span>Payment status</span><strong>${startCharge.error==='payment'?'Declined':'Not charged'}</strong></div></div></section><button class="ui-button ui-button--primary ui-button--block" data-retry-start>${e.action}</button><button class="ui-button ui-button--secondary ui-button--block" data-back-map>Find another charger</button><button class="ui-text-button ui-button--block" data-open-support>Contact support</button>`, startCharge.error==='payment'?'payment-authorize':'charge-start');
}

function chargingScreen() {
    const circumference = 339.3;
    const progress = Math.max(0, Math.min(1, (charging.battery - 20) / (charging.target - 20)));
    const dash = (circumference * progress).toFixed(1);
    return layout(`<section class="charging-stage ui-surface--dark"><div class="charging-pulse"></div><div class="charging-ring"><svg viewBox="0 0 120 120" aria-label="Battery ${charging.battery} percent"><circle class="ring-base" cx="60" cy="60" r="54"></circle><circle class="ring-value" cx="60" cy="60" r="54" style="stroke-dasharray:${dash} ${circumference}"></circle></svg><div class="ring-copy"><small>${charging.paused ? 'Charging paused' : 'Charging now'}</small><strong>${charging.battery}<span>%</span></strong><p>Target ${charging.target}%</p></div></div><div class="energy-link"><span>Charger 04</span><i></i><b>${icon('zap')}</b><i></i><span>Model Y</span></div></section><section class="charging-metrics ui-surface--dark"><div><small>Power</small><strong>${charging.paused ? '0' : charging.power} <span>kW</span></strong></div><div><small>Delivered</small><strong>${charging.energy.toFixed(1)} <span>kWh</span></strong></div><div><small>Current cost</small><strong>${charging.cost.toLocaleString()} <span>AMD</span></strong></div><div><small>Remaining</small><strong>${charging.remaining} <span>min</span></strong></div></section><section class="info-card charging-details"><div class="section-heading"><div><small>Session details</small><h2>Northern Avenue Hub</h2></div><span class="distance-pill">CCS2</span></div><div class="detail-lines"><div><span>Started</span><strong>11:42</strong></div><div><span>Charging limit</span><strong>${charging.target}%</strong></div><div><span>Charging speed</span><strong>${charging.speed}</strong></div><div><span>Idle fee starts</span><strong>12:38</strong></div></div></section><section class="charge-curve"><div class="section-heading"><div><small>Live charging curve</small><h2>Power delivery</h2></div><strong>${charging.paused ? '0' : charging.power} kW</strong></div><div class="curve-bars">${[56,72,88,96,93,84,76,68,59,51,43,36].map((h,i)=>`<i style="height:${h}%" class="${i<6?'active':''}"></i>`).join('')}</div><div class="curve-axis"><span>Start</span><span>Now</span><span>Target</span></div></section><section class="charge-controls"><button data-charge-limit><span>${icon('zap')}</span><small>Limit</small><strong>${charging.target}%</strong></button><button data-charge-speed><span>≋</span><small>Speed</small><strong>${charging.speed}</strong></button><button data-toggle-pause><span>${charging.paused ? '▶' : 'Ⅱ'}</span><small>${charging.paused ? 'Resume' : 'Pause'}</small><strong>Session</strong></button></section><button class="danger-action" data-stop-charge><span>■</span><div><small>End current session</small><strong>Stop charging</strong></div></button><section class="support-row"><button data-open-support>Contact support</button><button data-report-problem>Report a problem</button></section>`, 'Active charging', `${charging.remaining} minutes to ${charging.target}%`);
}
function chargingSummaryScreen() {
    const vehicle=vehicles.find(v=>v.active)||vehicles[0];
    const completed=sessions.find(x=>x.id===latestCompletedSessionId);
    return layout(`<section class="summary-success"><div class="summary-check">✓</div><small>Charging completed</small><h2>Your vehicle is ready</h2><p>${vehicle.name} · ${vehicle.plate}</p><div class="summary-battery"><strong>${chargingSummary.endBattery}%</strong><span>Estimated range ${Math.round(chargingSummary.endBattery*5.41)} km</span></div></section><section class="session-summary-grid"><div><small>Energy delivered</small><strong>${chargingSummary.energy} kWh</strong></div><div><small>Duration</small><strong>${chargingSummary.duration} min</strong></div><div><small>Average power</small><strong>44.4 kW</strong></div><div><small>Total paid</small><strong>${chargingSummary.cost.toLocaleString()} AMD</strong></div></section><section class="info-card receipt-card"><div class="section-heading"><div><small>Session receipt</small><h2>${latestCompletedSessionId}</h2></div><span class="distance-pill">Paid</span></div><div class="detail-lines"><div><span>Energy</span><strong>3,816 AMD</strong></div><div><span>Reservation fee</span><strong>500 AMD</strong></div><div><span>Promo credit</span><strong>−500 AMD</strong></div><div class="receipt-total"><span>Total charged</span><strong>${chargingSummary.cost.toLocaleString()} AMD</strong></div></div></section><section class="insight-card"><span>${icon('sparkle')}</span><div><strong>Charging insight</strong><p>You added 26% battery. This session was 12% faster than your recent average.</p></div></section><button class="primary-action" data-summary-home><span class="primary-icon">${icon('home')}</span><span><small>Session saved to Activity</small><strong>Return to home</strong></span><span>${icon('chevron')}</span></button><div class="quick-grid"><button class="quick-card" data-view-latest-receipt><span class="quick-icon">${icon('card')}</span><span><small>Payment</small><strong>View receipt</strong></span></button><button class="quick-card" data-open-parking><span class="quick-icon">${icon('parking')}</span><span><small>Parking</small><strong>Move vehicle</strong></span></button></div>`, 'Charge complete', 'Payment processed successfully');
}


let activitySection = 'sessions';
let activityQuery = '';
let activityRange = '30 days';
let selectedActivityId = 'VD-CS-10852';
let activityMessage = '';
let refundReason = 'Unexpected charging interruption';
let disputeReason = 'Incorrect charging amount';

const sessions = [
    { id:'VD-CS-10852', place:'Northern Avenue Hub', address:'Northern Ave. 8, Yerevan', date:'Today, 12:25', started:'11:42', ended:'12:25', energy:31.8, cost:3816, status:'Completed', charger:'04', connector:'CCS2', vehicle:'Tesla Model Y · 35 GG 505', startBattery:64, endBattery:90, averagePower:'44.4 kW', peakPower:'142 kW', paymentId:'PAY-50821', receipt:'RC-10852' },
    { id:'VD-CS-10794', place:'Cascade Charge Point', address:'Tamanyan St. 10, Yerevan', date:'2 Aug, 18:40', started:'18:09', ended:'18:40', energy:18.2, cost:2146, status:'Completed', charger:'07', connector:'CCS2', vehicle:'Tesla Model Y · 35 GG 505', startBattery:42, endBattery:61, averagePower:'35.2 kW', peakPower:'118 kW', paymentId:'PAY-50172', receipt:'RC-10794' },
    { id:'VD-CS-10688', place:'Republic Square Station', address:'Abovyan St. 1, Yerevan', date:'29 Jul, 09:15', started:'09:14', ended:'09:15', energy:0, cost:0, status:'Failed', charger:'02', connector:'CCS2', vehicle:'BMW i4 · 40 AA 404', startBattery:28, endBattery:28, averagePower:'0 kW', peakPower:'0 kW', paymentId:'PAY-49308', receipt:'' }
];
const activityReservations = [
    {id:'VD-RS-8452', place:'Northern Avenue Hub', date:'Today, 11:30', status:'Confirmed', bay:'B-12', charger:'04', fee:500, vehicle:'Tesla Model Y · 35 GG 505'},
    {id:'VD-RS-8328', place:'Dalma Garden Garage', date:'30 Jul, 14:00', status:'Cancelled', bay:'A-03', charger:'Any', fee:500, refund:500, vehicle:'Tesla Model Y · 35 GG 505'}
];
const activityPayments = [
    {id:'PAY-50821', date:'Today, 12:26', title:'Charging payment', method:'Visa •••• 5050', amount:3816, status:'Paid', sessionId:'VD-CS-10852'},
    {id:'PAY-50172', date:'2 Aug, 18:41', title:'Charging payment', method:'Wallet balance', amount:2146, status:'Paid', sessionId:'VD-CS-10794'},
    {id:'RF-48310', date:'30 Jul, 14:05', title:'Reservation refund', method:'Wallet balance', amount:500, status:'Refunded', reservationId:'VD-RS-8328'}
];

function nextRecordId(prefix, collection){
    const max=collection.reduce((m,item)=>{ const n=Number(String(item.id||'').replace(/\D/g,'')); return Number.isFinite(n)?Math.max(m,n):m; },0);
    return `${prefix}-${max+1}`;
}
function addSystemNotification(title,text,type='success',target='session-detail',actionLabel='Open details'){
    const id=notifications.reduce((m,n)=>Math.max(m,Number(n.id)||0),0)+1;
    notifications.unshift({id,group:'Today',time:'Just now',title,text,type,icon:type==='payment'?'▭':type==='reserved'?'R':'✓',unread:true,target,actionLabel});
}
function finalizeChargingSession(){
    const vehicle=vehicles.find(v=>v.active)||vehicles[0];
    const sessionId=nextRecordId('VD-CS',sessions);
    const paymentId=nextRecordId('PAY',activityPayments);
    const receiptId=nextRecordId('RC',sessions.map(x=>({id:x.receipt||''})));
    const paid=chargingSummary.cost;
    if(startCharge.payment==='Wallet') walletBalance=Math.max(0,walletBalance-paid);
    vehicle.battery=chargingSummary.endBattery;
    const now='Today, 12:25';
    sessions.unshift({id:sessionId,place:selectedStation.name,address:selectedStation.address,date:now,started:'11:42',ended:'12:25',energy:chargingSummary.energy,cost:paid,status:'Completed',charger:startCharge.connector,connector:selectedStation.connector||'CCS2',vehicle:`${vehicle.name} · ${vehicle.plate}`,startBattery:chargingSummary.startBattery,endBattery:chargingSummary.endBattery,averagePower:'44.4 kW',peakPower:`${charging.power} kW`,paymentId,receipt:receiptId});
    activityPayments.unshift({id:paymentId,date:'Today, 12:26',title:'Charging payment',method:startCharge.payment==='Wallet'?'Wallet balance':startCharge.payment,amount:paid,status:'Paid',sessionId});
    latestCompletedSessionId=sessionId; latestPaymentId=paymentId; latestReceiptId=receiptId;
    activeReservation=null; appState='completed';
    addSystemNotification('Charging completed',`${vehicle.name} reached ${chargingSummary.endBattery}%. ${paid.toLocaleString()} AMD was paid.`,'success','session-detail','View session');
    addSystemNotification('Payment successful',`${paid.toLocaleString()} AMD · ${paymentId}`,'payment','payment-detail','View payment');
}
function finalizeParkingSession(){
    if(parkingSession.idleCost>0){
      const paymentId=nextRecordId('PAY',activityPayments);
      if(startCharge.payment==='Wallet') walletBalance=Math.max(0,walletBalance-parkingSession.idleCost);
      activityPayments.unshift({id:paymentId,date:'Just now',title:'Idle fee',method:startCharge.payment==='Wallet'?'Wallet balance':startCharge.payment,amount:parkingSession.idleCost,status:'Paid',sessionId:latestCompletedSessionId});
      latestPaymentId=paymentId;
      addSystemNotification('Idle fee paid',`${parkingSession.idleCost.toLocaleString()} AMD · Bay ${parkingSession.bay}`,'payment','payment-detail','View payment');
    }
}
function cancelActiveReservation(){
    const refund=500;
    walletBalance+=refund;
    const id=nextRecordId('RF',activityPayments);
    activityPayments.unshift({id,date:'Just now',title:'Reservation refund',method:'Wallet balance',amount:refund,status:'Refunded',reservationId:activeReservation?.id||'VD-RS-8452'});
    activityReservations.unshift({id:activeReservation?.id||'VD-RS-8452',place:selectedStation.name,date:`${reservation.date}, ${reservation.time}`,status:'Cancelled',bay:reservation.bay,charger:reservation.charger,fee:500,refund,vehicle:reservation.vehicle});
    addSystemNotification('Reservation cancelled',`${refund.toLocaleString()} AMD returned to your Wallet.`,'payment','payment-detail','View refund');
    activeReservation=null; appState='idle';
}
function activityMatches(value){ return !activityQuery || value.toLowerCase().includes(activityQuery.toLowerCase()); }
function activityToolbar(){
    return `<section class="activity-tools"><label class="activity-search"><span>${icon('search')}</span><input data-activity-search value="${activityQuery}" placeholder="Search location, ID or payment"></label><select data-activity-range aria-label="History period"><option ${activityRange==='30 days'?'selected':''}>30 days</option><option ${activityRange==='90 days'?'selected':''}>90 days</option><option ${activityRange==='All time'?'selected':''}>All time</option></select></section>`;
}
function activityScreen(){
    const tabs=[['sessions','Sessions'],['reservations','Reservations'],['payments','Payments']];
    let body='';
    if(activitySection==='sessions'){
      const rows=sessions.filter(s=>activityMatches(`${s.place} ${s.id} ${s.status}`));
      body=`<div class="activity-list">${rows.map(s=>`<button class="activity-item" data-open-session="${s.id}"><span class="activity-status ${s.status.toLowerCase()}">${s.status==='Completed'?'✓':'!'}</span><span><small>${s.date}</small><strong>${s.place}</strong><em>${s.id}</em></span><span class="activity-value"><strong>${s.cost.toLocaleString()} AMD</strong><small>${s.energy.toFixed(1)} kWh</small></span></button>`).join('') || `<div class="activity-empty"><span>${icon('search')}</span><h2>No sessions found</h2><p>Try another search or period.</p></div>`}</div>`;
    }
    if(activitySection==='reservations'){
      const rows=activityReservations.filter(r=>activityMatches(`${r.place} ${r.id} ${r.status}`));
      body=`<div class="activity-list">${rows.map(r=>`<button class="activity-item ${r.status==='Cancelled'?'muted':''}" data-open-activity-reservation="${r.id}"><span class="activity-status ${r.status==='Confirmed'?'reserved':''}">${r.status==='Confirmed'?'R':'×'}</span><span><small>${r.date}</small><strong>${r.place}</strong><em>${r.id} · Bay ${r.bay}</em></span><span class="activity-value"><strong>${r.status}</strong><small>${r.fee.toLocaleString()} AMD</small></span></button>`).join('') || `<div class="activity-empty"><h2>No reservations found</h2></div>`}</div>`;
    }
    if(activitySection==='payments'){
      const rows=activityPayments.filter(x=>activityMatches(`${x.title} ${x.id} ${x.status}`));
      body=`<div class="payment-summary"><div><small>This month</small><strong>12,460 AMD</strong></div><div><small>Energy</small><strong>104.2 kWh</strong></div><div><small>Refunds</small><strong>500 AMD</strong></div></div><div class="activity-list">${rows.map(x=>`<button class="activity-item" data-open-payment="${x.id}"><span class="activity-status completed">${x.status==='Refunded'?'↺':'✓'}</span><span><small>${x.date}</small><strong>${x.title}</strong><em>${x.id} · ${x.method}</em></span><span class="activity-value"><strong>${x.status==='Refunded'?'+':''}${x.amount.toLocaleString()} AMD</strong><small>${x.status}</small></span></button>`).join('') || `<div class="activity-empty"><h2>No payments found</h2></div>`}</div>`;
    }
    return layout(`<section class="activity-hero"><div><small>Your charging history</small><h2>Activity</h2><p>Sessions, reservations and payments in one place.</p></div><div class="activity-score"><strong>104.2</strong><span>kWh this month</span></div></section><section class="monthly-overview"><div><small>Sessions</small><strong>4</strong></div><div><small>Average price</small><strong>119 AMD/kWh</strong></div><div><small>CO₂ avoided</small><strong>42 kg</strong></div></section><div class="activity-tabs">${tabs.map(([id,label])=>`<button data-activity-tab="${id}" class="${activitySection===id?'active':''}">${label}</button>`).join('')}</div>${activityToolbar()}${body}<section class="insight-card"><span>${icon('sparkle')}</span><div><strong>Monthly insight</strong><p>Your average charging cost is 119 AMD/kWh, 6% lower than last month.</p></div></section>`, 'Activity', `${activityRange} · ${activitySection}`);
}

function sessionDetailScreen(){
 const s=sessions.find(x=>x.id===selectedActivityId)||sessions[0];
 const curve=[28,48,74,92,100,96,89,80,68,56,45,35];
 return simpleHeaderBack('Session details',`${s.id} · ${s.status}`,`${activityMessage?`<div class="ui-feedback ui-feedback--success">${activityMessage}</div>`:''}<section class="session-detail-hero ui-surface--dark"><div><small>${s.date}</small><h2>${s.place}</h2><p>${s.address}</p></div><span class="viz-badge">${s.status}</span><div class="session-energy"><strong>${s.energy.toFixed(1)}</strong><span>kWh delivered</span></div></section><section class="session-detail-metrics"><div><small>Duration</small><strong>${s.started}–${s.ended}</strong></div><div><small>Battery</small><strong>${s.startBattery}% → ${s.endBattery}%</strong></div><div><small>Peak power</small><strong>${s.peakPower}</strong></div><div><small>Total</small><strong>${s.cost.toLocaleString()} AMD</strong></div></section><section class="charge-curve activity-curve"><div class="section-heading"><div><small>Charging curve</small><h2>Power through the session</h2></div><strong>${s.averagePower} avg.</strong></div><div class="curve-bars">${curve.map((h,i)=>`<i style="height:${s.status==='Failed'?8:h}%" class="${i<7&&s.status!=='Failed'?'active':''}"></i>`).join('')}</div><div class="curve-axis"><span>${s.started}</span><span>Peak</span><span>${s.ended}</span></div></section><section class="ui-card reservation-detail-list"><div><span>Vehicle</span><strong>${s.vehicle}</strong></div><div><span>Charger</span><strong>${s.charger} · ${s.connector}</strong></div><div><span>Payment reference</span><strong>${s.paymentId}</strong></div><div><span>Receipt</span><strong>${s.receipt||'Not issued'}</strong></div></section>${s.status==='Completed'?`<div class="activity-action-grid"><button class="ui-button ui-button--primary" data-view-receipt="${s.id}">View receipt</button><button class="ui-button ui-button--secondary" data-email-receipt>Send to email</button></div><div class="activity-action-grid"><button class="ui-button ui-button--secondary" data-request-refund="${s.id}">Request refund</button><button class="ui-button ui-button--secondary" data-dispute-payment="${s.paymentId}">Report billing issue</button></div>`:`<button class="ui-button ui-button--primary ui-button--block" data-report-problem>Get technical support</button>`}`, 'activity');
}
function activityReservationDetailScreen(){
 const r=activityReservations.find(x=>x.id===selectedActivityId)||activityReservations[0];
 return simpleHeaderBack('Reservation details',`${r.id} · ${r.status}`,`<section class="reservation-status-card ui-surface--dark"><div><small>${r.date}</small><h2>${r.place}</h2><p>Bay ${r.bay} · Charger ${r.charger}</p></div><span class="viz-badge">${r.status}</span></section><section class="ui-card reservation-detail-list"><div><span>Vehicle</span><strong>${r.vehicle}</strong></div><div><span>Reservation fee</span><strong>${r.fee.toLocaleString()} AMD</strong></div><div><span>Refund</span><strong>${(r.refund||0).toLocaleString()} AMD</strong></div><div><span>Access code</span><strong>${r.status==='Confirmed'?r.id:'Expired'}</strong></div></section>${r.status==='Confirmed'?`<button class="ui-button ui-button--primary ui-button--block" data-open-reservation-manage>Manage reservation</button>`:`<button class="ui-button ui-button--secondary ui-button--block" data-back-map>Find another charger</button>`}`, 'activity');
}
function paymentDetailScreen(){
 const p=activityPayments.find(x=>x.id===selectedActivityId)||activityPayments[0];
 return simpleHeaderBack('Payment details',`${p.id} · ${p.status}`,`<section class="payment-detail-hero ui-surface--dark"><small>${p.date}</small><strong>${p.status==='Refunded'?'+':''}${p.amount.toLocaleString()} AMD</strong><h2>${p.title}</h2><p>${p.method}</p></section><section class="ui-card reservation-detail-list"><div><span>Energy charge</span><strong>${p.status==='Refunded'?'0':Math.max(0,p.amount-500).toLocaleString()} AMD</strong></div><div><span>Reservation fee</span><strong>${p.status==='Refunded'?'500':'500'} AMD</strong></div><div><span>Tax included</span><strong>${p.status==='Refunded'?'0':Math.round(p.amount/6).toLocaleString()} AMD</strong></div><div><span>Transaction ID</span><strong>${p.id}</strong></div></section>${p.sessionId?`<button class="ui-button ui-button--primary ui-button--block" data-open-session="${p.sessionId}">Open charging session</button><button class="ui-button ui-button--secondary ui-button--block" data-dispute-payment="${p.id}">Report payment problem</button>`:''}`, 'activity');
}
function receiptScreen(){
 const s=sessions.find(x=>x.id===selectedActivityId)||sessions[0];
 return simpleHeaderBack('Receipt & invoice',s.receipt||s.id,`<section class="receipt-document"><div class="receipt-brand"><span>${icon('shield')}</span><div><strong>VoltDrive</strong><small>Charging receipt</small></div></div><div class="receipt-document-title"><small>Receipt number</small><h2>${s.receipt}</h2><p>${s.date} · Paid</p></div><div class="receipt-lines"><div><span>Energy ${s.energy.toFixed(1)} kWh</span><strong>${Math.max(0,s.cost-500).toLocaleString()} AMD</strong></div><div><span>Reservation fee</span><strong>500 AMD</strong></div><div><span>VAT included</span><strong>${Math.round(s.cost/6).toLocaleString()} AMD</strong></div><div class="total"><span>Total paid</span><strong>${s.cost.toLocaleString()} AMD</strong></div></div><div class="receipt-footer"><span>${s.place}</span><span>${s.vehicle}</span><span>Visa •••• 5050</span></div></section><button class="ui-button ui-button--primary ui-button--block" data-download-invoice>Download PDF invoice</button><button class="ui-button ui-button--secondary ui-button--block" data-email-receipt>Email receipt</button>`, 'session-detail');
}
function refundRequestScreen(){
 const s=sessions.find(x=>x.id===selectedActivityId)||sessions[0];
 return simpleHeaderBack('Request refund',s.id,`${activityMessage?`<div class="ui-feedback ui-feedback--success">${activityMessage}</div>`:''}<section class="ui-card ui-form"><label><span>Reason</span><select id="refund-reason"><option ${refundReason==='Unexpected charging interruption'?'selected':''}>Unexpected charging interruption</option><option>Charger delivered less energy</option><option>Duplicate payment</option><option>Reservation problem</option><option>Other</option></select></label><label><span>Additional details</span><textarea id="refund-details" rows="4" placeholder="Explain what happened"></textarea></label></section><section class="cost-card"><div><span>Maximum eligible refund</span><strong>${s.cost.toLocaleString()} AMD</strong></div><div><span>Review time</span><strong>1–3 business days</strong></div><small>Submitting a request does not guarantee a refund. We will review charger and payment records.</small></section><button class="ui-button ui-button--primary ui-button--block" data-submit-refund>Submit refund request</button>`, 'session-detail');
}
function disputePaymentScreen(){
 const p=activityPayments.find(x=>x.id===selectedActivityId)||activityPayments[0];
 return simpleHeaderBack('Report billing issue',p.id,`${activityMessage?`<div class="ui-feedback ui-feedback--success">${activityMessage}</div>`:''}<section class="ui-card ui-form"><label><span>Issue type</span><select id="dispute-reason"><option ${disputeReason==='Incorrect charging amount'?'selected':''}>Incorrect charging amount</option><option>Payment charged twice</option><option>Unknown transaction</option><option>Refund not received</option></select></label><label><span>Description</span><textarea rows="4" placeholder="Tell us what looks incorrect"></textarea></label></section><section class="ui-card"><small>Payment under review</small><h2>${p.amount.toLocaleString()} AMD</h2><p class="section-copy">${p.title} · ${p.date} · ${p.method}</p></section><button class="ui-button ui-button--primary ui-button--block" data-submit-dispute>Send billing report</button>`, 'payment-detail');
}

function accountScreen(){
    const activeVehicle=vehicles.find(v=>v.active) || vehicles[0];
    return layout(`<section class="profile-card"><div class="profile-avatar">${profile.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><div><small>Personal account</small><h2>${profile.name}</h2><p>${profile.email}</p></div><button class="ui-icon-button" data-edit-profile aria-label="Edit profile">${icon('chevron')}</button></section><section class="account-balance"><div><small>Wallet balance</small><strong>${walletBalance.toLocaleString()} AMD</strong><p>Automatic top-up ${autoTopUp.enabled?'enabled':'disabled'}</p></div><button class="ui-button ui-button--secondary ui-button--compact" data-add-funds>${icon('wallet')} Add funds</button></section><section class="account-section"><div class="section-heading"><div><small>Garage</small><h2>Your vehicles</h2></div><button class="ui-text-button" data-add-vehicle>Add vehicle</button></div>${vehicles.map(v=>`<button class="vehicle-account-row ${v.active?'is-active':'muted'}" data-edit-vehicle="${v.id}"><span class="mini-car">${icon('car')}</span><span><small>${v.active?'Active vehicle':'Vehicle'}</small><strong>${v.name}</strong><em>${v.plate} · ${v.connector} · Limit ${v.limit}%</em></span><span class="vehicle-battery">${v.battery}%</span></button>`).join('')}</section><section class="account-section"><div class="section-heading"><div><small>Payments</small><h2>Payment methods</h2></div><button class="ui-text-button" data-manage-payments>Manage</button></div><div class="payment-method"><span class="card-symbol">VISA</span><div><strong>•••• 5050</strong><small>Default payment card</small></div><span>✓</span></div></section><section class="settings-list"><button data-notifications><span>${icon('bell')}</span><div><strong>Notifications</strong><small>Charging, reservations and payments</small></div><span>${icon('chevron')}</span></button><button data-open-security><span>${icon('shield')}</span><div><strong>Security & privacy</strong><small>Password, 2FA and connected devices</small></div><span>${icon('chevron')}</span></button><button data-open-access-methods><span>⌁</span><div><strong>Charging access</strong><small>RFID cards and Plug & Charge</small></div><span>${icon('chevron')}</span></button><button data-open-language-region><span>◎</span><div><strong>Language & region</strong><small>${accountPreferences.language} · ${accountPreferences.country} · ${accountPreferences.currency}</small></div><span>${icon('chevron')}</span></button><button data-open-preferences><span>◐</span><div><strong>Units</strong><small>${accountPreferences.distance} · ${accountPreferences.energy}</small></div><span>${icon('chevron')}</span></button><button data-open-privacy><span>◈</span><div><strong>Privacy & data</strong><small>Permissions, analytics and account deletion</small></div><span>${icon('chevron')}</span></button><button data-open-billing><span>▤</span><div><strong>Billing & subscription</strong><small>${billingProfile.plan} · invoices and tax details</small></div><span>${icon('chevron')}</span></button><button data-open-legal><span>§</span><div><strong>Legal</strong><small>Terms, privacy policy and licences</small></div><span>${icon('chevron')}</span></button><button data-open-prototype-tools><span>⚙</span><div><strong>Prototype tools</strong><small>Demo states and onboarding reset</small></div><span>${icon('chevron')}</span></button><button data-open-support><span>?</span><div><strong>Help & support</strong><small>FAQ, live chat and charger support</small></div><span>${icon('chevron')}</span></button></section>`, 'Account', `${activeVehicle.name} · ${activeVehicle.battery}% battery`);
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
 return simpleHeaderBack('Vehicle garage','Choose and manage your EVs', `<section class="ui-card"><div class="section-heading"><div><small>Registered vehicles</small><h2>${vehicles.length} vehicles</h2></div><button class="ui-button ui-button--secondary ui-button--compact" data-add-vehicle>＋ Add</button></div><div class="ui-stack">${vehicles.map(v=>`<div class="ui-list-item ${v.active?'is-selected':''}"><button class="ui-list-main" data-set-active-vehicle="${v.id}"><span class="ui-list-icon">${icon('car')}</span><span><small>${v.active?'Active vehicle':'Tap to activate'}</small><strong>${v.name}</strong><em>${v.plate} · ${v.connector}</em></span><span><strong>${v.battery}%</strong><small>Limit ${v.limit}%</small></span></button><button class="ui-icon-button" data-edit-vehicle="${v.id}" aria-label="Edit ${v.name}">${icon('chevron')}</button></div>`).join('')}</div></section>`, 'account');
}
function addVehicleScreen(){
 const current=vehicles.find(v=>v.id===editingVehicleId);
 const [brand,...modelParts]=(current?.name || 'Hyundai IONIQ 5').split(' ');
 const model=modelParts.join(' ');
 return simpleHeaderBack(current?'Edit vehicle':'Add vehicle','Compatibility and charging preferences', `<section class="ui-card ui-form"><label><span>Manufacturer</span><select id="vehicle-brand">${['Hyundai','Kia','Mercedes-Benz','Tesla','BMW'].map(x=>`<option ${x===brand?'selected':''}>${x}</option>`).join('')}</select></label><label><span>Model</span><input id="vehicle-model" value="${model}"></label><label><span>Registration number</span><input id="vehicle-plate" value="${current?.plate || '77 EV 777'}"></label><label><span>VIN</span><input id="vehicle-vin" value="${current?'KM8KNDAF0PU123456':''}" placeholder="Optional vehicle identification number"></label><label><span>Connector</span><select id="vehicle-connector">${['CCS2','Type 2','CHAdeMO'].map(x=>`<option ${x===(current?.connector||'CCS2')?'selected':''}>${x}</option>`).join('')}</select></label><label><span>Preferred charging limit</span><input id="vehicle-limit" type="range" min="60" max="100" step="5" value="${current?.limit||85}"><strong id="vehicle-limit-value">${current?.limit||85}%</strong></label><label class="ui-check-row"><input type="checkbox" id="plug-charge" ${current?'checked':''}><span><strong>Plug & Charge</strong><small>Automatically identify this vehicle at compatible chargers.</small></span></label></section><button class="ui-button ui-button--primary ui-button--block" data-save-vehicle>${current?'Save changes':'Save vehicle'}</button>${current?`<button class="ui-button ui-button--danger ui-button--block" data-delete-vehicle="${current.id}">Delete vehicle</button>`:''}`, 'garage');
}
function walletScreen(){
 const method=paymentMethods.find(p=>p.id===selectedPaymentId) || paymentMethods[0];
 return simpleHeaderBack('Wallet & payments','Balance, top-up and payment methods', `${accountMessage?`<div class="ui-feedback ui-feedback--success">${accountMessage}</div>`:''}<section class="wallet-hero"><small>Available balance</small><strong>${walletBalance.toLocaleString()} AMD</strong><p>Automatic top-up ${autoTopUp.enabled?`at ${autoTopUp.threshold.toLocaleString()} AMD`:'is disabled'}</p></section><section class="ui-card"><div class="section-heading"><div><small>Quick top-up</small><h2>Select amount</h2></div></div><div class="ui-segment-grid">${[2000,5000,10000,20000].map(x=>`<button data-topup="${x}" class="${walletTopUp===x?'is-selected':''}">${x.toLocaleString()} AMD</button>`).join('')}</div><button class="ui-button ui-button--primary ui-button--block" data-confirm-topup>Add ${walletTopUp.toLocaleString()} AMD</button></section><section class="ui-card"><div class="section-heading"><div><small>Automatic balance</small><h2>Auto top-up</h2></div></div><label class="ui-list-item security-toggle"><span class="ui-list-icon">↻</span><span><small>Wallet automation</small><strong>Automatic top-up</strong><em>Add funds before your balance becomes too low</em></span><input class="ui-switch" type="checkbox" data-auto-topup-toggle ${autoTopUp.enabled?'checked':''}></label><div class="ui-form-grid ${autoTopUp.enabled?'':'is-disabled'}"><label><span>When balance is below</span><select id="auto-threshold" ${autoTopUp.enabled?'':'disabled'}>${[1000,2000,5000].map(x=>`<option value="${x}" ${autoTopUp.threshold===x?'selected':''}>${x.toLocaleString()} AMD</option>`).join('')}</select></label><label><span>Top up amount</span><select id="auto-amount" ${autoTopUp.enabled?'':'disabled'}>${[5000,10000,20000].map(x=>`<option value="${x}" ${autoTopUp.amount===x?'selected':''}>${x.toLocaleString()} AMD</option>`).join('')}</select></label></div><button class="ui-button ui-button--secondary ui-button--block" data-save-auto-topup>Save auto top-up</button></section><section class="ui-card"><div class="section-heading"><div><small>Payment cards</small><h2>Saved methods</h2></div><button class="ui-text-button" data-add-payment>Add card</button></div><div class="ui-stack">${paymentMethods.map(p=>`<button class="ui-list-item ${p.id===selectedPaymentId?'is-selected':''}" data-select-payment="${p.id}"><span class="ui-list-icon">${p.brand}</span><span><small>${p.active?'Default card':'Payment card'}</small><strong>•••• ${p.last4}</strong><em>Expires ${p.expiry}</em></span><span>${p.active?'✓':icon('chevron')}</span></button>`).join('')}</div>${method?`<button class="ui-button ui-button--danger ui-button--block" data-remove-payment="${method.id}">Remove selected card</button>`:''}</section>`, 'account');
}
function editProfileScreen(){
 return simpleHeaderBack('Edit profile','Personal and billing information', `${accountMessage?`<div class="ui-feedback ui-feedback--success">${accountMessage}</div>`:''}<section class="profile-editor"><div class="profile-avatar profile-avatar--large">${profile.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><button class="ui-text-button" data-change-photo>Change photo</button></section><section class="ui-card ui-form"><label><span>Full name</span><input id="profile-name" value="${profile.name}"></label><label><span>Email</span><input id="profile-email" type="email" value="${profile.email}"></label><label><span>Phone</span><input id="profile-phone" value="${profile.phone}"></label><label><span>Billing address</span><input id="profile-address" value="${profile.address}"></label></section><button class="ui-button ui-button--primary ui-button--block" data-save-profile>Save profile</button>`, 'account');
}
function languageRegionScreen(){
 return simpleHeaderBack('Language & region','Local charging and billing preferences', `${accountMessage?`<div class="ui-feedback ui-feedback--success">${accountMessage}</div>`:''}<section class="ui-card ui-form"><label><span>Application language</span><select id="pref-language">${['English','Русский','Հայերեն'].map(x=>`<option ${accountPreferences.language===x?'selected':''}>${x}</option>`).join('')}</select></label><label><span>Country or region</span><select id="pref-country">${['Armenia','Georgia','Germany','United Arab Emirates'].map(x=>`<option ${accountPreferences.country===x?'selected':''}>${x}</option>`).join('')}</select></label><label><span>Default currency</span><select id="pref-currency">${['AMD','EUR','USD','GEL','AED'].map(x=>`<option ${accountPreferences.currency===x?'selected':''}>${x}</option>`).join('')}</select></label></section><section class="ui-card info-note"><strong>Regional changes affect tariffs and taxes</strong><p>Existing receipts keep their original currency and tax calculation.</p></section><button class="ui-button ui-button--primary ui-button--block" data-save-language-region>Save region settings</button>`, 'account');
}
function preferencesScreen(){
 return simpleHeaderBack('Units','Distance and energy display', `${accountMessage?`<div class="ui-feedback ui-feedback--success">${accountMessage}</div>`:''}<section class="ui-card ui-form"><label><span>Distance</span><select id="pref-distance"><option ${accountPreferences.distance==='Kilometres'?'selected':''}>Kilometres</option><option ${accountPreferences.distance==='Miles'?'selected':''}>Miles</option></select></label><label><span>Energy</span><select id="pref-energy"><option selected>kWh</option></select></label></section><button class="ui-button ui-button--primary ui-button--block" data-save-preferences>Save preferences</button>`, 'account');
}
function privacyScreen(){
 return simpleHeaderBack('Privacy & data','Control how your information is used', `${accountMessage?`<div class="ui-feedback ui-feedback--success">${accountMessage}</div>`:''}<section class="ui-card"><label class="ui-list-item security-toggle"><span class="ui-list-icon">A</span><span><small>Product improvement</small><strong>Usage analytics</strong><em>Share anonymous interaction and performance data</em></span><input class="ui-switch" type="checkbox" data-privacy-toggle="analytics" ${accountPreferences.analytics?'checked':''}></label><label class="ui-list-item security-toggle"><span class="ui-list-icon">M</span><span><small>Personalisation</small><strong>Marketing data</strong><em>Use activity to personalise offers and recommendations</em></span><input class="ui-switch" type="checkbox" data-privacy-toggle="marketingData" ${accountPreferences.marketingData?'checked':''}></label></section><section class="ui-card"><div><small>Your data</small><h2>Download account data</h2><p>Prepare a copy of profile, vehicles, charging sessions and payments.</p></div><button class="ui-button ui-button--secondary ui-button--block" data-download-data>Request data export</button></section><section class="ui-card security-danger"><div><small>Permanent action</small><strong>Delete VoltDrive account</strong><p>Vehicles, wallet access and personal settings will be removed. Financial records may remain where legally required.</p></div><button class="ui-button ui-button--danger ui-button--block" data-open-delete-account>Delete account</button></section>`, 'account');
}
function deleteAccountScreen(){
 return simpleHeaderBack('Delete account','This action cannot be undone', `${accountMessage?`<div class="ui-feedback ui-feedback--error">${accountMessage}</div>`:''}<section class="delete-account-hero"><span>!</span><h2>Delete your VoltDrive account?</h2><p>You will lose access to vehicles, reservations, wallet preferences and charging history in the app.</p></section><section class="ui-card ui-form"><label><span>Reason</span><select id="delete-reason"><option>I no longer use VoltDrive</option><option>I have privacy concerns</option><option>I created another account</option><option>Other</option></select></label><label><span>Type DELETE to confirm</span><input id="delete-confirm" placeholder="DELETE"></label><label class="ui-check-row"><input id="delete-understood" type="checkbox"><span><strong>I understand this is permanent</strong><small>Legal invoices and transaction records may be retained.</small></span></label></section><button class="ui-button ui-button--danger ui-button--block" data-confirm-delete-account>Delete my account</button>`, 'privacy');
}


function authLayout(body){
    return `<div class="stage onboarding-stage"><div class="phone-shell onboarding-shell auth-shell"><div class="noise"></div><header class="onboarding-brand"><div class="brand-mark"><span>${icon('shield')}</span><span>VoltDrive</span></div></header><main class="content onboarding-content">${body}</main></div><aside class="prototype-notes"><div class="brand-mark"><span>${icon('shield')}</span><span>VoltDrive</span></div><h2>Authentication flow</h2><p>Existing drivers sign in immediately. New drivers create an account and continue through setup.</p><div class="note-card"><strong>Existing user</strong><span>Login → Home</span></div><div class="note-card"><strong>New user</strong><span>Register → Setup → Home</span></div></aside></div>`;
}
function authScreen() {
    if(authMode==='login') return authLayout(`<button class="ui-back ui-back--inline" data-auth-back>${icon('back')}</button><section class="auth-copy"><small>Welcome back</small><h1>Sign in to VoltDrive.</h1><p>Access your vehicles, reservations, wallet and charging history.</p></section>${authMessage?`<div class="ui-feedback ui-feedback--error">${authMessage}</div>`:''}<section class="ui-card ui-form"><label><span>Email or phone</span><input id="login-identity" type="text" value="gevor@example.com" autocomplete="username"></label><label><span>Password</span><input id="login-password" type="password" value="voltdrive2026" autocomplete="current-password"></label><button class="ui-text-button auth-forgot" type="button" data-forgot-password>Forgot password?</button></section><button class="ui-button ui-button--primary ui-button--block" data-login-submit>Sign in</button><div class="auth-switch"><span>New to VoltDrive?</span><button class="ui-text-button" data-auth-register>Create account</button></div>`);
    if(authMode==='register') return authLayout(`<button class="ui-back ui-back--inline" data-auth-back>${icon('back')}</button><section class="auth-copy"><small>Create account</small><h1>Start charging with one secure profile.</h1><p>After verification we will configure your region, vehicle and payment method.</p></section>${authMessage?`<div class="ui-feedback ui-feedback--error">${authMessage}</div>`:''}<section class="ui-card ui-form"><label><span>Full name</span><input id="register-name" value="Gevor Vardanyan" autocomplete="name"></label><label><span>Email</span><input id="register-email" type="email" value="${onboardingData.email}" autocomplete="email"></label><label><span>Password</span><input id="register-password" type="password" value="voltdrive2026" autocomplete="new-password"></label><label><span>Confirm password</span><input id="register-confirm" type="password" value="voltdrive2026" autocomplete="new-password"></label><label class="ui-check-row"><input id="register-terms" type="checkbox" checked><span>I accept the Terms of Service and Privacy Policy.</span></label></section><button class="ui-button ui-button--primary ui-button--block" data-register-submit>Create account</button><div class="auth-switch"><span>Already have an account?</span><button class="ui-text-button" data-auth-login>Sign in</button></div>`);
    if(authMode==='verify') return authLayout(`<button class="ui-back ui-back--inline" data-auth-register>${icon('back')}</button><section class="auth-copy"><small>Verify your email</small><h1>Enter the 6-digit code.</h1><p>We sent a confirmation code to <strong>${onboardingData.email}</strong>.</p></section>${authMessage?`<div class="ui-feedback ui-feedback--error">${authMessage}</div>`:''}<section class="ui-card"><div class="otp-grid" aria-label="Verification code"><input inputmode="numeric" maxlength="1" value="1"><input inputmode="numeric" maxlength="1" value="2"><input inputmode="numeric" maxlength="1" value="3"><input inputmode="numeric" maxlength="1" value="4"><input inputmode="numeric" maxlength="1" value="5"><input inputmode="numeric" maxlength="1" value="6"></div><div class="auth-helper-row"><span>Code expires in 04:58</span><button class="ui-text-button" type="button" data-resend-code>Resend code</button></div></section><button class="ui-button ui-button--primary ui-button--block" data-verify-submit>Verify and continue</button>`);
    if(authMode==='forgot') return authLayout(`<button class="ui-back ui-back--inline" data-auth-login>${icon('back')}</button><section class="auth-copy"><small>Reset password</small><h1>Recover your account.</h1><p>Enter the email or phone number connected to VoltDrive.</p></section>${authMessage?`<div class="ui-feedback ui-feedback--error">${authMessage}</div>`:''}<section class="ui-card ui-form"><label><span>Email or phone</span><input id="reset-identity" value="gevor@example.com" autocomplete="username"></label></section><button class="ui-button ui-button--primary ui-button--block" data-reset-request>Send recovery code</button>`);
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
    if(onboardingStep===1) return onboardingLayout(`<section class="onboarding-hero"><span class="onboarding-symbol">◎</span><small>Welcome to VoltDrive</small><h1>Set your charging region.</h1><p>We use it for currency, local tariffs, taxes and available payment methods.</p></section><section class="ui-card ui-form"><label><span>Country or region</span><select id="onboard-country"><option selected>Armenia</option><option>Georgia</option><option>United Arab Emirates</option><option>Germany</option></select></label><label><span>App language</span><select id="onboard-language"><option selected>English</option><option>Русский</option><option>Հայերեն</option></select></label></section><button class="ui-button ui-button--primary ui-button--block" data-onboarding-next>Continue</button>`,1);
    if(onboardingStep===2) return onboardingLayout(`<section class="onboarding-copy"><small>Add your EV</small><h1>See only compatible chargers.</h1><p>Vehicle data helps estimate charging time, required energy and connector compatibility.</p></section><section class="ui-card ui-form"><div class="vehicle-preview"><span>${icon('car')}</span><div><small>Vehicle preview</small><strong>${onboardingData.vehicleBrand} ${onboardingData.vehicleModel}</strong></div></div><label><span>Manufacturer</span><select id="onboard-brand"><option>Hyundai</option><option>Kia</option><option>Mercedes-Benz</option><option>Tesla</option></select></label><label><span>Model</span><input id="onboard-model" value="${onboardingData.vehicleModel}"></label><label><span>Registration number</span><input id="onboard-plate" value="${onboardingData.plate}"></label><label><span>Connector</span><select id="onboard-connector"><option>CCS2</option><option>Type 2</option><option>CHAdeMO</option></select></label></section><div class="onboarding-actions"><button class="ui-button ui-button--secondary" data-onboarding-prev>Back</button><button class="ui-button ui-button--primary" data-onboarding-next>Add vehicle</button></div>`,2);
    return onboardingLayout(`<section class="onboarding-copy"><small>Payment method</small><h1>Ready for one-tap charging.</h1><p>Add a payment card now or continue with wallet balance only.</p></section><section class="payment-visual"><div class="payment-card-art"><span>VOLTDRIVE</span><strong>•••• 5050</strong><small>08/29</small><b>VISA</b></div></section><section class="ui-card ui-form"><label><span>Card number</span><input id="onboard-card" inputmode="numeric" value="4242 4242 4242 5050"></label><div class="ui-form-grid"><label><span>Expiry</span><input value="08/29"></label><label><span>CVV</span><input type="password" value="123"></label></div><label><span>Cardholder name</span><input value="GEVOR VARDANYAN"></label></section><div class="onboarding-actions"><button class="ui-button ui-button--secondary" data-onboarding-prev>Back</button><button class="ui-button ui-button--primary" data-finish-onboarding>Finish setup</button></div>`,3);
}
function onboardingSuccessScreen(){
    return onboardingLayout(`<section class="onboarding-success"><span>✓</span><small>Setup complete</small><h1>You are ready to charge.</h1><p>Your account, ${onboardingData.vehicleBrand} ${onboardingData.vehicleModel} and payment method are connected.</p><div class="setup-summary"><div><small>Region</small><strong>${onboardingData.country}</strong></div><div><small>Currency</small><strong>AMD</strong></div><div><small>Vehicle</small><strong>${onboardingData.vehicleModel}</strong></div><div><small>Connector</small><strong>${onboardingData.connector}</strong></div></div></section><button class="ui-button ui-button--primary ui-button--block" data-enter-app>Open VoltDrive</button>`,3);
}


let notifications = [
    { id: 1, group: 'Today', type: 'success', icon: '✓', title: 'Charging completed', text: 'Your Model Y reached 90%. Total cost: 3,816 AMD.', time: '4 min ago', unread: true, target: 'session-detail', actionLabel: 'View session' },
    { id: 2, group: 'Today', type: 'reserved', icon: 'R', title: 'Reservation starts soon', text: 'Northern Avenue Hub · Charger 04 · Arrival grace period is 10 minutes.', time: '18 min ago', unread: true, target: 'reservation-manage', actionLabel: 'Open reservation' },
    { id: 3, group: 'Yesterday', type: 'warning', icon: '!', title: 'Idle fee reminder', text: 'Move your vehicle within 10 minutes after charging completes to avoid fees.', time: 'Yesterday · 18:42', unread: false, target: 'charging-summary', actionLabel: 'View charging result' },
    { id: 4, group: 'Earlier', type: 'payment', icon: '▭', title: 'Payment successful', text: 'Visa •••• 5050 was charged 2,146 AMD.', time: '2 Aug', unread: false, target: 'payment-detail', actionLabel: 'View payment' },
    { id: 5, group: 'Earlier', type: 'reserved', icon: '↗', title: 'Alternative charger available', text: 'Republic Square Station has two compatible 120 kW chargers available now.', time: '1 Aug', unread: false, target: 'location', actionLabel: 'View alternative' }
];
let notificationFilter = 'all';
let selectedNotificationId = 0;
let supportTopic = 'Charger problem';
let reportSubmitted = false;
let supportQuery = '';
let selectedSupportTicketId = 'VD-M-2048';
let supportMessage = '';
let supportRating = 0;
let supportTickets = [
  {id:'VD-M-2048',title:'Charging stopped unexpectedly',category:'Charger problem',status:'In progress',priority:'High',updated:'2 min ago',station:'Northern Avenue Hub',charger:'Charger 04',messages:[
    {from:'You',time:'11:51',text:'Charging stopped after several minutes and did not resume.'},
    {from:'VoltDrive Support',time:'11:52',text:'We are checking Charger 04 remotely. Please keep the cable connected.'}
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
const supportFaqs = [
  {id:'faq-cable',topic:'Charger problem',title:'Cable will not release',text:'Stop the session, unlock the vehicle, wait 10 seconds, then try again. Support can send a remote release command if the connector remains locked.'},
  {id:'faq-slow',topic:'Charger problem',title:'Charging is slower than expected',text:'Charging speed depends on battery temperature, battery level, vehicle limits and shared site power. Compare the current power with your vehicle maximum.'},
  {id:'faq-payment',topic:'Payment issue',title:'Payment is pending or duplicated',text:'A pending amount can be a temporary preauthorization. Completed duplicate charges can be reported from Activity → Payment details.'},
  {id:'faq-refund',topic:'Payment issue',title:'How refunds work',text:'Approved refunds are returned to the original payment method. Bank processing usually takes several business days.'},
  {id:'faq-reservation',topic:'Reservation help',title:'Modify or cancel a reservation',text:'Open the active reservation from Home or Activity. Cancellation conditions and any applicable fee are shown before confirmation.'},
  {id:'faq-arrival',topic:'Reservation help',title:'I arrived but the charger is unavailable',text:'Confirm your arrival, then choose the recommended alternative charger or join the waiting list.'},
  {id:'faq-account',topic:'Account & vehicle',title:'Change vehicle or connector details',text:'Open Account → Your vehicles, choose the vehicle and update connector compatibility or preferred charging limit.'}
];

function simpleHeaderBack(title, subtitle, body, back='account') {
    return layout(`<button class="ui-back ui-back--inline" data-simple-back="${back}">${icon('back')}</button>${body}`, title, subtitle);
}


function navigationPreviewScreen(){
    const s=selectedStation;
    const hasReservation=appState==='reserved' || !!activeReservation;
    return simpleHeaderBack('Route preview', `${s.distance} · ${s.eta}`, `
      <section class="navigation-hero ui-surface--dark">
        <div class="navigation-map-art" aria-label="Route preview to ${s.name}">
          <span class="navigation-origin">You</span><i></i><i></i><i></i><span class="navigation-destination">${icon('zap')}</span>
        </div>
        <small>Fastest route</small><h2>${s.name}</h2><p>${s.address}</p>
        <div class="navigation-stats"><div><small>Arrival</small><strong>${s.eta}</strong></div><div><small>Distance</small><strong>${s.distance}</strong></div><div><small>Battery on arrival</small><strong>61%</strong></div></div>
      </section>
      ${hasReservation?`<section class="navigation-reservation-note"><span>${icon('clock')}</span><div><strong>Reservation protected</strong><p>Arrival window ${reservation.time}. Your ${graceMinutes}-minute grace period begins after the scheduled time.</p></div></section>`:''}
      <section class="ui-card navigation-route-list"><div><span>1</span><div><strong>Head toward Abovyan Street</strong><small>Continue for 1.1 km</small></div></div><div><span>2</span><div><strong>Turn right onto Northern Avenue</strong><small>Station entrance is on the left</small></div></div><div><span>3</span><div><strong>Enter parking bay ${reservation.bay}</strong><small>Follow VoltDrive signs</small></div></div></section>
      <button class="ui-button ui-button--primary ui-button--block" data-start-route>${icon('route')} Start navigation</button>
      <button class="ui-button ui-button--secondary ui-button--block" data-open-location-from-navigation>View station details</button>
    `, navigationState.source==='reservation'?'reservation-manage':'location');
}
function navigationActiveScreen(){
    const s=selectedStation;
    const progress=Math.max(8,navigationState.progress||38);
    return layout(`<section class="navigation-active ui-surface--dark">
      <div class="navigation-turn"><span>↱</span><div><small>In 350 m</small><h2>Turn right onto Northern Avenue</h2></div></div>
      <div class="navigation-live-map"><div class="navigation-route-line"></div><span class="navigation-car">${icon('nav')}</span><span class="navigation-pin">${icon('zap')}</span></div>
      <div class="navigation-progress"><span style="width:${progress}%"></span></div>
      <div class="navigation-stats"><div><small>ETA</small><strong>${s.eta}</strong></div><div><small>Remaining</small><strong>${s.distance}</strong></div><div><small>Arrival battery</small><strong>61%</strong></div></div>
    </section>
    ${appState==='reserved'?`<section class="navigation-reservation-note"><span>${icon('clock')}</span><div><strong>Reservation ${activeReservation?.id||'VD-RS-8452'}</strong><p>Charger ${reservation.charger} · Bay ${reservation.bay} · Grace period ${graceMinutes} min</p></div></section>`:''}
    <button class="ui-button ui-button--primary ui-button--block" data-simulate-arrival>Prototype: Arrive at station</button>
    <button class="ui-button ui-button--secondary ui-button--block" data-stop-navigation>Stop navigation</button>`, 'Navigation', `${s.name} · Live route`);
}
function arrivalScreen(){
    const s=selectedStation;
    return simpleHeaderBack('You have arrived', s.name, `${navigationMessage?`<div class="ui-feedback ui-feedback--success">${navigationMessage}</div>`:''}
      <section class="arrival-hero ui-surface--dark"><div class="arrival-check">${navigationState.arrivalConfirmed?'✓':icon('pin')}</div><small>Location detected</small><h2>${s.name}</h2><p>${s.address}</p></section>
      <section class="ui-card arrival-assignment"><div class="section-heading"><div><small>Your assignment</small><h2>${appState==='reserved'?'Reserved charger':'Available charger'}</h2></div><span class="distance-pill">Ready</span></div><div class="arrival-assignment-grid"><div><small>Charger</small><strong>${reservation.charger}</strong></div><div><small>Parking bay</small><strong>${reservation.bay}</strong></div><div><small>Connector</small><strong>CCS2</strong></div><div><small>Power</small><strong>180 kW</strong></div></div></section>
      <section class="arrival-instructions"><span>${icon('parking')}</span><div><strong>Park in bay ${reservation.bay}</strong><p>Confirm arrival after your vehicle is inside the marked bay. Then connect the cable to start charging.</p></div></section>
      ${navigationState.arrivalConfirmed?`<button class="ui-button ui-button--primary ui-button--block" data-arrival-start-charge>${icon('plug')} Connect and start charging</button>`:`<button class="ui-button ui-button--primary ui-button--block" data-arrival-confirm>Confirm arrival</button>`}
      <button class="ui-button ui-button--secondary ui-button--block" data-arrival-station-help>Charger not available</button>
    `, 'navigation-active');
}

function notificationsScreen(){
    const visible = notificationFilter === 'unread' ? notifications.filter(n=>n.unread) : notifications;
    const groups = ['Today','Yesterday','Earlier'];
    const grouped = groups.map(group=>({group,items:visible.filter(n=>n.group===group)})).filter(x=>x.items.length);
    const list = grouped.length ? grouped.map(section=>`<section class="notification-group"><div class="notification-group-heading"><small>${section.group}</small><span>${section.items.length}</span></div><div class="notification-list">${section.items.map(n=>`<article class="notification-item ui-surface--dark ${n.unread?'unread':''}"><button class="notification-main" data-notification-id="${n.id}"><span class="notification-symbol ${n.type}">${n.icon}</span><span><small>${n.time}</small><strong>${n.title}</strong><p>${n.text}</p></span><i></i></button><div class="notification-actions"><button class="ui-text-button" data-notification-open="${n.id}">${n.actionLabel}</button><button class="notification-delete" data-notification-delete="${n.id}" aria-label="Delete notification">×</button></div></article>`).join('')}</div></section>`).join('') : `<section class="ui-state ui-state--empty"><span>✓</span><h2>No notifications here</h2><p>${notificationFilter==='unread'?'You have read every update.':'New charging, reservation and payment events will appear here.'}</p></section>`;
    return simpleHeaderBack('Notifications', `${notifications.filter(n=>n.unread).length} unread updates`, `<section class="notification-summary ui-surface--dark"><div><small>Stay informed</small><h2>Everything important, without noise</h2><p>Charging, reservation and payment events are prioritised automatically.</p></div><button data-mark-read ${notifications.some(n=>n.unread)?'':'disabled'}>Mark all read</button></section><div class="notification-tabs ui-surface--dark"><button data-notification-filter="all" class="${notificationFilter==='all'?'active':''}">All</button><button data-notification-filter="unread" class="${notificationFilter==='unread'?'active':''}">Unread</button></div>${list}<section class="notification-preferences ui-surface--dark"><div><small>Smart alerts</small><strong>Critical events always stay enabled</strong></div><button class="ui-text-button" data-open-notification-settings>Manage</button></section>`, 'account');
}
function notificationDetailScreen(){
    const n=notifications.find(x=>x.id===selectedNotificationId) || notifications[0];
    return simpleHeaderBack(n.title, n.time, `<section class="notification-detail-hero ui-surface--dark"><span class="notification-symbol ${n.type}">${n.icon}</span><small>${n.group}</small><h2>${n.title}</h2><p>${n.text}</p></section><section class="ui-card notification-detail-card"><div><small>Notification category</small><strong>${n.type==='success'?'Charging':n.type==='reserved'?'Reservation':n.type==='payment'?'Payment':'Important update'}</strong></div><div><small>Delivery</small><strong>Push notification</strong></div><div><small>Status</small><strong>${n.unread?'Unread':'Read'}</strong></div></section><div class="activity-action-grid"><button class="ui-button ui-button--primary" data-notification-open="${n.id}">${n.actionLabel}</button><button class="ui-button ui-button--danger" data-notification-delete="${n.id}">Delete</button></div>`, 'notifications');
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
      <section class="account-section"><div class="section-heading"><div><small>Frequently asked</small><h2>${supportTopic}</h2></div></div><div class="faq-list">${faqs.length?faqs.map(f=>`<button class="ui-list-item" data-open-faq="${f.id}"><span class="ui-list-icon">?</span><span><strong>${f.title}</strong><small>${f.text}</small></span><span>${icon('chevron')}</span></button>`).join(''):`<div class="ui-state ui-state--empty"><span>?</span><h2>No matching answers</h2><p>Try another topic or start a live chat.</p></div>`}</div></section>`, 'account');
}
function supportTicketsScreen(){
  return simpleHeaderBack('Support tickets',`${supportTickets.length} requests`, `<section class="support-ticket-list">${supportTickets.map(t=>`<button class="ui-list-item support-ticket-row" data-open-support-ticket="${t.id}"><span class="ui-list-icon">${t.status==='Resolved'?'✓':'!'}</span><span><small>${t.id} · ${t.updated}</small><strong>${t.title}</strong><em>${t.status} · ${t.category}</em></span><span>${icon('chevron')}</span></button>`).join('')}</section>`, 'support');
}
function supportTicketDetailScreen(){
  const t=supportTickets.find(x=>x.id===selectedSupportTicketId)||supportTickets[0];
  return simpleHeaderBack(t.title,`${t.id} · ${t.status}`, `${supportMessage?`<div class="ui-feedback ui-feedback--success">${supportMessage}</div>`:''}<section class="support-ticket-hero ui-surface--dark"><div><small>${t.category}</small><h2>${t.status}</h2><p>${t.station} · ${t.charger}</p></div><span class="viz-badge">${t.priority}</span></section><section class="ui-card support-ticket-meta"><div><small>Ticket ID</small><strong>${t.id}</strong></div><div><small>Last update</small><strong>${t.updated}</strong></div><div><small>Priority</small><strong>${t.priority}</strong></div></section><section class="support-conversation"><div class="section-heading"><div><small>Conversation</small><h2>Messages</h2></div></div>${t.messages.map(m=>`<article class="support-message ${m.from==='You'?'is-user':'is-agent'}"><small>${m.from} · ${m.time}</small><p>${m.text}</p></article>`).join('')}</section>${t.status!=='Resolved'?`<section class="ui-card ui-form"><label><span>Reply</span><textarea id="support-reply" rows="3" placeholder="Write a message to support"></textarea></label><label class="photo-upload"><span>＋</span><strong>Add attachment</strong><small>Photo or document · prototype</small></label><button class="ui-button ui-button--primary ui-button--block" data-send-support-reply>Send message</button></section><button class="ui-button ui-button--secondary ui-button--block" data-close-support-ticket>Close request</button>`:`<section class="ui-card support-rating"><small>How was the support?</small><h2>Rate this resolution</h2><div class="support-stars">${[1,2,3,4,5].map(n=>`<button data-support-rating="${n}" class="${supportRating>=n?'active':''}">★</button>`).join('')}</div></section>`}`, 'support-tickets');
}
function faqDetailScreen(){
  const f=supportFaqs.find(x=>x.id===window.__faqId)||supportFaqs[0];
  return simpleHeaderBack(f.title,f.topic,`<section class="ui-card faq-detail"><span class="ui-list-icon">?</span><h2>${f.title}</h2><p>${f.text}</p><div class="faq-steps"><strong>Still need help?</strong><p>Start a live chat or create a service request and include the charger or session ID.</p></div></section><button class="ui-button ui-button--primary ui-button--block" data-live-chat>Start live chat</button><button class="ui-button ui-button--secondary ui-button--block" data-report-problem>Create service request</button>`, 'support');
}

function reportProblemScreen(){
    if(reportSubmitted) return simpleHeaderBack('Problem reported','Service request created', `<section class="report-success"><span>✓</span><h2>We received your report</h2><p>Ticket VD-M-2048 was sent to the operations team. Charger 04 will be checked remotely first.</p><div class="report-ticket"><div><small>Priority</small><strong>High</strong></div><div><small>Expected update</small><strong>Within 5 min</strong></div></div></section><button class="primary-action compact" data-return-charge><span class="primary-icon">${icon('plug')}</span><span><small>Return to session</small><strong>Back to charging</strong></span><span>${icon('chevron')}</span></button>`, 'charging');
    const issues=['Cable locked','Charging stopped','Power is too low','Screen or connector damaged','Other'];
    return simpleHeaderBack('Report a problem','Northern Avenue Hub · Charger 04', `<section class="report-context"><span>${icon('zap')}</span><div><small>Active equipment</small><h2>Charger 04 · CCS2</h2><p>Session VD-CS-10842 · Started 11:42</p></div><span class="live-chip">Online</span></section><section class="account-section"><div class="section-heading"><div><small>Problem type</small><h2>What happened?</h2></div></div><div class="issue-options">${issues.map((x,i)=>`<label class="issue-option"><input type="radio" name="issue" ${i===1?'checked':''}><span><strong>${x}</strong><small>${i===0?'Cable cannot be removed from vehicle or charger':i===1?'Session interrupted unexpectedly':i===2?'Charging is much slower than expected':i===3?'Visible physical damage':'Describe another issue'}</small></span></label>`).join('')}</div><label class="report-note"><span>Additional details</span><textarea placeholder="Tell us what you see or what happened...">Charging stopped after several minutes and did not resume.</textarea></label><label class="photo-upload"><span>＋</span><strong>Add photo</strong><small>Optional for this prototype</small></label></section><button class="primary-action compact" data-submit-report><span class="primary-icon">!</span><span><small>Send diagnostics automatically</small><strong>Submit problem report</strong></span><span>${icon('chevron')}</span></button>`, 'charging');
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
 return simpleHeaderBack('Review purchase',isPlan?'Membership activation':'Charging package purchase', `<section class="confirmation-hero"><span>◆</span><small>${isPlan?'Membership':'Energy credits'}</small><h2>${isPlan?item.name:item.name+' · '+item.kwh+' kWh'}</h2><p>${isPlan?item.period:item.validity}</p></section><section class="summary-card"><div><span>Payment method</span><strong>VISA •••• 5050</strong><small>Default card</small></div><div><span>${isPlan?'Renewal':'Credit validity'}</span><strong>${isPlan?'Monthly':'Until '+item.validity}</strong><small>${isPlan?'Cancel any time':'Fees are not included'}</small></div></section><section class="cost-card"><div><span>${isPlan?'Plan price':'Package price'}</span><strong>${price.toLocaleString()} AMD</strong></div>${billingProfile.promoCode?`<div><span>Promo discount</span><strong>−500 AMD</strong></div>`:''}<div class="total"><span>Pay now</span><strong>${Math.max(0,price-(billingProfile.promoCode?500:0)).toLocaleString()} AMD</strong></div></section><label class="ui-check-row"><input type="checkbox" id="membership-terms" checked><span>I accept the purchase and renewal conditions.</span></label><button class="ui-button ui-button--primary ui-button--block" data-confirm-membership-purchase>Confirm purchase</button>`, isPlan?'membership-plan':'packages');
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
 return simpleHeaderBack(title,'Last updated 5 August 2026', `<section class="ui-card legal-document"><h2>${title}</h2><p>This prototype page demonstrates the final information architecture. Production legal text must be provided and approved by the company legal team for every supported country.</p><h3>1. Scope</h3><p>The policy applies to account access, charger discovery, reservations, charging sessions, payments and support interactions.</p><h3>2. Customer responsibilities</h3><p>Customers must use compatible vehicles and connectors, follow site instructions and move the vehicle before an idle-fee period begins.</p><h3>3. Charges and records</h3><p>Applicable energy, time, reservation, parking and idle fees are presented before confirmation and recorded in Activity.</p></section>`, 'legal');
}
function finalQAScreen(){
    const scenarios = [
      ['auth','New user registration','Create account, verify email, finish onboarding and reach Home.'],
      ['login','Existing user sign-in','Sign in with credentials and open the saved driver account.'],
      ['reserve','Find and reserve','Search a station, choose a slot and confirm one reservation ID.'],
      ['navigate','Navigation and arrival','Start route guidance, arrive and confirm the assigned bay.'],
      ['charge','Start and complete charge','Authorize payment, start, stop and create a session record.'],
      ['records','Wallet, Activity and receipt','Verify matching Session, Payment, Wallet and Receipt data.'],
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
    if(id==='reserve'){ activeTab='map'; selectedStation=stations[0]; reservationMode='create'; reservationStep=1; screen='reservation'; return; }
    if(id==='navigate'){ appState='reserved'; activeReservation=activeReservation||{...reservation,id:'VD-RS-QA',status:'Confirmed'}; navigationState={source:'reservation',started:false,progress:0,arrived:false,arrivalConfirmed:false}; screen='navigation-preview'; return; }
    if(id==='charge'){ activeTab='charge'; startCharge={code:'VD-04-CCS2',connector:'04',payment:'Wallet',preauth:5000,accepted:true,error:'',stage:'ready'}; screen='charge-start'; return; }
    if(id==='records'){ activeTab='activity'; activitySection='sessions'; selectedActivityId=latestCompletedSessionId; screen='session-detail'; return; }
    if(id==='failure'){ activeTab='charge'; startCharge.error='payment'; screen='charge-start-error'; return; }
    if(id==='support'){ supportTopic='Charging interrupted'; screen='support'; return; }
}

function prototypeToolsScreen(){
    const states=['idle','reserved','charging','completed'];
    return simpleHeaderBack('Prototype tools','Test-only controls · not visible in production', `<section class="ui-card developer-warning"><span>⚙</span><div><strong>Developer environment</strong><p>These controls reset demo data and simulate application states. They are outside the customer experience.</p></div></section><section class="account-section"><div class="section-heading"><div><small>Application state</small><h2>Simulate driver status</h2></div></div><div class="ui-segment-grid ui-segment-grid--four">${states.map(x=>`<button data-state="${x}" class="${appState===x?'is-selected':''}">${x}</button>`).join('')}</div></section><section class="account-section"><div class="section-heading"><div><small>Home screen</small><h2>Simulate edge states</h2></div></div><div class="ui-segment-grid home-scenario-grid">${['normal','low-battery','offline','no-payment','no-vehicle','station-unavailable','loading'].map(x=>`<button data-home-scenario="${x}" class="${homeScenario===x?'is-selected':''}">${x}</button>`).join('')}</div></section><section class="account-section"><div class="section-heading"><div><small>First launch</small><h2>Onboarding controls</h2></div></div><button class="ui-list-item" data-preview-onboarding><span class="ui-list-item__icon">✦</span><span><strong>Restart onboarding</strong><small>Login/register, region, vehicle and payment</small></span><span>${icon('chevron')}</span></button><button class="ui-list-item" data-reset-demo><span class="ui-list-item__icon">↺</span><span><strong>Reset demo data</strong><small>Restore vehicles, wallet and session state</small></span><span>${icon('chevron')}</span></button><button class="ui-list-item" data-open-final-qa><span class="ui-list-item__icon">✓</span><span><strong>Final end-to-end QA</strong><small>Run and verify all driver journeys</small></span><span>${icon('chevron')}</span></button></section><section class="developer-note"><strong>Production rule</strong><p>This screen must be disabled in release builds.</p></section>`, 'account');
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
        'connector-select': 'Select connector', 'payment-authorize': 'Payment authorization', 'tariff-review': 'Tariff review',
        'charge-connecting': 'Connecting to charger', 'charge-start-error': 'Charging error', charging: 'Active charging',
        'charging-summary': 'Charging complete', activity: 'Activity', 'session-detail': 'Session details',
        'activity-reservation-detail': 'Reservation details', 'payment-detail': 'Payment details', receipt: 'Receipt',
        'refund-request': 'Refund request', 'payment-dispute': 'Payment dispute', 'navigation-preview': 'Route preview',
        'navigation-active': 'Navigation', arrival: 'Arrival confirmation', 'parking-monitor': 'Parking session',
        'parking-extend': 'Extend parking', 'parking-complete': 'Parking complete', notifications: 'Notifications',
        'notification-detail': 'Notification details', support: 'Help and support', 'support-tickets': 'Support tickets',
        'support-ticket-detail': 'Support ticket', 'faq-detail': 'Help article', 'report-problem': 'Report a problem',
        garage: 'Vehicle garage', 'add-vehicle': 'Add vehicle', wallet: 'Wallet', 'prototype-tools': 'Prototype tools',
        'final-qa': 'End-to-end QA', security: 'Security', 'change-password': 'Change password',
        'notification-settings': 'Notification settings', 'edit-profile': 'Edit profile', 'language-region': 'Language and region',
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
    app.innerHTML = screen === 'auth' ? authScreen() : screen === 'onboarding' ? onboardingScreen() : screen === 'onboarding-success' ? onboardingSuccessScreen() : screen === 'home' ? homeScreen() : screen === 'map' ? mapScreen() : screen === 'map-filters' ? mapFiltersScreen() : screen === 'location' ? locationScreen() : screen === 'reservation' ? reservationScreen() : screen === 'reservation-success' ? reservationSuccessScreen() : screen === 'reservation-manage' ? reservationManageScreen() : screen === 'reservation-cancel' ? cancelReservationScreen() : screen === 'waiting-list' ? waitingListScreen() : screen === 'reservation-no-show' ? noShowScreen() : screen === 'charge-start' ? chargeStartScreen() : screen === 'charge-scan' ? chargeScanScreen() : screen === 'charger-check' ? chargerCheckScreen() : screen === 'connector-select' ? connectorSelectScreen() : screen === 'payment-authorize' ? paymentAuthorizeScreen() : screen === 'tariff-review' ? tariffReviewScreen() : screen === 'charge-connecting' ? chargeConnectingScreen() : screen === 'charge-start-error' ? chargeStartErrorScreen() : screen === 'charging' ? chargingScreen() : screen === 'charging-summary' ? chargingSummaryScreen() : screen === 'activity' ? activityScreen() : screen === 'session-detail' ? sessionDetailScreen() : screen === 'activity-reservation-detail' ? activityReservationDetailScreen() : screen === 'payment-detail' ? paymentDetailScreen() : screen === 'receipt' ? receiptScreen() : screen === 'refund-request' ? refundRequestScreen() : screen === 'payment-dispute' ? disputePaymentScreen() : screen === 'navigation-preview' ? navigationPreviewScreen() : screen === 'navigation-active' ? navigationActiveScreen() : screen === 'arrival' ? arrivalScreen() : screen === 'parking-monitor' ? parkingMonitorScreen() : screen === 'parking-extend' ? parkingExtendScreen() : screen === 'parking-complete' ? parkingCompleteScreen() : screen === 'notifications' ? notificationsScreen() : screen === 'notification-detail' ? notificationDetailScreen() : screen === 'support' ? supportScreen() : screen === 'support-tickets' ? supportTicketsScreen() : screen === 'support-ticket-detail' ? supportTicketDetailScreen() : screen === 'faq-detail' ? faqDetailScreen() : screen === 'report-problem' ? reportProblemScreen() : screen === 'garage' ? garageScreen() : screen === 'add-vehicle' ? addVehicleScreen() : screen === 'wallet' ? walletScreen() : screen === 'prototype-tools' ? prototypeToolsScreen() : screen === 'final-qa' ? finalQAScreen() : screen === 'security' ? securityScreen() : screen === 'change-password' ? changePasswordScreen() : screen === 'notification-settings' ? notificationSettingsScreen() : screen === 'edit-profile' ? editProfileScreen() : screen === 'language-region' ? languageRegionScreen() : screen === 'preferences' ? preferencesScreen() : screen === 'privacy' ? privacyScreen() : screen === 'delete-account' ? deleteAccountScreen() : screen === 'billing' ? billingScreen() : screen === 'membership-compare' ? membershipCompareScreen() : screen === 'membership-plan' ? membershipPlanScreen() : screen === 'packages' ? packageListScreen() : screen === 'membership-checkout' ? membershipCheckoutScreen() : screen === 'membership-success' ? membershipSuccessScreen() : screen === 'legal' ? legalScreen() : screen === 'legal-document' ? legalDocumentScreen() : screen === 'access-methods' ? accessMethodsScreen() : screen === 'rfid-editor' ? rfidEditorScreen() : screen === 'plug-charge' ? plugChargeScreen() : accountScreen();
    app.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
        activeTab = b.dataset.tab;
        screen = activeTab === 'map' ? 'map' : activeTab === 'charge' ? (appState === 'completed' ? 'charging-summary' : appState === 'charging' ? 'charging' : 'charge-start') : activeTab === 'activity' ? 'activity' : activeTab === 'account' ? 'account' : 'home';
        render();
    }));

    app.querySelector('[data-preview-onboarding]')?.addEventListener('click', () => { onboardingStep=1; authMode='welcome'; authMessage=''; screen='auth'; render(); });
    app.querySelector('[data-open-prototype-tools]')?.addEventListener('click', () => { screen='prototype-tools'; render(); });
    app.querySelector('[data-open-final-qa]')?.addEventListener('click',()=>{screen='final-qa';qaMessage='';render();});
    app.querySelectorAll('[data-qa-toggle]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.qaToggle;qaCompleted.has(id)?qaCompleted.delete(id):qaCompleted.add(id);qaMessage=qaCompleted.size===8?'All end-to-end scenarios passed. Driver App is ready for prototype handoff.':'';render();}));
    app.querySelectorAll('[data-qa-run]').forEach(b=>b.addEventListener('click',()=>{runQAScenario(b.dataset.qaRun);render();}));
    app.querySelector('[data-qa-reset]')?.addEventListener('click',()=>{qaCompleted.clear();qaMessage='QA checklist reset.';render();});
        app.querySelector('[data-reset-demo]')?.addEventListener('click', () => { appState='idle'; homeScenario='normal'; homeVehicleMenuOpen=false; showFavoritesOnly=false; charging={ battery:64,target:90,power:142,energy:18.6,cost:2232,minutes:17,remaining:26,speed:'Maximum',paused:false }; onboardingComplete=false; startCharge={ code:'VD-04-CCS2',connector:'04',payment:'Wallet',preauth:5000,accepted:true,error:'',stage:'ready' }; render(); });
    app.querySelectorAll('[data-auth-login]').forEach(b => b.addEventListener('click', () => { authMode='login'; authMessage=''; screen='auth'; render(); }));
    app.querySelectorAll('[data-auth-register]').forEach(b => b.addEventListener('click', () => { authMode='register'; authMessage=''; screen='auth'; render(); }));
    app.querySelector('[data-auth-back]')?.addEventListener('click', () => { authMode='welcome'; authMessage=''; render(); });
    app.querySelectorAll('[data-forgot-password]').forEach(b => b.addEventListener('click', () => { authMode='forgot'; authMessage=''; render(); }));
    app.querySelector('[data-login-submit]')?.addEventListener('click', () => { const identity=document.querySelector('#login-identity')?.value?.trim(); const password=document.querySelector('#login-password')?.value; if(!identity || !password){ authMessage='Enter your login and password.'; render(); return; } onboardingComplete=true; activeTab='home'; screen='home'; render(); });
    app.querySelector('[data-register-submit]')?.addEventListener('click', () => { const email=document.querySelector('#register-email')?.value?.trim(); const password=document.querySelector('#register-password')?.value; const confirm=document.querySelector('#register-confirm')?.value; const terms=document.querySelector('#register-terms')?.checked; if(!email || !password){ authMessage='Enter an email and password.'; render(); return; } if(password!==confirm){ authMessage='Passwords do not match.'; render(); return; } if(!terms){ authMessage='Accept the Terms and Privacy Policy to continue.'; render(); return; } onboardingData.email=email; authMode='verify'; authMessage=''; render(); });
    app.querySelector('[data-verify-submit]')?.addEventListener('click', () => { onboardingStep=1; authMessage=''; screen='onboarding'; render(); });
    app.querySelector('[data-reset-request]')?.addEventListener('click', () => { const identity=document.querySelector('#reset-identity')?.value?.trim(); if(!identity){ authMessage='Enter your email or phone number.'; render(); return; } authMode='reset-code'; authMessage=''; render(); });
    app.querySelector('[data-reset-code-submit]')?.addEventListener('click', () => { authMode='reset-new'; authMessage=''; render(); });
    app.querySelector('[data-reset-password-submit]')?.addEventListener('click', () => { const password=document.querySelector('#reset-password')?.value || ''; const confirm=document.querySelector('#reset-confirm')?.value || ''; if(password.length<8){ authMessage='Password must contain at least 8 characters.'; render(); return; } if(password!==confirm){ authMessage='Passwords do not match.'; render(); return; } authMode='reset-success'; authMessage=''; render(); });
    app.querySelectorAll('[data-resend-code]').forEach(b => b.addEventListener('click', () => { authMessage=''; b.textContent='Code sent'; setTimeout(()=>{ if(document.body.contains(b)) b.textContent='Resend code'; },1200); }));
    app.querySelector('[data-cancel-setup]')?.addEventListener('click', () => { authMode='welcome'; screen='auth'; render(); });
    app.querySelector('[data-onboarding-prev]')?.addEventListener('click', () => { onboardingStep=Math.max(1,onboardingStep-1); render(); });
    app.querySelector('[data-onboarding-next]')?.addEventListener('click', () => {
        if(onboardingStep===1){ onboardingData.country=document.querySelector('#onboard-country')?.value || onboardingData.country; onboardingData.language=document.querySelector('#onboard-language')?.value || onboardingData.language; }
        if(onboardingStep===2){ onboardingData.vehicleBrand=document.querySelector('#onboard-brand')?.value || onboardingData.vehicleBrand; onboardingData.vehicleModel=document.querySelector('#onboard-model')?.value || onboardingData.vehicleModel; onboardingData.plate=document.querySelector('#onboard-plate')?.value || onboardingData.plate; onboardingData.connector=document.querySelector('#onboard-connector')?.value || onboardingData.connector; }
        onboardingStep=Math.min(3,onboardingStep+1); render();
    });
    app.querySelector('[data-finish-onboarding]')?.addEventListener('click', () => { onboardingComplete=true; screen='onboarding-success'; render(); });
    app.querySelector('[data-enter-app]')?.addEventListener('click', () => {
        if(!vehicles.some(v=>v.plate===onboardingData.plate)) vehicles.push({id:Date.now(),name:onboardingData.vehicleBrand+' '+onboardingData.vehicleModel,plate:onboardingData.plate,connector:onboardingData.connector,battery:72,limit:85,active:false});
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
    app.querySelectorAll('[data-add-vehicle]').forEach(b => b.addEventListener('click', () => { editingVehicleId=null; screen='add-vehicle'; render(); }));
    app.querySelectorAll('[data-edit-vehicle]').forEach(b => b.addEventListener('click', () => { editingVehicleId=Number(b.dataset.editVehicle); screen='add-vehicle'; render(); }));
    app.querySelector('[data-add-funds]')?.addEventListener('click', () => { screen='wallet'; render(); });
    app.querySelector('[data-manage-payments]')?.addEventListener('click', () => { screen='wallet'; render(); });
app.querySelector('[data-edit-profile]')?.addEventListener('click', () => { accountMessage=''; screen='edit-profile'; render(); });
    app.querySelector('[data-change-photo]')?.addEventListener('click',()=>{accountMessage='Profile photo picker opened in prototype mode.';render();});
    app.querySelector('[data-save-profile]')?.addEventListener('click', () => { profile.name=document.querySelector('#profile-name')?.value?.trim()||profile.name; profile.email=document.querySelector('#profile-email')?.value?.trim()||profile.email; profile.phone=document.querySelector('#profile-phone')?.value?.trim()||profile.phone; profile.address=document.querySelector('#profile-address')?.value?.trim()||profile.address; accountMessage='Profile saved.'; render(); });
    app.querySelector('[data-open-language-region]')?.addEventListener('click', () => { accountMessage=''; screen='language-region'; render(); });
    app.querySelector('[data-save-language-region]')?.addEventListener('click', () => { accountPreferences.language=document.querySelector('#pref-language')?.value||accountPreferences.language; accountPreferences.country=document.querySelector('#pref-country')?.value||accountPreferences.country; accountPreferences.currency=document.querySelector('#pref-currency')?.value||accountPreferences.currency; accountMessage='Language and region saved.'; render(); });
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
    app.querySelector('[data-download-data]')?.addEventListener('click',()=>{accountMessage='Data export requested. A download link will be sent by email.';render();});
    app.querySelector('[data-open-delete-account]')?.addEventListener('click',()=>{accountMessage='';screen='delete-account';render();});
    app.querySelector('[data-confirm-delete-account]')?.addEventListener('click',()=>{const text=document.querySelector('#delete-confirm')?.value||'';const ok=document.querySelector('#delete-understood')?.checked;if(text!=='DELETE'||!ok){accountMessage='Type DELETE and confirm that you understand the action.';render();return;}authMode='welcome';screen='auth';accountMessage='';render();});
    app.querySelectorAll('[data-set-active-vehicle]').forEach(b => b.addEventListener('click', () => { const id=Number(b.dataset.setActiveVehicle); vehicles.forEach(v=>v.active=v.id===id); render(); }));
    app.querySelector('[data-vehicle-limit]')?.addEventListener('input', e => { const out=document.querySelector('#vehicle-limit-value'); if(out) out.textContent=e.target.value+'%'; });
    app.querySelector('[data-save-vehicle]')?.addEventListener('click', () => { const brand=document.querySelector('#vehicle-brand')?.value || 'EV'; const model=document.querySelector('#vehicle-model')?.value || 'Vehicle'; const plate=document.querySelector('#vehicle-plate')?.value || 'NEW EV'; const connector=document.querySelector('#vehicle-connector')?.value || 'CCS2'; const limit=Number(document.querySelector('#vehicle-limit')?.value || 85); if(editingVehicleId){ const v=vehicles.find(x=>x.id===editingVehicleId); if(v){v.name=brand+' '+model;v.plate=plate;v.connector=connector;v.limit=limit;} } else vehicles.push({id:Date.now(),name:brand+' '+model,plate,connector,battery:52,limit,active:false}); editingVehicleId=null; screen='garage'; render(); });
    app.querySelector('[data-delete-vehicle]')?.addEventListener('click', e => { const id=Number(e.target.dataset.deleteVehicle); const target=vehicles.find(v=>v.id===id); vehicles=vehicles.filter(v=>v.id!==id); if(target?.active && vehicles[0]) vehicles[0].active=true; editingVehicleId=null; screen='garage'; render(); });
    app.querySelectorAll('[data-topup]').forEach(b => b.addEventListener('click', () => { walletTopUp=Number(b.dataset.topup); render(); }));
    app.querySelector('[data-confirm-topup]')?.addEventListener('click',()=>{walletBalance+=walletTopUp;accountMessage=`${walletTopUp.toLocaleString()} AMD added to Wallet.`;addSystemNotification('Wallet topped up',`${walletTopUp.toLocaleString()} AMD added. New balance ${walletBalance.toLocaleString()} AMD.`,'payment','payment-detail','View Wallet');screen='account';activeTab='account';render();});
app.querySelector('[data-auto-topup-toggle]')?.addEventListener('change', e=>{autoTopUp.enabled=e.target.checked;render();});
    app.querySelector('[data-save-auto-topup]')?.addEventListener('click',()=>{autoTopUp.threshold=Number(document.querySelector('#auto-threshold')?.value||autoTopUp.threshold);autoTopUp.amount=Number(document.querySelector('#auto-amount')?.value||autoTopUp.amount);accountMessage='Automatic top-up saved.';render();});
    app.querySelectorAll('[data-select-payment]').forEach(b=>b.addEventListener('click',()=>{selectedPaymentId=Number(b.dataset.selectPayment);render();}));
    app.querySelector('[data-add-payment]')?.addEventListener('click',()=>{const id=Date.now();paymentMethods.push({id,brand:'MC',last4:String(id).slice(-4),expiry:'12/30',active:false});selectedPaymentId=id;accountMessage='Demo card added.';render();});
    app.querySelector('[data-remove-payment]')?.addEventListener('click',e=>{const id=Number(e.target.dataset.removePayment);const target=paymentMethods.find(p=>p.id===id);if(target?.active){accountMessage='Choose another default card before removing this one.';render();return;}paymentMethods=paymentMethods.filter(p=>p.id!==id);selectedPaymentId=paymentMethods[0]?.id||0;accountMessage='Payment card removed.';render();});
    app.querySelectorAll('[data-notifications]').forEach(b => b.addEventListener('click', () => { screen = 'notifications'; render(); }));
    app.querySelector('[data-open-notification-settings]')?.addEventListener('click', () => { notificationSettingsMessage=''; screen='notification-settings'; render(); });
    app.querySelectorAll('[data-notification-toggle]').forEach(input => input.addEventListener('change', e => { const key=e.target.dataset.notificationToggle; notificationPreferences[key]=e.target.checked; notificationSettingsMessage=''; render(); }));
    app.querySelector('[data-save-notification-settings]')?.addEventListener('click', () => { const start=document.querySelector('#quiet-start')?.value; const end=document.querySelector('#quiet-end')?.value; if(start) notificationPreferences.quietStart=start; if(end) notificationPreferences.quietEnd=end; notificationSettingsMessage='Notification preferences saved.'; render(); });
    app.querySelectorAll('[data-open-support]').forEach(b => b.addEventListener('click', () => { screen = 'support'; render(); }));
    app.querySelectorAll('[data-report-problem]').forEach(b => b.addEventListener('click', () => { reportSubmitted = false; screen = 'report-problem'; render(); }));
    app.querySelectorAll('[data-simple-back]').forEach(b => b.addEventListener('click', () => { const back=b.dataset.simpleBack; activeTab = back === 'charging' ? 'charge' : 'account'; screen = back === 'charging' ? 'charging' : back === 'map' ? 'map' : back === 'garage' ? 'garage' : back === 'security' ? 'security' : back === 'privacy' ? 'privacy' : back === 'legal' ? 'legal' : back === 'support' ? 'support' : back === 'support-tickets' ? 'support-tickets' : back === 'navigation-active' ? 'navigation-active' : back === 'reservation-manage' ? 'reservation-manage' : back === 'location' ? 'location' : 'account'; render(); }));
    app.querySelectorAll('[data-notification-filter]').forEach(b => b.addEventListener('click', () => { notificationFilter=b.dataset.notificationFilter || 'all'; render(); }));
    app.querySelector('[data-mark-read]')?.addEventListener('click', () => { notifications.forEach(n=>n.unread=false); render(); });
    app.querySelectorAll('[data-notification-id]').forEach(b => b.addEventListener('click', () => { const n=notifications.find(x=>x.id===Number(b.dataset.notificationId)); if(n){n.unread=false;selectedNotificationId=n.id;screen='notification-detail';render();} }));
    app.querySelectorAll('[data-notification-delete]').forEach(b => b.addEventListener('click', () => { const id=Number(b.dataset.notificationDelete);notifications=notifications.filter(n=>n.id!==id);screen='notifications';render(); }));
    app.querySelectorAll('[data-notification-open]').forEach(b => b.addEventListener('click', () => { const n=notifications.find(x=>x.id===Number(b.dataset.notificationOpen));if(!n)return;n.unread=false;if(n.target==='session-detail'){selectedActivityId=latestCompletedSessionId;activeTab='activity';screen='session-detail';}else if(n.target==='payment-detail'){selectedActivityId=latestPaymentId;activeTab='activity';screen='payment-detail';}else if(n.target==='reservation-manage'){appState='reserved';screen='reservation-manage';}else if(n.target==='charging-summary'){activeTab='charge';screen='charging-summary';}else if(n.target==='location'){selectedStation=stations[1]||selectedStation;activeTab='map';screen='location';}render(); }));
    app.querySelectorAll('[data-support-topic]').forEach(b => b.addEventListener('click', () => { supportTopic=b.dataset.supportTopic || supportTopic; render(); }));
    app.querySelector('[data-support-search]')?.addEventListener('input', e => { supportQuery=e.target.value; });
    app.querySelector('[data-support-search]')?.addEventListener('keydown', e => { if(e.key==='Enter'){supportQuery=e.target.value;render();} });
    app.querySelector('[data-open-ticket-list]')?.addEventListener('click',()=>{screen='support-tickets';render();});
    app.querySelectorAll('[data-open-support-ticket]').forEach(b=>b.addEventListener('click',()=>{selectedSupportTicketId=b.dataset.openSupportTicket;supportMessage='';screen='support-ticket-detail';render();}));
    app.querySelectorAll('[data-open-faq]').forEach(b=>b.addEventListener('click',()=>{window.__faqId=b.dataset.openFaq;screen='faq-detail';render();}));
    app.querySelector('[data-send-support-reply]')?.addEventListener('click',()=>{const text=document.querySelector('#support-reply')?.value.trim();if(!text)return;const t=supportTickets.find(x=>x.id===selectedSupportTicketId);t?.messages.push({from:'You',time:'Now',text});if(t){t.updated='Now';t.status='In progress';}supportMessage='Message sent to support.';render();});
    app.querySelector('[data-close-support-ticket]')?.addEventListener('click',()=>{const t=supportTickets.find(x=>x.id===selectedSupportTicketId);if(t){t.status='Resolved';t.updated='Now';}supportMessage='Support request closed.';render();});
    app.querySelectorAll('[data-support-rating]').forEach(b=>b.addEventListener('click',()=>{supportRating=Number(b.dataset.supportRating);supportMessage='Thank you for rating support.';render();}));
    app.querySelector('[data-emergency-support]')?.addEventListener('click',()=>{supportMessage='Emergency call action simulated. In production this opens the phone dialer.';render();});
    app.querySelectorAll('[data-live-chat]').forEach(b=>b.addEventListener('click', () => { const t=supportTickets.find(x=>x.id==='VD-M-2048')||supportTickets[0]; selectedSupportTicketId=t.id; supportMessage='Live chat opened. A support specialist is joining the conversation.'; screen='support-ticket-detail'; render(); }));
    app.querySelector('[data-submit-report]')?.addEventListener('click', () => { reportSubmitted=true; if(!supportTickets.some(t=>t.id==='VD-M-2048')) supportTickets.unshift({id:'VD-M-2048',title:'Charging stopped unexpectedly',category:'Charger problem',status:'In progress',priority:'High',updated:'Now',station:'Northern Avenue Hub',charger:'Charger 04',messages:[{from:'You',time:'Now',text:'Charging stopped after several minutes and did not resume.'}]}); render(); });
    app.querySelector('[data-return-charge]')?.addEventListener('click', () => { activeTab='charge'; screen='charging'; render(); });
    app.querySelectorAll('[data-state]').forEach(b => b.addEventListener('click', () => { appState = b.dataset.state; render(); }));
    app.querySelectorAll('[data-activity-tab]').forEach(b => b.addEventListener('click', () => { activitySection = b.dataset.activityTab || 'sessions'; activityQuery=''; render(); }));
    app.querySelector('[data-activity-search]')?.addEventListener('input', e => { activityQuery = e.target.value; render(); });
    app.querySelector('[data-activity-range]')?.addEventListener('change', e => { activityRange = e.target.value; render(); });
    app.querySelectorAll('[data-open-session]').forEach(b=>b.addEventListener('click',()=>{selectedActivityId=b.dataset.openSession;activityMessage='';screen='session-detail';render();}));
    app.querySelectorAll('[data-open-activity-reservation]').forEach(b=>b.addEventListener('click',()=>{selectedActivityId=b.dataset.openActivityReservation;screen='activity-reservation-detail';render();}));
    app.querySelectorAll('[data-open-payment]').forEach(b=>b.addEventListener('click',()=>{selectedActivityId=b.dataset.openPayment;activityMessage='';screen='payment-detail';render();}));
    app.querySelectorAll('[data-view-receipt]').forEach(b=>b.addEventListener('click',()=>{selectedActivityId=b.dataset.viewReceipt;screen='receipt';render();}));
    app.querySelectorAll('[data-email-receipt]').forEach(b=>b.addEventListener('click',()=>{activityMessage='Receipt sent to '+profile.email;render();}));
    app.querySelector('[data-download-invoice]')?.addEventListener('click',()=>{activityMessage='PDF invoice prepared in prototype mode.';render();});
    app.querySelectorAll('[data-request-refund]').forEach(b=>b.addEventListener('click',()=>{selectedActivityId=b.dataset.requestRefund;activityMessage='';screen='refund-request';render();}));
    app.querySelectorAll('[data-dispute-payment]').forEach(b=>b.addEventListener('click',()=>{selectedActivityId=b.dataset.disputePayment;activityMessage='';screen='payment-dispute';render();}));
    app.querySelector('#refund-reason')?.addEventListener('change',e=>{refundReason=e.target.value;});
    app.querySelector('[data-submit-refund]')?.addEventListener('click',()=>{activityMessage='Refund request RF-10903 submitted. We will notify you after review.';screen='session-detail';render();});
    app.querySelector('#dispute-reason')?.addEventListener('change',e=>{disputeReason=e.target.value;});
    app.querySelector('[data-submit-dispute]')?.addEventListener('click',()=>{activityMessage='Billing report BR-2041 submitted to support.';screen='payment-detail';render();});

    app.querySelector('[data-open-parking]')?.addEventListener('click',()=>{parkingSession={stage:'grace',graceMinutes:10,idleMinutes:0,idleCost:0,extensionMinutes:30,bay:reservation.bay||'B-12',message:''};screen='parking-monitor';render();});
    app.querySelector('[data-simulate-idle]')?.addEventListener('click',()=>{parkingSession.stage='idle';parkingSession.idleMinutes=Math.max(6,parkingSession.idleMinutes||0);parkingSession.idleCost=parkingSession.idleMinutes*50;parkingSession.message='Grace period ended. Idle fee is now active.';screen='parking-monitor';render();});
    app.querySelector('[data-extend-parking]')?.addEventListener('click',()=>{screen='parking-extend';render();});
    app.querySelectorAll('[data-parking-extension]').forEach(b=>b.addEventListener('click',()=>{parkingSession.extensionMinutes=Number(b.dataset.parkingExtension);render();}));
    app.querySelector('[data-confirm-parking-extension]')?.addEventListener('click',()=>{parkingSession.stage='extended';parkingSession.message=`Parking extended by ${parkingSession.extensionMinutes} minutes.`;screen='parking-monitor';render();});
    app.querySelector('[data-parking-complete]')?.addEventListener('click',()=>{finalizeParkingSession();screen='parking-complete';render();});
    app.querySelector('[data-parking-home]')?.addEventListener('click',()=>{appState='completed';activeTab='home';screen='home';render();});
    app.querySelector('[data-open-activity]')?.addEventListener('click',()=>{activeTab='activity';activitySection='sessions';screen='activity';render();});
    app.querySelector('[data-primary]')?.addEventListener('click', e => {
        const action = e.currentTarget.dataset.primary;
        if (action === 'map') {
            activeTab = 'map';
            screen = 'map';
        }
        else if (action === 'navigate') { navigationState={source:'reservation',started:false,progress:0,arrived:false,arrivalConfirmed:false}; screen='navigation-preview'; }
        else if (action === 'active-charge') { activeTab = 'charge'; screen = 'charging'; }
        else if (action === 'summary') { activeTab = 'charge'; screen = 'charging-summary'; }
        else appState = action;
        render();
    });
    app.querySelector('[data-map-search]')?.addEventListener('input', e => { mapQuery=e.target.value; });
    app.querySelector('[data-map-search]')?.addEventListener('keydown', e => { if(e.key==='Enter'){ mapQuery=e.target.value; render(); } });
    app.querySelector('[data-open-map-filters]')?.addEventListener('click', () => { screen='map-filters'; render(); });
    app.querySelectorAll('[data-map-view]').forEach(b=>b.addEventListener('click',()=>{mapView=b.dataset.mapView;render();}));
    app.querySelector('[data-open-favorites]')?.addEventListener('click',()=>{showFavoritesOnly=!showFavoritesOnly;mapView='list';render();});
    app.querySelector('[data-map-sort]')?.addEventListener('change',e=>{mapSort=e.target.value;render();});
    app.querySelectorAll('[data-quick-filter]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.quickFilter;mapFilters[key]=!mapFilters[key];render();}));
    app.querySelectorAll('[data-map-filter-toggle]').forEach(x=>x.addEventListener('change',e=>{mapFilters[e.target.dataset.mapFilterToggle]=e.target.checked;render();}));
    app.querySelector('[data-map-price]')?.addEventListener('input',e=>{mapFilters.maxPrice=Number(e.target.value);const out=document.querySelector('#map-price-value');if(out)out.textContent=mapFilters.maxPrice+' AMD/kWh';});
    app.querySelector('[data-apply-map-filters]')?.addEventListener('click',()=>{screen='map';render();});
    app.querySelectorAll('[data-clear-map-filters]').forEach(b=>b.addEventListener('click',()=>{mapQuery='';mapFilters={available:false,fast:false,reservable:false,parking:false,maxPrice:150};screen='map';render();}));
    app.querySelectorAll('[data-favorite-station]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const id=Number(b.dataset.favoriteStation);favoriteStations.has(id)?favoriteStations.delete(id):favoriteStations.add(id);render();}));
    app.querySelectorAll('[data-open-location]').forEach(b=>b.addEventListener('click',()=>{selectedStation=stations.find(s=>s.id===Number(b.dataset.openLocation))||stations[0];screen='location';render();}));
    app.querySelectorAll('[data-start-navigation]').forEach(b=>b.addEventListener('click',()=>{navigationState={source:(screen==='reservation-success'||screen==='reservation-manage')?'reservation':'location',started:false,progress:0,arrived:false,arrivalConfirmed:false};navigationMessage='';screen='navigation-preview';render();}));
    app.querySelector('[data-join-waiting-list]')?.addEventListener('click',()=>{waitingListJoined=true;screen='waiting-list';render();});
    app.querySelector('[data-start-route]')?.addEventListener('click',()=>{navigationState.started=true;navigationState.progress=38;screen='navigation-active';render();});
    app.querySelector('[data-open-location-from-navigation]')?.addEventListener('click',()=>{activeTab='map';screen='location';render();});
    app.querySelector('[data-simulate-arrival]')?.addEventListener('click',()=>{navigationState.progress=100;navigationState.arrived=true;screen='arrival';render();});
    app.querySelector('[data-stop-navigation]')?.addEventListener('click',()=>{navigationState.started=false;screen=navigationState.source==='reservation'?'reservation-manage':'location';render();});
    app.querySelector('[data-arrival-confirm]')?.addEventListener('click',()=>{navigationState.arrivalConfirmed=true;reservationMessage='Arrival confirmed · Charger '+reservation.charger+' is protected for you.';navigationMessage=reservationMessage;render();});
    app.querySelector('[data-arrival-start-charge]')?.addEventListener('click',()=>{startCharge.connector=reservation.charger||'04';activeTab='charge';screen='charger-check';render();});
    app.querySelector('[data-arrival-station-help]')?.addEventListener('click',()=>{supportTopic='Reservation help';screen='support';render();});

    app.querySelectorAll('[data-station]').forEach(b => b.addEventListener('click', () => { selectedStation = stations.find(s => s.id === Number(b.dataset.station)) || stations[0]; render(); }));
    app.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => { filter = b.dataset.filter || 'Available'; render(); }));
    app.querySelector('[data-open-selected]')?.addEventListener('click', () => { screen = 'location'; render(); });
    app.querySelector('[data-open-station]')?.addEventListener('click', () => { selectedStation = stations[0]; activeTab = 'map'; screen = 'location'; render(); });
    app.querySelector('[data-home-reservation]')?.addEventListener('click',()=>{ if(appState==='reserved'){screen='reservation-manage';} else {reservationMode='create';reservationStep=1;screen='reservation';} render();});
    app.querySelector('[data-toggle-home-vehicles]')?.addEventListener('click',()=>{homeVehicleMenuOpen=!homeVehicleMenuOpen;render();});
    app.querySelectorAll('[data-home-vehicle]').forEach(b=>b.addEventListener('click',()=>{vehicles.forEach(v=>v.active=v.id===Number(b.dataset.homeVehicle));homeVehicleMenuOpen=false;render();}));
    app.querySelectorAll('[data-home-scenario]').forEach(b=>b.addEventListener('click',()=>{homeScenario=b.dataset.homeScenario;activeTab='home';screen='home';render();}));
    app.querySelector('[data-retry-home]')?.addEventListener('click',()=>{homeScenario='normal';render();});
    app.querySelector('[data-show-alternatives]')?.addEventListener('click',()=>{homeScenario='station-unavailable';render();});
    app.querySelectorAll('[data-open-station-alt]').forEach(b=>b.addEventListener('click',()=>{selectedStation=stations.find(s=>s.id===Number(b.dataset.openStationAlt))||stations[0];activeTab='map';screen='location';render();}));
    app.querySelector('[data-back-map]')?.addEventListener('click', () => { screen = 'map'; render(); });
    app.querySelector('[data-reserve]')?.addEventListener('click', () => { reservationMode='create'; reservationStep = 1; reservationMessage=''; screen = 'reservation'; render(); });
    app.querySelector('[data-back-location]')?.addEventListener('click', () => { screen = 'location'; render(); });
    app.querySelector('[data-back-reservation]')?.addEventListener('click', () => { screen = reservationMode==='edit'?'reservation-manage':'location'; render(); });
    app.querySelectorAll('[data-res-type]').forEach(b => b.addEventListener('click', () => { reservation.type = b.dataset.resType; render(); }));
    app.querySelectorAll('[data-res-vehicle]').forEach(b => b.addEventListener('click', () => { reservation.vehicle = b.dataset.resVehicle; render(); }));
    app.querySelectorAll('[data-res-date]').forEach(b => b.addEventListener('click', () => { reservation.date = b.dataset.resDate; reservation.time = reservation.date.startsWith('Tomorrow')?'10:00':reservation.date.startsWith('Saturday')?'13:00':'11:30'; render(); }));
    app.querySelectorAll('[data-time]').forEach(b => b.addEventListener('click', () => { reservation.time = b.dataset.time; render(); }));
    app.querySelector('[data-duration]')?.addEventListener('input', e => { reservation.duration = Number(e.target.value); document.querySelector('#duration-value').textContent = reservation.duration + ' min'; });
    app.querySelector('[data-target]')?.addEventListener('input', e => { reservation.target = Number(e.target.value); document.querySelector('#target-value').textContent = reservation.target + '%'; });
    app.querySelector('[data-next-step]')?.addEventListener('click', () => { reservationStep = Math.min(3, reservationStep + 1); render(); });
    app.querySelector('[data-prev-step]')?.addEventListener('click', () => { reservationStep = Math.max(1, reservationStep - 1); render(); });
    app.querySelector('[data-terms]')?.addEventListener('change', e => { reservationTermsAccepted = e.target.checked; });
    app.querySelector('[data-confirm-reservation]')?.addEventListener('click', () => { if(!reservationTermsAccepted){reservationMessage='Accept the reservation conditions to continue.';render();return;} const rid=nextRecordId('VD-RS',activityReservations); activeReservation={...reservation,id:rid,status:'Confirmed'}; activityReservations.unshift({id:rid,place:selectedStation.name,date:`${reservation.date}, ${reservation.time}`,status:'Confirmed',bay:reservation.bay,charger:reservation.charger,fee:500,vehicle:reservation.vehicle}); addSystemNotification('Reservation confirmed',`${selectedStation.name} · ${reservation.date}, ${reservation.time}`,'reserved','reservation-manage','Manage reservation'); appState='reserved'; reservationMessage=''; screen = 'reservation-success'; render(); });
    app.querySelector('[data-finish-reservation]')?.addEventListener('click', () => { appState = 'reserved'; activeTab = 'home'; screen = 'home'; render(); });
    app.querySelector('[data-open-reservation-manage]')?.addEventListener('click',()=>{screen='reservation-manage';reservationMessage='';render();});
    app.querySelectorAll('[data-modify-reservation]').forEach(b=>b.addEventListener('click',()=>{reservationMode='edit';reservationStep=1;reservationMessage='';screen='reservation';render();}));
    app.querySelector('[data-cancel-reservation]')?.addEventListener('click',()=>{screen='reservation-cancel';render();});
    app.querySelector('#cancel-reason')?.addEventListener('change',e=>{cancellationReason=e.target.value;render();});
    app.querySelector('[data-confirm-cancel]')?.addEventListener('click',()=>{cancelActiveReservation();reservationMessage='Reservation cancelled. 500 AMD returned to your wallet.';activeTab='home';screen='home';render();});
    app.querySelector('[data-confirm-arrival]')?.addEventListener('click',()=>{navigationState={source:'reservation',started:false,progress:100,arrived:true,arrivalConfirmed:false};navigationMessage='';screen='arrival';render();});
    app.querySelector('[data-simulate-no-show]')?.addEventListener('click',()=>{activeReservation=null;appState='idle';screen='reservation-no-show';render();});
    app.querySelectorAll('[data-use-alternative]').forEach(b=>b.addEventListener('click',()=>{selectedStation=stations.find(x=>x.id===Number(b.dataset.useAlternative))||stations[0];waitingListJoined=false;reservationMode='create';reservationStep=1;screen='reservation';render();}));
    app.querySelector('[data-leave-waiting-list]')?.addEventListener('click',()=>{waitingListJoined=false;screen='location';render();});
    app.querySelectorAll('[data-scan-charger]').forEach(b=>b.addEventListener('click',()=>{activeTab='charge';screen='charge-scan';chargeStartMessage='';render();}));
    app.querySelector('[data-begin-scan]')?.addEventListener('click',()=>{screen='charge-scan';render();});
    app.querySelector('[data-check-code]')?.addEventListener('click',()=>{const code=document.querySelector('#charger-code')?.value?.trim();if(!code){chargeStartMessage='Enter the charger code.';render();return;}startCharge.code=code;startCharge.connector=code.includes('07')?'07':'04';screen='charger-check';chargeStartMessage='';render();});
    app.querySelector('[data-simulate-scan]')?.addEventListener('click',()=>{startCharge.code='VD-04-CCS2';startCharge.connector='04';screen='charger-check';render();});
    app.querySelector('[data-use-reserved-charger]')?.addEventListener('click',()=>{startCharge.connector=reservation.charger||'04';screen='charger-check';render();});
    app.querySelectorAll('[data-start-with-connector]').forEach(b=>b.addEventListener('click',()=>{startCharge.connector=b.dataset.startWithConnector;activeTab='charge';screen='charger-check';render();}));
    app.querySelector('[data-connector-ready]')?.addEventListener('click',()=>{screen='connector-select';render();});
    app.querySelectorAll('[data-select-start-connector]').forEach(b=>b.addEventListener('click',()=>{startCharge.connector=b.dataset.selectStartConnector;render();}));
    app.querySelector('[data-confirm-connector]')?.addEventListener('click',()=>{screen='payment-authorize';render();});
    app.querySelectorAll('[data-start-payment]').forEach(b=>b.addEventListener('click',()=>{startCharge.payment=b.dataset.startPayment;render();}));
    app.querySelector('[data-authorize-payment]')?.addEventListener('click',()=>{screen='tariff-review';render();});
    app.querySelector('[data-start-terms]')?.addEventListener('change',e=>{startCharge.accepted=e.target.checked;});
    app.querySelector('[data-start-session]')?.addEventListener('click',()=>{if(!startCharge.accepted){chargeStartMessage='Accept the tariff and charging conditions.';render();return;}startCharge.stage='ready';screen='charge-connecting';render();});
    app.querySelector('[data-finish-connecting]')?.addEventListener('click',()=>{if(startCharge.stage==='ready'){startCharge.stage='starting';render();return;}appState='charging';charging.paused=false;activeTab='charge';screen='charging';render();});
    app.querySelectorAll('[data-start-error]').forEach(b=>b.addEventListener('click',()=>{startCharge.error=b.dataset.startError;screen='charge-start-error';render();}));
    app.querySelector('[data-retry-start]')?.addEventListener('click',()=>{screen=startCharge.error==='payment'?'payment-authorize':startCharge.error==='vehicle'?'charger-check':'charge-start';startCharge.error='';render();});
    app.querySelector('[data-charge-limit]')?.addEventListener('click', () => { charging.target = charging.target === 90 ? 80 : charging.target === 80 ? 100 : 90; render(); });
    app.querySelector('[data-charge-speed]')?.addEventListener('click', () => { charging.speed = charging.speed === 'Maximum' ? 'Balanced' : charging.speed === 'Balanced' ? 'Eco' : 'Maximum'; charging.power = charging.speed === 'Maximum' ? 142 : charging.speed === 'Balanced' ? 96 : 54; render(); });
    app.querySelector('[data-toggle-pause]')?.addEventListener('click', () => { charging.paused = !charging.paused; render(); });
    app.querySelector('[data-stop-charge]')?.addEventListener('click', () => { finalizeChargingSession(); screen = 'charging-summary'; render(); });
    app.querySelector('[data-summary-home]')?.addEventListener('click', () => { appState = 'completed'; activeTab = 'home'; screen = 'home'; render(); });
    app.querySelector('[data-view-latest-receipt]')?.addEventListener('click',()=>{selectedActivityId=latestCompletedSessionId;activeTab='activity';screen='receipt';render();});
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
