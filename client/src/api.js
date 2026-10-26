const configuredBase = import.meta.env.VITE_API_BASE_URL;
const defaultBase = import.meta.env.DEV ? 'http://localhost:5000' : '';
const BASE = (configuredBase ?? defaultBase).replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

function sid() {
  let id = localStorage.getItem('mr-session');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('mr-session', id);
  }
  return id;
}

async function req(path, opts = {}) {
  let response;
  try {
    response = await fetch(BASE + path, {
      ...opts,
      signal: opts.signal ?? AbortSignal.timeout(110_000),
      headers: { 'Content-Type': 'application/json', 'X-Session-Id': sid(), ...opts.headers },
    });
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      throw Error('The request took too long. Please wait a moment and try again.');
    }
    throw error;
  }

  let body;
  try {
    body = await response.json();
  } catch {
    throw Error(`The server returned an unreadable response (${response.status}). Please try again.`);
  }
  if (!response.ok || !body.success) throw Error(body.error?.message || 'Request failed');
  return body.data;
}

export const api = {
  create: body => req('/api/cases', { method: 'POST', body: JSON.stringify({ premise: body.scenario, difficulty: body.difficulty, category: body.category, suspectCount: body.suspectCount }) }),
  get: id => req(`/api/cases/${id}`),
  list: () => req('/api/cases'),
  discover: (id, clueId) => req(`/api/cases/${id}/clues/${clueId}/discover`, { method: 'POST', body: '{}' }),
  hint: id => req(`/api/cases/${id}/hints`, { method: 'POST', body: '{}' }),
  result: id => req(`/api/cases/${id}/result`),
  progress: (id, body) => req(`/api/v1/mysteries/${id}/progress`, { method: 'PUT', body: JSON.stringify(body) }),
  accuse: (id, suspectId) => req(`/api/cases/${id}/accuse`, { method: 'POST', body: JSON.stringify({ suspectId }) }),
  remove: id => req(`/api/v1/mysteries/${id}`, { method: 'DELETE' }),
};
