// ===== CORE CONFIGURATION =====
const CONFIG = {
    API_BASE_URL: 'https://api.finsakhi.com',
    AUTH_ENDPOINTS: {
        sendOTP: '/auth/send-otp',
        verifyOTP: '/auth/verify-otp',
        signup: '/auth/signup',
        logout: '/auth/logout'
    },
    STORAGE_KEYS: {
        token: 'finsakhi_token',
        user: 'finsakhi_user',
        language: 'finsakhi_language',
        phone: 'finsakhi_last_phone',
        pendingOTP: 'finsakhi_pending_otp'
    },
    DEFAULT_LANGUAGE: 'en',
    SUPPORTED_LANGUAGES: ['en', 'ta', 'hi'],
    OTP_EXPIRY_TIME: 120000, // 2 minutes in milliseconds
    OTP_LENGTH: 6
};

// ===== STATE MANAGEMENT =====
class AppState {
    constructor() {
        this.user = this.getStoredUser();
        this.token = this.getStoredToken();
        this.language = this.getStoredLanguage();
        this.isAuthenticated = !!this.token;
    }

    // Storage methods
    getStoredUser() {
        try {
            const user = localStorage.getItem(CONFIG.STORAGE_KEYS.user);
            return user ? JSON.parse(user) : null;
        } catch (e) {
            console.error('Error parsing stored user:', e);
            return null;
        }
    }

    getStoredToken() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.token);
    }

    getStoredLanguage() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.language) || CONFIG.DEFAULT_LANGUAGE;
    }

    getLastPhone() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.phone);
    }

    setUser(user) {
        this.user = user;
        localStorage.setItem(CONFIG.STORAGE_KEYS.user, JSON.stringify(user));
    }

    setToken(token) {
        this.token = token;
        this.isAuthenticated = !!token;
        localStorage.setItem(CONFIG.STORAGE_KEYS.token, token);
    }

    setLanguage(lang) {
        this.language = lang;
        localStorage.setItem(CONFIG.STORAGE_KEYS.language, lang);
        this.updateLanguage();
    }

    setLastPhone(phone) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.phone, phone);
    }

    setPendingOTP(otpData) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.pendingOTP, JSON.stringify(otpData));
    }

    getPendingOTP() {
        try {
            const otpData = localStorage.getItem(CONFIG.STORAGE_KEYS.pendingOTP);
            return otpData ? JSON.parse(otpData) : null;
        } catch (e) {
            return null;
        }
    }

    clearPendingOTP() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.pendingOTP);
    }

    clearAuth() {
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        localStorage.removeItem(CONFIG.STORAGE_KEYS.user);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.token);
    }

    clearAll() {
        this.clearAuth();
        localStorage.removeItem(CONFIG.STORAGE_KEYS.phone);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.pendingOTP);
    }

    updateLanguage() {
        // Update page language
        document.documentElement.lang = this.language;
        
        // Update UI text based on language
        this.translateUI();
    }

    translateUI() {
        const translations = {
            en: {
                welcome: 'Welcome to Finsakhi!',
                login: 'Login',
                signup: 'Sign Up',
                enterPhone: 'Enter your phone number',
                sendOTP: 'Send OTP',
                verifyOTP: 'Verify OTP',
                resendOTP: 'Resend OTP',
                otpExpires: 'OTP expires in',
                enterName: 'Enter your full name',
                optionalEmail: 'Email (Optional)',
                completeSignup: 'Complete Signup'
            },
            ta: {
                welcome: 'பின்சாக்கிக்கு வரவேற்கிறோம்!',
                login: 'உள்நுழைவு',
                signup: 'பதிவு செய்க',
                enterPhone: 'உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்',
                sendOTP: 'OTP அனுப்பவும்',
                verifyOTP: 'OTP சரிபார்க்கவும்',
                resendOTP: 'OTP மீண்டும் அனுப்பவும்',
                otpExpires: 'OTP காலாவதியாகும்',
                enterName: 'உங்கள் முழுப் பெயரை உள்ளிடவும்',
                optionalEmail: 'மின்னஞ்சல் (விருப்பமானது)',
                completeSignup: 'பதிவை முடிக்கவும்'
            },
            hi: {
                welcome: 'फिनसखी में आपका स्वागत है!',
                login: 'लॉगिन',
                signup: 'साइन अप',
                enterPhone: 'अपना फोन नंबर दर्ज करें',
                sendOTP: 'OTP भेजें',
                verifyOTP: 'OTP सत्यापित करें',
                resendOTP: 'OTP पुनः भेजें',
                otpExpires: 'OTP समाप्त होता है',
                enterName: 'अपना पूरा नाम दर्ज करें',
                optionalEmail: 'ईमेल (वैकल्पिक)',
                completeSignup: 'साइनअप पूरा करें'
            }
        };

        const lang = this.language;
        const text = translations[lang] || translations.en;

        // Update elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (text[key]) {
                element.textContent = text[key];
            }
        });
    }
}

