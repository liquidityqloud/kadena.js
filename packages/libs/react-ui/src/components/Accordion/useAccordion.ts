import { useSelectableItem, useSelectableList } from '@react-aria/selection';
import { mergeProps, useId } from '@react-aria/utils';
import type {
  CollectionBase,
  DOMAttributes,
  DOMProps,
  Expandable,
  Node,
} from '@react-types/shared';
import type { ButtonHTMLAttributes, RefObject } from 'react';
import { useButton } from 'react-aria';
import type { TreeState } from 'react-stately';

//TODO: Replace with @react-aria/accordion when available.
// eslint-disable-next-line @typescript-eslint/naming-convention
interface AccordionProps<T> extends CollectionBase<T>, Expandable {}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface AriaAccordionProps<T> extends AccordionProps<T>, DOMProps {}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface AccordionAria {
  /** Props for the accordion container element. */
  accordionProps: DOMAttributes;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface AccordionItemAriaProps<T> {
  item: Node<T>;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface AccordionItemAria {
  /** Props for the accordion item button. */
  buttonProps: ButtonHTMLAttributes<HTMLElement>;
  /** Props for the accordion item content element. */
  regionProps: DOMAttributes;
}

export function useAccordionItem<T>(
  props: AccordionItemAriaProps<T>,
  state: TreeState<T>,
  ref: RefObject<HTMLButtonElement>,
): AccordionItemAria {
  const { item } = props;
  const buttonId = useId();
  const regionId = useId();
  const isDisabled = state.disabledKeys.has(item.key);
  const { itemProps } = useSelectableItem({
    selectionManager: state.selectionManager,
    key: item.key,
    ref,
  });
  const { buttonProps } = useButton(
    mergeProps(itemProps as any, {
      id: buttonId,
      elementType: 'button',
      isDisabled,
      onPress: () => state.toggleKey(item.key),
    }),
    ref,
  );
  const isExpanded = state.expandedKeys.has(item.key);
  return {
    buttonProps: {
      ...buttonProps,
      'aria-expanded': isExpanded,
      'aria-controls': isExpanded ? regionId : undefined,
    },
    regionProps: {
      id: regionId,
      role: 'region',
      'aria-labelledby': buttonId,
    },
  };
}

export function useAccordion<T>(
  props: AriaAccordionProps<T>,
  state: TreeState<T>,
  ref: RefObject<HTMLDivElement>,
): AccordionAria {
  const { listProps } = useSelectableList({
    ...props,
    ...state,
    allowsTabNavigation: true,
    ref,
  });
  return {
    accordionProps: {
      ...listProps,
      tabIndex: undefined,
    },
  };
}
