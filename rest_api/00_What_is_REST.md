What is REST
===
link: [What is REST](https://restfulapi.net/)
> REST is acronym for REpresentational State Transfer.  
REST has it’s own 6 guiding constraints which must be satisfied if an interface needs to be referred as RESTful.  
These principles are listed below.

Guiding Principles of REST
---  
1. **Client–server**  
By separating the user interface concerns from the data storage concerns,
we improve the portability of the user interface across multiple platforms and improve scalability by simplifying the server components.

1. **Stateless**  
Each request from client to server must contain all of the information necessary to understand the request, and cannot take advantage of any stored context on the server. Session state is therefore kept entirely on the client.

1. **Cacheable**  
Cache constraints require that the data within a response to a request be implicitly or explicitly labeled as cacheable or non-cacheable. If a response is cacheable, then a client cache is given the right to reuse that response data for later, equivalent requests.

1. **Uniform interface**  
By applying the software engineering principle of generality to the component interface, the overall system architecture is simplified and the visibility of interactions is improved. In order to obtain a uniform interface, multiple architectural constraints are needed to guide the behavior of components. REST is defined by four interface constraints: identification of resources; manipulation of resources through representations; self-descriptive messages; and, hypermedia as the engine of application state.

1. **Layered system**  
The layered system style allows an architecture to be composed of hierarchical layers by constraining component behavior such that each component cannot “see” beyond the immediate layer with which they are interacting.

1. **Code on demand (optional)**  
REST allows client functionality to be extended by downloading and executing code in the form of applets or scripts. This simplifies clients by reducing the number of features required to be pre-implemented.

Resource
---  
* The key abstraction of information in REST is a resource.
  * Any information that can be named can be a resource.
    * a document or image, a temporal service, a collection of other resources, a non-virtual object (e.g. a person).
  * REST uses a resource identifier to identify the particular resource involved in an interaction between components.

* The state of resource at any particular timestamp is known as resource representation.
  * A representation consists of
    * data
    * metadata describing the data
    * hypermedia links which can help the clients in transition to next desired state.

* The data format of a representation is known as a media type.
  * The media type identifies a specification that defines how a representation is to be processed.
  * A truly RESTful API looks like hypertext.
  * Every addressable unit of information carries
    * an address
    * either explicitly (e.g., link and id attributes)
      * or implicitly (e.g., derived from the media type definition and representation structure)

Resource Methods
---
* resource methods to be used to perform the desired transition.
  * A large number of people wrongly relate resource methods to HTTP GET/PUT/POST/DELETE methods.

* Roy Fielding has never mentioned any recommendation around which method to be used in which condition.
  * All he emphasizes is that it should be uniform interface.
  * If you decide HTTP POST will be used for updating a resource, it’s alright and application interface will be RESTful.
  (most people recommend HTTP PUT)

* Ideally, everything that is needed to change the resource state shall be part of API response for that resource
  * including methods and in what state they will leave the representation.

REST and HTTP are not same !!
---
#### A lot of people prefer to compare HTTP with REST. REST and HTTP are not same.
> REST != HTTP
* Roy fielding, in his dissertation, nowhere mentioned any implementation directive
  * including any protocol preference and HTTP.
* Till the time, you are honoring the 6 guiding principles of REST, you can call your interface RESTful.

* In simplest words, in the REST architectural style, data and functionality
  * are considered resources
  * are accessed using Uniform Resource Identifiers (URIs)
* The resources are acted upon by using a set of simple, well-defined operations.
* The clients and servers exchange representations of resources by using a standardized interface and protocol.
  * typically HTTP

* Resources are decoupled from their representation so that their content can be accessed in a variety of formats
  * such as HTML, XML, plain text, PDF, JPEG, JSON, and others.
* Metadata about the resource is available and used
  * for example
    1. control caching  
    1. detect transmission errors  
    1. negotiate the appropriate representation format  
    1. perform authentication or access control.  
  * And most importantly, every interaction with a resource is stateless.

* All these principles help RESTful applications to be simple, lightweight, and fast.
