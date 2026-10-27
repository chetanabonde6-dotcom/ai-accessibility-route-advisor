import React from 'react';
import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App.jsx';

it('shows the requested branding and a directional route with A/B markers', async () => {
  const user = userEvent.setup(); const {container} = render(<App />);
  expect(screen.getAllByRole('link', {name:'AI Accessibility Route Advisor home'})).toHaveLength(2);
  await user.click(screen.getByRole('button', {name:'Find my route'}));
  expect(screen.getByTestId('highlighted-route').getAttribute('stroke')).toBe('#3d8dff');
  expect(container.querySelector('.map-start-marker')).toBeTruthy();
  await user.click(screen.getByRole('button', {name:'Follow route on second floor'}));
  expect(container.querySelector('.map-end-marker')).toBeTruthy();
  expect(screen.getByLabelText('Route endpoints').textContent).toContain('The food hall');
});

it('follows lift transitions and selected itinerary steps to the correct floor', async () => {
  const user = userEvent.setup(); const {container} = render(<App />);
  await user.click(screen.getByRole('button', {name:'Find my route'}));
  await user.click(screen.getByRole('button', {name:'Take the lift to first floor'}));
  expect(screen.getByRole('button', {name:'View first floor'}).getAttribute('aria-pressed')).toBe('true');
  await user.click(screen.getByRole('button', {name:'Take the lift to second floor'}));
  expect(screen.getByRole('button', {name:'View second floor'}).getAttribute('aria-pressed')).toBe('true');
  const rampStep = screen.getByRole('button', {name:/Show step 2 on map/});
  await user.click(rampStep);
  expect(rampStep.getAttribute('aria-pressed')).toBe('true');
  expect(screen.getByRole('button', {name:'View ground floor'}).getAttribute('aria-pressed')).toBe('true');
  expect(container.querySelector('.selected-route-segment')).toBeTruthy();
});

it('supports zoom, keyboard panning, route fitting and clearing stale route geometry', async () => {
  const user = userEvent.setup(); const {container} = render(<App />);
  await user.click(screen.getByRole('button', {name:'Find my route'}));
  const initial = screen.getByTestId('map-camera').getAttribute('transform');
  await user.click(screen.getByRole('button', {name:'Zoom in on diagram'}));
  expect(screen.getByTestId('map-camera').getAttribute('transform')).not.toBe(initial);
  const map = screen.getByRole('img', {name:/Illustrative Ground floor map/});
  map.focus(); await user.keyboard('{ArrowRight}');
  await user.click(screen.getByRole('button', {name:'Fit route to map'}));
  expect(screen.getByTestId('map-camera').getAttribute('transform')).toBe(initial);
  await user.selectOptions(screen.getByLabelText('DESTINATION'),'cafe');
  expect(container.querySelector('.clear-route-path')).toBeNull();
  expect(container.querySelector('.map-start-marker')).toBeNull();
});
