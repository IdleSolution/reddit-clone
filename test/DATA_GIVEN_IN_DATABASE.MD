There were no migrations available so I have some data in the database at the start of the tests (a bit painful, lesson learned):


##USERS:

First user<br/>
- id: 26<br/>
- username: test<br/>
- email: test@gmail.com<br/>
- password: test<br/>

Second user<br/>
- id: 510<br/>
- username: test3<br/>
- email: test3@gmail.com<br/>
- password: test3<br/>



##POSTS:

First post<br/>
- id: 44<br/>
- title: test1<br/>
- text: asomfaspkifmasa<br/>
- user_id: 26<br/>
- subreddit_id: 2<br/>


##POST_VOTES
- id: 41<br/>
- post_id: 44<br/>



##COMMENTS:

First comment<br/>
- id: 29<br/>
- text: test<br/>
- user_id: 26<br/>
- post_id: 44<br/>


##COMMENT_VOTES
- id: 29<br/>
- comment_id: 29<br/>


##SUBREDDITS
- id: 2<br/>
- name: test<br/>
- moderator: 26<br/>