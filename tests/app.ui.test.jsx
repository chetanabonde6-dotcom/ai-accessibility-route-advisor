import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App.jsx';
import { STORAGE_KEY, FEEDBACK_KEY } from '../src/lib/storage.js';

describe('the complete project experience in a DOM test environment',()=>{
  it('renders all sections and generates the default step-free route',async()=>{
    const user=userEvent.setup();render(<App/>);
    expect(screen.getByRole('heading',{level:1}).textContent).toContain('For every body.');
    expect(screen.getByRole('navigation',{name:'Main navigation'})).toBeTruthy();
    await user.click(screen.getByRole('button',{name:'Find my route'}));
    expect(screen.getByText('1 sample option found')).toBeTruthy();
    expect(screen.getByText('Step-free in sample')).toBeTruthy();
    expect(screen.getByText(/Start at West entrance/)).toBeTruthy();
    await user.click(screen.getByRole('button',{name:'View second floor'}));
    expect(screen.getByRole('button',{name:'View second floor'}).getAttribute('aria-pressed')).toBe('true');
  });
  it('changes recommendations for walking and invalidates stale results',async()=>{
    const user=userEvent.setup();render(<App/>);
    await user.click(screen.getByRole('button',{name:'Find my route'}));
    await user.click(screen.getByRole('button',{name:'Walking',exact:true}));
    expect(screen.queryByText('1 sample option found')).toBeNull();
    await user.click(screen.getByRole('button',{name:'Find my route'}));
    expect(screen.getByText('3 sample options found')).toBeTruthy();
    expect(screen.getByText('3 stair segments')).toBeTruthy();
    const alternatives=screen.getAllByRole('button',{name:/Alternative/});
    await user.click(alternatives[0]);expect(alternatives[0].getAttribute('aria-pressed')).toBe('true');
  });
  it('reports an unavailable step-free path when the sample lift is disabled',async()=>{
    const user=userEvent.setup();render(<App/>);
    await user.click(screen.getByText('Test a lift outage'));
    await user.click(screen.getByRole('checkbox',{name:'Mark the sample lift unavailable'}));
    await user.click(screen.getByRole('button',{name:'Find my route'}));
    expect(screen.getByRole('heading',{name:'No matching sample route'})).toBeTruthy();
    expect(screen.queryByRole('button',{name:'Download',exact:true})).toBeNull();
  });
  it('saves, restores after remount, and removes a journey',async()=>{
    const user=userEvent.setup();const mounted=render(<App/>);
    await user.click(screen.getByRole('button',{name:'Find my route'}));
    await user.click(screen.getByRole('button',{name:'Save',exact:true}));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toHaveLength(1);
    mounted.unmount();render(<App/>);
    await user.click(screen.getByRole('button',{name:/^Saved/}));
    const dialog=screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button',{name:/West entrance.*The food hall/}));
    expect(screen.getByText('1 sample option found')).toBeTruthy();
    await user.click(screen.getByRole('button',{name:/^Saved/}));
    await user.click(within(dialog).getByRole('button',{name:/Delete saved journey/}));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toHaveLength(0);
    expect(within(dialog).getByText('No journeys saved yet.')).toBeTruthy();
  });
  it('searches the directory, handles no results, and selects a destination',async()=>{
    const user=userEvent.setup();render(<App/>);
    const search=screen.getByRole('searchbox',{name:'Search sample directory'});
    await user.keyboard('/');expect(document.activeElement).toBe(search);
    await user.type(search,'not-a-place');expect(screen.getByText('No matching sample places.')).toBeTruthy();
    await user.click(screen.getByRole('button',{name:'Reset search'}));
    await user.type(search,'lounge');
    expect(screen.getByText('1 sample place matching “lounge”')).toBeTruthy();
    await user.click(screen.getByRole('button',{name:'Plan a route here'}));
    expect(screen.getByLabelText('DESTINATION').value).toBe('lounge');
    await user.click(screen.getByRole('button',{name:'Find my route'}));
    expect(screen.getByText(/Arrive at your destination/)).toBeTruthy();
  });
  it('checks identical endpoints and swaps start and destination',async()=>{
    const user=userEvent.setup();render(<App/>);
    await user.click(screen.getByRole('button',{name:'Swap starting point and destination'}));
    expect(screen.getByLabelText('STARTING POINT').value).toBe('food');
    expect(screen.getByLabelText('DESTINATION').value).toBe('entrance');
    await user.selectOptions(screen.getByLabelText('DESTINATION'),'food');
    await user.click(screen.getByRole('button',{name:'Find my route'}));
    expect(screen.getByRole('heading',{name:'Choose a different destination'})).toBeTruthy();
  });
  it('stores feedback locally with consent and can clear it',async()=>{
    const user=userEvent.setup();render(<App/>);
    await user.type(screen.getByLabelText('YOUR PERSPECTIVE'),'Please add information about pathway width.');
    await user.click(screen.getByRole('checkbox',{name:/Save this note in my browser/}));
    await user.click(screen.getByRole('button',{name:'Save my feedback'}));
    expect(JSON.parse(localStorage.getItem(FEEDBACK_KEY))).toHaveLength(1);
    expect(screen.getByText('Feedback saved on this device. Nothing was sent to the project team.')).toBeTruthy();
    await user.click(screen.getByRole('button',{name:'Clear all local feedback'}));
    expect(JSON.parse(localStorage.getItem(FEEDBACK_KEY))).toHaveLength(0);
  });
  it('toggles the mobile navigation and closes it on Escape',async()=>{
    const user=userEvent.setup();render(<App/>);
    await user.click(screen.getByRole('button',{name:'Open navigation'}));
    expect(screen.getByRole('button',{name:'Close navigation'}).getAttribute('aria-expanded')).toBe('true');
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button',{name:'Open navigation'}).getAttribute('aria-expanded')).toBe('false');
  });
  it('renders safely with damaged saved journey data',()=>{
    localStorage.setItem(STORAGE_KEY,'{bad-json');render(<App/>);
    expect(screen.getByRole('button',{name:/^Saved\s*0$/})).toBeTruthy();
  });
});
