const BindClass = 'vgrammar-bind';
const NameClass = 'vgrammar-bind-name';
const RadioClass = 'vgrammar-bind-radio';
const OptionClass = 'vgrammar-option-';

export function tickStep(start: number, stop: number, count: number) {
  const step0 = Math.abs(stop - start) / Math.max(0, count);
  let step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10));
  const error = step0 / step1;
  if (error >= 1e10) {
    step1 *= 10;
  } else if (error >= 1e5) {
    step1 *= 5;
  } else if (error >= 1e2) {
    step1 *= 2;
  }
  return stop < start ? -step1 : step1;
}

export const createBinds = (signals: any, chartInstance: any, container: HTMLDivElement) => {
  if (signals && signals.length) {
    signals.forEach((signal: any) => {
      if (signal.id) {
        generate(signal, container, signal.bind, (value: any) => {
          const signalInstance = chartInstance.getSignalById(signal.id);

          signalInstance.value(value);
          chartInstance.runAsync();
        });
      }
    });
  }
};

const createElement = (tag: string, attr?: any, text?: string) => {
  const el = document.createElement(tag);
  for (const key in attr) {
    el.setAttribute(key, attr[key]);
  }
  if (text != null) {
    el.textContent = text;
  }
  return el;
};

/**
 * Generate an HTML input form element and bind it to a signal.
 */
function generate(signal: any, el: HTMLDivElement, param: any, callback: (value: any) => void) {
  const div = createElement('div', { class: BindClass });

  div.appendChild(createElement('span', { class: NameClass }, signal.id));

  el.appendChild(div);

  let input = form;
  switch (param.input) {
    case 'checkbox':
      input = checkbox;
      break;
    case 'select':
      input = select;
      break;
    case 'radio':
      input = radio;
      break;
    case 'range':
      input = range;
      break;
  }

  input(signal, div, param, callback);
}

/**
 * Generates an arbitrary input form element.
 * The input type is controlled via user-provided parameters.
 */
function form(signal: any, el: HTMLElement, param: any, callback: (value: any) => void) {
  const node = createElement('input');

  for (const key in param) {
    if (key !== 'signal' && key !== 'element') {
      node.setAttribute(key === 'input' ? 'type' : key, param[key]);
    }
  }
  node.setAttribute('name', signal.id);

  el.appendChild(node);

  node.addEventListener('input', callback);
}

/**
 * Generates a checkbox input element.
 */
function checkbox(signal: any, el: HTMLElement, param: any, callback: (value: any) => void) {
  const attr: any = { type: 'checkbox', name: signal.id };
  if (signal.value) {
    attr.checked = true;
  }
  const node = createElement('input', attr);

  el.appendChild(node);

  node.addEventListener('change', e => {
    const target = e.target;

    callback((target as any).checked);
  });
}

/**
 * Generates a selection list input element.
 */
function select(signal: any, el: HTMLElement, param: any, callback: (value: any) => void) {
  const node = createElement('select', { name: signal.id });

  param.options.forEach((option: any) => {
    const attr: any = { value: option };
    if (valuesEqual(option, signal.value)) {
      attr.selected = true;
    }
    node.appendChild(createElement('option', attr, option + ''));
  });

  el.appendChild(node);

  node.addEventListener('change', e => {
    const target = e.target;

    callback(param.options.find((option: any) => valuesEqual(option, (target as any).value)));
  });
}

/**
 * Generates a radio button group.
 */
function radio(signal: any, el: HTMLElement, param: any, callback: (value: any) => void) {
  const group = createElement('span', { class: RadioClass });

  el.appendChild(group);

  param.options.forEach((option: any) => {
    const id = OptionClass + signal.id + '-' + option;

    const attr: any = {
      id: id,
      type: 'radio',
      name: signal.id,
      value: option
    };
    if (valuesEqual(option, signal.value)) {
      attr.checked = true;
    }

    const input = createElement('input', attr);

    input.addEventListener('change', (e: any) => {
      if (e.target.checked) {
        callback(e.target.getAttribute('value'));
      }
    });

    group.appendChild(input);
    group.appendChild(createElement('label', { for: id }, option + ''));

    return input;
  });
}

/**
 * Generates a slider input element.
 */
function range(signal: any, el: HTMLElement, param: any, callback: (value: any) => void) {
  const value = signal.value !== undefined ? signal.value : (+param.max + +param.min) / 2;

  const max = param.max != null ? param.max : Math.max(100, +value) || 100;
  const min = param.min || Math.min(0, max, +value) || 0;
  const step = param.step || tickStep(min, max, 100);

  const node = createElement('input', {
    type: 'range',
    name: param.signal,
    min: min,
    max: max,
    step: step
  });

  (node as any).value = value;

  const label = createElement('label', {}, value);

  el.appendChild(node);
  el.appendChild(label);

  const handleUpdate = (e: { target: any }) => {
    const value = (e.target as any).value;
    label.textContent = value;
    callback(+value);
  };

  node.addEventListener('input', handleUpdate);
  node.addEventListener('change', handleUpdate);
}

function valuesEqual(a: any, b: any) {
  return a === b || a + '' === b + '';
}
