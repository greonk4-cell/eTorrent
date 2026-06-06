/**
 * Android 4.4 KitKat Clone
 * Logic for boot sequence, clock, navigation, and Chrome app simulation.
 */

class AndroidSystem {
    constructor() {
        this.ui = document.getElementById('android-ui');
        this.bootScreen = document.getElementById('boot-screen');
        this.clockElement = document.getElementById('current-time');
        this.appDrawer = document.getElementById('app-drawer');
        this.appDrawerTrigger = document.getElementById('app-drawer-trigger');
        this.statusBar = document.getElementById('status-bar');
        this.quickSettings = document.getElementById('quick-settings');
        this.qsCloseTrigger = document.getElementById('qs-back-to-notifications');
        this.chromeApp = document.getElementById('chrome-app');
        this.googleApp = document.getElementById('google-app');
        this.youtubeApp = document.getElementById('youtube-app');
        this.playStoreApp = document.getElementById('play-store-app');
        this.phoneApp = document.getElementById('phone-app');
        this.hangoutsApp = document.getElementById('hangouts-app');
        this.cameraApp = document.getElementById('camera-app');
        this.whatsappApp = document.getElementById('whatsapp-app');
        this.facebookApp = document.getElementById('facebook-app');
        this.settingsApp = document.getElementById('settings-app');
        this.downloadsApp = document.getElementById('downloads-app');
        this.galleryApp = document.getElementById('gallery-app');
        this.recentAppsScreen = document.getElementById('recent-apps-screen');
        this.recentAppsList = document.getElementById('recent-apps-list');
        this.recentAppsEmpty = document.getElementById('recent-apps-empty');
        this.shutterBtn = document.getElementById('camera-shutter');
        this.focusRing = document.querySelector('.focus-ring');
        
        // Calculator state
        this.calcExpression = "";

        this.lockScreen = document.getElementById('lock-screen');
        this.lockHandle = document.getElementById('lock-handle');
        this.lockTime = document.getElementById('lock-time');
        this.lockDate = document.getElementById('lock-date');
        this.lockCameraShortcut = document.getElementById('lock-camera-shortcut');

        this.navBack = document.getElementById('nav-back');
        this.navHome = document.getElementById('nav-home');
        this.navRecent = document.getElementById('nav-recent');

        // History of opened apps for the "Recent Apps" screen
        this.openedApps = []; 
        this.appMetadata = {
            chrome: { name: 'Chrome', icon: '/chrome_icon_appdrawer.png', preview: '/webpage_default_asset.png' },
            google: { name: 'Google', icon: '/google_icon_appdrawer.png', preview: '/google_icon_appdrawer.png' },
            youtube: { name: 'YouTube', icon: '/youtube_icon_appdrawer.png', preview: '/youtube_icon_appdrawer.png' },
            pixel_racer: { name: 'Pixel Racer', icon: '/play_game_icon_1.png', preview: '/play_game_icon_1.png' },
            phone: { name: 'Phone', icon: '/phone_icon_dock.png', preview: '/phone_icon_dock.png' },
            hangouts: { name: 'Hangouts', icon: '/hangouts_icon_dock.png', preview: '/hangouts_icon_dock.png' },
            camera: { name: 'Camera', icon: '/camera_icon_appdrawer.png', preview: '/camera_shortcut_lockscreen.png' },
            settings: { name: 'Settings', icon: '/settings_icon_appdrawer.png', preview: '/settings_app_header.png' },
            downloads: { name: 'Downloads', icon: '/downloads_icon_appdrawer.png', preview: '/downloads_app_interface.png' },
            gallery: { name: 'Gallery', icon: '/gallery_icon_appdrawer.png', preview: '/gallery_image_1.png' },
            playstore: { name: 'Play Store', icon: '/play_store_icon_with_text.png', preview: '/play_store_icon_with_text.png' },
            calculator: { name: 'Calculator', icon: '/calculator_icon_appdrawer.png', preview: '/calculator_icon_appdrawer.png' },
            clock: { name: 'Clock', icon: '/clock_icon_appdrawer.png', preview: '/clock_icon_appdrawer.png' },
            maps: { name: 'Maps', icon: '/maps_icon_appdrawer.png', preview: '/maps_map_view.png' },
            gmail: { name: 'Gmail', icon: '/gmail_icon_appdrawer.png', preview: '/gmail_icon_appdrawer.png' },
            messenger: { name: 'Messenger', icon: '/google_messenger_icon_appdrawer.png', preview: '/google_messenger_icon_appdrawer.png' },
            googleplus: { name: 'Google+', icon: '/googleplus_icon_appdrawer.png', preview: '/googleplus_icon_appdrawer.png' },
            whatsapp: { name: 'WhatsApp', icon: '/whatsapp_icon.png', preview: '/whatsapp_icon.png' },
            facebook: { name: 'Facebook', icon: '/facebook_icon.png', preview: '/facebook_icon.png' },
            email: { name: 'Email', icon: '/email_icon_appdrawer.png', preview: '/email_icon_appdrawer.png' },
            play_music: { name: 'Play Music', icon: '/play_music_icon_appdrawer.png', preview: '/play_music_icon_appdrawer.png' },
            play_books: { name: 'Play Books', icon: '/play_books_icon_appdrawer.png', preview: '/play_books_icon_appdrawer.png' },
            play_games: { name: 'Play Games', icon: '/play_games_icon_appdrawer.png', preview: '/play_games_icon_appdrawer.png' }
        };

        this.init();
    }

    init() {
        // 1. Start boot sequence
        this.handleBoot();

        // 2. Start clock
        this.updateClock();
        this.updateAnalogClock();
        setInterval(() => {
            this.updateClock();
            this.updateAnalogClock();
        }, 1000);

        // 3. Setup event listeners
        this.setupListeners();

        // 3.5 Setup recovery long-press listener on boot screen
        this.setupRecoveryListener();

        // 4. Setup Chrome address/search handling
        this.setupChromeSearch();

        // 5. Initialize additional system logic
        this.initSystemLogic();
    }

