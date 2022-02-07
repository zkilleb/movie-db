import { AddForm } from '../components';
import { Result } from '../classes';

export function EditMovie(props: IEditProps) {
  const data: Result = props.location.state.details;

  return (
    <div>
      Lemme Edit a movie
      <AddForm data={data} />
    </div>
  );
}

interface IEditProps {
  location: {
    state: {
      details: Result;
    };
  };
}
