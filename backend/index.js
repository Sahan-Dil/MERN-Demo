import express, { request, response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";

const app = express();

//middleware for save a request(error that say cant identified properties of json)
app.use(express.json());

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send(`welcome`);
});

//save a book
app.post("/books", async (request, response) => {
  try {
    //validation
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response
        .status(400)
        .send({
          message: ~`Send all required fields : title, author and publish year`,
        });
    }

    const newBook = {
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear,
    };
    const book = await Book.create(newBook);
    return response.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

//get all  books
app.get("/books", async (request, response) => {
  try {
    const books = await Book.find({});
    return response.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

//get book by id
app.get("/books/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const book = await Book.findById(id);
    return response.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

// update book
app.put("/books/:id", async (request, response) => {
  try {
    //validation
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response
        .status(400)
        .send({
          message: ~`Send all required fields : title, author and publish year`,
        });
    }
    const {id} = request.params;
    const result = await Book.findByIdAndUpdate(id,request.body);
    if(!result){
        return response.status(404).json({message:"book not found"});

    }else{
        return response.status(200).json({message:"book updated successfully"});

    }

  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

//delete book
app.delete("/books/:id", async (request, response) => {
    try {
        const {id} = request.params;
        const result = await Book.findByIdAndDelete(id);
        if(!result){
            return response.status(404).json({message:"book not found"});
    
        }else{
            return response.status(200).json({message:"book deleted successfully"});
    
        }

    } catch (error) {
      console.log(error.message);
      return response.status(500).send({ message: error.message });
    }
  });

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("app connected to the mongo db");
    app.listen(PORT, () => {
      console.log(`App is running on port : ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
