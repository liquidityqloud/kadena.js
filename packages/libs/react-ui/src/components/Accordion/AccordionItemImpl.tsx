'use client';
import React, { useRef } from 'react';
import { mergeProps, useFocusRing, useHover } from 'react-aria';
import type { Node, TreeState } from 'react-stately';
import { fontH3Regular } from '../../styles/tokens/styles.css';
import { Close } from '../Icon/System/SystemIcon';
import {
  accordionButtonClass,
  accordionContentClass,
  accordionSectionClass,
  accordionToggleIconClass,
} from './Accordion.css';
import { useAccordionItem } from './useAccordion';

interface IAccordionItemProps<T> {
  item: Node<T>;
  state: TreeState<T>;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, react/function-component-definition
export function AccordionItemImpl<T>(props: IAccordionItemProps<T>) {
  const ref = useRef<HTMLButtonElement>(null);
  const { state, item } = props;
  const { buttonProps, regionProps } = useAccordionItem<T>(props, state, ref);
  const isOpen = state.expandedKeys.has(item.key);
  const isDisabled = state.disabledKeys.has(item.key);
  const { hoverProps } = useHover({ isDisabled });
  const { focusProps } = useFocusRing({
    within: true,
  });

  return (
    <section
      className={accordionSectionClass}
      data-testid="kda-accordion-section"
    >
      <h3 className={fontH3Regular}>
        <button
          {...mergeProps(buttonProps, hoverProps, focusProps)}
          ref={ref}
          className={accordionButtonClass}
        >
          {item.rendered}
          <Close
            className={accordionToggleIconClass}
            size="sm"
            data-open={isOpen}
          />
        </button>
      </h3>
      <div
        {...regionProps}
        className={accordionContentClass}
        data-open={isOpen}
      >
        {item.props.children}
      </div>
    </section>
  );
}
