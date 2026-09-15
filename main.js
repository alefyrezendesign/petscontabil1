document.addEventListener('DOMContentLoaded', () => {

  // Fade Up Animation
  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
    observer.observe(el);
  });

  // Number Counter Animation
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-target');
        let count = 0;
        const speed = target / 50;
        
        const updateCount = () => {
          count += speed;
          if(count < target) {
            entry.target.innerText = Math.ceil(count);
            requestAnimationFrame(updateCount);
          } else {
            entry.target.innerText = target;
          }
        };
        updateCount();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(counter => counterObserver.observe(counter));

  // Text Reveal on Scroll Animation
  const revealText = document.getElementById('reveal-text');
  if (revealText) {
    const text = revealText.innerText;
    revealText.innerHTML = '';
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      span.textContent = text[i];
      span.classList.add('reveal-char');
      revealText.appendChild(span);
    }

    const chars = revealText.querySelectorAll('.reveal-char');
    window.addEventListener('scroll', () => {
      const rect = revealText.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      
      const startY = windowHeight;
      const endY = viewportCenter;
      
      let progress = (startY - elementCenter) / (startY - endY);
      progress = Math.max(0, Math.min(1, progress));
      
      chars.forEach((char, index) => {
        const charPercent = index / chars.length;
        if (progress > charPercent) {
          char.style.color = '#FFFFFF';
        } else {
          char.style.color = 'rgba(255, 255, 255, 0.2)';
        }
      });
    });
    // Trigger once on load
    window.dispatchEvent(new Event('scroll'));
  }

  // Atuacao Nova Logic removed as it's now a pure CSS grid with hover effects.


  // Demonstracao Scroll Animation
  const demoWrapper = document.getElementById('demonstracao-wrapper');
  if (demoWrapper) {
    const wordsContainer = document.getElementById('demonstracao-words');
    const phrase = "Por trás de cada clínica ou pet shop que cresce, existe uma estratégia e gestão que começou aqui.";
    const words = phrase.split(' ');
    
    words.forEach(word => {
      const outer = document.createElement('span');
      outer.style.display = 'inline-block';
      outer.style.overflow = 'hidden';
      outer.style.paddingBottom = '0.1em';
      
      const inner = document.createElement('span');
      inner.classList.add('demo-word');
      inner.style.display = 'inline-block';
      inner.style.opacity = '0';
      inner.style.transform = 'translateY(30px)';
      inner.textContent = word;
      
      outer.appendChild(inner);
      wordsContainer.appendChild(outer);
    });
    
    const wordEls = document.querySelectorAll('.demo-word');
    const demoCard = document.getElementById('demonstracao-card');
    const demoImage = document.getElementById('demonstracao-image-wrapper');
    
    window.addEventListener('scroll', () => {
      const rect = demoWrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const totalDist = rect.height + windowHeight;
      let progress = (windowHeight - rect.top) / totalDist;
      progress = Math.max(0, Math.min(1, progress));
      
      const mapRange = (value, inMin, inMax, outMin, outMax) => {
        if (value <= inMin) return outMin;
        if (value >= inMax) return outMax;
        return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
      };
      
      const scale = mapRange(progress, 0.05, 0.28, 0.75, 1);
      const radius = mapRange(progress, 0.05, 0.28, 48, 24);
      const opacity = mapRange(progress, 0.05, 0.15, 0, 1);
      
      demoCard.style.transform = `scale(${scale})`;
      demoCard.style.borderRadius = `${radius}px`;
      demoCard.style.opacity = opacity;
      
      const imgY = mapRange(progress, 0, 1, 0, 10);
      const imgScale = mapRange(progress, 0, 1, 1, 1.05);
      
      demoImage.style.transform = `translateY(${imgY}%) scale(${imgScale})`;
      
      wordEls.forEach((el, i) => {
        const startWord = 0.30 + (i / words.length) * 0.15;
        const endWord = startWord + 0.05;
        
        const wOpacity = mapRange(progress, startWord, endWord, 0, 1);
        const wY = mapRange(progress, startWord, endWord, 30, 0);
        
        el.style.opacity = wOpacity;
        el.style.transform = `translateY(${wY}px)`;
      });
    });
    
    window.dispatchEvent(new Event('scroll'));
  }

  // Horizontal Animated Timeline Observer - Scroll Scrubbing
  const timeline = document.getElementById('diagnostico-timeline');
  const progressLine = document.getElementById('tracking-progress');
  if (timeline && progressLine) {
    const nodes = timeline.querySelectorAll('.tracking-node');
    
    window.addEventListener('scroll', () => {
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Start filling when the timeline is 80% down the screen
      // Finish filling when the timeline is 40% down the screen
      const start = windowHeight * 0.8;
      const end = windowHeight * 0.4;
      
      let progress = (start - rect.top) / (start - end);
      progress = Math.max(0, Math.min(1, progress)); // clamp between 0 and 1
      
      progressLine.style.width = (progress * 75) + '%';
      
      nodes.forEach((node, index) => {
        // Node 1 triggers immediately (>0), Node 2 at >33%, etc.
        const threshold = index / (nodes.length - 1);
        if (progress >= threshold - 0.05) {
          node.classList.add('node-active');
        } else {
          node.classList.remove('node-active');
        }
      });
    });
    
    // Trigger once on load in case it's already in view
    window.dispatchEvent(new Event('scroll'));
  }

  // Accordion Logic
  const accHeaders = document.querySelectorAll('.acc-header');
  accHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('active');
      
      // Close all other accordions in the same container
      const container = item.closest('.conceito-accordion');
      if (container) {
        container.querySelectorAll('.acc-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
      }

      // Toggle current accordion
      if (isOpen) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });

  // IBGE City Autocomplete Logic
  const cidadeInput = document.getElementById('custom_cidade');
  const estadoSelect = document.getElementById('custom_estado');
  const autocompleteList = document.getElementById('city_autocomplete_list');

  if (cidadeInput && estadoSelect && autocompleteList) {
    let citiesCache = null;
    let citiesPromise = null;

    function loadCities() {
      if (citiesCache) return Promise.resolve(citiesCache);
      if (citiesPromise) return citiesPromise;
      citiesPromise = fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome')
        .then(r => r.json())
        .then(data => {
          citiesCache = data.map(c => {
            const sigla = c.microrregiao?.mesorregiao?.UF?.sigla;
            return sigla ? { name: c.nome, uf: sigla, label: `${c.nome} - ${sigla}` } : null;
          }).filter(c => c !== null);
          return citiesCache;
        })
        .catch(err => { console.error('[IBGE]', err); citiesPromise = null; return []; });
      return citiesPromise;
    }

    loadCities(); // Preload on init

    cidadeInput.addEventListener('input', (e) => {
      const val = e.target.value;
      autocompleteList.innerHTML = '';
      if (!val) {
        autocompleteList.style.display = 'none';
        return;
      }
      
      loadCities().then(cities => {
        const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const search = norm(val);
        const filtered = cities.filter(c => norm(c.name).startsWith(search)).slice(0, 20);

        if (filtered.length > 0) {
          filtered.forEach(city => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${city.name}</span> <span class="uf">- ${city.uf}</span>`;
            li.addEventListener('click', () => {
              cidadeInput.value = `${city.name} - ${city.uf}`;
              estadoSelect.value = city.uf;
              autocompleteList.style.display = 'none';
            });
            autocompleteList.appendChild(li);
          });
          autocompleteList.style.display = 'block';
        } else {
          autocompleteList.style.display = 'none';
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (e.target !== cidadeInput && e.target !== autocompleteList) {
        autocompleteList.style.display = 'none';
      }
    });
  }

  // Form Steps Logic Setup
  function setupFormSteps(prefix) {
    const step1 = document.getElementById(prefix + 'step-1');
    const step2 = document.getElementById(prefix + 'step-2');
    const btnNextStep = document.getElementById(prefix + 'btn-next-step');
    const btnPrevStep = document.getElementById(prefix + 'btn-prev-step');
    const dot1 = document.getElementById(prefix + 'dot-1');
    const dot2 = document.getElementById(prefix + 'dot-2');
    const stepIndicator = document.getElementById(prefix + 'step-indicator');

    if (btnNextStep && btnPrevStep) {
      btnNextStep.addEventListener('click', () => {
        // Validate Step 1 fields
        const inputs = step1.querySelectorAll('input, select');
        let isValid = true;
        inputs.forEach(input => {
          if (!input.checkValidity()) {
            input.reportValidity();
            isValid = false;
          }
        });

        if (isValid) {
          step1.classList.remove('active');
          step2.classList.add('active');
          if(dot1) dot1.classList.remove('active');
          if(dot2) dot2.classList.add('active');
          if(stepIndicator) stepIndicator.textContent = 'Passo 2 de 2';
        }
      });

      btnPrevStep.addEventListener('click', () => {
        step2.classList.remove('active');
        step1.classList.add('active');
        if(dot2) dot2.classList.remove('active');
        if(dot1) dot1.classList.add('active');
        if(stepIndicator) stepIndicator.textContent = 'Passo 1 de 2';
      });
    }
  }

  setupFormSteps('');
  setupFormSteps('modal-');

  // Ghost Form Logic Setup
  function setupGhostForm(prefix, formId, rdContainerId, submitBtnId, feedbackId) {
    const customForm = document.getElementById(formId);
    const rdContainer = document.getElementById(rdContainerId);
    const feedbackEl = document.getElementById(feedbackId);
    const submitBtn = document.getElementById(submitBtnId);

    if (customForm && rdContainer) {
      customForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nome = document.getElementById(prefix + 'nome').value;
        const email = document.getElementById(prefix + 'email').value;
        const celular = document.getElementById(prefix + 'celular').value;
        const segmento = document.getElementById(prefix + 'segmento').value;
        const cargo = document.getElementById(prefix + 'cargo').value;
        const dificuldade = document.getElementById(prefix + 'dificuldade').value;
        const cidade = document.getElementById(prefix + 'cidade').value;
        const estado = document.getElementById(prefix + 'estado').value;
        const conheceu = document.getElementById(prefix + 'conheceu').value;
        
        const rdForm = rdContainer.querySelector('form');
        if (!rdForm) {
          showFeedback('Erro: Serviço indisponível no momento. Tente novamente.', 'error');
          return;
        }

        const setRDValue = (nameKeywords, labelText, value) => {
          let input = rdForm.querySelector(`input[name*="${nameKeywords}"], select[name*="${nameKeywords}"]`);
          if (!input) {
            const labels = Array.from(rdForm.querySelectorAll('label'));
            const matchingLabel = labels.find(l => l.textContent.toLowerCase().includes(labelText.toLowerCase()));
            if (matchingLabel) {
              const forAttr = matchingLabel.getAttribute('for');
              if (forAttr) {
                input = document.getElementById(forAttr);
              }
              if (!input) {
                const wrapper = matchingLabel.closest('div, li, p');
                if (wrapper) {
                  input = wrapper.querySelector('input, select');
                }
              }
            }
          }
          if (input) {
            input.value = value;
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        };

        submitBtn.innerHTML = 'ENVIANDO...';
        submitBtn.disabled = true;
        if(feedbackEl) feedbackEl.style.display = 'none';

        setRDValue('name', 'nome', nome);
        setRDValue('email', 'email', email);
        setRDValue('mobile', 'celular', celular);
        setRDValue('phone', 'telefone', celular);
        setRDValue('city', 'cidade', cidade);
        setRDValue('state', 'estado', estado);
        setRDValue('segmento', 'segmento', segmento);
        setRDValue('cargo', 'cargo', cargo);
        setRDValue('dificuldade', 'dificuldade', dificuldade);
        setRDValue('conheceu', 'conheceu', conheceu);

        const originalAlert = window.alert;
        window.alert = function() {
        };

        const rdSubmitBtn = rdForm.querySelector('button[type="submit"], input[type="submit"]');
        if (rdSubmitBtn) {
          rdSubmitBtn.click();
        } else {
          rdForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
        
        // Watch for success
        const observer = new MutationObserver((mutations) => {
          const successMsg = rdContainer.querySelector('.bricks-form__success, .rd-form-success, .bricks-form__thank-you');
          if (successMsg || !rdContainer.querySelector('form')) {
            showFeedback('Obrigado! Seu formulário foi recebido com sucesso.', 'success');
            customForm.reset();
            observer.disconnect();
            window.alert = originalAlert; // restaura
          }
        });
        observer.observe(rdContainer, { childList: true, subtree: true });
        
        setTimeout(() => {
          if (submitBtn.disabled) {
             showFeedback('Obrigado! Seu formulário foi recebido com sucesso!', 'success');
             customForm.reset();
             window.alert = originalAlert; // restaura
          }
        }, 3000);
      });

      function showFeedback(msg, type) {
        if (type === 'success') {
          const modal = document.getElementById('success-modal');
          if (modal) {
            modal.style.display = 'flex';
            
            const closeBtn = document.getElementById('modal-close-btn');
            if (closeBtn) {
              closeBtn.onclick = () => {
                modal.style.display = 'none';
              };
            }
            modal.onclick = (e) => {
              if (e.target === modal) modal.style.display = 'none';
            };
          } else if (feedbackEl) {
            feedbackEl.textContent = msg;
            feedbackEl.style.display = 'block';
            feedbackEl.style.color = '#155724';
            feedbackEl.style.backgroundColor = '#d4edda';
            feedbackEl.style.border = '1px solid #c3e6cb';
          }
        } else {
          if(feedbackEl) {
            feedbackEl.textContent = msg;
            feedbackEl.style.display = 'block';
            feedbackEl.style.color = '#721c24';
            feedbackEl.style.backgroundColor = '#f8d7da';
            feedbackEl.style.border = '1px solid #f5c6cb';
          }
        }
        submitBtn.innerHTML = 'SOLICITAR DIAGNÓSTICO';
        submitBtn.disabled = false;
      }
    }
  }

  setupGhostForm('custom_', 'custom-diagnostico-form', 'rd-ghost-container', 'custom_submit_btn', 'form-feedback');
  setupGhostForm('modal_', 'modal-diagnostico-form', 'modal-rd-ghost-container', 'modal_submit_btn', 'modal-form-feedback');

  // Intersection Observer for Scroll Animations
  const revealObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, revealObserverOptions);

  document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
  });


  // Typewriter Effect Observer
  const typeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const textToType = el.getAttribute("data-text");
        const span = el.querySelector("span");
        if (textToType && span) {
          span.textContent = "";
          el.classList.add("typing-active");
          let i = 0;
          const typingInterval = setInterval(() => {
            span.textContent += textToType.charAt(i);
            i++;
            if (i >= textToType.length) {
              clearInterval(typingInterval);
              el.classList.remove("typing-active");
            }
          }, 40); // speed of typing
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".typewriter").forEach(el => {
    const span = el.querySelector("span");
    if(span) span.textContent = ""; // clear initial text
    typeObserver.observe(el);
  });

  // --- Form Modal Trigger Logic ---
  const formModal = document.getElementById('form-modal');
  const formModalClose = document.getElementById('form-modal-close');
  const modalTriggers = document.querySelectorAll('a[href="#diagnostico"], .form-modal-trigger');

  if (formModal && modalTriggers.length > 0) {
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        formModal.style.display = 'flex';
      });
    });

    if (formModalClose) {
      formModalClose.addEventListener('click', () => {
        formModal.style.display = 'none';
      });
    }

    formModal.addEventListener('click', (e) => {
      if (e.target === formModal) {
        formModal.style.display = 'none';
      }
    });
  }
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');
  if (mobileBtn && mainNav) {
    mobileBtn.addEventListener('click', () => {
      mainNav.classList.toggle('menu-open');
      const icon = mobileBtn.querySelector('i');
      if (mainNav.classList.contains('menu-open')) {
        icon.classList.remove('ph-list');
        icon.classList.add('ph-x');
      } else {
        icon.classList.remove('ph-x');
        icon.classList.add('ph-list');
      }
    });
    
    // Close menu when clicking a link
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('menu-open');
        const icon = mobileBtn.querySelector('i');
        icon.classList.remove('ph-x');
        icon.classList.add('ph-list');
      });
    });
  }
});
  
  // Mobile Hamburger Menu Logic
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mainNav = document.querySelector('.main-nav');
  
  if (hamburgerBtn && mainNav) {
    hamburgerBtn.addEventListener('click', () => {
      mainNav.classList.toggle('menu-open');
      const icon = hamburgerBtn.querySelector('i');
      if (mainNav.classList.contains('menu-open')) {
        icon.classList.remove('ph-list');
        icon.classList.add('ph-x');
      } else {
        icon.classList.remove('ph-x');
        icon.classList.add('ph-list');
      }
    });
    
    // Close menu when clicking a link
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('menu-open');
        const icon = hamburgerBtn.querySelector('i');
        icon.classList.remove('ph-x');
        icon.classList.add('ph-list');
      });
    });
  }

  // Mobile Feature Card Hover Observer
  document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) {
      const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-active');
          } else {
            entry.target.classList.remove('is-active');
          }
        });
      }, { rootMargin: '-35% 0px -35% 0px' });
      
      document.querySelectorAll('.feature-card').forEach(card => {
        featureObserver.observe(card);
      });
    }
  });
