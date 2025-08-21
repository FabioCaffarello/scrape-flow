import { AppNodeMissingInputs } from "@/types/appNode";
import {
  Dispatch,
  SetStateAction,
  createContext,
  ReactNode,
  useState,
} from "react";

type FlowValidationCentextType = {
  invalidInputs: AppNodeMissingInputs[];
  setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
  clearErrors: () => void;
};

export const FlowValidationContext =
  createContext<FlowValidationCentextType | null>(null);

export function FlowValidationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [invalidInputs, setInvalidInputs] = useState<AppNodeMissingInputs[]>(
    [],
  );
  const clearErrors = () => {
    setInvalidInputs([]);
  };
  return (
    <FlowValidationContext.Provider
      value={{
        invalidInputs,
        setInvalidInputs,
        clearErrors: clearErrors,
      }}
    >
      {children}
    </FlowValidationContext.Provider>
  );
}
