import React, { useEffect, useState } from "react";


function Home() {
  const [msg, setMsg] = useState("Loading data...");
  const [getInitUser, setInitUser] = useState([]);
  const [Users, setUsers] = useState([]);

  async function getUsers() {
    const method = "POST";
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const body = JSON.stringify({
      query: `
            {
              posts{
                data{
                  id
                  title
                  body
                  user{
                    id
                    username
                    
                  }
                  comments{
                    data{
                      id
                      name
                    }
                  }
                }
              }
            }
            `,
    });
    const response = await fetch("https://graphqlzero.almansi.me/api", {
      method,
      headers,
      body,
    });
    const data = await response.json();
    setUsers(data?.data?.posts?.data);
  }

  useEffect(() => {
    getUsers();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    if(!getInitUser.length) setInitUser(_=>Users.slice());
    const filter = getInitUser?.filter(
      (user) =>
        user?.user?.username?.toLowerCase() === e.target.name.value.toLowerCase()
    );

    if(!filter.length) setMsg(_=> 'No result found')
    setUsers(_=>filter)
  };
  
  const handleSearch = e => {
    e.preventDefault()
    const tag = e.target.search || e.target
    if(!getInitUser.length) setInitUser(_=>Users.slice());
    const searched = []
    getInitUser?.forEach(
      (user) =>{
        const d= user?.title?.toLowerCase().indexOf(tag.value.toLowerCase());
        console.log(d)
        if(d !== -1) searched.push(user)
      })

      console.log(searched)
    if(!searched.length) setMsg(_=> 'No result found')
    else setUsers(_=>searched)
    if(tag.value=== '') setUsers(_=>getInitUser)
  }

    return (
      <div>
        <h1 className="m-auto mt-4 text-secondary">Users Post</h1>
        <div className="m-auto w-100 p-5 ">
          <form className="d-flex justify-content-between " onSubmit={(e) => handleSearch(e)}>
        <input
          className="form-control m-5 "
          type="text"
          placeholder="Search by title"
          name='search'
          onChange={handleSearch}
        />
        <button className="h-50 m-5 py-3 px-5 btn btn-secondary" type="submit"
        >Search</button>
        </form>
        </div>
        <div className="row">
        <div className="col-6 ">
          <form className="d-flex justify-content-between " onSubmit={(e) => handleFilter(e)}>
        <input
          className="form-control m-5 p-3"
          type="text"
          placeholder="Filter by username"
          name='name'
          onChange={e=> {
            if(e.target.value === '') setUsers(_=>getInitUser)}}
        />
        <button className="h-50 m-5 py-3 px-5 btn btn-secondary" type="submit"
        >Filter</button>
        </form>
        </div>
        </div>

        <ul>
          <table className="table-fixed m-5">
            <thead className="border-bottom">
              <tr className="">
                <th className=" px-4 py-2">S/N</th>
                <th className="px-4 py-2">username</th>
                <th className=" px-4 py-2">Title</th>
                <th className="px-4 py-2">Post</th>
              </tr>
            </thead>
            {Users.length && Users?.map((user, index) => (
              <tbody key={user.id}>
                <tr className="">
                  <td className="border-bottom  px-4 py-2">{index+1}</td>
                  <td className="border-bottom px-4 py-2">{user?.user?.username}</td>
                  <td className="border-bottom px-4 py-2">{user?.title}</td>
                  <td className="border-bottom  px-4 py-2">{user?.body}</td>
                </tr>
              </tbody>
            )) || msg }
          </table>
          
        </ul>
      </div>
    );
  }

export default Home;
