import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Item } from 'react-stately';
import { Accordion, AccordionItem } from './Accordion';

const sections = Array.from({ length: 10 }, (d, i) => ({
  title: `Section title ${i}`,
  children: (
    <p>
      This is the content for section {i}.<br />
      The type of this content is not restricted: any valid HTML content is
      allowed.
    </p>
  ),
}));

const meta: Meta = {
  title: 'Layout/Accordion',
  parameters: {
    status: {
      type: 'inDevelopment',
    },
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component:
          'The Accordion component allows the user to show and hide sections of content on a page.<br />These sections can be expanded and collapsed by clicking the section headers.<br /><br /><em>Note: this variant of the Accordion component is meant to be used to display content.<br />For Navigation purposes, please use the <strong>NavAccordion</strong> within the Navigation subgroup.</em>',
      },
    },
  },
};

export const Dynamic: StoryObj = {
  name: 'Accordion',
  render: () => {
    return (
      <Accordion>
        {sections.map(({ title, children }, index) => (
          <Item title={title} key={index}>
            {children}
          </Item>
        ))}
      </Accordion>
    );
  },
};

export default meta;
