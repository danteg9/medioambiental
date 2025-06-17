import React, { createContext, useContext, useState } from "react";

import { es, enUS } from "date-fns/locale";

import { esES, enUS as muiEnUS } from '@mui/x-date-pickers/locales';

const localesDateFns = { es, en: enUS };
const localesMui = {
  es: esES.components.MuiLocalizationProvider.defaultProps.localeText,
  en: muiEnUS.components.MuiLocalizationProvider.defaultProps.localeText,
};

const IdiomaContext = createContext();

export const IdiomaProvider = ({ children }) => {
  const [idioma, setIdioma] = useState("es"); // o lo que venga del navegador / localStorage

  const localeDateFns = localesDateFns[idioma] || enUS;
  const localeMui = localesMui[idioma] || localesMui.en;

  return (
    <IdiomaContext.Provider
      value={{ idioma, setIdioma, localeDateFns, localeMui }}
    >
      {children}
    </IdiomaContext.Provider>
  );
};

export const useIdioma = () => useContext(IdiomaContext);