--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'GraphQL support';


--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;


--
-- Name: EXTENSION pgjwt; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgjwt IS 'JSON Web Token API for Postgresql';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  	coalesce(
		nullif(current_setting('request.jwt.claim.email', true), ''),
		(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
	)::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  	coalesce(
		nullif(current_setting('request.jwt.claim.role', true), ''),
		(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
	)::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  	coalesce(
		nullif(current_setting('request.jwt.claim.sub', true), ''),
		(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
	)::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN

        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

		-- This hook executes when `graphql.resolve` is created. That is not necessarily the last
		-- function in the extension so we need to grant permissions on existing entities AND
		-- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
		alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_event_trigger_ddl_commands() AS ev
        JOIN pg_extension AS ext
        ON ev.objid = ext.oid
        WHERE ext.extname = 'pg_net'
    )
    THEN
        IF NOT EXISTS (
        SELECT 1
        FROM pg_roles
        WHERE rolname = 'supabase_functions_admin'
        )
        THEN
        CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
        END IF;

        GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

        ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
        ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
        ALTER function net.http_collect_response(request_id bigint, async boolean) SECURITY DEFINER;

        ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
        ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
        ALTER function net.http_collect_response(request_id bigint, async boolean) SET search_path = net;

        REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
        REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
        REVOKE ALL ON FUNCTION net.http_collect_response(request_id bigint, async boolean) FROM PUBLIC;

        GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
        GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
        GRANT EXECUTE ON FUNCTION net.http_collect_response(request_id bigint, async boolean) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
    END;
    $$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: postgres
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RAISE WARNING 'PgBouncer auth request: %', p_usename;

    RETURN QUERY
    SELECT usename::TEXT, passwd::TEXT FROM pg_catalog.pg_shadow
    WHERE usename = p_usename;
END;
$$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
      declare
          -- Regclass of the table e.g. public.notes
          entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

          -- I, U, D, T: insert, update ...
          action realtime.action = (
              case wal ->> 'action'
                  when 'I' then 'INSERT'
                  when 'U' then 'UPDATE'
                  when 'D' then 'DELETE'
                  else 'ERROR'
              end
          );

          -- Is row level security enabled for the table
          is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

          subscriptions realtime.subscription[] = array_agg(subs)
              from
                  realtime.subscription subs
              where
                  subs.entity = entity_;

          -- Subscription vars
          roles regrole[] = array_agg(distinct us.claims_role)
              from
                  unnest(subscriptions) us;

          working_role regrole;
          claimed_role regrole;
          claims jsonb;

          subscription_id uuid;
          subscription_has_access bool;
          visible_to_subscription_ids uuid[] = '{}';

          -- structured info for wal's columns
          columns realtime.wal_column[];
          -- previous identity values for update/delete
          old_columns realtime.wal_column[];

          error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

          -- Primary jsonb output for record
          output jsonb;

      begin
          perform set_config('role', null, true);

          columns =
              array_agg(
                  (
                      x->>'name',
                      x->>'type',
                      x->>'typeoid',
                      realtime.cast(
                          (x->'value') #>> '{}',
                          coalesce(
                              (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                              (x->>'type')::regtype
                          )
                      ),
                      (pks ->> 'name') is not null,
                      true
                  )::realtime.wal_column
              )
              from
                  jsonb_array_elements(wal -> 'columns') x
                  left join jsonb_array_elements(wal -> 'pk') pks
                      on (x ->> 'name') = (pks ->> 'name');

          old_columns =
              array_agg(
                  (
                      x->>'name',
                      x->>'type',
                      x->>'typeoid',
                      realtime.cast(
                          (x->'value') #>> '{}',
                          coalesce(
                              (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                              (x->>'type')::regtype
                          )
                      ),
                      (pks ->> 'name') is not null,
                      true
                  )::realtime.wal_column
              )
              from
                  jsonb_array_elements(wal -> 'identity') x
                  left join jsonb_array_elements(wal -> 'pk') pks
                      on (x ->> 'name') = (pks ->> 'name');

          for working_role in select * from unnest(roles) loop

              -- Update `is_selectable` for columns and old_columns
              columns =
                  array_agg(
                      (
                          c.name,
                          c.type_name,
                          c.type_oid,
                          c.value,
                          c.is_pkey,
                          pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                      )::realtime.wal_column
                  )
                  from
                      unnest(columns) c;

              old_columns =
                      array_agg(
                          (
                              c.name,
                              c.type_name,
                              c.type_oid,
                              c.value,
                              c.is_pkey,
                              pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                          )::realtime.wal_column
                      )
                      from
                          unnest(old_columns) c;

              if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
                  return next (
                      jsonb_build_object(
                          'schema', wal ->> 'schema',
                          'table', wal ->> 'table',
                          'type', action
                      ),
                      is_rls_enabled,
                      -- subscriptions is already filtered by entity
                      (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
                      array['Error 400: Bad Request, no primary key']
                  )::realtime.wal_rls;

              -- The claims role does not have SELECT permission to the primary key of entity
              elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
                  return next (
                      jsonb_build_object(
                          'schema', wal ->> 'schema',
                          'table', wal ->> 'table',
                          'type', action
                      ),
                      is_rls_enabled,
                      (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
                      array['Error 401: Unauthorized']
                  )::realtime.wal_rls;

              else
                  output = jsonb_build_object(
                      'schema', wal ->> 'schema',
                      'table', wal ->> 'table',
                      'type', action,
                      'commit_timestamp', to_char(
                          (wal ->> 'timestamp')::timestamptz,
                          'YYYY-MM-DD"T"HH24:MI:SS"Z"'
                      ),
                      'columns', (
                          select
                              jsonb_agg(
                                  jsonb_build_object(
                                      'name', pa.attname,
                                      'type', pt.typname
                                  )
                                  order by pa.attnum asc
                              )
                          from
                              pg_attribute pa
                              join pg_type pt
                                  on pa.atttypid = pt.oid
                          where
                              attrelid = entity_
                              and attnum > 0
                              and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
                      )
                  )
                  -- Add "record" key for insert and update
                  || case
                      when action in ('INSERT', 'UPDATE') then
                          case
                              when error_record_exceeds_max_size then
                                  jsonb_build_object(
                                      'record',
                                      (
                                          select jsonb_object_agg((c).name, (c).value)
                                          from unnest(columns) c
                                          where (c).is_selectable and (octet_length((c).value::text) <= 64)
                                      )
                                  )
                              else
                                  jsonb_build_object(
                                      'record',
                                      (select jsonb_object_agg((c).name, (c).value) from unnest(columns) c where (c).is_selectable)
                                  )
                          end
                      else '{}'::jsonb
                  end
                  -- Add "old_record" key for update and delete
                  || case
                      when action in ('UPDATE', 'DELETE') then
                          case
                              when error_record_exceeds_max_size then
                                  jsonb_build_object(
                                      'old_record',
                                      (
                                          select jsonb_object_agg((c).name, (c).value)
                                          from unnest(old_columns) c
                                          where (c).is_selectable and (octet_length((c).value::text) <= 64)
                                      )
                                  )
                              else
                                  jsonb_build_object(
                                      'old_record',
                                      (select jsonb_object_agg((c).name, (c).value) from unnest(old_columns) c where (c).is_selectable)
                                  )
                          end
                      else '{}'::jsonb
                  end;

                  -- Create the prepared statement
                  if is_rls_enabled and action <> 'DELETE' then
                      if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                          deallocate walrus_rls_stmt;
                      end if;
                      execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
                  end if;

                  visible_to_subscription_ids = '{}';

                  for subscription_id, claims in (
                          select
                              subs.subscription_id,
                              subs.claims
                          from
                              unnest(subscriptions) subs
                          where
                              subs.entity = entity_
                              and subs.claims_role = working_role
                              and realtime.is_visible_through_filters(columns, subs.filters)
                  ) loop

                      if not is_rls_enabled or action = 'DELETE' then
                          visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                      else
                          -- Check if RLS allows the role to see the record
                          perform
                              set_config('role', working_role::text, true),
                              set_config('request.jwt.claims', claims::text, true);

                          execute 'execute walrus_rls_stmt' into subscription_has_access;

                          if subscription_has_access then
                              visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                          end if;
                      end if;
                  end loop;

                  perform set_config('role', null, true);

                  return next (
                      output,
                      is_rls_enabled,
                      visible_to_subscription_ids,
                      case
                          when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                          else '{}'
                      end
                  )::realtime.wal_rls;

              end if;
          end loop;

          perform set_config('role', null, true);
      end;
    $$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    /*
    Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
    */
    declare
      op_symbol text = (
        case
          when op = 'eq' then '='
          when op = 'neq' then '!='
          when op = 'lt' then '<'
          when op = 'lte' then '<='
          when op = 'gt' then '>'
          when op = 'gte' then '>='
          else 'UNKNOWN OP'
        end
      );
      res boolean;
    begin
      execute format('select %L::'|| type_::text || ' ' || op_symbol || ' %L::'|| type_::text, val_1, val_2) into res;
      return res;
    end;
    $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $$
        /*
        Should the record be visible (true) or filtered out (false) after *filters* are applied
        */
            select
                -- Default to allowed when no filters present
                coalesce(
                    sum(
                        realtime.check_equality_op(
                            op:=f.op,
                            type_:=coalesce(
                                col.type_oid::regtype, -- null when wal2json version <= 2.4
                                col.type_name::regtype
                            ),
                            -- cast jsonb to text
                            val_1:=col.value #>> '{}',
                            val_2:=f.value
                        )::int
                    ) = count(1),
                    true
                )
            from
                unnest(filters) f
                join unnest(columns) col
                    on f.column_name = col.name;
        $$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
      col_names text[] = coalesce(
        array_agg(c.column_name order by c.ordinal_position),
        '{}'::text[]
      )
      from
        information_schema.columns c
      where
        format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
        and pg_catalog.has_column_privilege(
          (new.claims ->> 'role'),
          format('%I.%I', c.table_schema, c.table_name)::regclass,
          c.column_name,
          'SELECT'
        );
      filter realtime.user_defined_filter;
      col_type regtype;
    begin
      for filter in select * from unnest(new.filters) loop
        -- Filtered column is valid
        if not filter.column_name = any(col_names) then
          raise exception 'invalid column for filter %', filter.column_name;
        end if;

        -- Type is sanitized and safe for string interpolation
        col_type = (
          select atttypid::regtype
          from pg_catalog.pg_attribute
          where attrelid = new.entity
            and attname = filter.column_name
        );
        if col_type is null then
          raise exception 'failed to lookup type for column %', filter.column_name;
        end if;
        -- raises an exception if value is not coercable to type
        perform realtime.cast(filter.value, col_type);
      end loop;

      -- Apply consistent order to filters so the unique constraint on
      -- (subscription_id, entity, filters) can't be tricked by a different filter order
      new.filters = coalesce(
        array_agg(f order by f.column_name, f.op, f.value),
        '{}'
      ) from unnest(new.filters) f;

    return new;
  end;
  $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return split_part(_filename, '.', 2);
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
BEGIN
	return query 
		with files_folders as (
			select path_tokens[levels] as folder
			from storage.objects
			where objects.name ilike prefix || '%'
			and bucket_id = bucketname
			GROUP by folder
			limit limits
			offset offsets
		) 
		select files_folders.folder as name, objects.id, objects.updated_at, objects.created_at, objects.last_accessed_at, objects.metadata from files_folders 
		left join storage.objects
		on prefix || files_folders.folder = objects.name and objects.bucket_id=bucketname;
END
$$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer) OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255)
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone character varying(15) DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change character varying(15) DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: comments; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    "postId" integer NOT NULL,
    "user" text NOT NULL,
    "postedAt" timestamp with time zone DEFAULT now() NOT NULL,
    comment text NOT NULL,
    "parentId" integer
);


ALTER TABLE public.comments OWNER TO supabase_admin;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.comments ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: followers; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.followers (
    id integer NOT NULL,
    follower text NOT NULL,
    following text NOT NULL
);


ALTER TABLE public.followers OWNER TO supabase_admin;

--
-- Name: followers_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.followers ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.followers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: likes; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.likes (
    id integer NOT NULL,
    "postId" integer NOT NULL,
    "user" text NOT NULL
);


ALTER TABLE public.likes OWNER TO supabase_admin;

--
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.likes ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.likes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: messages; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.messages (
    "messageId" integer NOT NULL,
    message_type character varying DEFAULT 'TEXT'::character varying NOT NULL,
    text text,
    "postId" integer,
    "imageUrl" text,
    sender text NOT NULL,
    receiver text NOT NULL,
    received_at timestamp with time zone DEFAULT now() NOT NULL,
    "storyId" integer
);


ALTER TABLE public.messages OWNER TO supabase_admin;

--
-- Name: COLUMN messages.message_type; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON COLUMN public.messages.message_type IS 'TEXT, IMAGE, POST, STORY, STORYREPLY';


--
-- Name: messages_messageId_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.messages ALTER COLUMN "messageId" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."messages_messageId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    type text NOT NULL,
    "createdOn" timestamp with time zone DEFAULT now() NOT NULL,
    "toUser" text NOT NULL,
    "byUser" text NOT NULL,
    post integer,
    comment bigint
);


ALTER TABLE public.notifications OWNER TO supabase_admin;

--
-- Name: TABLE notifications; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON TABLE public.notifications IS 'Notifications';


--
-- Name: COLUMN notifications.type; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON COLUMN public.notifications.type IS 'Type of Notification: COMMENT, LIKE, FOLLOW';


--
-- Name: COLUMN notifications."createdOn"; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON COLUMN public.notifications."createdOn" IS 'Created On';


--
-- Name: COLUMN notifications."toUser"; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON COLUMN public.notifications."toUser" IS 'User ';


--
-- Name: COLUMN notifications.post; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON COLUMN public.notifications.post IS 'Post';


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.notifications ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: posts; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.posts (
    "postId" integer NOT NULL,
    "imageUrl" text NOT NULL,
    "user" text NOT NULL,
    caption text,
    "postedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.posts OWNER TO supabase_admin;

--
-- Name: posts_postId_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.posts ALTER COLUMN "postId" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."posts_postId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: stories; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.stories (
    id bigint NOT NULL,
    "imageUrl" text NOT NULL,
    "user" text NOT NULL,
    "postedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.stories OWNER TO supabase_admin;

--
-- Name: TABLE stories; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON TABLE public.stories IS 'Stories';


--
-- Name: COLUMN stories."imageUrl"; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON COLUMN public.stories."imageUrl" IS 'Story Image URL';


--
-- Name: COLUMN stories."user"; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON COLUMN public.stories."user" IS 'User';


--
-- Name: COLUMN stories."postedAt"; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON COLUMN public.stories."postedAt" IS 'Posted At';


--
-- Name: storiees_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.stories ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.storiees_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: storyviews; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.storyviews (
    "storyId" bigint NOT NULL,
    id bigint NOT NULL,
    "user" text NOT NULL
);


ALTER TABLE public.storyviews OWNER TO supabase_admin;

--
-- Name: storyviews_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.storyviews ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.storyviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.users (
    username text NOT NULL,
    name text NOT NULL,
    bio text,
    "profilePic" text,
    email text NOT NULL,
    "notificationToken" text
);


ALTER TABLE public.users OWNER TO supabase_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON TABLE public.users IS 'Users';


--
-- Name: COLUMN users.name; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON COLUMN public.users.name IS 'Name';


--
-- Name: COLUMN users.bio; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON COLUMN public.users.bio IS 'Bio';


--
-- Name: COLUMN users."profilePic"; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON COLUMN public.users."profilePic" IS 'Profile Picture';


--
-- Name: COLUMN users."notificationToken"; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON COLUMN public.users."notificationToken" IS 'Notification Token for FCM';


--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (provider, id);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: followers followers_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_pkey PRIMARY KEY (id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY ("messageId");


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY ("postId");


--
-- Name: stories storiees_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT storiees_pkey PRIMARY KEY (id);


--
-- Name: storyviews storyviews_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.storyviews
    ADD CONSTRAINT storyviews_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_token_idx ON auth.refresh_tokens USING btree (token);


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING hash (entity);


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_parent_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_parent_fkey FOREIGN KEY (parent) REFERENCES auth.refresh_tokens(token);


--
-- Name: comments comments_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.comments(id);


--
-- Name: comments comments_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES public.posts("postId");


--
-- Name: comments comments_user_key; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_key FOREIGN KEY ("user") REFERENCES public.users(username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: followers followers_follower_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_follower_fkey FOREIGN KEY (follower) REFERENCES public.users(username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: followers followers_following_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_following_fkey FOREIGN KEY (following) REFERENCES public.users(username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: likes likes_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT "likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES public.posts("postId");


--
-- Name: likes likes_user_key; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_key FOREIGN KEY ("user") REFERENCES public.users(username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_postId_fkey" FOREIGN KEY ("postId") REFERENCES public.posts("postId");


--
-- Name: messages messages_postid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_postid_fkey FOREIGN KEY ("postId") REFERENCES public.posts("postId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_receiver_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_fkey FOREIGN KEY (receiver) REFERENCES public.users(username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_sender_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_fkey FOREIGN KEY (sender) REFERENCES public.users(username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_storyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES public.stories(id);


--
-- Name: notifications notifications_byUser_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_byUser_fkey" FOREIGN KEY ("byUser") REFERENCES public.users(username);


--
-- Name: notifications notifications_comment_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_comment_fkey FOREIGN KEY (comment) REFERENCES public.comments(id);


--
-- Name: notifications notifications_post_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_post_fkey FOREIGN KEY (post) REFERENCES public.posts("postId");


--
-- Name: notifications notifications_toUser_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_toUser_fkey" FOREIGN KEY ("toUser") REFERENCES public.users(username);


--
-- Name: posts posts_user_key; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_key FOREIGN KEY ("user") REFERENCES public.users(username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: stories storiees_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT storiees_user_fkey FOREIGN KEY ("user") REFERENCES public.users(username);


--
-- Name: storyviews storyviews_storyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.storyviews
    ADD CONSTRAINT "storyviews_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES public.stories(id);


--
-- Name: storyviews storyviews_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.storyviews
    ADD CONSTRAINT storyviews_user_fkey FOREIGN KEY ("user") REFERENCES public.users(username);


--
-- Name: buckets buckets_owner_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id);


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: objects objects_owner_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id);


--
-- Name: objects Access to Messages 1rdzryk_0; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Access to Messages 1rdzryk_0" ON storage.objects FOR SELECT USING ((bucket_id = 'messages'::text));


--
-- Name: objects Access to Messages 1rdzryk_1; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Access to Messages 1rdzryk_1" ON storage.objects FOR INSERT WITH CHECK ((bucket_id = 'messages'::text));


--
-- Name: objects Access to Messages 1rdzryk_2; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Access to Messages 1rdzryk_2" ON storage.objects FOR DELETE USING ((bucket_id = 'messages'::text));


--
-- Name: objects Access to Posts 1rma4z_0; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Access to Posts 1rma4z_0" ON storage.objects FOR INSERT WITH CHECK ((bucket_id = 'posts'::text));


--
-- Name: objects Access to Posts 1rma4z_1; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Access to Posts 1rma4z_1" ON storage.objects FOR SELECT USING ((bucket_id = 'posts'::text));


--
-- Name: objects Access to Posts 1rma4z_2; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Access to Posts 1rma4z_2" ON storage.objects FOR DELETE USING ((bucket_id = 'posts'::text));


--
-- Name: objects Give access to a file to user; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Give access to a file to user" ON storage.objects FOR SELECT USING ((bucket_id = 'stories'::text));


--
-- Name: objects Give access to a file to user 13v9opf_1; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Give access to a file to user 13v9opf_1" ON storage.objects FOR INSERT WITH CHECK ((bucket_id = 'stories'::text));


--
-- Name: objects Give access to a file to user 13v9opf_2; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Give access to a file to user 13v9opf_2" ON storage.objects FOR UPDATE USING ((bucket_id = 'stories'::text));


--
-- Name: objects Give access to a file to user 13v9opf_3; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Give access to a file to user 13v9opf_3" ON storage.objects FOR DELETE USING ((bucket_id = 'stories'::text));


--
-- Name: objects Select, Insert and Delete 1o29iim_0; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Select, Insert and Delete 1o29iim_0" ON storage.objects FOR DELETE USING ((bucket_id = 'profilePictures'::text));


--
-- Name: objects Select, Insert and Delete 1o29iim_1; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Select, Insert and Delete 1o29iim_1" ON storage.objects FOR INSERT WITH CHECK ((bucket_id = 'profilePictures'::text));


--
-- Name: objects Select, Insert and Delete 1o29iim_2; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Select, Insert and Delete 1o29iim_2" ON storage.objects FOR SELECT USING ((bucket_id = 'profilePictures'::text));


--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA graphql_public; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA graphql_public TO postgres;
GRANT USAGE ON SCHEMA graphql_public TO anon;
GRANT USAGE ON SCHEMA graphql_public TO authenticated;
GRANT USAGE ON SCHEMA graphql_public TO service_role;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;
GRANT ALL ON FUNCTION auth.email() TO postgres;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;
GRANT ALL ON FUNCTION auth.role() TO postgres;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;
GRANT ALL ON FUNCTION auth.uid() TO postgres;


--
-- Name: FUNCTION get_built_schema_version(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql.get_built_schema_version() TO postgres;
GRANT ALL ON FUNCTION graphql.get_built_schema_version() TO anon;
GRANT ALL ON FUNCTION graphql.get_built_schema_version() TO authenticated;
GRANT ALL ON FUNCTION graphql.get_built_schema_version() TO service_role;


--
-- Name: FUNCTION rebuild_on_ddl(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql.rebuild_on_ddl() TO postgres;
GRANT ALL ON FUNCTION graphql.rebuild_on_ddl() TO anon;
GRANT ALL ON FUNCTION graphql.rebuild_on_ddl() TO authenticated;
GRANT ALL ON FUNCTION graphql.rebuild_on_ddl() TO service_role;


--
-- Name: FUNCTION rebuild_on_drop(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql.rebuild_on_drop() TO postgres;
GRANT ALL ON FUNCTION graphql.rebuild_on_drop() TO anon;
GRANT ALL ON FUNCTION graphql.rebuild_on_drop() TO authenticated;
GRANT ALL ON FUNCTION graphql.rebuild_on_drop() TO service_role;


--
-- Name: FUNCTION rebuild_schema(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql.rebuild_schema() TO postgres;
GRANT ALL ON FUNCTION graphql.rebuild_schema() TO anon;
GRANT ALL ON FUNCTION graphql.rebuild_schema() TO authenticated;
GRANT ALL ON FUNCTION graphql.rebuild_schema() TO service_role;


--
-- Name: FUNCTION variable_definitions_sort(variable_definitions jsonb); Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql.variable_definitions_sort(variable_definitions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql.variable_definitions_sort(variable_definitions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql.variable_definitions_sort(variable_definitions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql.variable_definitions_sort(variable_definitions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: postgres
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;


--
-- Name: FUNCTION extension(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.extension(name text) TO anon;
GRANT ALL ON FUNCTION storage.extension(name text) TO authenticated;
GRANT ALL ON FUNCTION storage.extension(name text) TO service_role;


--
-- Name: FUNCTION filename(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.filename(name text) TO anon;
GRANT ALL ON FUNCTION storage.filename(name text) TO authenticated;
GRANT ALL ON FUNCTION storage.filename(name text) TO service_role;


--
-- Name: FUNCTION foldername(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.foldername(name text) TO anon;
GRANT ALL ON FUNCTION storage.foldername(name text) TO authenticated;
GRANT ALL ON FUNCTION storage.foldername(name text) TO service_role;


--
-- Name: FUNCTION search(prefix text, bucketname text, limits integer, levels integer, offsets integer); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer) TO anon;
GRANT ALL ON FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer) TO authenticated;
GRANT ALL ON FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO postgres;
GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.identities TO postgres;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO postgres;
GRANT ALL ON TABLE auth.instances TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO postgres;
GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.schema_migrations TO postgres;
GRANT ALL ON TABLE auth.schema_migrations TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO postgres;
GRANT ALL ON TABLE auth.users TO dashboard_user;


--
-- Name: TABLE schema_version; Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON TABLE graphql.schema_version TO postgres;
GRANT ALL ON TABLE graphql.schema_version TO anon;
GRANT ALL ON TABLE graphql.schema_version TO authenticated;
GRANT ALL ON TABLE graphql.schema_version TO service_role;


--
-- Name: SEQUENCE seq_schema_version; Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE graphql.seq_schema_version TO postgres;
GRANT ALL ON SEQUENCE graphql.seq_schema_version TO anon;
GRANT ALL ON SEQUENCE graphql.seq_schema_version TO authenticated;
GRANT ALL ON SEQUENCE graphql.seq_schema_version TO service_role;


--
-- Name: TABLE comments; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.comments TO postgres;
GRANT ALL ON TABLE public.comments TO anon;
GRANT ALL ON TABLE public.comments TO authenticated;
GRANT ALL ON TABLE public.comments TO service_role;


--
-- Name: SEQUENCE comments_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.comments_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.comments_id_seq TO anon;
GRANT ALL ON SEQUENCE public.comments_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.comments_id_seq TO service_role;


--
-- Name: TABLE followers; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.followers TO postgres;
GRANT ALL ON TABLE public.followers TO anon;
GRANT ALL ON TABLE public.followers TO authenticated;
GRANT ALL ON TABLE public.followers TO service_role;


--
-- Name: SEQUENCE followers_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.followers_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.followers_id_seq TO anon;
GRANT ALL ON SEQUENCE public.followers_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.followers_id_seq TO service_role;


--
-- Name: TABLE likes; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.likes TO postgres;
GRANT ALL ON TABLE public.likes TO anon;
GRANT ALL ON TABLE public.likes TO authenticated;
GRANT ALL ON TABLE public.likes TO service_role;


--
-- Name: SEQUENCE likes_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.likes_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.likes_id_seq TO anon;
GRANT ALL ON SEQUENCE public.likes_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.likes_id_seq TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.messages TO postgres;
GRANT ALL ON TABLE public.messages TO anon;
GRANT ALL ON TABLE public.messages TO authenticated;
GRANT ALL ON TABLE public.messages TO service_role;


--
-- Name: SEQUENCE "messages_messageId_seq"; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public."messages_messageId_seq" TO postgres;
GRANT ALL ON SEQUENCE public."messages_messageId_seq" TO anon;
GRANT ALL ON SEQUENCE public."messages_messageId_seq" TO authenticated;
GRANT ALL ON SEQUENCE public."messages_messageId_seq" TO service_role;


--
-- Name: TABLE notifications; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.notifications TO postgres;
GRANT ALL ON TABLE public.notifications TO anon;
GRANT ALL ON TABLE public.notifications TO authenticated;
GRANT ALL ON TABLE public.notifications TO service_role;


--
-- Name: SEQUENCE notifications_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.notifications_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.notifications_id_seq TO anon;
GRANT ALL ON SEQUENCE public.notifications_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.notifications_id_seq TO service_role;


--
-- Name: TABLE posts; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.posts TO postgres;
GRANT ALL ON TABLE public.posts TO anon;
GRANT ALL ON TABLE public.posts TO authenticated;
GRANT ALL ON TABLE public.posts TO service_role;


--
-- Name: SEQUENCE "posts_postId_seq"; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public."posts_postId_seq" TO postgres;
GRANT ALL ON SEQUENCE public."posts_postId_seq" TO anon;
GRANT ALL ON SEQUENCE public."posts_postId_seq" TO authenticated;
GRANT ALL ON SEQUENCE public."posts_postId_seq" TO service_role;


--
-- Name: TABLE stories; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.stories TO postgres;
GRANT ALL ON TABLE public.stories TO anon;
GRANT ALL ON TABLE public.stories TO authenticated;
GRANT ALL ON TABLE public.stories TO service_role;


--
-- Name: SEQUENCE storiees_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.storiees_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.storiees_id_seq TO anon;
GRANT ALL ON SEQUENCE public.storiees_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.storiees_id_seq TO service_role;


--
-- Name: TABLE storyviews; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.storyviews TO postgres;
GRANT ALL ON TABLE public.storyviews TO anon;
GRANT ALL ON TABLE public.storyviews TO authenticated;
GRANT ALL ON TABLE public.storyviews TO service_role;


--
-- Name: SEQUENCE storyviews_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.storyviews_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.storyviews_id_seq TO anon;
GRANT ALL ON SEQUENCE public.storyviews_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.storyviews_id_seq TO service_role;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.users TO postgres;
GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

