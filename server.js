const http = require("http");
const { v4: uuidv4 } = require("uuid");
const corsHeader = require("./corsHeader");
const { successHandle, errorHandle } = require("./responseHandle");
const todos = [];

const requestListener = (req, res) => {
  let body = "";

  req.on("data", chunk => {
    body += chunk;
  });

  if(req.url == "/todos" && req.method == "GET"){
    successHandle(res, todos);
  }else if(req.url == "/todos" && req.method == "POST"){
    req.on("end", () => {
      try{
        const title = JSON.parse(body).title;
        if(title !== undefined){
          const todo = {
            "title": title,
            "id": uuidv4()
          };
          todos.push(todo);
          successHandle(res, todos);
        }else{
          errorHandle(res, 400, "資料未填寫正確");
        }
      }catch{
        errorHandle(res, 400, "格式未填寫正確");
      }
    });
  }else if(req.url == "/todos" && req.method == "DELETE"){
    todos.length = 0;
    successHandle(res, todos);
  }else if(req.url.startsWith("/todos") && req.method == "DELETE"){
    const id = req.url.split("/").pop();
    const index = todos.findIndex(element => element.id == id);
    if(index !== -1){
      todos.splice(index, 1);
      successHandle(res, todos);
    }else{
      errorHandle(res, 400, "無此 todo ID");
    }
  }else if(req.url.startsWith("/todos") && req.method == "PATCH"){
    req.on("end", () => {
      try{
        const id = req.url.split("/").pop();
        const index = todos.findIndex(element => element.id == id);
        const title = JSON.parse(body).title;
        if(index !== -1){
          if(title !== undefined){
            todos[index].title = title;
            successHandle(res, todos);
          }else{
            errorHandle(res, 400, "資料未填寫正確");
          }
        }else{
          errorHandle(res, 400, "無此 todo ID");
        }
      }catch{
        errorHandle(res, 400, "格式未填寫正確");
      }
    });
  }else if(req.method == "OPTIONS"){
    res.writeHead(200, corsHeader);
    res.end();
  }else{
    errorHandle(res, 404, "無此網站路由");
  }
};

const server = http.createServer(requestListener);

server.listen(process.env.PORT || 3005);