Caching REST API Response
===
Link: [Caching](https://restfulapi.net/caching/)  
> Caching is the ability to store copies of frequently accessed data in several places along the request-response path.
When a consumer requests a resource representation, the request goes through a cache or a series of caches (local cache, proxy cache or reverse proxy) toward the service hosting the resource.
If any of the caches along the request path has a fresh copy of the requested representation, it uses that copy to satisfy the request.
If none of the caches can satisfy the request
  the request travels all the way to the service
  (or origin server as it is formally known)

* Using HTTP headers, an origin server indicates whether a response can be cached and if so, by whom, and for how long.
  * Caches along the response path can take a copy of a response
    * but only if the caching metadata allows them to do so.

* Optimizing the network using caching improves the overall quality-of-service in following ways:
1. Reduce bandwidth
1. Reduce latency
1. Reduce load on servers
1. Hide network failures

Caching in REST APIs
---
* Being cacheable is one of architectural constraints of REST.
  * GET requests should be cachable by default – until special condition arises.
    * Usually, browsers treat all GET requests cacheable.
  * POST requests are not cacheable by default
    * But can be made cacheable if either an Expires header or a Cache-Control header with a directive, to explicitly allows caching, is added to the response.
  * Responses to PUT and DELETE requests are not cacheable at all.

There are two main HTTP response headers that we can use to control caching behavior:

### Expires
* The Expires HTTP header specifies an absolute expiry time for a cached representation.
  * Beyond that time,
    * a cached representation is considered stale
    * and must be re-validated with the origin server.
  * To indicate that a representation never expires,
    * A service can include a time up to one year in the future.
```
Expires: Sun, 20 Sep 2020 23:38:20 IST
```

### Cache-Control
* The header value comprises one or more comma-separated directives.
  * These directives determine whether a response is cacheable
    * and if so, by whom, and for how long e.g. max-age or s-maxage directives.
‘’’
Cache-Control: max-age=3600
‘’’
* Cacheable responses (whether to a GET or to a POST request) should also include a validator
  * either an ETag or a Last-Modified header.
