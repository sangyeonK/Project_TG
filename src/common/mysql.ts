import config from './config';
import * as mysql from 'mysql';

let connectionPool = mysql.createPool(config.database);

export function getConnection(callback : (err : NodeJS.ErrnoException, connection : mysql.IConnection) => any) : void {
  connectionPool.getConnection(callback);
}

export function makeUpdateExpr(params : Object) : Object {
  let result: Object;
  let keys = Object.keys(params);

  keys.forEach(function (value : string, index : number, array : string[]) {
    if (params[value] === undefined) {
      return;
    }
    if (!result)
      result = new Object();
    
    result[value] = params[value];
  });

  return result;
}

export function makeInsertExpr(params : Array < Array < string >>) {
  let result : string[] = [];
  params.forEach(function (value : string[], index : number, array : string[][]) {
    let expr = '(' + value.join(',') + ')';
    result.push(expr);
  });

  return result.join(',');
}

export function makeQuery(sql : string, values : any[]) {
  return mysql.format(sql, values);
}

export {IConnection} from 'mysql';
