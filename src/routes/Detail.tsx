import { makeStyles } from "@material-ui/core/styles";

export function Detail(props: any) {
  const classes = useStyles();
  const data = props.location.state.details
    ? props.location.state.details
    : null;

  return (
    <div>
      {data ? (
        <div className={classes.header}>{data.title}</div>
      ) : (
        <div className={classes.header}>No movie provided</div>
      )}
    </div>
  );
}

const useStyles = makeStyles(() => ({
  header: {
      fontSize: 20,
      color: "white"
  },
}));
