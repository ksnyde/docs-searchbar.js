import { IMeilisearchSearchResponse, SearchBarConfig } from "~/types";

const headers = (c: SearchBarConfig) => ({
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  Authorization: `Bearer ${c.apiKey}`,
  "X-Meili-API-Key": c.apiKey,
});

export const get =
  (config: SearchBarConfig) =>
  async <T extends {}, U extends {} = never>(url: string, cb?: (r: T) => U) => {
    url = `${config.hostUrl.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;

    const res = await fetch(url, {
      headers: headers(config),
    });
    if (res.ok) {
      const result = res.json();

      return (
        cb ? (result.then((r) => cb(r)) as Promise<U>) : (result as Promise<T>)
      ) as never extends U ? Promise<T> : Promise<U>;
    } else {
      console.groupCollapsed(`Error with API`);
      console.info(`Request [${config.apiKey}]: GET ${url}`);
      console.warn(`Error [${res.status}]: ${res.statusText}`);
      console.groupEnd();
    }
  };

export const post =
  (config: SearchBarConfig) =>
  async <T extends {}, U extends {} = never>(
    url: string,
    body: string,
    cb?: (r: T) => U
  ) => {
    url = `${config.hostUrl.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
    const res = await fetch(url, {
      method: "post",
      body,
      headers: headers(config),
    });
    if (res.ok) {
      const result = res.json();

      return (
        cb ? (result.then((r) => cb(r)) as Promise<U>) : (result as Promise<T>)
      ) as never extends U ? Promise<T> : Promise<U>;
    } else {
      console.groupCollapsed(`Error with API`);
      console.info(`Request [${config.apiKey}]: POST ${url}`);
      console.warn(`Error [${res.status}]: ${res.statusText}`);
      console.groupEnd();
    }
  };

export const search = (config: SearchBarConfig) => {
  return async (text: string) => {
    // for (const idx of config.indexes) {
    //   waitFor.push(
    //     post(config)(`/indexes/${idx}/search`, JSON.stringify({ q: text }))
    //   );
    // }
    const query = post(config);
    const results = await query(
      `/indexes/${config.index}/search`,
      JSON.stringify({ q: text })
    );

    return results as IMeilisearchSearchResponse;
  };
};
