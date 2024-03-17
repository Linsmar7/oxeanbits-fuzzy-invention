import { GridCustomCellProps } from "@progress/kendo-react-grid";
import './styles.css';

export const PokemonName = (props: GridCustomCellProps) => {
  const { dataItem } = props;

  if (!dataItem || !dataItem.sprites.front_default) {
    return dataItem.name;
  }

  return (
    <td {...props.tdProps} className="pokemon-name">
      <img src={dataItem.sprites.front_default} width="64" height="64" />
      <span>
        {dataItem.name}
      </span>
    </td>
  );
};
