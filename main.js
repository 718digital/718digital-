java

/**
 * 718 DIGITAL - SCRIPT PRINCIPAL
 * Version: 1.0.0
 * Auteur: 718 Digital Team
 */

// ===== CONFIGURATION =====
const CONFIG = {
  whatsappNumber: '+225 0576852723', // À modifier
  adminEmail: '718digital01@gmail.com',
  apiEndpoint: 'https://api.718digital.com/submit',
  animationDelay: 100,
  debug: true
};

// ===== ÉTAT GLOBAL =====
const STATE = {
  currentStep: 1,
  formData: {},
  selectedService: null,
  activeFilter: 'all',
  isMenuOpen: false
};

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 718 Digital - Initialisation du site');
  
  // Initialiser tous les modules
  initNavigation();
  initLogo();
  initServices();
  initGallery();
  initContactForm();
  initAnimations();
  initWhatsAppButton();
  
  // Vérifier les paramètres URL
  checkUrlParams();
  
  // Log de démarrage
  log('Site initialisé avec succès');
});

// ===== LOGGING =====
function log(message, type = 'info') {
  if (!CONFIG.debug) return;
  
  const colors = {
    info: '#4361EE',
    success: '#2EC4B6',
    warning: '#FFD166',
    error: '#FF6B35'
  };
  
  console.log(`%c718 Digital: ${message}`, `color: ${colors[type]}; font-weight: bold;`);
}

// ===== NAVIGATION =====
function initNavigation() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (!menuToggle || !navMenu) {
    log('Navigation non trouvée', 'warning');
    return;
  }
  
  // Toggle menu mobile
  menuToggle.addEventListener('click', function() {
    STATE.isMenuOpen = !STATE.isMenuOpen;
    navMenu.classList.toggle('active');
    this.classList.toggle('active');
    
    // Animation de l'icône
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });
  
  // Fermer le menu au clic sur un lien
  const navLinks = navMenu.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        STATE.isMenuOpen = false;
      }
    });
  });
  
  // Scroll spy pour la navigation
  window.addEventListener('scroll', debounce(updateActiveNav, 100));
  
  log('Navigation initialisée');
}

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// ===== LOGO =====
function initLogo() {
  const logoContainer = document.querySelector('.logo-container');
  if (!logoContainer) return;
  
  const logoFrame = document.querySelector('.logo-frame');
  
  if (logoFrame) {
    // Vérifier le chargement du logo
    logoFrame.addEventListener('load', function() {
      log('Logo Canva chargé avec succès', 'success');
      logoContainer.classList.add('loaded');
      
      // Animation d'entrée
      setTimeout(() => {
        logoContainer.style.opacity = '1';
        logoContainer.style.transform = 'translateY(0)';
      }, 300);
    });
    
    // Gestion des erreurs
    logoFrame.addEventListener('error', function() {
      log('Erreur de chargement du logo Canva', 'error');
      showLogoFallback();
    });
    
    // Timeout de sécurité
    setTimeout(() => {
      if (!logoContainer.classList.contains('loaded')) {
        log('Timeout du chargement du logo', 'warning');
        showLogoFallback();
      }
    }, 5000);
  }
}

function showLogoFallback() {
  const logoEmbed = document.querySelector('.logo-embed');
  if (!logoEmbed) return;
  
  const fallbackSVG = `
    <svg viewBox="0 0 800 450" style="width:100%; height:100%;">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FF6B35"/>
          <stop offset="100%" stop-color="#1A1A1A"/>
        </linearGradient>
      </defs>
      
      <rect width="800" height="450" fill="url(#gradient)"/>
      
      <text x="400" y="250" text-anchor="middle"
            font-family="Montserrat" font-size="180" font-weight="900"
            fill="white" opacity="0.1">718</text>
      
      <text x="400" y="320" text-anchor="middle"
            font-family="Montserrat" font-size="70" font-weight="700"
            fill="white">DIGITAL</text>
    </svg>
  `;
  
  logoEmbed.innerHTML = fallbackSVG;
  log('Logo fallback affiché');
}

// ===== SERVICES =====
function initServices() {
  const serviceCards = document.querySelectorAll('.service-card');
  const serviceOptions = document.querySelectorAll('.service-option');
  
  // Hover sur les cartes de service
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
    
    // Clic sur les cartes
    card.addEventListener('click', function() {
      const service = this.dataset.service;
      if (service) {
        selectService(service);
        scrollToSection('contact');
      }
    });
  });
  
  // Sélection des options de service
  serviceOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Retirer la sélection précédente
      serviceOptions.forEach(o => o.classList.remove('selected'));
      
      // Ajouter la sélection actuelle
      this.classList.add('selected');
      STATE.selectedService = this.dataset.service;
      
      log(`Service sélectionné: ${STATE.selectedService}`);
    });
  });
  
  log('Services initialisés');
}

