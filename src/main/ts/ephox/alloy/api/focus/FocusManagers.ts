import { Fun, Option } from '@ephox/katamari';
import { Focus, Element } from '@ephox/sugar';

import { Highlighting } from '../behaviour/Highlighting';
import { AlloyComponent } from '../../api/component/ComponentApi';

export interface FocusManager {
  get: (component: AlloyComponent) => Option<Element>;
  set: (component: AlloyComponent, focusee: Element) => void;
}

const dom = (): FocusManager => {
  const get = (component) => {
    return Focus.search(component.element());
  };

  const set = (component, focusee) => {
    component.getSystem().triggerFocus(focusee, component.element());
  };

  return {
    get,
    set
  };
};

const highlights = (): FocusManager => {
  const get = (component) => {
    return Highlighting.getHighlighted(component).map((item) => {
      return item.element();
    });
  };

  const set = (component, element) => {
    component.getSystem().getByDom(element).fold(Fun.noop, (item) => {
      Highlighting.highlight(component, item);
    });
  };

  return {
    get,
    set
  };
};

export {
  dom,
  highlights
};