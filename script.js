const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('open', !isOpen);
    menuButton.textContent = isOpen ? 'Menu' : 'Close';
  });

  navigation.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('open');
      menuButton.textContent = 'Menu';
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('open');
      menuButton.textContent = 'Menu';
    }
  });
}

const portfolioExplorer = document.querySelector('[data-portfolio-explorer]');

if (portfolioExplorer) {
  const tabList = portfolioExplorer.querySelector('[role="tablist"]');
  const tabs = Array.from(portfolioExplorer.querySelectorAll('[data-portfolio-tab]'));
  const panels = Array.from(portfolioExplorer.querySelectorAll('[data-portfolio-panel]'));
  const hashAliases = new Map([
    ['projects', 'projects'],
    ['portfolio', 'projects'],
    ['additional-work', 'projects'],
    ['evidence', 'evidence'],
    ['cases', 'evidence'],
    ['assessment', 'assessment'],
    ['leadership', 'leadership'],
    ['process', 'leadership'],
  ]);

  if (tabList && tabs.length === 4 && tabs.length === panels.length) {
    const tabForName = (name) => tabs.find((tab) => tab.dataset.portfolioTab === name);
    const nameForHash = () => hashAliases.get(window.location.hash.slice(1));
    const alignExplorer = () => {
      const root = document.documentElement;
      const previousInlineBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      portfolioExplorer.scrollIntoView({ block: 'start' });
      root.style.scrollBehavior = previousInlineBehavior;
    };
    const scheduleExplorerAlignment = () => {
      window.requestAnimationFrame(() => window.requestAnimationFrame(alignExplorer));
      if (document.readyState === 'complete') {
        window.setTimeout(alignExplorer, 0);
      } else {
        window.addEventListener('load', () => window.requestAnimationFrame(() => window.requestAnimationFrame(alignExplorer)), { once: true });
      }
    };

    const activateTab = (nextTab, { moveFocus = false, updateHash = false } = {}) => {
      const targetName = nextTab.dataset.portfolioTab;

      tabs.forEach((tab) => {
        const isActive = tab === nextTab;
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.portfolioPanel !== targetName;
      });

      if (updateHash) {
        window.history.replaceState(null, '', `#${targetName}`);
      }

      if (moveFocus) {
        nextTab.focus();
        nextTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    };

    const initialName = nameForHash();
    const initialTab = tabForName(initialName) || tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0];

    portfolioExplorer.classList.add('is-enhanced');
    activateTab(initialTab);
    tabList.hidden = false;

    if (initialName) {
      scheduleExplorerAlignment();
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activateTab(tab, { updateHash: true }));
      tab.addEventListener('keydown', (event) => {
        let nextIndex = null;

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          nextIndex = (index + 1) % tabs.length;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = tabs.length - 1;
        }

        if (nextIndex !== null) {
          event.preventDefault();
          activateTab(tabs[nextIndex], { moveFocus: true, updateHash: true });
        }
      });
    });

    window.addEventListener('hashchange', () => {
      const targetName = nameForHash();
      const nextTab = tabForName(targetName);

      if (!nextTab) {
        return;
      }

      activateTab(nextTab);
      scheduleExplorerAlignment();
    });
  }
}


const imageLightbox = document.querySelector('[data-image-lightbox]');

if (imageLightbox instanceof HTMLDialogElement) {
  const lightboxImage = imageLightbox.querySelector('[data-image-lightbox-image]');
  const lightboxCaption = imageLightbox.querySelector('[data-image-lightbox-caption]');
  const lightboxClose = imageLightbox.querySelector('[data-image-lightbox-close]');
  const lightboxTriggers = Array.from(document.querySelectorAll('[data-lightbox-src]'));
  let returnFocus = null;

  const closeLightbox = () => {
    if (imageLightbox.open) {
      imageLightbox.close();
    }
  };

  lightboxTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (!(lightboxImage instanceof HTMLImageElement) || !(lightboxCaption instanceof HTMLElement)) {
        return;
      }

      returnFocus = trigger;
      lightboxImage.src = trigger.dataset.lightboxSrc || '';
      lightboxImage.alt = trigger.dataset.lightboxAlt || '';
      lightboxCaption.textContent = trigger.dataset.lightboxCaption || '';
      imageLightbox.showModal();
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);

  imageLightbox.addEventListener('click', (event) => {
    if (event.target === imageLightbox) {
      closeLightbox();
    }
  });

  imageLightbox.addEventListener('close', () => {
    if (lightboxImage instanceof HTMLImageElement) {
      lightboxImage.src = '';
      lightboxImage.alt = '';
    }

    if (returnFocus instanceof HTMLElement) {
      returnFocus.focus();
    }
  });
}

