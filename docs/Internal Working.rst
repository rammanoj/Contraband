=======
Internal Working
=======


In the **Usage** section, we discussed the architecture and how to use the tool. Let's extend the discussion 
with a complete note of how the tool works internally.

We shall start our discussion with the schema diagram of the tool.

.. image:: ./schema.png

As you can see above, there are four tables:

1. Query.
2. Query users.
3. Query Filters.
4. List commits.

**Query** has the data regarding the ``hash``, ``created time`` etc. The usernames of the wikimedians that the user provided during the query creation will be stored in **Query users** table. All the filters associated with the query will be stored in **Query Filters** table.

Whenever a request of creating a query hits the server, initially a class named ``AddQueryUser`` view is triggered. The view creates a Query with a hash and adds the provided usernames data to the query. This also creates a default set of filters and returns a redirect to ``/<hash>`` URL.

The URL triggers ``DisplayResult`` view. This view performs external API requests, fetches the details and store the fetched data in the databases. It also formats the data and returns the data to the browser as an HTTP response.
Let's dig deep into the working of ``DisplayResult`` view. 

This view uses ``asyncio`` and ``aiohttp`` to perform API requests in a parallel manner. There are few constraints with the existing Phabricator and Gerrit APIs. Both of them can not return the count of contributions made by a particular user. They will return the contributions made by the user in the form of a list of JSON objects. The good thing about ``Gerrit`` is it returns contributions of all the users with a single API request. But in the case of phabricator, it will paginate the results with a max of 100 contributions in each page Fo example, if a user performed 1000 different actions in phabricator. then
10 API requests are to be made to get all the actions performed. Another constraint is that all the API requests are to be made sequentially. The API requests can not be parallel because each page has to be requested with a reference(except the first one). The reference to a page **n** will be provided on page **n-1**.
Suppose if you have to get the commits of the user in the 7th page, you have to request the 6th page first to get the reference to the 7th page. To get the 6th page you have to request the 5th page and so on.

So, even if I want to get some page **n** you have to get all the details from **1 to n**. 

In this tool, all the contributions of the user from Gerrit are being fetched. But in the case of phabricator, two kinds of tasks are taken into count:

1. Tasks owned by the user.
2. Tasks assigned to the user.

**DisplayResult** view gets all the data required to perform the external API requests and call another function ``getDetails``. This function takes the data and formats it according to the requirement. It also creates a new **asyncio event loop**.
This loop is given with three different co-routines. (If you are not familiar with event loops and co-routines, they are used to perform threading programmatically, you can get more information about them `here <https://docs.python.org/3/library/asyncio.html>`_). 

.. code-block:: python

   async def get_data(urls, request_data, loop, gerrit_response, phab_response, phid):
       tasks = []
       async with ClientSession() as session:
           tasks.append(loop.create_task((get_gerrit_data(urls[1], session, gerrit_response))))
           tasks.append(loop.create_task((get_task_authors(urls[0], request_data[0], session, phab_response, phid))))
           tasks.append(loop.create_task((get_task_assigner(urls[0], request_data[1], session, phab_response))))
           await asyncio.gather(*tasks)

The above code adds three tasks to the event loop. Each of the task fetches APIs and get information. 

1. ``get_gerrit_data()``: fetch contributions user from gerrit.
2. ``get_task_authors()``: fetch tasks owned by a user in phabricator.
3. ``get_task_assigner()``: fetch tasks assigned to a user in phabricator.

``get_gerrit_data()`` perform a single API request and gets all the details of the users.
``get_task_authors()`` and ``get_task_assigner()`` gets the data but, as discussed above, phabricator APIs are paginated. So, these two co-routines has to
request the data again and again, until there are no more pages left behind to request.

These are parallel because, let's assume there are two tasks **task1** and **task2**, initially, the loop started executing **task1**. If **task1** performs any API request, it has to wait till the response is received to proceed further. So, whenever the **task1**
performs an API request, **asyncio** stores the state of **task1** and start executing **task2**. When the response to the **task1** is received, it stores the current task and executes the **task1** further.

Once the entire data are received, it is formatted and stored in the table ``List Commits``. Apart from storing them in databases, the commits that meet the requirement of all the Query filters are taken and the response is returned to the user.
For the sake of performance, the contributions of at the max. of past one year are being requested.  

Whenever the filters of a query are changed, if the filter "status of commit" is only changed, then there is no need to request external APIs, as all the commits are available here. So, databases are queried and the contributions that match the current filters are returned.
If the timestamps are changed, then the external APIs are requested again and the details are fetched.

The view ``GetUserCommits`` returns all the commits of a user on a particular date.

**sequence diagram:**

.. image:: ./sequence.jpg


If you want to know more about the tool, you can refer to the API documentation from `here <https://documenter.getpostman.com/view/6222710/SVYurxMj?version=latest>`_.
