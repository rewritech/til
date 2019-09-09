What is REST
===
link: [REST API TUTORIAL](https://restfulapi.net/)
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
