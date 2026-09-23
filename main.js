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
        
        const updateCount = () => {
          // Animação mais sutil (ease-out)
          const increment = (target - count) / 30;
          count += Math.max(increment, 0.1);
          
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
    
    let isDemoScrolling = false;
    let demoInView = false;
    const demoIo = new IntersectionObserver(e => demoInView = e[0].isIntersecting, {rootMargin: '100%'});
    demoIo.observe(demoWrapper);

    window.addEventListener('scroll', () => {
      if (!demoInView) return;
      if (!isDemoScrolling) {
        window.requestAnimationFrame(() => {
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
            const baseStart = window.innerWidth <= 768 ? 0.20 : 0.30;
            const startWord = baseStart + (i / words.length) * 0.15;
            const endWord = startWord + 0.05;
            
            const wOpacity = mapRange(progress, startWord, endWord, 0, 1);
            const wY = mapRange(progress, startWord, endWord, 30, 0);
            
            el.style.opacity = wOpacity;
            el.style.transform = `translateY(${wY}px)`;
          });
          isDemoScrolling = false;
        });
        isDemoScrolling = true;
      }
    }, { passive: true });
    
    window.dispatchEvent(new Event('scroll'));
  }

  // Horizontal Animated Timeline Observer - Scroll Scrubbing
  const timeline = document.getElementById('diagnostico-timeline');
  const progressLine = document.getElementById('tracking-progress');
  if (timeline && progressLine) {
    const nodes = timeline.querySelectorAll('.tracking-node');
    
    let isTimelineScrolling = false;
    let timelineInView = false;
    const timelineIo = new IntersectionObserver(e => timelineInView = e[0].isIntersecting, {rootMargin: '100%'});
    timelineIo.observe(timeline);

    window.addEventListener('scroll', () => {
      if (!timelineInView) return;
      if (!isTimelineScrolling) {
        window.requestAnimationFrame(() => {
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
          isTimelineScrolling = false;
        });
        isTimelineScrolling = true;
      }
    }, { passive: true });
    
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

  // Accordion Auto-Expand Observer
  const accordionContainer = document.querySelector('.conceito-accordion');
  if (accordionContainer) {
    const firstAccItem = accordionContainer.querySelector('.acc-item');
    if (firstAccItem) {
      const accObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Só expande se nenhum estiver aberto, com um pequeno atraso
            setTimeout(() => {
              const hasActive = accordionContainer.querySelector('.acc-item.active');
              if (!hasActive) {
                firstAccItem.classList.add('active');
              }
            }, 600); // 600ms de atraso
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 }); // Alterado de 0.3 para 0.6
      accObserver.observe(accordionContainer);
    }
  }

  // IBGE City Autocomplete Logic
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

  // Preload alterado para Lazy Load via IntersectionObserver
  const formSection = document.getElementById('diagnostico');
  if (formSection) {
    const ibgeObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadCities();
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '500px' });
    ibgeObserver.observe(formSection);
  }

  function setupCityAutocomplete(cidadeInputId, estadoSelectId, autocompleteListId) {
    const cidadeInput = document.getElementById(cidadeInputId);
    const estadoSelect = document.getElementById(estadoSelectId);
    const autocompleteList = document.getElementById(autocompleteListId);

    if (cidadeInput && estadoSelect && autocompleteList) {
      let currentFiltered = [];
      let activeIndex = -1;

      cidadeInput.addEventListener('input', (e) => {
        const val = e.target.value;
        autocompleteList.innerHTML = '';
        activeIndex = -1;
        if (!val) {
          autocompleteList.style.display = 'none';
          return;
        }
        
        loadCities().then(cities => {
          const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
          const search = norm(val);
          currentFiltered = cities.filter(c => norm(c.name).startsWith(search) || norm(c.label).startsWith(search)).slice(0, 20);

          if (currentFiltered.length > 0) {
            currentFiltered.forEach((city, index) => {
              const li = document.createElement('li');
              li.innerHTML = `<span>${city.name}</span> <span class="uf">- ${city.uf}</span>`;
              
              // Prevent blur from hiding the list before click is registered
              li.addEventListener('mousedown', (evt) => {
                evt.preventDefault();
                selectCity(city);
              });
              autocompleteList.appendChild(li);
            });
            autocompleteList.style.display = 'block';
          } else {
            autocompleteList.style.display = 'none';
          }
        });
      });

      function selectCity(city) {
        cidadeInput.value = city.label;
        estadoSelect.value = city.uf;
        estadoSelect.dispatchEvent(new Event('change'));
        autocompleteList.style.display = 'none';
        currentFiltered = [];
        activeIndex = -1;
      }

      cidadeInput.addEventListener('keydown', (e) => {
        const items = autocompleteList.querySelectorAll('li');
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (activeIndex < items.length - 1) {
            activeIndex++;
            updateActiveItem(items);
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (activeIndex > 0) {
            activeIndex--;
            updateActiveItem(items);
          }
        } else if (e.key === 'Enter' || e.key === 'Tab') {
          if (autocompleteList.style.display === 'block') {
            if (activeIndex > -1 && currentFiltered[activeIndex]) {
              if (e.key === 'Enter') e.preventDefault();
              selectCity(currentFiltered[activeIndex]);
            } else if (currentFiltered.length > 0) {
              selectCity(currentFiltered[0]);
            }
          }
        }
      });

      function updateActiveItem(items) {
        items.forEach((item, index) => {
          if (index === activeIndex) {
            item.classList.add('active-item');
          } else {
            item.classList.remove('active-item');
          }
        });
        if (activeIndex > -1 && items[activeIndex]) {
          items[activeIndex].scrollIntoView({ block: 'nearest' });
        }
      }

      cidadeInput.addEventListener('blur', () => {
        setTimeout(() => {
          if (autocompleteList.style.display === 'block') {
            const val = cidadeInput.value;
            const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            const search = norm(val);
            const exactMatch = currentFiltered.find(c => norm(c.name) === search || norm(c.label) === search);
            
            if (exactMatch) {
              selectCity(exactMatch);
            } else if (currentFiltered.length > 0) {
              selectCity(currentFiltered[0]);
            } else {
              autocompleteList.style.display = 'none';
            }
          }
        }, 150);
      });
      
      document.addEventListener('mousedown', (e) => {
        if (e.target !== cidadeInput && !autocompleteList.contains(e.target)) {
          autocompleteList.style.display = 'none';
        }
      });
    }
  }

  setupCityAutocomplete('custom_cidade', 'custom_estado', 'city_autocomplete_list');
  setupCityAutocomplete('modal_cidade', 'modal_estado', 'modal_city_autocomplete_list');

  // Custom Select Logic Setup
  function setupCustomSelects() {
    const selects = document.querySelectorAll('select');
    
    selects.forEach(select => {
      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'custom-select-wrapper';
      
      // Insert wrapper before select
      select.parentNode.insertBefore(wrapper, select);
      // Move select into wrapper
      wrapper.appendChild(select);
      select.classList.add('hidden-native-select');
      
      // Create trigger
      const trigger = document.createElement('div');
      trigger.className = 'custom-select-trigger';
      
      const triggerText = document.createElement('span');
      // Set initial text to selected option or first option
      const selectedOption = select.options[select.selectedIndex];
      triggerText.textContent = selectedOption ? selectedOption.textContent : 'Selecione';
      
      const icon = document.createElement('i');
      icon.className = 'ph-bold ph-caret-down';
      
      trigger.appendChild(triggerText);
      trigger.appendChild(icon);
      wrapper.appendChild(trigger);
      
      // Create options container
      const optionsContainer = document.createElement('ul');
      optionsContainer.className = 'custom-options';
      
      Array.from(select.options).forEach((option, index) => {
        if (option.disabled && !option.value) return; // Skip disabled placeholders if empty
        
        const li = document.createElement('li');
        li.className = 'custom-option';
        li.textContent = option.textContent;
        li.dataset.value = option.value;
        
        if (index === select.selectedIndex) {
          li.classList.add('selected');
        }
        
        li.addEventListener('click', (e) => {
          e.stopPropagation();
          // Update native select
          select.value = option.value;
          // Trigger change event for RD Station ghost form hook and others
          select.dispatchEvent(new Event('change', { bubbles: true }));
          
          // Update trigger text
          triggerText.textContent = option.textContent;
          
          // Update selected class
          optionsContainer.querySelectorAll('.custom-option').forEach(el => el.classList.remove('selected'));
          li.classList.add('selected');
          
          // Close dropdown
          wrapper.classList.remove('open');
        });
        
        optionsContainer.appendChild(li);
      });
      
      wrapper.appendChild(optionsContainer);
      
      // Toggle dropdown
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.custom-select-wrapper').forEach(w => {
          if (w !== wrapper) w.classList.remove('open');
        });
        wrapper.classList.toggle('open');
      });
      
      // Update when native select changes programmatically
      select.addEventListener('change', () => {
        const newlySelected = select.options[select.selectedIndex];
        if (newlySelected) {
          triggerText.textContent = newlySelected.textContent;
          optionsContainer.querySelectorAll('.custom-option').forEach(el => {
            if (el.dataset.value === newlySelected.value) el.classList.add('selected');
            else el.classList.remove('selected');
          });
        }
      });
    });
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-select-wrapper')) {
        document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
      }
    });
  }

  setupCustomSelects();

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
        
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'ENVIANDO...';
        submitBtn.disabled = true;
        if(feedbackEl) feedbackEl.style.display = 'none';

        if (typeof window.loadRDStation === 'function') window.loadRDStation();

        let checks = 0;
        const checkRDTimer = setInterval(() => {
          const rdForm = rdContainer.querySelector('form');
          if (rdForm) {
            clearInterval(checkRDTimer);
            submitToRD(rdForm);
          } else {
            checks++;
            if (checks > 50) { // 10s
              clearInterval(checkRDTimer);
              showFeedback('Erro: Serviço indisponível no momento. Tente novamente.', 'error');
              submitBtn.innerHTML = originalBtnText;
              submitBtn.disabled = false;
            }
          }
        }, 200);

        function submitToRD(rdForm) {
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
        }
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
  setupGhostForm('modal_', 'modal-diagnostico-form', 'rd-ghost-container', 'modal_submit_btn', 'modal-form-feedback');

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

    // Text Reveal on Scroll Animation (Optimized)
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
      let isRevealScrolling = false;
      let revealInView = false;
      const revealIo = new IntersectionObserver(e => revealInView = e[0].isIntersecting, {rootMargin: '100%'});
      revealIo.observe(revealText);

      window.addEventListener('scroll', () => {
        if (!revealInView) return;
        if (!isRevealScrolling) {
          window.requestAnimationFrame(() => {
            const rect = revealText.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            const elementCenter = rect.top + rect.height / 2;
            const viewportCenter = windowHeight / 2;
            const startY = windowHeight;
            
            let progress = (startY - elementCenter) / (startY - viewportCenter);
            progress = Math.max(0, Math.min(1, progress));
            
            chars.forEach((char, index) => {
              const charThreshold = index / chars.length;
              if (progress > charThreshold * 0.8) { 
                char.classList.add('word-yellow');
              } else {
                char.classList.remove('word-yellow');
              }
            });
            isRevealScrolling = false;
          });
          isRevealScrolling = true;
        }
      }, { passive: true });
      
      window.dispatchEvent(new Event('scroll'));
    }

    // RD Station Lazy Loader
    if (typeof window.loadRDStation === 'function') {
      const diagSection = document.getElementById('diagnostico');
      if (diagSection) {
        const rdIo = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            window.loadRDStation();
            rdIo.disconnect();
          }
        }, { rootMargin: '500px' });
        rdIo.observe(diagSection);
      }
      
      const triggerLoad = () => { window.loadRDStation(); };
      document.querySelectorAll('.btn, [href="#diagnostico"], button').forEach(el => {
        el.addEventListener('mouseenter', triggerLoad, { once: true });
        el.addEventListener('touchstart', triggerLoad, { once: true, passive: true });
        el.addEventListener('focus', triggerLoad, { once: true });
      });
    }
  });



