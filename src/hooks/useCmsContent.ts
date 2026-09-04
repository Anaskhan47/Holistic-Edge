import { useState, useEffect, useCallback } from 'react';
import {
  getPublishedServices,
  getPublishedServiceBySlug,
  getPublishedConditions,
  getPublishedConditionBySlug,
  getPublishedFaqs,
  getPublishedTeam,
  getPublishedClinic,
  CMS_UPDATED_EVENT,
  type AdminServiceCms,
  type AdminConditionCms,
  type AdminFaqCms,
  type AdminTeamCms,
  type AdminClinicCms,
} from '../admin/services/cmsStorage';

export function usePublishedServices(): AdminServiceCms[] {
  const [services, setServices] = useState<AdminServiceCms[]>(() => getPublishedServices());

  const update = useCallback(() => {
    setServices(getPublishedServices());
  }, []);

  useEffect(() => {
    update();
    window.addEventListener(CMS_UPDATED_EVENT, update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener(CMS_UPDATED_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, [update]);

  return services;
}

export function usePublishedService(slug: string): AdminServiceCms | null {
  const [service, setService] = useState<AdminServiceCms | null>(() =>
    slug ? getPublishedServiceBySlug(slug) : null
  );

  const update = useCallback(() => {
    if (slug) {
      setService(getPublishedServiceBySlug(slug));
    }
  }, [slug]);

  useEffect(() => {
    update();
    window.addEventListener(CMS_UPDATED_EVENT, update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener(CMS_UPDATED_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, [slug, update]);

  return service;
}

export function usePublishedConditions(): AdminConditionCms[] {
  const [conditions, setConditions] = useState<AdminConditionCms[]>(() => getPublishedConditions());

  const update = useCallback(() => {
    setConditions(getPublishedConditions());
  }, []);

  useEffect(() => {
    update();
    window.addEventListener(CMS_UPDATED_EVENT, update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener(CMS_UPDATED_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, [update]);

  return conditions;
}

export function usePublishedCondition(slug: string): AdminConditionCms | null {
  const [condition, setCondition] = useState<AdminConditionCms | null>(() =>
    slug ? getPublishedConditionBySlug(slug) : null
  );

  const update = useCallback(() => {
    if (slug) {
      setCondition(getPublishedConditionBySlug(slug));
    }
  }, [slug]);

  useEffect(() => {
    update();
    window.addEventListener(CMS_UPDATED_EVENT, update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener(CMS_UPDATED_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, [slug, update]);

  return condition;
}

export function usePublishedFaqs(): AdminFaqCms[] {
  const [faqs, setFaqs] = useState<AdminFaqCms[]>(() => getPublishedFaqs());

  const update = useCallback(() => {
    setFaqs(getPublishedFaqs());
  }, []);

  useEffect(() => {
    update();
    window.addEventListener(CMS_UPDATED_EVENT, update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener(CMS_UPDATED_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, [update]);

  return faqs;
}

export function usePublishedTeam(): AdminTeamCms[] {
  const [team, setTeam] = useState<AdminTeamCms[]>(() => getPublishedTeam());

  const update = useCallback(() => {
    setTeam(getPublishedTeam());
  }, []);

  useEffect(() => {
    update();
    window.addEventListener(CMS_UPDATED_EVENT, update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener(CMS_UPDATED_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, [update]);

  return team;
}

export function usePublishedClinic(): AdminClinicCms {
  const [clinic, setClinic] = useState<AdminClinicCms>(() => getPublishedClinic());

  const update = useCallback(() => {
    setClinic(getPublishedClinic());
  }, []);

  useEffect(() => {
    update();
    window.addEventListener(CMS_UPDATED_EVENT, update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener(CMS_UPDATED_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, [update]);

  return clinic;
}
