Object.assign(globalThis, {
  DeckyBackend: {
    callable: () => () => undefined,
  },
});

const [{ PluginLoadType }, { loadPlugin }] = await Promise.all([
  import('../../src/plugin'),
  import('../../src/plugin-importer'),
]);

const quickAccess = document.querySelector<HTMLElement>('#quick-access')!;
const deckyPanel = document.querySelector<HTMLElement>('#decky-panel')!;
const status = document.querySelector<HTMLElement>('#status')!;

document.querySelector('#open-quick-access')!.addEventListener('click', () => {
  quickAccess.hidden = false;
});

document.querySelector('#open-decky')!.addEventListener('click', () => {
  deckyPanel.hidden = false;
});

const importLegacyPlugin = async (fetchImplementation: typeof fetch, timeoutMS?: number) => {
  return loadPlugin(
    {
      name: 'Sample Plugin',
      version: '1.0.0',
      loadType: PluginLoadType.LEGACY_EVAL_IIFE,
      timeoutMS,
    },
    new Error('Sample Plugin timed out'),
    {
      authToken: 'acceptance-token',
      createLegacyPluginAPI: () => ({ source: 'steam-shell' }),
      fetch: fetchImplementation,
      importESModule: async () => {
        throw new Error('Unexpected ES module import');
      },
    },
  );
};

document.querySelector('#load-plugin')!.addEventListener('click', async () => {
  status.textContent = 'Loading';
  const plugin = await importLegacyPlugin(async () => {
    return new Response('(api) => ({ name: "Sample Plugin", icon: null, api })', { status: 200 });
  });
  status.textContent = `${plugin.name} loaded from ${(plugin as any).api.source}`;
});

document.querySelector('#load-slow-plugin')!.addEventListener('click', async () => {
  status.textContent = 'Loading';
  try {
    await importLegacyPlugin((_url, init) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
      });
    }, 25);
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : String(error);
  }
});

document.querySelector('#load-aborted-plugin')!.addEventListener('click', async () => {
  status.textContent = 'Loading';
  const externalAbort = new DOMException('User cancelled transport', 'AbortError');
  try {
    await importLegacyPlugin(async () => {
      throw externalAbort;
    });
  } catch (error) {
    status.textContent = error === externalAbort ? 'External abort preserved' : 'Abort was misclassified';
  }
});
