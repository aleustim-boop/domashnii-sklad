// Тема 06 «Домашній Склад»: бургер-меню, модальное окно заказа, галерея товара, сортировка таблицы категории
(function () {
  'use strict';

  // Мобильное меню
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.classList.toggle('is-open', open);
    });
  }

  // Модальное окно заказа: подставляем название/артикул и готовим mailto
  var modal = document.getElementById('order-modal');
  var omProduct = document.getElementById('om-product');
  var omMail = document.getElementById('om-mail');
  var lastFocus = null;

  function openModal(name, sku) {
    if (!modal) return;
    var label = (name || '') + (sku ? ' (арт. ' + sku + ')' : '');
    if (omProduct) omProduct.textContent = label;
    if (omMail) {
      var base = omMail.getAttribute('href').split('?')[0];
      omMail.setAttribute('href', base
        + '?subject=' + encodeURIComponent('Замовлення: ' + label)
        + '&body=' + encodeURIComponent('Доброго дня! Цікавить: ' + label + '\nКількість: \nТелефон для зв\'язку: '));
    }
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    var close = document.getElementById('om-close');
    if (close) close.focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.js-order');
    if (b) {
      e.preventDefault();
      openModal(b.getAttribute('data-name'), b.getAttribute('data-sku'));
      return;
    }
    if (e.target === modal || e.target.closest('#om-close')) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // Галерея: миниатюра -> главное фото
  var main = document.getElementById('gal-main');
  var thumbs = document.querySelectorAll('.gallery__thumb');
  if (main && thumbs.length) {
    thumbs.forEach(function (t) {
      t.addEventListener('click', function () {
        main.src = t.getAttribute('data-src');
        thumbs.forEach(function (x) { x.classList.remove('is-active'); });
        t.classList.add('is-active');
      });
    });
  }

  // Сортировка строк таблицы (#grid) по data-атрибутам: price / name / stock; переключается селектом и кликом по заголовку
  var sort = document.getElementById('sort');
  var grid = document.getElementById('grid');
  var heads = document.querySelectorAll('th[data-key]');
  if (grid) {
    var rows = Array.prototype.slice.call(grid.children);
    rows.forEach(function (r, i) { r.setAttribute('data-i', i); });

    function num(r, k) { return parseFloat(r.getAttribute('data-' + k)) || 0; }
    function str(r, k) { return r.getAttribute('data-' + k) || ''; }

    function apply(v) {
      var key = v.split('-')[0];
      var desc = v.indexOf('-desc') > -1;
      rows.sort(function (a, b) {
        var d = 0;
        if (key === 'price') d = num(a, 'price') - num(b, 'price');
        else if (key === 'name') d = str(a, 'name').localeCompare(str(b, 'name'), 'uk');
        else if (key === 'stock') d = num(b, 'stock') - num(a, 'stock');
        if (desc) d = -d;
        return d || (num(a, 'i') - num(b, 'i'));
      });
      rows.forEach(function (r) { grid.appendChild(r); });
      heads.forEach(function (th) {
        var on = th.getAttribute('data-key') === key && key !== 'default';
        th.classList.toggle('is-sorted', on);
        th.classList.toggle('is-desc', on && desc);
      });
    }

    if (sort) sort.addEventListener('change', function () { apply(sort.value); });

    heads.forEach(function (th) {
      th.addEventListener('click', function () {
        var key = th.getAttribute('data-key');
        var v;
        if (key === 'stock') {
          v = th.classList.contains('is-sorted') ? 'default' : 'stock';
        } else if (!th.classList.contains('is-sorted')) {
          v = key + '-asc';
        } else if (!th.classList.contains('is-desc')) {
          v = key + '-desc';
        } else {
          v = 'default';
        }
        if (sort) sort.value = v;
        apply(v);
      });
    });
  }
})();
