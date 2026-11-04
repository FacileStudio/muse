import type { Catalogs } from '../translate.js';
import { de } from './de.js';
import { en, type MuseMessages } from './en.js';
import { es } from './es.js';
import { fr } from './fr.js';

export type { MuseKey, MuseMessages } from './en.js';

export const museMessages: Catalogs<MuseMessages> = { en, fr, es, de };
