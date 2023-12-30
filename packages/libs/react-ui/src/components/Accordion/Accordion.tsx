'use client';
import { filterDOMProps, useObjectRef } from '@react-aria/utils';
import type { ForwardedRef } from 'react';
import React, { forwardRef } from 'react';
import type { ItemProps } from 'react-stately';
import { Item, useTreeState } from 'react-stately';
import { AccordionItemImpl } from './AccordionItemImpl';
import type { AriaAccordionProps } from './useAccordion';
import { useAccordion } from './useAccordion';

export type IAccordionProps<T extends object> = AriaAccordionProps<T>;
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, react/function-component-definition
function BaseAccordion<T extends object>(
  props: IAccordionProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>,
) {
  const state = useTreeState<T>(props);
  console.log('Accordion', props, state);
  const ref = useObjectRef(forwardedRef);
  const { accordionProps } = useAccordion(props, state, ref);
  return (
    <div {...filterDOMProps(props)} {...accordionProps} ref={ref}>
      {[...state.collection].map((item) => (
        <AccordionItemImpl<T> key={item.key} item={item} state={state} />
      ))}
    </div>
  );
}

export const Accordion = forwardRef(BaseAccordion);
