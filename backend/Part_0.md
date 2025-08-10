Part_0: Dojo Gym --- Go Backend, Getting all Members
=====================================================

## Lesson 1 --- End-to-end execution flow 

What happens from `go run` → HTTP request → DB → JSON response → back to client.

-   Entrypoint: `main()` creates the app then starts the HTTP server on `:8080`.

-   App bootstrap: load `.env`, build DSN from env, open DB, ping DB, create router, register routes, return the `*App`.

-   Route wiring: `/api/members` → your handler (in `handlers`).

-   Handler: call model, set JSON header, encode slice to JSON.

-   Model: run `SELECT ... FROM members ORDER BY member_id`, scan rows into `Member` slice.

-   JSON shaping: `Member` uses custom nullable types so `NULL` becomes real JSON `null` and times are `YYYY-MM-DD`.

-   HTTP response leaves the process.

**Cloud/distributed angle introduced here:** what a connection is (DB + TCP), what a pool is, request concurrency vs. DB capacity, latency/throughput, and where timeouts belong.

### 1\. Process starts --- `main.go`
----------------------------------

**File:** `backend/main.go`



```go
func main() {
    application := app.NewApp()
    fmt.Println("Server running at http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", application.Router))
}
```


1.  **`main()` runs** --- this is the program's entry point.

2.  Calls `app.NewApp()` → boots the entire application: loads config, connects DB, sets routes.

3.  Prints the "Server running..." message.

4.  Runs `http.ListenAndServe(":8080", application.Router)`:

    -   Starts an HTTP server listening on TCP port **8080**.

    -   For every incoming request, it hands it to `application.Router` (Gorilla Mux router).

**Cloud/distributed note:**

-   Port `8080` is arbitrary locally, but in Kubernetes, your Pod will listen on some container port that gets mapped to a Service/Ingress.

-   If the process dies, `ListenAndServe` stops accepting connections --- in production, something like systemd, Docker, or K8s restarts it.



### 2\. Application bootstraps --- `NewApp()`
-------------------------------------------

**File:** `backend/app/app.go`


```go
func NewApp() *App {
    _ = godotenv.Load(".env")
    connStr := fmt.Sprintf(
        "host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
        getEnv("DB_HOST"),
        getEnv("DB_PORT"),
        getEnv("DB_USER"),
        getEnv("DB_PASSWORD"),
        getEnv("DB_NAME"),
        getEnv("DB_SSLMODE"),
    )
    db, _ := sql.Open("postgres", connStr)
    _ = db.Ping()
    app := &App{DB: db, Router: mux.NewRouter()}
    app.Router.HandleFunc("/api/members", handlers.GetMembers(app.DB)).Methods("GET")
    return app
}
```


1.  **Load `.env`**

    -   `godotenv.Load(".env")` reads your local `.env` file and sets those key/values into environment variables.

    -   In production, `.env` is not used --- real env vars are injected by the deployment platform.

2.  **Build DSN (Data Source Name)**

    -   `fmt.Sprintf(...)` constructs a connection string for Postgres.

    -   It uses `getEnv()` (your helper) to pull values from the environment (or `.env` locally).

    -   Example final string: `host=localhost port=5432 user=postgres password=secret dbname=dojo_gym sslmode=disable`

        
3.  **Open database handle**

    -   `sql.Open("postgres", connStr)` doesn't immediately connect --- it creates a *DB pool manager* (`*sql.DB`).

    -   The `"postgres"` driver comes from `lib/pq` in `go.mod`.

4.  **Ping database**

    -   `db.Ping()` actually tries one real connection to confirm credentials & network work.

    -   If this fails, the app should ideally `log.Fatal` (currently it just ignores errors).

5.  **Create router**

    -   `mux.NewRouter()` creates an empty Gorilla Mux router.

6.  **Register route**

    -   `HandleFunc("/api/members", handlers.GetMembers(app.DB)).Methods("GET")`:

        -   Matches any HTTP GET request to `/api/members`.

        -   Calls the handler function returned by `handlers.GetMembers(db)`.

7.  **Return `*App`**

    -   Now `main()` can start the HTTP server with this router.

**Cloud/distributed note:**

