Use nouns to represent resources
---
link: [REST API TUTORIAL](https://restfulapi.net/resource-naming/)
> 

  ####  1. collection
  * A document resource is a singular concept.
  * Like an object instance or database record.
  * View it as a single resource inside resource collection.
  * A document’s state representation typically includes both fields with values and links to other related resources.
    #### Use “singular” name to denote document resource archetype.
    ```
    * Example
    http://api.example.com/device-management/managed-devices/{device-id}
    http://api.example.com/user-management/users/{id}
    http://api.example.com/user-management/users/admin

    * Practice
    http://www.service.com/skills/javascript
    http://www.service.com/rooms/100
    ```
  
  ####  2. collection
  * A collection resource is a server-managed directory of resources.
  * Clients may propose new resources to be added to a collection.
  * However, it is up to the collection to choose to create a new resource, or not.
  * A collection resource chooses what it wants to contain and also decides the URIs of each contained resource.
    #### Use “plural” name to denote collection resource archetype.
    ```
    * Example
    http://api.example.com/device-management/managed-devices
    http://api.example.com/user-management/users
    http://api.example.com/user-management/users/{id}/accounts
    
    * Practice
    http://www.service.com/skills/javascript/functions
    http://www.service.com/rooms/100/devices
    ```

  ####  3. store
  * A store is a client-managed resource repository.
  * A store resource lets an API client put resources in, get them back out, and decide when to delete them.
  * A store never generates new URIs.
  * Instead, each stored resource has a URI that was chosen by a client when it was initially put into the store.
    #### Use “plural” name to denote store resource archetype.
    ```
    * Example
    http://api.example.com/cart-management/users/{id}/carts
    http://api.example.com/song-management/users/{id}/playlists

    * Practice
    http://www.service.com/rooms/100/users/{id}/reservations
    ```

  ####  4. controller
  * A controller resource models a procedural concept.
  * Controller resources are like executable functions, with parameters and return values; inputs and outputs.
    #### Use “verb” to denote controller archetype.
    ```
    * Example
    http://api.example.com/cart-management/users/{id}/cart/checkout
    http://api.example.com/song-management/users/{id}/playlist/play

    * Practice
    http://www.service.com/rooms/100/users/{id}/reservations/cancel
    ```
