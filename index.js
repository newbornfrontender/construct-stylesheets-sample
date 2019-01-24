/**
 * 1. replace(text) - возвращает Promise, который разрешится после завершения
 * загрузки всех @import правил
 * 
 * 2. replaceSync(text) - заменяет содержимое таблицы стилей синхронно, но не
 * допускает никаких @import правил
 * 
 * 3. insertRule(rule) - вставляет одно правило
 * 
 * 4. deleteRule(rule) - удаляет одно правило
 */

const template = document.createElement('template');

template.innerHTML = `
  <style>
    p:first-of-type {
      color: red;
    }

    p:last-of-type {
      color: green;
    }
  </style>

  <p>Red (inner)</p>
  <p>Orange (construct stylesheets (inner - replace))</p>
  <p>Purple (construct stylesheets (inner - replaceSync))</p>
  <p>Pink (construct stylesheets (inner - insertRule))</p>
  <p>Blue (construct stylesheets (outside - replaceSync / replace))</p>
  <p>Green (inner)</p>
`;

// [ replace ] -----------------------------------------------------------------

const sheetReplace = new CSSStyleSheet();

sheetReplace.replace(`
  p:nth-of-type(2) {
    color: orange;
  }
`);

// [ replaceSync ] -------------------------------------------------------------

const sheetReplaceSync = new CSSStyleSheet();

sheetReplaceSync.replaceSync(`
  p:nth-of-type(3) {
    color: purple;
  }
`);

// [ insertRule ] --------------------------------------------------------------

const sheetInsertRule = new CSSStyleSheet();

sheetInsertRule.insertRule(`
  p:nth-of-type(4) {
    color: pink;
  }
`);

// [ deleteRule ] --------------------------------------------------------------

const sheetDeleteRule = new CSSStyleSheet();

// Добавляем правило, которое потом удалим
sheetDeleteRule.replace(`
  p:nth-of-type(5) {
    color: lightgray;
  }
`);

// Тут должен быть числовой индекс правила ->
// https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/deleteRule
sheetDeleteRule.deleteRule(0);

// -----------------------------------------------------------------------------

export class MyApp extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Добавляем таблицы стилей
    this.shadowRoot.adoptedStyleSheets = [
      sheetReplace,
      sheetReplaceSync,
      sheetInsertRule,
      sheetDeleteRule,
    ];
  };
};

customElements.define('my-app', MyApp)
