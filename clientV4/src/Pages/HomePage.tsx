import { lazy, Suspense } from 'react';
import { ConstellationHero } from '@/Components/ConstellationHero';
import { DeferMount } from '@/Components/DeferMount';
import { IdleMount } from '@/Components/IdleMount';
import { SiteHeader } from '@/Components/SiteHeader';

const ManifestoSection = lazy(async () => {
  const module = await import('@/Components/ManifestoSection');
  return { default: module.ManifestoSection };
});
const YearStamp = lazy(async () => {
  const module = await import('@/Components/YearStamp');
  return { default: module.YearStamp };
});
const ServicesSection = lazy(async () => {
  const module = await import('@/Components/ServicesSection');
  return { default: module.ServicesSection };
});
const ProjectTheater = lazy(async () => {
  const module = await import('@/Components/ProjectTheater');
  return { default: module.ProjectTheater };
});
const TechStackSection = lazy(async () => {
  const module = await import('@/Components/TechStackSection');
  return { default: module.TechStackSection };
});
const ProcessSection = lazy(async () => {
  const module = await import('@/Components/ProcessSection');
  return { default: module.ProcessSection };
});
const BlogSection = lazy(async () => {
  const module = await import('@/Components/BlogSection');
  return { default: module.BlogSection };
});
const StudioSection = lazy(async () => {
  const module = await import('@/Components/StudioSection');
  return { default: module.StudioSection };
});
const ContactSection = lazy(async () => {
  const module = await import('@/Components/ContactSection');
  return { default: module.ContactSection };
});
const SiteFooter = lazy(async () => {
  const module = await import('@/Components/SiteFooter');
  return { default: module.SiteFooter };
});
const BottomChrome = lazy(async () => {
  const module = await import('@/Components/BottomChrome');
  return { default: module.BottomChrome };
});

const SectionFallback = ({ height = 360 }: { height?: number }) => (
  <div aria-hidden="true" className="w-full bg-void" style={{ minHeight: height }} />
);

export const HomePage = () => (
  <div className="bg-void text-ink" id="top">
    <SiteHeader />
    <main>
      <ConstellationHero />

      <DeferMount minHeight={280} rootMargin="40px 0px">
        <Suspense fallback={<SectionFallback height={280} />}>
          <ManifestoSection />
        </Suspense>
      </DeferMount>

      <DeferMount minHeight={220}>
        <Suspense fallback={<SectionFallback height={220} />}>
          <YearStamp />
        </Suspense>
      </DeferMount>

      <DeferMount minHeight={520}>
        <Suspense fallback={<SectionFallback height={520} />}>
          <ServicesSection />
        </Suspense>
      </DeferMount>

      <DeferMount minHeight={640}>
        <Suspense fallback={<SectionFallback height={640} />}>
          <ProjectTheater />
        </Suspense>
      </DeferMount>

      <DeferMount minHeight={480}>
        <Suspense fallback={<SectionFallback height={480} />}>
          <TechStackSection />
        </Suspense>
      </DeferMount>

      <DeferMount minHeight={420}>
        <Suspense fallback={<SectionFallback height={420} />}>
          <ProcessSection />
        </Suspense>
      </DeferMount>

      <DeferMount minHeight={520}>
        <Suspense fallback={<SectionFallback height={520} />}>
          <BlogSection />
        </Suspense>
      </DeferMount>

      <DeferMount minHeight={420}>
        <Suspense fallback={<SectionFallback height={420} />}>
          <StudioSection />
        </Suspense>
      </DeferMount>

      <DeferMount minHeight={480}>
        <Suspense fallback={<SectionFallback height={480} />}>
          <ContactSection />
        </Suspense>
      </DeferMount>
    </main>

    <DeferMount minHeight={200} rootMargin="400px 0px">
      <Suspense fallback={<SectionFallback height={200} />}>
        <SiteFooter />
      </Suspense>
    </DeferMount>

    <IdleMount timeoutMs={2000}>
      <Suspense fallback={null}>
        <BottomChrome />
      </Suspense>
    </IdleMount>
  </div>
);
