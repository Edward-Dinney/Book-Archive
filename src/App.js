import React, { useEffect, useState } from "react";
import { db } from "./components/firebase"
import { collection, doc, setDoc, addDoc, getDocs, query,where} from 'firebase/firestore';
import './App.css';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import AuthDetails from './components/AuthDetails.jsx';


function App() {

  const [data, setData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState(null);
  const [showComp, setShowComp] = useState(false);
  const [showSign, setshowSign] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const usersCollectionRef = collection(db, 'users');
  const [favoritesData, setFavoritesData] = useState([]);
 
  useEffect(() => {
    const URL = "https://www.googleapis.com/books/v1/volumes?q=${b}";

    async function fetchLibrary() {
      try {
        const response = await fetch(URL);
        const json = await response.json();
        setLoading(true);
        setData(json.items);
      } catch (error) {
        setError(error); 
        setLoading(false);
      } 
    }
  

    fetchLibrary(); 
  }, []); 

  function onSearchFromChange(event) {
    setSearchTerm(event.target.value);
  }
  function toggleDisplay() {
    setShowComp(!showComp);
  }
  function toggleSignup() {
    setshowSign(!showSign);
  }

  function onLoginSuccess(userUid) {
    setIsLoggedIn(true);
    setUserId(userUid);
    //fetchFavoritesForUser(userUid); // Fetch favorites from database for this user
  }

  useEffect(() => {
    async function fetchFavorites() {
      if (!userId) {
        console.log("User ID is null, cannot fetch favorites.");
        return;
      }

      try {
        const userFavoritesCollectionRef = collection(db, 'favorites', userId, 'books');
        const querySnapshot = await getDocs(userFavoritesCollectionRef);

        const fetchedFavorites = querySnapshot.docs.map(doc => doc.data());
        setFavoritesData(fetchedFavorites);
      } catch (error) {
        console.error("Error fetching favorites: ", error);
      }
    }

    fetchFavorites();
  }, [userId]);

  useEffect(() => {
    async function updateFavorites() {
      if (!userId) {
        console.log("User ID is null, cannot update favorites.");
        return;
      }

      try {
        const userFavoritesCollectionRef = collection(db, 'favorites', userId, 'books');

        for (const favorite of favorites) {
          const favoriteData = {
            Title: favorite.title,
            Author: favorite.authors,
            Description: favorite.description,
            Thumbnail: favorite.thumbnail,
          };
  
          await addDoc(userFavoritesCollectionRef, favoriteData);
        }
        console.log("Favorites updated successfully");
      } catch (error) {
        console.error("Error updating favorites: ", error);
      }
    }

    if (favorites.length > 0) {
      updateFavorites();
    }
  }, [favorites, userId]);
  
  function addToFavorites(book){
    const bookToSave = {
      title: book.title,
      authors: book.authors, 
      description: book.description,
      thumbnail: book.imageLinks?.thumbnail,
    };

    const newFavorites = [...favorites, bookToSave];
    setFavorites(newFavorites);
    // sendFavoritesToDatabase(newFavorites);
  };

return (
      <>
      {!isLoggedIn ? (
        <>
          {!showSign&&<Login onLoginSuccess={(userUid) => onLoginSuccess(userUid)} />}
          {!showSign&&<button onClick={() => toggleSignup()}>Create Account</button>}
          {showSign && <Signup/>}
          {showSign && <button onClick={() => toggleSignup()}>Log In</button>}
          </>
      ) : (
        <>
        
      {<form >
        <h4>Search here: </h4>
        <input  onChange={onSearchFromChange} type="text" />
      </form>}
      {(searchTerm) && <Results searchTerm={searchTerm} bookarray={data} onAddToFavorites={addToFavorites}/>}
      {showComp && (!searchTerm) && <Favorites APIData={favoritesData}/>}
      {!showComp && (!searchTerm) && <Display APIData={data} onAddToFavorites={addToFavorites}/>}
      <button onClick={() => toggleDisplay()}>View Favorites</button>
      {<AuthDetails/>}
        </>
      )}
      </>
    );
}

function Display({ APIData, onAddToFavorites }) {
  return (
    <>
      
      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Description</th>
            <th>Cover</th>
            <th>Favorite</th>
          </tr>
        </thead>
        <tbody>
          {APIData.map((t, index) => (
            <tr key={index}>
              <td>
                <b>{t.volumeInfo.title}</b>
              </td>
              <td>
                <b>{t.volumeInfo.authors}</b>
              </td>
              <td>
                <b>{t.volumeInfo.description}</b> 
              </td>
              <td>
              {t.volumeInfo.imageLinks?.thumbnail ? (
                <img src={t.volumeInfo.imageLinks.thumbnail} alt={t.volumeInfo.title} style={{ width: '100px', height: 'auto' }} />
              ) : (
                <span>No Cover</span>
              )}
            </td>
            <td>
            <button type="button" onClick={() => onAddToFavorites(t.volumeInfo)}>Favorite</button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function Results({searchTerm, bookarray, onAddToFavorites}) {
  const filteredBooks = bookarray.filter(book => {
    let title = book.volumeInfo.title ? book.volumeInfo.title.toLowerCase() : "";
    let authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ').toLowerCase() : "";
    return (
      searchTerm !== "" &&
      (title.includes(searchTerm.toLowerCase()) ||
      authors.includes(searchTerm.toLowerCase()))
    );
  });
  

  let numberResults = filteredBooks.length;

  return (
    <>
      {numberResults > 0 && <h4>Search Results</h4>}
      <h4>There are {numberResults} search results</h4>
      {numberResults === 0 && <h4>No book information available</h4>}
      {filteredBooks.map((t, index) => (
        <p key={index}>
          <b>Title: {t.volumeInfo.title}</b>,<b>Author: <i>{t.volumeInfo.authors?.join(', ')}</i></b> , {t.volumeInfo.imageLinks?.thumbnail ? (
            <img src={t.volumeInfo.imageLinks.thumbnail} alt={t.volumeInfo.title} style={{ width: '100px', height: 'auto' }} />
          ) : (
            <span>No Cover</span>
          )}  <button type="button" onClick={() => onAddToFavorites(t.volumeInfo)}>Favorite</button>
        </p>
      ))}
    </>
  );
}

function Favorites(props){
  console.log("Favorites Data:", props.APIData);
  return (
    <>
      <h1>Favorites</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Description</th>
            <th>Cover</th>
          </tr>
        </thead>
        <tbody>
          {props.APIData.map((t, index) => (
            <tr key={index}>
              <td>
                <b>{t.Title}</b>
              </td>
              <td>
                <b>{t.Authors}</b>
              </td>
              <td>
                <b>{t.Description}</b> 
              </td>
              <td>
              {t.Thumbnail ? (
                <img src={t.Thumbnail} alt={t.Title} style={{ width: '100px', height: 'auto' }} />
              ) : (
                <span>No Cover</span>
              )}
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
