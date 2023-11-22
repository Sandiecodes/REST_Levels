// CRUD Operations: Create, Read, Update, Delete

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const HOST = '0.0.0.0';
const PORT= 3001;

app.use( bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Posts
const posts= [
    { id: 1, text: 'bla 1', time: '9:00'},
    { id: 2, text: 'bla, blai 2', time: '9:02'} ,
    { id: 3, text: 'bla, blai, blai 3', time: '9:05'} 
];

// Get all posts (Read)
app.get('/getPosts', (req, res) => {
    res.json(posts);
  });

 // Route to get a post by id
app.get('/getPosts/:id', (req, res) => {
    const postId = req.params.id;
    const post = posts.find(p => p.id === parseInt(postId));
    if (!post) {
        res.status(404).send('The post with the given ID was not found.');
    } else {
        res.send(post);
    }
  }); 

// Route to add a post (Create)
app.post('/addPost', (req,res) => {
    const id = req.body.id;
    const text = req.body.text;
    const time = req.body.time;
    posts.push({id: id, text: text, time: time});
    res.json(posts);
});  

// Route to update a post (Update)
app.put('/updatePost/:id', (req,res) => {
    const id = req.params.id;
    const text = req.body.text;
    const time = req.body.time;
    const index = posts.findIndex(post => post.id == id);

    if (index == -1) {
        res.status(404).send('The post with the given ID was not found.');
    } else {
        posts[index] = {id: id, text: text, time: time};
        res.json(posts[index]);
    }
});

// Route to delete a post (Delete)
app.delete('/deletePost/:id', (req,res) => {
    const id = req.params.id;
    const index = posts.findIndex(post => post.id == id);

    if (index == -1) {
        res.status(404).send('The post with the given ID was not found.');
    } else {
        posts.splice(index, 1);
        res.json(posts);
    }
});

// Start the server  
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);



