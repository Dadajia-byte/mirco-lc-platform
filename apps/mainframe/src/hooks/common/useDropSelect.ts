import { useState, useCallback } from 'react';
export interface DropSelectOption {
  value: string | number;
  label: string;
}
interface DropSelectState {
  isOpen: boolean;
  position: {
    x: number;
    y: number;
  } | null;
  options: Array<DropSelectOption>;
}
const useDropSelect = () => {
  const [state, setState] = useState<DropSelectState>({
    isOpen: false,
    position: null,
    options: [],
  });
  const openDropSelect = useCallback((x: number, y: number, options: Array<DropSelectOption>) => {
    setState({
      isOpen: true,
      position: { x, y },
      options,
    });
  }, []);
  const closeDropSelect = useCallback(() => {
    setState({
      isOpen: false,
      position: null,
      options: [],
    });
  }, []);
  return {
    isOpen: state.isOpen,
    position: state.position,
    options: state.options,
    openDropSelect,
    closeDropSelect,
  }
}
export default useDropSelect;