function selectService(service) {
  const serviceOptions = document.querySelectorAll('.service-option');
  serviceOptions.forEach(option => {
    if (option.dataset.service === service) {
      option.click();
    }
  });
}

// ===== GALERIE =====
function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (filterBtns.length === 0 || galleryItems.length === 0) {
    log('Galerie non trouvée', 'warning');
    return;
  }
  
  // Filtrage de la galerie
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.dataset.filter;
      
      // Mettre à jour le filtre actif
      STATE.activeFilter = filter;
      
      // Mettre à jour l'UI
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filtrer les éléments
      filterGalleryItems(filter);
      
      log(`Filtre galerie: ${filter}`);
    });
  });
  
  // Animation au survol
  galleryItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
    
    // Clic pour agrandir (lightbox)
    item.addEventListener('click', function() {
      showLightbox(this);
    });
  });
  
  log('Galerie initialisée');
}

function filterGalleryItems(filter) {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    const categories = item.dataset.category.split(' ');
    
    if (filter === 'all' || categories.includes(filter)) {
      item.style.display = 'block';
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
      }, 50);
    } else {
      item.style.opacity = '0';
      item.style.transform = 'scale(0.8)';
      setTimeout(() => {
        item.style.display = 'none';
      }, 300);
    }
  });
}

function showLightbox(element) {
  const imgSrc = element.querySelector('img').src;
  const title = element.querySelector('h4')?.textContent || 'Projet 718 Digital';
  
  const lightboxHTML = `
    <div class="lightbox">
      <div class="lightbox-content">
        <button class="lightbox-close">&times;</button>
        <img src="${imgSrc}" alt="${title}">
        <div class="lightbox-info">
          <h3>${title}</h3>
          <p>${element.querySelector('p')?.textContent || ''}</p>
        </div>
      </div>
    </div>
  `;
  
  // Créer et ajouter le lightbox
  const lightbox = document.createElement('div');
  lightbox.innerHTML = lightboxHTML;
  document.body.appendChild(lightbox);
  
  // Fermer le lightbox
  const closeBtn = lightbox.querySelector('.lightbox-close');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(lightbox);
  });
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      document.body.removeChild(lightbox);
    }
  });
  
  // Échap pour fermer
  document.addEventListener('keydown', function closeOnEscape(e) {
    if (e.key === 'Escape') {
      document.body.removeChild(lightbox);
      document.removeEventListener('keydown', closeOnEscape);
    }
  });
}

// ===== FORMULAIRE DE CONTACT =====
function initContactForm() {
  const form = document.getElementById('projectForm');
  if (!form) {
    log('Formulaire non trouvé', 'warning');
    return;
  }
  
  // Navigation dans les étapes
  const nextBtns = form.querySelectorAll('.next-step');
  const prevBtns = form.querySelectorAll('.prev-step');
  
  nextBtns.forEach(btn => {
    btn.addEventListener('click', nextStep);
  });
  
  prevBtns.forEach(btn => {
    btn.addEventListener('click', prevStep);
  });
  
  // Validation en temps réel
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', function() {
      this.classList.remove('error', 'success');
      clearError(this);
    });
  });
  
  // Soumission du formulaire
  form.addEventListener('submit', handleSubmit);
  
  updateProgress();
  log('Formulaire initialisé');
}

function nextStep(e) {
  e.preventDefault();
  
  const currentStep = this.closest('.form-step');
  const nextStepId = currentStep.dataset.next;
  const nextStep = document.getElementById(nextStepId);
  
  if (validateStep(currentStep)) {
    // Animation de transition
    currentStep.classList.remove('active');
    currentStep.style.opacity = '0';
    currentStep.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
      currentStep.style.display = 'none';
      nextStep.style.display = 'block';
      
      setTimeout(() => {
        nextStep.classList.add('active');
        nextStep.style.opacity = '1';
        nextStep.style.transform = 'translateX(0)';
        
        STATE.currentStep = parseInt(nextStep.dataset.step);
        updateProgress();
        
        // Scroll vers le formulaire
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }, 300);
  }
}

