/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import { CellOpSelection, Selections } from '@ephox/darwin';
import { Arr, Optionals } from '@ephox/katamari';
import { TableLookup } from '@ephox/snooker';
import { Attribute, Compare, SelectorFind, SugarElement, SugarElements } from '@ephox/sugar';

const getSelectionStartFromSelector = <T extends Element>(selector: string) => (start: SugarElement<Node>) =>
  SelectorFind.closest<T>(start, selector);

const getSelectionStartCaption = getSelectionStartFromSelector<HTMLTableCaptionElement>('caption');

const getSelectionStartCell = getSelectionStartFromSelector<HTMLTableCellElement>('th,td');

const getSelectionStartCellOrCaption = getSelectionStartFromSelector<HTMLTableCellElement | HTMLTableCaptionElement>('th,td,caption');

const getCellsFromSelection = (start: SugarElement<Node>, selections: Selections): SugarElement<HTMLTableCellElement>[] =>
  getSelectionStartCell(start)
    .map((_cell) => CellOpSelection.selection(selections))
    .getOr([]);

const getRowsFromSelection = (start: SugarElement<Node>, selector: string): SugarElement<HTMLTableRowElement>[] => {
  const cellOpt = getSelectionStartCell(start);
  const rowsOpt = cellOpt.bind((cell) => TableLookup.table(cell))
    .map((table) => TableLookup.rows(table));
  return Optionals.lift2(cellOpt, rowsOpt, (cell, rows) =>
    Arr.filter(rows, (row) =>
      Arr.exists(SugarElements.fromDom(row.dom.cells), (rowCell) =>
        Attribute.get(rowCell, selector) === '1' || Compare.eq(rowCell, cell)
      )
    )
  ).getOr([]);
};

export { getSelectionStartCaption, getSelectionStartCell, getSelectionStartCellOrCaption, getCellsFromSelection, getRowsFromSelection };
