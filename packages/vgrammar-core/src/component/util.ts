import type { Component } from '../view/component';

export function getComponentGraphic<T>(component: Component) {
  if (component.elements && component.elements[0] && component.elements[0].getGraphicItem) {
    return component.elements[0].getGraphicItem() as T;
  }
}
