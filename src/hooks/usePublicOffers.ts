import { useState, useEffect, useCallback } from 'react';
import {
  getPublicActiveOffers,
  getAnnouncementOffer,
  getHeroOffer,
  getMobileStickyOffer,
  getServicesOffer,
  getConditionsOffer,
  OFFERS_UPDATED_EVENT,
} from '../admin/services/adminStorage';
import type { AdminOffer } from '../admin/types/admin.types';

export function usePublicOffers() {
  const [offers, setOffers] = useState<AdminOffer[]>(() => getPublicActiveOffers());

  const update = useCallback(() => {
    setOffers(getPublicActiveOffers());
  }, []);

  useEffect(() => {
    // Initial fetch
    update();

    // Listen to in-app changes (admin publish/unpublish)
    window.addEventListener(OFFERS_UPDATED_EVENT, update);
    // Listen to multi-tab localStorage events
    window.addEventListener('storage', update);

    // Periodic re-evaluation every 30 seconds to handle scheduled start and expiration
    const interval = setInterval(update, 30000);

    return () => {
      window.removeEventListener(OFFERS_UPDATED_EVENT, update);
      window.removeEventListener('storage', update);
      clearInterval(interval);
    };
  }, [update]);

  return offers;
}

export function useAnnouncementOffer(): AdminOffer | null {
  const [offer, setOffer] = useState<AdminOffer | null>(() => getAnnouncementOffer());

  const update = useCallback(() => {
    setOffer(getAnnouncementOffer());
  }, []);

  useEffect(() => {
    update();
    window.addEventListener(OFFERS_UPDATED_EVENT, update);
    window.addEventListener('storage', update);
    const interval = setInterval(update, 30000);
    return () => {
      window.removeEventListener(OFFERS_UPDATED_EVENT, update);
      window.removeEventListener('storage', update);
      clearInterval(interval);
    };
  }, [update]);

  return offer;
}

export function useHeroOffer(): AdminOffer | null {
  const [offer, setOffer] = useState<AdminOffer | null>(() => getHeroOffer());

  const update = useCallback(() => {
    setOffer(getHeroOffer());
  }, []);

  useEffect(() => {
    update();
    window.addEventListener(OFFERS_UPDATED_EVENT, update);
    window.addEventListener('storage', update);
    const interval = setInterval(update, 30000);
    return () => {
      window.removeEventListener(OFFERS_UPDATED_EVENT, update);
      window.removeEventListener('storage', update);
      clearInterval(interval);
    };
  }, [update]);

  return offer;
}

export function useMobileStickyOffer(): AdminOffer | null {
  const [offer, setOffer] = useState<AdminOffer | null>(() => getMobileStickyOffer());

  const update = useCallback(() => {
    setOffer(getMobileStickyOffer());
  }, []);

  useEffect(() => {
    update();
    window.addEventListener(OFFERS_UPDATED_EVENT, update);
    window.addEventListener('storage', update);
    const interval = setInterval(update, 30000);
    return () => {
      window.removeEventListener(OFFERS_UPDATED_EVENT, update);
      window.removeEventListener('storage', update);
      clearInterval(interval);
    };
  }, [update]);

  return offer;
}

export function useServicesOffer(): AdminOffer | null {
  const [offer, setOffer] = useState<AdminOffer | null>(() => getServicesOffer());

  const update = useCallback(() => {
    setOffer(getServicesOffer());
  }, []);

  useEffect(() => {
    update();
    window.addEventListener(OFFERS_UPDATED_EVENT, update);
    window.addEventListener('storage', update);
    const interval = setInterval(update, 30000);
    return () => {
      window.removeEventListener(OFFERS_UPDATED_EVENT, update);
      window.removeEventListener('storage', update);
      clearInterval(interval);
    };
  }, [update]);

  return offer;
}

export function useConditionsOffer(): AdminOffer | null {
  const [offer, setOffer] = useState<AdminOffer | null>(() => getConditionsOffer());

  const update = useCallback(() => {
    setOffer(getConditionsOffer());
  }, []);

  useEffect(() => {
    update();
    window.addEventListener(OFFERS_UPDATED_EVENT, update);
    window.addEventListener('storage', update);
    const interval = setInterval(update, 30000);
    return () => {
      window.removeEventListener(OFFERS_UPDATED_EVENT, update);
      window.removeEventListener('storage', update);
      clearInterval(interval);
    };
  }, [update]);

  return offer;
}
