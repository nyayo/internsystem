import { useCallback, useState } from "react";

export default function useModalState(initialValue = null) {
  const [modalData, setModalData] = useState(initialValue);

  const openModal = useCallback((data = true) => {
    setModalData(data);
  }, []);

  const closeModal = useCallback(() => {
    setModalData(initialValue);
  }, [initialValue]);

  return {
    modalData,
    isOpen: Boolean(modalData),
    openModal,
    closeModal,
    setModalData,
  };
}
