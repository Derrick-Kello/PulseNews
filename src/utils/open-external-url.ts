import * as WebBrowser from "expo-web-browser";
import { Linking } from "react-native";

import { normalizeHttpUrl } from "@/src/utils/url-validation";

export interface OpenUrlResult {
  ok: boolean;
  /** User-visible explanation when ok is false */
  message?: string;
}

/**
 * Opens an article URL in the in-app browser, then falls back to the system browser.
 * Errors are returned (never thrown) so the UI can show recovery actions.
 */
export async function openArticleInBrowser(rawUrl: string): Promise<OpenUrlResult> {
  const href = normalizeHttpUrl(rawUrl);
  if (!href) {
    return { ok: false, message: "This article doesn’t have a valid web address." };
  }

  try {
    await WebBrowser.openBrowserAsync(href, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
    });
    return { ok: true };
  } catch {
    try {
      await Linking.openURL(href);
      return { ok: true };
    } catch {
      return {
        ok: false,
        message:
          "This preview build couldn’t open the page (common with Expo Go). Use Copy link or Share to open it in Safari or Chrome.",
      };
    }
  }
}
