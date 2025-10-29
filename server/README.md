# Welcome to the backend!

In `server/app/db`, you'll notice there is a file titled `init.sql`. This is a SQL script that we are using to generate dummy data for development purposes only. 
This script operates on the listings table. You should copy and paste this script into a database manager, such as DBeaver. Here are the steps to use the script:

2. Install DBeaver Community: https://dbeaver.io/download/
3. Form a new connection to your local database using the username and password provided. Use `localhost` as the host.
4. Once you've established the connection, click the dropdown on your new connection until you see `user` and `listings_table`. These are our tables in the database.
5. If you do not have any users in your `users` table, sign up for an account on GatorMarket.
6. You may need to disconnect from and reconnect to the database to see the changes.
7. Navigate to "SQL Editor" and click "Open SQL Script".
8. Copy the script `init.sql` into the text editor.
9. Navigate to the `user` table and view the data. Click on the field containing `id`, and copy it.
10. Navigate back to the script. You'll notice that each value inserted has the following structure:
```
    (
        'INSERT_SELLER_ID_HERE',
        'College Algebra Textbook',
        'A college algebra textbook for all your studying needs.',
        6567,
        'ACTIVE',
        NOW(),
        NOW()
    ),
```

11. For each value, change `'INSERT_SELLER_ID_HERE'` to the `id` that you copied from your user. This will link your user to this listing value.
12. Do this for each value in the script (don't worry, there are only 5 placeholders total).

This is a little messy, but it's for dev purposes only, since we do not have all the CRUD operations in our database yet. 
