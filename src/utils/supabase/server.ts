"use server";

import { createRetryServerClient } from "./serverRetryClient";

export async function createClient() {
  return createRetryServerClient();
}