    initSystemLogic() {
        // Initialize Stopwatch & Timer variables
        this.stopwatch = { start: 0, elapsed: 0, timer: null, running: false };
        this.timer = { duration: 0, remaining: 0, interval: null, running: false };
        
        // Google Now Navigation
        document.querySelectorAll('.gn-card-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.textContent === 'NAVIGATE') {
                    this.openMaps();
                    this.playClickSound();
                }
            });
        });

        // Widget Drawer Clicks
        const widgetGridItems = document.querySelectorAll('#widgets-grid .widget-item');
        widgetGridItems.forEach(item => {
            item.addEventListener('click', () => {
                const label = item.querySelector('span').textContent.toLowerCase();
                if (label.includes('analog clock')) {
                    document.getElementById('widget-clock').classList.toggle('hidden');
                } else if (label.includes('power control')) {
                    document.getElementById('widget-power').classList.toggle('hidden');
                } else if (label.includes('google search')) {
                    alert('Google Search widget is already standard on your home screen!');
                }
                this.toggleAppDrawer(false);
                this.playClickSound();
            });
        });
    }

    handleBoot() {
        // KitKat boot duration set to 4 seconds as requested.
        setTimeout(() => {
            this.bootScreen.classList.add('hidden');
            this.ui.classList.remove('hidden');
            this.playSound('/WirelessChargingStarted.ogg');
        }, 4000);
    }

    updateClock() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const timeStr = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
        this.clockElement.textContent = timeStr;

        const widgetClock = document.querySelector('.widget-clock-content');
        if (widgetClock) widgetClock.textContent = timeStr;

        if (this.lockTime) {
            this.lockTime.textContent = timeStr;
        }
        if (this.lockDate) {
            const options = { weekday: 'long', month: 'long', day: 'numeric' };
            this.lockDate.textContent = now.toLocaleDateString('en-US', options).toUpperCase();
        }
    }

    updateAnalogClock() {
        const clockApp = document.getElementById('clock-app');
        if (clockApp.classList.contains('hidden')) return;

        const now = new Date();
        const sec = now.getSeconds();
        const min = now.getMinutes();
        const hour = now.getHours();
        
        const sDeg = (sec / 60) * 360;
        const mDeg = (min / 60) * 360 + (sec / 60) * 6;
        const hDeg = (hour % 12 / 12) * 360 + (min / 60) * 30;

        const sHand = document.querySelector('.hand.second');
        const mHand = document.querySelector('.hand.minute');
        const hHand = document.querySelector('.hand.hour');
        
        if (sHand) sHand.style.transform = `translateX(-50%) rotate(${sDeg}deg)`;
        if (mHand) mHand.style.transform = `translateX(-50%) rotate(${mDeg}deg)`;
        if (hHand) hHand.style.transform = `translateX(-50%) rotate(${hDeg}deg)`;
    }

    setupListeners() {
        // App Drawer Toggle
        this.appDrawerTrigger.addEventListener('click', () => {
            this.toggleAppDrawer(true);
        });

        // App Drawer Tab Switching
        const drawerTabs = document.querySelectorAll('#app-drawer .tab');
        drawerTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                drawerTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const target = tab.getAttribute('data-target');
                document.getElementById('apps-grid').classList.toggle('hidden', target !== 'apps-grid');
                document.getElementById('widgets-grid').classList.toggle('hidden', target !== 'widgets-grid');
                this.playClickSound();
            });
        });

        // Quick Settings Toggle
        this.statusBar.addEventListener('click', () => {
            this.toggleQuickSettings(true);
        });

        this.qsCloseTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleQuickSettings(false);
        });

        // Navigation Buttons
        this.navHome.addEventListener('click', () => {
            this.toggleAppDrawer(false);
            this.closeApps();
            this.playClickSound();
        });

        this.navBack.addEventListener('click', () => {
            if (!this.quickSettings.classList.contains('panel-hidden')) {
                this.toggleQuickSettings(false);
            } else if (!this.appDrawer.classList.contains('hidden')) {
                this.toggleAppDrawer(false);
            } else {
                this.closeApps();
            }
            this.playClickSound();
        });

        this.navRecent.addEventListener('click', () => {
            if (!this.recentAppsScreen.classList.contains('hidden')) {
                this.closeApps();
            } else {
                this.openRecentApps();
            }
            this.playClickSound();
        });

        // Lock Screen Interaction
        const handleStart = (e) => {
            this.vibrate();
            this.unlock();
        };
        this.lockHandle.addEventListener('mousedown', handleStart);
        this.lockHandle.addEventListener('touchstart', handleStart);

        this.lockCameraShortcut.addEventListener('click', (e) => {
            e.stopPropagation();
            this.unlock(true);
        });

        // Search bar on home screen
        document.getElementById('google-search').addEventListener('click', () => {
            this.openGoogle();
            this.playSound('/Effect_Tick.ogg');
        });

        // App launches
        document.querySelectorAll('[data-app="chrome"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openChrome();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.querySelectorAll('[data-app="google"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openGoogle();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.querySelectorAll('[data-app="youtube"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openYouTube();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.getElementById('play-store-home').addEventListener('click', () => {
            this.openPlayStore();
            this.playSound('/Effect_Tick.ogg');
        });

        // Google App Search Logic
        const gSearchInput = document.getElementById('google-app-search-input');
        // the main google app container is named 'google-now-container' in the DOM
        const gMainView = document.getElementById('google-now-container');
        const gResultsView = document.getElementById('google-app-results');
        const gResultsQuery = document.getElementById('results-query');

        gSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = gSearchInput.value.trim();
                if (query) {
                    gResultsQuery.textContent = query;
                    gMainView.classList.add('hidden');
                    gResultsView.classList.remove('hidden');
                    this.playSound('/KeypressReturn.ogg');
                }
            }
        });

        document.querySelectorAll('[data-app="phone"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openPhone();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.querySelectorAll('[data-app="hangouts"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openHangouts();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.querySelectorAll('[data-app="camera"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openCamera();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.querySelectorAll('[data-app="settings"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openSettings();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.querySelectorAll('[data-app="downloads"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openDownloads();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.querySelectorAll('[data-app="gallery"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openGallery();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        // Gmail Drawer
        document.getElementById('gmail-drawer-trigger').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('gmail-drawer').classList.toggle('hidden');
        });

        document.getElementById('gmail-app').addEventListener('click', (e) => {
            if (!e.target.closest('#gmail-drawer')) {
                document.getElementById('gmail-drawer').classList.add('hidden');
            }
        });

        // Gallery sub-navigation
        document.querySelectorAll('.gallery-album-card').forEach(card => {
            card.addEventListener('click', () => {
                const bg = card.querySelector('.album-preview').style.backgroundImage;
                const url = bg.slice(5, -2).replace(/"/g, "");
                this.openGalleryViewer(url);
            });
        });

        document.getElementById('viewer-back').addEventListener('click', () => {
            document.getElementById('gallery-viewer').classList.add('hidden');
        });

        document.getElementById('cam-to-gallery').addEventListener('click', () => {
            this.openGallery();
        });

        document.querySelectorAll('[data-app="calculator"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openCalculator();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.querySelectorAll('[data-app="clock"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openClock();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        // Calendar app launcher
        document.querySelectorAll('[data-app="calendar"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openCalendar();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.querySelectorAll('[data-app="maps"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openMaps();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.querySelectorAll('[data-app="messenger"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openMessenger();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.querySelectorAll('[data-app="googleplus"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openGooglePlus();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.querySelectorAll('[data-app="whatsapp"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openWhatsApp();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.querySelectorAll('[data-app="facebook"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openFacebook();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.querySelectorAll('[data-app="pixel_racer"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openPixelRacer();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.querySelectorAll('[data-app="email"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openEmail();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.querySelectorAll('[data-app="play_music"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openPlayMusic();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.querySelectorAll('[data-app="play_books"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openPlayBooks();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.querySelectorAll('[data-app="play_games"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openPlayGames();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        document.querySelectorAll('[data-app="gmail"]').forEach(el => {
            el.addEventListener('click', () => {
                this.openGmail();
                this.playSound('/Effect_Tick.ogg');
            });
        });

        // Hangouts Sub-navigation
        document.querySelectorAll('.hangouts-item').forEach(item => {
            item.addEventListener('click', () => {
                const name = item.getAttribute('data-name');
                const color = item.getAttribute('data-color');
                this.openHangoutsChat(name, color);
            });
        });

        document.getElementById('chat-back').addEventListener('click', () => {
            document.getElementById('hangouts-chat-view').classList.add('hidden');
            document.getElementById('hangouts-list-view').classList.remove('hidden');
        });

        // YouTube Sub-navigation
        this.setupYouTubeListeners();

        // App Tab Sub-navigation (WhatsApp, Facebook)
        this.setupAppTabListeners();

        // Clock Tab Switching
        const clockTabs = document.querySelectorAll('.clock-tab');
        clockTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-tab');
                clockTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                ['clock', 'alarm', 'timer', 'stopwatch'].forEach(v => {
                    const el = document.getElementById(`clock-view-${v}`);
                    if (el) el.classList.add('hidden');
                });
                
                // If it's stopwatch, we need to create the view if it doesn't exist
                if (target === 'stopwatch') {
                    this.initStopwatchUI();
                }
                
                const targetView = document.getElementById(`clock-view-${target}`);
                if (targetView) targetView.classList.remove('hidden');
                this.playClickSound();
            });
        });

        // Settings Sub-panels
        document.querySelectorAll('.settings-item.clickable').forEach(item => {
            item.addEventListener('click', () => {
                const sub = item.getAttribute('data-sub');
                this.openSubSettings(sub);
            });
        });

        document.getElementById('sub-settings-back').addEventListener('click', () => {
            document.getElementById('settings-sub-panel').classList.add('hidden');
            document.getElementById('settings-main-list').classList.remove('hidden');
            this.playClickSound();
        });

        // Messenger detail interaction (Mock send)
        const msgInput = document.querySelector('.chat-input-area input');
        const msgSend = document.querySelector('.send-icon');
        const msgContainer = document.querySelector('.chat-messages');

        const sendMockMessage = () => {
            const val = msgInput.value.trim();
            if (val) {
                const msg = document.createElement('div');
                msg.className = 'message sent';
                msg.textContent = val;
                msgContainer.appendChild(msg);
                msgInput.value = '';
                msgContainer.scrollTop = msgContainer.scrollHeight;
                this.playSound('/KeypressStandard.ogg');
                
                // Mock reply
                setTimeout(() => {
                    const reply = document.createElement('div');
                    reply.className = 'message received';
                    reply.textContent = "Got it! Thanks.";
                    msgContainer.appendChild(reply);
                    msgContainer.scrollTop = msgContainer.scrollHeight;
                    this.playSound('/WirelessChargingStarted.ogg');
                }, 1500);
            }
        };

        msgSend.addEventListener('click', sendMockMessage);
        msgInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendMockMessage();
        });

        // Settings Tile in Quick Settings
        document.querySelector('.qs-tile:nth-child(2)').addEventListener('click', () => {
            this.toggleQuickSettings(false);
            this.openSettings();
        });

        // Camera Specific Listeners
        this.shutterBtn.addEventListener('click', () => {
            this.takePhoto();
        });

        document.getElementById('mode-video').addEventListener('click', () => {
            this.playSound('/VideoRecord.ogg');
        });

        // Dialpad logic
        const phoneDisplay = document.getElementById('phone-number');
        const phoneDelete = document.getElementById('phone-delete-btn');
        
        document.querySelectorAll('.dial-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.getAttribute('data-val');
                if (phoneDisplay.textContent.length < 15) {
                    phoneDisplay.textContent += val;
                    this.playSound('/KeypressStandard.ogg');
                    phoneDelete.classList.remove('hidden');
                }
            });
        });

        phoneDelete.addEventListener('click', () => {
            if (phoneDisplay.textContent.length > 0) {
                phoneDisplay.textContent = phoneDisplay.textContent.slice(0, -1);
                this.playSound('/KeypressDelete.ogg');
            }
            if (phoneDisplay.textContent.length === 0) {
                phoneDelete.classList.add('hidden');
            }
        });

        document.getElementById('phone-call-btn').addEventListener('click', () => {
            this.playSound('/WirelessChargingStarted.ogg');
        });

        // Settings Toggles
        document.querySelectorAll('.settings-slider').forEach(slider => {
            slider.addEventListener('click', () => {
                const currentSrc = slider.getAttribute('src');
                if (currentSrc.includes('on')) {
                    slider.setAttribute('src', '/off_slider_settings.png');
                } else {
                    slider.setAttribute('src', '/on_slider_settings.png');
                }
                this.playClickSound();
            });
        });

        // Calculator Logic
        const calcDisplay = document.querySelector('.calc-display');
        document.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.textContent;
                this.vibrate();
                this.playClickSound();

                if (val === '=') {
                    try {
                        // Replace symbols for eval
                        let expression = this.calcExpression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
                        const result = eval(expression);
                        this.calcExpression = result.toString();
                    } catch (e) {
                        this.calcExpression = "Error";
                    }
                } else if (val === 'C') { // We should add a clear button
                    this.calcExpression = "";
                } else {
                    if (this.calcExpression === "Error" || this.calcExpression === "0") this.calcExpression = "";
                    this.calcExpression += val;
                }
                calcDisplay.textContent = this.calcExpression || "0";
            });
        });

        // Play Store specific listeners
        this.setupPlayStoreListeners();

        // Simple haptic feedback simulation
        document.querySelectorAll('.dock-icon, .nav-icon, .app-icon-container, .drawer-item, .qs-tile').forEach(el => {
            el.addEventListener('click', () => {
                this.vibrate();
            });
        });
    }

    setupPlayStoreListeners() {
        const psTabs = document.querySelectorAll('.ps-tab');
        const psHeader = document.getElementById('ps-header');
        const psBanner = document.getElementById('ps-banner');
        const psDetailBack = document.getElementById('ps-detail-back');
        const psInstallBtn = document.getElementById('ps-install-btn');

        const psColors = {
            apps: '#4caf50',
            games: '#ff9800',
            movies: '#db4437',
            music: '#ff9800',
            books: '#03a9f4'
        };

        psTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const cat = tab.getAttribute('data-cat');
                psTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const color = psColors[cat];
                psHeader.style.backgroundColor = color;
                // ps-detail-header is a class in the DOM, not an ID — guard against null and select correctly
                const psDetailHeaderEl = document.querySelector('.ps-detail-header');
                if (psDetailHeaderEl) psDetailHeaderEl.style.backgroundColor = color;
                document.querySelectorAll('.ps-section-header').forEach(el => el.style.color = color);
                const psInstallBtnEl = document.getElementById('ps-install-btn');
                if (psInstallBtnEl) psInstallBtnEl.style.backgroundColor = color;

                const bannerTitle = document.querySelector('.ps-banner-title');
                const bannerSub = document.querySelector('.ps-banner-sub');
                bannerTitle.textContent = `New & Updated`;
                bannerSub.textContent = `${cat.charAt(0).toUpperCase() + cat.slice(1)} we love`;
                
                this.renderPlayStoreHome(cat);
                this.playClickSound();
            });
        });

        psDetailBack.addEventListener('click', () => {
            document.getElementById('ps-detail-view').classList.add('hidden');
            // If we came from my-apps or generic, show that; otherwise main view
            this.playClickSound();
        });

        // Search Overlay Trigger
        document.getElementById('ps-search-trigger').addEventListener('click', () => {
            document.getElementById('ps-search-overlay').classList.remove('hidden');
            document.getElementById('ps-search-list').classList.remove('hidden');
            document.getElementById('ps-search-results').classList.add('hidden');
            document.getElementById('ps-search-input').value = '';
            document.getElementById('ps-search-input').focus();
            this.playClickSound();
        });

        document.getElementById('ps-search-back').addEventListener('click', () => {
            document.getElementById('ps-search-overlay').classList.add('hidden');
        });

        const psSearchInput = document.getElementById('ps-search-input');
        psSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = psSearchInput.value.trim();
                if (val) {
                    this.performPlayStoreSearch(val);
                    this.playClickSound();
                }
            }
        });

        // Drawer logic
        const psDrawer = document.getElementById('ps-drawer');
        const psDrawerBtn = document.getElementById('ps-drawer-btn');
        const psDrawerOverlay = psDrawer.querySelector('.ps-drawer-overlay');

        psDrawerBtn.addEventListener('click', () => {
            psDrawer.classList.remove('ps-drawer-hidden');
            this.playClickSound();
        });

        psDrawerOverlay.addEventListener('click', () => {
            psDrawer.classList.add('ps-drawer-hidden');
        });

        document.querySelectorAll('.ps-drawer-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.getAttribute('data-action');
                const text = item.textContent.trim();
                
                document.querySelectorAll('.ps-drawer-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                if (text === 'Store Home') {
                    this.showPlayStoreView('home');
                } else if (action === 'my-apps' || text.includes('My apps')) {
                    this.openMyApps();
                } else if (text === 'Redeem') {
                    this.showPlayStoreView('generic');
                    document.getElementById('ps-generic-title').textContent = 'Redeem Code';
                    document.getElementById('ps-generic-icon').textContent = '🎫';
                    document.getElementById('ps-generic-text').innerHTML = '<input type="text" placeholder="Enter code" style="width:100%; padding:10px; margin-top:20px; border:1px solid #ddd;"><button style="margin-top:10px; background:#4caf50; color:white; border:none; padding:10px 20px; width:100%;">REDEEM</button>';
                    document.getElementById('ps-tabs-container').classList.add('hidden');
                } else if (text === 'Settings') {
                    this.showPlayStoreView('generic');
                    document.getElementById('ps-generic-title').textContent = 'Settings';
                    document.getElementById('ps-generic-icon').textContent = '⚙️';
                    document.getElementById('ps-generic-text').innerHTML = '<div style="text-align:left; font-size:12px; line-height:2;"><div style="border-bottom:1px solid #eee; padding:10px 0;">Auto-update apps</div><div style="border-bottom:1px solid #eee; padding:10px 0;">Add icon to Home screen</div><div style="padding:10px 0;">Clear search history</div></div>';
                    document.getElementById('ps-tabs-container').classList.add('hidden');
                } else if (text === 'Account') {
                    this.showPlayStoreView('generic');
                    document.getElementById('ps-generic-title').textContent = 'Account';
                    document.getElementById('ps-generic-icon').textContent = '💳';
                    document.getElementById('ps-generic-text').textContent = 'Managing payment methods and subscriptions.';
                    document.getElementById('ps-tabs-container').classList.add('hidden');
                }

                psDrawer.classList.add('ps-drawer-hidden');
                this.playClickSound();
            });
        });

        psInstallBtn.addEventListener('click', () => {
            // if button currently reads "OPEN", open the installed app if we know it
            if (psInstallBtn.textContent.trim().toUpperCase() === 'OPEN') {
                const installedApp = this.currentPlayApp && this.currentPlayApp.name;
                // Try to open a matching app by best-effort name mapping
                if (this.currentPlayApp) {
                    const lower = (this.currentPlayApp.name || '').toLowerCase();
                    if (lower.includes('weather')) this.openPlayStore(); // placeholder - stays in Play Store
                    // for real installed apps we might open them; noop for custom mock apps
                }
                this.playClickSound();
                return;
            }

            psInstallBtn.classList.add('hidden');
            const progress = document.getElementById('ps-install-progress');
            const fill = progress.querySelector('.progress-fill');
            const text = progress.querySelector('.progress-text');
            progress.classList.remove('hidden');
            
            let p = 0;
            const interval = setInterval(() => {
                p += Math.random() * 5;
                if (p >= 100) {
                    p = 100;
                    clearInterval(interval);
                    text.textContent = "Installed";
                    this.playSound('/WirelessChargingStarted.ogg');

                    // Mark app as "installed" in system state and add to app drawer if missing
                    const app = this.currentPlayApp;
                    if (app) {
                        // create a safe id key from name
                        const idKey = app.name.toLowerCase().replace(/\s+/g, '_').replace(/[^\w_]/g, '');
                        // add to appMetadata if not present (use provided icon if available)
                        if (!this.appMetadata[idKey]) {
                            this.appMetadata[idKey] = {
                                name: app.name,
                                icon: app.icon || '/webpage_default_asset.png',
                                preview: app.icon || '/webpage_default_asset.png'
                            };
                        }
                        // add a drawer item DOM node if it doesn't already exist
                        const drawerGrid = document.querySelector('#app-drawer .drawer-grid');
                        const exists = Array.from(drawerGrid.querySelectorAll('.drawer-item')).some(el => {
                            const span = el.querySelector('span');
                            return span && span.textContent.trim().toLowerCase() === app.name.toLowerCase();
                        });
                        if (!exists) {
                            const node = document.createElement('div');
                            node.className = 'drawer-item';
                            node.setAttribute('data-app', idKey);
                            node.innerHTML = `<img src="${app.icon || '/webpage_default_asset.png'}"><span>${app.name}</span>`;

                            // Map some common app name keys to internal launcher methods
                            const nameMap = {
                                'gmail': 'gmail',
                                'maps': 'maps',
                                'youtube': 'youtube',
                                'camera': 'camera',
                                'play music': 'playstore',
                                'play music': 'playstore',
                                'play store': 'playstore',
                                'phone': 'phone',
                                'hangouts': 'hangouts',
                                'downloads': 'downloads',
                                'gallery': 'gallery',
                                'calculator': 'calculator',
                                'clock': 'clock',
                                'messenger': 'messenger',
                                'google+': 'googleplus',
                                'google': 'google'
                            };

                            node.addEventListener('click', () => {
                                this.toggleAppDrawer(false);
                                this.closeApps();

                                // find best match by comparing normalized names
                                const normalized = (app.name || '').toLowerCase();
                                let launched = false;

                                // direct exact/contains matches first
                                Object.keys(nameMap).forEach(key => {
                                    if (!launched && normalized.includes(key)) {
                                        const appId = nameMap[key];
                                        // call corresponding opener if exists
                                        switch(appId) {
                                            case 'gmail': this.openGmail(); break;
                                            case 'maps': this.openMaps(); break;
                                            case 'youtube': this.openYouTube(); break;
                                            case 'camera': this.openCamera(); break;
                                            case 'phone': this.openPhone(); break;
                                            case 'hangouts': this.openHangouts(); break;
                                            case 'downloads': this.openDownloads(); break;
                                            case 'gallery': this.openGallery(); break;
                                            case 'calculator': this.openCalculator(); break;
                                            case 'clock': this.openClock(); break;
                                            case 'messenger': this.openMessenger(); break;
                                            case 'googleplus': this.openGooglePlus(); break;
                                            case 'google': this.openGoogle(); break;
                                            case 'playstore':
                                            default:
                                                // If mapped to Play Store or unknown, try to open any matching appMetadata entry
                                                if (this.appMetadata[normalized]) {
                                                    // If appMetadata key corresponds to a known UI, open it
                                                    const metaKey = normalized;
                                                    switch(metaKey) {
                                                        case 'gmail': this.openGmail(); break;
                                                        case 'maps': this.openMaps(); break;
                                                        case 'youtube': this.openYouTube(); break;
                                                        case 'camera': this.openCamera(); break;
                                                        default: this.openPlayStore(); break;
                                                    }
                                                } else {
                                                    // fallback: open Play Store detail for the app
                                                    this.openPlayStore();
                                                }
                                                break;
                                        }
                                        launched = true;
                                    }
                                });

                                // fallback if nothing launched: try to open by idKey if we have matching appMetadata
                                if (!launched) {
                                    if (this.appMetadata[idKey]) {
                                        // attempt to open common ones
                                        const tryId = idKey;
                                        switch(tryId) {
                                            case 'gmail': this.openGmail(); break;
                                            case 'maps': this.openMaps(); break;
                                            case 'youtube': this.openYouTube(); break;
                                            case 'camera': this.openCamera(); break;
                                            default: this.openPlayStore(); break;
                                        }
                                    } else {
                                        // final fallback: open Play Store
                                        this.openPlayStore();
                                    }
                                }

                                this.playClickSound();
                            });

                            drawerGrid.appendChild(node);
                        }
                    }

                    setTimeout(() => {
                        psInstallBtn.classList.remove('hidden');
                        psInstallBtn.textContent = "OPEN";
                        progress.classList.add('hidden');
                    }, 1000);
                }
                fill.style.width = p + '%';
            }, 100);
        });

        // Initial render
        this.renderPlayStoreHome('apps');
    }

    openMyApps() {
        // Show the My apps view and prepare a clear way back to Store Home
        this.showPlayStoreView('my-apps');
        const list = document.getElementById('ps-my-apps-list');
        list.innerHTML = '';
        
        // List currently installed apps (those that exist in app drawer already)
        const installed = [
            { name: 'Gmail', icon: '/gmail_icon_appdrawer.png', dev: 'Google Inc.', ver: '4.7.2' },
            { name: 'Maps', icon: '/maps_icon_appdrawer.png', dev: 'Google Inc.', ver: '7.5.0' },
            { name: 'YouTube', icon: '/youtube_icon_appdrawer.png', dev: 'Google Inc.', ver: '5.3.32' }
        ];

        installed.forEach(app => {
            const item = document.createElement('div');
            item.className = 'ps-list-item';
            item.innerHTML = `
                <div class="ps-app-icon" style="background:#eee;"><img src="${app.icon}"></div>
                <div class="ps-app-info">
                    <div class="ps-app-name" style="font-weight:500">${app.name}</div>
                    <div class="ps-app-category">${app.dev} • v${app.ver}</div>
                </div>
                <div style="color:#4caf50; font-size:11px; font-weight:bold; margin-left:auto;">INSTALLED</div>
            `;
            list.appendChild(item);
        });

        // Make header show a back affordance and be clickable to return to Store Home
        const psMainTitle = document.getElementById('ps-main-title');
        psMainTitle.innerHTML = '← My apps & games';
        psMainTitle.style.cursor = 'pointer';
        // ensure tabs are hidden while in this view
        document.getElementById('ps-tabs-container').classList.add('hidden');
        document.getElementById('ps-header').style.backgroundColor = '#4caf50';

        // attach handler to return to home (replacing any previous handler)
        psMainTitle.onclick = (e) => {
            e && e.stopPropagation();
            this.showPlayStoreView('home');
            this.playClickSound();
            // restore title explicitly in case showPlayStoreView doesn't
            document.getElementById('ps-main-title').textContent = 'Google Play';
            document.getElementById('ps-tabs-container').classList.remove('hidden');
            psMainTitle.style.cursor = '';
            psMainTitle.onclick = null;
        };
    }

    showPlayStoreView(viewId) {
        // hide all play-store subviews first
        document.getElementById('ps-home-content').classList.add('hidden');
        document.getElementById('ps-my-apps-view').classList.add('hidden');
        document.getElementById('ps-generic-view').classList.add('hidden');
        document.getElementById('ps-detail-view').classList.add('hidden');
        document.getElementById('ps-main-view').classList.remove('hidden');

        // ensure header/tabs are restored/managed consistently
        const tabsContainer = document.getElementById('ps-tabs-container');
        const mainTitle = document.getElementById('ps-main-title');

        if (viewId === 'home') {
            document.getElementById('ps-home-content').classList.remove('hidden');
            if (tabsContainer) tabsContainer.classList.remove('hidden');
            if (mainTitle) {
                mainTitle.textContent = 'Google Play';
                mainTitle.style.cursor = '';
                mainTitle.onclick = null;
            }
            // restore default tabs visibility and header color
            const psHeader = document.getElementById('ps-header');
            if (psHeader) psHeader.style.backgroundColor = '#4caf50';
        } else if (viewId === 'my-apps') {
            document.getElementById('ps-my-apps-view').classList.remove('hidden');
            // hide the top category tabs while in My apps view
            if (tabsContainer) tabsContainer.classList.add('hidden');
            if (mainTitle) {
                mainTitle.textContent = 'My apps & games';
                mainTitle.style.cursor = 'pointer';
                // attach a safe back handler that restores home view
                mainTitle.onclick = (e) => {
                    e && e.stopPropagation();
                    this.showPlayStoreView('home');
                    this.playClickSound();
                };
            }
        } else if (viewId === 'generic') {
            document.getElementById('ps-generic-view').classList.remove('hidden');
            if (tabsContainer) tabsContainer.classList.add('hidden');
            if (mainTitle) {
                mainTitle.textContent = 'Google Play';
                mainTitle.style.cursor = '';
                mainTitle.onclick = null;
            }
        }
    }

    performPlayStoreSearch(query) {
        const resultsArea = document.getElementById('ps-search-results');
        const searchList = document.getElementById('ps-search-list');
        searchList.classList.add('hidden');
        resultsArea.classList.remove('hidden');
        resultsArea.innerHTML = '';

        // Search through dummy data keys
        const allData = [
            { name: 'Weatherly', dev: 'Skyline', color: '#00bcd4', icon: '/play_app_icon_1.png', cat: 'Weather', rating: 4.6, installs: '5M+', size: '18MB' },
            { name: 'Photo Pro', dev: 'LensCraft', color: '#222', icon: '/play_app_icon_2.png', cat: 'Photography', rating: 4.4, installs: '2M+', size: '34MB' },
            { name: 'Pixel Racer', dev: 'Retro Games', color: '#ff5722', icon: '/play_game_icon_1.png', cat: 'Arcade', rating: 4.1, installs: '500K+', size: '25MB' },
            { name: 'Gold Puzzle', dev: 'LogicBits', color: '#ffc107', icon: '/play_game_icon_2.png', cat: 'Puzzle', rating: 4.7, installs: '1M+', size: '15MB' }
        ];

        const matches = allData.filter(d => d.name.toLowerCase().includes(query.toLowerCase()) || d.cat.toLowerCase().includes(query.toLowerCase()));

        if (matches.length === 0) {
            resultsArea.innerHTML = `<div style="padding:20px; text-align:center; color:#888;">No results found for "${query}"</div>`;
        } else {
            matches.forEach(item => {
                const row = document.createElement('div');
                row.className = 'ps-list-item';
                row.innerHTML = `
                    <div class="ps-app-icon" style="background: ${item.color}"><img src="${item.icon}"></div>
                    <div class="ps-app-info">
                        <div class="ps-app-name" style="font-weight:500">${item.name}</div>
                        <div class="ps-app-category">${item.cat}</div>
                    </div>
                `;
                row.addEventListener('click', () => {
                    document.getElementById('ps-search-overlay').classList.add('hidden');
                    this.openPlayStoreDetail(item);
                });
                resultsArea.appendChild(row);
            });
        }
    }

    renderPlayStoreHome(category) {
        const featuredGrid = document.getElementById('ps-featured-grid');
        const chartsList = document.getElementById('ps-top-charts');
        const banner = document.getElementById('ps-banner');
        const listTitle = document.getElementById('ps-list-title');
        
        featuredGrid.innerHTML = '';
        chartsList.innerHTML = '';

        banner.style.backgroundImage = "url('/playstore_banner_" + (category === 'books' || category === 'music' ? 'apps' : category) + ".png')";
        listTitle.textContent = category === 'movies' ? 'Top Selling' : (category === 'music' ? 'Top Albums' : 'Top Charts');

        const data = {
            apps: [
                { name: 'Weatherly', dev: 'Skyline', color: '#00bcd4', icon: '/play_app_icon_1.png', cat: 'Weather', rating: 4.6, installs: '5M+', size: '18MB', desc: 'Hourly and 10-day forecasts with radar overlays.', screenshot: '/play_app_icon_1.png' },
                { name: 'Photo Pro', dev: 'LensCraft', color: '#222', icon: '/play_app_icon_2.png', cat: 'Photography', rating: 4.4, installs: '2M+', size: '34MB', desc: 'Advanced mobile photo editor with professional export presets.', screenshot: '/play_app_icon_2.png' },
                { name: 'Gmail', dev: 'Google Inc.', color: '#db4437', icon: '/gmail_icon_appdrawer.png', cat: 'Communication', rating: 4.3, installs: '1B+', size: 'Varies', desc: "Stay organized with Gmail's smart inbox.", screenshot: '/gmail_icon_appdrawer.png' },
                { name: 'WhatsApp', dev: 'WhatsApp Inc.', color: '#25D366', icon: '/play_app_icon_2.png', cat: 'Communication', rating: 4.2, installs: '5B+', size: '22MB', desc: 'Free messaging and calls with end-to-end encryption.', screenshot: '/gallery_image_2.png' }
            ],
            games: [
                { name: 'Pixel Racer', dev: 'Retro Games', color: '#ff5722', icon: '/play_game_icon_1.png', cat: 'Arcade', rating: 4.1, installs: '500K+', size: '25MB', desc: 'Fast, retro-style top-down racer.', screenshot: '/play_game_icon_1.png' },
                { name: 'Gold Puzzle', dev: 'LogicBits', color: '#ffc107', icon: '/play_game_icon_2.png', cat: 'Puzzle', rating: 4.7, installs: '1M+', size: '15MB', desc: 'Relaxing brain-teasers with hundreds of levels.', screenshot: '/play_game_icon_2.png' },
                { name: 'Dash Master', dev: 'Speedy Studios', color: '#ffc107', icon: '/play_games_icon_appdrawer.png', cat: 'Action', rating: 4.0, installs: '2M+', size: '48MB', desc: 'High-octane endless runner.', screenshot: '/play_games_icon_appdrawer.png' }
            ],
            movies: [
                { name: 'Nebula Quest', dev: 'Cosmos Ent', color: '#1a237e', icon: '/play_movie_thumb_1.png', cat: 'Sci-Fi', rating: 4.4, installs: 'N/A', size: '2h 13m', desc: 'A cinematic space-adventure.', screenshot: '/play_movie_thumb_1.png' },
                { name: 'Summer Hit', dev: 'Studio Mega', color: '#000', icon: '/play_videos_icon_appdrawer.png', cat: 'Action', rating: 3.9, installs: 'N/A', size: '1h 42m', desc: 'A fast-paced action blockbuster.', screenshot: '/play_videos_icon_appdrawer.png' }
            ],
            music: [
                { name: 'Random Memories', dev: 'Daft Punk', color: '#000', icon: '/youtube_thumb_2.png', cat: 'Electronic', rating: 4.9, installs: 'N/A', size: '12 Songs', desc: 'The defining album of the year.', screenshot: '/youtube_thumb_2.png' },
                { name: 'KitKat Jams', dev: 'Various Artists', color: '#ff5722', icon: '/play_music_icon_appdrawer.png', cat: 'Pop', rating: 4.5, installs: 'N/A', size: '15 Songs', desc: 'Sweet tunes for every moment.', screenshot: '/play_music_icon_appdrawer.png' }
            ],
            books: [
                { name: 'Design Principles', dev: 'Google Press', color: '#03a9f4', icon: '/play_books_icon_appdrawer.png', cat: 'Educational', rating: 4.8, installs: 'N/A', size: '250 Pages', desc: 'Learn the secrets of Material and Holo design.', screenshot: '/play_books_icon_appdrawer.png' }
            ]
        };

        const currentItems = data[category] || [];

        currentItems.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'ps-app-card';
            card.innerHTML = `
                <div class="ps-app-icon" style="background: ${item.color}"><img src="${item.icon}"></div>
                <div class="ps-app-name">${item.name}</div>
                <div class="ps-app-category">${item.cat}</div>
            `;
            card.addEventListener('click', () => this.openPlayStoreDetail(item));
            featuredGrid.appendChild(card);

            // Duplicate for list view as well
            const listItem = document.createElement('div');
            listItem.className = 'ps-list-item';
            listItem.innerHTML = `
                <div class="ps-app-icon" style="background: ${item.color}"><img src="${item.icon}"></div>
                <div class="ps-app-info">
                    <div class="ps-app-name" style="font-weight:500">${item.name}</div>
                    <div class="ps-app-category">${item.cat}</div>
                </div>
            `;
            listItem.addEventListener('click', () => this.openPlayStoreDetail(item));
            chartsList.appendChild(listItem);
        });
    }

    openPlayStoreDetail(app) {
        // show detail view
        document.getElementById('ps-home-content').classList.add('hidden');
        document.getElementById('ps-my-apps-view').classList.add('hidden');
        document.getElementById('ps-generic-view').classList.add('hidden');
        document.getElementById('ps-detail-view').classList.remove('hidden');

        // store reference for install behavior
        this.currentPlayApp = app;

        // icon image
        const iconImg = document.getElementById('ps-detail-icon-img');
        if (iconImg) {
            iconImg.src = app.icon || '/webpage_default_asset.png';
            iconImg.alt = app.name + ' icon';
        } else {
            // fallback to background if img missing
            document.getElementById('ps-detail-icon').style.backgroundColor = app.color || '#ddd';
        }

        // textual metadata
        document.getElementById('ps-detail-name').textContent = app.name;
        const devLink = document.getElementById('ps-detail-dev-link');
        if (devLink) {
            devLink.textContent = app.dev || 'Unknown Developer';
            devLink.href = '#';
            devLink.onclick = (e) => { e.preventDefault(); alert('Open developer page for ' + (app.dev || 'Developer')); };
        } else {
            document.getElementById('ps-detail-dev').textContent = app.dev || 'Unknown Developer';
        }

        // realistic meta: rating / installs / size
        const ratingEl = document.getElementById('ps-detail-rating');
        const installsEl = document.getElementById('ps-detail-installs');
        const sizeEl = document.getElementById('ps-detail-size');
        ratingEl && (ratingEl.textContent = (app.rating || 4.3).toFixed(1));
        installsEl && (installsEl.textContent = (app.installs || '1M+') );
        sizeEl && (sizeEl.textContent = (app.size || '10MB'));

        // description
        document.getElementById('ps-detail-desc').innerHTML = `
            <div style="margin-bottom:12px;"><strong>Description</strong><br>${app.desc || `Experience the best of ${app.name}! ${app.name} provides a seamless experience for your daily ${app.cat ? app.cat.toLowerCase() : 'tasks'}.`}</div>
            <div style="border-top:1px solid #eee; padding-top:12px;">
                <strong>What's New</strong><br>
                <span style="font-size:12px;">• Bug fixes and performance improvements.<br>• Refreshed UI elements for KitKat.</span>
            </div>
            <div style="border-top:1px solid #eee; padding-top:12px; margin-top:12px; font-size:11px; color:#999;">
                Updated: Nov 14, 2013<br>
                Size: ${app.size || '10MB'}<br>
                Version: 4.4.102
            </div>
        `;

        // screenshots placeholders - if icon is a large image use it as first screenshot
        const ss = document.querySelectorAll('.ps-screenshot-placeholder');
        ss.forEach((el, i) => {
            if (i === 0 && app.screenshot) {
                el.style.backgroundImage = `url('${app.screenshot}')`;
                el.style.backgroundSize = 'cover';
                el.style.backgroundPosition = 'center';
            } else {
                el.style.backgroundImage = '';
                el.style.backgroundColor = '#eee';
                el.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#999">Screenshot</div>`;
            }
        });

        // reset install UI
        const psInstallBtn = document.getElementById('ps-install-btn');
        psInstallBtn.textContent = "INSTALL";
        psInstallBtn.classList.remove('hidden');
        document.getElementById('ps-install-progress').classList.add('hidden');

        this.playClickSound();
    }

    toggleAppDrawer(show) {
        if (show) {
            this.appDrawer.classList.remove('hidden');
        } else {
            this.appDrawer.classList.add('hidden');
        }
    }

    toggleQuickSettings(show) {
        if (show) {
            this.quickSettings.classList.remove('panel-hidden');
            this.playClickSound();
        } else {
            this.quickSettings.classList.add('panel-hidden');
            this.playClickSound();
        }
    }

    addToHistory(appId) {
        // Move to top of history
        this.openedApps = this.openedApps.filter(id => id !== appId);
        this.openedApps.unshift(appId);
        // Keep only last 8
        if (this.openedApps.length > 8) this.openedApps.pop();
    }

    openChrome() {
        this.toggleAppDrawer(false);
        this.closeApps();
        this.chromeApp.classList.remove('hidden');
        this.addToHistory('chrome');
    }

    openGoogle() {
        this.toggleAppDrawer(false);
        this.closeApps();
        this.googleApp.classList.remove('hidden');
        // Reset Google app view (show the main now container and hide search results)
        const gMain = document.getElementById('google-now-container');
        if (gMain) {
            gMain.classList.remove('hidden');
            gMain.scrollTop = 0;
        }
        const results = document.getElementById('google-app-results');
        if (results) results.classList.add('hidden');
        
        const input = document.getElementById('google-app-search-input');
        if (input) input.value = '';
        
        this.addToHistory('google');
    }

    openYouTube() {
        this.toggleAppDrawer(false);
        this.closeApps();
        this.youtubeApp.classList.remove('hidden');
        this.showYouTubeView('home');
        this.addToHistory('youtube');
    }

    setupAppTabListeners() {
        // WhatsApp Tab Logic
        const waTabs = document.querySelectorAll('.wa-tab');
        waTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-tab');
                waTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                document.querySelectorAll('.wa-view').forEach(v => v.classList.add('hidden'));
                document.getElementById(`wa-view-${target}`).classList.remove('hidden');
                this.playClickSound();
            });
        });

        // Facebook Tab Logic
        const fbTabs = document.querySelectorAll('.fb-tab');
        fbTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-tab');
                fbTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                document.querySelectorAll('.fb-view').forEach(v => v.classList.add('hidden'));
                document.getElementById(`fb-view-${target}`).classList.remove('hidden');
                this.playClickSound();
            });
        });
    }

    setupYouTubeListeners() {
        // Tab switching
        const ytTabs = document.querySelectorAll('.yt-tab');
        ytTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                ytTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.showYouTubeView(tab.getAttribute('data-view'));
                this.playClickSound();
            });
        });

        // Guide Drawer Toggle
        const guide = document.getElementById('yt-guide');
        const guideTrigger = document.getElementById('yt-guide-trigger');
        const guideOverlay = guide.querySelector('.yt-guide-overlay');

        guideTrigger.addEventListener('click', () => {
            guide.classList.remove('yt-guide-hidden');
            this.playClickSound();
        });

        guideOverlay.addEventListener('click', () => {
            guide.classList.add('yt-guide-hidden');
        });

        // Search UI Logic (now filters local video cards)
        const searchTrigger = document.getElementById('yt-search-trigger');
        const searchBar = document.getElementById('yt-search-bar');
        const searchBack = document.getElementById('yt-search-back');
        const searchInput = document.getElementById('yt-search-input');
        const searchClear = document.getElementById('yt-search-clear');

        const performYTSearch = (query) => {
            const q = (query || '').toLowerCase().trim();
            const homeView = document.getElementById('yt-home-view');
            const cards = Array.from(homeView.querySelectorAll('.video-card'));
            if (!q) {
                // restore original list
                cards.forEach(c => c.style.display = '');
                // show home and ensure tab selected
                this.showYouTubeView('home');
                return;
            }

            // Filter by title, channel, or stats
            let visible = 0;
            cards.forEach(c => {
                const title = (c.getAttribute('data-title') || '').toLowerCase();
                const channel = (c.getAttribute('data-channel') || '').toLowerCase();
                const stats = (c.getAttribute('data-stats') || '').toLowerCase();
                if (title.includes(q) || channel.includes(q) || stats.includes(q)) {
                    c.style.display = '';
                    visible++;
                } else {
                    c.style.display = 'none';
                }
            });

            // If exactly one match and it has a video-id, open it automatically after a short delay
            if (visible === 1) {
                const match = cards.find(c => c.style.display !== 'none');
                if (match) {
                    setTimeout(() => {
                        const title = match.getAttribute('data-title');
                        const channel = match.getAttribute('data-channel');
                        const stats = match.getAttribute('data-stats');
                        const img = match.getAttribute('data-img');
                        const videoId = match.getAttribute('data-video-id');
                        this.openYouTubePlayer(title, `${channel} • ${stats}`, img, videoId);
                    }, 250);
                }
            } else {
                // show home results view (home view already used)
                this.showYouTubeView('home');
            }
        };

        searchTrigger.addEventListener('click', () => {
            searchBar.className = 'yt-search-bar-active';
            searchInput.value = '';
            searchInput.focus();
            this.playClickSound();
        });

        searchBack.addEventListener('click', () => {
            searchBar.className = 'yt-search-bar-hidden';
            performYTSearch(''); // reset filter
        });

        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
            performYTSearch('');
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    performYTSearch(query);
                    searchBar.className = 'yt-search-bar-hidden';
                    this.playClickSound();
                }
            }
        });

        // Video item clicks
        document.addEventListener('click', (e) => {
            const videoItem = e.target.closest('.video-card');
            if (videoItem && this.youtubeApp.contains(videoItem)) {
                const title = videoItem.getAttribute('data-title');
                const channel = videoItem.getAttribute('data-channel');
                const stats = videoItem.getAttribute('data-stats');
                const img = videoItem.getAttribute('data-img');
                const videoId = videoItem.getAttribute('data-video-id');
                this.openYouTubePlayer(title, `${channel} • ${stats}`, img, videoId);
            }
        });

        document.querySelector('.yt-logo').addEventListener('click', () => {
            // restore full list when logo clicked
            document.querySelectorAll('#yt-home-view .video-card').forEach(c => c.style.display = '');
            this.showYouTubeView('home');
        });

        // Like/Dislike Toggles
        document.querySelectorAll('.yt-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const span = btn.querySelector('span');
                if (span && span.textContent === '👍') {
                    // toggle red for like
                    btn.classList.toggle('liked');
                    btn.style.color = btn.classList.contains('liked') ? '#e62117' : '#666';
                }
                this.vibrate();
            });
        });

        // WhatsApp: open individual chat when tapping a contact and enable sending messages
        // Keep the original WhatsApp UI; do NOT preload or inject mock conversation content.
        document.querySelectorAll('#whatsapp-app .wa-item').forEach(item => {
            item.addEventListener('click', () => {
                const nameEl = item.querySelector('.wa-name');
                const name = nameEl ? nameEl.textContent.trim() : 'Chat';
                const chatContainer = document.createElement('div');
                chatContainer.className = 'wa-chat-modal';
                chatContainer.style.position = 'absolute';
                chatContainer.style.top = 'var(--status-bar-height)';
                chatContainer.style.left = '0';
                chatContainer.style.width = '100%';
                chatContainer.style.height = 'calc(100% - var(--status-bar-height) - var(--nav-bar-height))';
                chatContainer.style.background = 'white';
                chatContainer.style.zIndex = '120';
                chatContainer.innerHTML = `
                    <div style="height:56px;background:#075e54;color:white;display:flex;align-items:center;padding:0 12px;gap:12px;">
                        <button class="wa-chat-back" style="background:transparent;border:none;color:white;font-size:20px;cursor:pointer;">←</button>
                        <div style="font-weight:600;">${name}</div>
                    </div>
                    <div class="wa-chat-messages" style="flex:1;padding:12px;overflow:auto; height: calc(100% - 112px); display:flex; flex-direction:column; gap:8px;"></div>
                    <div style="height:56px;display:flex;gap:8px;padding:8px;border-top:1px solid #eee;">
                        <input class="wa-chat-input" placeholder="Type a message..." style="flex:1;border:1px solid #ddd;padding:8px;border-radius:4px;outline:none;">
                        <button class="wa-chat-send" style="background:#25d366;border:none;color:white;padding:8px 12px;border-radius:4px;cursor:pointer;">Send</button>
                    </div>
                `;
                document.getElementById('whatsapp-app').appendChild(chatContainer);

                const messagesEl = chatContainer.querySelector('.wa-chat-messages');
                const inputEl = chatContainer.querySelector('.wa-chat-input');
                const sendBtn = chatContainer.querySelector('.wa-chat-send');
                const backBtn = chatContainer.querySelector('.wa-chat-back');

                // Start with an empty conversation view (no mock messages)
                messagesEl.innerHTML = '';

                const sendMessage = () => {
                    const txt = inputEl.value.trim();
                    if (!txt) return;
                    const msg = document.createElement('div');
                    msg.style.alignSelf = 'flex-end';
                    msg.style.background = '#25d366';
                    msg.style.color = 'white';
                    msg.style.padding = '8px';
                    msg.style.borderRadius = '8px';
                    msg.style.maxWidth = '80%';
                    msg.textContent = txt;
                    messagesEl.appendChild(msg);
                    messagesEl.scrollTop = messagesEl.scrollHeight;
                    inputEl.value = '';
                    this.playSound('/KeypressStandard.ogg');
                    // optional: small simulated reply for liveliness (kept minimal)
                    setTimeout(() => {
                        const reply = document.createElement('div');
                        reply.style.alignSelf = 'flex-start';
                        reply.style.background = '#f1f0f0';
                        reply.style.color = '#222';
                        reply.style.padding = '8px';
                        reply.style.borderRadius = '8px';
                        reply.style.maxWidth = '80%';
                        reply.textContent = "Auto-reply (simulated)";
                        messagesEl.appendChild(reply);
                        messagesEl.scrollTop = messagesEl.scrollHeight;
                        this.playSound('/WirelessChargingStarted.ogg');
                    }, 900);
                };

                sendBtn.addEventListener('click', sendMessage);
                inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
                backBtn.addEventListener('click', () => chatContainer.remove());
            });
        });

        // Facebook: keep original interface, but ensure like toggle and comment composer work consistently.
        document.querySelectorAll('#facebook-app .fb-post').forEach(post => {
            let actions = post.querySelector('.fb-post-actions');
            if (!actions) {
                actions = document.createElement('div');
                actions.className = 'fb-post-actions';
                post.appendChild(actions);
            }
            if (!actions.querySelector('.fb-like')) {
                const likeBtn = document.createElement('span');
                likeBtn.className = 'fb-like';
                likeBtn.style.cursor = 'pointer';
                likeBtn.style.userSelect = 'none';
                likeBtn.textContent = 'Like';
                actions.prepend(likeBtn);

                likeBtn.addEventListener('click', () => {
                    likeBtn.classList.toggle('liked');
                    likeBtn.style.color = likeBtn.classList.contains('liked') ? '#3b5998' : '#777';
                    this.vibrate();
                });
            }

            if (!post.querySelector('.fb-comment-row')) {
                const commentRow = document.createElement('div');
                commentRow.className = 'fb-comment-row';
                commentRow.style.display = 'flex';
                commentRow.style.gap = '8px';
                commentRow.style.marginTop = '8px';
                commentRow.innerHTML = `<input placeholder="Write a comment..." style="flex:1;padding:8px;border:1px solid #eee;border-radius:4px;"><button style="background:#3b5998;color:white;border:none;padding:8px 10px;border-radius:4px;cursor:pointer;">Comment</button>`;
                post.appendChild(commentRow);

                const input = commentRow.querySelector('input');
                const btn = commentRow.querySelector('button');
                btn.addEventListener('click', () => {
                    const txt = input.value.trim();
                    if (!txt) return;
                    const c = document.createElement('div');
                    c.style.marginTop = '8px';
                    c.style.padding = '8px';
                    c.style.background = '#f5f6f7';
                    c.style.borderRadius = '6px';
                    c.textContent = 'You: ' + txt;
                    post.appendChild(c);
                    input.value = '';
                    this.playSound('/KeypressStandard.ogg');
                });

                // Pressing Enter also posts a comment
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') btn.click();
                });
            }
        });

        // YouTube: make search filter live and robust — respond to input changes and open a single match
        const searchInputField = document.getElementById('yt-search-input');
        if (searchInputField) {
            const debounce = (fn, delay=180) => {
                let t = null;
                return (...args) => {
                    clearTimeout(t);
                    t = setTimeout(() => fn(...args), delay);
                };
            };

            const liveFilter = (query) => {
                const q = (query || '').toLowerCase().trim();
                const homeView = document.getElementById('yt-home-view');
                const cards = Array.from(homeView.querySelectorAll('.video-card'));
                if (!q) {
                    cards.forEach(c => c.style.display = '');
                    this.showYouTubeView('home');
                    return;
                }
                let visible = 0, lastMatch = null;
                cards.forEach(c => {
                    const title = (c.getAttribute('data-title') || '').toLowerCase();
                    const channel = (c.getAttribute('data-channel') || '').toLowerCase();
                    const stats = (c.getAttribute('data-stats') || '').toLowerCase();
                    const match = title.includes(q) || channel.includes(q) || stats.includes(q);
                    c.style.display = match ? '' : 'none';
                    if (match) { visible++; lastMatch = c; }
                });

                // If exactly one match, open it automatically
                if (visible === 1 && lastMatch) {
                    const title = lastMatch.getAttribute('data-title');
                    const channel = lastMatch.getAttribute('data-channel');
                    const stats = lastMatch.getAttribute('data-stats');
                    const img = lastMatch.getAttribute('data-img');
                    const videoId = lastMatch.getAttribute('data-video-id');
                    // small delay to let UI update
                    setTimeout(() => this.openYouTubePlayer(title, `${channel} • ${stats}`, img, videoId), 220);
                } else {
                    this.showYouTubeView('home');
                }
            };

            const debounced = debounce((val) => liveFilter(val), 200);
            searchInputField.addEventListener('input', (e) => debounced(e.target.value));
        }
    }

    showYouTubeView(viewId) {
        const views = ['home', 'trending', 'subs', 'player'];
        views.forEach(v => {
            const el = document.getElementById(`yt-${v}-view`);
            if (el) el.classList.add('hidden');
        });
        const target = document.getElementById(`yt-${viewId}-view`);
        if (target) target.classList.remove('hidden');
    }

    openYouTubePlayer(title, stats, img, videoId) {
        // Show player view and populate metadata
        this.showYouTubeView('player');
        document.getElementById('yt-player-title').textContent = title;
        document.getElementById('yt-player-stats').textContent = stats || '';

        const playerArea = document.getElementById('yt-main-player');
        const iframeContainer = document.getElementById('yt-iframe-container');
        const spinner = playerArea.querySelector('.yt-spinner');
        const controls = playerArea.querySelector('.yt-player-controls');

        // Clear any previous iframe
        iframeContainer.innerHTML = '';

        // Show spinner while loading
        spinner.style.display = 'block';
        controls.style.opacity = '0';

        // Build a safe embed URL; if no videoId provided, fallback to a search/watch page
        let src = '';
        if (videoId) {
            src = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0&autoplay=1`;
        } else {
            // If we don't have an ID, show a thumbnail as a static background and skip iframe
            iframeContainer.style.backgroundImage = `url('${img}')`;
            iframeContainer.style.backgroundSize = 'cover';
            iframeContainer.style.backgroundPosition = 'center';
            spinner.style.display = 'none';
            controls.style.opacity = '1';
            this.playSound('/Effect_Tick.ogg');
            return;
        }

        // Create iframe and append; keep sandbox minimal to allow playback
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.allow = 'autoplay; encrypted-media';
        iframe.frameBorder = '0';
        iframe.style.display = 'block';
        iframe.style.height = '100%';
        iframe.style.width = '100%';
        iframeContainer.appendChild(iframe);

        // Small delay to give the iframe time to initiate
        this.playSound('/Effect_Tick.ogg');
        setTimeout(() => {
            spinner.style.display = 'none';
            controls.style.opacity = '1';
        }, 800);
    }

    openPhone() {
        this.toggleAppDrawer(false);
        this.closeApps();
        this.phoneApp.classList.remove('hidden');
        this.addToHistory('phone');
    }

    openHangouts() {
        this.toggleAppDrawer(false);
        this.closeApps();
        this.hangoutsApp.classList.remove('hidden');
        document.getElementById('hangouts-chat-view').classList.add('hidden');
        document.getElementById('hangouts-list-view').classList.remove('hidden');
        this.addToHistory('hangouts');
    }

    openHangoutsChat(name, color) {
        const chatView = document.getElementById('hangouts-chat-view');
        const listView = document.getElementById('hangouts-list-view');
        listView.classList.add('hidden');
        chatView.classList.remove('hidden');
        document.getElementById('chat-name').textContent = name;
        const avatar = document.getElementById('chat-avatar');
        avatar.textContent = name[0];
        avatar.style.backgroundColor = color;
        this.playSound('/Effect_Tick.ogg');
    }

    openPlayStore() {
        this.toggleAppDrawer(false);
        this.closeApps();
        this.playStoreApp.classList.remove('hidden');
        this.addToHistory('playstore');
    }

    openSettings() {
        this.toggleAppDrawer(false);
        this.closeApps();
        this.settingsApp.classList.remove('hidden');
        this.addToHistory('settings');
    }

    openDownloads() {
        this.toggleAppDrawer(false);
        this.closeApps();
        this.downloadsApp.classList.remove('hidden');
        this.addToHistory('downloads');
    }

    openGallery() {
        this.toggleAppDrawer(false);
        this.closeApps();
        this.galleryApp.classList.remove('hidden');
        document.getElementById('gallery-viewer').classList.add('hidden');
        this.addToHistory('gallery');
    }

    openGalleryViewer(url) {
        const viewer = document.getElementById('gallery-viewer');
        const img = document.getElementById('viewer-img');
        img.src = url;
        viewer.classList.remove('hidden');
    }

    openCalculator() {
        this.toggleAppDrawer(false);
        this.closeApps();
        document.getElementById('calculator-app').classList.remove('hidden');
        this.addToHistory('calculator');
    }

    openClock() {
        this.toggleAppDrawer(false);
        this.closeApps();
        document.getElementById('clock-app').classList.remove('hidden');
        this.addToHistory('clock');
    }

    // Calendar functions
    openCalendar() {
        this.toggleAppDrawer(false);
        this.closeApps();
        document.getElementById('calendar-app').classList.remove('hidden');
        document.getElementById('cal-event-list').classList.add('hidden');
        this.addToHistory('calendar');

        // Initialize calendar state if missing
        if (!this.calendarState) {
            this.calendarState = { date: new Date(), events: {} }; // events keyed by YYYY-MM-DD -> [ {title} ]
        }
        this.renderCalendar();
    }

    renderCalendar() {
        const grid = document.getElementById('cal-grid');
        const title = document.getElementById('cal-title');
        const state = this.calendarState;
        const date = new Date(state.date.getFullYear(), state.date.getMonth(), 1);
        const month = date.getMonth();
        const year = date.getFullYear();

        const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        title.textContent = `${monthNames[month]} ${year}`;

        grid.innerHTML = '';
        // weekday headers
        const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        weekdays.forEach(w => {
            const h = document.createElement('div');
            h.className = 'cal-weekday';
            h.textContent = w;
            grid.appendChild(h);
        });

        // first day index
        const firstDayIndex = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevDays = new Date(year, month, 0).getDate();

        // fill previous month's tail
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const dayNum = prevDays - i;
            const el = this._createDayCell(dayNum, month - 1, year, true);
            grid.appendChild(el);
        }

        // current month days
        for (let d = 1; d <= daysInMonth; d++) {
            const el = this._createDayCell(d, month, year, false);
            grid.appendChild(el);
        }

        // fill next month's head to complete grid (weeks of 7, plus header row)
        const cells = grid.children.length;
        const remainder = (7 - (cells % 7)) % 7;
        for (let i = 1; i <= remainder; i++) {
            const el = this._createDayCell(i, month + 1, year, true);
            grid.appendChild(el);
        }

        // wire nav buttons
        document.getElementById('cal-prev').onclick = () => {
            state.date = new Date(year, month - 1, 1);
            this.renderCalendar();
        };
        document.getElementById('cal-next').onclick = () => {
            state.date = new Date(year, month + 1, 1);
            this.renderCalendar();
        };

        // event panel controls
        document.getElementById('cal-event-back').onclick = () => {
            document.getElementById('cal-event-list').classList.add('hidden');
        };
        document.getElementById('cal-add-event').onclick = () => {
            const edateEl = document.getElementById('cal-event-date');
            const edate = edateEl.getAttribute('data-date');
            const title = prompt('Event title for ' + edate);
            if (title && title.trim()) {
                state.events[edate] = state.events[edate] || [];
                state.events[edate].push({ title: title.trim() });
                this.renderCalendar();
                this.showEventsForDate(edate);
            }
        };
    }

    openSubSettings(category) {
        const panel = document.getElementById('settings-sub-panel');
        const content = document.getElementById('sub-settings-content');
        const title = document.getElementById('sub-settings-title');
        const mainList = document.getElementById('settings-main-list');

        mainList.classList.add('hidden');
        panel.classList.remove('hidden');
        content.innerHTML = '';
        this.playClickSound();

        if (category === 'sound') {
            title.textContent = 'Sound';
            content.innerHTML = `
                <div class="sub-settings-group">
                    <div class="sub-label">Volumes</div>
                    <div class="volume-slider-item">
                        <span>Music/Video</span>
                        <input type="range" class="android-range" value="80">
                    </div>
                    <div class="volume-slider-item">
                        <span>Notifications</span>
                        <input type="range" class="android-range" value="60">
                    </div>
                    <div class="volume-slider-item">
                        <span>Alarms</span>
                        <input type="range" class="android-range" value="100">
                    </div>
                </div>
                <div class="settings-item">
                    <span>Vibrate on touch</span>
                    <img src="/on_slider_settings.png" class="settings-slider" style="height:24px">
                </div>
            `;
        } else if (category === 'display') {
            title.textContent = 'Display';
            content.innerHTML = `
                <div class="sub-settings-group">
                    <div class="sub-label">Brightness</div>
                    <input type="range" class="android-range" value="50">
                </div>
                <div class="settings-item">
                    <span>Wallpaper</span>
                </div>
                <div class="settings-item">
                    <span>Auto-rotate screen</span>
                    <img src="/off_slider_settings.png" class="settings-slider" style="height:24px">
                </div>
                <div class="settings-item">
                    <span>Sleep</span>
                    <span style="color:#888;font-size:12px">After 1 minute of inactivity</span>
                </div>
            `;
        }
    }

    _createDayCell(day, month, year, outside=false) {
        const state = this.calendarState;
        const cell = document.createElement('div');
        cell.className = 'cal-day' + (outside ? ' outside' : '');
        const displayMonth = new Date(year, month, day).getMonth();
        const displayYear = new Date(year, month, day).getFullYear();
        const dayNumEl = document.createElement('div');
        dayNumEl.className = 'day-num';
        dayNumEl.textContent = day;
        const eventsEl = document.createElement('div');
        eventsEl.className = 'day-events';

        const iso = `${displayYear.toString().padStart(4,'0')}-${(displayMonth+1).toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
        const dayEvents = (state.events && state.events[iso]) || [];
        dayEvents.slice(0,2).forEach(ev => {
            const pill = document.createElement('div');
            pill.className = 'cal-event-pill';
            pill.textContent = ev.title;
            eventsEl.appendChild(pill);
        });

        cell.appendChild(dayNumEl);
        cell.appendChild(eventsEl);

        cell.addEventListener('click', (e) => {
            e.stopPropagation();
            // show event list panel
            this.showEventsForDate(iso);
        });

        return cell;
    }

    showEventsForDate(iso) {
        const panel = document.getElementById('cal-event-list');
        const body = document.getElementById('cal-event-body');
        const dateEl = document.getElementById('cal-event-date');
        dateEl.textContent = iso;
        dateEl.setAttribute('data-date', iso);
        body.innerHTML = '';

        const events = (this.calendarState.events && this.calendarState.events[iso]) || [];
        if (events.length === 0) {
            const empty = document.createElement('div');
            empty.textContent = 'No events';
            empty.style.color = '#666';
            body.appendChild(empty);
        } else {
            events.forEach((ev, i) => {
                const row = document.createElement('div');
                row.style.padding = '8px';
                row.style.borderBottom = '1px solid #f1f1f1';
                row.textContent = ev.title;
                body.appendChild(row);
            });
        }

        panel.classList.remove('hidden');
    }

    openMaps() {
        this.toggleAppDrawer(false);
        this.closeApps();
        document.getElementById('maps-app').classList.remove('hidden');
        this.addToHistory('maps');

        // Simple Maps Search interactivity
        const searchInput = document.querySelector('.maps-search');
        if (searchInput) {
            searchInput.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        const titleEl = document.querySelector('.info-title');
                        const addrEl = document.querySelector('.info-address');
                        titleEl.textContent = query;
                        addrEl.textContent = "Locating " + query + "...";
                        this.playClickSound();
                        setTimeout(() => {
                            addrEl.textContent = "Pin set to " + query;
                        }, 1200);
                    }
                }
            };
        }
    }

    initStopwatchUI() {
        let swView = document.getElementById('clock-view-stopwatch');
        if (!swView) {
            swView = document.createElement('div');
            swView.id = 'clock-view-stopwatch';
            swView.className = 'clock-main hidden';
            swView.style.flexDirection = 'column';
            swView.innerHTML = `
                <div class="timer-display" id="sw-display">00:00.0</div>
                <div class="timer-controls">
                    <button class="timer-btn" id="sw-start">START</button>
                    <button class="timer-btn" id="sw-reset" style="background:#666; margin-left:12px;">RESET</button>
                </div>
            `;
            document.getElementById('clock-app').appendChild(swView);
            
            const startBtn = document.getElementById('sw-start');
            const resetBtn = document.getElementById('sw-reset');
            const display = document.getElementById('sw-display');

            startBtn.onclick = () => {
                if (this.stopwatch.running) {
                    this.stopwatch.running = false;
                    clearInterval(this.stopwatch.timer);
                    startBtn.textContent = 'START';
                } else {
                    this.stopwatch.running = true;
                    this.stopwatch.start = performance.now() - this.stopwatch.elapsed;
                    this.stopwatch.timer = setInterval(() => {
                        this.stopwatch.elapsed = performance.now() - this.stopwatch.start;
                        const ms = Math.floor(this.stopwatch.elapsed % 1000 / 100);
                        const sec = Math.floor(this.stopwatch.elapsed / 1000 % 60);
                        const min = Math.floor(this.stopwatch.elapsed / 60000);
                        display.textContent = `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}.${ms}`;
                    }, 100);
                    startBtn.textContent = 'STOP';
                }
                this.playClickSound();
            };

            resetBtn.onclick = () => {
                this.stopwatch.running = false;
                clearInterval(this.stopwatch.timer);
                this.stopwatch.elapsed = 0;
                display.textContent = '00:00.0';
                startBtn.textContent = 'START';
                this.playClickSound();
            };
        }
    }

    openMessenger() {
        this.toggleAppDrawer(false);
        this.closeApps();
        document.getElementById('messenger-app').classList.remove('hidden');
        this.addToHistory('messenger');
    }

    openGooglePlus() {
        this.toggleAppDrawer(false);
        this.closeApps();
        document.getElementById('googleplus-app').classList.remove('hidden');
        this.addToHistory('googleplus');
    }

    openWhatsApp() {
        this.toggleAppDrawer(false);
        this.closeApps();
        this.whatsappApp.classList.remove('hidden');
        this.addToHistory('whatsapp');
    }

    openFacebook() {
        this.toggleAppDrawer(false);
        this.closeApps();
        this.facebookApp.classList.remove('hidden');
        this.addToHistory('facebook');
    }

    openGmail() {
        this.toggleAppDrawer(false);
        this.closeApps();
        document.getElementById('gmail-app').classList.remove('hidden');
        this.addToHistory('gmail');
    }

    openEmail() {
        this.toggleAppDrawer(false);
        this.closeApps();
        document.getElementById('email-app').classList.remove('hidden');
        this.addToHistory('email');
    }

    openPlayMusic() {
        this.toggleAppDrawer(false);
        this.closeApps();
        document.getElementById('play-music-app').classList.remove('hidden');
        this.addToHistory('play_music');
    }

    openPlayBooks() {
        this.toggleAppDrawer(false);
        this.closeApps();
        document.getElementById('play-books-app').classList.remove('hidden');
        this.addToHistory('play_books');
    }

    openPlayGames() {
        this.toggleAppDrawer(false);
        this.closeApps();
        document.getElementById('play-games-app').classList.remove('hidden');
        this.addToHistory('play_games');
    }

    openRecentApps() {
        this.toggleAppDrawer(false);
        this.closeApps(false); // don't clear history
        this.recentAppsScreen.classList.remove('hidden');
        this.renderRecentApps();
    }

    renderRecentApps() {
        this.recentAppsList.innerHTML = '';
        if (this.openedApps.length === 0) {
            this.recentAppsEmpty.classList.remove('hidden');
        } else {
            this.recentAppsEmpty.classList.add('hidden');
            this.openedApps.forEach(appId => {
                const meta = this.appMetadata[appId];
                if (!meta) return;

                const card = document.createElement('div');
                card.className = 'recent-card';
                card.innerHTML = `
                    <div class="recent-card-header">
                        <img src="${meta.icon}" class="recent-card-icon">
                        <span class="recent-card-title">${meta.name}</span>
                    </div>
                    <div class="recent-card-preview">
                        <img src="${meta.preview}">
                    </div>
                `;
                card.addEventListener('click', () => {
                    this.playClickSound();
                    switch(appId) {
                        case 'chrome': this.openChrome(); break;
                        case 'phone': this.openPhone(); break;
                        case 'hangouts': this.openHangouts(); break;
                        case 'camera': this.openCamera(); break;
                        case 'settings': this.openSettings(); break;
                        case 'downloads': this.openDownloads(); break;
                        case 'google': this.openGoogle(); break;
                        case 'youtube': this.openYouTube(); break;
                        case 'playstore': this.openPlayStore(); break;
                    }
                });
                this.recentAppsList.appendChild(card);
            });
        }
    }

    openCamera() {
        this.toggleAppDrawer(false);
        this.closeApps();
        this.cameraApp.classList.remove('hidden');
        this.addToHistory('camera');
        
        // Focus animation & sound
        setTimeout(() => {
            this.playSound('/camera_focus.ogg');
            this.focusRing.classList.add('active');
            setTimeout(() => {
                this.focusRing.classList.remove('active');
            }, 1000);
        }, 300);
    }

    openPixelRacer() {
        this.toggleAppDrawer(false);
        this.closeApps();
        const app = document.getElementById('pixel-racer-app');
        app.classList.remove('hidden');
        this.addToHistory('pixel_racer');

        // initialize game if not present
        if (!this.pixelRacer) this.pixelRacer = new this.PixelRacer('pixel-racer-canvas', {
            onScore: (s) => { document.getElementById('pr-score').textContent = 'Score: ' + s; },
            onGameOver: () => { document.getElementById('pr-score').textContent += ' — Game Over'; }
        });

        this.pixelRacer.start();

        // wire footer buttons
        document.getElementById('pr-restart').onclick = () => {
            this.pixelRacer.reset();
            this.pixelRacer.start();
        };
        document.getElementById('pr-exit').onclick = () => {
            this.pixelRacer.stop();
            app.classList.add('hidden');
        };
    }

    takePhoto() {
        this.playSound('/camera_click.ogg');
        this.vibrate();
        // Screen flash effect
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = 'white';
        flash.style.zIndex = '1000';
        this.cameraApp.appendChild(flash);
        setTimeout(() => flash.remove(), 100);
    }

    unlock(toCamera = false) {
        if (this.lockScreen.classList.contains('hidden')) return;
        
        this.lockScreen.classList.add('unlock-animation');
        this.playSound('/Unlock.ogg');
        
        // Visual feedback
        const handle = document.getElementById('lock-handle');
        handle.style.transform = 'scale(1.5)';
        handle.style.opacity = '0';

        setTimeout(() => {
            this.lockScreen.classList.add('hidden');
            if (toCamera) {
                this.openCamera();
            }
        }, 400);
    }

    closeApps(clearRecents = true) {
        this.chromeApp.classList.add('hidden');
        this.googleApp.classList.add('hidden');
        this.youtubeApp.classList.add('hidden');
        this.playStoreApp.classList.add('hidden');
        this.cameraApp.classList.add('hidden');
        this.phoneApp.classList.add('hidden');
        this.hangoutsApp.classList.add('hidden');
        this.settingsApp.classList.add('hidden');
        this.downloadsApp.classList.add('hidden');
        this.galleryApp.classList.add('hidden');
        document.getElementById('calculator-app').classList.add('hidden');
        document.getElementById('clock-app').classList.add('hidden');
        document.getElementById('calendar-app').classList.add('hidden');
        document.getElementById('maps-app').classList.add('hidden');
        document.getElementById('messenger-app').classList.add('hidden');
        document.getElementById('whatsapp-app').classList.add('hidden');
        document.getElementById('facebook-app').classList.add('hidden');
        document.getElementById('googleplus-app').classList.add('hidden');
        document.getElementById('gmail-app').classList.add('hidden');
        document.getElementById('email-app').classList.add('hidden');
        document.getElementById('play-music-app').classList.add('hidden');
        document.getElementById('play-books-app').classList.add('hidden');
        document.getElementById('play-games-app').classList.add('hidden');
        // hide pixel racer canvas/app
        const pr = document.getElementById('pixel-racer-app');
        if (pr) pr.classList.add('hidden');
        if (this.pixelRacer) this.pixelRacer.stop();

        if (clearRecents) {
            this.recentAppsScreen.classList.add('hidden');
        }
        document.getElementById('phone-number').textContent = '';
    }

    vibrate() {
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
    }

    // Recovery Mode: long-press boot screen with one finger for 2-3s to open recovery UI
    setupRecoveryListener() {
        const boot = this.bootScreen;
        if (!boot) return;
        let pressTimer = null;
        let moved = false;
        let pointerId = null;

        const pointerDown = (e) => {
            // only accept single-finger / primary pointer
            if (pointerId !== null) return;
            pointerId = (e.pointerId !== undefined) ? e.pointerId : 'touch';
            moved = false;

            pressTimer = setTimeout(() => {
                // Long press reached: show recovery
                this.showRecovery();
            }, 2300); // 2.3s typical
        };

        const cancelPress = () => {
            if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
            pointerId = null;
        };

        const pointerMove = (e) => {
            moved = true;
            // if movement is significant cancel
            cancelPress();
        };

        // Use pointer events when available to detect single-finger long press reliably
        if (window.PointerEvent) {
            boot.addEventListener('pointerdown', pointerDown);
            boot.addEventListener('pointermove', pointerMove);
            boot.addEventListener('pointerup', cancelPress);
            boot.addEventListener('pointercancel', cancelPress);
            boot.addEventListener('pointerleave', cancelPress);
        } else {
            boot.addEventListener('touchstart', pointerDown, { passive: true });
            boot.addEventListener('touchmove', pointerMove, { passive: true });
            boot.addEventListener('touchend', cancelPress);
            boot.addEventListener('touchcancel', cancelPress);
            boot.addEventListener('mousedown', pointerDown);
            boot.addEventListener('mousemove', pointerMove);
            boot.addEventListener('mouseup', cancelPress);
            boot.addEventListener('mouseleave', cancelPress);
        }
    }

    showRecovery() {
        // If UI already shown or boot screen hidden, no-op
        if (!this.bootScreen || this.bootScreen.classList.contains('hidden')) return;
        const rec = document.getElementById('recovery-screen');
        if (!rec) return;

        // Hide main boot animation to reveal recovery
        this.bootScreen.classList.add('hidden');
        rec.classList.remove('hidden');
        // Focus options for keyboard navigation
        const list = rec.querySelector('.recovery-options');
        if (list) list.focus();

        // Highlight first option
        this._recoveryIndex = 0;
        this._recoveryOptions = Array.from(rec.querySelectorAll('.recovery-options li'));
        this._recoveryOptions.forEach(li => li.classList.remove('active'));
        if (this._recoveryOptions[0]) this._recoveryOptions[0].classList.add('active');

        // Wire interactions: keyboard volume/up/down keys map to arrow navigation
        this._recoveryKeyHandler = (e) => {
            const key = e.key.toLowerCase();
            if (key === 'arrowdown' || key === 's' || key === 'arrowright') {
                this._recoveryMove(1);
                e.preventDefault();
            } else if (key === 'arrowup' || key === 'w' || key === 'arrowleft') {
                this._recoveryMove(-1);
                e.preventDefault();
            } else if (key === 'enter' || key === 'power') {
                this._recoverySelect();
                e.preventDefault();
            } else if (key === 'backspace' || key === 'escape') {
                this.hideRecovery();
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', this._recoveryKeyHandler);

        // Touch / click handlers for options
        this._recoveryClickHandler = (ev) => {
            const li = ev.target.closest('li');
            if (!li) return;
            const idx = this._recoveryOptions.indexOf(li);
            if (idx >= 0) {
                this._recoveryIndex = idx;
                this._recoveryOptions.forEach(it => it.classList.remove('active'));
                li.classList.add('active');
                // short delay to mimic immediate selection on power press
                setTimeout(() => this._recoverySelect(), 140);
            }
        };
        rec.addEventListener('click', this._recoveryClickHandler);
    }

    _recoveryMove(delta) {
        if (!this._recoveryOptions || this._recoveryOptions.length === 0) return;
        this._recoveryIndex = (this._recoveryIndex + delta + this._recoveryOptions.length) % this._recoveryOptions.length;
        this._recoveryOptions.forEach((li, i) => {
            li.classList.toggle('active', i === this._recoveryIndex);
            if (i === this._recoveryIndex) li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
        this.playClickSound();
    }

    _recoverySelect() {
        if (!this._recoveryOptions || !this._recoveryOptions[this._recoveryIndex]) return;
        const li = this._recoveryOptions[this._recoveryIndex];
        const action = li.getAttribute('data-action');
        // Provide realistic confirmation modal for destructive actions
        switch(action) {
            case 'reboot':
                this._recoveryDoReboot();
                break;
            case 'recovery':
                alert('Apply update from ADB — (simulated)');
                break;
            case 'wipe':
                if (confirm('Wipe data/factory reset? This will erase simulated user data.')) {
                    alert('Data wiped (simulated).');
                }
                break;
            case 'cache':
                alert('Cache partition wiped (simulated).');
                break;
            case 'mount':
                alert('Mount /system (simulated).');
                break;
            case 'poweroff':
                this._recoveryDoPowerOff();
                break;
            default:
                alert('Action: ' + action);
        }
    }

    _recoveryDoReboot() {
        // Simulate reboot: hide recovery and show boot screen again, then continue boot
        const rec = document.getElementById('recovery-screen');
        if (rec) rec.classList.add('hidden');
        // briefly show a boot flash and then re-run boot sequence
        this.bootScreen.classList.remove('hidden');
        this.playSound('/Reboot.ogg').catch(()=>{});
        // simulate short reboot then show main UI as normal boot
        setTimeout(() => {
            this.bootScreen.classList.add('hidden');
            this.ui.classList.remove('hidden');
        }, 1200);
    }

    _recoveryDoPowerOff() {
        // Simulate power off by hiding everything and showing a dark screen with power off text
        const rec = document.getElementById('recovery-screen');
        if (rec) rec.classList.add('hidden');
        this.bootScreen.classList.add('hidden');
        this.ui.classList.add('hidden');

        const off = document.createElement('div');
        off.id = 'powered-off-sim';
        off.style.position = 'absolute';
        off.style.top = '0';
        off.style.left = '0';
        off.style.width = '100%';
        off.style.height = '100%';
        off.style.background = '#000';
        off.style.color = '#fff';
        off.style.display = 'flex';
        off.style.alignItems = 'center';
        off.style.justifyContent = 'center';
        off.style.zIndex = '2000';
        off.style.fontFamily = 'monospace';
        off.textContent = 'Device powered off (simulated). Tap to power on.';
        document.getElementById('phone-container').appendChild(off);

        off.addEventListener('click', () => {
            off.remove();
            // show boot screen again then boot
            this.bootScreen.classList.remove('hidden');
            setTimeout(() => {
                this.bootScreen.classList.add('hidden');
                this.ui.classList.remove('hidden');
            }, 1200);
        }, { once: true });
    }

    hideRecovery() {
        const rec = document.getElementById('recovery-screen');
        if (!rec || rec.classList.contains('hidden')) return;
        rec.classList.add('hidden');
        // restore boot screen hidden state: where main UI should be visible
        this.ui.classList.remove('hidden');
        window.removeEventListener('keydown', this._recoveryKeyHandler);
        rec.removeEventListener('click', this._recoveryClickHandler);
        this._recoveryOptions = null;
        this._recoveryIndex = 0;
    }

    /* Simple Pixel Racer game implementation (minimal arcade lane-drive) */
    // Canvas-based small game: steer left/right, accelerate/brake, avoid obstacles.
    // Keeps a simple score based on distance.
    // Lightweight, starts/stops with app lifecycle.
    // Usage: new PixelRacer(canvasId, { onScore, onGameOver })
    PixelRacer = class {
        constructor(canvasId, opts = {}) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.running = false;
            this.paused = false;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = { x: this.width / 2, y: this.height - 80, w: 40, h: 60, speed: 0 };
            this.obstacles = [];
            this.spawnTimer = 0;
            this.score = 0;
            this.onScore = opts.onScore || function(){};
            this.onGameOver = opts.onGameOver || function(){};
            // accept a playSound callback via opts to avoid relying on outer scope
            this.playSound = opts.playSound || function(){};
            this.keys = { left:false, right:false, up:false, down:false };
            this._boundLoop = this._loop.bind(this);
            this._bindInputs();
        }

        _bindInputs() {
            // Keyboard controls (accept uppercase/lowercase letters too)
            window.addEventListener('keydown', (e) => {
                const k = e.key.toLowerCase();
                if (k === 'arrowleft' || k === 'a') this.keys.left = true;
                if (k === 'arrowright' || k === 'd') this.keys.right = true;
                if (k === 'arrowup' || k === 'w') this.keys.up = true;
                if (k === 'arrowdown' || k === 's') this.keys.down = true;
            });
            window.addEventListener('keyup', (e) => {
                const k = e.key.toLowerCase();
                if (k === 'arrowleft' || k === 'a') this.keys.left = false;
                if (k === 'arrowright' || k === 'd') this.keys.right = false;
                if (k === 'arrowup' || k === 'w') this.keys.up = false;
                if (k === 'arrowdown' || k === 's') this.keys.down = false;
            });

            // Pointer-based controls (works for mouse & touch)
            const downHandler = (ev) => {
                const rect = this.canvas.getBoundingClientRect();
                const clientX = (ev.clientX !== undefined) ? ev.clientX : (ev.touches && ev.touches[0] && ev.touches[0].clientX);
                if (clientX === undefined) return;
                const x = clientX - rect.left;
                // use rect.width to handle CSS-scaled canvas correctly
                if (x < rect.width / 2) {
                    this.keys.left = true;
                    this.keys.right = false;
                } else {
                    this.keys.right = true;
                    this.keys.left = false;
                }
            };
            const upHandler = () => {
                this.keys.left = false;
                this.keys.right = false;
            };

            // pointer events unify mouse/touch; fall back to touch/mouse if not supported
            if (window.PointerEvent) {
                this.canvas.addEventListener('pointerdown', downHandler);
                window.addEventListener('pointerup', upHandler);
                this.canvas.addEventListener('pointercancel', upHandler);
            } else {
                // touch fallback
                this.canvas.addEventListener('touchstart', downHandler, { passive: true });
                this.canvas.addEventListener('touchend', upHandler);
                // mouse fallback
                this.canvas.addEventListener('mousedown', downHandler);
                window.addEventListener('mouseup', upHandler);
            }
        }

        start() {
            if (this.running) return;
            this.running = true;
            this.paused = false;
            this.lastTs = performance.now();
            this.score = 0;
            this.obstacles = [];
            this.player.x = this.width/2;
            this.player.speed = 4;
            requestAnimationFrame(this._boundLoop);
        }

        stop() {
            this.running = false;
        }

        reset() {
            this.stop();
            this.score = 0;
            this.obstacles = [];
            this.player.x = this.width/2;
            this.player.speed = 4;
            this.onScore(this.score);
        }

        _loop(ts) {
            if (!this.running) return;
            const dt = Math.min(40, ts - this.lastTs) / 16;
            this.lastTs = ts;

            // update player
            if (this.keys.left) this.player.x -= 4 * dt;
            if (this.keys.right) this.player.x += 4 * dt;
            if (this.keys.up) this.player.speed = Math.min(10, this.player.speed + 0.05 * dt * 4);
            if (this.keys.down) this.player.speed = Math.max(2, this.player.speed - 0.1 * dt * 4);

            // clamp to road bounds
            const roadLeft = 100;
            const roadRight = this.width - 100;
            if (this.player.x < roadLeft + this.player.w/2) this.player.x = roadLeft + this.player.w/2;
            if (this.player.x > roadRight - this.player.w/2) this.player.x = roadRight - this.player.w/2;

            // spawn obstacles
            this.spawnTimer += dt;
            if (this.spawnTimer > 30) {
                this.spawnTimer = 0;
                const laneX = roadLeft + 40 + Math.random() * (roadRight - roadLeft - 80);
                const w = 30 + Math.random() * 50;
                this.obstacles.push({ x: laneX, y: -60, w: w, h: 40, speed: this.player.speed + Math.random() * 2 + 1 });
            }

            // update obstacles
            for (let i = this.obstacles.length -1; i >=0; i--) {
                const o = this.obstacles[i];
                o.y += o.speed * dt;
                // collision
                const px = this.player.x - this.player.w/2, py = this.player.y - this.player.h/2;
                if (o.x < px + this.player.w && o.x + o.w > px && o.y < py + this.player.h && o.y + o.h > py) {
                    // hit
                    this.running = false;
                    this.onGameOver();
                    this.playSound('/KeypressInvalid.ogg');
                    return;
                }
                if (o.y > this.height + 100) {
                    this.obstacles.splice(i,1);
                    this.score += 10;
                    this.onScore(this.score);
                }
            }

            this._render();
            requestAnimationFrame(this._boundLoop);
        }

        _render() {
            const ctx = this.ctx;
            ctx.clearRect(0,0,this.width,this.height);

            // Side grass with scrolling pattern
            const offset = (performance.now() * 0.1 * this.player.speed) % 100;
            ctx.fillStyle = '#2e7d32';
            ctx.fillRect(0,0,this.width,this.height);
            
            // Draw roadside trees/details
            ctx.fillStyle = '#1b5e20';
            for(let y = -100; y < this.height + 100; y += 100) {
                ctx.fillRect(20, y + offset, 40, 40);
                ctx.fillRect(this.width - 60, y + offset, 40, 40);
            }

            // Road area with gradient
            const roadLeft = 100;
            const roadRight = this.width - 100;
            const roadGrad = ctx.createLinearGradient(roadLeft, 0, roadRight, 0);
            roadGrad.addColorStop(0, '#1a1a1a');
            roadGrad.addColorStop(0.5, '#2c2c2c');
            roadGrad.addColorStop(1, '#1a1a1a');
            ctx.fillStyle = roadGrad;
            ctx.fillRect(roadLeft,0,roadRight-roadLeft,this.height);

            // Side lines
            ctx.fillStyle = '#fff';
            ctx.fillRect(roadLeft + 5, 0, 4, this.height);
            ctx.fillRect(roadRight - 9, 0, 4, this.height);

            // Center dashed line (animated)
            ctx.strokeStyle = '#fdd835';
            ctx.lineWidth = 4;
            ctx.setLineDash([40, 40]);
            ctx.lineDashOffset = -performance.now() * 0.2 * this.player.speed;
            ctx.beginPath();
            ctx.moveTo(this.width/2, 0);
            ctx.lineTo(this.width/2, this.height);
            ctx.stroke();
            ctx.setLineDash([]);

            // Player car (Better detailed)
            const px = this.player.x - this.player.w/2;
            const py = this.player.y - this.player.h/2;
            // Car Body
            ctx.fillStyle = '#33b5e5';
            ctx.beginPath();
            ctx.roundRect(px, py, this.player.w, this.player.h, 8);
            ctx.fill();
            // Roof
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(px+4, py+14, this.player.w-8, 28);
            // Windows
            ctx.fillStyle = '#90caf9';
            ctx.fillRect(px+6, py+16, this.player.w-12, 10); // Front
            ctx.fillRect(px+6, py+30, this.player.w-12, 10); // Rear
            // Headlights
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(px+4, py+2, 8, 4);
            ctx.fillRect(px+this.player.w-12, py+2, 8, 4);
            // Taillights
            ctx.fillStyle = '#f44336';
            ctx.fillRect(px+4, py+this.player.h-6, 8, 4);
            ctx.fillRect(px+this.player.w-12, py+this.player.h-6, 8, 4);

            // Obstacles (Rendered as other cars)
            this.obstacles.forEach(o => {
                ctx.fillStyle = '#e53935';
                ctx.beginPath();
                ctx.roundRect(o.x, o.y, o.w, o.h, 6);
                ctx.fill();
                // Detail for obstacle car
                ctx.fillStyle = '#333';
                ctx.fillRect(o.x+5, o.y+8, o.w-10, 20);
            });

            // HUD (KitKat style)
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(10, 10, 120, 50);
            ctx.fillStyle = '#33b5e5';
            ctx.font = 'bold 12px Roboto, sans-serif';
            ctx.fillText('SPEED: ' + Math.round(this.player.speed * 10) + ' KM/H', 20, 28);
            ctx.fillStyle = '#fff';
            ctx.fillText('SCORE: ' + this.score, 20, 48);
        }
    };

    async playSound(path) {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        try {
            const response = await fetch(path);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(this.audioContext.destination);
            source.start(0);
        } catch (e) {
            console.error("Error playing sound:", path, e);
        }
    }

    async playClickSound() {
        this.playSound('/click_tick.mp3');
    }

    // Chrome address/search helpers
    setupChromeSearch() {
        const input = document.getElementById('chrome-address-input');
        const goBtn = document.getElementById('chrome-go-btn');
        const iframe = document.getElementById('chrome-iframe');

        if (!input || !iframe) return;

        const navigate = (raw) => {
            let text = (raw || '').trim();
            if (!text) return;

            // If looks like a search (contains spaces or no dot), do a Google search.
            const isLikelySearch = text.includes(' ') || !text.includes('.');
            let target = text;

            if (isLikelySearch) {
                target = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
            } else {
                // If protocol missing, add https
                if (!/^https?:\/\//i.test(text)) {
                    target = 'https://' + text;
                }
            }

            // Hosts known to block framing or be problematic in iframes
            const blockedHosts = ['youtube.com', 'm.youtube.com', 'www.youtube.com', 'google.com', 'www.google.com'];
            let urlObj = null;
            try {
                urlObj = new URL(target);
            } catch (e) {
                // fallback: treat as search
                target = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
                urlObj = new URL(target);
            }

            // If YouTube, try to load embed player for better iframe compatibility
            if (urlObj.hostname.includes('youtube.com')) {
                // try to extract a video id from common forms (watch?v=ID or youtu.be/ID)
                const searchParams = urlObj.searchParams;
                let videoId = searchParams.get('v');
                if (!videoId) {
                    // try short link style
                    const match = urlObj.pathname.match(/\/embed\/([^\/\?]+)/) || urlObj.pathname.match(/\/watch\/([^\/\?]+)/) || urlObj.pathname.match(/\/v\/([^\/\?]+)/);
                    if (match && match[1]) videoId = match[1];
                    else {
                        const short = target.match(/youtu\.be\/([^\?\/]+)/);
                        if (short && short[1]) videoId = short[1];
                    }
                }
                if (videoId) {
                    target = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0`;
                } else {
                    // If no video id, prefer opening youtube main in new tab to avoid X-Frame-Options issues
                    window.open(target, '_blank', 'noopener');
                    showChromeToast('Opened YouTube in a new tab because it cannot be framed.');
                    this.addToHistory('chrome');
                    this.playClickSound();
                    return;
                }
            }

            // For other blocked hosts (like google.com) avoid framing and open in new tab
            if (blockedHosts.some(h => urlObj.hostname.includes(h) && !urlObj.hostname.includes('youtube.com'))) {
                window.open(target, '_blank', 'noopener');
                showChromeToast('Opened site in a new tab because it may block framing.');
                this.addToHistory('chrome');
                this.playClickSound();
                return;
            }

            try {
                iframe.src = target;
                this.addToHistory('chrome');
                this.playClickSound();
            } catch (e) {
                console.error('Navigation failed', e);
                // final fallback: open externally
                window.open(target, '_blank', 'noopener');
                showChromeToast('Navigation failed — opened externally.');
            }
        };

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                navigate(input.value);
            }
        });

        goBtn && goBtn.addEventListener('click', () => {
            navigate(input.value);
        });

        // Pre-fill input from iframe initial src
        try {
            if (iframe && iframe.src) input.value = iframe.src;
        } catch (e) {}

        // Small toast helper to inform user when we open externally instead of framing
        const showChromeToast = (msg) => {
            let toast = document.getElementById('chrome-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'chrome-toast';
                toast.style.position = 'absolute';
                toast.style.bottom = '72px';
                toast.style.left = '50%';
                toast.style.transform = 'translateX(-50%)';
                toast.style.background = 'rgba(0,0,0,0.8)';
                toast.style.color = '#fff';
                toast.style.padding = '8px 12px';
                toast.style.borderRadius = '6px';
                toast.style.zIndex = '2000';
                toast.style.fontSize = '13px';
                toast.style.maxWidth = '80%';
                toast.style.textAlign = 'center';
                document.getElementById('chrome-app').appendChild(toast);
            }
            toast.textContent = msg;
            toast.style.opacity = '1';
            setTimeout(() => {
                toast.style.transition = 'opacity 400ms';
                toast.style.opacity = '0';
            }, 2200);
        };
    }
}

/* AOSP On-screen Keyboard Implementation */
class AOSPKeyboard {
    constructor() {
        this.el = document.getElementById('aosp-keyboard');
        this.shift = false;
        this.symbol = false;
        this.target = null; // active input element
        this._bindKeys();
        this._attachGlobalFocus();
    }

    _bindKeys() {
        if (!this.el) return;
        this.el.addEventListener('click', (e) => {
            const keyEl = e.target.closest('.kbd-key');
            if (!keyEl) return;
            const key = keyEl.getAttribute('data-key');
            this._handleKey(key, keyEl);
        });
    }

    _handleKey(key, keyEl) {
        if (!this.target) return;
        const input = this.target;
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        const val = input.value || '';

        const commit = (newVal, caret) => {
            input.value = newVal;
            input.setSelectionRange(caret, caret);
            // fire input event for listeners
            input.dispatchEvent(new Event('input', { bubbles: true }));
        };

        if (key === 'shift') {
            this.shift = !this.shift;
            keyEl.classList.toggle('active', this.shift);
            this._updateKeysCase();
            return;
        }

        if (key === 'symbol') {
            this.symbol = !this.symbol;
            keyEl.classList.toggle('active', this.symbol);
            this._toggleSymbols();
            return;
        }

        if (key === 'backspace') {
            if (start === end && start > 0) {
                const newVal = val.slice(0, start - 1) + val.slice(end);
                commit(newVal, start - 1);
            } else if (start !== end) {
                const newVal = val.slice(0, start) + val.slice(end);
                commit(newVal, start);
            }
            return;
        }

        if (key === 'space') {
            const newVal = val.slice(0, start) + ' ' + val.slice(end);
            commit(newVal, start + 1);
            return;
        }

        if (key === 'enter') {
            const newVal = val.slice(0, start) + '\n' + val.slice(end);
            commit(newVal, start + 1);
            // trigger keyboardspecific enter behavior
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            return;
        }

        if (key === 'done') {
            this.hide();
            input.blur();
            return;
        }

        if (key === 'emoji') {
            // simple insertion of an emoji picker placeholder - add a smiley
            const newVal = val.slice(0, start) + '😊' + val.slice(end);
            commit(newVal, start + 2);
            return;
        }

        // regular character
        let char = key;
        if (this.shift) char = char.toUpperCase();
        const newVal = val.slice(0, start) + char + val.slice(end);
        commit(newVal, start + char.length);

        // if shift was a one-shot, reset it
        if (this.shift) {
            this.shift = false;
            this._updateKeysCase();
            const shiftKey = this.el.querySelector('[data-key="shift"]');
            if (shiftKey) shiftKey.classList.remove('active');
        }
    }

    _updateKeysCase() {
        const keys = Array.from(this.el.querySelectorAll('.kbd-key.k'));
        keys.forEach(k => {
            const ch = k.getAttribute('data-key');
            k.textContent = this.shift ? ch.toUpperCase() : ch.toLowerCase();
        });
    }

    _toggleSymbols() {
        // quick symbol set when toggled
        const letterKeys = this.el.querySelectorAll('.kbd-key.k');
        const symbols = ['1','2','3','4','5','6','7','8','9','0',
                         '@','#','$','_','&','-','+','(',')','/',
                         '*','"',"'",':',';','!','?','.','%',',','~'];
        if (this.symbol) {
            Array.from(letterKeys).forEach((k,i) => {
                k.textContent = symbols[i % symbols.length];
                k.setAttribute('data-key', symbols[i % symbols.length]);
            });
        } else {
            // restore alpha layout
            const alpha = ['q','w','e','r','t','y','u','i','o','p',
                           'a','s','d','f','g','h','j','k','l','backspace',
                           'z','x','c','v','b','n','m','enter'];
            const keysArr = Array.from(this.el.querySelectorAll('.kbd-row')).flatMap(row => Array.from(row.querySelectorAll('.kbd-key.k, .kbd-key.special')));
            // map back by positions for rows r1,r2,r3 (we will restore via known data-key mapping)
            const map = ['q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'];
            const kNodes = Array.from(this.el.querySelectorAll('.kbd-key.k'));
            kNodes.forEach((n, idx) => {
                const ch = map[idx] || n.getAttribute('data-key');
                n.textContent = this.shift ? ch.toUpperCase() : ch.toLowerCase();
                n.setAttribute('data-key', ch);
            });
        }
    }

    showFor(inputElem) {
        if (!this.el) return;
        this.target = inputElem;
        // position keyboard: already anchored to bottom; ensure visible
        this.el.classList.remove('hidden');
        this.el.setAttribute('aria-hidden', 'false');
        // small delay to ensure layout, then focus caret preserved
        setTimeout(() => {
            inputElem.focus();
        }, 20);
    }

    hide() {
        if (!this.el) return;
        this.el.classList.add('hidden');
        this.el.setAttribute('aria-hidden', 'true');
        this.target = null;
    }

    _attachGlobalFocus() {
        // Attach to input/textarea fields that should use the AOSP keyboard
        const focusableSelector = 'input[type="text"], input[type="search"], input[type="url"], input[type="email"], textarea, input[placeholder], .chat-input-area input, .wa-chat-input, #ps-search-input, #yt-search-input, #chrome-address-input, .chat-input-area input';
        document.addEventListener('focusin', (e) => {
            const el = e.target;
            if (!el) return;
            // ignore contenteditable or hidden fields
            if (el.matches && el.matches(focusableSelector)) {
                // prevent mobile default keyboard if possible (best-effort)
                // show on-screen keyboard
                this.showFor(el);
            }
        });

        // hide on focusout (but allow clicking keyboard)
        document.addEventListener('focusout', (e) => {
            const el = e.target;
            // give time for keyboard click to process focus transfer
            setTimeout(() => {
                if (document.activeElement && (document.activeElement === this.el || this.el.contains(document.activeElement))) {
                    // keep open if keyboard itself focused
                    return;
                }
                // if active element is an input we keep keyboard open
                if (document.activeElement && document.activeElement.matches && document.activeElement.matches('input, textarea')) {
                    this.target = document.activeElement;
                    return;
                }
                this.hide();
            }, 120);
        });

        // allow manual hide when tapping outside keyboard & inputs
        document.addEventListener('click', (e) => {
            if (!this.el) return;
            const target = e.target;
            const isInput = target && (target.matches && target.matches('input, textarea') || target.closest && target.closest('#aosp-keyboard'));
            if (!isInput && !target.closest('#aosp-keyboard')) {
                this.hide();
            }
        });
    }
}

 // Initialize on load
window.addEventListener('load', () => {
    // instantiate main system first
    const sys = new AndroidSystem();
    // then create keyboard instance
    window.AOSP_KEYBOARD = new AOSPKeyboard();

    // Ensure existing custom chat modals and dynamic inputs are wired to focus the keyboard:
    // Delegate click-to-focus for custom message inputs added dynamically (WhatsApp chat modals, Play Store redeem input, etc.)
    document.addEventListener('click', (e) => {
        const inp = e.target.closest('input, textarea');
        if (!inp) return;
        // if element visible and not readonly, show keyboard
        if (!inp.readOnly && inp.offsetParent !== null) {
            window.AOSP_KEYBOARD.showFor(inp);
        }
    });

    // --- Enhanced WhatsApp & Facebook functionality (persistent, in-app, real interactions) ---
    // Persistent chat storage helper
    const CHAT_STORE_KEY = 'kitkat_whatsapp_chats_v1';
    const loadChats = () => {
        try { return JSON.parse(localStorage.getItem(CHAT_STORE_KEY) || '{}'); } catch(e){ return {}; }
    };
    const saveChats = (data) => localStorage.setItem(CHAT_STORE_KEY, JSON.stringify(data));

    // Ensure base contacts are present (but keep UI original)
    const defaultContacts = [
        { id: 'john_doe', name: 'John Doe', color: '#075e54' },
        { id: 'mom', name: 'Mom', color: '#128c7e' }
    ];
    const chats = loadChats();
    defaultContacts.forEach(c => { if (!chats[c.id]) chats[c.id] = { meta: c, messages: [] }; });
    saveChats(chats);

    // Render WhatsApp chat list (maintain original WA UI)
    const waApp = document.getElementById('whatsapp-app');
    const waContent = waApp.querySelector('.wa-content');
    const renderChatList = () => {
        waContent.innerHTML = '';
        Object.values(chats).forEach(chat => {
            const last = chat.messages[chat.messages.length - 1];
            const preview = last ? (last.text.length > 40 ? last.text.slice(0, 37) + '...' : last.text) : '';
            const time = last ? new Date(last.ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
            const node = document.createElement('div');
            node.className = 'wa-item';
            node.style.display = 'flex';
            node.style.cursor = 'pointer';
            node.style.padding = '12px 16px';
            node.innerHTML = `
                <div class="avatar" style="background: ${chat.meta.color}">${chat.meta.name[0]}</div>
                <div class="wa-info" style="flex:1;">
                    <div class="wa-name-row" style="display:flex;justify-content:space-between;">
                        <span class="wa-name" style="font-weight:700">${chat.meta.name}</span>
                        <span class="wa-time" style="font-size:11px;color:#888">${time}</span>
                    </div>
                    <div class="wa-msg" style="color:#666">${preview || 'No messages yet'}</div>
                </div>
            `;
            node.addEventListener('click', () => openWhatsAppChat(chat.meta.id));
            waContent.appendChild(node);
        });
    };

    // Chat view (in-app, retains top bar look)
    const openWhatsAppChat = (id) => {
        const chat = chats[id];
        if (!chat) return;
        // build chat view
        const existing = waApp.querySelector('.wa-chat-screen');
        if (existing) existing.remove();

        const chatScreen = document.createElement('div');
        chatScreen.className = 'wa-chat-screen';
        chatScreen.style.position = 'absolute';
        chatScreen.style.top = '0';
        chatScreen.style.left = '0';
        chatScreen.style.width = '100%';
        chatScreen.style.height = '100%';
        chatScreen.style.background = '#e5ddd5';
        chatScreen.style.zIndex = '120';
        chatScreen.style.display = 'flex';
        chatScreen.style.flexDirection = 'column';

        chatScreen.innerHTML = `
            <div style="height:56px;background:#075e54;color:white;display:flex;align-items:center;padding:0 12px;gap:12px;flex-shrink:0;">
                <button class="wa-chat-back" style="background:transparent;border:none;color:white;font-size:20px;cursor:pointer;">←</button>
                <div style="display:flex;gap:12px;align-items:center;">
                    <div style="width:36px;height:36px;border-radius:50%;background:${chat.meta.color};display:flex;align-items:center;justify-content:center;font-weight:700;">${chat.meta.name[0]}</div>
                    <div style="font-weight:600;">${chat.meta.name}</div>
                </div>
            </div>
            <div class="wa-chat-messages" style="flex:1;padding:12px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;"></div>
            <div style="height:56px;display:flex;gap:8px;padding:8px;border-top:1px solid #eee;background:white;flex-shrink:0;">
                <input class="wa-chat-input" placeholder="Type a message..." style="flex:1;border:1px solid #ddd;padding:8px 16px;border-radius:24px;outline:none;font-size:14px;">
                <button class="wa-chat-send" style="background:#075e54;border:none;color:white;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px;">➤</button>
            </div>
        `;

        waApp.appendChild(chatScreen);

        const messagesEl = chatScreen.querySelector('.wa-chat-messages');
        const inputEl = chatScreen.querySelector('.wa-chat-input');
        const sendBtn = chatScreen.querySelector('.wa-chat-send');
        const backBtn = chatScreen.querySelector('.wa-chat-back');

        const renderMessages = () => {
            messagesEl.innerHTML = '';
            chat.messages.forEach(m => {
                const mEl = document.createElement('div');
                mEl.className = 'wa-bubble ' + (m.outgoing ? 'sent' : 'received');
                const time = new Date(m.ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                mEl.innerHTML = `<div>${m.text}</div><div class="wa-bubble-time">${time}</div>`;
                messagesEl.appendChild(mEl);
            });
            messagesEl.scrollTop = messagesEl.scrollHeight;
        };

        renderMessages();

        // Send handler - persist messages
        const sendMessage = () => {
            const txt = inputEl.value.trim();
            if (!txt) return;
            const msg = { text: txt, ts: Date.now(), outgoing: true };
            chat.messages.push(msg);
            saveChats(chats);
            renderMessages();
            inputEl.value = '';
            sys.playSound('/KeypressStandard.ogg');

            // do NOT inject a preloaded conversation or forced mock; optional minimal auto-reply kept off by default
            // If user wants a liveliness toggle, they'd enable it via settings (not implemented here).
        };

        sendBtn.addEventListener('click', sendMessage);
        inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

        backBtn.addEventListener('click', () => {
            chatScreen.remove();
            renderChatList();
        });

        // focus input and show on-screen keyboard
        setTimeout(() => { inputEl.focus(); window.AOSP_KEYBOARD.showFor(inputEl); }, 100);
    };

    // Wire initial WA contact renderer and FAB to add new contact/chat
    renderChatList();
    const waFab = waApp.querySelector('.wa-fab');
    waFab && waFab.addEventListener('click', () => {
        const name = prompt('New chat name:');
        if (!name) return;
        const id = name.toLowerCase().replace(/\s+/g,'_').replace(/[^\w_]/g,'') + '_' + Date.now().toString(36);
        chats[id] = { meta: { id, name, color: '#'+Math.floor(Math.random()*16777215).toString(16) }, messages: [] };
        saveChats(chats);
        renderChatList();
    });

    // --- Gmail Compose Functionality ---
    const gmailApp = document.getElementById('gmail-app');
    const gmailFab = gmailApp.querySelector('.gmail-fab');
    gmailFab && gmailFab.addEventListener('click', () => {
        const composeScreen = document.createElement('div');
        composeScreen.style.position = 'absolute';
        composeScreen.style.top = '0';
        composeScreen.style.left = '0';
        composeScreen.style.width = '100%';
        composeScreen.style.height = '100%';
        composeScreen.style.background = 'white';
        composeScreen.style.zIndex = '50';
        composeScreen.style.display = 'flex';
        composeScreen.style.flexDirection = 'column';
        composeScreen.innerHTML = `
            <div style="height:56px; background:#db4437; color:white; display:flex; align-items:center; padding:0 16px; gap:24px; flex-shrink:0;">
                <span class="compose-back" style="font-size:24px; cursor:pointer;">←</span>
                <span style="font-size:20px; font-weight:500; flex:1;">Compose</span>
                <span class="compose-send" style="font-size:20px; cursor:pointer;">➤</span>
            </div>
            <div style="flex:1; padding:16px; display:flex; flex-direction:column; gap:16px;">
                <input class="compose-to" type="text" placeholder="To" style="border:none; border-bottom:1px solid #eee; padding:8px 0; outline:none; font-size:16px;">
                <input class="compose-sub" type="text" placeholder="Subject" style="border:none; border-bottom:1px solid #eee; padding:8px 0; outline:none; font-size:16px;">
                <textarea class="compose-body" placeholder="Compose email" style="flex:1; border:none; resize:none; outline:none; font-size:16px; padding:8px 0;"></textarea>
            </div>
        `;
        gmailApp.appendChild(composeScreen);
        
        const back = composeScreen.querySelector('.compose-back');
        const send = composeScreen.querySelector('.compose-send');
        back.onclick = () => composeScreen.remove();
        send.onclick = () => {
            alert('Email sent!');
            composeScreen.remove();
            sys.playSound('/WirelessChargingStarted.ogg');
        };
        // keyboard focus
        setTimeout(() => composeScreen.querySelector('.compose-to').focus(), 100);
    });

    // --- Facebook: Shared feed across all users using websim.kv ---
    const FB_STORE_KEY = 'fb_feed_v1';
    
    // Fallback if websim.kv is unavailable (unlikely in this environment)
    const loadFeed = async () => {
        if (window.websim && window.websim.kv) {
            const result = await window.websim.kv.get(FB_STORE_KEY);
            return Array.isArray(result) ? result : [];
        }
        try { return JSON.parse(localStorage.getItem(FB_STORE_KEY) || '[]'); } catch(e){ return []; }
    };

    const saveFeed = async (feed) => {
        if (window.websim && window.websim.kv) {
            await window.websim.kv.set(FB_STORE_KEY, feed);
            return;
        }
        localStorage.setItem(FB_STORE_KEY, JSON.stringify(feed));
    };

    // Initialize feed with default content if truly empty
    const initFeed = async () => {
        const feed = await loadFeed();
        if (feed.length === 0) {
            const seed = [
                { id: 'seed_1', author: 'Facebook Team', text: 'Welcome to the new shared Facebook experience!', time: Date.now() - 1000000, likes: 5, liked: false, comments: [] },
                { id: 'seed_2', author: 'Android KitKat', text: 'Holo is the future. #android44', time: Date.now() - 500000, likes: 12, liked: false, comments: [] }
            ];
            await saveFeed(seed);
            return seed;
        }
        return feed;
    };

    // Render feed from storage into fb-content
    const fbContent = document.querySelector('#facebook-app .fb-content');
    const renderFeed = async () => {
        fbContent.innerHTML = '<div style="padding:20px;text-align:center;color:#666;">Loading feed...</div>';
        
        const currentFeed = await loadFeed();
        fbContent.innerHTML = '';

        // composer
        const composer = document.createElement('div');
        composer.style.background = 'white';
        composer.style.padding = '12px';
        composer.style.marginBottom = '8px';
        composer.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
        composer.innerHTML = `<div style="display:flex;gap:8px;align-items:center;">
            <div style="width:40px;height:40px;border-radius:50%;background:#3b5998;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;">Y</div>
            <input id="fb-composer-input" placeholder="What's on your mind?" style="flex:1;border:1px solid #eee;padding:10px;border-radius:20px;outline:none;font-size:14px;">
            <button id="fb-post-btn" style="background:#3b5998;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-weight:600;font-size:13px;">Post</button>
        </div>`;
        fbContent.appendChild(composer);

        // Sort feed by time descending
        currentFeed.sort((a,b) => b.time - a.time).forEach(p => {
            const post = document.createElement('div');
            post.className = 'fb-post';
            post.dataset.postId = p.id;
            post.style.marginBottom = '12px';
            post.innerHTML = `
                <div class="fb-post-header">
                    <div class="avatar mini" style="background:#3b5998">${p.author[0] || 'U'}</div>
                    <div class="fb-post-meta">
                        <div class="fb-post-author">${p.author}</div>
                        <div class="fb-post-time">${new Date(p.time).toLocaleString()}</div>
                    </div>
                </div>
                <div class="fb-post-text">${p.text}</div>
                <div class="fb-post-actions" style="display:flex;gap:16px;align-items:center;">
                    <span class="fb-like-btn" style="cursor:pointer;color:${p.liked ? '#3b5998' : '#777'}">Like (${p.likes})</span>
                    <span class="fb-comment-toggle" style="cursor:pointer;color:#777">Comment (${p.comments.length})</span>
                </div>
                <div class="fb-comments" style="margin-top:8px;display:none;padding-top:8px;border-top:1px solid #f1f1f1;"></div>
            `;
            fbContent.appendChild(post);

            const likeBtn = post.querySelector('.fb-like-btn');
            const commentToggle = post.querySelector('.fb-comment-toggle');
            const commentsContainer = post.querySelector('.fb-comments');

            likeBtn.addEventListener('click', async () => {
                const feedArr = await loadFeed();
                const idx = feedArr.findIndex(it => it.id === p.id);
                if (idx >= 0) {
                    feedArr[idx].liked = !feedArr[idx].liked;
                    feedArr[idx].likes = Math.max(0, (feedArr[idx].likes || 0) + (feedArr[idx].liked ? 1 : -1));
                    await saveFeed(feedArr);
                    renderFeed();
                }
            });

            commentToggle.addEventListener('click', async () => {
                const isVisible = commentsContainer.style.display === 'block';
                commentsContainer.style.display = isVisible ? 'none' : 'block';
                if (isVisible) return;

                // Refresh comments from KV
                const feedArr = await loadFeed();
                const found = feedArr.find(it => it.id === p.id);
                commentsContainer.innerHTML = '';
                if (found) {
                    found.comments.forEach(c => {
                        const cEl = document.createElement('div');
                        cEl.style.background = '#f5f6f7';
                        cEl.style.padding = '8px';
                        cEl.style.marginBottom = '6px';
                        cEl.style.borderRadius = '6px';
                        cEl.textContent = `${c.author}: ${c.text}`;
                        commentsContainer.appendChild(cEl);
                    });
                    const composerRow = document.createElement('div');
                    composerRow.style.display = 'flex';
                    composerRow.style.gap = '8px';
                    composerRow.innerHTML = `<input class="fb-comment-input" placeholder="Write a comment..." style="flex:1;padding:8px;border:1px solid #eee;border-radius:4px;"><button class="fb-comment-post" style="background:#3b5998;color:white;border:none;padding:8px 10px;border-radius:4px;cursor:pointer;">Comment</button>`;
                    commentsContainer.appendChild(composerRow);
                    const input = composerRow.querySelector('.fb-comment-input');
                    const btn = composerRow.querySelector('.fb-comment-post');
                    btn.addEventListener('click', async () => {
                        const txt = input.value.trim();
                        if (!txt) return;
                        btn.disabled = true;
                        const feedArr2 = await loadFeed();
                        const idx2 = feedArr2.findIndex(it => it.id === p.id);
                        if (idx2 >= 0) {
                            feedArr2[idx2].comments.push({ author: 'Websim User', text: txt, ts: Date.now() });
                            await saveFeed(feedArr2);
                            renderFeed();
                        }
                    });
                    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') composerRow.querySelector('.fb-comment-post').click(); });
                }
            });
        });

        // composer wiring
        const composerInput = document.getElementById('fb-composer-input');
        const composerBtn = document.getElementById('fb-post-btn');
        composerBtn && composerBtn.addEventListener('click', async () => {
            const txt = composerInput.value.trim();
            if (!txt) return;
            composerBtn.disabled = true;
            const feedArr = await loadFeed();
            const post = { 
                id: 'p_' + Date.now().toString(36), 
                author: 'Websim User', 
                text: txt, 
                time: Date.now(), 
                likes: 0, 
                liked: false, 
                comments: [] 
            };
            feedArr.push(post);
            await saveFeed(feedArr);
            composerInput.value = '';
            renderFeed();
        });
        composerInput && composerInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') composerBtn.click(); });
    };

    // Initial data load
    initFeed().then(() => renderFeed());
    
    // Auto-refresh feed every 30 seconds to see other users' posts
    setInterval(renderFeed, 30000);

    // Keep WhatsApp and Facebook consistent when switching apps: re-render relevant UIs on open
    const origOpenWhatsApp = sys.openWhatsApp.bind(sys);
    sys.openWhatsApp = () => { origOpenWhatsApp(); renderChatList(); };

    const origOpenFacebook = sys.openFacebook.bind(sys);
    sys.openFacebook = () => { origOpenFacebook(); renderFeed(); };

    // Ensure the keyboard shows for Facebook composer input when opened
    document.addEventListener('click', (e) => {
        const inp = e.target.closest('#fb-composer-input, .fb-comment-input, .wa-chat-input');
        if (inp) window.AOSP_KEYBOARD.showFor(inp);
    });
});