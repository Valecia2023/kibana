/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { schema, TypeOf } from '@kbn/config-schema';
import type { PluginConfigDescriptor, PluginInitializerContext } from '@kbn/core/server';
import { ProfilingPlugin } from './plugin';

const packageInputSchema = schema.object({
  host: schema.maybe(schema.string()),
  secret_token: schema.maybe(schema.string()),
  tls_enabled: schema.maybe(schema.boolean()),
  tls_supported_protocols: schema.maybe(schema.arrayOf(schema.string())),
  tls_certificate_path: schema.maybe(schema.string()),
  tls_key_path: schema.maybe(schema.string()),
});

const configSchema = schema.object({
  enabled: schema.boolean({ defaultValue: false }),
  symbolizer: schema.maybe(packageInputSchema),
  collector: schema.maybe(packageInputSchema),
  elasticsearch: schema.maybe(
    schema.object({
      hosts: schema.string(),
      username: schema.string(),
      password: schema.string(),
    })
  ),
});

export type ProfilingConfig = TypeOf<typeof configSchema>;
export type PackageInputType = TypeOf<typeof packageInputSchema>;

// plugin config
export const config: PluginConfigDescriptor<ProfilingConfig> = {
  schema: configSchema,
};

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new ProfilingPlugin(initializerContext);
}

export type { ProfilingPluginSetup, ProfilingPluginStart } from './types';
