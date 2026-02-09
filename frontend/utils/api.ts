import { AddChildPayload, LoginPayload, SignupPayload } from "./types";

const BASE = "http://192.168.31.17:5000/api"; // LAPTOP IP

async function request(path: string, options: RequestInit = {}) {
  const headers: any = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  });

  return res.json();
}

// ---------- AUTH ----------
export const login = (data: LoginPayload) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const signup = (data: SignupPayload) =>
  request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const addChild = (data: AddChildPayload) =>
  request("/auth/add-child", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ---------- EEG SESSION ----------
export const startSession = (game: string) =>
  request("/session/start", {
    method: "POST",
    body: JSON.stringify({ game }),
  });

export const getLiveInterpreted = () => request("/session/live-interpreted");

export const stopSession = () => request("/session/stop", { method: "POST" });
