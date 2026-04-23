# The Internet

- A global network of interconnected computers, servers and devices that communicate using standardized protocols.

- Data is broken down into small `packets` sent via physical means (fiber, copper), or wireless (Wi-Fi, GSM (Cellular) [5G, 4G, 3G,], Satellite )

## Components

1. Physical Infrastructure - 
2. Clients && Servers - [Clients] => Entities that are requesting / receive, [Servers] => Entities that store information and process requests
3. IP Addresses / Routing - (IPv4 / IPv6)
4. DNS (Domain Name System) - 
5. Packet Switching - 

## What happens when you access a website?

1. Request -> URL -> Browser send a request to DNS server -> to find the server(computers) hosting the website
2. Transmission -> router -> ISP (cables/wireless)
3. Data Retreival -> server send requested data back (server -> ISP -> router)
4. Assembly -> Browser reassembles packets and show web UI

## Internet Protocols

1. TCP -> Transmission Control => Each packet is delivered one at a time in the queues and the client never misses any packets. Full reassembly at the end
2. UDP -> User Datagram => Packets are prioritized according to arrival time. If a later packet arrives before a former one then that packet is lost.

## Truthy vs Falsy Values

Truthy -> usually evaluate to true when used as a boolean expression
E.g true, all numbers except 0, objects, all strings, non-empty array

Falsy -> Evaluate to false
E.g false, 0, empty arrays, null, undefined


## Approach to Software Engineering

Before writing code, solve the problem first.

Try to think of the solution

1. Which technologies are needed? HTML, CSS and JS
2. Requirements:

        Given: A user searches for recipes
            Input text in field
            Make network request to API.
                - Fetch

        When 1: Recipes are found Then: Show recipes       
            Received response
                - retrieve data and format as json
            Show Json
                - Create and append dom elements = X
                - Interpolation and manipulate dom with the strings directly

                    => 

        When 2: Recipes are not found; Then: Show not found message


