import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { BikeListing } from '../BikeListing';
import { BikeDetailPage } from '../../views/BikeDetailPage';
import { INITIAL_BIKES, DEALERSHIP_INFO } from '../../data/dealershipData';
import { BikeSearchDiscovery } from '../BikeSearchDiscovery';
const noop = () => {};

describe('public price policy and search recovery', () => {
  it('shows staff-confirmed negotiable pricing on the catalogue, not sample amounts', () => {
    const html = renderToStaticMarkup(<MemoryRouter><BikeListing bikes={INITIAL_BIKES} onSelectBike={noop} onBookTestRide={noop} /></MemoryRouter>);
    expect(html).toContain('Price on request');
    expect(html).toContain('Negotiable');
    for (const amount of ['1,49,900', '1,79,089', 'Estimated EMI', 'Price: Low to High', 'Under ₹1 Lakh']) expect(html).not.toContain(amount);
  });
  it('does not expose seeded amounts in the detail page or enquiry message', () => {
    const html = renderToStaticMarkup(<MemoryRouter initialEntries={['/bike/bike-re-hunter-350']}><Routes><Route path="/bike/:bikeId" element={<BikeDetailPage bikes={INITIAL_BIKES} dealershipInfo={DEALERSHIP_INFO} onEnquire={noop} onBookTestRide={noop} onBookNow={noop} />} /></Routes></MemoryRouter>);
    expect(html).toContain('Price on request');
    for (const amount of ['1,49,900', '1,79,089', '149900', '179089', 'Estimated Monthly EMI']) expect(html).not.toContain(amount);
  });
  it('keeps useful related bikes and external search links even before a source responds', () => {
    const html = renderToStaticMarkup(<MemoryRouter><BikeSearchDiscovery query="Honda Wingman" bikes={INITIAL_BIKES} noLocalResults /></MemoryRouter>);
    expect(html).toContain('Related showroom bikes');
    expect(html).toContain('Search on Google');
    expect(html).toContain('No exact match');
    expect(html).not.toContain('1,49,900');
  });
});