function prevStep(e) {
  e.preventDefault();
  
  const currentStep = this.closest('.form-step');
  const prevStepId = currentStep.dataset.prev;
  const prevStep = document.getElementById(prevStepId);
  
  if (prevStep) {
    currentStep.classList.remove('active');
    currentStep.style.opacity = '0';
    currentStep.style.transform = 'translateX(20px)';
    
    setTimeout(() => {
      currentStep.style.display = 'none';
      prevStep.style.display = 'block';
      
      setTimeout(() => {
        prevStep.classList.add('active');
        prevStep.style.opacity = '1';
        prevStep.style.transform = 'translateX(0)';
        
        STATE.currentStep = parseInt(prevStep.dataset.step);
        updateProgress();
        
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }, 300);
  }
}

function validateStep(step) {
  let isValid = true;
  const requiredFields = step.querySelectorAll('[required]');
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('error');
      showError(field, 'Ce champ est requis');
      isValid = false;
    } else {
      // Validation spécifique par type
      if (field.type === 'email' && !validateEmail(field.value)) {
        field.classList.add('error');
        showError(field, 'Email invalide');
        isValid = false;
      }
      
      if (field.type === 'tel' && field.value && !validatePhone(field.value)) {
        field.classList.add('error');
        showError(field, 'Numéro de téléphone invalide');
        isValid = false;
      }
    }
  });
  
  return isValid;
}

function validateField(e) {
  const field = e.target;
  const value = field.value.trim();
  
  clearError(field);
  
  if (field.hasAttribute('required') && !value) {
    field.classList.add('error');
    showError(field, 'Ce champ est requis');
    return false;
  }
  
  if (field.type === 'email' && value && !validateEmail(value)) {
    field.classList.add('error');
    showError(field, 'Email invalide');
    return false;
  }
  
  if (field.type === 'tel' && value && !validatePhone(value)) {
    field.classList.add('error');
    showError(field, 'Numéro de téléphone invalide');
    return false;
  }
  
  field.classList.remove('error');
  field.classList.add('success');
  return true;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return re.test(phone);
}

function showError(field, message) {
  clearError(field);
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.color = '#FF6B35';
  errorDiv.style.fontSize = '0.9rem';
  errorDiv.style.marginTop = '0.25rem';
  
  field.parentNode.appendChild(errorDiv);
}

function clearError(field) {
  const existingError = field.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
}

function updateProgress() {
  const progressFill = document.querySelector('.progress-fill');
  const stepIndicators = document.querySelectorAll('.step-indicator');
  
  if (progressFill) {
    const percentage = (STATE.currentStep / 4) * 100;
    progressFill.style.width = `${percentage}%`;
  }
  
  stepIndicators.forEach((indicator, index) => {
    const stepNumber = index + 1;
    indicator.classList.toggle('active', stepNumber <= STATE.currentStep);
  });
}

async function handleSubmit(e) {
  e.preventDefault();
  
  // Collecter les données
  const formData = new FormData(e.target);
  STATE.formData = Object.fromEntries(formData);
  
  // Ajouter le service sélectionné
  if (STATE.selectedService) {
    STATE.formData.service = STATE.selectedService;
  }
  
  // Ajouter des métadonnées
  STATE.formData.timestamp = new Date().toISOString();
  STATE.formData.source = '718digital.com';
  STATE.formData.userAgent = navigator.userAgent;
  
  // Validation finale
  if (!validateFinalForm()) {
    log('Validation du formulaire échouée', 'error');
    return;
  }
  
  // Afficher le loading
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span class="loading"></span> Envoi en cours...';
  submitBtn.disabled = true;
  
  try {
    // Envoyer à WhatsApp
    const whatsappMessage = formatWhatsAppMessage(STATE.formData);
    await sendToWhatsApp(whatsappMessage);
    
    // Envoyer une copie au backend (optionnel)
    await sendToBackup(STATE.formData);
    
    // Afficher la confirmation
    showConfirmation();
    
    log('Formulaire soumis avec succès', 'success');
    
  } catch (error) {
    log(`Erreur lors de l'envoi: ${error.message}`, 'error');
    showErrorModal('Une erreur est survenue. Veuillez réessayer.');
  } finally {
    // Restaurer le bouton
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

function validateFinalForm() {
  const requiredFields = ['name', 'email', 'description'];
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!STATE.formData[field]?.trim()) {
      isValid = false;
    }
  });
  
  if (STATE.formData.email && !validateEmail(STATE.formData.email)) {
    isValid = false;
  }
  
  return isValid;
}

