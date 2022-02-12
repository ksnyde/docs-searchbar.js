/**
 * Represents the core configuration which would be needed to
 * connect the searchbar to the MeiliSearch server.
 */
export interface SearchBarConfig {
  /** the fully qualified URL to use to get to the MeiliSearch server */
  hostUrl: string;
  /** the API key to use for searches */
  apiKey: string | undefined;
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
  /** the property in the document which will be displayed as the TITLE */
  title?: string | string[];
  /** the property in the document which will be displayed as the SUB HEADING */
  subHeading?: string | string[];
  /**
   * a property which will be displayed in smaller font size and below the
   * top line which has the title and sub-heading.
   */
  description?: string | string[];
  /**
   * The length at which the description should be trucated
   */
  descLength?: number;

  /** can add a separator character such as `|` between "title" and "subHeading" */
  separator?: string;

  sections?: string | string[];
  subSections?: string | string[];

  /** the maximum number of search "hits" allowed before pagination */
  limit?: number;
  offset?: number;
  /**
   * this attribute indicates that the results should be presented in
   * groups and using the property name in this field to determine which
   * to group on.
   */
  groupBy?: string;
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
