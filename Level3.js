// Level 3 REST API (HATEOAS)
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const HOST = '0.0.0.0';
const PORT= 8080;

app.use( bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Posts
const posts= [
    { id: 1, text: 'bla 1', time: '9:00'},
    { id: 2, text: 'bla, blai 2', time: '9:02'} ,
    { id: 3, text: 'bla, blai, blai 3', time: '9:05'} 
];

//Generate hypermedia links function for create, edit, delete


// Generate hypermedia links function for post
const generatePostLinks = (postId) => {
    return [

        { rel: 'self', href: `/posts/${postId}` },
        { rel: 'edit', href: `/posts/${postId}`, method: 'PUT' },
        { rel: 'delete', href: `/posts/${postId}`, method: 'DELETE' }
   ];
}


//Get all posts
app.get('/posts', (req, res) => {
    const postsWithLinks = posts.map(post => {
        return {
            ...post,
            links: generatePostLinks(post.id)
        };
    });

    res.json({ posts: postsWithLinks });
});

// Route to get a post by id
app.get('/posts/:id', (req, res) => {
    const postId = req.params.id;
    const post = posts.find(p => p.id === parseInt(postId));
    if (!post) {
        res.status(404).send('The post with the given ID was not found.');
    } else {
        const postWithLinks = {
            ...post,
            links: generatePostLinks(postId)
        };
        res.json(postWithLinks);
    }
});

//Create a new post with hypermedia links
app.post('/posts', (req,res) => {
    const id = req.body.id;
    const text = req.body.text;
    const time = req.body.time;
    posts.push({id: id, text: text, time: time});
    const postWithLinks = {
        ...posts,
        links: generatePostLinks(id)
    };
    res.json(postWithLinks);
});

// Update a post by ID
app.put('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const { text, time } = req.body;
    const index = posts.findIndex((p) => p.id === postId);
  
    if (index === -1) {
      res.status(404).json({ error: 'The post with the given ID was not found' });
    } else {
      posts[index] = { id: postId, text, time  };
  
      const updatedPostWithLinks = {
        ...posts[index],
        links: generatePostLinks(postId),
      };
  
      res.json(updatedPostWithLinks);
    }
  });
  
  

// Delete a post by ID
app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const index = posts.findIndex((p) => p.id === postId);
  
    if (index === -1) {
      res.status(404).json({ error: 'The post with the given ID was not found' });
    } else {
      posts.splice(index, 1);
      res.status(204).send();
    }
  } );

// Start the server  
app.listen(PORT, HOST);


console.log(`Running on http://${HOST}:${PORT}`);