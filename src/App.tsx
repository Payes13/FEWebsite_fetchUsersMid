import { useEffect, useState, useRef, useMemo } from 'react'

import { UsersList } from './components/UsersList'
import { SortBy, type User } from './types.d'
import './App.css'

function App() {
  const [users, setUsers] = useState<User[] | null>(null)
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const originalUsers = useRef<User[]>([])
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=100')
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) { // Verifica que data.results tenga valor
          setUsers(data.results);
          originalUsers.current = data.results;
        }
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const toggleSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
    // setSortByCountry(() => !sortByCountry)

    // setSortByCountry(prevState => !prevState)
  }

  const filteredUsers = useMemo(() => {
    return typeof filterCountry === 'string' && filterCountry.length > 0
      ? users?.filter(user => {
        return user.location.country.toLocaleLowerCase().includes(filterCountry.toLocaleLowerCase())
      })
      : users
  }, [filterCountry, users])

  const sortedUsers = useMemo(() => {
    if(sorting === SortBy.NONE) return filteredUsers

    if(sorting === SortBy.NAME) {
      return filteredUsers?.toSorted((a, b) => {
        return a.name.first.localeCompare(b.name.first)
      })
    }

    if(sorting === SortBy.LAST) {
      return filteredUsers?.toSorted((a, b) => {
        return a.name.last.localeCompare(b.name.last)
      })
    }

    if(sorting === SortBy.COUNTRY) {
      return filteredUsers?.toSorted((a, b) => {
        return a.location.country.localeCompare(b.location.country)
      })
    }
  }, [filteredUsers, sorting])

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter(user => user.email !== email)
    setUsers(filteredUsers)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  return (
    <div className='App'>
      <h1>Fetch Users</h1>

      <header>
        <h3>Users: {users?.length}</h3>

        <button onClick={toggleColors}>Colors</button>
        <button onClick={toggleSortByCountry}>Sort by Country</button>
        <button onClick={handleReset}>Reset Original State</button>

        <input onChange={(e) => setFilterCountry(e.target.value)} placeholder='Filtra por pais' type="text" />
      </header>

      <main>
        <UsersList changeSorting={handleChangeSort} deleteUser={handleDelete} showColors={showColors} users={sortedUsers} />
      </main>
    </div>
  )
}

export default App
