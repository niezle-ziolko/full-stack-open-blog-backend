export async function query(env, sql, params = []) {
  return await env.D1.prepare(sql).bind(...params).all();
};

export async function run(env, sql, params = []) {
  return await env.D1.prepare(sql).bind(...params).run();
};