// Initialize app state
const appState = new AppState();

// ===== UTILITY FUNCTIONS =====
const Utils = {
    // DOM Manipulation
    showLoading(element, text = 'Loading...') {
        if (element) {
            const originalHTML = element.innerHTML;
            element.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
            element.disabled = true;
            element.dataset.original = originalHTML;
        }
    },

    hideLoading(element) {
        if (element && element.dataset.original) {
            element.innerHTML = element.dataset.original;
            element.disabled = false;
            delete element.dataset.original;
        }
    },

    showError(input, message) {
        const group = input.closest('.input-group');
        if (group) {
            // Remove existing error
            this.hideError(input);
            
            // Add error class
            input.classList.add('error');
            group.classList.add('error');
            
            // Create error message
            const errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            errorEl.textContent = message;
            errorEl.style.cssText = `
                color: #e74c3c;
                font-size: 12px;
                margin-top: 5px;
                animation: fadeIn 0.3s ease;
            `;
            
            group.appendChild(errorEl);
            
            // Focus on input
            input.focus();
        }
    },

    hideError(input) {
        const group = input.closest('.input-group');
        if (group) {
            input.classList.remove('error');
            group.classList.remove('error');
            
            const errorEl = group.querySelector('.error-message');
            if (errorEl) errorEl.remove();
        }
    },

    showToast(message, type = 'success') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle'
        };

        toast.innerHTML = `
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;

        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getToastColor(type)};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transform: translateX(150%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);

        // Remove after delay
        setTimeout(() => {
            toast.style.transform = 'translateX(150%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    getToastColor(type) {
        const colors = {
            success: '#2ecc71',
            error: '#e74c3c',
            info: '#3498db',
            warning: '#f39c12'
        };
        return colors[type] || colors.info;
    },

    // Phone Validation
    validatePhone(phone) {
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        
        // Check if it's a valid 10-digit number
        if (cleaned.length !== 10) {
            return {
                isValid: false,
                error: 'Phone number must be 10 digits',
                cleaned: cleaned
            };
        }
        
        // Check if it starts with valid digit (6-9 for India)
        if (!/^[6-9]/.test(cleaned)) {
            return {
                isValid: false,
                error: 'Phone number must start with 6-9',
                cleaned: cleaned
            };
        }
        
        return {
            isValid: true,
            cleaned: cleaned,
            formatted: `+91 ${cleaned.slice(0,5)} ${cleaned.slice(5)}`
        };
    },

    validateOTP(otp) {
        if (!otp || otp.length !== CONFIG.OTP_LENGTH) {
            return {
                isValid: false,
                error: `OTP must be ${CONFIG.OTP_LENGTH} digits`
            };
        }
        
        if (!/^\d+$/.test(otp)) {
            return {
                isValid: false,
                error: 'OTP must contain only numbers'
            };
        }
        
        return { isValid: true };
    },

    validateName(name) {
        if (!name || name.trim().length < 2) {
            return {
                isValid: false,
                error: 'Name must be at least 2 characters'
            };
        }
        
        if (name.trim().length > 50) {
            return {
                isValid: false,
                error: 'Name is too long'
            };
        }
        
        return { isValid: true };
    },

    // Formatting
    formatPhoneDisplay(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `+91 ${cleaned.slice(0,5)} ${cleaned.slice(5)}`;
        }
        return phone;
    },

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    // Navigation
    navigateTo(url) {
        window.location.href = url;
    },

    redirectToDashboard() {
        this.navigateTo('dashboard.html');
    },

    redirectToLogin() {
        this.navigateTo('login.html');
    },

    redirectToSignup() {
        this.navigateTo('signup.html');
    },

    redirectToOnboarding() {
        this.navigateTo('onboarding.html');
    },

    goBack() {
        window.history.back();
    },

    // OTP Timer Management
    startOTPTimer(duration, updateCallback, expiredCallback) {
        let timeLeft = duration;
        
        // Initial update
        updateCallback(timeLeft);
        
        const timer = setInterval(() => {
            timeLeft--;
            updateCallback(timeLeft);
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                if (expiredCallback) expiredCallback();
            }
        }, 1000);
        
        return timer;
    },

    // API Simulation for Phone OTP
    async simulateAPI(endpoint, data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate API responses
                const responses = {
                    '/auth/send-otp': {
                        success: true,
                        data: {
                            message: 'OTP sent successfully',
                            // In demo, generate a random OPO
                            demoOTP: Math.floor(100000 + Math.random() * 900000).toString(),
                            expiry: Date.now() + CONFIG.OTP_EXPIRY_TIME
                        }
                    },
                    '/auth/verify-otp': {
                        success: true,
                        data: {
                            message: 'OTP verified successfully',
                            token: 'jwt-token-' + Date.now(),
                            user: {
                                phone: data.phone,
                                name: data.name || 'User'
                            }
                        }
                    },
                    '/auth/signup': {
                        success: true,
                        data: {
                            message: 'Account created successfully',
                            token: 'jwt-token-' + Date.now(),
                            user: {
                                id: Date.now(),
                                name: data.fullName,
                                phone: data.phone,
                                email: data.email || null
                            }
                        }
                    }
                };

                const response = responses[endpoint] || { success: false, message: 'Invalid endpoint' };
                
                if (response.success) {
                    resolve(response);
                } else {
                    reject(new Error(response.message || 'API error'));
                }
            }, 1500);
        });
    },

    // Phone OTP Auth Functions
    async sendOTP(phoneNumber) {
        try {
            const response = await this.simulateAPI('/auth/send-otp', { phone: phoneNumber });
            
            // Store OTP for verification (demo only - in production this would be server-side)
            if (response.data.demoOTP) {
                const otpData = {
                    phone: phoneNumber,
                    otp: response.data.demoOTP,
                    expiry: response.data.expiry
                };
                appState.setPendingOTP(otpData);
                
                // For demo purposes, show the OTP
                this.showToast(`Demo OTP: ${response.data.demoOTP}`, 'info');
            }
            
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async verifyOTP(phoneNumber, otp) {
        try {
            // Check pending OTP
            const pendingOTP = appState.getPendingOTP();
            
            if (!pendingOTP) {
                return { success: false, error: 'No OTP request found' };
            }
            
            if (pendingOTP.phone !== phoneNumber) {
                return { success: false, error: 'Phone number mismatch' };
            }
            
            if (Date.now() > pendingOTP.expiry) {
                appState.clearPendingOTP();
                return { success: false, error: 'OTP has expired' };
            }
            
            if (pendingOTP.otp !== otp) {
                return { success: false, error: 'Invalid OTP' };
            }
            
            // OTP verified successfully
            appState.clearPendingOTP();
            
            // Simulate getting user data
            const response = await this.simulateAPI('/auth/verify-otp', { 
                phone: phoneNumber, 
                otp: otp 
            });
            
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async loginWithOTP(phoneNumber, otp) {
        try {
            const verification = await this.verifyOTP(phoneNumber, otp);
            
            if (verification.success) {
                // Set authentication state
                appState.setToken(verification.data.token);
                appState.setUser(verification.data.user);
                appState.setLastPhone(phoneNumber);
                
                return { success: true, data: verification.data };
            } else {
                return { success: false, error: verification.error };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async signupWithOTP(userData) {
        try {
            // First verify OTP
            const verification = await this.verifyOTP(userData.phone, userData.otp);
            
            if (!verification.success) {
                return { success: false, error: verification.error };
            }
            
            // Create account
            const response = await this.simulateAPI('/auth/signup', userData);
            
            if (response.success) {
                appState.setToken(response.data.token);
                appState.setUser(response.data.user);
                appState.setLastPhone(userData.phone);
            }
            
            return { success: response.success, data: response.data, error: response.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    logout() {
        appState.clearAuth();
        this.navigateTo('index.html');
    },

    // Check auth status
    requireAuth() {
        if (!appState.isAuthenticated) {
            this.redirectToLogin();
            return false;
        }
        return true;
    },

    // Page specific initialization
    initLandingPage() {
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.redirectToLogin());
        }

        if (signupBtn) {
            signupBtn.addEventListener('click', () => this.redirectToSignup());
        }

        // If already authenticated, redirect to dashboard
        if (appState.isAuthenticated) {
            setTimeout(() => this.redirectToDashboard(), 1000);
        }
    },

    initLoginPage() {
        // Get DOM elements
        const phoneInput = document.getElementById('phone');
        const countryCodeSelect = document.getElementById('countryCode');
        const sendOtpBtn = document.getElementById('sendOtpBtn');
        const verifyOtpBtn = document.getElementById('verifyOtpBtn');
        const resendOtpBtn = document.getElementById('resendOtpBtn');
        const countdownElement = document.getElementById('countdown');
        const otpInputs = document.querySelectorAll('.otp-input');
        const phoneDisplay = document.getElementById('phoneDisplay');
        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');
        const stepDots = document.querySelectorAll('.step-dot');

        let currentStep = 1;
        let otp = '';
        let countdownTimer;
        let fullPhoneNumber = '';

        // Auto-fill last used phone number
        const lastPhone = appState.getLastPhone();
        if (lastPhone && phoneInput) {
            // Extract country code and phone number
            const match = lastPhone.match(/^(\+\d+)\s(.+)$/);
            if (match) {
                const [, countryCode, phone] = match;
                if (countryCodeSelect) countryCodeSelect.value = countryCode;
                if (phoneInput) phoneInput.value = phone.replace(/\s/g, '');
            }
        }

        // Phone number validation
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 10) value = value.substring(0, 10);
                e.target.value = value;
                
                // Enable/disable send OTP button
                if (sendOtpBtn) {
                    sendOtpBtn.disabled = value.length !== 10;
                }
            });
        }

        // Send OTP
        if (sendOtpBtn) {
            sendOtpBtn.addEventListener('click', async () => {
                const countryCode = countryCodeSelect ? countryCodeSelect.value : '+91';
                const phoneNumber = phoneInput ? phoneInput.value.trim() : '';
                
                // Validate phone
                const validation = this.validatePhone(phoneNumber);
                if (!validation.isValid) {
                    this.showError(phoneInput, validation.error);
                    return;
                }

                fullPhoneNumber = countryCode + validation.cleaned;
                
                // Show loading
                this.showLoading(sendOtpBtn, 'Sending OTP...');
                
                // Send OTP
                const result = await this.sendOTP(fullPhoneNumber);
                
                if (result.success) {
                    this.showToast('OTP sent successfully!', 'success');
                    
                    // Switch to OTP step
                    switchToStep(2);
                    
                    // Update phone display
                    if (phoneDisplay) {
                        phoneDisplay.textContent = this.formatPhoneDisplay(validation.cleaned);
                    }
                    
                    // Start OTP timer
                    startOTPTimer();
                    
                    // Auto-focus first OTP input
                    if (otpInputs.length > 0) {
                        setTimeout(() => otpInputs[0].focus(), 100);
                    }
                } else {
                    this.hideLoading(sendOtpBtn);
                    this.showToast(result.error || 'Failed to send OTP', 'error');
                }
            });
        }

        // OTP input handling
        if (otpInputs.length > 0) {
            otpInputs.forEach((input, index) => {
                input.addEventListener('input', function(e) {
                    const value = e.target.value;
                    
                    // Only allow numbers
                    if (value && !/^\d$/.test(value)) {
                        e.target.value = '';
                        return;
                    }

                    e.target.value = value;
                    
                    // Update OTP string
                    updateOTP();
                    
                    // Add filled class
                    if (value) {
                        e.target.classList.add('filled');
                    } else {
                        e.target.classList.remove('filled');
                    }
                    
                    // Move to next input
                    if (value && index < 5) {
                        otpInputs[index + 1].focus();
                    }
                    
                    // Check if all inputs are filled
                    checkOTPCompletion();
                });

                input.addEventListener('keydown', function(e) {
                    // Handle backspace
                    if (e.key === 'Backspace' && !this.value && index > 0) {
                        otpInputs[index - 1].focus();
                    }
                });

                input.addEventListener('paste', function(e) {
                    e.preventDefault();
                    const pasteData = e.clipboardData.getData('text').slice(0, 6);
                    if (/^\d{6}$/.test(pasteData)) {
                        for (let i = 0; i < 6; i++) {
                            otpInputs[i].value = pasteData[i];
                            otpInputs[i].classList.add('filled');
                        }
                        otp = pasteData;
                        if (verifyOtpBtn) verifyOtpBtn.disabled = false;
                        otpInputs[5].focus();
                    }
                });
            });
        }

        function updateOTP() {
            otp = '';
            otpInputs.forEach(input => {
                otp += input.value || '';
            });
        }

        function checkOTPCompletion() {
            const isComplete = otp.length === 6;
            if (verifyOtpBtn) verifyOtpBtn.disabled = !isComplete;
            return isComplete;
        }

        // Verify OTP
        if (verifyOtpBtn) {
            verifyOtpBtn.addEventListener('click', async () => {
                if (!fullPhoneNumber) {
                    this.showToast('Phone number not found', 'error');
                    return;
                }

                const validation = this.validateOTP(otp);
                if (!validation.isValid) {
                    this.showToast(validation.error, 'error');
                    return;
                }

                // Show loading
                this.showLoading(verifyOtpBtn, 'Verifying...');
                
                // Verify OTP
                const result = await this.loginWithOTP(fullPhoneNumber, otp);
                
                if (result.success) {
                    this.showToast('Login successful!', 'success');
                    
                    // Clear timer
                    clearInterval(countdownTimer);
                    
                    // Redirect to onboarding
                    setTimeout(() => this.redirectToOnboarding(), 1500);
                } else {
                    this.hideLoading(verifyOtpBtn);
                    this.showToast(result.error || 'Invalid OTP', 'error');
                    
                    // Clear OTP inputs
                    otpInputs.forEach(input => {
                        input.value = '';
                        input.classList.remove('filled');
                    });
                    otp = '';
                    if (verifyOtpBtn) verifyOtpBtn.disabled = true;
                    if (otpInputs.length > 0) otpInputs[0].focus();
                }
            });
        }

        // Resend OTP
        if (resendOtpBtn) {
            resendOtpBtn.addEventListener('click', async () => {
                if (!fullPhoneNumber) {
                    this.showToast('Phone number not found', 'error');
                    return;
                }

                // Disable resend button temporarily
                resendOtpBtn.disabled = true;
                this.showLoading(resendOtpBtn, 'Resending...');

                // Resend OTP
                const result = await this.sendOTP(fullPhoneNumber);
                
                if (result.success) {
                    this.showToast('New OTP sent!', 'success');
                    
                    // Restart timer
                    startOTPTimer();
                    
                    // Clear previous OTP
                    otpInputs.forEach(input => {
                        input.value = '';
                        input.classList.remove('filled');
                    });
                    otp = '';
                    if (verifyOtpBtn) verifyOtpBtn.disabled = true;
                    if (otpInputs.length > 0) otpInputs[0].focus();
                } else {
                    this.showToast(result.error || 'Failed to resend OTP', 'error');
                }
                
                this.hideLoading(resendOtpBtn);
                resendOtpBtn.disabled = false;
            });
        }

        // Timer functions
        const startOTPTimer = () => {
            if (countdownTimer) clearInterval(countdownTimer);
            
            let timeLeft = 120;
            updateCountdownDisplay(timeLeft);
            
            countdownTimer = setInterval(() => {
                timeLeft--;
                updateCountdownDisplay(timeLeft);
                
                if (timeLeft <= 0) {
                    clearInterval(countdownTimer);
                    if (resendOtpBtn) resendOtpBtn.disabled = false;
                }
            }, 1000);
        };

        const updateCountdownDisplay = (seconds) => {
            if (countdownElement) {
                countdownElement.textContent = this.formatTime(seconds);
            }
        };

        // Step switching
        const switchToStep = (stepNumber) => {
            currentStep = stepNumber;
            
            // Hide all steps
            if (step1) step1.classList.remove('active');
            if (step2) step2.classList.remove('active');
            
            // Show selected step
            const stepElement = document.getElementById(`step${stepNumber}`);
            if (stepElement) stepElement.classList.add('active');
            
            // Update step indicator
            stepDots.forEach(dot => {
                dot.classList.remove('active');
                if (parseInt(dot.dataset.step) === stepNumber) {
                    dot.classList.add('active');
                }
            });
        };

        // Back button
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (currentStep > 1) {
                    switchToStep(1);
                    clearInterval(countdownTimer);
                    if (resendOtpBtn) resendOtpBtn.disabled = true;
                } else {
                    this.goBack();
                }
            });
        }

        // If already authenticated, redirect to dashboard
        if (appState.isAuthenticated) {
            this.redirectToDashboard();
        }
    },

    initSignupPage() {
        // Get DOM elements
        const fullNameInput = document.getElementById('fullName');
        const phoneInput = document.getElementById('phone');
        const countryCodeSelect = document.getElementById('countryCode');
        const emailInput = document.getElementById('email');
        const sendOtpBtn = document.getElementById('sendOtpBtn');
        const verifyOtpBtn = document.getElementById('verifyOtpBtn');
        const completeSignupBtn = document.getElementById('completeSignupBtn');
        const resendOtpBtn = document.getElementById('resendOtpBtn');
        const termsCheckbox = document.getElementById('terms');
        const countdownElement = document.getElementById('countdown');
        const otpInputs = document.querySelectorAll('.otp-input');
        const phoneDisplay = document.getElementById('phoneDisplay');
        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');
        const step3 = document.getElementById('step3');
        const stepDots = document.querySelectorAll('.step-dot');

        let currentStep = 1;
        let otp = '';
        let countdownTimer;
        let fullPhoneNumber = '';
        let userData = {};

        // Auto-fill last used phone number
        const lastPhone = appState.getLastPhone();
        if (lastPhone && phoneInput) {
            const match = lastPhone.match(/^(\+\d+)\s(.+)$/);
            if (match) {
                const [, countryCode, phone] = match;
                if (countryCodeSelect) countryCodeSelect.value = countryCode;
                if (phoneInput) phoneInput.value = phone.replace(/\s/g, '');
            }
        }

        // Name validation
        if (fullNameInput) {
            fullNameInput.addEventListener('input', function() {
                const validation = this.validateName(this.value);
                if (!validation.isValid && this.value) {
                    this.showError(fullNameInput, validation.error);
                } else {
                    this.hideError(fullNameInput);
                }
                
                // Enable/disable send OTP button
                if (sendOtpBtn) {
                    sendOtpBtn.disabled = !this.value.trim() || 
                        (phoneInput && phoneInput.value.length !== 10);
                }
            });
        }

        // Phone number validation
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 10) value = value.substring(0, 10);
                e.target.value = value;
                
                // Enable/disable send OTP button
                if (sendOtpBtn && fullNameInput) {
                    sendOtpBtn.disabled = value.length !== 10 || !fullNameInput.value.trim();
                }
            });
        }

        // Email validation (optional)
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                if (this.value && !this.validateEmail(this.value)) {
                    this.showError(emailInput, 'Invalid email address');
                } else {
                    this.hideError(emailInput);
                }
            });
        }

        // Send OTP
        if (sendOtpBtn) {
            sendOtpBtn.addEventListener('click', async () => {
                const fullName = fullNameInput ? fullNameInput.value.trim() : '';
                const countryCode = countryCodeSelect ? countryCodeSelect.value : '+91';
                const phoneNumber = phoneInput ? phoneInput.value.trim() : '';
                
                // Validate inputs
                const nameValidation = this.validateName(fullName);
                if (!nameValidation.isValid) {
                    this.showError(fullNameInput, nameValidation.error);
                    return;
                }

                const phoneValidation = this.validatePhone(phoneNumber);
                if (!phoneValidation.isValid) {
                    this.showError(phoneInput, phoneValidation.error);
                    return;
                }

                fullPhoneNumber = countryCode + phoneValidation.cleaned;
                userData = { fullName, phone: fullPhoneNumber };
                
                // Show loading
                this.showLoading(sendOtpBtn, 'Sending OTP...');
                
                // Send OTP
                const result = await this.sendOTP(fullPhoneNumber);
                
                if (result.success) {
                    this.showToast('OTP sent successfully!', 'success');
                    
                    // Switch to OTP step
                    switchToStep(2);
                    
                    // Update phone display
                    if (phoneDisplay) {
                        phoneDisplay.textContent = this.formatPhoneDisplay(phoneValidation.cleaned);
                    }
                    
                    // Start OTP timer
                    startOTPTimer();
                    
                    // Auto-focus first OTP input
                    if (otpInputs.length > 0) {
                        setTimeout(() => otpInputs[0].focus(), 100);
                    }
                } else {
                    this.hideLoading(sendOtpBtn);
                    this.showToast(result.error || 'Failed to send OTP', 'error');
                }
            });
        }

        // OTP input handling
        if (otpInputs.length > 0) {
            otpInputs.forEach((input, index) => {
                input.addEventListener('input', function(e) {
                    const value = e.target.value;
                    
                    // Only allow numbers
                    if (value && !/^\d$/.test(value)) {
                        e.target.value = '';
                        return;
                    }

                    e.target.value = value;
                    
                    // Update OTP string
                    updateOTP();
                    
                    // Add filled class
                    if (value) {
                        e.target.classList.add('filled');
                    } else {
                        e.target.classList.remove('filled');
                    }
                    
                    // Move to next input
                    if (value && index < 5) {
                        otpInputs[index + 1].focus();
                    }
                    
                    // Check if all inputs are filled
                    checkOTPCompletion();
                });

                input.addEventListener('keydown', function(e) {
                    // Handle backspace
                    if (e.key === 'Backspace' && !this.value && index > 0) {
                        otpInputs[index - 1].focus();
                    }
                });

                input.addEventListener('paste', function(e) {
                    e.preventDefault();
                    const pasteData = e.clipboardData.getData('text').slice(0, 6);
                    if (/^\d{6}$/.test(pasteData)) {
                        for (let i = 0; i < 6; i++) {
                            otpInputs[i].value = pasteData[i];
                            otpInputs[i].classList.add('filled');
                        }
                        otp = pasteData;
                        if (verifyOtpBtn) verifyOtpBtn.disabled = false;
                        otpInputs[5].focus();
                    }
                });
            });
        }

        function updateOTP() {
            otp = '';
            otpInputs.forEach(input => {
                otp += input.value || '';
            });
        }

        function checkOTPCompletion() {
            const isComplete = otp.length === 6;
            if (verifyOtpBtn) verifyOtpBtn.disabled = !isComplete;
            return isComplete;
        }

        // Verify OTP
        if (verifyOtpBtn) {
            verifyOtpBtn.addEventListener('click', async () => {
                if (!fullPhoneNumber) {
                    this.showToast('Phone number not found', 'error');
                    return;
                }

                const validation = this.validateOTP(otp);
                if (!validation.isValid) {
                    this.showToast(validation.error, 'error');
                    return;
                }

                // Store OTP in user data
                userData.otp = otp;
                
                // Show loading
                this.showLoading(verifyOtpBtn, 'Verifying...');
                
                // Verify OTP
                const result = await this.verifyOTP(fullPhoneNumber, otp);
                
                if (result.success) {
                    this.showToast('Phone verified!', 'success');
                    
                    // Clear timer
                    clearInterval(countdownTimer);
                    
                    // Switch to final step
                    switchToStep(3);
                    
                    // Auto-focus email input
                    if (emailInput) emailInput.focus();
                } else {
                    this.hideLoading(verifyOtpBtn);
                    this.showToast(result.error || 'Invalid OTP', 'error');
                    
                    // Clear OTP inputs
                    otpInputs.forEach(input => {
                        input.value = '';
                        input.classList.remove('filled');
                    });
                    otp = '';
                    if (verifyOtpBtn) verifyOtpBtn.disabled = true;
                    if (otpInputs.length > 0) otpInputs[0].focus();
                }
            });
        }

        // Resend OTP
        if (resendOtpBtn) {
            resendOtpBtn.addEventListener('click', async () => {
                if (!fullPhoneNumber) {
                    this.showToast('Phone number not found', 'error');
                    return;
                }

                // Disable resend button temporarily
                resendOtpBtn.disabled = true;
                this.showLoading(resendOtpBtn, 'Resending...');

                // Resend OTP
                const result = await this.sendOTP(fullPhoneNumber);
                
                if (result.success) {
                    this.showToast('New OTP sent!', 'success');
                    
                    // Restart timer
                    startOTPTimer();
                    
                    // Clear previous OTP
                    otpInputs.forEach(input => {
                        input.value = '';
                        input.classList.remove('filled');
                    });
                    otp = '';
                    if (verifyOtpBtn) verifyOtpBtn.disabled = true;
                    if (otpInputs.length > 0) otpInputs[0].focus();
                } else {
                    this.showToast(result.error || 'Failed to resend OTP', 'error');
                }
                
                this.hideLoading(resendOtpBtn);
                resendOtpBtn.disabled = false;
            });
        }

        // Complete Signup
        if (completeSignupBtn && termsCheckbox) {
            // Enable/disable based on terms acceptance
            completeSignupBtn.disabled = !termsCheckbox.checked;
            
            termsCheckbox.addEventListener('change', () => {
                completeSignupBtn.disabled = !termsCheckbox.checked;
            });

            completeSignupBtn.addEventListener('click', async () => {
                if (!termsCheckbox.checked) {
                    this.showToast('Please accept the terms and conditions', 'warning');
                    return;
                }

                // Add email if provided
                if (emailInput && emailInput.value.trim()) {
                    if (!this.validateEmail(emailInput.value.trim())) {
                        this.showError(emailInput, 'Invalid email address');
                        return;
                    }
                    userData.email = emailInput.value.trim();
                }

                // Show loading
                this.showLoading(completeSignupBtn, 'Creating account...');
                
                // Create account
                const result = await this.signupWithOTP(userData);
                
                if (result.success) {
                    this.showToast('Account created successfully!', 'success');
                    
                    // Redirect to onboarding
                    setTimeout(() => this.redirectToOnboarding(), 1500);
                } else {
                    this.hideLoading(completeSignupBtn);
                    this.showToast(result.error || 'Signup failed', 'error');
                }
            });
        }

        // Timer functions
        const startOTPTimer = () => {
            if (countdownTimer) clearInterval(countdownTimer);
            
            let timeLeft = 120;
            updateCountdownDisplay(timeLeft);
            
            countdownTimer = setInterval(() => {
                timeLeft--;
                updateCountdownDisplay(timeLeft);
                
                if (timeLeft <= 0) {
                    clearInterval(countdownTimer);
                    if (resendOtpBtn) resendOtpBtn.disabled = false;
                }
            }, 1000);
        };

        const updateCountdownDisplay = (seconds) => {
            if (countdownElement) {
                countdownElement.textContent = this.formatTime(seconds);
            }
        };

        // Step switching
        const switchToStep = (stepNumber) => {
            currentStep = stepNumber;
            
            // Hide all steps
            if (step1) step1.classList.remove('active');
            if (step2) step2.classList.remove('active');
            if (step3) step3.classList.remove('active');
            
            // Show selected step
            const stepElement = document.getElementById(`step${stepNumber}`);
            if (stepElement) stepElement.classList.add('active');
            
            // Update step indicator
            stepDots.forEach(dot => {
                dot.classList.remove('active');
                if (parseInt(dot.dataset.step) === stepNumber) {
                    dot.classList.add('active');
                }
            });
        };

        // Back button
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (currentStep > 1) {
                    switchToStep(currentStep - 1);
                    
                    if (currentStep === 1) {
                        clearInterval(countdownTimer);
                        if (resendOtpBtn) resendOtpBtn.disabled = true;
                    }
                } else {
                    this.goBack();
                }
            });
        }

        // If already authenticated, redirect to dashboard
        if (appState.isAuthenticated) {
            this.redirectToDashboard();
        }
    },

    initOnboardingPage() {
        const languageOptions = document.querySelectorAll('.language-option');
        const nextBtn = document.getElementById('nextBtn');
        let selectedLanguage = appState.language;

        // Auto-select current language
        document.querySelectorAll('.language-option').forEach(option => {
            if (option.dataset.lang === selectedLanguage) {
                option.classList.add('selected');
            }
        });

        // Language selection
        languageOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected class from all options
                languageOptions.forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Add selected class to clicked option
                this.classList.add('selected');
                selectedLanguage = this.dataset.lang;
                
                // Enable next button
                if (nextBtn) nextBtn.disabled = false;
            });
        });

        // Next button
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                if (!selectedLanguage) return;
                
                // Save language preference
                appState.setLanguage(selectedLanguage);
                
                // Show loading
                Utils.showLoading(this, 'Continuing...');
                
                // Redirect to dashboard
                setTimeout(() => {
                    Utils.redirectToDashboard();
                }, 1000);
            });

            // Enable if language already selected
            if (selectedLanguage) {
                nextBtn.disabled = false;
            }
        }

        // If not authenticated, redirect to login
        if (!appState.isAuthenticated) {
            setTimeout(() => this.redirectToLogin(), 1000);
        }
    },

    initDashboardPage() {
        // Check authentication
        if (!this.requireAuth()) return;

        // Welcome user
        if (appState.user) {
            const welcomeEl = document.getElementById('welcomeMessage');
            if (welcomeEl) {
                welcomeEl.textContent = `Welcome, ${appState.user.name}!`;
            }
        }

        // Show user phone
        const phoneEl = document.getElementById('userPhone');
        if (phoneEl && appState.user && appState.user.phone) {
            phoneEl.textContent = this.formatPhoneDisplay(appState.user.phone.replace(/\D/g, '').slice(-10));
        }

        // Logout functionality
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Update current language display
        const currentLangEl = document.getElementById('currentLanguage');
        if (currentLangEl) {
            const languageNames = {
                'en': 'English',
                'ta': 'Tamil',
                'hi': 'Hindi'
            };
            currentLangEl.textContent = languageNames[appState.language] || 'English';
        }
    },

    // Initialize all pages
    init() {
        // Update language
        appState.updateLanguage();

        // Add CSS for animations
        this.addGlobalStyles();

        // Initialize based on current page
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';

        switch (page) {
            case 'index.html':
            case '':
                this.initLandingPage();
                break;
            case 'login.html':
                this.initLoginPage();
                break;
            case 'signup.html':
                this.initSignupPage();
                break;
            case 'onboarding.html':
                this.initOnboardingPage();
                break;
            case 'dashboard.html':
                this.initDashboardPage();
                break;
        }

        // Initialize common elements
        this.initCommonElements();
    },

    addGlobalStyles() {
        if (!document.querySelector('#global-styles')) {
            const styles = document.createElement('style');
            styles.id = 'global-styles';
            styles.textContent = `
                /* Global animations */
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                
                @keyframes slideOutLeft {
                    from { transform: translateX(0); }
                    to { transform: translateX(-100%); }
                }
                
                /* Input error styles */
                .input-group.error input,
                .input-group.error select {
                    border-color: #e74c3c !important;
                    background: rgba(231, 76, 60, 0.05);
                }
                
                .input-group.error .error-message {
                    color: #e74c3c;
                    font-size: 12px;
                    margin-top: 5px;
                    animation: fadeIn 0.3s ease;
                }
                
                /* OTP input styles */
                .otp-input.filled {
                    border-color: #ff1493;
                    background: rgba(255, 20, 147, 0.05);
                }
                
                /* Page transitions */
                .page-transition {
                    animation: fadeIn 0.5s ease;
                }
                
                /* Step transitions */
                .step {
                    animation: fadeIn 0.3s ease;
                }
            `;
            document.head.appendChild(styles);
        }
    },

    initCommonElements() {
        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => this.goBack());
        });

        // Ripple effect for buttons
        document.addEventListener('click', function(e) {
            if (e.target.closest('.ripple-btn')) {
                const button = e.target.closest('.ripple-btn');
                const ripple = document.createElement('span');
                const diameter = Math.max(button.clientWidth, button.clientHeight);
                const radius = diameter / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.7);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    width: ${diameter}px;
                    height: ${diameter}px;
                    top: ${e.clientY - button.getBoundingClientRect().top - radius}px;
                    left: ${e.clientX - button.getBoundingClientRect().left - radius}px;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            }
        });

        // Add ripple animation keyframes
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    Utils.init();
});

// ===== EXPORT FOR MODULE USE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Utils, AppState, CONFIG };
}