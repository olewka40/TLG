import React, {
  useCallback,
  useState,
  memo,
  useEffect,
  useContext
} from "react";
import { SearchInput } from "./styled";
import { MenuItem } from "@material-ui/core";
import axios from "axios";
import { useRouter } from "next/router";
import { UserContext } from "../../../../context/user";

export const Searcher = memo(() => {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const { userId } = useContext(UserContext);
  const searchUsers = useCallback(async () => {
    const users = await axios.get("/api/getUsers");
    setUsers(users.data.users);
  }, [setUsers]);
  useEffect(() => {
    searchUsers();
  }, []);

  const toDialog = useCallback(async event => {
    const id = event.target.value;

    const { data } = await axios.post(`api/createDialog/${userId}/${id}`);
    // запушить новые диалоги в контекст
    router.push("/dialogs/[id]", `/dialogs/${data.newDialog._id}`);
  }, []);
  return (
    <SearchInput onChange={toDialog} inputProps={{ placeholder: "  Найти..." }}>
      {users.map(user => (
        <MenuItem value={user._id} key={user._id}>
          {user.login}
        </MenuItem>
      ))}
    </SearchInput>
  );
});