-   In containerized deployments, this bootstrap phase is your "readiness gate."\
    If DB is unreachable, you should fail startup so Kubernetes doesn't route traffic to a broken Pod.

-   In distributed systems, each instance runs this same sequence independently --- so all have their own DB connection pool.


### 3\. Incoming HTTP request --- `/api/members`
----------------------------------------------

When a client (browser, frontend app, `curl`, etc.) does:

```bash
curl http://localhost:8080/api/members
```

-   The TCP connection is accepted by the HTTP server started in `main.go`.

-   The HTTP server passes the request to `application.Router`.

-   Gorilla Mux checks the route table and finds:\
    `GET /api/members` → `handlers.GetMembers(app.DB)`.

### 4\. Handler executes
------------------------

**File:** `backend/members.go` (handlers)

```go
func GetMembers(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        members, err := models.GetAllMembers(db)
        if err != nil {
            http.Error(w, "Database error", http.StatusInternalServerError)
            return
        }
        w.Header().Set("Content-Type", "application/json; charset=utf-8")
        json.NewEncoder(w).Encode(members)
    }
}
```


1.  **Call model**

    -   `models.GetAllMembers(db)` runs SQL to fetch rows from the `members` table.

2.  **Error handling**

    -   If DB fails, sends an HTTP 500 with `"Database error"`.

3.  **Set header**

    -   Declares `Content-Type: application/json; charset=utf-8`.

4.  **Marshal and send JSON**

    -   `json.NewEncoder(w).Encode(members)`:

        -   **Marshalling:** converts the Go slice (`[]Member`) into JSON bytes.

        -   Writes directly to the `http.ResponseWriter` stream.

**Cloud/distributed note:**

-   The handler is **stateless** --- all data comes from the DB; no in-memory session is used. This means it can scale horizontally (multiple replicas) behind a load balancer.



### 5\. Data layer executes**
------------------------

**File:** `backend/models/get_members.go`

```go
func GetAllMembers(db *sql.DB) ([]Member, error) {
    rows, err := db.Query(`
        SELECT member_id, first_name, last_name, gender, date_of_birth, phone_number, email
        FROM members
        ORDER BY member_id
    `)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var members []Member
    for rows.Next() {
        var m Member
        if err := rows.Scan(&m.ID, &m.FirstName, &m.LastName, &m.Gender, &m.DOB, &m.Phone, &m.Email); err != nil {
            return nil, err
        }
        members = append(members, m)
    }
    if err := rows.Err(); err != nil {
        return nil, err
    }
    return members, nil
}
```


1.  **Run query** --- DB driver sends SQL text over the Postgres connection.

2.  **Get rows back** --- Postgres returns each row's column data.

3.  **Scan into struct** --- `rows.Scan` maps each DB column into your `Member` struct fields (including custom null types).

4.  **Append to slice** --- builds the `[]Member` slice to return.

5.  **Check iteration errors** --- ensures no network/driver errors happened mid-stream.

**Cloud/distributed note:**

-   Every `db.Query` borrows one connection from the pool, runs the SQL, then `rows.Close()` releases it.

-   If pool is exhausted (too many concurrent queries), requests will wait for a free connection.



### 6\. JSON marshalling with custom null handling
------------------------

**Files:** `member.go` + `nulltypes.go`

Your `Member` struct uses `utils.NullString` and `utils.NullTime` to ensure:

-   If DB column is NULL → JSON `null` (instead of `""` or `"0001-01-01T00:00:00Z"`).

-   Dates are formatted as `"YYYY-MM-DD"` instead of full RFC3339 timestamp.

When `json.NewEncoder` hits these types, it calls their `MarshalJSON` methods to get the correct representation.


### 7\. Response sent to client
------------------------

-   Encoded JSON bytes are written to the TCP connection.

-   HTTP server flushes and closes the response (or keeps alive if `Connection: keep-alive`).

**Cloud/distributed note:**

-   In a load-balanced environment, this exact sequence happens independently on whichever replica gets the request.

-   The DB becomes a shared dependency --- in a distributed system, you must monitor its load, connection counts, and query latency.

Lesson 2 --- HTTP layer & routing (Gorilla Mux, methods, paths, middleware)
-------------------------------------------------------------------------

