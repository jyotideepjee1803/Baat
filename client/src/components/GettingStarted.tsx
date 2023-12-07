import { GroupAdd, Search } from "@mui/icons-material";

const GettingStarted = () => {
  const iconWrapperStyles = "text-light border d-inline-block rounded-pill";

  return (
    <div
      className="w-75 mt-4 mx-auto"
      style={{ color: "lightblue", fontSize: 18 }}
    >
      <p>
        Click on{" "}
        <span className={`${iconWrapperStyles} px-2`}>
          <Search />
        </span>{" "}
        button at the left, to search users by name or email.
      </p>
      <p>
        You can also click on{" "}
        <span
          className={`${iconWrapperStyles}`}
          style={{ padding: "0px 10px 3px 13px" }}
        >
          <GroupAdd />
        </span>{" "}
        create a group and add members in the group.
      </p>
      <p style={{ color: "#F2AFEC" }}>
        Enter{" "}
        <span className={`${iconWrapperStyles} bg-secondary border-0 px-2`}>
          .
        </span>{" "}
        in search box to list all users.
      </p>
    </div>
  );
};

export default GettingStarted;