function formatWhatsAppMessage(data) {
  return `
*NOUVELLE DEMANDE - 718 DIGITAL* 🚀

👤 *INFORMATIONS CLIENT*
• Nom : ${data.name || 'Non spécifié'}
• Entreprise : ${data.company || 'Non spécifié'}
• Email : ${data.email || 'Non spécifié'}
• Téléphone : ${data.phone || 'Non spécifié'}

🎯 *PROJET*
• Service : ${data.service || 'Non spécifié'}
• Budget : ${data.budget || 'Non spécifié'}
• Délai : ${data.timeline || 'Non spécifié'}

📝 *DESCRIPTION*
${data.description || 'Aucune description fournie'}

📅 *CONTACT PRÉFÉRÉ* : ${data.contactMethod || 'WhatsApp'}

🌐 *SOURCE* : Site web - ${new Date().toLocaleDateString('fr-FR')}
  `.trim();
}

function sendToWhatsApp(message) {
  return new Promise((resolve, reject) => {
    try {
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
      
      // Ouvrir dans un nouvel onglet
      window.open(whatsappUrl, '_blank');
      resolve();
      
    } catch (error) {
      reject(error);
    }
  });
}

async function sendToBackup(data) {
  try {
    const response = await fetch(CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    // Ne pas bloquer le processus si l'API échoue
    console.warn('Backup API failed:', error);
    return null;
  }
}

function showConfirmation() {
  const confirmationHTML = `
    <div class="confirmation-modal">
      <div class="confirmation-content">
        <div class="confirmation-icon">✅</div>
        <h3>Demande envoyée !</h3>
        <p>Vous allez être redirigé vers WhatsApp pour finaliser votre demande.</p>
        <p>Notre équipe vous répondra sous 24h maximum.</p>
        <button class="btn btn-primary" id="closeConfirmation">
          Fermer
        </button>
      </div>
    </div>
  `;
  
  const modal = document.createElement('div');
  modal.innerHTML = confirmationHTML;
  document.body.appendChild(modal);
  
  // Ajouter les styles
  const style = document.createElement('style');
  style.textContent = `
    .confirmation-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }
    
    .confirmation-content {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      text-align: center;
      max-width: 400px;
      animation: slideUp 0.3s ease;
    }
    
    .confirmation-icon {
      font-size: 4rem;
      color: #2EC4B6;
      margin-bottom: 1rem;
    }
    
    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;
  
  document.head.appendChild(style);
  
  // Fermer la modal
  const closeBtn = modal.querySelector('#closeConfirmation');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
    document.head.removeChild(style);
  });
  
  // Fermer en cliquant à l'extérieur
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
      document.head.removeChild(style);
    }
  });
}

function showErrorModal(message) {
  alert(`❌ ${message}`);
}

// ===== ANIMATIONS =====
function initAnimations() {
  // Observer pour les animations au scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observer les éléments
  const animatedElements = document.querySelectorAll('.service-card, .process-step, .gallery-item');
  animatedElements.forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
  
  // Animation CSS pour les éléments
  const style = document.createElement('style');
  style.textContent = `
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  
  document.head.appendChild(style);
  
  log('Animations initialisées');
}

// ===== WHATSAPP BUTTON =====
function initWhatsAppButton() {
  const whatsappBtn = document.querySelector('.whatsapp-float');
  if (!whatsappBtn) return;
  
  whatsappBtn.addEventListener('click', function(e) {
    if (STATE.formData.name || STATE.formData.email) {
      // Si l'utilisateur a commencé le formulaire, inclure les infos
      const message = encodeURIComponent(`Bonjour 718 Digital ! Je souhaite continuer notre discussion à propos de mon projet.`);
      this.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;
    }
  });
}

// ===== UTILITAIRES =====
function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  
  if (params.has('service')) {
    const service = params.get('service');
    selectService(service);
    scrollToSection('contact');
  }
  
  if (params.has('ref')) {
    localStorage.setItem('referral_source', params.get('ref'));
    log(`Source de référence: ${params.get('ref')}`);
  }
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== API PUBLIQUE =====
window._718Digital = {
  // Pour usage externe
  selectService: selectService,
  openContactForm: () => scrollToSection('contact'),
  getFormData: () => ({ ...STATE.formData }),
  resetForm: () => {
    const form = document.getElementById('projectForm');
    if (form) form.reset();
    STATE.formData = {};
    STATE.selectedService = null;
    STATE.currentStep = 1;
    updateProgress();
  }
};

// ===== GESTION DES ERREURS GLOBALES =====
window.addEventListener('error', function(e) {
  log(`Erreur globale: ${e.message}`, 'error');
  
  // Envoyer à votre service de tracking
  if (CONFIG.debug) {
    console.error('Stack trace:', e.error);
  }
});

// ===== EXPORT POUR TESTS =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateEmail,
    validatePhone,
    formatWhatsAppMessage,
    filterGalleryItems
  };
}
