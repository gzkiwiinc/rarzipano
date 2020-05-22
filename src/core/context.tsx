import { createContext } from 'react';

export interface Context
{
	[key: string]: unknown | undefined;
}

export const MarzipanoContext = createContext<any>({});
export const { Provider, Consumer } = MarzipanoContext;
