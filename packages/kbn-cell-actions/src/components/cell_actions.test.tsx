/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { act, render } from '@testing-library/react';
import React from 'react';
import { CellActions } from './cell_actions';
import { CellActionsMode } from '../constants';
import { CellActionsProvider } from '../context/cell_actions_context';

const TRIGGER_ID = 'test-trigger-id';
const FIELD = { name: 'name', value: '123', type: 'text' };

jest.mock('./hover_actions_popover', () => ({
  HoverActionsPopover: jest.fn((props) => (
    <span data-test-subj="hoverActionsPopover">{props.anchorPosition}</span>
  )),
}));
describe('CellActions', () => {
  it('renders', async () => {
    const getActionsPromise = Promise.resolve([]);
    const getActions = () => getActionsPromise;

    const { queryByTestId } = render(
      <CellActionsProvider getTriggerCompatibleActions={getActions}>
        <CellActions mode={CellActionsMode.INLINE} triggerId={TRIGGER_ID} field={FIELD}>
          Field value
        </CellActions>
      </CellActionsProvider>
    );

    await act(async () => {
      await getActionsPromise;
    });

    expect(queryByTestId(`cellActions-renderContent-${FIELD.name}`)).toBeInTheDocument();
  });

  it('renders InlineActions when mode is INLINE', async () => {
    const getActionsPromise = Promise.resolve([]);
    const getActions = () => getActionsPromise;

    const { queryByTestId } = render(
      <CellActionsProvider getTriggerCompatibleActions={getActions}>
        <CellActions mode={CellActionsMode.INLINE} triggerId={TRIGGER_ID} field={FIELD}>
          Field value
        </CellActions>
      </CellActionsProvider>
    );

    await act(async () => {
      await getActionsPromise;
    });

    expect(queryByTestId('inlineActions')).toBeInTheDocument();
  });

  it('renders HoverActionsPopover when mode is HOVER_DOWN', async () => {
    const getActionsPromise = Promise.resolve([]);
    const getActions = () => getActionsPromise;

    const { getByTestId } = render(
      <CellActionsProvider getTriggerCompatibleActions={getActions}>
        <CellActions mode={CellActionsMode.HOVER_DOWN} triggerId={TRIGGER_ID} field={FIELD}>
          Field value
        </CellActions>
      </CellActionsProvider>
    );

    await act(async () => {
      await getActionsPromise;
    });

    expect(getByTestId('hoverActionsPopover')).toBeInTheDocument();
    expect(getByTestId('hoverActionsPopover')).toHaveTextContent('downCenter');
  });

  it('renders HoverActionsPopover when mode is HOVER_RIGHT', async () => {
    const getActionsPromise = Promise.resolve([]);
    const getActions = () => getActionsPromise;

    const { getByTestId } = render(
      <CellActionsProvider getTriggerCompatibleActions={getActions}>
        <CellActions mode={CellActionsMode.HOVER_RIGHT} triggerId={TRIGGER_ID} field={FIELD}>
          Field value
        </CellActions>
      </CellActionsProvider>
    );

    await act(async () => {
      await getActionsPromise;
    });

    expect(getByTestId('hoverActionsPopover')).toBeInTheDocument();
    expect(getByTestId('hoverActionsPopover')).toHaveTextContent('rightCenter');
  });
});