-   How routers match `METHOD + PATH` to handlers; method guards; path params; query params.

-   Where to add middleware (logging, CORS, recovery) and why ordering matters.

Lesson 3 --- Handlers done right
------------------------------

-   Handler signatures, reading inputs (path/query/body), writing outputs (status codes, headers).

-   Content negotiation: `Content-Type`, JSON encoding strategies, streaming large responses.

-   Error contracts: consistent error JSON vs. `http.Error`.

Lesson 4 --- Data model ↔ SQL layer
---------------------------------

-   Mapping structs to rows (`Scan`), nullable fields, avoiding accidental `NULL → ""`.

-   Safer queries (`QueryContext`, prepared statements), SQL injection basics, and when to use transactions.

-   Pagination patterns (limit/offset vs. keyset) and why big lists are dangerous in prod.

Lesson 5 --- JSON marshalling & wire contracts
--------------------------------------------

-   **Marshalling** (convert Go values → JSON bytes) and **Unmarshalling** (JSON bytes → Go values).

-   Tags (`json:"first_name"`), `omitempty`, custom `MarshalJSON` (your `NullString`/`NullTime`).

-   Distributed-systems lens: payload size, schema/versioning, forwards/backwards compatibility, compression.

Lesson 6 --- Configuration & secrets (12-factor)
----------------------------------------------

-   `.env` for dev vs. real env in prod; strict `getEnv()` with fatal on missing values.

-   DSN/SSL modes; rotating secrets; secret managers; never logging credentials.

Lesson 7 --- Connections, pools, and timeouts (reliability)
---------------------------------------------------------

-   DB connection lifecycle; pool limits; backpressure when the pool is exhausted.

-   Where to set deadlines (`context.WithTimeout`) for DB calls and handlers; handling timeouts gracefully.

-   Capacity planning: per-instance max open conns vs. Postgres limits; tail latency (p95/p99).

Lesson 8 --- Observability
------------------------

-   Structured logging; request IDs; access logs; app logs.

-   Metrics: request rate, latency, error rate, DB pool stats.

-   Tracing the request path (ingress → handler → DB → JSON).

Lesson 9 --- Security basics for APIs
-----------------------------------

-   Input validation, output encoding, least privilege DB user, parameterized queries.

-   CORS, auth (JWT/bearer), HTTPS/redirects, rate limits.

Lesson 10 --- Packaging & deploying
---------------------------------

-   Minimal Dockerfile, multi-stage builds, health checks.

-   Docker Compose for local DB + app; then Kubernetes basics (probes, ConfigMaps/Secrets).

-   Rolling updates, readiness vs. liveness, zero-downtime concerns.

Lesson 11 --- Testing
-------------------

-   Unit tests for models (with a test DB/containers), handler tests (httptest), golden files for JSON.

-   Integration vs. end-to-end; CI automation.

Lesson 12 --- Performance & resilience patterns
---------------------------------------------

-   Caching (per-request, shared cache), pagination at scale, circuit breakers, retries with idempotency.

-   DB indexing and query plans; profiling hot paths.

* * * * *

Quick vocabulary 
------------------------------------

-   **Connection (DB):** a single authenticated TCP session between your process and Postgres; queries execute over a connection.

-   **Pool:** the set of reusable connections managed by `*sql.DB` so concurrent handlers don't create/destroy connections repeatedly.

-   **Marshal (serialize):** convert a Go value (e.g., `[]Member`) into a sequence of bytes (JSON) for the wire. Your code uses `json.NewEncoder(w).Encode(members)` and custom `MarshalJSON` to control `null` and date format.

-   **Unmarshal (deserialize):** convert bytes (e.g., request body JSON) back into Go values.

-   **Stateless handler:** handler doesn't rely on in-memory session across requests; all state is in the request + DB---critical for scaling horizontally.

-   **Idempotent GET:** same GET multiple times → same effect; safe to retry.

-   **Timeout:** a deadline applied to an operation (HTTP handler, DB call) so it fails fast instead of hanging.

-   **Throughput/Latency:** how many requests/sec vs. how long one request takes (p50/p95/p99 focus).

-   **Backpressure:** when resources are saturated, new work waits or is rejected instead of overloading the system.

  
