Morning Huddle AI Dashboard Tool (15-30 min spent on)

Purpose: 
From my understanding, these morning huddles can be quite tedious, having to scan through a list of reservations and sift through previous data for every guest. An AI tool would have the benefit of speeding up this process and allowing restaurant managers / leaders to focus their efforts towards other tasks.

Product:
Option 1 (Chosen):
Never worked in a restaurant before, but I assume that a morning huddle would take the form of a physical huddle, with all workers in the same space. I know a lot of restaurants have tablets that they use to track orders - could build a mobile app so that each worker would be able to take a look at what the information they need to know.

Option 2:
I believe that most restaurants have some screen within their facility all workers would be able to look at (ex. a large monitor). Could have one display to show this information (may be difficult if information needs to be brought up again).

Features:
automation for  gathering and presenting relevant reservations and guest insights (e.g., dietary restrictions, special occasions, VIP status).
show the day’s reservations and guest insights
reservations / guests can be presented as cards for each day that can be clicked into to display more specific information
these cards can be tagged with flags showing VIP status, dietary restrictions, and special occasions for quicker glances
front-of-house vs back-of-house
i believe this tool would be much more helpful for the front of house given that there is more qualitative analysis that they must undertake which AI can assist
want workers to be able to focus on just what they need to know rather than overloading them with information, so we can have two links, one for front-of-house, one for the back-of-house
(i will focus on building front-of-house and then back-of-house if there is time)

Concerns:
scalability?
I believe this design is scalable for any size of restaurant, since it effectively models the existing process for morning huddles
adoption?
I believe this is highly adoptable, given that I’d imagine a similar process already occurs during morning huddles most likely just with handmade notes

Building:
compile the data and use LLMs to extract the important information, filling out the important categories needed to create a guest profile
data is then persisted through to the frontend which populates the dashboard
agentism???
data pipelines don’t really exist right now, but with them in place, could have an AI agent that runs every morning to compile this information prior to morning huddle

source - https://www.pushoperations.com/blog/restaurant-management-the-value-of-pre-shift-huddles 

talks about education, engagement, and motivation, how does our product address these?
education - super accessible info within our product
engagement - clean user interface
motivation - keeps meetings short
