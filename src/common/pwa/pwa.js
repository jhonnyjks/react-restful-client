import axios from "axios";

const PUSH_FLAG = "autoblaze.pushEnabled";
let deferredPrompt = null;
let swRegistration = null;
let pwaInitialized = false;

function publicUrl(path) {
  const base = (process.env.PUBLIC_URL || "").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

export function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent || "");
}

export function canUsePush() {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function isPushOptedIn() {
  return localStorage.getItem(PUSH_FLAG) === "1";
}

export function canPromptInstall() {
  return !!deferredPrompt;
}

export function initPwa() {
  if (typeof window === "undefined" || pwaInitialized) return;
  pwaInitialized = true;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    window.dispatchEvent(new CustomEvent("pwa-installable"));
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    window.dispatchEvent(new CustomEvent("pwa-installed"));
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register(publicUrl("/sw.js"))
      .then((reg) => {
        swRegistration = reg;
        window.dispatchEvent(new CustomEvent("pwa-sw-ready"));
      })
      .catch((err) => {
        console.warn("SW register failed", err);
      });
  }
}

export async function promptInstall() {
  if (!deferredPrompt) return { ok: false, reason: "unavailable" };
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  deferredPrompt = null;
  window.dispatchEvent(new CustomEvent("pwa-installed"));
  return { ok: choice.outcome === "accepted", reason: choice.outcome };
}

export async function getPushStatus() {
  if (!canUsePush()) {
    return { supported: false, enabled: false, permission: "unsupported" };
  }
  const permission = Notification.permission;
  let subscribed = false;
  try {
    const reg = swRegistration || (await navigator.serviceWorker.ready);
    const sub = await reg.pushManager.getSubscription();
    subscribed = !!sub;
  } catch (e) {
    /* ignore */
  }
  return {
    supported: true,
    enabled: isPushOptedIn() && subscribed && permission === "granted",
    permission,
    subscribed,
  };
}

export async function enablePushNotifications() {
  if (!canUsePush()) {
    throw new Error("Este dispositivo não suporta notificações push.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Permissão de notificação negada.");
  }

  const reg = swRegistration || (await navigator.serviceWorker.ready);
  let vapidRes;
  try {
    vapidRes = await axios.get(
      `${process.env.REACT_APP_API_HOST}/auth/push/vapid-key`
    );
  } catch (err) {
    const msg =
      (err && err.response && err.response.data && err.response.data.message) ||
      (err && err.message) ||
      "Falha ao obter chave VAPID";
    throw new Error(msg);
  }
  const payload = vapidRes && vapidRes.data;
  const publicKey =
    (payload && payload.data && payload.data.publicKey) ||
    (payload && payload.publicKey);
  if (!publicKey || typeof publicKey !== "string") {
    throw new Error(
      "Chave VAPID indisponível no servidor. Confira se a API está acessível."
    );
  }

  let subscription = await reg.pushManager.getSubscription();
  if (!subscription) {
    subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  // Sem isso o servidor não sabe como cifrar: navegadores atuais só aceitam aes128gcm.
  const supported =
    (window.PushManager && window.PushManager.supportedContentEncodings) || [];
  const contentEncoding = supported.indexOf("aes128gcm") > -1
    ? "aes128gcm"
    : supported[0] || "aes128gcm";

  await axios.post(`${process.env.REACT_APP_API_HOST}/auth/push/subscribe`, {
    ...subscription.toJSON(),
    contentEncoding,
  });
  localStorage.setItem(PUSH_FLAG, "1");
  return true;
}

export async function disablePushNotifications() {
  if (!canUsePush()) return false;
  const reg = swRegistration || (await navigator.serviceWorker.ready);
  const subscription = await reg.pushManager.getSubscription();
  if (subscription) {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_HOST}/auth/push/subscribe`,
        { data: { endpoint: subscription.endpoint } }
      );
    } catch (e) {
      /* still unsubscribe locally */
    }
    await subscription.unsubscribe();
  }
  localStorage.removeItem(PUSH_FLAG);
  return true;
}
