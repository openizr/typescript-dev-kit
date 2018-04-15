/**
 * Copyright 2016 - present, Matthieu Jabbour <matthieu.jabbour@gmail.com>.
 * All rights reserved.
 */


/** This declaration is necessary to import JSON files into TypeScript files. */
declare module '*.json';


/** JSON type definition. */
type basic = string | number | boolean | null | object;
interface jsonArray extends Array<basic | jsonObject | jsonArray> {}
interface jsonObject { [x: string]: basic | jsonObject | jsonArray; }
type json = basic | jsonObject | jsonArray;
