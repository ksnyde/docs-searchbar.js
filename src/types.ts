/**
 * Represents the core configuration which would be needed to
 * connect the searchbar to the MeiliSearch server.
 */
export interface SearchBarConfig {
  /** the fully qualified URL to use to get to the MeiliSearch server */
  hostUrl: string;
  /** the API key to use for searches */
  apiKey: string;
  /**
   * the _index_ which will be searched when user enters text.
   */
  index: string;

  /**
   * The property name which is considered the primary key on the index;
   * will default to `id` if not set
   */
  primaryKey?: string;

  debug?: boolean;

  /**
   * You may optionally pass along any key/value pair in the headers of all
   * search requests.
   */
  headers?: Record<string, any>;
}

export interface ExtendedConfig extends SearchBarConfig {
  limit?: number;
  offset?: number;
}

/**
 * a function that allows results/hits prior to be transformed prior
 * to rendered.
 */
export type TransformerFunction = (results: any) => any;

export type IMeilisearchSearchHit<T extends Record<string, any>> = {
  id?: string;
  objectID?: string;
} & T;

export interface IMeilisearchSearchResponse<
  T extends {} = Record<string, any>
> {
  hits: IMeilisearchSearchHit<T>[];
  limit: number;
  nbHits: number;
  offset: number;
  processingTimeMs: number;
  query: string;
}
