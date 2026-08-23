import { httpClient } from './httpClient';

export type LinkPreview = {
  url: string;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  siteName?: string | null;
  domain: string;
};

type LinkPreviewResponse = {
  url: string;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  site_name?: string | null;
  domain: string;
};

export async function fetchLinkPreview(url: string): Promise<LinkPreview> {
  const { data } = await httpClient.get<LinkPreviewResponse>('/link-preview', {
    params: { url },
  });

  return {
    url: data.url,
    title: data.title,
    description: data.description,
    image: data.image,
    siteName: data.site_name,
    domain: data.domain,
  };
}

const URL_REGEX = /https?:\/\/[^\s<>"']+/gi;

export function extractFirstUrl(text: string): string | null {
  const match = text.match(URL_REGEX);
  if (!match?.[0]) {
    return null;
  }

  return match[0].replace(/[),.]+$/g, '');
}
