const SAFE_URL_PATTERN =
  /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi;

/** A pattern that matches safe data URLs. It only matches image, video, and audio types. */
const DATA_URL_PATTERN =
  /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\\/]+=*$/i;

export const websitePattern =
  "^(http://|https://)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[a-z]{1}.([-a-z-A-Z-0-9:_+.?/@#%&=]+)?$";

function _sanitizeUrl(url: string): string {
  url = String(url);
  if (url === "null" || url.length === 0 || url === "about:blank")
    return "about:blank";
  if (url.match(SAFE_URL_PATTERN) || url.match(DATA_URL_PATTERN)) return url;

  return `unsafe:${url}`;
}

export function sanitizeUrl(url = "about:blank"): string {
  return _sanitizeUrl(String(url).trim());
}
