(function () {
  'use strict';

  const PAGE_FILES = {
    'index.html': ['site', 'hero', 'features', 'menu-items', 'testimonials'],
    'menu.html': ['site', 'menu-items'],
    'about.html': ['site', 'about'],
  };

  async function loadContent() {
    const pageName = window.location.pathname.split('/').pop() || 'index.html';
    const files = PAGE_FILES[pageName] || PAGE_FILES['index.html'];

    const data = {};
    for (const file of files) {
      try {
        const res = await fetch('content/' + file + '.json');
        if (res.ok) data[file] = await res.json();
      } catch (e) {
        console.warn('CMS: could not load content/' + file + '.json');
      }
    }

    replaceSimpleFields(data);
    renderRepeatableSections(data);
    renderMenuCategories(data);
  }

  function resolvePath(obj, path) {
    return path.split('.').reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : null;
    }, obj);
  }

  function replaceSimpleFields(data) {
    document.querySelectorAll('[data-cms]').forEach(function (el) {
      var val = resolvePath(data, el.getAttribute('data-cms'));
      if (val !== null && val !== undefined) {
        if (el.hasAttribute('data-cms-html')) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });
  }

  function renderRepeatableSections(data) {
    document.querySelectorAll('[data-cms-repeat]').forEach(function (container) {
      var key = container.getAttribute('data-cms-repeat');
      var items = resolvePath(data, key);
      if (!items || !items.length) return;

      var template = container.querySelector('template');
      if (!template) return;

      var firstChild = container.children[0];
      var isTemplateTag = template.tagName === 'TEMPLATE';
      var templateContent = isTemplateTag
        ? template.content.cloneNode(true)
        : template.cloneNode(true);

      container.innerHTML = '';

      items.forEach(function (item, index) {
        var clone = isTemplateTag
          ? template.content.cloneNode(true)
          : template.cloneNode(true);

        fillTemplate(clone, item, index);
        container.appendChild(clone);
      });
    });
  }

  function fillTemplate(el, data, index) {
    if (el.nodeType === 3) return;
    if (el.nodeType === 1) {
      Array.from(el.attributes).forEach(function (attr) {
        attr.value = attr.value.replace(/\{\{([^}]+)\}\}/g, function (_, key) {
          key = key.trim();
          if (key === '__index__') return index;
          return data[key] !== undefined ? data[key] : '';
        });
      });
    }
    if (el.childNodes) {
      Array.from(el.childNodes).forEach(function (child) {
        fillTemplate(child, data, index);
      });
      if (el.nodeType === 1 && el.childNodes.length === 1 && el.firstChild.nodeType === 3) {
        var text = el.firstChild.textContent;
        el.firstChild.textContent = text.replace(/\{\{([^}]+)\}\}/g, function (_, key) {
          key = key.trim();
          if (key === '__index__') return index;
          return data[key] !== undefined ? data[key] : '';
        });
      }
    }
  }

  function renderMenuCategories(data) {
    var containers = document.querySelectorAll('[data-cms-menu]');
    if (!containers.length) return;
    var cats = data['menu-items'] && data['menu-items'].categories;
    if (!cats) return;

    containers.forEach(function (container) {
      var catId = container.getAttribute('data-cms-menu');
      var cat = cats.find(function (c) { return c.id === catId; });
      if (!cat || !cat.items) return;

      var template = container.querySelector('template');
      if (!template) return;

      container.innerHTML = '';
      cat.items.forEach(function (item, index) {
        item.category = cat.name;
        var clone = template.content.cloneNode(true);
        fillTemplate(clone, item, index);
        container.appendChild(clone);
      });
    });
  }

  function init() {
    loadContent().then(function () {
      document.dispatchEvent(new CustomEvent('cms:loaded'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
