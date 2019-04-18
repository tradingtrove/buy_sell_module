Once you've picked an DBMS, update your API to correctly make use if the new DBMS.
Extend the existing API to support all CRUD operations:
Create / POST - create a new item
Read / GET - read an item
Update / PUT - update an item
Delete / DELETE - delete an item
Be sure to select the appropriate routes for each of these actions so they conform to the REST standard.


Read - '/api/accounts/:account_number''/api/stocks/:ticker' Stocks - JSON Object from File

Read - /api/accounts/:account_number' Accounts - JSON Object from File