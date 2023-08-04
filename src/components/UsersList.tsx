import { SortBy, type User } from "../types.d"

interface Props {
  users: User[]
  showColors: boolean
  deleteUser: (email: string) => void
  changeSorting: (sort: SortBy) => void
}

export const UsersList = ({ users, showColors, deleteUser, changeSorting }: Props) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Picture</th>
          <th className="pointer" onClick={() => changeSorting(SortBy.NAME)}>First Name</th>
          <th className="pointer" onClick={() => changeSorting(SortBy.LAST)}>Last Name</th>
          <th className="pointer" onClick={() => changeSorting(SortBy.COUNTRY)}>Country</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {
          users?.map((user, index) => {
            const isEven = index % 2 == 0
            const color = isEven ? '#333' : '#555'

            return (
              <tr style={{ backgroundColor: showColors ? color : 'transparent' }} key={user.email}>
                <td>
                  <img src={user.picture.thumbnail} alt={user.name.first} />
                </td>
                <td>{user.name.first}</td>
                <td>{user.name.last}</td>
                <td>{user.location.country}</td>
                <td>
                  <button onClick={() => deleteUser(user.email)}>Delete</button>
                </td>
              </tr>
            )
          })
        }          
      </tbody>
    </table>
  )
}