export const EXTENSIONS_LEGAL_BASE_URL =
  'https://extensions.yosefhayimsabag.com/legal';

export const portfolioProductFacts = [
  {
    id: 'prompt-queue',
    pagePath: '/prompt-queue',
    staticFile: 'prompt-queue/index.html',
    legalSlug: 'batchbeam-prompt-queue',
    legal: {
      privacy: [
        '/prompt-queue/privacy',
        '/prompt-queue/privacy/',
        '/promptqueue-privacy',
        '/promptqueue-privacy.html',
      ],
      terms: [
        '/prompt-queue/terms',
        '/prompt-queue/terms/',
        '/promptqueue-terms',
        '/promptqueue-terms.html',
      ],
    },
  },
  {
    id: 'quick-apply',
    pagePath: '/quick-apply',
  },
  {
    id: 'sorqa',
    pagePath: '/sorqa',
    staticFile: 'sorqa/index.html',
    legalSlug: 'scenequeue-sora',
    legal: {
      privacy: [
        '/sorqa/privacy',
        '/sorqa/privacy/',
        '/sorqa-privacy',
        '/sorqa-privacy.html',
      ],
      terms: [
        '/sorqa/terms',
        '/sorqa/terms/',
        '/sorqa-terms',
        '/sorqa-terms.html',
      ],
    },
  },
  {
    id: 'audio-transcriber',
    legalSlug: 'sidescribe-audio-transcriber',
    legal: {
      privacy: [
        '/audio-transcriber/privacy',
        '/audio-transcriber/privacy/',
        '/audio-transcriber-privacy',
        '/audio-transcriber-privacy.html',
      ],
    },
  },
  {
    id: 'jts',
    pagePath: '/jts',
    staticFile: 'jts/index.html',
  },
];

const API_WORKER_FIRST_ROUTES = ['/api/*', '/health'];

const createLegalRouteEntries = (product) => {
  if (!product.legalSlug || !product.legal) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(product.legal).map(([kind, paths]) => [
      kind,
      {
        target: `${EXTENSIONS_LEGAL_BASE_URL}/${product.legalSlug}/${kind}`,
        paths,
      },
    ]),
  );
};

const createLegalRedirectEntries = (routes) => {
  const entries = [];

  for (const product of routes) {
    for (const entry of Object.values(product.legal)) {
      for (const path of entry.paths) {
        entries.push([path, entry.target]);
      }
    }
  }

  return entries;
};

const createStaticPageEntries = (routes) => {
  const entries = [];

  for (const product of routes) {
    if (!product.staticFile) {
      continue;
    }

    for (const path of product.pagePaths) {
      entries.push([path, product.staticFile]);
    }
  }

  return entries;
};

export const productRoutes = portfolioProductFacts.map((product) => ({
  id: product.id,
  pagePaths: product.pagePath ? [product.pagePath, `${product.pagePath}/`] : [],
  staticFile: product.staticFile,
  legal: createLegalRouteEntries(product),
}));

const legalRedirects = new Map(createLegalRedirectEntries(productRoutes));

const staticPages = new Map(createStaticPageEntries(productRoutes));

export const getPortfolioProductFact = (id) =>
  portfolioProductFacts.find((product) => product.id === id);

export const requirePortfolioProductFact = (id) => {
  const product = getPortfolioProductFact(id);
  if (!product) {
    throw new Error(`Unknown portfolio product: ${id}`);
  }

  return product;
};

export const findExtensionLegalRedirect = (pathname) => {
  const redirect = legalRedirects.get(pathname);
  return redirect === undefined ? null : redirect;
};

export const findStaticProductPage = (pathname) => {
  const staticPage = staticPages.get(pathname);
  return staticPage === undefined ? null : staticPage;
};

export const getStaticProductPageRoutes = () => [...staticPages.keys()];

export const getExtensionLegalRedirectRoutes = () => [...legalRedirects.keys()];

export const getWorkerFirstRoutes = () => [
    ...API_WORKER_FIRST_ROUTES,
    ...getStaticProductPageRoutes(),
    ...getExtensionLegalRedirectRoutes(),
  ];
