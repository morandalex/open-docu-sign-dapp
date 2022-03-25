/* Inizializzazione dello stato */
import React, { useState, createContext } from 'react'
const INITIAL_STATE = {
    test: 'state mounted'
}

export const StateContext = createContext(
    {
        state: INITIAL_STATE
    }

);