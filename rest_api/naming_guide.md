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


Consistency is the key
---
> Use consistent resource naming conventions and URI formatting for minimum ambiguily and maximum readability and maintainability. You may implement below design hints to achieve consistency:

  #### 1. Use forward slash (/) to indicate a hierarchical relationships
  * The forward slash (/) character is used in the path portion of the URI to indicate a hierarchical relationship between resources.
    ```
    * Example
    http://api.example.com/device-management
    http://api.example.com/device-management/managed-devices
    http://api.example.com/device-management/managed-devices/{id}
    http://api.example.com/device-management/managed-devices/{id}/scripts
    http://api.example.com/device-management/managed-devices/{id}/scripts/{id}
    
    * Practice
    http://www.service.com/rooms/100/furnichures
    ```
  #### 2. Do not use trailing forward slash (/) in URIs
  * As the last character within a URI’s path, a forward slash (/) adds no semantic value and may cause confusion.
  * It’s better to drop them completely.
    ```
    * Example
    http://api.example.com/device-management/managed-devices/
    http://api.example.com/device-management/managed-devices 	/*This is much better version*/
    
    * Practice
    http://www.service.com/rooms/100/furnichures/beds
    ```

  #### 3. Use hyphens (-) to improve the readability of URIs
  * To make your URIs easy for people to scan and interpret, use the hyphen (-) character to improve the readability of names in long path segments.
    ```
    * Example
    http://api.example.com/inventory-management/managed-entities/{id}/install-script-location  //More readable
    http://api.example.com/inventory-management/managedEntities/{id}/installScriptLocation  //Less readable
    
    * Practice
    http://www.service.com/rooms/100/furnichures/beds/king-size
    ```
    
  #### 4. Do not use underscores ( _ )
  * It’s possible to use an underscore in place of a hyphen to be used as separator. But!
  * Depending on the application’s font, it’s possible that the underscore (_) character can either get partially obscured or completely hidden in some browsers or screens.

    #### To avoid this confusion, use hyphens (-) instead of underscores ( _ ).
    ```
    * Example
    http://api.example.com/inventory-management/managed-entities/{id}/install-script-location  //More readable
    http://api.example.com/inventory_management/managed_entities/{id}/install_script_location  //More error prone
    ```
