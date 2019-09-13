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
