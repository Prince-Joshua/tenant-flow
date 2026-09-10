"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type DocumentMenuId =
  | "export"
  | "email"
  | "share"
  | "comments"
  | "approval";

type DocumentActionsMenuContextValue = {
  openMenu: DocumentMenuId | null;
  toggleMenu: (id: DocumentMenuId) => void;
  closeMenu: (id?: DocumentMenuId) => void;
};

const DocumentActionsMenuContext =
  createContext<DocumentActionsMenuContextValue | null>(null);

/**
 * Wraps the Export / Email / Share / Comments dropdowns for a document so
 * only one of them can be open at a time.
 */
export function DocumentActionsMenuProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [openMenu, setOpenMenu] = useState<DocumentMenuId | null>(null);

  const toggleMenu = useCallback((id: DocumentMenuId) => {
    setOpenMenu((current) => (current === id ? null : id));
  }, []);

  const closeMenu = useCallback((id?: DocumentMenuId) => {
    setOpenMenu((current) => {
      if (id && current !== id) return current;
      return null;
    });
  }, []);

  const value = useMemo(
    () => ({ openMenu, toggleMenu, closeMenu }),
    [openMenu, toggleMenu, closeMenu],
  );

  return (
    <DocumentActionsMenuContext.Provider value={value}>
      {children}
    </DocumentActionsMenuContext.Provider>
  );
}

export function useDocumentActionMenu(id: DocumentMenuId) {
  const ctx = useContext(DocumentActionsMenuContext);
  if (!ctx) {
    throw new Error(
      "useDocumentActionMenu must be used within a DocumentActionsMenuProvider",
    );
  }
  const { openMenu, toggleMenu, closeMenu } = ctx;

  return {
    isOpen: openMenu === id,
    toggle: () => toggleMenu(id),
    close: () => closeMenu(id),
  };
}
