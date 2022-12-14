import { equals, pathOr } from "remeda";

type NamedNode = {
  type: {
    name: string;
  };
};

export const isEqualComponentType = (
  component1: React.ReactNode,
  component2: React.ReactNode
) => {
  return (
    (pathOr(component1, ["type", "name"], undefined) ? true : false) &&
    equals(
      (component1 as NamedNode).type.name,
      (component2 as NamedNode).type.name
    )
  );
};
