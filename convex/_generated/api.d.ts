/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as dietSelectionEngine from "../dietSelectionEngine.js";
import type * as http from "../http.js";
import type * as migrations from "../migrations.js";
import type * as planGeneration from "../planGeneration.js";
import type * as planManagement from "../planManagement.js";
import type * as plans from "../plans.js";
import type * as users from "../users.js";
import type * as workoutSelectionEngine from "../workoutSelectionEngine.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  dietSelectionEngine: typeof dietSelectionEngine;
  http: typeof http;
  migrations: typeof migrations;
  planGeneration: typeof planGeneration;
  planManagement: typeof planManagement;
  plans: typeof plans;
  users: typeof users;
  workoutSelectionEngine: typeof workoutSelectionEngine;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
