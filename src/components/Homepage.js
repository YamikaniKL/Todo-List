import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import "./homepage.css";
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar } from "@mui/material";

export default function Homepage() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUidd, setTempUidd] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // read
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).map((todo) => {
              setTodos((oldArray) => [...oldArray, todo]);
            });
          }
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // add
  const writeToDatabase = () => {
    const uidd = uid();
    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
      todo: todo,
      uidd: uidd
    });

    setTodo("");
  };

  // update
  const handleUpdate = (todo) => {
    setIsEdit(true);
    setTodo(todo.todo);
    setTempUidd(todo.uidd);
  };

  const handleEditConfirm = () => {
    update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
      todo: todo,
      tempUidd: tempUidd
    });

    setTodo("");
    setIsEdit(false);
  };

  // delete
  const handleDelete = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`));
  };

  return (
    <div className = 'homepage'>
     <div className = 'homepage__header'>
      <div  className = "homepage__input-container">
        <input type = 'text' 
        placeholder="Add To Do"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}/>
        <button  onClick={writeToDatabase} >Add To Do</button>
      </div>
     </div>
     {todos.map((todo) => (
        <div className="todo">
          <h1>{todo.todo}</h1>
          <div className ='homepage__icons' > 
          
          <PublishedWithChangesIcon
            fontSize="large"
            onClick={() => handleUpdate(todo)}
            className="edit-button"
          />
          <HighlightOffIcon
            fontSize="large"
            onClick={() => handleDelete(todo.uidd)}
            className="delete-button"
          />
           </div>
        </div>
      ))}
      <Avatar className = "homepage__avatar" onClick={handleSignOut}/> 
    </div>
  );
}
