import { AddForm } from "../components";
import { Result } from "../classes";

export function EditMovie(props: any) {
  const data: Result =
    props.location.state && props.location.state.details
      ? props.location.state.details
      : null;

  return (
    <div>
      Lemme Edit a movie
      <AddForm data={data} />
    </div>
  );
}