/* Assessment evidence workbench */
(() => {
  const assessmentLab = document.querySelector('.assessment-lab');

  if (!assessmentLab) return;
  'use strict';

  const labTabs = Array.from(document.querySelectorAll('[data-lab-tab]'));
  const labPanels = Array.from(document.querySelectorAll('[data-lab-panel]'));

  function activateLabTab(nextTab, moveFocus = false) {
    const target = nextTab.dataset.labTab;

    labTabs.forEach((tab) => {
      const isActive = tab === nextTab;
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    labPanels.forEach((panel) => {
      panel.hidden = panel.dataset.labPanel !== target;
    });

    if (moveFocus) nextTab.focus();
  }

  function handleRovingKeys(event, buttons, activate) {
    const currentIndex = buttons.indexOf(event.currentTarget);
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % buttons.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = buttons.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    activate(buttons[nextIndex], true);
  }

  labTabs.forEach((tab) => {
    tab.addEventListener('click', () => activateLabTab(tab));
    tab.addEventListener('keydown', (event) => handleRovingKeys(event, labTabs, activateLabTab));
  });

  const formativeGovernance = [
    'Clear learning objective',
    'Representative content',
    'Diagnostic feedback',
    'Instructional alignment'
  ];

  const summativeGovernance = [
    'Defined minimally competent performer',
    'Validity evidence for intended score use',
    'Defensible cut score',
    'Equivalent alternate forms',
    'Ongoing quality evaluation and maintenance'
  ];

  const decisionStates = {
    formative: {
      low: {
        low: {
          rigor: 'Flexible practice',
          level: 'flexible',
          modality: 'Knowledge or skill check with feedback',
          rationale: 'Use clear prompts, representative content, and feedback to support learning at the required cognitive level.',
          supports: 'The learner has engaged with training and is working toward mastery; the result can guide feedback and further practice.',
          boundary: 'It does not verify readiness for production, sustained job performance, or business impact.',
          guardrail: 'Keep the content aligned to the work, but use the result as an instructional signal, not a gateway decision.',
          governance: formativeGovernance
        },
        high: {
          rigor: 'Contextual practice',
          level: 'strong',
          modality: 'Scenario skill practice',
          rationale: 'Use realistic scenarios to rehearse complex decisions, reveal reasoning gaps, and provide corrective feedback.',
          supports: 'The response pattern can show where judgement is developing and where additional guided practice is needed.',
          boundary: 'A formative scenario does not establish minimum competency or predict job performance on its own.',
          guardrail: 'Match the scenario’s cognitive demand to the workflow; do not add difficulty through obscure language or irrelevant detail.',
          governance: formativeGovernance
        }
      },
      high: {
        low: {
          rigor: 'Protected practice',
          level: 'strong',
          modality: 'Structured performance practice',
          rationale: 'Give learners a safe opportunity to perform the task, receive feedback, and correct consequential errors before assessment.',
          supports: 'Observed practice can identify specific skill gaps and inform coaching before a readiness decision is made.',
          boundary: 'Practice data should not be treated as a summative score decision or proof of operational performance.',
          guardrail: 'Because failure matters, preserve authentic conditions and make feedback diagnostic rather than simply marking right or wrong.',
          governance: formativeGovernance
        },
        high: {
          rigor: 'Realistic practice',
          level: 'highest',
          modality: 'Guided simulation or virtual performance practice',
          rationale: 'Recreate critical decisions and complex workflow conditions while keeping feedback and recovery available.',
          supports: 'The experience can expose how learners apply knowledge across a complex, consequential task and where support is required.',
          boundary: 'Even realistic practice is not a defensible competency decision unless it is designed, scored, and governed as an assessment.',
          guardrail: 'Use the blueprint to focus on the most critical and complex decisions; realism alone does not create valid evidence.',
          governance: formativeGovernance
        }
      }
    },
    summative: {
      low: {
        low: {
          rigor: 'Defined mastery',
          level: 'strong',
          modality: 'Selected response skill check',
          rationale: 'Use scenario items at application level or higher to verify a defined minimum standard efficiently.',
          supports: 'A passing score can support a minimum mastery decision for the sampled knowledge and skills under the assessment conditions.',
          boundary: 'The score does not automatically generalize to the full job or establish business impact.',
          guardrail: 'Define the intended score use, target minimally competent performer, blueprint, item count, and decision threshold before development.',
          governance: summativeGovernance
        },
        high: {
          rigor: 'Scenario evidence',
          level: 'strong',
          modality: 'Text simulation or scenario skill check',
          rationale: 'Use connected job scenarios to elicit application and analysis across complex workflow decisions.',
          supports: 'The score can support a mastery decision for the critical decisions and content areas represented in the blueprint.',
          boundary: 'It cannot support claims about untested workflow areas, sustained transfer, or operational impact.',
          guardrail: 'Use content weighting to sample the domain deliberately and ensure the item format can elicit the intended cognitive level.',
          governance: summativeGovernance
        }
      },
      high: {
        low: {
          rigor: 'Stronger assurance',
          level: 'highest',
          modality: 'Structured skill or performance assessment',
          rationale: 'Use tightly specified tasks, stable scoring, and enough evidence to protect a consequential readiness decision.',
          supports: 'When validity and reliability evidence are adequate, the result can support a minimum competency decision for the assessed task.',
          boundary: 'A consequential score still does not prove performance outside the sampled conditions or wider business results.',
          guardrail: 'High criticality increases the evidence burden: involve psychometric expertise, protect fairness, and evaluate score quality before use.',
          governance: summativeGovernance
        },
        high: {
          rigor: 'Highest assurance',
          level: 'highest',
          modality: 'Performance assessment or robust text simulation',
          rationale: 'Elicit complex, consequential decisions in conditions that closely represent the work and can be scored consistently.',
          supports: 'With a defensible blueprint, scoring model, cut score, and quality evidence, the result can support competency under the assessed conditions.',
          boundary: 'It does not independently prove sustained job transfer, causal learning impact, or business performance.',
          guardrail: 'Treat the score as a consequential instrument: require psychometric consultation, sufficient sampling, fairness review, maintenance, and ongoing quality evaluation.',
          governance: summativeGovernance
        }
      }
    }
  };

  const decisionForm = document.querySelector('.claim-controls');
  const rigorBadge = document.getElementById('rigor-badge');
  const claimModality = document.getElementById('claim-modality');
  const claimRationale = document.getElementById('claim-rationale');
  const claimSupports = document.getElementById('claim-supports');
  const claimBoundary = document.getElementById('claim-boundary');
  const claimGuardrail = document.getElementById('claim-guardrail');
  const claimGovernance = document.getElementById('claim-governance');

  function updateDecision() {
    const formData = new FormData(decisionForm);
    const purpose = formData.get('purpose');
    const criticality = formData.get('criticality');
    const complexity = formData.get('complexity');
    const state = decisionStates[purpose][criticality][complexity];

    rigorBadge.textContent = state.rigor;
    rigorBadge.dataset.level = state.level;
    claimModality.textContent = state.modality;
    claimRationale.textContent = state.rationale;
    claimSupports.textContent = state.supports;
    claimBoundary.textContent = state.boundary;
    claimGuardrail.textContent = state.guardrail;

    claimGovernance.innerHTML = '';
    state.governance.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      claimGovernance.appendChild(li);
    });
  }

  decisionForm.addEventListener('change', updateDecision);
  updateDecision();

  const qualityData = {
    validity: {
      title: 'Validity',
      definition: 'Supports accurate score interpretation by measuring the right content at the right cognitive level.',
      question: 'Does this assessment measure the work the score claim refers to?',
      risk: 'A precise score can still support the wrong conclusion.',
      response: 'Align workflow tasks, performance objectives, assessment objectives, cognition, and content sampling before writing items.',
      note: '<strong>North star:</strong> the other values provide evidence that the intended score interpretation is trustworthy.'
    },
    reliability: {
      title: 'Reliability',
      definition: 'Shows that the assessment measures the content area consistently and limits the influence of measurement error.',
      question: 'Would the result remain sufficiently consistent across items, occasions, and scoring conditions?',
      risk: 'The decision may reflect unstable items, too little evidence, or inconsistent scoring rather than capability.',
      response: 'Use an adequate sample, clear scoring rules, strong keys and distractors, item review, and quality analysis.',
      note: '<strong>Dependency:</strong> validity is not possible without enough reliability to support the intended interpretation.'
    },
    generalizability: {
      title: 'Generalizability',
      definition: 'Determines whether performance on the sampled assessment can support an inference about performance in the job domain.',
      question: 'Does the sampled evidence represent the tasks and cognitive demands beyond this test form?',
      risk: 'The score may describe test performance while saying little about the work it is meant to represent.',
      response: 'Match the assessment to job cognition, sample the domain deliberately, and use authentic contexts and tasks.',
      note: '<strong>Boundary:</strong> stronger task alignment supports a job performance inference; it does not make an assessment a business impact measure.'
    },
    comparability: {
      title: 'Comparability',
      definition: 'Requires multiple forms to be equivalent enough in content and statistical properties for defensible comparison.',
      question: 'Did different learners, cohorts, or time periods receive evidence demands that are meaningfully equivalent?',
      risk: 'Score differences may come from easier content or different coverage rather than a real difference in capability.',
      response: 'Build forms from the same blueprint and sampling rules, then evaluate their content and score characteristics.',
      note: '<strong>Use constraint:</strong> do not compare groups or trends when the forms and conditions are not demonstrably comparable.'
    },
    fairness: {
      title: 'Fairness',
      definition: 'Requires every learner to have an equal opportunity to demonstrate the knowledge and skills being assessed.',
      question: 'Could language, context, access, timing, or group membership distort the score?',
      risk: 'The result may reflect irrelevant barriers or bias instead of the intended competency.',
      response: 'Use accessible delivery, clear language, bias review, representative scenarios, and conditions appropriate to the score use.',
      note: '<strong>Quality condition:</strong> fairness is part of valid score interpretation, not an optional review after development.'
    }
  };

  const qualityButtons = Array.from(document.querySelectorAll('[data-quality]'));
  const qualityTitle = document.getElementById('quality-title');
  const qualityDefinition = document.getElementById('quality-definition');
  const qualityQuestion = document.getElementById('quality-question');
  const qualityRisk = document.getElementById('quality-risk');
  const qualityResponse = document.getElementById('quality-response');
  const qualityNote = document.getElementById('quality-note');

  function activateQuality(button, moveFocus = false) {
    const data = qualityData[button.dataset.quality];

    qualityButtons.forEach((item) => {
      const isActive = item === button;
      item.setAttribute('aria-pressed', String(isActive));
      item.tabIndex = isActive ? 0 : -1;
    });

    qualityTitle.textContent = data.title;
    qualityDefinition.textContent = data.definition;
    qualityQuestion.textContent = data.question;
    qualityRisk.textContent = data.risk;
    qualityResponse.textContent = data.response;
    qualityNote.innerHTML = data.note;

    if (moveFocus) button.focus();
  }

  qualityButtons.forEach((button) => {
    button.addEventListener('click', () => activateQuality(button));
    button.addEventListener('keydown', (event) => handleRovingKeys(event, qualityButtons, activateQuality));
  });

  const blueprintData = {
    task: {
      index: 'WORK',
      label: 'Start with the performance',
      title: 'Determine whether example content violates a policy.',
      description: 'Rapid Workflow Analysis defines the critical task and knowledge needed to meet the performance expectation. These outputs become the blueprint’s starting inputs.',
      risk: 'Testing convenient course content instead of the work that the score is meant to represent.'
    },
    objective: {
      index: 'DEFINE',
      label: 'Make the expectation measurable',
      title: 'Given example content, judge whether it violates policy in order to select the correct action.',
      description: 'The assessment objective states what the learner must demonstrate at the point of assessment and must be measurable in the chosen format.',
      risk: 'Writing vague objectives that cannot guide item development or support a clear score interpretation.'
    },
    cognition: {
      index: 'DEMAND',
      label: 'Match the level of thinking',
      title: 'Apply policy and analyse relationships rather than simply recalling it.',
      description: 'The cognitive level should approach the level expected in the workflow. Summative skill checks generally focus on application and analysis rather than basic recall.',
      risk: 'Using difficult wording or obscure facts while still measuring only recall instead of thinking relevant to the job.'
    },
    sampling: {
      index: 'COVER',
      label: 'Plan what the score represents',
      title: 'Weight critical and complex decisions deliberately.',
      description: 'The sampling plan allocates items across objectives and content areas. Critical impact, complexity, and available prevalence data can inform the weighting.',
      risk: 'Overrepresenting easy content to write or drawing a broad conclusion from a narrow and accidental sample.'
    },
    evidence: {
      index: 'OBSERVE',
      label: 'Choose a format that can elicit the skill',
      title: 'Use scenario evidence or simulated performance at the required level.',
      description: 'Selected response, text simulation, and performance assessment formats serve different purposes. Modality follows the intended claim and operating conditions.',
      risk: 'Choosing an engaging format that cannot produce the evidence required for the decision or cannot be scored consistently.'
    }
  };

  const blueprintButtons = Array.from(document.querySelectorAll('[data-blueprint]'));
  const blueprintIndex = document.getElementById('blueprint-index');
  const blueprintLabel = document.getElementById('blueprint-label');
  const blueprintTitle = document.getElementById('blueprint-title');
  const blueprintDescription = document.getElementById('blueprint-description');
  const blueprintRisk = document.getElementById('blueprint-risk');

  function activateBlueprint(button, moveFocus = false) {
    const data = blueprintData[button.dataset.blueprint];

    blueprintButtons.forEach((item) => {
      const isActive = item === button;
      item.setAttribute('aria-pressed', String(isActive));
      item.tabIndex = isActive ? 0 : -1;
    });

    blueprintIndex.textContent = data.index;
    blueprintLabel.textContent = data.label;
    blueprintTitle.textContent = data.title;
    blueprintDescription.textContent = data.description;
    blueprintRisk.textContent = data.risk;

    if (moveFocus) button.focus();
  }

  blueprintButtons.forEach((button) => {
    button.addEventListener('click', () => activateBlueprint(button));
    button.addEventListener('keydown', (event) => handleRovingKeys(event, blueprintButtons, activateBlueprint));
  });
})();
