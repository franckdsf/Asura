// import SanityConfig from './sanity-studio/sanity.config';
// import SanityCli from './sanity-studio/sanity.cli';
import { createClient, type ClientConfig } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import groq from 'groq';

export const PROJECT_ID = '1wepk4uu';
export const DATASET = 'production';

const config: ClientConfig = {
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2023-05-03',
  useCdn: true,
}

const client = createClient(config);
const builder = () => imageUrlBuilder(client);

const loadQuery = (query: string) => client.fetch(query);
const urlFor = (source: string) => builder().image(source);

export { groq, client, urlFor, loadQuery };