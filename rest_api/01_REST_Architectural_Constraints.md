REST Architectural Constraints
===
Link: [REST Constraints](https://restfulapi.net/rest-architectural-constraints/)
* REST stands for Representational State Transfer, a term coined by Roy Fielding in 2000.
  * It is an architecture style for designing loosely coupled applications over HTTP
  * REST does not enforce any rule regarding how it should be implemented at lower level
    * it just put high level design guidelines and leave you to think of your own implementation.

> The writer of the link designed RESTful APIs for telecom major company for 2 good years.
In this post, he shared his thoughts apart from normal design practices.
You may not agree with him on a few points, and he said that’s perfectly OK.
He will be happy to discuss anything from you with an open mind.

Architectural Constraints
---
* REST defines 6 architectural constraints which make any web service – a true RESTful API.  
1. Uniform interface  
1. Client–server  
1. Stateless
1. Cacheable
1. Layered system
1. Code on demand (optional)

Uniform interface
---
As the constraint name itself applies, you MUST decide APIs interface for resources inside the system which are exposed to API consumers and follow religiously. A resource in the system should have only one logical URI and that should provide a way to fetch related or additional data. It’s always better to synonymise a resource with a web page.

* Any single resource should not be too large and contain each and everything in its representation.
  * A resource should contain links (HATEOAS) pointing to relative URIs to fetch related information.

* Also, the resource representations across system should follow certain guidelines
  * such as naming conventions, link formats or data format (xml or/and json).

* All resources should be accessible through a common approach
  * such as HTTP GET and similarly modified using a consistent approach.

> Once a developer becomes familiar with one of your API, he should be able to follow the similar approach for other APIs.

Stateless
---
* Roy fielding got inspiration from HTTP, so it reflects in this constraint.
  * Make all client-server interaction stateless.
  * Server will not store anything about latest HTTP request client made.
  * It will treat each and every request as new.
  * No session, no history.

* If client application needs to be a stateful application for the end user, where user logs in once and do other authorized operations thereafter,
  then each request from the client should contain all the information necessary to service the request
  * including authentication and authorization details.

> No client context shall be stored on the server between requests.
The client is responsible for managing the state of the application.

Cacheable
---
* In today’s world, caching of data and responses is of utmost important wherever they are applicable/possible.
  * The webpage you are reading here is also a cached version of the HTML page.
  * Caching brings performance improvement for client side
    * And better scope for scalability for a server because the load has reduced.

* In REST, caching shall be applied to resources when applicable
  * And then these resources MUST declare themselves cacheable.
    * Caching can be implemented on the server or client side.

> Well-managed caching partially or completely eliminates some client-server interactions, further improving scalability and performance.

Layered system
---
* REST allows you to use a layered system architecture.
  * For example, You deploy the APIs on server A
  * And store data on server B
  * And authenticate requests in Server C.
    * A client cannot ordinarily tell whether it is connected directly to the end server
    * Or to an intermediary along the way.
