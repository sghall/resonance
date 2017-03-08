// @flow weak

import React, { PropTypes } from 'react';
import { Table, TableRow, TableCell, TableBody } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import { AGES } from '../module/constants';

export default function Legend({ sortKey, setSortKey }) {
  return (
    <Paper>
      <Table>
        <TableBody>
          {AGES.map((age) => {
            const isSelected = age === sortKey;

            return (
              <TableRow
                hover
                onClick={() => setSortKey(age)}
                role="checkbox"
                aria-checked={isSelected}
                tabIndex="-1"
                key={age}
                selected={isSelected}
              >
                <TableCell checkbox>
                  <Checkbox checked={isSelected} />
                </TableCell>
                <TableCell padding={false}>{age}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

Legend.propTypes = {
  sortKey: PropTypes.string.isRequired,
  setSortKey: PropTypes.func.isRequired,
};
