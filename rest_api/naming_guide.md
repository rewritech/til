Use nouns to represent resources
---
link: [REST API TUTORIAL](https://restfulapi.net/resource-naming/)
> 

  ####  1. document
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

  #### 5. Use lowercase letters in URIs
  * When convenient, lowercase letters should be consistently preferred in URI paths.
    #### RFC 3986 defines URIs as case-sensitive except for the scheme and host components.
    ```
    * Example
    http://api.example.org/my-folder/my-doc  //1 (O)
    HTTP://API.EXAMPLE.ORG/my-folder/my-doc  //2 (O)
    http://api.example.org/My-Folder/my-doc  //3 (X)

    1. Scheme: The scheme identifies the protocol to be used to access the resource on the Internet. It can be HTTP (without SSL) or HTTPS (with SSL).
      => In here 'HTTP' is scheme
    2. Host: The host name identifies the host that holds the resource.
      => In here 'api.example.org' is host
    ```
    > In above examples, 1 and 2 are same but 3 is not as it uses My-Folder in capital letters.

  #### 6. Do not use file extenstions
  * File extensions look bad and do not add any advantage.
  * Removing them decrease the length of URIs as well.
  * No reason to keep them.
    #### Apart from above reason, if you want to highlight the media type of API using file extenstion then you should rely on the media type, as communicated through the [Content-Type header], to determine how to process the body’s content.
    ```
    * Example
    http://api.example.com/device-management/managed-devices.xml  /*Do not use it*/
    http://api.example.com/device-management/managed-devices 	/*This is correct URI*/
      => Need to communicate through the [Content-Type header]
    ```

Never use CRUD function names in URIs
---
  * URIs should not be used to indicate that a CRUD function is performed.
  * URIs should be used to uniquely identify resources and not any action upon them.
  * HTTP request methods should be used to indicate which CRUD function is performed.
    ```
    * Example
    HTTP GET http://api.example.com/device-management/managed-devices  //Get all devices
    HTTP POST http://api.example.com/device-management/managed-devices  //Create new Device

    HTTP GET http://api.example.com/device-management/managed-devices/{id}  //Get device for given Id
    HTTP PUT http://api.example.com/device-management/managed-devices/{id}  //Update device for given Id
    HTTP DELETE http://api.example.com/device-management/managed-devices/{id}  //Delete device for given Id

    GET: Get Info
    POST: Create Data
    PUT: Update Data -> PATCH?
    DELETE: Delete Data
    ```

Use query component to filter URI collection
---
> Many times, you will come across requirements where you will need a collection of resources sorted, filtered or limited based on some certain resource attribute. For this, do not create new APIs – rather enable sorting, filtering and pagination capabilities in resource collection API and pass the input parameters as query parameters. e.g.

  * a collection of resources sorted, filtered or limited passes the input parameters
    ```
    * Example
    http://api.example.com/device-management/managed-devices
    http://api.example.com/device-management/managed-devices?region=USA
    http://api.example.com/device-management/managed-devices?region=USA&brand=XYZ
    http://api.example.com/device-management/managed-devices?region=USA&brand=XYZ&sort=installation-date
    
    * Practice
    http://www.service.com/rooms/100/devices?sort=acs&kind=electronics
    ```
